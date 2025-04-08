import React from 'react';
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const FirmDevelopment = () => {
  const KPI_CONFIG = [
    {
      number: "6.3.1",
      title: "Assisting with External Seminars",
      description: "Assisting with at least two external seminars",
      text_placeholder: "Provide details about the external seminars you assisted with...",
      withProgress: [
        {
          id: "assistedSeminars",
          title: "Assisted Seminars Progress",
          target: 2,
          units: "seminars",
        }
      ]
    },
    {
      number: "6.3.2",
      title: "Presenting at External Seminars",
      description: "Presenting at a minimum of two external seminars",
      text_placeholder: "Provide details about the external seminars you presented at...",
      withProgress: [
        {
          id: "presentedSeminars",
          title: "Presented Seminars Progress",
          target: 2,
          units: "seminars",
        }
      ]
    },
    {
      number: "6.3.3",
      title: "Participating in Firm Initiatives",
      description: "Participating in at least four firm initiatives",
      text_placeholder: "Provide details about the firm initiatives you participated in...",
      withProgress: [
        {
          id: "participatedInitiatives",
          title: "Firm Initiatives Participation",
          target: 4,
          units: "initiatives",
        }
      ]
    },
    {
      number: "6.3.4",
      title: "Suggesting and Leading Firm Initiatives",
      description: "Suggesting at least one firm initiative which is taken up by the firm and which you take control of. Consistently delivers high quality work, sets high quality expectations internally and uses client engagement opportunities to deepen understanding of client's quality expectations.",
      text_placeholder: "Provide details about firm initiatives you suggested and led...",
      withProgress: [
        {
          id: "suggestedInitiatives",
          title: "Suggested Initiatives",
          target: 1,
          units: "initiatives",
        }
      ],
      withTextAreas: [
        {
          id: "workQualityDetails",
          title: "Work Quality Standards",
          placeholder: "Describe how you consistently deliver high quality work, set high quality expectations internally, and use client engagement opportunities...",
          minHeight: "32"
        }
      ]
    },
    {
      number: "6.3.5",
      title: "Good Judgement Skills",
      description: "Good judgement skills, with the ability to make sound decisions even in the absence of complete information",
      text_placeholder: "Provide examples demonstrating your good judgement skills and ability to make sound decisions with incomplete information..."
    },
    {
      number: "6.3.6",
      title: "Client Process Management",
      description: "Ensures that proper processes are followed in relation to client and matter opening; escalates risk issues as appropriate",
      text_placeholder: "Provide examples of how you ensure proper processes are followed with clients and matters, and how you escalate risk issues..."
    }
  ];

  return (
    <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.FIRM_DEVELOPMENT} />
  )
}

export default FirmDevelopment;