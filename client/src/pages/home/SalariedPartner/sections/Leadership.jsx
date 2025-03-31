import LeadershipBase from "../../LeadershipBase";

// Salaried Director Leadership Page
const Leadership = () => {
  const criteria = [
    "Creates a constructive environment for the department",
    "Seeks opportunities to embed department and firm strategy",
    "Identifies risk issues and takes steps to mitigate risks, seeking specialist advice when required"
  ];

  return <LeadershipBase role="Salaried Director" criteria={criteria} />;
};

export default Leadership;