import React from 'react';
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const BusinessDevelopment = () => {
  const KPI_CONFIG = [
    {
      number: '8.1.1',
      title: 'Maintaining your LinkedIn account',
      description: 'Regular updates and engagement on your professional LinkedIn profile',
      text_placeholder: 'Describe how you have maintained and improved your LinkedIn presence. Include metrics on connections, engagement, or content posted.',
      withProgress: [
        {
          id: 'linkedin_connections',
          title: 'LinkedIn Connections',
          target: 500,
          units: 'connections',
          editable: true
        },
        {
          id: 'linkedin_posts',
          title: 'LinkedIn (Re)posts',
          target: 12,
          units: 'posts per quarter'
        }
      ],
      withCheckBox: [
        {
          id: 'linkedin_profile_complete',
          label: 'LinkedIn Profile Complete',
          description: 'All sections of your LinkedIn profile are complete and up-to-date'
        },
        {
          id: 'linkedin_firm_connected',
          label: 'Connected to Firm Page',
          description: 'Your profile correctly lists your position at the firm'
        }
      ]
    },
    {
      number: '8.1.2',
      title: 'Keeping abreast of what your sector and clients are doing',
      description: 'Demonstrating awareness of industry developments and client activities',
      text_placeholder: 'Detail the methods you use to stay informed about your sector and clients. Include specific examples of knowledge gained and how it has benefited your work.',
      withProgress: [
        {
          id: 'industry_publications_read',
          title: 'Industry Publications Read',
          target: 24,
          units: 'publications per year'
        }
      ],
      withCheckBox: [
        {
          id: 'news_alerts_set',
          label: 'News Alerts Set Up',
          description: 'You have configured alerts for key clients and industry topics'
        },
        {
          id: 'industry_memberships',
          label: 'Industry Association Membership',
          description: 'You are a member of relevant industry or legal associations'
        }
      ]
    },
    {
      number: '8.1.3',
      title: 'Demonstrates a commercial awareness that considers both the client perspective and the requirements of the firm',
      description: 'Balancing client needs with firm objectives in decision-making and client interactions',
      text_placeholder: 'Provide examples of how you have demonstrated commercial awareness in your work. Include instances where you balanced client needs with firm requirements.',
      withCheckBox: [
        {
          id: 'fee_structure_understanding',
          label: 'Fee Structure Understanding',
          description: 'You understand and can explain the firm\'s fee structures to clients'
        },
        {
          id: 'business_case_contributions',
          label: 'Business Case Contributions',
          description: 'You have contributed to business cases or proposals'
        },
        {
          id: 'client_business_understanding',
          label: 'Client Business Understanding',
          description: 'You have researched and understand your clients\' business models'
        }
      ]
    },
    {
      number: '8.1.4',
      title: 'Understands and can articulate marketing for department',
      description: 'Knowledge of department marketing strategies and ability to communicate them effectively',
      text_placeholder: 'Explain your understanding of the department\'s marketing strategy and how you have contributed to or articulated it.',
      withCheckBox: [
        {
          id: 'marketing_materials_familiarity',
          label: 'Marketing Materials Familiarity',
          description: 'You are familiar with the department\'s marketing materials and value propositions'
        },
        {
          id: 'pitch_participation',
          label: 'Pitch Participation',
          description: 'You have participated in or contributed to client pitches'
        },
        {
          id: 'marketing_meeting_attendance',
          label: 'Marketing Meeting Attendance',
          description: 'You regularly attend departmental marketing meetings'
        }
      ]
    },
    {
      number: '8.1.5',
      title: 'Knows key account clients for department',
      description: 'Familiarity with the department\'s most important clients and their specific needs',
      text_placeholder: 'List the key account clients for your department and demonstrate your understanding of their businesses, legal needs, and relationship history with the firm.',
      withProgress: [
        {
          id: 'key_clients_known',
          title: 'Key Clients Known',
          target: 10,
          units: 'clients'
        }
      ],
      withCheckBox: [
        {
          id: 'client_profiles_reviewed',
          label: 'Client Profiles Reviewed',
          description: 'You have reviewed profiles/histories of key clients'
        },
        {
          id: 'client_matters_familiar',
          label: 'Client Matters Familiarity',
          description: 'You are familiar with the major matters handled for key clients'
        }
      ]
    },
    {
      number: '8.1.6',
      title: 'Networks at client meetings / events to strengthen relationships',
      description: 'Active participation in client meetings and networking events to build client relationships',
      text_placeholder: 'Describe client meetings and events you have attended, and how you contributed to strengthening relationships. Include follow-up activities.',
      withProgress: [
        {
          id: 'client_events_attended',
          title: 'Client Events Attended',
          target: 8,
          units: 'events per year'
        },
        {
          id: 'follow_ups_completed',
          title: 'Follow-ups Completed',
          target: 16,
          units: 'follow-ups per year'
        }
      ],
      withCheckBox: [
        {
          id: 'business_cards_collected',
          label: 'Contact Information Collected',
          description: 'You collect and record contact information from new connections'
        },
        {
          id: 'networking_plan',
          label: 'Networking Plan Created',
          description: 'You have created a personal networking plan'
        }
      ]
    }
  ];
  return (
    <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.BUSINESS_DEVELOPMENT} />
  )
}

export default BusinessDevelopment;