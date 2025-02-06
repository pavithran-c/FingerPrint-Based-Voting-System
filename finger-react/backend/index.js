const express = require("express");
const multer = require("multer");
const path = require("path");
const { exec } = require("child_process");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const PORT = 3003;
app.use(cors());

const upload = multer({
  dest: path.join(__dirname, "../finger-check/uploads"),
});

// MongoDB Connection URL
const url = "mongodb://localhost:27017";
const dbName = "voting_system";
let db;

// Connect to MongoDB
MongoClient.connect(url)
  .then(client => {
    console.log("Connected to MongoDB");
    db = client.db(dbName);
  })
  .catch(err => console.error("MongoDB connection error:", err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const { Schema } = require('mongoose');

// Admin Schema
const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fingerprint_hash: {
    type: String,
    required: true
  }
});

// Voter Schema
const voterSchema = new Schema({
  voter_unique_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  fingerprint_hash: {
    type: String,
    required: true
  },
  has_voted: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Candidate Schema
const candidateSchema = new Schema({
  candidate_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  party: {
    type: String,
    required: true
  },
  vote_count: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Vote Schema (if you want to track individual votes)
const voteSchema = new Schema({
  voter_id: {
    type: String,
    required: true,
    unique: true
  },
  candidate_id: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});


// Admin login endpoint
app.post("/api/admin", upload.single("fingerprint"), async (req, res) => {
  const { name, password } = req.body;
  const fingerprintFile = req.file ? req.file.path : null;

  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }

  try {
    const admin = await db.collection("admin").findOne({ username: name });
    
    if (!admin) {
      return res.status(400).json({ error: "User not found" });
    }

    if (password !== admin.password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (fingerprintFile) {
      const pythonScriptPath = path.join(__dirname, "../finger-check/check.py");
      const storedFingerprintHash = admin.fingerprint_hash.toLowerCase();

      exec(
        `python ${pythonScriptPath} "${fingerprintFile}" "${storedFingerprintHash}"`,
        (error, stdout, stderr) => {
          if (error || stderr) {
            return res.status(500).json({ error: "Fingerprint comparison failed" });
          }

          if (stdout.trim() === "MATCH") {
            return res.status(200).json({ message: "Login successful", redirect: "/admin-board" });
          } else {
            return res.status(401).json({ error: "Fingerprint does not match" });
          }
        }
      );
    } else {
      return res.status(200).json({ message: "Login successful", redirect: "/admin-board" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Database query failed" });
  }
});

// Insert voter endpoint
app.post("/api/insert", upload.single("fingerprint"), async (req, res) => {
  const { name, dob } = req.body;
  const fingerprintFile = req.file ? req.file.path : null;

  if (!name || !dob || !fingerprintFile) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const pythonScriptPath = path.join(__dirname, "../finger-check/generate_hash.py");

    exec(`python ${pythonScriptPath} "${fingerprintFile}"`, async (error, stdout, stderr) => {
      if (error || stderr) {
        return res.status(500).json({ error: "Fingerprint processing failed" });
      }

      const fingerprintHash = stdout.trim();
      const lastVoter = await db.collection("voter")
        .find()
        .sort({ voter_unique_id: -1 })
        .limit(1)
        .toArray();

      let newVoterId;
      if (lastVoter.length === 0) {
        newVoterId = "ind001";
      } else {
        const lastVoterId = lastVoter[0].voter_unique_id;
        const numericPart = parseInt(lastVoterId.slice(3));
        const newNumericPart = (numericPart + 1).toString().padStart(3, "0");
        newVoterId = `ind${newNumericPart}`;
      }

      const result = await db.collection("voter").insertOne({
        voter_unique_id: newVoterId,
        name,
        dob,
        fingerprint_hash: fingerprintHash
      });

      return res.status(200).json({
        message: "Voter inserted successfully",
        voter_unique_id: newVoterId,
      });
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to insert voter" });
  }
});

// Voting endpoints
app.post("/api/fetch-voter-details", async (req, res) => {
  const { voterID } = req.body;
  
  if (!voterID) {
    return res.status(400).json({ error: "Voter ID is required" });
  }

  try {
    const voter = await db.collection("voter").findOne({ voter_unique_id: voterID });
    
    if (!voter) {
      return res.status(404).json({ error: "Voter not found" });
    }

    res.status(200).json({
      voterDetails: {
        voter_unique_id: voter.voter_unique_id,
        name: voter.name,
        dob: voter.dob,
        fingerprint_hash: voter.fingerprint_hash,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/api/vote", async (req, res) => {
  const { candidateID } = req.body;

  if (!candidateID) {
    return res.status(400).json({ error: "Candidate ID is required" });
  }

  try {
    const result = await db.collection("candidates").updateOne(
      { candidate_id: candidateID },
      { $inc: { vote_count: 1 } }
    );

    return res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update vote count" });
  }
});

app.get("/api/get-votes", async (req, res) => {
  try {
    const candidates = await db.collection("candidates")
      .find({}, { projection: { name: 1, party: 1, vote_count: 1 } })
      .toArray();
    
    res.status(200).json({ candidates });
  } catch (error) {
    return res.status(500).json({ error: "Database query failed" });
  }
});

app.delete("/api/delete-voter/:voter_unique_id", async (req, res) => {
  const voter_unique_id = req.params.voter_unique_id;

  try {
    const result = await db.collection("voter").deleteOne({ voter_unique_id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Voter not found." });
    }

    res.json({ message: "Voter successfully deleted." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete voter." });
  }
});
// Endpoint: Verify Fingerprint
app.post(
  "/api/verify-fingerprint",
  upload.single("fingerprint"),
  (req, res) => {
    const fingerprintFile = req.file ? req.file.path : null;
    const fingerprintHash = req.body.fingerprint_hash;
    if (!fingerprintFile || !fingerprintHash) {
      return res
        .status(400)
        .json({ error: "Fingerprint file or hash is missing" });
    }
    const pythonScriptPath = path.join(__dirname, "../finger-check/check.py");

    exec(
      `python ${pythonScriptPath} "${fingerprintFile}" "${fingerprintHash.toLowerCase()}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Python script: ${error.message}`);
          return res
            .status(500)
            .json({ error: "Fingerprint comparison failed" });
        }
        if (stderr) {
          console.error(`Python script stderr: ${stderr}`);
          return res
            .status(500)
            .json({ error: "Fingerprint comparison failed" });
        }

        if (stdout.trim() === "MATCH") {
          res.status(200).json({ message: "Fingerprint matches" });
        } else {
          res.status(401).json({ message: "Fingerprint does not match" });
        }
      }
    );
  }
);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});