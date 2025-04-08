import React from 'react'
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const KnowledgeManagement = () => {
  const KPI_CONFIG = [
    {
      number: "7.3.1",
      title: "Weekly Training Presentations",
      description: "A minimum of four internal presentations at the weekly training sessions",
      text_placeholder: "Provide details about your presentations...",
      withProgress: [
        {
          id: "completedPresentations",
          title: "Presentations Progress",
          target: 4,
          units: "presentations"
        }
      ]
    },
    {
      number: "7.3.2",
      title: "Supervising Associate Presentations",
      description: "A minimum of four internal presentations in which the senior associate has supervised the associates presenting",
      text_placeholder: "Provide details about the associate presentations you supervised...",
      withProgress: [
        {
          id: "supervisedAssociatePresentations",
          title: "Supervised Associate Presentations",
          target: 4,
          units: "supervised presentations"
        }
      ]
    },
    {
      number: "7.3.3",
      title: "Supervising CA Presentations",
      description: "A minimum of four internal presentations in which the senior associate has supervised the CAs presenting",
      text_placeholder: "Provide details about the CA presentations you supervised...",
      withProgress: [
        {
          id: "supervisedCAPresentations",
          title: "Supervised CA Presentations",
          target: 4,
          units: "supervised CA presentations"
        }
      ]
    },
    {
      number: "7.3.4",
      title: "Precedents with CA/Associate",
      description: "Working on or updating a minimum of four precedents with a CA and/or associate",
      text_placeholder: "Provide details about the precedents you've worked on with CAs and/or associates...",
      withProgress: [
        {
          id: "completedPrecedents",
          title: "Precedents Progress",
          target: 4,
          units: "precedents"
        }
      ]
    }
  ];

  return (
    <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.KNOWLEDGE_MANAGEMENT} />
  )
}

export default KnowledgeManagement;