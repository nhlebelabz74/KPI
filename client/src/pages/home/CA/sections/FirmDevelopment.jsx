import React from 'react'
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const FirmDevelopment = () => {
  const KPI_CONFIG = [
    {
      number: '6.1.1',
      title: 'External Seminars',
      description: 'Assisting with at least two external seminars',
      text_placeholder: 'Provide details about the external seminars you\'ve assisted with...',
      withProgress: [
        {
          id: 'seminarsProgress',
          title: 'Seminars Progress',
          target: 2,
          units: 'seminars'
        }
      ]
    },
    {
      number: '6.1.2',
      title: 'Firm Initiatives',
      description: 'Participating in at least four firm initiatives',
      text_placeholder: 'Describe the firm initiatives you\'ve participated in...',
      withProgress: [
        {
          id: 'initiativesProgress',
          title: 'Initiatives Progress',
          target: 4,
          units: 'initiatives'
        }
      ]
    },
    {
      number: '6.1.3',
      title: 'Initiative Suggestion',
      description: 'Suggesting at least one firm initiative which is taken up by the firm',
      text_placeholder: 'Describe the firm initiative you suggested that was adopted...',
    },
    {
      number: '6.1.4',
      title: 'Professional Client Dealings',
      description: 'Acts professionally in all client dealings and starts to establish client contact',
      text_placeholder: 'Describe your professional conduct in client dealings and how you\'re establishing client contact...',
    },
    {
      number: '6.1.5',
      title: 'Quality Recognition',
      description: 'Recognises the importance of quality in all client work and can identify key elements of quality',
      text_placeholder: 'Explain how you recognize the importance of quality in client work and the key elements you\'ve identified...'
    },
    {
      number: '6.1.6',
      title: 'Ethical Conduct',
      description: 'Exhibits professional conduct and understands the importance of high standards of ethical behaviour',
      text_placeholder: 'Describe how you exhibit professional conduct and your understanding of ethical standards...'
    },
    {
      number: '6.1.7',
      title: 'Personal Impact',
      description: 'Pays attention to personal impact',
      text_placeholder: 'Describe how you pay attention to your personal impact...'
    },
    {
      number: '6.1.8',
      title: 'Respect for Others',
      description: 'Respects the opinions and individuality of others at all times',
      text_placeholder: 'Describe how you respect the opinions and individuality of others...'
    }
  ];
  return (
    <QualitativeKPISectionBase type={types.FIRM_DEVELOPMENT} KPI_CONFIG={KPI_CONFIG} />
  )
}

export default FirmDevelopment;