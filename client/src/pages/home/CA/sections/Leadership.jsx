import LeadershipBase from "../../LeadershipBase";

// Candidate Attorney Leadership Page
const Leadership = () => {
  const criteria = [
    "Demonstrates ownership of tasks, referring to supervisor for guidance in line with department expectations",
    "Seeks and accepts feedback to inform learning logs/personal development planning",
    "Demonstrates initiative, implements learning quickly and takes action",
    "Takes responsibility for performance, initiating regular progress conversations"
  ];

  return <LeadershipBase role="Candidate Attorney" criteria={criteria} />;
};

export default Leadership;