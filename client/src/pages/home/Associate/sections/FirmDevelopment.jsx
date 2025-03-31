import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogHeader, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';
import { UploadCloud, Save, PlusCircle, MinusCircle } from 'lucide-react';

const FirmDevelopment = () => {
  const [externalSeminars, setExternalSeminars] = useState({
    completed: 0,
    target: 2,
    details: ''
  });

  const [firmInitiatives, setFirmInitiatives] = useState({
    completed: 0,
    target: 4,
    details: ''
  });

  const [suggestions, setSuggestions] = useState({
    completed: 0,
    target: 1,
    details: ''
  });

  const [qualityStandards, setQualityStandards] = useState({
    details: ''
  });

  const [contributions, setContributions] = useState({
    details: ''
  });

  const [newIdeas, setNewIdeas] = useState({
    details: ''
  });

  const [opportunities, setOpportunities] = useState({
    details: ''
  });

  const [selectedFiles, setSelectedFiles] = useState({});
  const [existingPdfs, setExistingPdfs] = useState({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Simulating loading data from a file or API
        const savedExternalSeminars = await window.electronAPI.readFile('6.2.1');
        if (savedExternalSeminars) {
          setExternalSeminars(prev => ({
            ...prev,
            ...savedExternalSeminars
          }));
        }

        const savedFirmInitiatives = await window.electronAPI.readFile('6.2.2');
        if (savedFirmInitiatives) {
          setFirmInitiatives(prev => ({
            ...prev,
            ...savedFirmInitiatives
          }));
        }

        const savedSuggestions = await window.electronAPI.readFile('6.2.3');
        if (savedSuggestions) {
          setSuggestions(prev => ({
            ...prev,
            ...savedSuggestions
          }));
        }

        const savedQualityStandards = await window.electronAPI.readFile('6.2.4');
        if (savedQualityStandards) {
          setQualityStandards(prev => ({
            ...prev,
            ...savedQualityStandards
          }));
        }

        const savedContributions = await window.electronAPI.readFile('6.2.5');
        if (savedContributions) {
          setContributions(prev => ({
            ...prev,
            ...savedContributions
          }));
        }

        const savedNewIdeas = await window.electronAPI.readFile('6.2.6');
        if (savedNewIdeas) {
          setNewIdeas(prev => ({
            ...prev,
            ...savedNewIdeas
          }));
        }

        const savedOpportunities = await window.electronAPI.readFile('6.2.7');
        if (savedOpportunities) {
          setOpportunities(prev => ({
            ...prev,
            ...savedOpportunities
          }));
        }

        // Check which PDFs exist
        const kpiIds = ['6.2.1', '6.2.2', '6.2.3', '6.2.4', '6.2.5', '6.2.6', '6.2.7'];
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
    setExternalSeminars(prev => {
      const newValue = Math.max(0, prev.completed + amount);
      return {
        ...prev,
        completed: newValue
      };
    });
  };

  const updateFirmInitiatives = (amount) => {
    setFirmInitiatives(prev => {
      const newValue = Math.max(0, prev.completed + amount);
      return {
        ...prev,
        completed: newValue
      };
    });
  };

  const updateSuggestions = (amount) => {
    setSuggestions(prev => {
      const newValue = Math.max(0, prev.completed + amount);
      const maxValue = 1; // Maximum 1 suggestion required
      return {
        ...prev,
        completed: Math.min(newValue, maxValue)
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
      setExternalSeminars(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    } else if (dataType === 'firmInitiatives') {
      setFirmInitiatives(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    } else if (dataType === 'suggestions') {
      setSuggestions(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    } else if (dataType === 'qualityStandards') {
      setQualityStandards(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    } else if (dataType === 'contributions') {
      setContributions(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    } else if (dataType === 'newIdeas') {
      setNewIdeas(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    } else if (dataType === 'opportunities') {
      setOpportunities(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    }
  };

  const saveAllData = async () => {
    try {
      // Save all data sections
      await window.electronAPI.saveFile('6.2.1', externalSeminars);
      await window.electronAPI.saveFile('6.2.2', firmInitiatives);
      await window.electronAPI.saveFile('6.2.3', suggestions);
      await window.electronAPI.saveFile('6.2.4', qualityStandards);
      await window.electronAPI.saveFile('6.2.5', contributions);
      await window.electronAPI.saveFile('6.2.6', newIdeas);
      await window.electronAPI.saveFile('6.2.7', opportunities);
      
      // Save uploaded files
      for (const kpiId in selectedFiles) {
        await window.electronAPI.savePdf(kpiId, selectedFiles[kpiId]);
        
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
      <h1 className="text-2xl font-bold">Firm Development - Associate</h1>
      
      {/* External Seminars */}
      <Card>
        <CardHeader>
          <CardTitle>External Seminars (6.2.1)</CardTitle>
          <CardDescription>Assisting with at least two external seminars</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>External Seminars Progress</Label>
              <Progress 
                value={(externalSeminars.completed / externalSeminars.target) * 100} 
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
                <p>{externalSeminars.completed} of {externalSeminars.target} seminars</p>
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
              placeholder="Describe the external seminars you assisted with..."
              className="min-h-24 mb-4"
              value={externalSeminars.details}
              onChange={(e) => handleTextChange(e, 'details', 'externalSeminars')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.2.1').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.2.1"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.2.1')}
                className="hidden"
              />
              {selectedFiles['6.2.1'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.2.1'].name}</span>
              )}
            </div>
            {existingPdfs['6.2.1'] && (
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
          <CardTitle>Firm Initiatives (6.2.2)</CardTitle>
          <CardDescription>Participating in at least four firm initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Firm Initiatives Progress</Label>
              <Progress 
                value={(firmInitiatives.completed / firmInitiatives.target) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateFirmInitiatives(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <p>{firmInitiatives.completed} of {firmInitiatives.target} initiatives</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateFirmInitiatives(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Textarea 
              placeholder="Describe the firm initiatives you participated in..."
              className="min-h-24 mb-4"
              value={firmInitiatives.details}
              onChange={(e) => handleTextChange(e, 'details', 'firmInitiatives')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.2.2').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.2.2"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.2.2')}
                className="hidden"
              />
              {selectedFiles['6.2.2'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.2.2'].name}</span>
              )}
            </div>
            {existingPdfs['6.2.2'] && (
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
          <CardTitle>Suggesting Firm Initiatives (6.2.3)</CardTitle>
          <CardDescription>Suggesting at least one firm initiative which is taken up by the firm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Suggestions Progress</Label>
              <Progress 
                value={(suggestions.completed / suggestions.target) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateSuggestions(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <p>{suggestions.completed} of {suggestions.target} suggestion</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateSuggestions(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Textarea 
              placeholder="Describe the firm initiative you suggested that was taken up by the firm..."
              className="min-h-24 mb-4"
              value={suggestions.details}
              onChange={(e) => handleTextChange(e, 'details', 'suggestions')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.2.3').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.2.3"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.2.3')}
                className="hidden"
              />
              {selectedFiles['6.2.3'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.2.3'].name}</span>
              )}
            </div>
            {existingPdfs['6.2.3'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Quality Standards */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Standards (6.2.4)</CardTitle>
          <CardDescription>Builds and extends experience and understanding of quality to drive higher standards in all client work</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Textarea 
              placeholder="Describe how you build and extend experience and understanding of quality standards..."
              className="min-h-24 mb-4"
              value={qualityStandards.details}
              onChange={(e) => handleTextChange(e, 'details', 'qualityStandards')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.2.4').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.2.4"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.2.4')}
                className="hidden"
              />
              {selectedFiles['6.2.4'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.2.4'].name}</span>
              )}
            </div>
            {existingPdfs['6.2.4'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Meeting Contributions */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting Contributions (6.2.5)</CardTitle>
          <CardDescription>Makes active contributions to meetings, presenting effectively</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Textarea 
              placeholder="Describe your active contributions to meetings and how you present effectively..."
              className="min-h-24 mb-4"
              value={contributions.details}
              onChange={(e) => handleTextChange(e, 'details', 'contributions')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.2.5').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.2.5"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.2.5')}
                className="hidden"
              />
              {selectedFiles['6.2.5'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.2.5'].name}</span>
              )}
            </div>
            {existingPdfs['6.2.5'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Proactive Thinking */}
      <Card>
        <CardHeader>
          <CardTitle>Proactive Thinking (6.2.6)</CardTitle>
          <CardDescription>Is proactive in thinking of new ideas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Textarea 
              placeholder="Describe how you are proactive in thinking of new ideas..."
              className="min-h-24 mb-4"
              value={newIdeas.details}
              onChange={(e) => handleTextChange(e, 'details', 'newIdeas')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.2.6').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.2.6"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.2.6')}
                className="hidden"
              />
              {selectedFiles['6.2.6'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.2.6'].name}</span>
              )}
            </div>
            {existingPdfs['6.2.6'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* New Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>New Opportunities (6.2.7)</CardTitle>
          <CardDescription>Seeks out new opportunities and has the courage to try new things outside previous experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Textarea 
              placeholder="Describe how you seek out new opportunities and try new things outside of your experience..."
              className="min-h-24 mb-4"
              value={opportunities.details}
              onChange={(e) => handleTextChange(e, 'details', 'opportunities')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.2.7').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.2.7"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.2.7')}
                className="hidden"
              />
              {selectedFiles['6.2.7'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.2.7'].name}</span>
              )}
            </div>
            {existingPdfs['6.2.7'] && (
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