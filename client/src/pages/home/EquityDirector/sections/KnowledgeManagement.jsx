import React from 'react'
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const KnowledgeManagement = () => {
  const KPI_CONFIG = [
    {
      number: "7.4.1",
      title: "Weekly Training Presentations",
      description: "A minimum of two internal presentations at the weekly training sessions",
      text_placeholder: "Provide details about your presentations...",
      withProgress: [
        {
          id: "completedPresentations",
          title: "Presentations Progress",
          target: 2,
          units: "presentations"
        }
      ]
    },
    {
      number: "7.4.2",
      title: "Supervising Associate Presentations",
      description: "A minimum of two internal presentations in which the director has supervised the associates presenting",
      text_placeholder: "Provide details about the associate presentations you supervised...",
      withProgress: [
        {
          id: "supervisedAssociatePresentations",
          title: "Supervised Associate Presentations",
          target: 2,
          units: "supervised presentations"
        }
      ]
    },
    {
      number: "7.4.3",
      title: "Supervising CA Presentations",
      description: "A minimum of two internal presentations in which the senior associate has supervised the CAs presenting",
      text_placeholder: "Provide details about the CA presentations you supervised...",
      withProgress: [
        {
          id: "supervisedCAPresentations",
          title: "Supervised CA Presentations",
          target: 2,
          units: "supervised CA presentations"
        }
      ]
    },
    {
      number: "7.4.4",
      title: "Supervising All Precedents",
      description: "Supervising all precedents for sign off purposes which entails working with all juniors who drafted the precedents and co-presenting the precedent to the department",
      text_placeholder: "Provide details about how you supervise precedents, work with juniors, and co-present precedents to the department...",
      withCheckBox: [
        {
          id: "supervisingAllPrecedents",
          label: "I confirm that I am supervising all precedents for sign off purposes"
        }
      ]
    }
  ];

  return (
    <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.KNOWLEDGE_MANAGEMENT} />
  )
}

export default KnowledgeManagement;