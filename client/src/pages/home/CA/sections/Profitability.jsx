import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, CartesianGrid, RadialBarChart, PolarGrid, RadialBar, PolarRadiusAxis } from 'recharts';
import { UploadCloud, Save, PlusCircle, MinusCircle } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from '@/components/ui/chart';
import { AlertDialog, AlertDialogHeader, AlertDialogTrigger, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';

const TOTAL_ANNUAL_BUDGET = 6000000; // 6 million. Use request function to get actual value
const BUDGET_ACHIEVED = [850000, 430000, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // get from sharepoint as discussed
const MONTHLY_PERCENTAGES = [15, 7.5, 7.5, 9, 9, 9, 10, 12, 12, 5, 4]; // constant

const MonthlyBudgetSection = () => {
  const chartData = [
    { month: 'Mar', target: (TOTAL_ANNUAL_BUDGET * MONTHLY_PERCENTAGES[0]) / 100, billed: BUDGET_ACHIEVED[0] },
    { month: 'Apr', target: (TOTAL_ANNUAL_BUDGET * MONTHLY_PERCENTAGES[1]) / 100, billed: BUDGET_ACHIEVED[1] },
    { month: 'May', target: (TOTAL_ANNUAL_BUDGET * MONTHLY_PERCENTAGES[2]) / 100, billed: BUDGET_ACHIEVED[2] },
    { month: 'Jun', target: (TOTAL_ANNUAL_BUDGET * MONTHLY_PERCENTAGES[3]) / 100, billed: BUDGET_ACHIEVED[3] },
    { month: 'Jul', target: (TOTAL_ANNUAL_BUDGET * MONTHLY_PERCENTAGES[4]) / 100, billed: BUDGET_ACHIEVED[4] },
    { month: 'Aug', target: (TOTAL_ANNUAL_BUDGET * MONTHLY_PERCENTAGES[5]) / 100, billed: BUDGET_ACHIEVED[5] },
    { month: 'Sep', target: (TOTAL_ANNUAL_BUDGET * MONTHLY_PERCENTAGES[6]) / 100, billed: BUDGET_ACHIEVED[6] },
    { month: 'Oct', target: (TOTAL_ANNUAL_BUDGET * MONTHLY_PERCENTAGES[7]) / 100, billed: BUDGET_ACHIEVED[7] },
    { month: 'Nov', target: (TOTAL_ANNUAL_BUDGET * MONTHLY_PERCENTAGES[8]) / 100, billed: BUDGET_ACHIEVED[8] },
    { month: 'Dec', target: (TOTAL_ANNUAL_BUDGET * MONTHLY_PERCENTAGES[9]) / 100, billed: BUDGET_ACHIEVED[9] },
    { month: 'Jan', target: (TOTAL_ANNUAL_BUDGET * MONTHLY_PERCENTAGES[10]) / 100, billed: BUDGET_ACHIEVED[10] }
  ];

  const chartConfig = {
    billed: {
      label: 'Billed',
      color: 'var(--chart-1)'
    },
    target: {
      label: 'Target',
      color: 'var(--chart-2)'
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budget Achievement</CardTitle>
        <CardDescription>March 2025 - January 2026</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="billed" fill="var(--color-billed)" radius={4} />
            <Bar dataKey="target" fill="var(--color-target)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const HoursSection = () => {
  const billableHoursTarget = 1200;
  const nonBillableHoursTarget = 150;
  const writtenOffHoursTarget = 0.5 * billableHoursTarget;

  const [hoursData, setHoursData] = useState({
    billableHours: 200,
    nonBillableHours: 12,
    writtenOffHours: 50
  });

  const [progress, setProgress] = useState({
    billable: 0,
    nonBillable: 0,
    writtenOff: 0
  });

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await window.electronAPI.readHoursFile();
        if (data) {
          setHoursData(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (error) {
        console.error('Error loading hours data:', error);
      }
    };

    loadInitialData();
  }, []);

  // Update progress whenever hours change
  useEffect(() => {
    setProgress({
      billable: (hoursData.billableHours / billableHoursTarget) * 100,
      nonBillable: (hoursData.nonBillableHours / nonBillableHoursTarget) * 100,
      writtenOff: (hoursData.writtenOffHours / writtenOffHoursTarget) * 100
    });
  }, [hoursData]);

  const handleSaveHours = async () => {
    try {
      await window.electronAPI.saveHoursFile(hoursData);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Failed to save hours:', error);
    }
  };

  const updateHours = (type, amount) => {
    setHoursData(prev => {
      const newValue = Math.max(0, prev[type] + amount);
      return {
        ...prev,
        [type]: newValue
      };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hours Tracking</CardTitle>
        <CardDescription>Track your billable, non-billable, and written-off hours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-5'>
          {/* Billable Hours */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor="billableHours">Billable Hours</Label>
            <Progress value={progress.billable} className="h-2 w-[75%]" />
            <div className='flex flex-row items-center gap-2'>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => updateHours('billableHours', -1)} 
                className='rounded-full h-5 w-5'
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <p>{hoursData.billableHours} hours</p>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => updateHours('billableHours', 1)} 
                className='rounded-full h-5 w-5'
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Non-Billable Hours */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor="nonBillableHours">Non-Billable Hours</Label>
            <Progress value={progress.nonBillable} className="h-2 w-[75%]" />
            <div className='flex flex-row items-center gap-2'>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => updateHours('nonBillableHours', -1)} 
                className='rounded-full h-5 w-5'
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <p>{hoursData.nonBillableHours} hours</p>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => updateHours('nonBillableHours', 1)} 
                className='rounded-full h-5 w-5'
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Written Off Hours */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor="writtenOffHours">Written Off Hours</Label>
            <Progress value={progress.writtenOff} className="h-2 w-[75%]" />
            <div className='flex flex-row items-center gap-2'>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => updateHours('writtenOffHours', -1)} 
                className='rounded-full h-5 w-5'
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <p>{hoursData.writtenOffHours} hours</p>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => updateHours('writtenOffHours', 1)} 
                className='rounded-full h-5 w-5'
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant='outline' onClick={handleSaveHours}>
          Save Changes <Save className="ml-2 h-4 w-4" />
        </Button>

        {/* Success Dialog */}
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hours Data Saved</AlertDialogTitle>
              <AlertDialogDescription>
                Your hours data has been saved successfully.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

const PromotionSection = () => {
  const promotionThreshold = TOTAL_ANNUAL_BUDGET * 3; // 3x annual budget
  const totalBilledAmount = BUDGET_ACHIEVED.reduce((acc, curr) => acc + curr, 0);
  const progressToPromotion = (totalBilledAmount / promotionThreshold) * 100; // percentage to display

  const chartData = [
    {
      name: "Progress",
      value: progressToPromotion,
    },
  ];

  const chartConfig = {
    value: {
      label: "Progress",
    },
    progress: {
      label: "Promotion Progress",
      color: "var(--chart-1)",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress to Promotion</CardTitle>
        <CardDescription>
          Target: {promotionThreshold.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270 * (progressToPromotion / 100) + 90}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background fill='var(--chart-1)'/>
            <PolarRadiusAxis
              tick={false}
              tickLine={false}
              axisLine={false}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-2xl font-bold"
              fill='var(--chart-1)'
            >
              {progressToPromotion.toFixed(2)}%
            </text>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const QualitativeKPISection = () => {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [textInputs, setTextInputs] = useState({});
  const [existingPdfs, setExistingPdfs] = useState({});

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load text inputs
        const savedData = await window.electronAPI.loadQualitativeData();
        setTextInputs(savedData);
        
        // Check which PDFs exist
        const kpiNumbers = ['1.1.4', '1.1.5', '1.1.6', '1.1.7'];
        const pdfStatus = {};
        
        for (const kpiNumber of kpiNumbers) {
          pdfStatus[kpiNumber] = await window.electronAPI.checkPdfExists(kpiNumber);
        }
        
        setExistingPdfs(pdfStatus);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };
    
    loadSavedData();
  }, []);

  const handleFileChange = (event, kpiNumber) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFiles(prev => ({
        ...prev,
        [kpiNumber]: file
      }));
    }
  };

  const handleTextChange = (event, kpiNumber) => {
    setTextInputs(prev => ({
      ...prev,
      [kpiNumber]: event.target.value
    }));
  };

  const saveQualitativeData = async () => {
    try {
      // Prepare data to save
      const dataToSave = {
        textData: textInputs,
        files: selectedFiles
      };
      
      // Save all data at once
      const result = await window.electronAPI.saveQualitativeData(dataToSave);
      
      // Update existing PDFs status
      const updatedPdfs = { ...existingPdfs };
      for (const kpiNumber in selectedFiles) {
        updatedPdfs[kpiNumber] = true;
      }
      setExistingPdfs(updatedPdfs);
      
      alert('All qualitative data saved successfully!');
    } catch (error) {
      console.error('Error saving qualitative data:', error);
      alert('Failed to save qualitative data');
    }
  };

  // Render function for each KPI card
  const renderKpiCard = (kpiNumber, title, description) => (
    <Card key={kpiNumber}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea 
          placeholder={`Describe how you meet ${title.toLowerCase()}...`}
          className="min-h-32 mb-4"
          onChange={(e) => handleTextChange(e, kpiNumber)}
          value={textInputs[kpiNumber] || ''}
        />
        <div className="flex items-center gap-2 mb-2">
          <Button onClick={() => document.getElementById(`file-${kpiNumber}`).click()}>
            <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
          </Button>
          <input
            id={`file-${kpiNumber}`}
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, kpiNumber)}
            className="hidden"
          />
          {selectedFiles[kpiNumber] && (
            <span className="text-sm text-gray-500">{selectedFiles[kpiNumber].name}</span>
          )}
        </div>
        {existingPdfs[kpiNumber] && (
          <div className="text-sm text-green-600">
            Existing evidence PDF found for this KPI
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {renderKpiCard(
        '1.1.4',
        'Time Tracking Accuracy',
        'Accurately captures all time (billable and non-billable)'
      )}
      
      {renderKpiCard(
        '1.1.5',
        'Financial Housekeeping',
        'Understands and applies financial housekeeping principles and procedures'
      )}
      
      {renderKpiCard(
        '1.1.6',
        'Technology Efficiency',
        'Effectively uses technology and support services for efficient delivery'
      )}
      
      {renderKpiCard(
        '1.1.7',
        'Proactive Work Seeking',
        'Seeks work when underutilised'
      )}
      
      <div className="mt-4">
        <Button onClick={saveQualitativeData} size="lg">
          <Save className="mr-2 h-4 w-4" /> Save All Qualitative Data
        </Button>
      </div>
    </div>
  );
};

const Profitability = () => {
  return (
    <Tabs defaultValue="metrics" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
        <TabsTrigger value="monthly">Monthly Progress</TabsTrigger>
        <TabsTrigger value="qualitative">Qualitative KPIs</TabsTrigger>
      </TabsList>

      <TabsContent value="metrics">
        <HoursSection />
        <div className='flex flex-col gap-5'>
          
        </div>
      </TabsContent>
      <TabsContent value="monthly">
        <div className='flex flex-col gap-5'>
          <MonthlyBudgetSection />
          <PromotionSection />
        </div>
      </TabsContent>
      <TabsContent value="qualitative">
        <QualitativeKPISection />
      </TabsContent>
    </Tabs>
  );
};

export default Profitability;