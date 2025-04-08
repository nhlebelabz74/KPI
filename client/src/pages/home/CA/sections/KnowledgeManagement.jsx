import React from 'react'
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const KnowledgeManagement = () => {
  const KPI_CONFIG = [
    {
      number: "7.1.1",
      title: "Weekly Training Presentations",
      description: "A minimum of six presentations at the weekly training sessions",
      text_placeholder: "Provide details about your presentations...",
      withProgress: [
        {
          id: "completedPresentations",
          title: "Presentations Progress",
          target: 6,
          units: "presentations"
        }
      ]
    },
    {
      number: "7.1.2",
      title: "Precedents",
      description: "Working on or updating a minimum of at least three precedents",
      text_placeholder: "Provide details about the precedents you've worked on...",
      withProgress: [
        {
          id: "completedPrecedents",
          title: "Precedents Progress",
          target: 3,
          units: "precedents"
        }
      ]
    },
    {
      number: "7.1.3",
      title: "Professional Knowledge",
      description: "Has basic knowledge of Attorneys Act and Code of Conduct",
      text_placeholder: "Describe your knowledge of the Attorneys Act and Code of Conduct..."
    }
  ];

  return (
    <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.KNOWLEDGE_MANAGEMENT} />
  )
}

export default KnowledgeManagement;