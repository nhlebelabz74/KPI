import LeadershipBase from "../../LeadershipBase";

// Equity Director Leadership Page
const Leadership = () => {
  const criteria = [
    "Deals promptly with risk and compliance issues, seeking specialist advice when required",
    "Contributes to change and supports its implementation",
    "Self-motivated and driven to grow specialism year-on-year",
    "Maintains prompt handling of risk/compliance issues",
    "Actively supports organizational change initiatives"
  ];

  return <LeadershipBase role="Equity Director" criteria={criteria} />;
};

export default Leadership;