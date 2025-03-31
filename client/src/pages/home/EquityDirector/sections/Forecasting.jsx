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

// Salaried and Equity Director section
const Forecasting = () => {
  const [forecasts, setForecasts] = useState({
    fridayCompleted: false,
    wednesdayCompleted: false,
    mondayCompleted: false,
    meetingsAttended: [],
    coDirectorCoordination: '',
    forecastManagement: '',
    otherDirectorsCoordinated: []
  });

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await window.electronAPI.readDirectorFile();
        if (data) {
          setForecasts(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (error) {
        console.error('Error loading director forecast data:', error);
      }
    };

    loadInitialData();
  }, []);

  const handleSaveForecasts = async () => {
    try {
      await window.electronAPI.saveDirectorFile(forecasts);
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

  const addDirector = () => {
    const name = prompt("Enter co-director's name:");
    if (name) {
      setForecasts(prev => ({
        ...prev,
        otherDirectorsCoordinated: [...prev.otherDirectorsCoordinated, { name, date: new Date().toISOString().split('T')[0] }]
      }));
    }
  };

  const removeDirector = (index) => {
    setForecasts(prev => ({
      ...prev,
      otherDirectorsCoordinated: prev.otherDirectorsCoordinated.filter((_, i) => i !== index)
    }));
  };

  const handleTextChange = (field, value) => {
    setForecasts(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salaried and Equity Director Forecasting (2.4)</CardTitle>
        <CardDescription>Manage forecasts, coordinate with other directors, and ensure proper team forecasting</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 2.4.1. Forecast completion checklist */}
          <div className="space-y-2">
            <Label>Forecast Completion Status (2.4.1)</Label>
            <p className="text-sm text-muted-foreground mb-2">
              To be completed timeously on Fridays to allow juniors to plan their forecasts, updated on Wednesdays and Monday and Wednesday meetings attended.
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

          {/* 2.4.2. Coordinate with other directors */}
          <div className="space-y-4">
            <Label>Co-ordinate with other directors (2.4.2)</Label>
            <p className="text-sm text-muted-foreground mb-2">
              To co-ordinate with other directors to effectively plan the week's forecast.
            </p>
            
            <div className="space-y-2">
              <Textarea 
                placeholder="Describe how you coordinate with other directors..."
                className="min-h-24"
                value={forecasts.coDirectorCoordination}
                onChange={(e) => handleTextChange('coDirectorCoordination', e.target.value)}
              />
            </div>
            
            {/* Directors coordinated with */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Directors Coordinated With</Label>
                <Button size="sm" onClick={addDirector}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Director
                </Button>
              </div>
              
              {forecasts.otherDirectorsCoordinated.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forecasts.otherDirectorsCoordinated.map((director, index) => (
                      <TableRow key={index}>
                        <TableCell>{director.name}</TableCell>
                        <TableCell>{director.date}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeDirector(index)} 
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
                  No directors recorded. Click "Add Director" to add one.
                </div>
              )}
            </div>
          </div>

          {/* 2.4.3. Forecast management */}
          <div className="space-y-2">
            <Label>Forecast Management (2.4.3)</Label>
            <p className="text-sm text-muted-foreground mb-2">
              To ensure all lawyers have adequately managed forecasts so nobody is over or underutilised.
            </p>
            <Textarea 
              placeholder="Describe how you ensure balanced forecasts across the team..."
              className="min-h-32"
              value={forecasts.forecastManagement}
              onChange={(e) => handleTextChange('forecastManagement', e.target.value)}
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