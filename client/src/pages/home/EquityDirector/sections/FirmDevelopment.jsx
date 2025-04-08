import React from 'react';
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const FirmDevelopment = () => {
  const KPI_CONFIG = [
    {
      number: '6.5.1',
      title: 'Client Service',
      description: 'Delivers a high level of client service, is responsive and anticipates issues',
      text_placeholder: 'Provide examples of how you deliver exceptional client service and anticipate issues...',
      withCheckBox: [
        {
          id: 'highLevelClientService',
          label: 'I confirm that I deliver a high level of client service'
        }
      ]
    },
    {
      number: '6.5.2',
      title: 'Specialist Training',
      description: 'Researches, designs and delivers specialist training to a wide range of clients and third parties',
      text_placeholder: 'Provide details about the specialist training you\'ve designed and delivered...',
      withProgress: [
        {
          id: 'trainingProgress',
          title: 'Specialist Training Sessions',
          target: 3,
          units: 'training sessions'
        }
      ]
    },
    {
      number: '6.5.3',
      title: 'Personal Example',
      description: 'Operates by personal example',
      text_placeholder: 'Provide examples of how you lead by personal example...',
      withCheckBox: [
        {
          id: 'operatesByExample',
          label: 'I confirm that I operate by personal example'
        }
      ]
    },
    {
      number: '6.5.4',
      title: 'Business Benefit',
      description: 'Works for the benefit of the business as a whole',
      text_placeholder: 'Provide examples of how you contribute to the business as a whole...',
      withCheckBox: [
        {
          id: 'worksForBusinessBenefit',
          label: 'I confirm that I work for the benefit of the business as a whole'
        }
      ]
    },
    {
      number: '6.5.5',
      title: 'File Management',
      description: 'Oversees the smooth running of files to ensure that clients and matters are opened and managed in accordance with defined process and good practice',
      text_placeholder: 'Provide examples of how you ensure proper file management and client matter handling...',
      withCheckBox: [
        {
          id: 'overseesFileManagement',
          label: 'I confirm that I oversee smooth file management according to defined processes'
        }
      ]
    }
  ];

  return (
    <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.FIRM_DEVELOPMENT}/>
  )
}

export default FirmDevelopment