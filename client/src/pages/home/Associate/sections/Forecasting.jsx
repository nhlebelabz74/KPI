import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogHeader, AlertDialogTrigger, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UploadCloud, Save, Check, X, PlusCircle, MinusCircle, FileText, Calendar } from 'lucide-react';

// Associate section
const Forecasting = () => {
  const [forecasts, setForecasts] = useState({
    mondayCompleted: false,
    wednesdayCompleted: false,
    fridayCompleted: false,
    meetingsAttended: [],
    planningAhead: '',
    plansCompleted: false
  });

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await window.electronAPI.readAssociateFile();
        if (data) {
          setForecasts(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (error) {
        console.error('Error loading associate forecast data:', error);
      }
    };

    loadInitialData();
  }, []);

  const handleSaveForecasts = async () => {
    try {
      await window.electronAPI.saveAssociateFile(forecasts);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Failed to save forecast data:', error);
    }
  };

  const toggleDay = (day) => {
    setForecasts(prev => ({
      ...prev,
      [`${day}Completed`]: !prev[`${day}Completed`]
    }));
  };

  const togglePlans = () => {
    setForecasts(prev => ({
      ...prev,
      plansCompleted: !prev.plansCompleted
    }));
  };

  const addMeeting = () => {
    const date = prompt("Enter meeting date (YYYY-MM-DD):");
    if (date) {
      setForecasts(prev => ({
        ...prev,
        meetingsAttended: [...prev.meetingsAttended, { date, name: "Weekly Forecast Meeting" }]
      }));
    }
  };

  const removeMeeting = (index) => {
    setForecasts(prev => ({
      ...prev,
      meetingsAttended: prev.meetingsAttended.filter((_, i) => i !== index)
    }));
  };

  const handlePlanningChange = (e) => {
    setForecasts(prev => ({
      ...prev,
      planningAhead: e.target.value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Associate Forecasting (2.2)</CardTitle>
        <CardDescription>Manage forecasts and plan ahead to meet deadlines</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 2.2.1. Forecast completion checklist */}
          <div className="space-y-2">
            <Label>Forecast Completion Status (2.2.1)</Label>
            <p className="text-sm text-muted-foreground mb-2">
              To be completed timeously on Fridays, updated on Wednesdays and Monday and Wednesday meetings attended.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Monday Update</Label>
                  </div>
                  <Button 
                    variant={forecasts.mondayCompleted ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleDay('monday')}
                  >
                    {forecasts.mondayCompleted ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Wednesday Update</Label>
                  </div>
                  <Button 
                    variant={forecasts.wednesdayCompleted ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleDay('wednesday')}
                  >
                    {forecasts.wednesdayCompleted ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Friday Completion</Label>
                  </div>
                  <Button 
                    variant={forecasts.fridayCompleted ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleDay('friday')}
                  >
                    {forecasts.fridayCompleted ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Meetings attended */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Meetings Attended</Label>
              <Button size="sm" onClick={addMeeting}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Meeting
              </Button>
            </div>
            
            {forecasts.meetingsAttended.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Meeting</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forecasts.meetingsAttended.map((meeting, index) => (
                    <TableRow key={index}>
                      <TableCell>{meeting.date}</TableCell>
                      <TableCell>{meeting.name}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeMeeting(index)} 
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No meetings recorded. Click "Add Meeting" to add one.
              </div>
            )}
          </div>

          {/* 2.2.2. Plans ahead to meet deadlines */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Plans ahead to meet deadlines (2.2.2)</Label>
              <Button 
                variant={forecasts.plansCompleted ? "default" : "outline"} 
                size="sm"
                onClick={togglePlans}
              >
                {forecasts.plansCompleted ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
            <Textarea 
              placeholder="Enter your planning strategy for meeting deadlines..."
              className="min-h-32"
              value={forecasts.planningAhead}
              onChange={handlePlanningChange}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handleSaveForecasts}>
          Save Changes <Save className="ml-2 h-4 w-4" />
        </Button>

        {/* Success Dialog */}
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Forecast Data Saved</AlertDialogTitle>
              <AlertDialogDescription>
                Your forecast data has been saved successfully.
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

export default Forecasting;