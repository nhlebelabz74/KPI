import React from 'react';
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const BusinessDevelopment = () => {
  const KPI_CONFIG = [
    {
      number: "8.2.1",
      title: "Network Development",
      description: "Reaching out to friends and ex-colleagues in the industry to pursue potential opportunities.",
      text_placeholder: "Describe your networking activities and any opportunities that resulted from these connections...",
      withProgress: [
        {
          id: "networking_outreach_count",
          title: "Outreach Count",
          target: 20,
          units: "contacts"
        }
      ],
      withTextAreas: [
        {
          id: "networking_outcomes",
          title: "Outcomes from Networking",
          placeholder: "List opportunities, leads, or collaborations that resulted from your networking efforts...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "8.2.2",
      title: "Client Service Excellence",
      description: "Delivers client service excellence by being responsive and adding value in event client interaction.",
      text_placeholder: "Describe how you've demonstrated responsiveness and added value during client interactions...",
      withRadioGroup: [
        {
          id: "response_time",
          title: "Average Response Time",
          options: [
            { label: "Under 1 hour", value: "under_1h" },
            { label: "1-4 hours", value: "1_4h" },
            { label: "Same day", value: "same_day" },
            { label: "Next day", value: "next_day" }
          ],
          defaultValue: "same_day"
        }
      ],
      withTextAreas: [
        {
          id: "value_added_examples",
          title: "Value-Added Examples",
          placeholder: "Provide specific examples of how you've gone beyond basic requirements to add value for clients...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "8.2.3",
      title: "Relationship Building",
      description: "Proactively builds internal and external relationships which align to department priorities.",
      text_placeholder: "Describe how you've built relationships that align with department priorities...",
      withCheckBox: [
        {
          id: "internal_relationship_building",
          label: "Internal Relationship Building",
          description: "Actively developed relationships with internal stakeholders"
        },
        {
          id: "external_relationship_building",
          label: "External Relationship Building",
          description: "Actively developed relationships with external partners"
        },
        {
          id: "alignment_with_priorities",
          label: "Priority Alignment",
          description: "Relationships align with department strategic priorities"
        }
      ]
    },
    {
      number: "8.2.4",
      title: "Sector Understanding",
      description: "Develops understanding of sectors.",
      text_placeholder: "Describe your efforts to develop understanding of relevant sectors and how this has benefited your work...",
      withProgress: [
        {
          id: "sector_knowledge_rating",
          title: "Sector Knowledge Self-Assessment",
          target: 10,
          units: "stars",
          editable: true
        }
      ],
      withTextAreas: [
        {
          id: "key_sectors",
          title: "Key Sectors Developed",
          placeholder: "List the main sectors you've developed knowledge in and any formal/informal learning undertaken...",
          minHeight: "16"
        }
      ]
    },
    {
      number: "8.2.5",
      title: "Planned Networking",
      description: "Strengthens internal and external relationships through planned networking.",
      text_placeholder: "Describe your planned networking activities and how they've strengthened relationships...",
      withRadioGroup: [
        {
          id: "networking_frequency",
          title: "Networking Event Frequency",
          options: [
            { label: "Weekly", value: "weekly" },
            { label: "Bi-weekly", value: "biweekly" },
            { label: "Monthly", value: "monthly" },
            { label: "Quarterly", value: "quarterly" }
          ],
          defaultValue: "monthly"
        }
      ],
      withProgress: [
        {
          id: "networking_events_attended",
          title: "Networking Events Attended",
          target: 12,
          units: "events"
        }
      ],
      withTextAreas: [
        {
          id: "relationship_outcomes",
          title: "Relationship Outcomes",
          placeholder: "Describe specific relationships that have been strengthened through your planned networking activities...",
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