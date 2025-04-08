import React from 'react';
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const BusinessDevelopment = () => {
  const KPI_CONFIG = [
    {
      number: "8.3.1",
      title: "Client Instructions",
      description: "Getting referral instructions and subsequent instructions from existing clients.",
      text_placeholder: "Describe how you obtain referral and subsequent instructions from clients...",
      withProgress: [
        {
          id: "referral_instructions",
          title: "Referral Instructions (Target is arbitrary)",
          target: 10,
          units: "instructions",
          editable: true
        },
        {
          id: "repeat_instructions",
          title: "Repeat Instructions from Existing Clients (Target is arbitrary)",
          target: 10,
          units: "instructions",  
          editable: true
        }
      ],
      withTextAreas: [
        {
          id: "client_instruction_examples",
          title: "Client Instruction Examples",
          placeholder: "Provide examples of how you've obtained referral and repeat instructions...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "8.3.2",
      title: "Client Networking",
      description: "Establishes and creates own network within client organisations.",
      text_placeholder: "Describe how you've built your own network within client organizations...",
      withCheckBox: [
        {
          id: "multiple_contacts",
          label: "Multiple client contacts",
          description: "I have established relationships with multiple contacts at key clients"
        },
        {
          id: "independent_networking",
          label: "Independent networking",
          description: "I independently establish new relationships within client organizations"
        }
      ],
      withTextAreas: [
        {
          id: "client_network_map",
          title: "Client Network Map",
          placeholder: "List key contacts you've developed across client organizations...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "8.3.3",
      title: "Business Development",
      description: "Wins more work from existing clients and initiates and contributes to business development activities.",
      text_placeholder: "Describe your business development activities and client expansion efforts...",
      withProgress: [
        {
          id: "existing_client_expansion",
          title: "Work Won from Existing Clients",
          target: 100,
          units: "%",
          editable: true
        }
      ],
      withRadioGroup: [
        {
          id: "bd_involvement",
          title: "Business Development Involvement",
          description: "Level of involvement in business development activities",
          options: [
            { value: "minimal", label: "Minimal - Occasionally support BD efforts when requested" },
            { value: "moderate", label: "Moderate - Regularly contribute to BD activities" },
            { value: "active", label: "Active - Initiate and actively participate in BD activities" },
            { value: "leading", label: "Leading - Take leadership roles in BD initiatives" }
          ],
          defaultValue: "moderate"
        }
      ],
      withTextAreas: [
        {
          id: "bd_activity_examples",
          title: "Business Development Activities",
          placeholder: "Provide examples of business development activities you've initiated or contributed to...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "8.3.4",
      title: "Pitch Development",
      description: "Develops first-pass of pitch documents.",
      text_placeholder: "Describe your experience developing pitch documents...",
      withCheckBox: [
        {
          id: "pitch_drafting",
          label: "Pitch document drafting",
          description: "I draft first versions of pitch documents"
        },
        {
          id: "pitch_presentation",
          label: "Pitch presentation",
          description: "I contribute to or deliver pitch presentations"
        }
      ],
      withRadioGroup: [
        {
          id: "pitch_involvement",
          title: "Pitch Development Involvement",
          description: "Level of involvement in developing pitch materials",
          options: [
            { value: "supporting", label: "Supporting - Provide information for others to include in pitches" },
            { value: "contributing", label: "Contributing - Help develop portions of pitch documents" },
            { value: "leading", label: "Leading - Create complete first drafts of pitch documents" },
            { value: "ownership", label: "Ownership - Take ownership of entire pitch development process" }
          ],
          defaultValue: "contributing"
        }
      ]
    },
    {
      number: "8.3.5",
      title: "Client Relationship Management",
      description: "Leads day-to-day client contact, takes key roles in client service departments, and seeks regular feedback to understand client business drivers.",
      text_placeholder: "Describe your approach to client relationship management and feedback collection...",
      withCheckBox: [
        {
          id: "daily_client_contact",
          label: "Daily client contact",
          description: "I lead day-to-day communications with clients"
        },
        {
          id: "client_service_role",
          label: "Client service role",
          description: "I take a key role in client service departments"
        },
        {
          id: "feedback_collection",
          label: "Feedback collection",
          description: "I regularly collect feedback from clients"
        }
      ],
      withTextAreas: [
        {
          id: "client_feedback_examples",
          title: "Client Feedback Examples",
          placeholder: "Provide examples of feedback you've collected and how you've incorporated it...",
          minHeight: "16"
        },
        {
          id: "client_relationship_examples",
          title: "Client Relationship Management Examples",
          placeholder: "Describe your role in managing day-to-day client relationships...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "8.3.6",
      title: "Value-Added Service",
      description: "Uses sector knowledge to anticipate client needs, seeks to add value, exceeds client expectations, and provides innovative solutions.",
      text_placeholder: "Describe how you add value and exceed client expectations...",
      withRadioGroup: [
        {
          id: "sector_knowledge",
          title: "Sector Knowledge Application",
          description: "How effectively you apply sector knowledge to anticipate client needs",
          options: [
            { value: "basic", label: "Basic - Developing sector knowledge" },
            { value: "applied", label: "Applied - Apply sector knowledge to current client needs" },
            { value: "anticipatory", label: "Anticipatory - Use sector knowledge to anticipate future needs" },
            { value: "strategic", label: "Strategic - Leverage deep sector insights for strategic client advantage" }
          ],
          defaultValue: "applied"
        },
        {
          id: "innovation_level",
          title: "Innovation Level",
          description: "Level of innovation in solutions provided to clients",
          options: [
            { value: "standard", label: "Standard - Provide reliable standard solutions" },
            { value: "enhanced", label: "Enhanced - Enhance standard solutions for better results" },
            { value: "innovative", label: "Innovative - Develop new approaches to client challenges" },
            { value: "transformative", label: "Transformative - Create transformative, industry-leading solutions" }
          ],
          defaultValue: "enhanced"
        }
      ],
      withTextAreas: [
        {
          id: "value_add_examples",
          title: "Value-Added Examples",
          placeholder: "Provide examples of how you've added value beyond standard service...",
          minHeight: "16"
        },
        {
          id: "innovation_examples",
          title: "Innovative Solutions",
          placeholder: "Describe innovative solutions you've developed for clients...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "8.3.7",
      title: "Internal Collaboration",
      description: "Extends internal network and builds collaborative relationships across the firm, referring work as appropriate.",
      text_placeholder: "Describe your internal networking and collaboration efforts...",
      withProgress: [
        {
          id: "internal_referrals",
          title: "Internal Work Referrals",
          target: 100,
          units: "%",
          editable: true
        }
      ],
      withRadioGroup: [
        {
          id: "internal_network",
          title: "Internal Network Strength",
          description: "Strength of your internal network across the firm",
          options: [
            { value: "developing", label: "Developing - Building initial connections" },
            { value: "established", label: "Established - Have solid connections in primary areas" },
            { value: "extensive", label: "Extensive - Well-connected across multiple departments" },
            { value: "influential", label: "Influential - Strong relationships across the firm" }
          ],
          defaultValue: "established"
        }
      ],
      withTextAreas: [
        {
          id: "collaboration_examples",
          title: "Collaboration Examples",
          placeholder: "Provide examples of cross-firm collaborations you've initiated or participated in...",
          minHeight: "16"
        },
        {
          id: "referral_examples",
          title: "Internal Referral Examples",
          placeholder: "Describe instances where you've referred work to colleagues in other departments...",
          minHeight: "16"
        }
      ]
    }
  ];

  return (
    <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.BUSINESS_DEVELOPMENT} />
  )
}

export default BusinessDevelopment;