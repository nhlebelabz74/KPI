import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Dummy data for demonstration
const contractsData = [
  { month: 'Jan', count: 0 },
  { month: 'Feb', count: 1 },
  { month: 'Mar', count: 0 },
  { month: 'Apr', count: 1 },
  { month: 'May', count: 0 },
  { month: 'Jun', count: 0 },
  { month: 'Jul', count: 0 },
  { month: 'Aug', count: 0 },
  { month: 'Sep', count: 0 },
  { month: 'Oct', count: 0 },
  { month: 'Nov', count: 0 },
  { month: 'Dec', count: 0 },
];

const disputesData = [
  { month: 'Jan', count: 0 },
  { month: 'Feb', count: 0 },
  { month: 'Mar', count: 1 },
  { month: 'Apr', count: 0 },
  { month: 'May', count: 1 },
  { month: 'Jun', count: 0 },
  { month: 'Jul', count: 0 },
  { month: 'Aug', count: 0 },
  { month: 'Sep', count: 0 },
  { month: 'Oct', count: 0 },
  { month: 'Nov', count: 0 },
  { month: 'Dec', count: 0 },
];

const articlesData = [
  { month: 'Jan', count: 1 },
  { month: 'Feb', count: 0 },
  { month: 'Mar', count: 0 },
  { month: 'Apr', count: 1 },
  { month: 'May', count: 0 },
  { month: 'Jun', count: 0 },
  { month: 'Jul', count: 0 },
  { month: 'Aug', count: 0 },
  { month: 'Sep', count: 0 },
  { month: 'Oct', count: 0 },
  { month: 'Nov', count: 0 },
  { month: 'Dec', count: 0 },
];

