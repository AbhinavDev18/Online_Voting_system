import Admin from './models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Voter from './models/Voter.js';
import { sendEmail } from './Functions/sendEmail.js';
import Candidate from './models/Candidate.js';
import Vote from './models/Vote.js';
import uploadToCloudinary from './Functions/uploadCloudinary.js';
import Election from './models/Election.js';
import scheduleElectionStop from "./Functions/scheduleElectionStop.js";

const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if(!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const validPassword = await bcrypt.compare(password, admin.password);
        if(!validPassword) {
            return res.status(404).json({error: "Invalid password"});
        }
        const tokenData = {
            id: admin._id,
            username: admin.username,
            role: admin.role
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        };
        return res.status(200).cookie('admin', token, options).json({user: tokenData, message: "Admin logged in successfully"});
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

const adminData = async (req, res) => {
    try {
        const token = req.cookies.admin;
        if(!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const admin = await Admin.findById(decoded.id);
        if(!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        return res.status(200).json({ admin });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

const voterLogin = async (req, res) => {
  const { voterId } = req.body;
  try {
    const voter = await Voter.findOne({ voterId });
    if (!voter) return res.status(401).json({ message: "Invalid Voter ID" });
    await sendEmail(voter._id, voter.email);
    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const { voterId } = req.params;
    const voter = await Voter.findOne({ voterId });
    if (!voter) return res.status(401).json({ message: "Invalid Voter ID" });

    if (!voter.verifyOTP || voter.verifyOTP !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const tokenData = {
      id: voter._id,
      voterId: voter.voterId,
      name: voter.name,
      phoneNumber: voter.phoneNumber,
      email: voter.email,
      aadharNumber: voter.aadharNumber,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "15m" });

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    voter.verifyOTP = undefined;
    await voter.save();

    return res
      .status(200)
      .cookie("voter", token, options)
      .json({ user: tokenData, message: "OTP verified, voter logged in successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

const voterData = async (req, res) => {
    try {
        const token = req.cookies.voter;
        if(!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const voter = await Voter.findById(decoded.id);
        if(!voter) {
            return res.status(404).json({ message: 'Voter not found' });
        }
        return res.status(200).json({ voter });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

const voterLogout = async (req, res) => {
    try {
        res.clearCookie('voter');
        return res.status(200).json({ message: 'Voter logged out successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

const adminLogout = async (req, res) => {
    try {
        res.clearCookie('admin');
        return res.status(200).json({ message: 'Admin logged out successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

const electionStats = async (req, res) => {
    try {
        const token = req.cookies.admin;
        if(!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        if(!decoded) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const totalVoters = await Voter.countDocuments().exec();
        const totalCandidates = await Candidate.countDocuments({ isActive: true }).exec();
        const votesCast = await Vote.countDocuments().exec();
        const turnoutRate = totalVoters > 0 ? (votesCast / totalVoters) * 100 : 0;
        return res.status(200).json({ totalCandidates, totalVoters, votesCast, turnoutRate });
    }
    catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

const getAllVoters = async (req, res) => {
    try {
        const token = req.cookies.admin;
        if(!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        if(!decoded) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const voteres = await Voter.find().lean();
        return res.status(200).json({ voteres });
    }
    catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

const addNewVoters = async (req, res) => {
    try {
        const token = req.cookies.admin;
        if(!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        if(!decoded) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const voterData = req.body;
        const existingVoter = await Voter.findOne({ voterId: voterData.voterId });
        if(existingVoter) {
            return res.status(400).json({ message: 'Voter with this Voter ID already exists' });
        }
        const newVoter = new Voter(voterData);
        await newVoter.save();
        return res.status(201).json({ message: 'Voter added successfully', voter: newVoter });
    }
    catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

const getAllCandidates = async (req, res) => {
    try {
        const token = req.cookies.admin;
        if(!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        if(!decoded) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const candidates = await Candidate.find().lean();
        return res.status(200).json({ candidates });
    }
    catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

const addNewCandidate = async (req, res) => {
    try {
        const token = req.cookies.admin;
        if(!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        if(!decoded) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const candidateData = req.body;
        const candidate = await Candidate.findOne({ candidateId: candidateData.candidateId });
        if(candidate) {
            return res.status(400).json({ message: 'Candidate with this Candidate ID already exists' });
        }
        let photoUrl = '';
        if(req.file) {
            const buffer = req.file.buffer;
            photoUrl = await uploadToCloudinary(buffer, 'candidates');
        }
        const newCandidate = new Candidate({ ...candidateData, photoUrl });
        await newCandidate.save();
        return res.status(201).json({ message: 'Candidate added successfully', candidate: newCandidate });
    }
    catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

const getCurrentElection = async (req, res) => {
    try {
        const election = await Election.findOne({ phase: "voting", isActive: true }).sort({ createdAt: -1 }).lean();
        if(!election) {
            return res.status(404).json({ message: 'No active election found' });
        }
        return res.status(200).json({ election });
    }
    catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

const getElectionResults = async (req, res) => {
    try {
        const electionId = req.params.electionId;
        const election = await Election.findOne({ electionId }).lean();
        if(election && !election.resultReleased){
            const token = req.cookies.admin;
            if(!token) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            if(!decoded) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }
        if(!election || election.isActive) {
            return res.status(404).json({ message: 'Election not found' });
        }
        const results = await Vote.aggregate([
            { $match: { electionId: electionId } },
            { $group: { _id: "$candidateId", voteCount: { $sum: 1 } } },
            { $lookup: { from: "candidates", localField: "_id", foreignField: "candidateId", as: "candidateDetails" } },
            { $unwind: "$candidateDetails" },
            { $project: { _id: 0, candidateId: "$candidateDetails.candidateId", name: "$candidateDetails.name", party: "$candidateDetails.party", voteCount: 1 } },
            { $sort: { voteCount: -1 } }
        ]);
        return res.status(200).json({ election, results });
    }
    catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

const startElection = async (req, res) => {
  try {
    const token = req.cookies.admin;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!decoded) return res.status(403).json({ message: "Forbidden" });

    const { electionId, name, description, startDate, startTime, endDate, endTime } = req.body;

    const activeElection = await Election.findOne({ isActive: true });
    if (activeElection) {
      return res.status(400).json({ message: "An election is already active" });
    }

    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${endDate}T${endTime}:00`);

    const newElection = new Election({
      electionId,
      title: name,
      description,
      startDateTime,
      endDateTime,
      phase: "voting",
      isActive: true,
    });

    await newElection.save();

    scheduleElectionStop(electionId, endDateTime);

    return res.status(201).json({ message: "Election started successfully", election: newElection });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const stopElection = async (req, res) => {
    try {
        const token = req.cookies.admin;
        if(!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        if(!decoded) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const electionId = req.params.electionId;
        const election = await Election.findOne({ electionId });
        if(!election || !election.isActive) {
            return res.status(404).json({ message: 'Election not found or already inactive' });
        }
        election.phase = 'completed';
        election.isActive = false;
        await election.save();
        return res.status(200).json({ message: 'Election stopped successfully', election });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Server error' });
    }
}

const votesCast = async (req, res) => {
  try {
    const token = req.cookies.voter;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const voterId = decoded.voterId;

    const voter = await Voter.findOne({ voterId });
    if (!voter) return res.status(404).json({ message: "Voter not found" });

    if(voter.votedElections.includes(req.params.electionId)) {
      return res.status(400).json({ message: "You have already voted in this election" });
    }

    const electionId = req.params.electionId;
    const election = await Election.findOne({ electionId });

    // ✅ Check expiry
    if (new Date() > election.endDateTime) {
      election.phase = "completed";
      election.isActive = false;
      await election.save();
      return res.status(400).json({ message: "Election has ended" });
    }

    if (!election || !election.isActive || election.phase !== "voting") {
      return res.status(400).json({ message: "No active election found" });
    }

    if (voter.votedElections.includes(electionId)) {
      return res.status(400).json({ message: "You have already voted in this election" });
    }

    const { candidateId } = req.body;
    const candidate = await Candidate.findOne({ candidateId, isActive: true });
    if (!candidate && candidateId) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const newVote = new Vote({
      voteId: `${voterId}-${election._id}-${Date.now()}`,
      encryptedVote: candidateId ? `encrypted-${candidateId}-${voterId}` : "blank-vote",
      electionId: electionId,
      candidateId: candidate ? candidateId : null,
      timestamp: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress || "unknown",
      userAgent: req.get("User-Agent") || "unknown",
    });

    await newVote.save();
    voter.votedElections.push(election._id);
    await voter.save();

    const receiptId = `${voterId}-${election._id}-${Date.now()}`;

    return res.status(201).json({ message: "Vote cast successfully", receiptId, vote: newVote });
  } catch (error) {
    return res.status(500).json({ error: "Server error", message: error.message });
  }
};

const getCompletedElections = async (req, res) => {
    try {
        const token = req.cookies.admin;
        if(!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        if(!decoded) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const elections = await Election.find({ phase: 'completed', isActive: false }).sort({ endDateTime: -1 }).lean();
        return res.status(200).json({ elections });
    }
    catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

const releaseResult = async (req, res) => {
  try {
    const { electionId } = req.params;
    const election = await Election.findOne({ electionId });

    if (!election)
      return res.status(404).json({ message: 'Election not found' });

    election.resultReleased = true;
    await election.save();

    res.json({ message: 'Result released successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllElections = async (req, res) => {
    try {
        const token = req.cookies.admin;
        if(!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        if(!decoded) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const elections = await Election.find().sort({ createdAt: -1 }).lean();
        return res.status(200).json({ elections });
    }
    catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

export { adminLogin, adminData, voterLogin, verifyOtp, voterData, voterLogout, adminLogout, electionStats, getAllVoters, addNewVoters, getAllCandidates, addNewCandidate, getCurrentElection, getElectionResults, startElection, stopElection, votesCast, getCompletedElections, releaseResult, getAllElections };
