import React from 'react';
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const TechnicalSkills = () => {
  const KPI_CONFIG = [
    {
      number: "3.3.1",
      title: "Article Supervision & Self-Directed Work",
      description: "Demonstrates ability to both supervise and produce work independently",
      text_placeholder: "Provide details about the articles you supervise and those you handle independently...",
      withProgress: [
        {
          id: "articles_supervised_ca",
          title: "Articles Supervised with CA",
          target: 2,
          editable: true,
          units: "articles"
        },
        {
          id: "articles_supervised_associate",
          title: "Articles Supervised with Associate",
          target: 1,
          editable: true,
          units: "articles"
        },
        {
          id: "articles_self_directed",
          title: "Self-Directed Articles (Director Checked)",
          target: 3,
          editable: true,
          units: "articles"
        }
      ]
    },
    {
      number: "3.3.2",
      title: "Independent Work Capability",
      description: "Ability to work with minimal supervision across various aspects of legal work",
      text_placeholder: "Describe your level of independence in handling client matters...",
      withCheckBox: [
        {
          id: "minimal_supervision_drafts",
          label: "Produces Client-Ready Drafts",
          description: "Able to produce drafts that go to client with minimal director input"
        },
        {
          id: "translates_requirements",
          label: "Translates Client Requirements",
          description: "Effectively translates client's legal and commercial requirements into workable legal agreements"
        },
        {
          id: "runs_matters",
          label: "Runs Matters Independently",
          description: "Capable of running a matter with limited supervision from a director"
        },
        {
          id: "conducts_consultations",
          label: "Conducts Independent Consultations",
          description: "Able to conduct consultations with limited to no director involvement"
        }
      ],
      withTextAreas: [
        {
          id: "independence_examples",
          title: "Examples of Independent Work",
          placeholder: "Provide specific examples of matters you've handled with minimal supervision...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "3.3.3",
      title: "Professional Recognition",
      description: "Recognition of technical skill by peers and clients",
      text_placeholder: "Describe instances where your technical skill has been recognized...",
      withCheckBox: [
        {
          id: "peer_recognition",
          label: "Peer Recognition",
          description: "Recognized by peers as having requisite technical skill through referrals and client introductions"
        },
        {
          id: "client_direct_instructions",
          label: "Direct Client Instructions",
          description: "Receives independent instructions from firm clients who have worked with you previously"
        }
      ],
      withTextAreas: [
        {
          id: "recognition_examples",
          title: "Recognition Examples",
          placeholder: "Provide specific examples of referrals, client introductions, or direct instructions received...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "3.3.4",
      title: "Strategic & Creative Thinking",
      description: "Ability to contribute strategically and think creatively on matters",
      text_placeholder: "Provide examples of your strategic and creative contributions...",
      withCheckBox: [
        {
          id: "strategy_assistance",
          label: "Strategic Assistance",
          description: "Provides valuable assistance with strategy on matters"
        },
        {
          id: "creative_problem_solving",
          label: "Creative Problem Solving",
          description: "Thinks creatively and laterally to help solve difficult problems"
        }
      ],
      withTextAreas: [
        {
          id: "strategic_thinking_examples",
          title: "Strategic Thinking Examples",
          placeholder: "Describe specific situations where you've contributed strategically or solved problems creatively...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "3.3.5",
      title: "Breadth of Legal Knowledge",
      description: "Maintains broad legal knowledge beyond specialization",
      text_placeholder: "Describe how you maintain and apply broad legal knowledge...",
      withRadioGroup: [
        {
          id: "legal_breadth",
          title: "Breadth of Legal Knowledge",
          description: "Assessment of your knowledge across different areas of law",
          options: [
            { label: "Focused primarily on specialization", value: "specialized" },
            { label: "Some knowledge of related areas", value: "related" },
            { label: "Good general knowledge across areas", value: "general" },
            { label: "Broad knowledge including impacts across areas", value: "broad" }
          ],
          defaultValue: "related"
        }
      ],
      withCheckBox: [
        {
          id: "maintains_breadth",
          label: "Maintains Breadth Despite Specialization",
          description: "Keeps breadth of view despite specialization"
        }
      ]
    },
    {
      number: "3.3.6",
      title: "Commercial Awareness",
      description: "Considers commercial impact when applying technical expertise",
      text_placeholder: "Describe how you incorporate commercial considerations into your legal advice...",
      withRadioGroup: [
        {
          id: "commercial_awareness",
          title: "Commercial Impact Consideration",
          description: "Level of commercial awareness in technical decisions",
          options: [
            { label: "Primarily focused on legal aspects", value: "legal_focus" },
            { label: "Considers basic commercial implications", value: "basic" },
            { label: "Regularly incorporates commercial factors", value: "regular" },
            { label: "Fully integrates commercial and legal analysis", value: "integrated" }
          ],
          defaultValue: "regular"
        }
      ],
      withTextAreas: [
        {
          id: "commercial_examples",
          title: "Commercial Awareness Examples",
          placeholder: "Provide examples of how you've considered commercial impact in your work...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "3.3.7",
      title: "Innovation & Change Adaptation",
      description: "Creates innovative solutions and embraces business change",
      text_placeholder: "Describe your approach to innovation and business change...",
      withCheckBox: [
        {
          id: "embraces_change",
          label: "Embraces Business Change",
          description: "Embraces business change and supports its implementation"
        },
        {
          id: "proposes_innovations",
          label: "Proposes Innovative Solutions",
          description: "Creates and proposes innovative approaches and solutions in response to client and pricing demands"
        }
      ],
      withTextAreas: [
        {
          id: "innovation_examples",
          title: "Innovation Examples",
          placeholder: "Provide specific examples of innovative solutions you've developed or business changes you've supported...",
          minHeight: "16"
        }
      ]
    }
  ];

  return (
    <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.TECHNICAL_SKILLS} />
  )
}

export default TechnicalSkills;