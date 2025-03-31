import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogHeader, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';
import { UploadCloud, Save, PlusCircle, MinusCircle } from 'lucide-react';

const KnowledgeManagement = () => {
  const [presentationsData, setPresentationsData] = useState({
    completedPresentations: 0,
    targetPresentations: 8,
    presentationDetails: ''
  });

  const [precedentsData, setPrecedentsData] = useState({
    completedPrecedents: 0,
    targetPrecedents: 5, // 3 + 2 with candidate attorney
    precedentDetails: '',
    candidateAttorneyCollaborations: 0
  });

  const [complianceData, setComplianceData] = useState({
    complianceDetails: ''
  });

  const [selectedFiles, setSelectedFiles] = useState({});
  const [existingPdfs, setExistingPdfs] = useState({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Simulating loading data from a file or API
        const savedPresentationsData = await window.electronAPI.readPresentationsFile('associate');
        if (savedPresentationsData) {
          setPresentationsData(prev => ({
            ...prev,
            ...savedPresentationsData
          }));
        }

        const savedPrecedentsData = await window.electronAPI.readPrecedentsFile('associate');
        if (savedPrecedentsData) {
          setPrecedentsData(prev => ({
            ...prev,
            ...savedPrecedentsData
          }));
        }

        const savedComplianceData = await window.electronAPI.readComplianceFile('associate');
        if (savedComplianceData) {
          setComplianceData(prev => ({
            ...prev,
            ...savedComplianceData
          }));
        }

        // Check which PDFs exist
        const kpiIds = ['7.2.1', '7.2.2', '7.2.3'];
        const pdfStatus = {};
        
        for (const kpiId of kpiIds) {
          pdfStatus[kpiId] = await window.electronAPI.checkPdfExists(kpiId);
        }
        
        setExistingPdfs(pdfStatus);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };
    
    loadSavedData();
  }, []);

  const updatePresentations = (amount) => {
    setPresentationsData(prev => {
      const newValue = Math.max(0, prev.completedPresentations + amount);
      return {
        ...prev,
        completedPresentations: newValue
      };
    });
  };

  const updatePrecedents = (amount) => {
    setPrecedentsData(prev => {
      const newValue = Math.max(0, prev.completedPrecedents + amount);
      return {
        ...prev,
        completedPrecedents: newValue
      };
    });
  };

  const updateCandidateCollaborations = (amount) => {
    setPrecedentsData(prev => {
      const newValue = Math.max(0, prev.candidateAttorneyCollaborations + amount);
      const maxValue = 2; // Maximum 2 collaborations required
      return {
        ...prev,
        candidateAttorneyCollaborations: Math.min(newValue, maxValue)
      };
    });
  };

  const handleFileChange = (event, kpiId) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFiles(prev => ({
        ...prev,
        [kpiId]: file
      }));
    }
  };

  const handleTextChange = (event, field, dataType) => {
    if (dataType === 'presentations') {
      setPresentationsData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    } else if (dataType === 'precedents') {
      setPrecedentsData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    } else if (dataType === 'compliance') {
      setComplianceData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    }
  };

  const saveAllData = async () => {
    try {
      // Save presentations data
      await window.electronAPI.savePresentationsFile('associate', presentationsData);
      
      // Save precedents data
      await window.electronAPI.savePrecedentsFile('associate', precedentsData);
      
      // Save compliance data
      await window.electronAPI.saveComplianceFile('associate', complianceData);
      
      // Save uploaded files
      for (const kpiId in selectedFiles) {
        await window.electronAPI.saveFile(kpiId, selectedFiles[kpiId]);
        
        // Update existing PDFs status
        setExistingPdfs(prev => ({
          ...prev,
          [kpiId]: true
        }));
      }
      
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Knowledge Management - Associate</h1>
      
      {/* Weekly Training Presentations */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Training Presentations (7.2.1)</CardTitle>
          <CardDescription>A minimum of eight internal presentations at the weekly training sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Presentations Progress</Label>
              <Progress 
                value={(presentationsData.completedPresentations / presentationsData.targetPresentations) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updatePresentations(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <p>{presentationsData.completedPresentations} of {presentationsData.targetPresentations} presentations</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updatePresentations(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Textarea 
              placeholder="Provide details about your presentations..."
              className="min-h-32 mb-4"
              value={presentationsData.presentationDetails}
              onChange={(e) => handleTextChange(e, 'presentationDetails', 'presentations')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-7.2.1').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-7.2.1"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '7.2.1')}
                className="hidden"
              />
              {selectedFiles['7.2.1'] && (
                <span className="text-sm text-gray-500">{selectedFiles['7.2.1'].name}</span>
              )}
            </div>
            {existingPdfs['7.2.1'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Precedents */}
      <Card>
        <CardHeader>
          <CardTitle>Precedents (7.2.2)</CardTitle>
          <CardDescription>Working on or updating a minimum of three precedents plus two with a candidate attorney</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Individual Precedents Progress</Label>
              <Progress 
                value={(precedentsData.completedPrecedents / 3) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updatePrecedents(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <p>{precedentsData.completedPrecedents} of 3 individual precedents</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updatePrecedents(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-4">
              <Label>Candidate Attorney Collaborations</Label>
              <Progress 
                value={(precedentsData.candidateAttorneyCollaborations / 2) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateCandidateCollaborations(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <p>{precedentsData.candidateAttorneyCollaborations} of 2 candidate attorney collaborations</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateCandidateCollaborations(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Textarea 
              placeholder="Provide details about the precedents you've worked on..."
              className="min-h-32 mb-4 mt-4"
              value={precedentsData.precedentDetails}
              onChange={(e) => handleTextChange(e, 'precedentDetails', 'precedents')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-7.2.2').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-7.2.2"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '7.2.2')}
                className="hidden"
              />
              {selectedFiles['7.2.2'] && (
                <span className="text-sm text-gray-500">{selectedFiles['7.2.2'].name}</span>
              )}
            </div>
            {existingPdfs['7.2.2'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* SRA Code of Conduct Knowledge */}
      <Card>
        <CardHeader>
          <CardTitle>SRA Code of Conduct and Compliance (7.2.3)</CardTitle>
          <CardDescription>Understands own obligations under the SRA Code of Conduct and demonstrates awareness of risk and compliance issues in the context of day to day activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Textarea 
              placeholder="Describe your understanding of SRA Code of Conduct and how you address compliance issues..."
              className="min-h-32 mb-4"
              value={complianceData.complianceDetails}
              onChange={(e) => handleTextChange(e, 'complianceDetails', 'compliance')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-7.2.3').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-7.2.3"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '7.2.3')}
                className="hidden"
              />
              {selectedFiles['7.2.3'] && (
                <span className="text-sm text-gray-500">{selectedFiles['7.2.3'].name}</span>
              )}
            </div>
            {existingPdfs['7.2.3'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveAllData}>
          <Save className="mr-2 h-4 w-4" /> Save All Changes
        </Button>
      </div>
      
      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Data Saved Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              Your knowledge management data has been saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default KnowledgeManagement;