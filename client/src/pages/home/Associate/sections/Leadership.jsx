import LeadershipBase from "../../LeadershipBase";

// Associate Leadership Page
const Leadership = () => {
  const criteria = [
    "Demonstrates perseverance and honesty in the face of challenges",
    "Evaluates own performance and seeks feedback to address development issues",
    "Takes personal responsibility for learning and drives improvements in performance"
  ];

  return <LeadershipBase role="Associate" criteria={criteria} />;
};

export default Leadership;