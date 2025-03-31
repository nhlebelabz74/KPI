import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogHeader, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';
import { UploadCloud, Save, PlusCircle, MinusCircle } from 'lucide-react';

// Senior Associate Knowledge Management Component
const KnowledgeManagement = () => {
  const [presentationsData, setPresentationsData] = useState({
    completedPresentations: 0,
    targetPresentations: 4,
    presentationDetails: '',
    supervisedAssociatePresentations: 0,
    targetSupervisedAssociatePresentations: 4,
    supervisedAssociateDetails: '',
    supervisedCAPresentations: 0,
    targetSupervisedCAPresentations: 4,
    supervisedCADetails: ''
  });

  const [precedentsData, setPrecedentsData] = useState({
    completedPrecedents: 0,
    targetPrecedents: 4,
    precedentDetails: '',
    caAssociateCollaborations: 0
  });

  const [selectedFiles, setSelectedFiles] = useState({});
  const [existingPdfs, setExistingPdfs] = useState({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Simulating loading data from a file or API
        const savedPresentationsData = await window.electronAPI.readPresentationsFile('seniorassociate');
        if (savedPresentationsData) {
          setPresentationsData(prev => ({
            ...prev,
            ...savedPresentationsData
          }));
        }

        const savedPrecedentsData = await window.electronAPI.readPrecedentsFile('seniorassociate');
        if (savedPrecedentsData) {
          setPrecedentsData(prev => ({
            ...prev,
            ...savedPrecedentsData
          }));
        }

        // Check which PDFs exist
        const kpiIds = ['7.3.1', '7.3.2', '7.3.3', '7.3.4'];
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

  const updateSupervisedAssociatePresentations = (amount) => {
    setPresentationsData(prev => {
      const newValue = Math.max(0, prev.supervisedAssociatePresentations + amount);
      return {
        ...prev,
        supervisedAssociatePresentations: newValue
      };
    });
  };

  const updateSupervisedCAPresentations = (amount) => {
    setPresentationsData(prev => {
      const newValue = Math.max(0, prev.supervisedCAPresentations + amount);
      return {
        ...prev,
        supervisedCAPresentations: newValue
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

  const updateCAAssociateCollaborations = (amount) => {
    setPrecedentsData(prev => {
      const newValue = Math.max(0, prev.caAssociateCollaborations + amount);
      return {
        ...prev,
        caAssociateCollaborations: newValue
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
    }
  };

  const saveAllData = async () => {
    try {
      // Save presentations data
      await window.electronAPI.savePresentationsFile('seniorassociate', presentationsData);
      
      // Save precedents data
      await window.electronAPI.savePrecedentsFile('seniorassociate', precedentsData);
      
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
      <h1 className="text-2xl font-bold">Knowledge Management - Senior Associate</h1>
      
      {/* Own Weekly Training Presentations */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Training Presentations (7.3.1)</CardTitle>
          <CardDescription>A minimum of four internal presentations at the weekly training sessions</CardDescription>
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
              <Button onClick={() => document.getElementById('file-7.3.1').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-7.3.1"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '7.3.1')}
                className="hidden"
              />
              {selectedFiles['7.3.1'] && (
                <span className="text-sm text-gray-500">{selectedFiles['7.3.1'].name}</span>
              )}
            </div>
            {existingPdfs['7.3.1'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Supervised Associate Presentations */}
      <Card>
        <CardHeader>
          <CardTitle>Supervising Associate Presentations (7.3.2)</CardTitle>
          <CardDescription>A minimum of four internal presentations in which the senior associate has supervised the associates presenting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Supervised Associate Presentations</Label>
              <Progress 
                value={(presentationsData.supervisedAssociatePresentations / presentationsData.targetSupervisedAssociatePresentations) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateSupervisedAssociatePresentations(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <p>{presentationsData.supervisedAssociatePresentations} of {presentationsData.targetSupervisedAssociatePresentations} supervised presentations</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateSupervisedAssociatePresentations(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Textarea 
              placeholder="Provide details about the associate presentations you supervised..."
              className="min-h-32 mb-4"
              value={presentationsData.supervisedAssociateDetails}
              onChange={(e) => handleTextChange(e, 'supervisedAssociateDetails', 'presentations')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-7.3.2').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-7.3.2"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '7.3.2')}
                className="hidden"
              />
              {selectedFiles['7.3.2'] && (
                <span className="text-sm text-gray-500">{selectedFiles['7.3.2'].name}</span>
              )}
            </div>
            {existingPdfs['7.3.2'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Supervised CA Presentations */}
      <Card>
        <CardHeader>
          <CardTitle>Supervising CA Presentations (7.3.3)</CardTitle>
          <CardDescription>A minimum of four internal presentations in which the senior associate has supervised the CAs presenting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Supervised CA Presentations</Label>
              <Progress 
                value={(presentationsData.supervisedCAPresentations / presentationsData.targetSupervisedCAPresentations) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateSupervisedCAPresentations(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <p>{presentationsData.supervisedCAPresentations} of {presentationsData.targetSupervisedCAPresentations} supervised CA presentations</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateSupervisedCAPresentations(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Textarea 
              placeholder="Provide details about the CA presentations you supervised..."
              className="min-h-32 mb-4"
              value={presentationsData.supervisedCADetails}
              onChange={(e) => handleTextChange(e, 'supervisedCADetails', 'presentations')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-7.3.3').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-7.3.3"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '7.3.3')}
                className="hidden"
              />
              {selectedFiles['7.3.3'] && (
                <span className="text-sm text-gray-500">{selectedFiles['7.3.3'].name}</span>
              )}
            </div>
            {existingPdfs['7.3.3'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Precedents with CA and/or associate */}
      <Card>
        <CardHeader>
          <CardTitle>Precedents with CA/Associate (7.3.4)</CardTitle>
          <CardDescription>Working on or updating a minimum of four precedents with a CA and/or associate</CardDescription>
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
              placeholder="Provide details about the precedents you've worked on with CAs and/or associates..."
              className="min-h-32 mb-4"
              value={precedentsData.precedentDetails}
              onChange={(e) => handleTextChange(e, 'precedentDetails', 'precedents')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-7.3.4').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-7.3.4"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '7.3.4')}
                className="hidden"
              />
              {selectedFiles['7.3.4'] && (
                <span className="text-sm text-gray-500">{selectedFiles['7.3.4'].name}</span>
              )}
            </div>
            {existingPdfs['7.3.4'] && (
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