import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogHeader, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';
import { UploadCloud, Save, PlusCircle, MinusCircle } from 'lucide-react';

// Salaried Director Firm Development Component
const FirmDevelopment = () => {
  const [externalSeminarsData, setExternalSeminarsData] = useState({
    completedSeminars: 0,
    targetSeminars: 2,
    seminarDetails: ''
  });

  const [firmInitiativesData, setFirmInitiativesData] = useState({
    participatingInAllInitiatives: false,
    initiativesDetails: ''
  });

  const [coResponsibilityData, setCoResponsibilityData] = useState({
    coResponsibleInitiatives: 0,
    targetCoResponsibleInitiatives: 2,
    coResponsibilityDetails: '',
    directorAgreement: false
  });

  const [commercialData, setCommercialData] = useState({
    handledDifficultConversations: false,
    commercialDetails: ''
  });

  const [judgmentData, setJudgmentData] = useState({
    exercisedJudgment: false,
    judgmentDetails: ''
  });

  const [processesData, setProcessesData] = useState({
    ensuredProperProcesses: false,
    processesDetails: ''
  });

  const [selectedFiles, setSelectedFiles] = useState({});
  const [existingPdfs, setExistingPdfs] = useState({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Simulating loading data from a file or API
        const savedExternalSeminarsData = await window.electronAPI.readExternalSeminarsFile('director');
        if (savedExternalSeminarsData) {
          setExternalSeminarsData(prev => ({
            ...prev,
            ...savedExternalSeminarsData
          }));
        }

        const savedFirmInitiativesData = await window.electronAPI.readFirmInitiativesFile('director');
        if (savedFirmInitiativesData) {
          setFirmInitiativesData(prev => ({
            ...prev,
            ...savedFirmInitiativesData
          }));
        }

        const savedCoResponsibilityData = await window.electronAPI.readCoResponsibilityFile('director');
        if (savedCoResponsibilityData) {
          setCoResponsibilityData(prev => ({
            ...prev,
            ...savedCoResponsibilityData
          }));
        }

        const savedCommercialData = await window.electronAPI.readCommercialFile('director');
        if (savedCommercialData) {
          setCommercialData(prev => ({
            ...prev,
            ...savedCommercialData
          }));
        }

        const savedJudgmentData = await window.electronAPI.readJudgmentFile('director');
        if (savedJudgmentData) {
          setJudgmentData(prev => ({
            ...prev,
            ...savedJudgmentData
          }));
        }

        const savedProcessesData = await window.electronAPI.readProcessesFile('director');
        if (savedProcessesData) {
          setProcessesData(prev => ({
            ...prev,
            ...savedProcessesData
          }));
        }

        // Check which PDFs exist
        const kpiIds = ['6.4.1', '6.4.2', '6.4.3', '6.4.4', '6.4.5', '6.4.6'];
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

  const updateExternalSeminars = (amount) => {
    setExternalSeminarsData(prev => {
      const newValue = Math.max(0, prev.completedSeminars + amount);
      return {
        ...prev,
        completedSeminars: newValue
      };
    });
  };

  const updateCoResponsibleInitiatives = (amount) => {
    setCoResponsibilityData(prev => {
      const newValue = Math.max(0, prev.coResponsibleInitiatives + amount);
      return {
        ...prev,
        coResponsibleInitiatives: newValue
      };
    });
  };

  const toggleParticipatingInAllInitiatives = () => {
    setFirmInitiativesData(prev => ({
      ...prev,
      participatingInAllInitiatives: !prev.participatingInAllInitiatives
    }));
  };

  const toggleDirectorAgreement = () => {
    setCoResponsibilityData(prev => ({
      ...prev,
      directorAgreement: !prev.directorAgreement
    }));
  };

  const toggleHandledDifficultConversations = () => {
    setCommercialData(prev => ({
      ...prev,
      handledDifficultConversations: !prev.handledDifficultConversations
    }));
  };

  const toggleExercisedJudgment = () => {
    setJudgmentData(prev => ({
      ...prev,
      exercisedJudgment: !prev.exercisedJudgment
    }));
  };

  const toggleEnsuredProperProcesses = () => {
    setProcessesData(prev => ({
      ...prev,
      ensuredProperProcesses: !prev.ensuredProperProcesses
    }));
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
    switch (dataType) {
      case 'externalSeminars':
        setExternalSeminarsData(prev => ({
          ...prev,
          [field]: event.target.value
        }));
        break;
      case 'firmInitiatives':
        setFirmInitiativesData(prev => ({
          ...prev,
          [field]: event.target.value
        }));
        break;
      case 'coResponsibility':
        setCoResponsibilityData(prev => ({
          ...prev,
          [field]: event.target.value
        }));
        break;
      case 'commercial':
        setCommercialData(prev => ({
          ...prev,
          [field]: event.target.value
        }));
        break;
      case 'judgment':
        setJudgmentData(prev => ({
          ...prev,
          [field]: event.target.value
        }));
        break;
      case 'processes':
        setProcessesData(prev => ({
          ...prev,
          [field]: event.target.value
        }));
        break;
      default:
        break;
    }
  };

  const saveAllData = async () => {
    try {
      // Save all data
      await window.electronAPI.saveExternalSeminarsFile('director', externalSeminarsData);
      await window.electronAPI.saveFirmInitiativesFile('director', firmInitiativesData);
      await window.electronAPI.saveCoResponsibilityFile('director', coResponsibilityData);
      await window.electronAPI.saveCommercialFile('director', commercialData);
      await window.electronAPI.saveJudgmentFile('director', judgmentData);
      await window.electronAPI.saveProcessesFile('director', processesData);
      
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
      <h1 className="text-2xl font-bold">Firm Development - Salaried Director</h1>
      
      {/* External Seminars/Lecturing */}
      <Card>
        <CardHeader>
          <CardTitle>External Seminars/Lecturing (6.4.1)</CardTitle>
          <CardDescription>Presenting at a minimum of two external seminars/lecturing opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>External Seminars Progress</Label>
              <Progress 
                value={(externalSeminarsData.completedSeminars / externalSeminarsData.targetSeminars) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateExternalSeminars(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <p>{externalSeminarsData.completedSeminars} of {externalSeminarsData.targetSeminars} seminars</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateExternalSeminars(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Textarea 
              placeholder="Provide details about the external seminars or lecturing opportunities..."
              className="min-h-32 mb-4"
              value={externalSeminarsData.seminarDetails}
              onChange={(e) => handleTextChange(e, 'seminarDetails', 'externalSeminars')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.4.1').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.4.1"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.4.1')}
                className="hidden"
              />
              {selectedFiles['6.4.1'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.4.1'].name}</span>
              )}
            </div>
            {existingPdfs['6.4.1'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Firm Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle>Firm Initiatives (6.4.2)</CardTitle>
          <CardDescription>Participating in all firm initiatives in some aspect</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="participating-initiatives" className="flex items-center gap-2 cursor-pointer">
                <div className={`w-6 h-6 border rounded flex items-center justify-center ${firmInitiativesData.participatingInAllInitiatives ? 'bg-primary text-white' : 'bg-white'}`}>
                  {firmInitiativesData.participatingInAllInitiatives && '✓'}
                </div>
                <span>I confirm that I am participating in all firm initiatives in some aspect</span>
              </Label>
              <input 
                id="participating-initiatives"
                type="checkbox"
                className="hidden"
                checked={firmInitiativesData.participatingInAllInitiatives}
                onChange={toggleParticipatingInAllInitiatives}
              />
            </div>
            
            <Textarea 
              placeholder="Provide details about your participation in firm initiatives..."
              className="min-h-32 mb-4"
              value={firmInitiativesData.initiativesDetails}
              onChange={(e) => handleTextChange(e, 'initiativesDetails', 'firmInitiatives')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.4.2').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.4.2"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.4.2')}
                className="hidden"
              />
              {selectedFiles['6.4.2'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.4.2'].name}</span>
              )}
            </div>
            {existingPdfs['6.4.2'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Co-Responsibility for Firm Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle>Co-Responsibility for Firm Initiatives (6.4.3)</CardTitle>
          <CardDescription>Taking (co) responsibility for at least two firm initiatives with another director. Both directors must agree that each equally contributed.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Co-Responsible Initiatives</Label>
              <Progress 
                value={(coResponsibilityData.coResponsibleInitiatives / coResponsibilityData.targetCoResponsibleInitiatives) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateCoResponsibleInitiatives(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <p>{coResponsibilityData.coResponsibleInitiatives} of {coResponsibilityData.targetCoResponsibleInitiatives} co-responsible initiatives</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateCoResponsibleInitiatives(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Textarea 
              placeholder="Provide details about the firm initiatives for which you have co-responsibility..."
              className="min-h-32 mb-4"
              value={coResponsibilityData.coResponsibilityDetails}
              onChange={(e) => handleTextChange(e, 'coResponsibilityDetails', 'coResponsibility')}
            />
            
            <div className="flex items-center gap-2 mb-4">
              <Label htmlFor="director-agreement" className="flex items-center gap-2 cursor-pointer">
                <div className={`w-6 h-6 border rounded flex items-center justify-center ${coResponsibilityData.directorAgreement ? 'bg-primary text-white' : 'bg-white'}`}>
                  {coResponsibilityData.directorAgreement && '✓'}
                </div>
                <span>I confirm that both directors agree that each equally contributed</span>
              </Label>
              <input 
                id="director-agreement"
                type="checkbox"
                className="hidden"
                checked={coResponsibilityData.directorAgreement}
                onChange={toggleDirectorAgreement}
              />
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              For the avoidance of doubt, both directors have to agree that each equally contributed. Equal contribution does not necessarily indicate a 50/50 split of time or tasks.
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.4.3').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.4.3"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.4.3')}
                className="hidden"
              />
              {selectedFiles['6.4.3'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.4.3'].name}</span>
              )}
            </div>
            {existingPdfs['6.4.3'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Commercial Pressures and Difficult Conversations */}
      <Card>
        <CardHeader>
          <CardTitle>Commercial Pressures and Difficult Conversations (6.4.4)</CardTitle>
          <CardDescription>Discusses commercial pressures and has difficult conversations with clients where necessary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="difficult-conversations" className="flex items-center gap-2 cursor-pointer">
                <div className={`w-6 h-6 border rounded flex items-center justify-center ${commercialData.handledDifficultConversations ? 'bg-primary text-white' : 'bg-white'}`}>
                  {commercialData.handledDifficultConversations && '✓'}
                </div>
                <span>I confirm that I discuss commercial pressures and have difficult conversations with clients where necessary</span>
              </Label>
              <input 
                id="difficult-conversations"
                type="checkbox"
                className="hidden"
                checked={commercialData.handledDifficultConversations}
                onChange={toggleHandledDifficultConversations}
              />
            </div>
            
            <Textarea 
              placeholder="Provide details about commercial pressures and difficult client conversations you've handled..."
              className="min-h-32 mb-4"
              value={commercialData.commercialDetails}
              onChange={(e) => handleTextChange(e, 'commercialDetails', 'commercial')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.4.4').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.4.4"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.4.4')}
                className="hidden"
              />
              {selectedFiles['6.4.4'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.4.4'].name}</span>
              )}
            </div>
            {existingPdfs['6.4.4'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Judgment and Upcoming Change */}
      <Card>
        <CardHeader>
          <CardTitle>Judgment and Upcoming Change (6.4.5)</CardTitle>
          <CardDescription>Exercises judgment and anticipates upcoming change</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="exercised-judgment" className="flex items-center gap-2 cursor-pointer">
                <div className={`w-6 h-6 border rounded flex items-center justify-center ${judgmentData.exercisedJudgment ? 'bg-primary text-white' : 'bg-white'}`}>
                  {judgmentData.exercisedJudgment && '✓'}
                </div>
                <span>I confirm that I exercise judgment and anticipate upcoming change</span>
              </Label>
              <input 
                id="exercised-judgment"
                type="checkbox"
                className="hidden"
                checked={judgmentData.exercisedJudgment}
                onChange={toggleExercisedJudgment}
              />
            </div>
            
            <Textarea 
              placeholder="Provide examples of how you exercise judgment and anticipate upcoming change..."
              className="min-h-32 mb-4"
              value={judgmentData.judgmentDetails}
              onChange={(e) => handleTextChange(e, 'judgmentDetails', 'judgment')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.4.5').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.4.5"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.4.5')}
                className="hidden"
              />
              {selectedFiles['6.4.5'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.4.5'].name}</span>
              )}
            </div>
            {existingPdfs['6.4.5'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Proper Processes */}
      <Card>
        <CardHeader>
          <CardTitle>Proper Processes (6.4.6)</CardTitle>
          <CardDescription>Ensures that proper processes are followed in relation to client and matter opening and seeks to ensure the smooth running of all matters in accordance with good practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="proper-processes" className="flex items-center gap-2 cursor-pointer">
                <div className={`w-6 h-6 border rounded flex items-center justify-center ${processesData.ensuredProperProcesses ? 'bg-primary text-white' : 'bg-white'}`}>
                  {processesData.ensuredProperProcesses && '✓'}
                </div>
                <span>I confirm that I ensure proper processes are followed for client and matter opening</span>
              </Label>
              <input 
                id="proper-processes"
                type="checkbox"
                className="hidden"
                checked={processesData.ensuredProperProcesses}
                onChange={toggleEnsuredProperProcesses}
              />
            </div>
            
            <Textarea 
              placeholder="Provide details about how you ensure proper processes are followed..."
              className="min-h-32 mb-4"
              value={processesData.processesDetails}
              onChange={(e) => handleTextChange(e, 'processesDetails', 'processes')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.4.6').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.4.6"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.4.6')}
                className="hidden"
              />
              {selectedFiles['6.4.6'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.4.6'].name}</span>
              )}
            </div>
            {existingPdfs['6.4.6'] && (
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