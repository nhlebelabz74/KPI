import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const Profitability = () => {
  const KPI_CONFIG = [
    {
      number: '1.5.1',
      title: 'Financial Contribution',
      description: 'Demonstrates significant measurable financial contribution to maintain or grow the margin.',
      text_placeholder: 'Describe how you meet this requirement...',
    },
    {
      number: '1.5.2',
      title: 'Fee Growth and Cross-Selling',
      description: 'On leading work takes initiative to increase fees and cross sell other practice areas.',
      text_placeholder: 'Describe how you meet this requirement...'
    },
    {
      number: '1.5.3',
      title: 'Risk Management',
      description: 'Reviews areas of potential risk and puts systems in place to manage these, reviewing progress and performance on a regular basis.',
      text_placeholder: 'Describe how you meet this requirement...'
    },
    {
      number: '1.5.4',
      title: 'Referral Generation',
      description: 'Makes referrals to other areas of the firm that result in new opportunities.',
      text_placeholder: 'Describe how you meet this requirement...'
    }
  ];

  return (
    <Tabs defaultValue="qualitative" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="qualitative" className="cursor-pointer">Equity Director KPIs</TabsTrigger>
      </TabsList>

      <TabsContent value="qualitative">
        <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.PROFITABILITY}
        />
      </TabsContent>
    </Tabs>
  );
};

export default Profitability;