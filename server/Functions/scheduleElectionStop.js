import schedule from "node-schedule";
import Election from "../models/Election.js";

const scheduleElectionStop = (electionId, endDateTime) => {
  schedule.scheduleJob(new Date(endDateTime), async () => {
    try {
      const election = await Election.findOne({ electionId, isActive: true });
      if (election) {
        election.phase = "completed";
        election.isActive = false;
        await election.save();
      }
    } catch (error) {
      console.error("❌ Error auto-stopping election:", error);
    }
  });
};

export default scheduleElectionStop;
