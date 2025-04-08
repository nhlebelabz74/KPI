import React from 'react';
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const BusinessDevelopment = () => {
  const KPI_CONFIG = [
    {
      number: "8.5.1",
      title: "Technical Excellence Pipeline",
      description: "Generates and maintain own pipeline of work through technical excellence.",
      text_placeholder: "Describe how you've established and maintained your work pipeline through technical excellence...",
      withProgress: [
        {
          id: "pipeline_growth",
          title: "Pipeline Growth",
          target: 100,
          units: "%",
          editable: true
        }
      ],
      withTextAreas: [
        {
          id: "technical_initiatives",
          title: "Technical Excellence Initiatives",
          placeholder: "List specific technical initiatives or innovations you've implemented to generate work...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "8.5.2",
      title: "Expanding Existing Client Work",
      description: "Wins more work from existing clients as a result of technical reputation.",
      text_placeholder: "Describe instances where your technical reputation led to additional work from existing clients...",
      withProgress: [
        {
          id: "existing_client_expansion",
          title: "Existing Client Work Growth",
          target: 30,
          units: "%",
          editable: true
        },
        {
          id: "repeat_business_count",
          title: "Repeat Business Count",
          target: 10,
          units: "projects",
          editable: true
        }
      ]
    },
    {
      number: "8.5.3",
      title: "Client Requirements and Quality Delivery",
      description: "Spends time with clients to understand their requirements and delivers to meet each client's specification and definition of quality.",
      text_placeholder: "Describe your process for understanding client requirements and ensuring quality delivery...",
      withCheckBox: [
        {
          id: "client_requirement_docs",
          label: "Documented Client Requirements",
          description: "Formal documentation of client requirements captured for all projects"
        },
        {
          id: "quality_assessment",
          label: "Quality Assessment Process",
          description: "Implemented formal quality assessment process for deliverables"
        }
      ],
      withRadioGroup: [
        {
          id: "client_meeting_frequency",
          title: "Client Requirement Meetings",
          options: [
            { label: "Multiple times per project", value: "multiple" },
            { label: "Once per project", value: "once" },
            { label: "As needed basis", value: "as_needed" },
            { label: "Rarely", value: "rarely" }
          ],
          defaultValue: "multiple"
        }
      ]
    },
    {
      number: "8.5.4",
      title: "Client Feedback Utilization",
      description: "Proactively seeks and utilises client feedback to improve service and shape future client offerings.",
      text_placeholder: "Describe how you've sought client feedback and used it to improve services and offerings...",
      withProgress: [
        {
          id: "feedback_response_rate",
          title: "Feedback Response Rate",
          target: 85,
          units: "%",
          editable: true
        }
      ],
      withTextAreas: [
        {
          id: "service_improvements",
          title: "Service Improvements from Feedback",
          placeholder: "Detail specific service improvements implemented based on client feedback...",
          minHeight: "16"
        },
        {
          id: "future_offerings",
          title: "Future Offerings Developed",
          placeholder: "Describe new offerings developed based on client feedback insights...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "8.5.5",
      title: "Cross-Departmental Profit Opportunities",
      description: "Proactively identifies opportunities to promote firm wide departments to maximise profit in client delivery.",
      text_placeholder: "Describe opportunities you've identified to involve other departments to maximize profitability...",
      withProgress: [
        {
          id: "cross_dept_referrals",
          title: "Cross-Department Referrals",
          target: 15,
          units: "referrals",
          editable: true
        },
        {
          id: "additional_revenue",
          title: "Additional Revenue Generated (Target it arbitrary)",
          target: 1000000,
          units: "ZAR",
          editable: true
        }
      ]
    },
    {
      number: "8.5.6",
      title: "Pitch Leadership",
      description: "Takes part in pitches and leads on areas relevant to their specialism.",
      text_placeholder: "Describe your involvement in pitches and leadership in your specialist areas...",
      withProgress: [
        {
          id: "pitch_participation",
          title: "Pitch Participation",
          target: 12,
          units: "pitches"
        },
        {
          id: "pitch_win_rate",
          title: "Pitch Win Rate",
          target: 50,
          units: "%",
          editable: true
        }
      ],
      withCheckBox: [
        {
          id: "pitch_materials_development",
          label: "Pitch Materials Development",
          description: "Developed specialized materials for pitches"
        },
        {
          id: "pitch_presentation_delivery",
          label: "Pitch Presentation Delivery",
          description: "Delivered presentation content during pitches"
        }
      ]
    },
    {
      number: "8.5.7",
      title: "Cross-Departmental Influence",
      description: "Influences outside of own department and is an engaged and motivated member of client service departments.",
      text_placeholder: "Describe how you've exerted influence beyond your department and contributed to client service departments...",
      withRadioGroup: [
        {
          id: "cross_dept_engagement",
          title: "Cross-Department Engagement Level",
          options: [
            { label: "Regular leadership role", value: "leadership" },
            { label: "Active contributor", value: "contributor" },
            { label: "Occasional participation", value: "occasional" },
            { label: "Limited engagement", value: "limited" }
          ],
          defaultValue: "contributor"
        }
      ],
      withTextAreas: [
        {
          id: "influence_examples",
          title: "Cross-Departmental Influence Examples",
          placeholder: "Provide specific examples of how you've influenced activities outside your department...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "8.5.8",
      title: "Commercial Acumen",
      description: "Strong commercial acumen to ensure a focus on increasing the profitability of their practice.",
      text_placeholder: "Describe how you've applied commercial acumen to increase practice profitability...",
      withProgress: [
        {
          id: "profitability_growth",
          title: "Practice Profitability Growth",
          target: 20,
          units: "%",
          editable: true
        },
        {
          id: "cost_efficiency_improvement",
          title: "Cost Efficiency Improvement",
          target: 15,
          units: "%",
          editable: true
        }
      ],
      withTextAreas: [
        {
          id: "commercial_initiatives",
          title: "Commercial Initiatives",
          placeholder: "Describe specific commercial initiatives implemented to improve profitability...",
          minHeight: "16"
        }
      ]
    }
  ];

  return (
    <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.BUSINESS_DEVELOPMENT} />
  );
}

export default BusinessDevelopment;