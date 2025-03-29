import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { UploadCloud, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Profitability = () => {
  // Constants
  const TOTAL_ANNUAL_BUDGET = 6000000; // 6 million
  const PROMOTION_THRESHOLD = TOTAL_ANNUAL_BUDGET * 3;
  const MONTHLY_PERCENTAGES = [15, 7.5, 7.5, 9, 9, 9, 10, 12, 12, 5, 4];
  const MONTHS = ['Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026'];
  
  // Calculate monthly budget targets
  const monthlyBudgetTargets = MONTHLY_PERCENTAGES.map(percentage => (TOTAL_ANNUAL_BUDGET * percentage) / 100);
  
  // State for tracking metrics
  const [billableHours, setBillableHours] = useState(850);
  const [nonBillableHours, setNonBillableHours] = useState(90);
  const [writtenOffHours, setWrittenOffHours] = useState(320);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // State for monthly data entry
  const [monthlyData, setMonthlyData] = useState(
    MONTHS.map((month, index) => ({
      name: month,
      target: monthlyBudgetTargets[index],
      billed: index === 0 ? 850000 : index === 1 ? 430000 : 0, // Hardcoded values for March and April
      billable: index === 0 ? 70 : index === 1 ? 35 : 0,
      nonBillable: index === 0 ? 10 : index === 1 ? 5 : 0,
      evidence: null
    }))
  );
  
  // State for current month being edited
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [currentMonthBillable, setCurrentMonthBillable] = useState(monthlyData[0].billable);
  const [currentMonthNonBillable, setCurrentMonthNonBillable] = useState(monthlyData[0].nonBillable);
  const [currentMonthBilled, setCurrentMonthBilled] = useState(monthlyData[0].billed);
  const [currentMonthEvidence, setCurrentMonthEvidence] = useState(null);
  
  // Calculate total billed amount and progress
  const totalBilledAmount = monthlyData.reduce((sum, month) => sum + month.billed, 0);
  const progressToPromotion = (totalBilledAmount / PROMOTION_THRESHOLD) * 100;
  
  // Handle file selection
  const handleFileChange = (event, id) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (id === 'monthlyEvidence') {
        setCurrentMonthEvidence(file);
      } else {
        setSelectedFile(file);
      }
    } else {
      alert('Please select a PDF file');
    }
  };
  
  // Handle saving monthly data
  const saveMonthlyData = () => {
    const updatedData = [...monthlyData];
    updatedData[selectedMonth] = {
      ...updatedData[selectedMonth],
      billable: currentMonthBillable,
      nonBillable: currentMonthNonBillable,
      billed: currentMonthBilled,
      evidence: currentMonthEvidence ? currentMonthEvidence.name : null
    };
    
    setMonthlyData(updatedData);
    
    // Update overall metrics based on all monthly data
    const totalBillable = updatedData.reduce((sum, month) => sum + parseInt(month.billable || 0), 0);
    const totalNonBillable = updatedData.reduce((sum, month) => sum + parseInt(month.nonBillable || 0), 0);
    
    setBillableHours(totalBillable);
    setNonBillableHours(totalNonBillable);
    
    // Save to JSON file (simulated)
    saveToJson(updatedData);
    
    setAlertMessage('Monthly data saved successfully!');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };
  
  // Simulated function to save data to JSON
  const saveToJson = (data) => {
    console.log('Saving data to JSON:', data);
    // In a real application, you would use an API call or filesystem methods
    // For now, we'll just output to console and show an alert
  };
  
  // Handle saving qualitative KPI data
  const saveQualitativeData = () => {
    setAlertMessage('Qualitative data saved successfully!');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };
  
  // Update form fields when selected month changes
  useEffect(() => {
    setCurrentMonthBillable(monthlyData[selectedMonth].billable);
    setCurrentMonthNonBillable(monthlyData[selectedMonth].nonBillable);
    setCurrentMonthBilled(monthlyData[selectedMonth].billed);
    setCurrentMonthEvidence(null);
  }, [selectedMonth]);
  
  // Data for pie chart showing billable vs written off
  const billingEfficiencyData = [
    { name: 'Billed', value: billableHours - writtenOffHours },
    { name: 'Written Off', value: writtenOffHours }
  ];
  
  // Prepare data for budget tracking chart
  const budgetTrackingData = monthlyData.map(month => ({
    name: month.name,
    target: month.target,
    billed: month.billed,
    achieved: month.target > 0 ? (month.billed / month.target) * 100 : 0
  }));
  
  const COLORS = ['#0088FE', '#FF8042'];
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Production and Profitability</h1>
      <h2 className="text-2xl font-semibold mb-4">Candidate Attorney</h2>
      
      {showAlert && (
        <Alert className="mb-4 bg-green-100 border-green-400">
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Progress</TabsTrigger>
          <TabsTrigger value="qualitative">Qualitative KPIs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Billable Hours</CardTitle>
                <CardDescription>Annual Target: 1200 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Progress: {billableHours} hours</span>
                      <span className="text-sm font-medium">{Math.round((billableHours / 1200) * 100)}%</span>
                    </div>
                    <Progress value={(billableHours / 1200) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Non-Billable Hours</CardTitle>
                <CardDescription>Annual Target: 150 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Progress: {nonBillableHours} hours</span>
                      <span className="text-sm font-medium">{Math.round((nonBillableHours / 150) * 100)}%</span>
                    </div>
                    <Progress value={(nonBillableHours / 150) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Written Off Hours</CardTitle>
                <CardDescription>Should be less than 50% of billable hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{writtenOffHours} hours written off</span>
                      <span className={`text-sm font-medium ${(writtenOffHours / billableHours) > 0.5 ? 'text-red-500' : 'text-green-500'}`}>
                        {Math.round((writtenOffHours / billableHours) * 100)}% of billable
                      </span>
                    </div>
                    <Progress 
                      value={(writtenOffHours / billableHours) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Billing Efficiency</CardTitle>
                <CardDescription>Percentage of billable hours not written off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={billingEfficiencyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {billingEfficiencyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Progress to Promotion</CardTitle>
                <CardDescription>Target: R{(PROMOTION_THRESHOLD / 1000000).toFixed(1)} million (3x annual budget)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Billed: R{(totalBilledAmount / 1000000).toFixed(2)} million
                      </span>
                      <span className="text-sm font-medium">{progressToPromotion.toFixed(1)}%</span>
                    </div>
                    <Progress value={progressToPromotion} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="monthly">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Budget Achievement by Month</CardTitle>
              <CardDescription>Monthly budget targets vs actual billed amount</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={budgetTrackingData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" label={{ value: 'Amount (R)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: '% Achieved', angle: 90, position: 'insideRight' }} />
                    <Tooltip formatter={(value, name) => [
                      name === 'achieved' ? `${value.toFixed(1)}%` : `R${(value / 1000000).toFixed(2)}M`, 
                      name === 'achieved' ? '% Achieved' : name === 'target' ? 'Target' : 'Billed'
                    ]} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="target" fill="#8884d8" name="Target (R)" />
                    <Bar yAxisId="left" dataKey="billed" fill="#82ca9d" name="Billed (R)" />
                    <ReferenceLine yAxisId="right" y={100} stroke="red" strokeDasharray="3 3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Hours Entry</CardTitle>
              <CardDescription>Record your billable and non-billable hours for each month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Select Month</Label>
                  <div className="flex flex-wrap gap-2">
                    {MONTHS.map((month, index) => (
                      <Button 
                        key={month}
                        variant={selectedMonth === index ? "default" : "outline"} 
                        onClick={() => setSelectedMonth(index)}
                      >
                        {month}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthBillable">Billable Hours</Label>
                    <Input 
                      id="monthBillable" 
                      type="number" 
                      value={currentMonthBillable}
                      onChange={(e) => setCurrentMonthBillable(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="monthNonBillable">Non-Billable Hours</Label>
                    <Input 
                      id="monthNonBillable" 
                      type="number" 
                      value={currentMonthNonBillable}
                      onChange={(e) => setCurrentMonthNonBillable(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="monthBilled">Billed Amount (R)</Label>
                    <Input 
                      id="monthBilled" 
                      type="number" 
                      value={currentMonthBilled}
                      onChange={(e) => setCurrentMonthBilled(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Upload Evidence (PDF)</Label>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => document.getElementById('monthlyEvidence').click()}>
                      <UploadCloud className="mr-2 h-4 w-4" /> Upload
                    </Button>
                    <input
                      id="monthlyEvidence"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, 'monthlyEvidence')}
                      className="hidden"
                    />
                    {currentMonthEvidence && <span className="text-sm text-gray-500">{currentMonthEvidence.name}</span>}
                  </div>
                </div>
                
                <Button onClick={saveMonthlyData} className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Save {MONTHS[selectedMonth]} Data
                </Button>
                
                <div className="p-4 bg-gray-100 rounded-md">
                  <p className="text-sm text-gray-700">
                    <strong>Current month target:</strong> R{(monthlyData[selectedMonth].target / 1000000).toFixed(2)}M ({MONTHLY_PERCENTAGES[selectedMonth]}% of annual budget)
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Achievement:</strong> {monthlyData[selectedMonth].target > 0 ? ((monthlyData[selectedMonth].billed / monthlyData[selectedMonth].target) * 100).toFixed(1) : 0}% of target
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="qualitative">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Time Tracking Accuracy</CardTitle>
                <CardDescription>KPI 1.1.4: Accurately captures all time (billable and non-billable)</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Show that you have accurately captured all time..."
                  className="min-h-32 mb-4"
                />
                <div className="flex items-center gap-2 mb-4">
                  <Button onClick={() => document.getElementById('timeTrackingFile').click()}>
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
                  </Button>
                  <input
                    id="timeTrackingFile"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile && <span className="text-sm text-gray-500">{selectedFile.name}</span>}
                </div>
                <Button onClick={saveQualitativeData}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Financial Housekeeping</CardTitle>
                <CardDescription>KPI 1.1.5: Understands and applies LNP's financial housekeeping principles and procedures</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Show that you have understood and applied LNP's financial housekeeping principles..."
                  className="min-h-32 mb-4"
                />
                <div className="flex items-center gap-2 mb-4">
                  <Button onClick={() => document.getElementById('financialFile').click()}>
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
                  </Button>
                  <input
                    id="financialFile"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <Button onClick={saveQualitativeData}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Technology Efficiency</CardTitle>
                <CardDescription>KPI 1.1.6: Effectively uses technology and support services to achieve the most efficient delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Show that you have effectively used technology and support services..."
                  className="min-h-32 mb-4"
                />
                <div className="flex items-center gap-2 mb-4">
                  <Button onClick={() => document.getElementById('technologyFile').click()}>
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
                  </Button>
                  <input
                    id="technologyFile"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <Button onClick={saveQualitativeData}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Proactive Work Seeking</CardTitle>
                <CardDescription>KPI 1.1.7: Seeks work when underutilised</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Show that you have proactively sought work when underutilised..."
                  className="min-h-32 mb-4"
                />
                <div className="flex items-center gap-2 mb-4">
                  <Button onClick={() => document.getElementById('workSeekingFile').click()}>
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
                  </Button>
                  <input
                    id="workSeekingFile"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <Button onClick={saveQualitativeData}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profitability;