import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, CartesianGrid, RadialBarChart, PolarGrid, RadialBar, PolarRadiusAxis } from 'recharts';
import { Save, PlusCircle, MinusCircle, Loader2, XCircle } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AlertDialog, AlertDialogHeader, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

import request from '@/utils/request';
import { useAuth } from '@/context/authContext';
import { KPI_Types as types } from '@/constants';

const MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']; // constant
const MONTHLY_PERCENTAGES = [15, 7.5, 7.5, 9, 9, 9, 10, 12, 12, 5, 4]; // constant

const getBudgetNumbers = async () => {
  // get the email from local storage
  const encryptedEmail = localStorage.getItem('encryptedEmail');

  const response = await request({
    type: 'GET',
    route: '/users/get/:email',
    routeParams: {
      email: encodeURIComponent(encryptedEmail),
    }
  });

  const user = response.data.user;
  const annualBudget = user.budget; // get the budget from the user object

  return {
    TOTAL_ANNUAL_BUDGET: annualBudget,
    BUDGET_ACHIEVED: [730293, 193842, 0, 0, 0, 0, 0, 0, 0, 0, 0] // will get later
  }
};

const useBudgetData = () => {
  const { isAuthenticated } = useAuth();
  const [budgetData, setBudgetData] = useState({
    TOTAL_ANNUAL_BUDGET: 0,
    BUDGET_ACHIEVED: []
  });

  useEffect(() => {
    const fetchBudgetData = async () => {
      if (!isAuthenticated) {
        setBudgetData({
          TOTAL_ANNUAL_BUDGET: 0,
          BUDGET_ACHIEVED: []
        });
        return;
      }
      
      try {
        const data = await getBudgetNumbers();
        setBudgetData({
          TOTAL_ANNUAL_BUDGET: data.TOTAL_ANNUAL_BUDGET,
          BUDGET_ACHIEVED: data.BUDGET_ACHIEVED
        });
      } catch (error) {
        console.error("Error fetching budget data:", error);
        setBudgetData({
          TOTAL_ANNUAL_BUDGET: 0,
          BUDGET_ACHIEVED: []
        });
      }
    };
    
    fetchBudgetData();
  }, [isAuthenticated]);

  return budgetData;
};

const MonthlyBudgetSection = () => {
  const { TOTAL_ANNUAL_BUDGET, BUDGET_ACHIEVED } = useBudgetData();
  
  const chartData = MONTHS.map((month, index) => ({
    month,
    target: (TOTAL_ANNUAL_BUDGET * MONTHLY_PERCENTAGES[index]) / 100,
    billed: BUDGET_ACHIEVED[index]
  }));

  const chartConfig = {
    billed: {
      label: 'Billed',
      color: 'var(--chart-1)'
    },
    target: {
      label: 'Target',
      color: 'var(--chart-2)'
    },
  };

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
};