const TechnicalSkills = () => {
  const [files, setFiles] = useState({
    contracts: [],
    disputes: [],
    completedDispute: null,
    articles: [],
    briefs: null,
    research: null,
    credibility: null,
    furtherSteps: null,
    writing: null,
    problemSolving: null,
    fileManagement: null,
    knowledge: null,
    roleUnderstanding: null,
    awareness: null,
    development: null,
    training: null,
    lawReports: null,
  });

  const handleFileChange = (section, index = null) => (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (index !== null) {
      // For array-based sections (like contracts, disputes, articles)
      setFiles(prev => {
        const newArray = [...prev[section]];
        newArray[index] = selectedFiles[0];
        return { ...prev, [section]: newArray };
      });
    } else {
      // For single file sections
      setFiles(prev => ({ ...prev, [section]: selectedFiles[0] }));
    }
  };

  const addFileSlot = (section) => {
    setFiles(prev => ({
      ...prev,
      [section]: [...prev[section], null]
    }));
  };

  // Calculate progress
  const totalContractsRequired = 2;
  const totalDisputesRequired = 2;
  const totalArticlesRequired = 4;
  
  const contractsCompleted = contractsData.reduce((sum, item) => sum + item.count, 0);
  const disputesCompleted = disputesData.reduce((sum, item) => sum + item.count, 0);
  const articlesCompleted = articlesData.reduce((sum, item) => sum + item.count, 0);
  
  const contractsProgress = Math.min((contractsCompleted / totalContractsRequired) * 100, 100);
  const disputesProgress = Math.min((disputesCompleted / totalDisputesRequired) * 100, 100);
  const articlesProgress = Math.min((articlesCompleted / totalArticlesRequired) * 100, 100);

  // Combined data for stacked bar chart
  const combinedData = contractsData.map((item, index) => ({
    month: item.month,
    Contracts: item.count,
    Disputes: disputesData[index].count,
    Articles: articlesData[index].count
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Technical Skill - Candidate Attorney KPIs</h1>
      
      <Tabs defaultValue="quantitative" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="quantitative">Quantitative Metrics</TabsTrigger>
          <TabsTrigger value="qualitative">Qualitative Requirements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quantitative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contract and Dispute Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Contracts & Disputes Tracking</CardTitle>
                <CardDescription>
                  Required: At least two contracts and two disputes worked on during the year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span>Contracts: {contractsCompleted}/{totalContractsRequired}</span>
                    <span>{contractsProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={contractsProgress} className="h-2 mb-4" />
                  
                  <div className="flex justify-between mb-2">
                    <span>Disputes: {disputesCompleted}/{totalDisputesRequired}</span>
                    <span>{disputesProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={disputesProgress} className="h-2 mb-2" />
                </div>
                
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Contracts" fill="#8884d8" />
                    <Bar dataKey="Disputes" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <h4 className="font-medium mb-2">Upload Evidence for Contracts</h4>
                {files.contracts.map((file, index) => (
                  <div key={`contract-${index}`} className="w-full mb-2 flex items-center">
                    <Input 
                      type="file" 
                      id={`contract-file-${index}`} 
                      onChange={handleFileChange('contracts', index)} 
                      className="mr-2"
                    />
                    <span>{file ? file.name : "No file selected"}</span>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={() => addFileSlot('contracts')} 
                  className="mt-2"
                >
                  Add Contract Evidence
                </Button>

                <h4 className="font-medium mt-4 mb-2">Upload Evidence for Disputes</h4>
                {files.disputes.map((file, index) => (
                  <div key={`dispute-${index}`} className="w-full mb-2 flex items-center">
                    <Input 
                      type="file" 
                      id={`dispute-file-${index}`} 
                      onChange={handleFileChange('disputes', index)} 
                      className="mr-2"
                    />
                    <span>{file ? file.name : "No file selected"}</span>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={() => addFileSlot('disputes')} 
                  className="mt-2"
                >
                  Add Dispute Evidence
                </Button>
              </CardFooter>
            </Card>

            {/* Completed Dispute */}
            <Card>
              <CardHeader>
                <CardTitle>Full Dispute/Contract Completion</CardTitle>
                <CardDescription>
                  Required: At least one dispute/contract seen through from start to finish during articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Textarea 
                    placeholder="Show that you have completed a dispute/contract from start to finish..." 
                    className="min-h-32"
                  />
                </div>
                <div className="my-4">
                  <Label htmlFor="completed-dispute-file">Upload Evidence</Label>
                  <Input 
                    type="file" 
                    id="completed-dispute-file" 
                    onChange={handleFileChange('completedDispute')} 
                  />
                  {files.completedDispute && (
                    <p className="mt-2 text-sm">Selected: {files.completedDispute.name}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Articles */}
            <Card>
              <CardHeader>
                <CardTitle>Articles Drafting</CardTitle>
                <CardDescription>
                  Required: At least four articles per year - means having read the case/legislation and done the first draft
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <span>Articles: {articlesCompleted}/{totalArticlesRequired}</span>
                  <span>{articlesProgress.toFixed(0)}%</span>
                </div>
                <Progress value={articlesProgress} className="h-2 mb-4" />
                
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={articlesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Articles" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <h4 className="font-medium mb-2">Upload Article Drafts</h4>
                {files.articles.map((file, index) => (
                  <div key={`article-${index}`} className="w-full mb-2 flex items-center">
                    <Input 
                      type="file" 
                      id={`article-file-${index}`} 
                      onChange={handleFileChange('articles', index)} 
                      className="mr-2"
                    />
                    <span>{file ? file.name : "No file selected"}</span>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={() => addFileSlot('articles')} 
                  className="mt-2"
                >
                  Add Article Evidence
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="qualitative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Briefs to Counsel */}
            <Card>
              <CardHeader>
                <CardTitle>Drafting Briefs to Counsel</CardTitle>
                <CardDescription>
                  Having mastered drafting briefs to counsel in accordance with the briefs to counsel protocol
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Show that you have mastered drafting briefs to counsel..." 
                  className="min-h-32 mb-4"
                />
                <div>
                  <Label htmlFor="brief-file">Upload Evidence</Label>
                  <Input 
                    type="file" 
                    id="brief-file" 
                    onChange={handleFileChange('briefs')} 
                  />
                  {files.briefs && (
                    <p className="mt-2 text-sm">Selected: {files.briefs.name}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Research */}
            <Card>
              <CardHeader>
                <CardTitle>On-Point Research</CardTitle>
                <CardDescription>
                  Producing research when requested which is on point and able to be used
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Show that you have produced on-point research..." 
                  className="min-h-32 mb-4"
                />
                <div>
                  <Label htmlFor="research-file">Upload Evidence</Label>
                  <Input 
                    type="file" 
                    id="research-file" 
                    onChange={handleFileChange('research')} 
                  />
                  {files.research && (
                    <p className="mt-2 text-sm">Selected: {files.research.name}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Credibility */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Credibility</CardTitle>
                <CardDescription>
                  Establishes personal credibility by consistently delivering high quality work, inspiring confidence in clients and colleagues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Show that you have established personal credibility..." 
                  className="min-h-32 mb-4"
                />
                <div>
                  <Label htmlFor="credibility-file">Upload Evidence</Label>
                  <Input 
                    type="file" 
                    id="credibility-file" 
                    onChange={handleFileChange('credibility')} 
                  />
                  {files.credibility && (
                    <p className="mt-2 text-sm">Selected: {files.credibility.name}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Further Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Initiative</CardTitle>
                <CardDescription>
                  Considers and proposes further steps beyond the initial task
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Show that you have proposed further steps beyond initial tasks..." 
                  className="min-h-32 mb-4"
                />
                <div>
                  <Label htmlFor="further-steps-file">Upload Evidence</Label>
                  <Input 
                    type="file" 
                    id="further-steps-file" 
                    onChange={handleFileChange('furtherSteps')} 
                  />
                  {files.furtherSteps && (
                    <p className="mt-2 text-sm">Selected: {files.furtherSteps.name}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Writing Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Writing and Drafting Skills</CardTitle>
                <CardDescription>
                  Strong writing and drafting skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Show that you have strong writing and drafting skills..." 
                  className="min-h-32 mb-4"
                />
                <div>
                  <Label htmlFor="writing-file">Upload Evidence</Label>
                  <Input 
                    type="file" 
                    id="writing-file" 
                    onChange={handleFileChange('writing')} 
                  />
                  {files.writing && (
                    <p className="mt-2 text-sm">Selected: {files.writing.name}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Problem Solving */}
            <Card>
              <CardHeader>
                <CardTitle>Problem Solving</CardTitle>
                <CardDescription>
                  Undertakes research to solve problems and present effective solutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Show that you have undertaken research to solve problems..." 
                  className="min-h-32 mb-4"
                />
                <div>
                  <Label htmlFor="problem-solving-file">Upload Evidence</Label>
                  <Input 
                    type="file" 
                    id="problem-solving-file" 
                    onChange={handleFileChange('problemSolving')} 
                  />
                  {files.problemSolving && (
                    <p className="mt-2 text-sm">Selected: {files.problemSolving.name}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* File Management */}
            <Card>
              <CardHeader>
                <CardTitle>File Management</CardTitle>
                <CardDescription>
                  Manages accurate and organised files that adhere to compliance and risk protocols
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Show that you have managed accurate and organised files..." 
                  className="min-h-32 mb-4"
                />
                <div>
                  <Label htmlFor="file-management-file">Upload Evidence</Label>
                  <Input 
                    type="file" 
                    id="file-management-file" 
                    onChange={handleFileChange('fileManagement')} 
                  />
                  {files.fileManagement && (
                    <p className="mt-2 text-sm">Selected: {files.fileManagement.name}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Other qualitative requirements can be added similarly */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Requirements</CardTitle>
                <CardDescription>
                  Other technical skill requirements (3.1.11 - 3.1.16)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">3.1.11. Builds on knowledge and skills from previous instructions</h4>
                  <Textarea 
                    placeholder="Show that you have built on knowledge from previous instructions..." 
                    className="min-h-24 mb-2"
                  />
                  <Input 
                    type="file" 
                    id="knowledge-file" 
                    onChange={handleFileChange('knowledge')} 
                    className="mt-1"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-2">3.1.12. Understands how role contributes to the department structure</h4>
                  <Textarea 
                    placeholder="Show that you understand how your role contributes..." 
                    className="min-h-24 mb-2"
                  />
                  <Input 
                    type="file" 
                    id="role-file" 
                    onChange={handleFileChange('roleUnderstanding')} 
                    className="mt-1" 
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-2">3.1.13. Awareness of business, current affairs, compliance, regulation and legal sector</h4>
                  <Textarea 
                    placeholder="Show your awareness of business and legal sector..." 
                    className="min-h-24 mb-2"
                  />
                  <Input 
                    type="file" 
                    id="awareness-file" 
                    onChange={handleFileChange('awareness')} 
                    className="mt-1"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-2">3.1.14. Seeks to continually develop a breadth of knowledge and expertise</h4>
                  <Textarea 
                    placeholder="Show how you continually develop knowledge..." 
                    className="min-h-24 mb-2"
                  />
                  <Input 
                    type="file" 
                    id="development-file" 
                    onChange={handleFileChange('development')} 
                    className="mt-1"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-2">3.1.15. Uses available resources and participates in training to develop skills</h4>
                  <Textarea 
                    placeholder="Show how you use resources to develop skills..." 
                    className="min-h-24 mb-2"
                  />
                  <Input 
                    type="file" 
                    id="training-file" 
                    onChange={handleFileChange('training')} 
                    className="mt-1"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-2">3.1.16. Regularly reads significant law reports in full</h4>
                  <Textarea 
                    placeholder="Show that you regularly read law reports..." 
                    className="min-h-24 mb-2"
                  />
                  <Input 
                    type="file" 
                    id="law-reports-file" 
                    onChange={handleFileChange('lawReports')} 
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button className="mr-2" variant="outline">Save Draft</Button>
        <Button>Submit KPI Assessment</Button>
      </div>
    </div>
  );
};

export default TechnicalSkills;