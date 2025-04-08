import React from 'react'
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const BusinessDevelopment = () => {
  const KPI_CONFIG = [
    {
      number: "8.4.1",
      title: "Key Client Relationships",
      description: "Runs key client relationships establishing self as a trusted adviser.",
      text_placeholder: "Describe how you've established yourself as a trusted adviser with key clients...",
      withTextAreas: [
        {
          id: "key_client_relationships",
          title: "Key Client Relationships",
          placeholder: "List your key client relationships and describe how you've built trust...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "8.4.2",
      title: "Stakeholder Relationships",
      description: "Builds long term relationships with a range of stakeholders across the client organisation, beyond the initial contact.",
      text_placeholder: "Describe your approach to developing relationships across client organizations...",
      withCheckBox: [
        {
          id: "multiple_stakeholders",
          label: "Engaging with multiple stakeholders",
          description: "I regularly engage with stakeholders beyond my initial contact"
        },
        {
          id: "executive_relationships",
          label: "C-suite/Executive relationships",
          description: "I have established relationships with C-suite or executive stakeholders"
        }
      ],
      withTextAreas: [
        {
          id: "stakeholder_map",
          title: "Stakeholder Map",
          placeholder: "List key stakeholders across client organizations you've developed relationships with...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "8.4.3",
      title: "Business Development",
      description: "Wins more work from existing clients across multiple offices/practice groups and leads business development activities to bring in new clients.",
      text_placeholder: "Describe your business development activities and successful client acquisitions...",
      withProgress: [
        {
          id: "new_client_acquisition",
          title: "New Client Acquisition (Target is arbitrary)",
          target: 5,
          units: "clients",
        }
      ],
      withRadioGroup: [
        {
          id: "cross_selling",
          title: "Cross-Selling Effectiveness",
          description: "Rate your effectiveness at cross-selling services across practice groups",
          options: [
            { value: "low", label: "Low - Limited cross-selling" },
            { value: "medium", label: "Medium - Occasional success in cross-selling" },
            { value: "high", label: "High - Regular successful cross-selling" },
            { value: "excellent", label: "Excellent - Exceptional cross-selling across multiple practice areas" }
          ],
          defaultValue: "medium"
        }
      ]
    },
    {
      number: "8.4.4",
      title: "Strategic Client Management",
      description: "Works at a strategic level with clients, manages day-to-day activities, and demonstrates skills in scoping, pitching, writing, selling and presenting.",
      text_placeholder: "Describe your approach to strategic client management and your client-facing skills...",
      withCheckBox: [
        {
          id: "strategic_planning",
          label: "Strategic client planning",
          description: "I develop strategic plans for key client relationships"
        },
        {
          id: "pitch_involvement",
          label: "Pitch involvement",
          description: "I lead or am actively involved in pitches for new work"
        }
      ],
      withRadioGroup: [
        {
          id: "presentation_skills",
          title: "Presentation & Pitching Skills",
          description: "Rate your effectiveness in client presentations and pitches",
          options: [
            { value: "developing", label: "Developing - Need improvement in presentation skills" },
            { value: "competent", label: "Competent - Can effectively present to clients" },
            { value: "skilled", label: "Skilled - Strong presentation and pitch skills" },
            { value: "expert", label: "Expert - Exceptional presentation and pitching abilities" }
          ],
          defaultValue: "competent"
        }
      ]
    },
    {
      number: "8.4.5",
      title: "Sector Expertise",
      description: "Actively participates in at least one sector, demonstrates deep sector knowledge and awareness of market trends and competitor activities.",
      text_placeholder: "Describe your sector expertise and how you stay current with market trends...",
      withTextAreas: [
        {
          id: "sector_expertise",
          title: "Sector Expertise Details",
          placeholder: "Describe your primary sector(s) of expertise and how you've developed this knowledge...",
          minHeight: "16"
        },
        {
          id: "market_intelligence",
          title: "Market Intelligence",
          placeholder: "Describe how you stay current with market trends and competitive intelligence...",
          minHeight: "16"
        }
      ],
      withRadioGroup: [
        {
          id: "sector_engagement",
          title: "Sector Engagement Level",
          description: "Your level of engagement in your chosen sector(s)",
          options: [
            { value: "participant", label: "Participant - Attend sector events and discussions" },
            { value: "contributor", label: "Contributor - Occasionally contribute to sector initiatives" },
            { value: "leader", label: "Leader - Regularly lead sector initiatives or thought leadership" },
            { value: "authority", label: "Authority - Recognized industry authority in the sector" }
          ],
          defaultValue: "contributor"
        }
      ]
    },
    {
      number: "8.4.6",
      title: "Quality Standards & Client Communications",
      description: "Role models high standards of quality and risk control, and has difficult conversations with clients when necessary.",
      text_placeholder: "Describe how you uphold quality standards and handle challenging client conversations...",
      withCheckBox: [
        {
          id: "quality_standards",
          label: "Quality standards champion",
          description: "I actively champion quality standards within the team"
        },
        {
          id: "risk_management",
          label: "Risk management",
          description: "I effectively identify and manage risks in client engagements"
        },
        {
          id: "difficult_conversations",
          label: "Difficult client conversations",
          description: "I have successfully navigated difficult conversations with clients"
        }
      ],
      withTextAreas: [
        {
          id: "quality_examples",
          title: "Quality Standards Examples",
          placeholder: "Provide examples of how you've upheld or improved quality standards...",
          minHeight: "16"
        },
        {
          id: "difficult_conversation_examples",
          title: "Challenging Conversation Examples",
          placeholder: "Describe challenging client conversations you've handled effectively...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "8.4.7",
      title: "Cross-Department Collaboration",
      description: "Builds collaborative relationships across all levels and departments, making referrals which lead to new work.",
      text_placeholder: "Describe your approach to cross-department collaboration and resulting new work...",
      withProgress: [
        {
          id: "internal_referrals",
          title: "Internal Referrals Generated (Target is arbitrary)",
          target: 10,
          units: "referrals",
          editable: true
        }
      ],
      withRadioGroup: [
        {
          id: "collaboration_level",
          title: "Internal Collaboration Level",
          description: "Rate your effectiveness in cross-department collaboration",
          options: [
            { value: "limited", label: "Limited - Primarily work within my department" },
            { value: "moderate", label: "Moderate - Occasional cross-department collaboration" },
            { value: "strong", label: "Strong - Regular cross-department collaboration" },
            { value: "exceptional", label: "Exceptional - Deeply integrated across departments" }
          ],
          defaultValue: "moderate"
        }
      ],
      withTextAreas: [
        {
          id: "collaboration_examples",
          title: "Collaboration Examples",
          placeholder: "Provide examples of successful cross-department collaborations and resulting new work...",
          minHeight: "16"
        }
      ]
    }
  ];

  return (
    <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.BUSINESS_DEVELOPMENT} />
  )
}

export default BusinessDevelopment