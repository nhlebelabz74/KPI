import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogHeader, AlertDialogTrigger, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';
import { UploadCloud, Save, PlusCircle, MinusCircle } from 'lucide-react';

const FirmDevelopment = () => {
  const [seminarsData, setSeminarsData] = useState({
    completedSeminars: 0,
    targetSeminars: 2,
    seminarDetails: ''
  });

  const [initiativesData, setInitiativesData] = useState({
    completedInitiatives: 0,
    targetInitiatives: 4,
    initiativeDetails: ''
  });

  const [suggestionData, setSuggestionData] = useState({
    suggestionDetails: ''
  });

  const [professionalConductData, setProfessionalConductData] = useState({
    clientDealingsDetails: '',
    qualityWorkDetails: '',
    ethicalBehaviorDetails: '',
    personalImpactDetails: '',
    respectForOthersDetails: ''
  });

  const [selectedFiles, setSelectedFiles] = useState({});
  const [existingPdfs, setExistingPdfs] = useState({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Simulating loading data from a file or API
        const savedSeminarsData = await window.electronAPI.readSeminarsFile('candidateAttorney');
        if (savedSeminarsData) {
          setSeminarsData(prev => ({
            ...prev,
            ...savedSeminarsData
          }));
        }

        const savedInitiativesData = await window.electronAPI.readInitiativesFile('candidateAttorney');
        if (savedInitiativesData) {
          setInitiativesData(prev => ({
            ...prev,
            ...savedInitiativesData
          }));
        }

        const savedSuggestionData = await window.electronAPI.readSuggestionFile('candidateAttorney');
        if (savedSuggestionData) {
          setSuggestionData(prev => ({
            ...prev,
            ...savedSuggestionData
          }));
        }

        const savedProfessionalConductData = await window.electronAPI.readProfessionalConductFile('candidateAttorney');
        if (savedProfessionalConductData) {
          setProfessionalConductData(prev => ({
            ...prev,
            ...savedProfessionalConductData
          }));
        }

        // Check which PDFs exist
        const kpiIds = ['6.1.1', '6.1.2', '6.1.3', '6.1.4', '6.1.5', '6.1.6', '6.1.7', '6.1.8'];
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

  const updateSeminars = (amount) => {
    setSeminarsData(prev => {
      const newValue = Math.max(0, prev.completedSeminars + amount);
      return {
        ...prev,
        completedSeminars: newValue
      };
    });
  };

  const updateInitiatives = (amount) => {
    setInitiativesData(prev => {
      const newValue = Math.max(0, prev.completedInitiatives + amount);
      return {
        ...prev,
        completedInitiatives: newValue
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
    const value = event.target.value;
    
    if (dataType === 'seminars') {
      setSeminarsData(prev => ({
        ...prev,
        [field]: value
      }));
    } else if (dataType === 'initiatives') {
      setInitiativesData(prev => ({
        ...prev,
        [field]: value
      }));
    } else if (dataType === 'suggestion') {
      setSuggestionData(prev => ({
        ...prev,
        [field]: value
      }));
    } else if (dataType === 'professionalConduct') {
      setProfessionalConductData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const saveAllData = async () => {
    try {
      // Save seminars data
      await window.electronAPI.saveSeminarsFile('candidateAttorney', seminarsData);
      
      // Save initiatives data
      await window.electronAPI.saveInitiativesFile('candidateAttorney', initiativesData);
      
      // Save suggestion data
      await window.electronAPI.saveSuggestionFile('candidateAttorney', suggestionData);
      
      // Save professional conduct data
      await window.electronAPI.saveProfessionalConductFile('candidateAttorney', professionalConductData);
      
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
      <h1 className="text-2xl font-bold">Building and Maintaining the Firm - Candidate Attorney</h1>
      
      {/* External Seminars */}
      <Card>
        <CardHeader>
          <CardTitle>External Seminars (6.1.1)</CardTitle>
          <CardDescription>Assisting with at least two external seminars</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Seminars Progress</Label>
              <Progress 
                value={(seminarsData.completedSeminars / seminarsData.targetSeminars) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateSeminars(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <p>{seminarsData.completedSeminars} of {seminarsData.targetSeminars} seminars</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateSeminars(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Textarea 
              placeholder="Provide details about the external seminars you've assisted with..."
              className="min-h-32 mb-4"
              value={seminarsData.seminarDetails}
              onChange={(e) => handleTextChange(e, 'seminarDetails', 'seminars')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.1.1').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.1.1"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.1.1')}
                className="hidden"
              />
              {selectedFiles['6.1.1'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.1.1'].name}</span>
              )}
            </div>
            {existingPdfs['6.1.1'] && (
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
          <CardTitle>Firm Initiatives (6.1.2)</CardTitle>
          <CardDescription>Participating in at least four firm initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Initiatives Progress</Label>
              <Progress 
                value={(initiativesData.completedInitiatives / initiativesData.targetInitiatives) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateInitiatives(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <p>{initiativesData.completedInitiatives} of {initiativesData.targetInitiatives} initiatives</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateInitiatives(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Textarea 
              placeholder="Describe the firm initiatives you've participated in..."
              className="min-h-32 mb-4"
              value={initiativesData.initiativeDetails}
              onChange={(e) => handleTextChange(e, 'initiativeDetails', 'initiatives')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.1.2').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.1.2"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.1.2')}
                className="hidden"
              />
              {selectedFiles['6.1.2'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.1.2'].name}</span>
              )}
            </div>
            {existingPdfs['6.1.2'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Suggesting Firm Initiative */}
      <Card>
        <CardHeader>
          <CardTitle>Initiative Suggestion (6.1.3)</CardTitle>
          <CardDescription>Suggesting at least one firm initiative which is taken up by the firm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Textarea 
              placeholder="Describe the firm initiative you suggested that was adopted..."
              className="min-h-32 mb-4"
              value={suggestionData.suggestionDetails}
              onChange={(e) => handleTextChange(e, 'suggestionDetails', 'suggestion')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.1.3').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.1.3"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.1.3')}
                className="hidden"
              />
              {selectedFiles['6.1.3'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.1.3'].name}</span>
              )}
            </div>
            {existingPdfs['6.1.3'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Professional Conduct - Client Dealings */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Client Dealings (6.1.4)</CardTitle>
          <CardDescription>Acts professionally in all client dealings and starts to establish client contact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Textarea 
              placeholder="Describe your professional conduct in client dealings and how you're establishing client contact..."
              className="min-h-32 mb-4"
              value={professionalConductData.clientDealingsDetails}
              onChange={(e) => handleTextChange(e, 'clientDealingsDetails', 'professionalConduct')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.1.4').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.1.4"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.1.4')}
                className="hidden"
              />
              {selectedFiles['6.1.4'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.1.4'].name}</span>
              )}
            </div>
            {existingPdfs['6.1.4'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Quality in Client Work */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Recognition (6.1.5)</CardTitle>
          <CardDescription>Recognises the importance of quality in all client work and can identify key elements of quality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Textarea 
              placeholder="Explain how you recognize the importance of quality in client work and the key elements you've identified..."
              className="min-h-32 mb-4"
              value={professionalConductData.qualityWorkDetails}
              onChange={(e) => handleTextChange(e, 'qualityWorkDetails', 'professionalConduct')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.1.5').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.1.5"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.1.5')}
                className="hidden"
              />
              {selectedFiles['6.1.5'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.1.5'].name}</span>
              )}
            </div>
            {existingPdfs['6.1.5'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Ethical Behavior */}
      <Card>
        <CardHeader>
          <CardTitle>Ethical Conduct (6.1.6)</CardTitle>
          <CardDescription>Exhibits professional conduct and understands the importance of high standards of ethical behaviour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Textarea 
              placeholder="Describe how you exhibit professional conduct and your understanding of ethical standards..."
              className="min-h-32 mb-4"
              value={professionalConductData.ethicalBehaviorDetails}
              onChange={(e) => handleTextChange(e, 'ethicalBehaviorDetails', 'professionalConduct')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.1.6').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.1.6"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.1.6')}
                className="hidden"
              />
              {selectedFiles['6.1.6'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.1.6'].name}</span>
              )}
            </div>
            {existingPdfs['6.1.6'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Personal Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Impact (6.1.7)</CardTitle>
          <CardDescription>Pays attention to personal impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Textarea 
              placeholder="Describe how you pay attention to your personal impact..."
              className="min-h-32 mb-4"
              value={professionalConductData.personalImpactDetails}
              onChange={(e) => handleTextChange(e, 'personalImpactDetails', 'professionalConduct')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.1.7').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.1.7"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.1.7')}
                className="hidden"
              />
              {selectedFiles['6.1.7'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.1.7'].name}</span>
              )}
            </div>
            {existingPdfs['6.1.7'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Respects Others */}
      <Card>
        <CardHeader>
          <CardTitle>Respect for Others (6.1.8)</CardTitle>
          <CardDescription>Respects the opinions and individuality of others at all times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Textarea 
              placeholder="Describe how you respect the opinions and individuality of others..."
              className="min-h-32 mb-4"
              value={professionalConductData.respectForOthersDetails}
              onChange={(e) => handleTextChange(e, 'respectForOthersDetails', 'professionalConduct')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.1.8').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.1.8"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.1.8')}
                className="hidden"
              />
              {selectedFiles['6.1.8'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.1.8'].name}</span>
              )}
            </div>
            {existingPdfs['6.1.8'] && (
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
}

export default FirmDevelopment;