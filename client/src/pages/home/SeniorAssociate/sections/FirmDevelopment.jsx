import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogHeader, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';
import { UploadCloud, Save, PlusCircle, MinusCircle } from 'lucide-react';

// Senior Associate Firm Development Component
const FirmDevelopment = () => {
  const [externalSeminarsData, setExternalSeminarsData] = useState({
    assistedSeminars: 0,
    targetAssistedSeminars: 2,
    assistedSeminarsDetails: '',
    presentedSeminars: 0,
    targetPresentedSeminars: 2,
    presentedSeminarsDetails: '',
  });

  const [firmInitiativesData, setFirmInitiativesData] = useState({
    participatedInitiatives: 0,
    targetParticipatedInitiatives: 4,
    participatedInitiativesDetails: '',
    suggestedInitiatives: 0,
    targetSuggestedInitiatives: 1,
    suggestedInitiativesDetails: '',
    workQualityDetails: '',
  });

  const [professionalSkillsData, setProfessionalSkillsData] = useState({
    judgementDetails: '',
    processDetails: '',
  });

  const [selectedFiles, setSelectedFiles] = useState({});
  const [existingPdfs, setExistingPdfs] = useState({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Simulating loading data from a file or API
        const savedExternalSeminarsData = await window.electronAPI.readExternalSeminarsFile('seniorassociate');
        if (savedExternalSeminarsData) {
          setExternalSeminarsData(prev => ({
            ...prev,
            ...savedExternalSeminarsData
          }));
        }

        const savedFirmInitiativesData = await window.electronAPI.readFirmInitiativesFile('seniorassociate');
        if (savedFirmInitiativesData) {
          setFirmInitiativesData(prev => ({
            ...prev,
            ...savedFirmInitiativesData
          }));
        }

        const savedProfessionalSkillsData = await window.electronAPI.readProfessionalSkillsFile('seniorassociate');
        if (savedProfessionalSkillsData) {
          setProfessionalSkillsData(prev => ({
            ...prev,
            ...savedProfessionalSkillsData
          }));
        }

        // Check which PDFs exist
        const kpiIds = ['6.3.1', '6.3.2', '6.3.3', '6.3.4', '6.3.5', '6.3.6'];
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

  const updateAssistedSeminars = (amount) => {
    setExternalSeminarsData(prev => {
      const newValue = Math.max(0, prev.assistedSeminars + amount);
      return {
        ...prev,
        assistedSeminars: newValue
      };
    });
  };

  const updatePresentedSeminars = (amount) => {
    setExternalSeminarsData(prev => {
      const newValue = Math.max(0, prev.presentedSeminars + amount);
      return {
        ...prev,
        presentedSeminars: newValue
      };
    });
  };

  const updateParticipatedInitiatives = (amount) => {
    setFirmInitiativesData(prev => {
      const newValue = Math.max(0, prev.participatedInitiatives + amount);
      return {
        ...prev,
        participatedInitiatives: newValue
      };
    });
  };

  const updateSuggestedInitiatives = (amount) => {
    setFirmInitiativesData(prev => {
      const newValue = Math.max(0, prev.suggestedInitiatives + amount);
      return {
        ...prev,
        suggestedInitiatives: newValue
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
    if (dataType === 'externalSeminars') {
      setExternalSeminarsData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    } else if (dataType === 'firmInitiatives') {
      setFirmInitiativesData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    } else if (dataType === 'professionalSkills') {
      setProfessionalSkillsData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    }
  };

  const saveAllData = async () => {
    try {
      // Save external seminars data
      await window.electronAPI.saveExternalSeminarsFile('seniorassociate', externalSeminarsData);
      
      // Save firm initiatives data
      await window.electronAPI.saveFirmInitiativesFile('seniorassociate', firmInitiativesData);
      
      // Save professional skills data
      await window.electronAPI.saveProfessionalSkillsFile('seniorassociate', professionalSkillsData);
      
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
      <h1 className="text-2xl font-bold">Firm Development - Senior Associate</h1>
      
      {/* Assisting External Seminars */}
      <Card>
        <CardHeader>
          <CardTitle>Assisting with External Seminars (6.3.1)</CardTitle>
          <CardDescription>Assisting with at least two external seminars</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Assisted Seminars Progress</Label>
              <Progress 
                value={(externalSeminarsData.assistedSeminars / externalSeminarsData.targetAssistedSeminars) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateAssistedSeminars(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <p>{externalSeminarsData.assistedSeminars} of {externalSeminarsData.targetAssistedSeminars} assisted seminars</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateAssistedSeminars(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Textarea 
              placeholder="Provide details about the external seminars you assisted with..."
              className="min-h-32 mb-4"
              value={externalSeminarsData.assistedSeminarsDetails}
              onChange={(e) => handleTextChange(e, 'assistedSeminarsDetails', 'externalSeminars')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.3.1').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.3.1"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.3.1')}
                className="hidden"
              />
              {selectedFiles['6.3.1'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.3.1'].name}</span>
              )}
            </div>
            {existingPdfs['6.3.1'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Presenting at External Seminars */}
      <Card>
        <CardHeader>
          <CardTitle>Presenting at External Seminars (6.3.2)</CardTitle>
          <CardDescription>Presenting at a minimum of two external seminars</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Presented Seminars Progress</Label>
              <Progress 
                value={(externalSeminarsData.presentedSeminars / externalSeminarsData.targetPresentedSeminars) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updatePresentedSeminars(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <p>{externalSeminarsData.presentedSeminars} of {externalSeminarsData.targetPresentedSeminars} presented seminars</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updatePresentedSeminars(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Textarea 
              placeholder="Provide details about the external seminars you presented at..."
              className="min-h-32 mb-4"
              value={externalSeminarsData.presentedSeminarsDetails}
              onChange={(e) => handleTextChange(e, 'presentedSeminarsDetails', 'externalSeminars')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.3.2').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.3.2"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.3.2')}
                className="hidden"
              />
              {selectedFiles['6.3.2'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.3.2'].name}</span>
              )}
            </div>
            {existingPdfs['6.3.2'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Participating in Firm Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle>Participating in Firm Initiatives (6.3.3)</CardTitle>
          <CardDescription>Participating in at least four firm initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Firm Initiatives Participation</Label>
              <Progress 
                value={(firmInitiativesData.participatedInitiatives / firmInitiativesData.targetParticipatedInitiatives) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateParticipatedInitiatives(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <p>{firmInitiativesData.participatedInitiatives} of {firmInitiativesData.targetParticipatedInitiatives} initiatives</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateParticipatedInitiatives(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Textarea 
              placeholder="Provide details about the firm initiatives you participated in..."
              className="min-h-32 mb-4"
              value={firmInitiativesData.participatedInitiativesDetails}
              onChange={(e) => handleTextChange(e, 'participatedInitiativesDetails', 'firmInitiatives')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.3.3').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.3.3"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.3.3')}
                className="hidden"
              />
              {selectedFiles['6.3.3'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.3.3'].name}</span>
              )}
            </div>
            {existingPdfs['6.3.3'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Suggesting Firm Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle>Suggesting and Leading Firm Initiatives (6.3.4)</CardTitle>
          <CardDescription>Suggesting at least one firm initiative which is taken up by the firm and which you take control of. Consistently delivers high quality work, sets high quality expectations internally and uses client engagement opportunities to deepen understanding of client's quality expectations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Suggested Initiatives</Label>
              <Progress 
                value={(firmInitiativesData.suggestedInitiatives / firmInitiativesData.targetSuggestedInitiatives) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateSuggestedInitiatives(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <p>{firmInitiativesData.suggestedInitiatives} of {firmInitiativesData.targetSuggestedInitiatives} suggested initiatives</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateSuggestedInitiatives(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Textarea 
              placeholder="Provide details about firm initiatives you suggested and led..."
              className="min-h-32 mb-4"
              value={firmInitiativesData.suggestedInitiativesDetails}
              onChange={(e) => handleTextChange(e, 'suggestedInitiativesDetails', 'firmInitiatives')}
            />
            
            <Label className="mt-4">Work Quality Standards</Label>
            <Textarea 
              placeholder="Describe how you consistently deliver high quality work, set high quality expectations internally, and use client engagement opportunities..."
              className="min-h-32 mb-4"
              value={firmInitiativesData.workQualityDetails}
              onChange={(e) => handleTextChange(e, 'workQualityDetails', 'firmInitiatives')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.3.4').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.3.4"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.3.4')}
                className="hidden"
              />
              {selectedFiles['6.3.4'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.3.4'].name}</span>
              )}
            </div>
            {existingPdfs['6.3.4'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Good Judgement Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Good Judgement Skills (6.3.5)</CardTitle>
          <CardDescription>Good judgement skills, with the ability to make sound decisions even in the absence of complete information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Textarea 
              placeholder="Provide examples demonstrating your good judgement skills and ability to make sound decisions with incomplete information..."
              className="min-h-32 mb-4"
              value={professionalSkillsData.judgementDetails}
              onChange={(e) => handleTextChange(e, 'judgementDetails', 'professionalSkills')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.3.5').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.3.5"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.3.5')}
                className="hidden"
              />
              {selectedFiles['6.3.5'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.3.5'].name}</span>
              )}
            </div>
            {existingPdfs['6.3.5'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Client Process Management */}
      <Card>
        <CardHeader>
          <CardTitle>Client Process Management (6.3.6)</CardTitle>
          <CardDescription>Ensures that proper processes are followed in relation to client and matter opening; escalates risk issues as appropriate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Textarea 
              placeholder="Provide examples of how you ensure proper processes are followed with clients and matters, and how you escalate risk issues..."
              className="min-h-32 mb-4"
              value={professionalSkillsData.processDetails}
              onChange={(e) => handleTextChange(e, 'processDetails', 'professionalSkills')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.3.6').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.3.6"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.3.6')}
                className="hidden"
              />
              {selectedFiles['6.3.6'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.3.6'].name}</span>
              )}
            </div>
            {existingPdfs['6.3.6'] && (
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
              Your firm development data has been saved.
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

export default FirmDevelopment;