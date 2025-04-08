import React from 'react'
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const FirmDevelopment = () => {
  const KPI_CONFIG = [
    {
      number: '6.4.1',
      title: 'External Seminars/Lecturing',
      description: 'Presenting at a minimum of two external seminars/lecturing opportunities',
      text_placeholder: 'Provide details about the external seminars or lecturing opportunities...',
      withProgress: [
        {
          id: 'externalSeminarsProgress',
          title: 'External Seminars Progress',
          target: 2,
          units: 'seminars'
        }
      ]
    },
    {
      number: '6.4.2',
      title: 'Firm Initiatives',
      description: 'Participating in all firm initiatives in some aspect',
      text_placeholder: 'Provide details about your participation in firm initiatives...',
      withCheckBox: [
        {
          id: 'participatingInAllInitiatives',
          label: 'I confirm that I am participating in all firm initiatives in some aspect'
        }
      ]
    },
    {
      number: '6.4.3',
      title: 'Co-Responsibility for Firm Initiatives',
      description: 'Taking (co) responsibility for at least two firm initiatives with another director. Both directors must agree that each equally contributed.',
      text_placeholder: 'Provide details about the firm initiatives for which you have co-responsibility...',
      withProgress: [
        {
          id: 'coResponsibleInitiativesProgress',
          title: 'Co-Responsible Initiatives',
          target: 2,
          units: 'initiatives'
        }
      ],
      withCheckBox: [
        {
          id: 'directorAgreement',
          label: 'I confirm that both directors agree that each equally contributed',
          description: 'For the avoidance of doubt, both directors have to agree that each equally contributed. Equal contribution does not necessarily indicate a 50/50 split of time or tasks.'
        }
      ]
    },
    {
      number: '6.4.4',
      title: 'Commercial Pressures and Difficult Conversations',
      description: 'Discusses commercial pressures and has difficult conversations with clients where necessary',
      text_placeholder: 'Provide details about commercial pressures and difficult client conversations you\'ve handled...',
      withCheckBox: [
        {
          id: 'handledDifficultConversations',
          label: 'I confirm that I discuss commercial pressures and have difficult conversations with clients where necessary',
        }
      ]
    },
    {
      number: '6.4.5',
      title: 'Judgment and Upcoming Change',
      description: 'Exercises judgment and anticipates upcoming change',
      text_placeholder: 'Provide examples of how you exercise judgment and anticipate upcoming change...',
      withCheckBox: [
        {
          id: 'exercisedJudgment',
          label: 'I confirm that I exercise judgment and anticipate upcoming change'
        }
      ]
    },
    {
      number: '6.4.6',
      title: 'Proper Processes',
      description: 'Ensures that proper processes are followed in relation to client and matter opening and seeks to ensure the smooth running of all matters in accordance with good practice',
      text_placeholder: 'Provide details about how you ensure proper processes are followed...',
      withCheckBox: [
        {
          id: 'ensuredProperProcesses',
          label: 'I confirm that I ensure proper processes are followed for client and matter opening'
        }
      ]
    }
  ];

  return (
    <QualitativeKPISectionBase type={types.FIRM_DEVELOPMENT} KPI_CONFIG={KPI_CONFIG} />
  )
}

export default FirmDevelopment