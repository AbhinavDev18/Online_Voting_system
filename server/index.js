import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import { adminLogin, adminData, voterLogin, verifyOtp, voterData, voterLogout, adminLogout, electionStats, getAllVoters, addNewVoters, getAllCandidates, addNewCandidate, getCurrentElection, getElectionResults, startElection, stopElection, votesCast, getCompletedElections, releaseResult, getAllElections } from './routes.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.send("Root cause");
})
app.get("/health-check", (req, res) => {
  res.send("Hello from backend!");
});
app.post('/api/admin/login', adminLogin);
app.get('/api/admin/me', adminData);
app.post('/api/voter/login', voterLogin);
app.post('/api/voter/verify-otp/:voterId', verifyOtp);
app.get('/api/voter/me', voterData);
app.get('/api/voter/logout', voterLogout);
app.get('/api/admin/logout', adminLogout);
app.get('/api/admin/stats', electionStats);
app.get('/api/admin/voters', getAllVoters);
app.post('/api/admin/voters', addNewVoters);
app.get('/api/admin/candidates', getAllCandidates);
app.post('/api/admin/candidates', upload.single('file'), addNewCandidate);
app.get('/api/election', getCurrentElection);
app.get('/api/admin/results/:electionId', getElectionResults);
app.post('/api/admin/start', startElection);
app.post('/api/admin/stop/:electionId', stopElection);
app.post('/api/voter/cast-vote/:electionId', votesCast);
app.get('/api/admin/completed-elections', getCompletedElections);
app.post('/api/admin/release-result/:electionId', releaseResult);
app.get('/api/admin/elections', getAllElections);


// app.post('/api/admin/register', (req, res) => {
//     const { username, password } = req.body;
//     const newAdmin = new Admin({ username, password });
//     newAdmin.save()
//     .then(() => {
//         res.status(201).json({ message: 'Admin registered successfully' });
//     })
//     .catch(err => {
//         res.status(500).json({ error: 'Server error' });
//     });
// })

connectDB().then(() => {
    console.log("MongoDB has connected successfully");
    // app.listen(PORT, () => {
    //     console.log(`Server is running on port ${PORT}`);
    // });
})
.catch(err => {
    console.error("Failed to connect to the database:", err);
});

export default app;