const HoursSection = () => {
  const billableHoursTarget = 1200; // Annual billable hours for CA 
  const nonBillableHoursTarget = 150; // Annual non-billable for CA
  const writtenOffHoursTarget = 0.1 * billableHoursTarget; // Max 10% written off

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

  const [isLoading, setIsLoading] = useState(false);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);

  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // KPI Mappings
  const KPIS = {
    billableHours: {
      number: '1.1.1',
      question: 'Annual billable hours target (1200 hours)',
    },
    nonBillableHours: {
      number: '1.1.2', 
      question: 'Annual non-billable hours target (150 hours)',
    },
    writtenOffHours: {
      number: '1.1.3',
      question: 'Written-off hours (max 10% of billable)',
    }
  };

  const encryptedEmail = localStorage.getItem('encryptedEmail');

  // Function to update hours with buttons
  const updateHours = (hourType, change) => {
    setHoursData(prev => {
      // Don't allow negative values
      const newValue = Math.max(0, prev[hourType] + change);
      return { ...prev, [hourType]: newValue };
    });
  };

  // Function to handle input change
  const handleInputChange = (hourType, event) => {
    const value = event.target.value;
    // Allow empty string for when user clears the input
    if (value === '') {
      setHoursData(prev => ({ ...prev, [hourType]: '' }));
      return;
    }
    
    // Parse as integer and validate
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setHoursData(prev => ({ ...prev, [hourType]: numValue }));
    }
  };

  // Handle blur event to ensure we don't have empty values
  const handleInputBlur = (hourType) => {
    setHoursData(prev => {
      // If the value is empty or invalid, reset to 0
      if (prev[hourType] === '' || isNaN(prev[hourType])) {
        return { ...prev, [hourType]: 0 };
      }
      return prev;
    });
  };

  // Calculate progress percentages whenever hoursData changes
  useEffect(() => {
    setProgress({
      billable: (hoursData.billableHours / billableHoursTarget) * 100 >= 100 ? 100 : (hoursData.billableHours / billableHoursTarget) * 100,
      nonBillable: (hoursData.nonBillableHours / nonBillableHoursTarget) * 100 >= 100 ? 100 : (hoursData.nonBillableHours / nonBillableHoursTarget) * 100,
      writtenOff: (hoursData.writtenOffHours / writtenOffHoursTarget) * 100 >= 100 ? 100 : (hoursData.writtenOffHours / writtenOffHoursTarget) * 100
    });
  }, [hoursData]);

  // Modified save handler
  const handleSaveHours = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowLoadingDialog(true);
      
      // Save all hour types
      await Promise.all(Object.entries(hoursData).map(async ([hourType, value]) => {
        const kpi = KPIS[hourType];
        
        await request({
          type: 'POST',
          route: '/users/update/response',
          body: {
            email: encodeURIComponent(encryptedEmail),
            kpiNumber: kpi.number,
            type: types.PROFITABILITY,
            question: kpi.question,
            answer: value.toString() // Convert number to string for DB
          }
        });
      }));

      setShowLoadingDialog(false);
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Failed to save hours:', err);
      setError(err.message || 'Failed to save hours data');
      setShowLoadingDialog(false);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  // Modified load function
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const initialData = {};

        // Fetch existing data for all KPIs
        await Promise.all(Object.entries(KPIS).map(async ([hourType, kpi]) => {
          const response = await request({
            type: 'GET',
            route: `/users/get/response/:email/:kpiNumber`,
            routeParams: {
              email: encodeURIComponent(encryptedEmail),
              kpiNumber: kpi.number
            }
          });

          if (response.data.response.answer) {
            initialData[hourType] = parseInt(response.data.response.answer, 10) || 0;
          }
        }));

        setHoursData(prev => ({
          ...prev,
          ...initialData
        }));
      } catch (error) {
        console.error('Error loading hours data:', error);
      }
    };

    if (isAuthenticated) {
      setIsLoading(true);
      loadInitialData();
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const isWriteOffExceeded = hoursData.writtenOffHours > writtenOffHoursTarget;

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
            <Label htmlFor="billableHours">Billable Hours (Target: 1,200 hours)</Label>
            <Progress value={progress.billable} className="h-2 w-[75%]" />
            <div className='flex flex-row items-center gap-2'>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => updateHours('billableHours', -1)} 
                className='rounded-full h-5 w-5 cursor-pointer'
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <Input
                id="billableHours"
                type="text"
                value={hoursData.billableHours}
                onChange={(e) => handleInputChange('billableHours', e)}
                onBlur={() => handleInputBlur('billableHours')}
                className="w-20 text-center h-8"
                aria-label="Billable hours"
              />
              <span className="text-sm">hours</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => updateHours('billableHours', 1)} 
                className='rounded-full h-5 w-5 cursor-pointer'
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Non-Billable Hours */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor="nonBillableHours">Non-Billable Hours (Target: 150 hours)</Label>
            <Progress value={progress.nonBillable} className="h-2 w-[75%]" />
            <div className='flex flex-row items-center gap-2'>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => updateHours('nonBillableHours', -1)} 
                className='rounded-full h-5 w-5 cursor-pointer'
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <Input
                id="nonBillableHours"
                type="text"
                value={hoursData.nonBillableHours}
                onChange={(e) => handleInputChange('nonBillableHours', e)}
                onBlur={() => handleInputBlur('nonBillableHours')}
                className="w-20 text-center h-8"
                aria-label="Non-billable hours"
              />
              <span className="text-sm">hours</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => updateHours('nonBillableHours', 1)} 
                className='rounded-full h-5 w-5 cursor-pointer'
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Written Off Hours */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor="writtenOffHours">
              Written Off Hours (Max: {writtenOffHoursTarget} hours - 10% of billable)
            </Label>
            <Progress 
              value={progress.writtenOff} 
              className={`h-2 w-[75%] ${isWriteOffExceeded ? 'bg-red-200' : ''}`}
              indicatorClassName={isWriteOffExceeded ? 'bg-red-500' : ''}
            />
            <div className='flex flex-row items-center gap-2'>
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => updateHours('writtenOffHours', -1)} 
                className='rounded-full h-5 w-5 cursor-pointer'
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <Input
                id="writtenOffHours"
                type="text"
                value={hoursData.writtenOffHours}
                onChange={(e) => handleInputChange('writtenOffHours', e)}
                onBlur={() => handleInputBlur('writtenOffHours')}
                className={`w-20 text-center h-8 ${isWriteOffExceeded ? 'border-red-500 text-red-500' : ''}`}
                aria-label="Written off hours"
              />
              <span className={`text-sm ${isWriteOffExceeded ? 'text-red-500' : ''}`}>
                hours
                {isWriteOffExceeded && ' (exceeds 10% limit)'}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => updateHours('writtenOffHours', 1)} 
                className='rounded-full h-5 w-5 cursor-pointer'
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            {isWriteOffExceeded && (
              <p className="text-xs text-red-500">
                Note: Justification required for written-off hours exceeding 10% of billable hours.
                Management approval needed for capped, fixed, reduced rates, or specific service level agreements.
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant='outline' 
          onClick={handleSaveHours}
          disabled={loading}
          className='cursor-pointer'
        >
          {loading ? 'Saving...' : 'Save Changes'}
          <Save className="ml-2 h-4 w-4" />
        </Button>
        
        {error && (
          <div className="text-red-500 text-sm ml-4">
            Error: {error}
          </div>
        )}

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
              <AlertDialogCancel className="cursor-pointer">Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Loading Dialog */}
        <AlertDialog open={isLoading} onOpenChange={setIsLoading}>
          <AlertDialogContent>
            <div className="flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <AlertDialogTitle>Loading Hours Data</AlertDialogTitle>
              <AlertDialogDescription>
                <Loader2 className="h-8 w-8 mx-auto animate-spin" />
                <p className="mt-2">Please wait while your data loads...</p>
              </AlertDialogDescription>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Saving Dialog */}
        <AlertDialog open={showLoadingDialog} onOpenChange={setShowLoadingDialog}>
          <AlertDialogContent>
            <div className="flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <AlertDialogTitle>Saving Hours Data</AlertDialogTitle>
              <AlertDialogDescription>
                Please wait while your hours data is being saved...
              </AlertDialogDescription>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Error Dialog */}
        <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
          <AlertDialogContent className="border-red-500">
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <AlertDialogTitle>Error Saving Hours</AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                {error || 'Failed to save hours data. Please try again.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

const PromotionSection = () => {
  const { TOTAL_ANNUAL_BUDGET, BUDGET_ACHIEVED } = useBudgetData();

  // Calculate promotion metrics with fallbacks
  const promotionThreshold = (TOTAL_ANNUAL_BUDGET || 0) * 3;
  const totalBilledAmount = (BUDGET_ACHIEVED || []).reduce((acc, curr) => acc + (curr || 0), 0);
  const progressToPromotion = promotionThreshold > 0 
    ? (totalBilledAmount / promotionThreshold) * 100 
    : 0;

  // Chart configuration
  const chartData = [{ name: "Progress", value: progressToPromotion }];
  const chartConfig = {
    value: { label: "Progress" },
    progress: { label: "Promotion Progress", color: "var(--chart-1)" }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress to Promotion</CardTitle>
        <CardDescription>
          Target: {promotionThreshold.toLocaleString()} (3x annual budget)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
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
            <RadialBar dataKey="value" background fill='var(--chart-1)' />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false} />
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

const Profitability = () => {
  const KPI_CONFIG = [
    {
      number: '1.1.4',
      title: 'Advanced Time Management',
      description: 'Demonstrate mastery in complex time allocation and tracking',
      text_placeholder: 'Describe your time management strategies...'
    },
    {
      number: '1.1.5',
      title: 'Financial Leadership',
      description: 'Lead financial housekeeping initiatives and mentor juniors',
      text_placeholder: 'Explain your financial leadership contributions...'
    },
    {
      number: '1.1.6',
      title: 'Strategic Work Acquisition',
      description: 'Proactively secure high-value engagements',
      text_placeholder: 'Describe your work acquisition strategies...'
    }
  ];

  return (
    <Tabs defaultValue="metrics" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="metrics" className="cursor-pointer">Key Metrics</TabsTrigger>
        <TabsTrigger value="monthly" className="cursor-pointer">Monthly Progress</TabsTrigger>
        <TabsTrigger value="qualitative" className="cursor-pointer">Qualitative KPIs</TabsTrigger>
      </TabsList>

      <TabsContent value="metrics" className="space-y-4">
        <HoursSection />
      </TabsContent>

      <TabsContent value="monthly" className="space-y-4">
        <MonthlyBudgetSection />
        <PromotionSection />
      </TabsContent>

      <TabsContent value="qualitative">
        <QualitativeKPISectionBase 
          KPI_CONFIG={KPI_CONFIG} 
          type={types.PROFITABILITY}
        />
      </TabsContent>
    </Tabs>
  );
};

export default Profitability;