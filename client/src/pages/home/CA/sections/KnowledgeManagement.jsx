import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogHeader, AlertDialogTrigger, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';
import { UploadCloud, Save, PlusCircle, MinusCircle } from 'lucide-react';

const KnowledgeManagement = () => {
  const [presentationsData, setPresentationsData] = useState({
    completedPresentations: 0,
    targetPresentations: 6,
    presentationDetails: ''
  });

  const [precedentsData, setPrecedentsData] = useState({
    completedPrecedents: 0,
    targetPrecedents: 3,
    precedentDetails: ''
  });

  const [knowledgeData, setKnowledgeData] = useState({
    conductKnowledgeDetails: ''
  });

  const [selectedFiles, setSelectedFiles] = useState({});
  const [existingPdfs, setExistingPdfs] = useState({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Simulating loading data from a file or API
        const savedPresentationsData = await window.electronAPI.readPresentationsFile('candidateAttorney');
        if (savedPresentationsData) {
          setPresentationsData(prev => ({
            ...prev,
            ...savedPresentationsData
          }));
        }

        const savedPrecedentsData = await window.electronAPI.readPrecedentsFile('candidateAttorney');
        if (savedPrecedentsData) {
          setPrecedentsData(prev => ({
            ...prev,
            ...savedPrecedentsData
          }));
        }

        const savedKnowledgeData = await window.electronAPI.readKnowledgeFile('candidateAttorney');
        if (savedKnowledgeData) {
          setKnowledgeData(prev => ({
            ...prev,
            ...savedKnowledgeData
          }));
        }

        // Check which PDFs exist
        const kpiIds = ['7.1.1', '7.1.2', '7.1.3'];
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
    } else if (dataType === 'knowledge') {
      setKnowledgeData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    }
  };

  const saveAllData = async () => {
    try {
      // Save presentations data
      await window.electronAPI.savePresentationsFile('candidateAttorney', presentationsData);
      
      // Save precedents data
      await window.electronAPI.savePrecedentsFile('candidateAttorney', precedentsData);
      
      // Save knowledge data
      await window.electronAPI.saveKnowledgeFile('candidateAttorney', knowledgeData);
      
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
      <h1 className="text-2xl font-bold">Knowledge Management - Candidate Attorney</h1>
      
      {/* Weekly Training Presentations */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Training Presentations (7.1.1)</CardTitle>
          <CardDescription>A minimum of six presentations at the weekly training sessions</CardDescription>
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
              <Button onClick={() => document.getElementById('file-7.1.1').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-7.1.1"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '7.1.1')}
                className="hidden"
              />
              {selectedFiles['7.1.1'] && (
                <span className="text-sm text-gray-500">{selectedFiles['7.1.1'].name}</span>
              )}
            </div>
            {existingPdfs['7.1.1'] && (
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
          <CardTitle>Precedents (7.1.2)</CardTitle>
          <CardDescription>Working on or updating a minimum of at least three precedents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Precedents Progress</Label>
              <Progress 
                value={(precedentsData.completedPrecedents / precedentsData.targetPrecedents) * 100} 
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
                <p>{precedentsData.completedPrecedents} of {precedentsData.targetPrecedents} precedents</p>
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
            
            <Textarea 
              placeholder="Provide details about the precedents you've worked on..."
              className="min-h-32 mb-4"
              value={precedentsData.precedentDetails}
              onChange={(e) => handleTextChange(e, 'precedentDetails', 'precedents')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-7.1.2').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-7.1.2"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '7.1.2')}
                className="hidden"
              />
              {selectedFiles['7.1.2'] && (
                <span className="text-sm text-gray-500">{selectedFiles['7.1.2'].name}</span>
              )}
            </div>
            {existingPdfs['7.1.2'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Knowledge of Attorneys Act and Code of Conduct */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Knowledge (7.1.3)</CardTitle>
          <CardDescription>Has basic knowledge of Attorneys Act and Code of Conduct</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Textarea 
              placeholder="Describe your knowledge of the Attorneys Act and Code of Conduct..."
              className="min-h-32 mb-4"
              value={knowledgeData.conductKnowledgeDetails}
              onChange={(e) => handleTextChange(e, 'conductKnowledgeDetails', 'knowledge')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-7.1.3').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-7.1.3"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '7.1.3')}
                className="hidden"
              />
              {selectedFiles['7.1.3'] && (
                <span className="text-sm text-gray-500">{selectedFiles['7.1.3'].name}</span>
              )}
            </div>
            {existingPdfs['7.1.3'] && (
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
}

export default KnowledgeManagement;