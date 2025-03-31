import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Save } from 'lucide-react';

const businessDevIntro = `
Business development for an Equity Director involves generating and maintaining client relationships, 
building a strong technical reputation, and maximizing profitability. Successful business development 
requires both technical excellence and strong commercial acumen to identify opportunities and deliver 
high-quality service to clients.
`;

const BusinessDevelopment = () => {
  const criteria = [
    "Generates and maintain own pipeline of work through technical excellence.",
    "Wins more work from existing clients as a result of technical reputation.",
    "Spends time with clients to understand their requirements and delivers to meet each client's specification and definition of quality.",
    "Proactively seeks and utilises client feedback to improve service and shape future client offerings.",
    "Proactively identifies opportunities to promote firm wide departments to maximise profit in client delivery.",
    "Takes part in pitches and leads on areas relevant to their specialism.",
    "Influences outside of own department and is an engaged and motivated member of client service departments.",
    "Strong commercial acumen to ensure a focus on increasing the profitability of their practice."
  ];

  const [metrics, setMetrics] = React.useState({
    pipelineValue: '',
    clientRetention: '',
    clientFeedbackScore: '',
    crossSellRevenue: '',
    pitchWinRate: '',
    practiceGrowth: ''
  });

  const [notes, setNotes] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  const handleMetricChange = (field, value) => {
    setMetrics(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save the data to your backend or local storage
    // For this example, we'll just set the saved state to true
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle>Business Development Requirements</CardTitle>
          <CardDescription>{businessDevIntro}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Business Development Criteria:</h3>
            <ul className="list-disc pl-5 space-y-2">
              {criteria.map((criterion, index) => (
                <li key={index} className="text-sm">
                  {criterion}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Pipeline Value (£):</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={metrics.pipelineValue}
                onChange={(e) => handleMetricChange('pipelineValue', e.target.value)}
                placeholder="Total value of current pipeline"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Client Retention Rate (%):</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={metrics.clientRetention}
                onChange={(e) => handleMetricChange('clientRetention', e.target.value)}
                placeholder="Percentage of retained clients"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Client Feedback Score:</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={metrics.clientFeedbackScore}
                onChange={(e) => handleMetricChange('clientFeedbackScore', e.target.value)}
                placeholder="Average client satisfaction (1-10)"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Cross-Sell Revenue (£):</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={metrics.crossSellRevenue}
                onChange={(e) => handleMetricChange('crossSellRevenue', e.target.value)}
                placeholder="Revenue from cross-department referrals"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Pitch Win Rate (%):</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={metrics.pitchWinRate}
                onChange={(e) => handleMetricChange('pitchWinRate', e.target.value)}
                placeholder="Percentage of successful pitches"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Practice YoY Growth (%):</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={metrics.practiceGrowth}
                onChange={(e) => handleMetricChange('practiceGrowth', e.target.value)}
                placeholder="Year-on-year practice growth"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Business Development Notes:
            </label>
            <textarea
              className="w-full p-2 border rounded min-h-[150px]"
              placeholder="Detail your business development activities, client relationship management, and growth initiatives..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" /> View Performance Metrics
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Business Development Data
          </Button>
        </CardFooter>
      </Card>
      
      {saved && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Business development data has been saved successfully.</span>
        </div>
      )}
    </div>
  );
};

export default BusinessDevelopment;