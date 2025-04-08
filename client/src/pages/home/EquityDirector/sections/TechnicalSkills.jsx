import React from 'react'
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const TechnicalSkills = () => {
  const KPI_CONFIG = [
    {
      number: "3.5.1",
      title: "Quality Delivery",
      text_placeholder: "Provide evidence of how you consistently deliver high quality work...",
      description: "Delivers the highest levels of quality, both personally and within the department as well as across departments to ensure consistency of delivery.",
      withRadioGroup: [
        {
          id: "qualityRating",
          title: "Self-Assessment",
          defaultValue: "meets",
          options: [
            { value: "exceeds", label: "Exceeds Expectations" },
            { value: "meets", label: "Meets Expectations" },
            { value: "developing", label: "Developing" },
            { value: "improvement", label: "Needs Improvement" }
          ]
        }
      ]
    },
    {
      number: "3.5.2",
      title: "Professional Recognition",
      text_placeholder: "Provide evidence of your recognition as a leading lawyer (e.g., awards, directory listings, speaking engagements)...",
      description: "Recognised externally and internally as a leading lawyer in their area of specialism.",
      withRadioGroup: [
        {
          id: "recognitionRating",
          title: "Self-Assessment",
          defaultValue: "meets",
          options: [
            { value: "exceeds", label: "Exceeds Expectations" },
            { value: "meets", label: "Meets Expectations" },
            { value: "developing", label: "Developing" },
            { value: "improvement", label: "Needs Improvement" }
          ]
        }
      ]
    },
    {
      number: "3.5.3",
      title: "Sector Specialism",
      description: "A practice specialist who has at least one sector specialism.",
      text_placeholder: "Provide evidence of your sector specialism (e.g., clients served, matters handled, knowledge shared)...",
      withTextAreas: [
        {
          id: "sectorSpecialism",
          title: "Sector Specialism(s)",
          placeholder: "List your sector specialisms...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "3.5.4",
      title: "Legal Developments Monitoring",
      description: "Monitors legal developments to anticipate changes and prepare for their impact.",
      text_placeholder: "Describe how you monitor legal developments and prepare for their impact...",
      withRadioGroup: [
        {
          id: "legalDevelopmentsRating",
          title: "Self-Assessment",
          defaultValue: "meets",
          options: [
            { value: "exceeds", label: "Exceeds Expectations" },
            { value: "meets", label: "Meets Expectations" },
            { value: "developing", label: "Developing" },
            { value: "improvement", label: "Needs Improvement" }
          ]
        }
      ]
    },
    {
      number: "3.5.5",
      title: "Client Collaboration",
      description: "Collaborates with clients to find innovative solutions.",
      text_placeholder: "Provide examples of how you have collaborated with clients to find innovative solutions...",
      withRadioGroup: [
        {
          id: "clientCollaborationRating",
          title: "Self-Assessment",
          defaultValue: "meets",
          options: [
            { value: "exceeds", label: "Exceeds Expectations" },
            { value: "meets", label: "Meets Expectations" },
            { value: "developing", label: "Developing" },
            { value: "improvement", label: "Needs Improvement" }
          ]
        }
      ]
    },
    {
      number: "3.5.6",
      title: "Interdepartmental Relationships",
      description: "Creates strong relationships with all departments to share expertise and impart knowledge.",
      text_placeholder: "Describe how you create strong relationships with other departments and share expertise...",
      withRadioGroup: [
        {
          id: "relationshipsRating",
          title: "Self-Assessment",
          defaultValue: "meets",
          options: [
            { value: "exceeds", label: "Exceeds Expectations" },
            { value: "meets", label: "Meets Expectations" },
            { value: "developing", label: "Developing" },
            { value: "improvement", label: "Needs Improvement" }
          ]
        }
      ]
    },
    {
      number: "3.5.7",
      title: "Knowledge Sharing",
      description: "Actively promotes, engages in and embeds learning and shares knowledge across the firm.",
      text_placeholder: "Provide examples of how you promote learning and share knowledge across the firm...",
      withRadioGroup: [
        {
          id: "knowledgeSharingRating",
          title: "Self-Assessment",
          defaultValue: "meets",
          options: [
            { value: "exceeds", label: "Exceeds Expectations" },
            { value: "meets", label: "Meets Expectations" },
            { value: "developing", label: "Developing" },
            { value: "improvement", label: "Needs Improvement" }
          ]
        }
      ]
    },
    {
      number: "3.5.8",
      title: "Precedent Development",
      description: "Works closely with department to develop the most complex precedents.",
      text_placeholder: "Describe how you work with the department to develop complex precedents...",
      withRadioGroup: [
        {
          id: "precedentDevelopmentRating",
          title: "Self-Assessment",
          defaultValue: "meets",
          options: [
            { value: "exceeds", label: "Exceeds Expectations" },
            { value: "meets", label: "Meets Expectations" },
            { value: "developing", label: "Developing" },
            { value: "improvement", label: "Needs Improvement" }
          ]
        }
      ]
    }
  ];

  return (
    <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.TECHNICAL_SKILLS} />
  )
}

export default TechnicalSkills;