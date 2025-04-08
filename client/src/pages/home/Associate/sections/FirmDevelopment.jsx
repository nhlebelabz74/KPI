import React from 'react';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';
import { KPI_Types as types } from '@/constants';

const FirmDevelopment = () => {
  const KPI_CONFIG = [
    {
      number: '6.2.1',
      title: 'External Seminars',
      description: 'Assisting with at least two external seminars',
      text_placeholder: 'Describe the external seminars you assisted with...',
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
      number: '6.2.2',
      title: 'Firm Initiatives',
      description: 'Participating in at least four firm initiatives',
      text_placeholder: 'Describe the firm initiatives you participated in...',
      withProgress: [
        {
          id: 'firmInitiativesProgress',
          title: 'Firm Initiatives Progress',
          target: 4,
          units: 'initiatives'
        }
      ]
    },
    {
      number: '6.2.3',
      title: 'Suggesting Firm Initiatives',
      description: 'Suggesting at least one firm initiative which is taken up by the firm',
      text_placeholder: 'Describe the firm initiative you suggested that was taken up by the firm...',
      withProgress: [
        {
          id: 'suggestionsProgress',
          title: 'Suggestions Progress',
          target: 1,
          units: 'suggestion'
        }
      ]
    },
    {
      number: '6.2.4',
      title: 'Quality Standards',
      description: 'Builds and extends experience and understanding of quality to drive higher standards in all client work',
      text_placeholder: 'Describe how you build and extend experience and understanding of quality standards...'
    },
    {
      number: '6.2.5',
      title: 'Meeting Contributions',
      description: 'Makes active contributions to meetings, presenting effectively',
      text_placeholder: 'Describe your active contributions to meetings and how you present effectively...'
    },
    {
      number: '6.2.6',
      title: 'Proactive Thinking',
      description: 'Is proactive in thinking of new ideas',
      text_placeholder: 'Describe how you are proactive in thinking of new ideas...'
    },
    {
      number: '6.2.7',
      title: 'New Opportunities',
      description: 'Seeks out new opportunities and has the courage to try new things outside previous experience',
      text_placeholder: 'Describe how you seek out new opportunities and try new things outside of your experience...'
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Firm Development - Associate</h1>
      <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.FIRM_DEVELOPMENT} />
    </div>
  );
};

export default FirmDevelopment;