import QualitativeKPISectionBase from "../../QualitativeKPISectionBase";
import { KPI_Types as types } from "@/constants";

const KnowledgeManagement = () => {
  const KPI_CONFIG = [
    {
      number: '7.2.1',
      title: 'Weekly Training Presentations',
      description: 'A minimum of eight internal presentations at the weekly training sessions',
      text_placeholder: 'Provide details about your presentations...',
      withProgress: [
        {
          id: 'presentationsProgress',
          title: 'Presentations Progress',
          target: 8 * 4, // 8 presentations per week for 4 weeks
          units: 'presentations'
        }
      ]
    },
    {
      number: '7.2.2',
      title: 'Precedents',
      description: 'Working on or updating a minimum of three precedents plus two with a candidate attorney',
      text_placeholder: 'Provide details about the precedents you\'ve worked on...',
      withProgress: [
        {
          id: 'individualPrecedents',
          title: 'Individual Precedents Progress',
          target: 3,
          units: 'precedents'
        },
        {
          id: 'candidateCollaborations',
          title: 'Candidate Attorney Collaborations',
          target: 2,
          units: 'collaborations'
        }
      ]
    },
    {
      number: '7.2.3',
      title: 'SRA Code of Conduct and Compliance',
      description: 'Understands own obligations under the SRA Code of Conduct and demonstrates awareness of risk and compliance issues in the context of day to day activities',
      text_placeholder: 'Describe your understanding of SRA Code of Conduct and how you address compliance issues...'
    }
  ];

  return (
    <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.KNOWLEDGE_MANAGEMENT}/>
  );
}

export default KnowledgeManagement;