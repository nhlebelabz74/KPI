import React from 'react';
import { KPI_Types, KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const TechnicalSkills = () => {
  const KPI_CONFIG = [
    {
      number: "3.4.1",
      title: "Article Supervision",
      description: "Supervises at least seven articles a year",
      text_placeholder: "Provide details about the articles supervised and your role...",
      withProgress: [
        {
          id: "articles_supervised",
          title: "Articles Supervised Annually",
          target: 7,
          editable: true,
          units: "articles"
        }
      ]
    },
    {
      number: "3.4.2",
      title: "Expert Recognition",
      description: "Recognised widely as an expert in field with depth of knowledge and experience",
      text_placeholder: "Describe evidence of your expert recognition (publications, speaking engagements, citations, etc.)...",
      withRadioGroup: [
        {
          id: "expertise_recognition",
          title: "Level of Recognition",
          description: "Assessment of your recognition as an expert in your field",
          options: [
            { label: "Developing recognition", value: "developing" },
            { label: "Recognized within firm", value: "internal" },
            { label: "Recognized in local market", value: "local" },
            { label: "Widely recognized in industry", value: "wide" }
          ],
          defaultValue: "internal"
        }
      ]
    },
    {
      number: "3.4.3",
      title: "Business Thinking",
      description: "Demonstrates broad business thinking and sound commercial judgement, adding value for clients",
      text_placeholder: "Provide specific examples of how your business thinking has added value for clients...",
      withTextAreas: [
        {
          id: "client_value_examples",
          title: "Client Value Examples",
          placeholder: "Describe specific cases where your commercial judgment has directly benefited clients...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "3.4.4",
      title: "Technical Expertise",
      description: "Applies technical expertise and sector knowledge to deliver the most complex work",
      text_placeholder: "Describe how you've applied your expertise to complex cases...",
      withTextAreas: [
        {
          id: "complex_work_examples",
          title: "Complex Work Examples",
          placeholder: "Detail specific complex matters you've handled and how your expertise was critical to success...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "3.4.5",
      title: "Knowledge Sharing",
      description: "Actively shares knowledge to contribute to the intellectual capital of the firm",
      text_placeholder: "Provide examples of your knowledge sharing activities and initiatives...",
      withCheckBox: [
        {
          id: "internal_training",
          label: "Conducts Internal Training",
          description: "Regularly conducts training sessions for colleagues"
        },
        {
          id: "mentorship",
          label: "Mentors Junior Staff",
          description: "Provides ongoing mentorship to develop talent"
        },
        {
          id: "knowledge_resources",
          label: "Creates Knowledge Resources",
          description: "Develops precedents, guides, or other knowledge resources"
        }
      ]
    },
    {
      number: "3.4.6",
      title: "Technical Role Model",
      description: "A technical role model with strong knowledge of other key areas",
      text_placeholder: "Describe how you demonstrate technical leadership across multiple areas...",
      withRadioGroup: [
        {
          id: "cross_discipline_knowledge",
          title: "Cross-Disciplinary Knowledge",
          description: "Assessment of your knowledge across related practice areas",
          options: [
            { label: "Knowledge primarily in own area", value: "limited" },
            { label: "Good knowledge of related areas", value: "good" },
            { label: "Strong knowledge across key areas", value: "strong" },
            { label: "Comprehensive cross-disciplinary expertise", value: "comprehensive" }
          ],
          defaultValue: "good"
        }
      ]
    },
    {
      number: "3.4.7",
      title: "Innovation Leadership",
      description: "Influences, shapes and implements innovative new legal initiatives",
      text_placeholder: "Describe innovative initiatives you've led or significantly contributed to...",
      withRadioGroup: [
        {
          id: "innovation_contribution",
          title: "Innovation Contribution",
          description: "Level of contribution to innovative initiatives",
          options: [
            { label: "Supports initiatives led by others", value: "supports" },
            { label: "Contributes significantly to initiatives", value: "contributes" },
            { label: "Shapes and influences initiatives", value: "shapes" },
            { label: "Leads implementation of innovations", value: "leads" }
          ],
          defaultValue: "contributes"
        }
      ],
      withTextAreas: [
        {
          id: "innovation_examples",
          title: "Innovation Examples",
          placeholder: "Provide specific examples of legal initiatives you've influenced or implemented...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "3.4.8",
      title: "Strategic Alignment",
      description: "Reinforces department business plan by ensuring new work, as its delivery, first with the strategy",
      text_placeholder: "Explain how you ensure your work aligns with departmental strategy...",
      withCheckBox: [
        {
          id: "strategic_client_selection",
          label: "Strategic Client Selection",
          description: "Prioritizes clients aligned with firm strategy"
        },
        {
          id: "matter_alignment",
          label: "Matter Alignment",
          description: "Ensures matters taken on align with department goals"
        },
        {
          id: "business_development",
          label: "Strategic Business Development",
          description: "Pursues business development in targeted strategic areas"
        }
      ]
    }
  ];

  return (
    <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.TECHNICAL_SKILLS} />
  );
}

export default TechnicalSkills;