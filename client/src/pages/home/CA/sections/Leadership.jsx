// CA/sections/ResponsiveLeadershipTeamwork.jsx
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

const Leadership = () => {
  // Dummy data for progress tracking
  const [progress, setProgress] = useState({
    responsiveLeadership: {
      ownership: 65,
      feedback: 80,
      initiative: 50,
      responsibility: 75,
      evidence: "",
      documents: []
    },
    teamwork: {
      interpersonalRelationships: 85,
      prejudices: 70,
      stressManagement: 60,
      assistColleagues: 90,
      responsibility: 80,
      loyalty: 75,
      advantageOfColleagues: 95,
      communication: 70,
      expectations: 85,
      priorities: 60,
      resource: 50,
      relationships: 75,
      evidence: "",
      peerReviews: []
    }
  });

  // Chart data for Responsive Leadership
  const leadershipData = [
    { name: "Ownership", value: progress.responsiveLeadership.ownership },
    { name: "Feedback", value: progress.responsiveLeadership.feedback },
    { name: "Initiative", value: progress.responsiveLeadership.initiative },
    { name: "Responsibility", value: progress.responsiveLeadership.responsibility }
  ];

  // Chart data for Teamwork
  const teamworkData = [
    { name: "Interpersonal", value: progress.teamwork.interpersonalRelationships },
    { name: "Prejudice Check", value: progress.teamwork.prejudices },
    { name: "Stress Mgmt", value: progress.teamwork.stressManagement },
    { name: "Assist Others", value: progress.teamwork.assistColleagues },
    { name: "Responsibility", value: progress.teamwork.responsibility },
    { name: "Loyalty", value: progress.teamwork.loyalty },
    { name: "No Advantage", value: progress.teamwork.advantageOfColleagues },
    { name: "Communication", value: progress.teamwork.communication }
  ];

  // Additional teamwork data for second chart (to avoid overcrowding)
  const teamworkData2 = [
    { name: "Expectations", value: progress.teamwork.expectations },
    { name: "Priorities", value: progress.teamwork.priorities },
    { name: "Resource", value: progress.teamwork.resource },
    { name: "Relationships", value: progress.teamwork.relationships }
  ];

  // Handle file upload for evidence
  const handleFileUpload = (section, fileList) => {
    // In a real app, you would process and store the files
    const newFiles = Array.from(fileList).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    if (section === "leadership") {
      setProgress(prev => ({
        ...prev,
        responsiveLeadership: {
          ...prev.responsiveLeadership,
          documents: [...prev.responsiveLeadership.documents, ...newFiles]
        }
      }));
    } else {
      setProgress(prev => ({
        ...prev,
        teamwork: {
          ...prev.teamwork,
          peerReviews: [...prev.teamwork.peerReviews, ...newFiles]
        }
      }));
    }
  };

  // Handle text evidence updates
  const handleEvidenceChange = (section, value) => {
    if (section === "leadership") {
      setProgress(prev => ({
        ...prev,
        responsiveLeadership: {
          ...prev.responsiveLeadership,
          evidence: value
        }
      }));
    } else {
      setProgress(prev => ({
        ...prev,
        teamwork: {
          ...prev.teamwork,
          evidence: value
        }
      }));
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Candidate Attorney KPI Tracker</h1>
      
      <Tabs defaultValue="leadership" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leadership">Responsive Leadership</TabsTrigger>
          <TabsTrigger value="teamwork">Team Work</TabsTrigger>
        </TabsList>
        
        {/* Responsive Leadership Tab */}
        <TabsContent value="leadership" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Responsive Leadership KPIs</CardTitle>
              <CardDescription>
                Leadership doesn't apply only to people in positions of power; it applies to all of us.
                It requires taking responsibility for the good of the firm, communities, and fellow people.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* KPI Progress Indicators */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>4.1.1. Demonstrates ownership of tasks, referring to supervisor for guidance</Label>
                    <span className="text-sm font-medium">{progress.responsiveLeadership.ownership}%</span>
                  </div>
                  <Progress value={progress.responsiveLeadership.ownership} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>4.1.2. Seeks and accepts feedback to inform learning/development</Label>
                    <span className="text-sm font-medium">{progress.responsiveLeadership.feedback}%</span>
                  </div>
                  <Progress value={progress.responsiveLeadership.feedback} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>4.1.3. Demonstrates initiative, implements learning quickly and takes action</Label>
                    <span className="text-sm font-medium">{progress.responsiveLeadership.initiative}%</span>
                  </div>
                  <Progress value={progress.responsiveLeadership.initiative} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>4.1.4. Takes responsibility for performance, initiating progress conversations</Label>
                    <span className="text-sm font-medium">{progress.responsiveLeadership.responsibility}%</span>
                  </div>
                  <Progress value={progress.responsiveLeadership.responsibility} />
                </div>
              </div>
              
              {/* Chart */}
              <Card className="p-4">
                <CardHeader>
                  <CardTitle className="text-lg">Leadership Skills Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={leadershipData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Evidence Section */}
              <div className="space-y-4">
                <Label htmlFor="leadership-evidence">Show that you have demonstrated responsive leadership:</Label>
                <Textarea 
                  id="leadership-evidence" 
                  placeholder="Describe how you've demonstrated the above leadership qualities..."
                  value={progress.responsiveLeadership.evidence}
                  onChange={(e) => handleEvidenceChange("leadership", e.target.value)}
                  className="min-h-32"
                />
                
                <div className="space-y-4">
                  <Label>Upload supporting documents:</Label>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="leadership-docs" className="cursor-pointer">
                      <div className="flex items-center gap-2 p-2 border-2 border-dashed rounded-md hover:bg-gray-50">
                        <Upload size={20} />
                        <span>Select document(s) to upload</span>
                      </div>
                      <Input 
                        id="leadership-docs" 
                        type="file" 
                        multiple 
                        className="hidden"
                        onChange={(e) => handleFileUpload("leadership", e.target.files)}
                      />
                    </Label>
                  </div>
                  
                  {/* Display uploaded documents */}
                  {progress.responsiveLeadership.documents.length > 0 && (
                    <div className="border rounded-md p-2 space-y-2">
                      <h4 className="text-sm font-medium">Uploaded Documents:</h4>
                      <ul className="space-y-1">
                        {progress.responsiveLeadership.documents.map((doc, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <FileText size={16} />
                            <span>{doc.name}</span>
                            <CheckCircle size={16} className="text-green-500 ml-auto" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Progress</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Team Work Tab */}
        <TabsContent value="teamwork" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Work KPIs</CardTitle>
              <CardDescription>
                Working effectively with colleagues while maintaining good interpersonal relationships
                and contributing positively to the department.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* KPI Progress Indicators - First Group */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>5.1.1. Has good interpersonal relationships with colleagues</Label>
                    <span className="text-sm font-medium">{progress.teamwork.interpersonalRelationships}%</span>
                  </div>
                  <Progress value={progress.teamwork.interpersonalRelationships} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>5.1.2. Check your prejudices at the door</Label>
                    <span className="text-sm font-medium">{progress.teamwork.prejudices}%</span>
                  </div>
                  <Progress value={progress.teamwork.prejudices} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>5.1.3. Not allowing stresses to dictate responses to colleagues</Label>
                    <span className="text-sm font-medium">{progress.teamwork.stressManagement}%</span>
                  </div>
                  <Progress value={progress.teamwork.stressManagement} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>5.1.4. Taking initiative in assisting colleagues who may be over-burdened</Label>
                    <span className="text-sm font-medium">{progress.teamwork.assistColleagues}%</span>
                  </div>
                  <Progress value={progress.teamwork.assistColleagues} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>5.1.5. Taking responsibility for your actions and their impact</Label>
                    <span className="text-sm font-medium">{progress.teamwork.responsibility}%</span>
                  </div>
                  <Progress value={progress.teamwork.responsibility} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>5.1.6. Don't throw people under a bus</Label>
                    <span className="text-sm font-medium">{progress.teamwork.loyalty}%</span>
                  </div>
                  <Progress value={progress.teamwork.loyalty} />
                </div>
              </div>
              
              {/* KPI Progress Indicators - Second Group */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>5.1.8. Not taking advantage of colleagues' willingness to assist</Label>
                    <span className="text-sm font-medium">{progress.teamwork.advantageOfColleagues}%</span>
                  </div>
                  <Progress value={progress.teamwork.advantageOfColleagues} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>5.1.9. Effective, confident communicator and department player</Label>
                    <span className="text-sm font-medium">{progress.teamwork.communication}%</span>
                  </div>
                  <Progress value={progress.teamwork.communication} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>5.1.10. Manages expectations and deadlines</Label>
                    <span className="text-sm font-medium">{progress.teamwork.expectations}%</span>
                  </div>
                  <Progress value={progress.teamwork.expectations} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>5.1.11. Plans and organizes work priorities</Label>
                    <span className="text-sm font-medium">{progress.teamwork.priorities}%</span>
                  </div>
                  <Progress value={progress.teamwork.priorities} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>5.1.12. Works as a resource for supervisor and wider department</Label>
                    <span className="text-sm font-medium">{progress.teamwork.resource}%</span>
                  </div>
                  <Progress value={progress.teamwork.resource} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>5.1.13. Establishes strong department relationships</Label>
                    <span className="text-sm font-medium">{progress.teamwork.relationships}%</span>
                  </div>
                  <Progress value={progress.teamwork.relationships} />
                </div>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Teamwork Skills (Part 1)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={teamworkData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="p-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Teamwork Skills (Part 2)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={teamworkData2}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              {/* Peer Review Section */}
              <div className="space-y-4">
                <Label htmlFor="teamwork-evidence">Request peer and manager reviews:</Label>
                <Textarea 
                  id="teamwork-evidence" 
                  placeholder="Add notes about peer reviews or feedback received..." 
                  value={progress.teamwork.evidence}
                  onChange={(e) => handleEvidenceChange("teamwork", e.target.value)}
                  className="min-h-32"
                />
                
                <div className="space-y-4">
                  <Label>Request and upload peer reviews:</Label>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="teamwork-reviews" className="cursor-pointer">
                      <div className="flex items-center gap-2 p-2 border-2 border-dashed rounded-md hover:bg-gray-50">
                        <Upload size={20} />
                        <span>Select peer review document(s)</span>
                      </div>
                      <Input 
                        id="teamwork-reviews" 
                        type="file" 
                        multiple 
                        className="hidden"
                        onChange={(e) => handleFileUpload("teamwork", e.target.files)}
                      />
                    </Label>
                  </div>
                  
                  {/* Display uploaded documents */}
                  {progress.teamwork.peerReviews.length > 0 && (
                    <div className="border rounded-md p-2 space-y-2">
                      <h4 className="text-sm font-medium">Peer Reviews Uploaded:</h4>
                      <ul className="space-y-1">
                        {progress.teamwork.peerReviews.map((doc, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <FileText size={16} />
                            <span>{doc.name}</span>
                            <CheckCircle size={16} className="text-green-500 ml-auto" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <Button className="w-full">Request New Peer Review</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Progress</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leadership;