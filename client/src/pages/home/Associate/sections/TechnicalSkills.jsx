import React from 'react';
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const TechnicalSkills = () => {
  const KPI_CONFIG = [
    {
      number: "3.2.1",
      title: "Legal Writing",
      description: "Demonstration of legal drafting capabilities and article writing.",
      text_placeholder: "Describe your experience with legal writing, including any articles you've written with or without supervision.",
      withProgress: [
        {
          id: "articlesWritten",
          title: "Articles Written",
          target: 6,
          editable: true,
          units: "articles"
        },
        {
          id: "articlesWithCA",
          title: "Articles Written with CA Supervision",
          target: 2,
          editable: true,
          units: "articles"
        },
        {
          id: "articlesIndependent",
          title: "Articles Written Independently",
          target: 2,
          editable: true,
          units: "articles"
        }
      ]
    },
    {
      number: "3.2.2",
      title: "Sector Knowledge & Client Understanding",
      description: "Understanding of concepts in your sector and client business comprehension.",
      text_placeholder: "Describe how you've demonstrated understanding of concepts in your sector and how you've applied this understanding to client work.",
      withCheckBox: [
        {
          id: "sectorUnderstanding",
          label: "Sector Understanding",
          description: "Demonstrates understanding of concepts in your sector"
        },
        {
          id: "clientBusinessUnderstanding",
          label: "Client Business Understanding",
          description: "Understands the client's business and uses this knowledge to produce commercial documents"
        },
        {
          id: "regulatoryKnowledge",
          label: "Regulatory Understanding",
          description: "Demonstrates understanding of client's business, regulatory environment and industry trends"
        }
      ]
    },
    {
      number: "3.2.3",
      title: "Drafting Skills",
      description: "Ability to produce effective drafts that meet client requirements and attorney expectations.",
      text_placeholder: "Provide examples of documents you've drafted that meet client commercial and legal requirements.",
      withRadioGroup: [
        {
          id: "draftingLevel",
          title: "Current Drafting Capability",
          options: [
            { value: "basic", label: "Basic - Requires substantial redrafting" },
            { value: "intermediate", label: "Intermediate - Requires moderate edits" },
            { value: "proficient", label: "Proficient - Requires minimal changes" },
            { value: "expert", label: "Expert - Ready for use with minimal review" }
          ],
          defaultValue: "intermediate"
        }
      ],
      withTextAreas: [
        {
          id: "clientCommercialRequirements",
          title: "Meeting Client Commercial Requirements",
          placeholder: "Describe how your drafts have satisfied client's commercial requirements",
          minHeight: "12"
        },
        {
          id: "attorneyInstructions",
          title: "Following Attorney Instructions",
          placeholder: "Describe how you've incorporated attorney instructions in your drafts",
          minHeight: "12"
        }
      ]
    },
    {
      number: "3.2.4",
      title: "Client Interaction & Documentation",
      description: "Taking instructions from clients and drafting various legal documents.",
      text_placeholder: "Describe your experience taking instructions from clients and drafting documents such as affidavits, witness statements, and pleadings.",
      withCheckBox: [
        {
          id: "draftAffidavits",
          label: "Draft Affidavits",
          description: "Ability to draft simple affidavits"
        },
        {
          id: "draftWitnessStatements",
          label: "Draft Witness Statements",
          description: "Ability to draft witness statements"
        },
        {
          id: "draftPleadings",
          label: "Draft Pleadings",
          description: "Ability to draft pleadings"
        }
      ]
    },
    {
      number: "3.2.5",
      title: "Dispute Resolution Knowledge",
      description: "Knowledge of various dispute resolution mechanisms and court procedures.",
      text_placeholder: "Describe your knowledge of dispute resolution rules (e.g., adjudication, arbitration) and court procedures.",
      withRadioGroup: [
        {
          id: "disputeResolutionKnowledge",
          title: "Level of Knowledge",
          options: [
            { value: "basic", label: "Basic understanding" },
            { value: "intermediate", label: "Working knowledge" },
            { value: "advanced", label: "Advanced knowledge" },
            { value: "expert", label: "Expert knowledge" }
          ],
          defaultValue: "intermediate"
        }
      ],
      withCheckBox: [
        {
          id: "afsaKnowledge",
          label: "AFSA Knowledge",
          description: "Knowledge of AFSA rules"
        },
        {
          id: "aasaKnowledge",
          label: "AASA Knowledge",
          description: "Knowledge of AASA rules"
        },
        {
          id: "uncitrailKnowledge",
          label: "UNCITRAL Knowledge",
          description: "Knowledge of UNCITRAL rules"
        },
        {
          id: "courtProcedures",
          label: "Court Procedures",
          description: "Knowledge of court procedures"
        },
        {
          id: "transactionUnderstanding",
          label: "Other Side Understanding",
          description: "Understands the other side of the transaction or dispute"
        }
      ]
    },
    {
      number: "3.2.6",
      title: "Professional Development & Firm Knowledge",
      description: "Knowledge of firm procedures and commitment to personal development.",
      text_placeholder: "Describe how you build technical knowledge and contribute to department improvement.",
      withCheckBox: [
        {
          id: "firmKnowledge",
          label: "Firm Knowledge",
          description: "Knows firm and department strategy and how own role contributes"
        },
        {
          id: "lnpProcedures",
          label: "LNP Procedures",
          description: "Knows LNP's procedures/approach/products and uses daily experience to increase knowledge"
        },
        {
          id: "precedentUsage",
          label: "Precedent Usage",
          description: "Drafts effective documents using precedents where appropriate"
        },
        {
          id: "technicalKnowledgeBuilding",
          label: "Knowledge Building",
          description: "Builds technical knowledge through both structures and informal learning"
        }
      ]
    },
    {
      number: "3.2.7",
      title: "Innovation & Strategic Contribution",
      description: "Contribution to department improvement and strategic initiatives.",
      text_placeholder: "Describe how you contribute ideas to help the department improve and innovate, and your involvement in strategic initiatives.",
      withProgress: [
        {
          id: "improvementIdeas",
          title: "Improvement Ideas Contributed",
          target: 3,
          editable: true,
          units: "ideas"
        }
      ],
      withCheckBox: [
        {
          id: "departmentImprovement",
          label: "Department Improvement",
          description: "Contributes ideas to help the department improve and innovate"
        },
        {
          id: "strategicInitiatives",
          label: "Strategic Initiatives",
          description: "Contributes to strategic initiatives and projects through active involvement"
        },
        {
          id: "ethicalIssues",
          label: "Ethical Awareness",
          description: "Identifies potential ethical issues and consults with appropriate stakeholders"
        }
      ]
    },
    {
      number: "3.2.8",
      title: "Client Service Excellence",
      description: "Meeting and exceeding client expectations.",
      text_placeholder: "Describe examples of how you have exceeded client expectations and received positive feedback.",
      withRadioGroup: [
        {
          id: "clientFeedback",
          title: "Client Feedback Level",
          options: [
            { value: "needsImprovement", label: "Needs Improvement" },
            { value: "meetsExpectations", label: "Meets Expectations" },
            { value: "exceedsExpectations", label: "Exceeds Expectations" },
            { value: "exceptional", label: "Exceptional" }
          ],
          defaultValue: "meetsExpectations"
        }
      ],
      withTextAreas: [
        {
          id: "clientFeedbackExamples",
          title: "Client Feedback Examples",
          placeholder: "Provide specific examples of positive client feedback you've received",
          minHeight: "12"
        },
        {
          id: "clientPriorities",
          title: "Addressing Client Priorities",
          placeholder: "Describe how you've tailored solutions to respond to client's priorities and business challenges",
          minHeight: "12"
        }
      ]
    },
    {
      number: "3.2.9",
      title: "Technical Advice & Guidance",
      description: "Providing commercial and technical advice and knowing when to seek guidance.",
      text_placeholder: "Describe how you apply technical and sector knowledge and know when to seek guidance.",
      withCheckBox: [
        {
          id: "technicalAdvice",
          label: "Technical Advice",
          description: "Provides strong broad commercial and technical advice, drawing on past cases and experience"
        },
        {
          id: "seekGuidance",
          label: "Seeks Guidance",
          description: "Knows when to seek guidance on technical matters"
        }
      ]
    }
  ];

  return (
    <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.TECHNICAL_SKILLS}/>
  )
}

export default TechnicalSkills;