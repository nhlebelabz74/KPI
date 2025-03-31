import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogHeader, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';
import { UploadCloud, Save, Check } from 'lucide-react';

// Equity Director Firm Development Component
const FirmDevelopment = () => {
  const [clientServiceData, setClientServiceData] = useState({
    highLevelClientService: false,
    clientServiceDetails: ''
  });

  const [trainingData, setTrainingData] = useState({
    specialistTrainingCount: 0,
    targetTrainingCount: 3,
    trainingDetails: ''
  });

  const [personalExampleData, setPersonalExampleData] = useState({
    operatesByExample: false,
    exampleDetails: ''
  });

  const [businessBenefitData, setBusinessBenefitData] = useState({
    worksForBusinessBenefit: false,
    businessBenefitDetails: ''
  });

  const [fileManagementData, setFileManagementData] = useState({
    overseesFileManagement: false,
    fileManagementDetails: ''
  });

  const [selectedFiles, setSelectedFiles] = useState({});
  const [existingPdfs, setExistingPdfs] = useState({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Simulating loading data from a file or API
        const savedClientServiceData = await window.electronAPI.readFirmDevFile('clientService');
        if (savedClientServiceData) {
          setClientServiceData(prev => ({
            ...prev,
            ...savedClientServiceData
          }));
        }

        const savedTrainingData = await window.electronAPI.readFirmDevFile('training');
        if (savedTrainingData) {
          setTrainingData(prev => ({
            ...prev,
            ...savedTrainingData
          }));
        }

        const savedPersonalExampleData = await window.electronAPI.readFirmDevFile('personalExample');
        if (savedPersonalExampleData) {
          setPersonalExampleData(prev => ({
            ...prev,
            ...savedPersonalExampleData
          }));
        }

        const savedBusinessBenefitData = await window.electronAPI.readFirmDevFile('businessBenefit');
        if (savedBusinessBenefitData) {
          setBusinessBenefitData(prev => ({
            ...prev,
            ...savedBusinessBenefitData
          }));
        }

        const savedFileManagementData = await window.electronAPI.readFirmDevFile('fileManagement');
        if (savedFileManagementData) {
          setFileManagementData(prev => ({
            ...prev,
            ...savedFileManagementData
          }));
        }

        // Check which PDFs exist
        const kpiIds = ['6.5.1', '6.5.2', '6.5.3', '6.5.4', '6.5.5'];
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

  const updateTrainingCount = (amount) => {
    setTrainingData(prev => {
      const newValue = Math.max(0, prev.specialistTrainingCount + amount);
      return {
        ...prev,
        specialistTrainingCount: newValue
      };
    });
  };

  const toggleCheckbox = (setter, field) => {
    setter(prev => ({
      ...prev,
      [field]: !prev[field]
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

  const handleTextChange = (event, field, setter) => {
    setter(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const saveAllData = async () => {
    try {
      // Save all data
      await window.electronAPI.saveFirmDevFile('clientService', clientServiceData);
      await window.electronAPI.saveFirmDevFile('training', trainingData);
      await window.electronAPI.saveFirmDevFile('personalExample', personalExampleData);
      await window.electronAPI.saveFirmDevFile('businessBenefit', businessBenefitData);
      await window.electronAPI.saveFirmDevFile('fileManagement', fileManagementData);
      
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
      <h1 className="text-2xl font-bold">Firm Development - Equity Director</h1>
      
      {/* Client Service */}
      <Card>
        <CardHeader>
          <CardTitle>Client Service (6.5.1)</CardTitle>
          <CardDescription>Delivers a high level of client service, is responsive and anticipates issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="high-level-client-service" className="flex items-center gap-2 cursor-pointer">
                <div className={`w-6 h-6 border rounded flex items-center justify-center ${clientServiceData.highLevelClientService ? 'bg-primary text-white' : 'bg-white'}`}>
                  {clientServiceData.highLevelClientService && <Check className="h-4 w-4" />}
                </div>
                <span>I confirm that I deliver a high level of client service</span>
              </Label>
              <input 
                id="high-level-client-service"
                type="checkbox"
                className="hidden"
                checked={clientServiceData.highLevelClientService}
                onChange={() => toggleCheckbox(setClientServiceData, 'highLevelClientService')}
              />
            </div>
            
            <Textarea 
              placeholder="Provide examples of how you deliver exceptional client service and anticipate issues..."
              className="min-h-32 mb-4"
              value={clientServiceData.clientServiceDetails}
              onChange={(e) => handleTextChange(e, 'clientServiceDetails', setClientServiceData)}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.5.1').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.5.1"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.5.1')}
                className="hidden"
              />
              {selectedFiles['6.5.1'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.5.1'].name}</span>
              )}
            </div>
            {existingPdfs['6.5.1'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Specialist Training */}
      <Card>
        <CardHeader>
          <CardTitle>Specialist Training (6.5.2)</CardTitle>
          <CardDescription>Researches, designs and delivers specialist training to a wide range of clients and third parties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Specialist Training Sessions</Label>
              <Progress 
                value={(trainingData.specialistTrainingCount / trainingData.targetTrainingCount) * 100} 
                className="h-2 w-full"
              />
              <div className="flex flex-row items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateTrainingCount(-1)} 
                  className="rounded-full h-5 w-5"
                >
                  <span>-</span>
                </Button>
                <p>{trainingData.specialistTrainingCount} of {trainingData.targetTrainingCount} training sessions</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => updateTrainingCount(1)} 
                  className="rounded-full h-5 w-5"
                >
                  <span>+</span>
                </Button>
              </div>
            </div>
            
            <Textarea 
              placeholder="Provide details about the specialist training you've designed and delivered..."
              className="min-h-32 mb-4"
              value={trainingData.trainingDetails}
              onChange={(e) => handleTextChange(e, 'trainingDetails', setTrainingData)}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.5.2').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.5.2"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.5.2')}
                className="hidden"
              />
              {selectedFiles['6.5.2'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.5.2'].name}</span>
              )}
            </div>
            {existingPdfs['6.5.2'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Personal Example */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Example (6.5.3)</CardTitle>
          <CardDescription>Operates by personal example</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="operates-by-example" className="flex items-center gap-2 cursor-pointer">
                <div className={`w-6 h-6 border rounded flex items-center justify-center ${personalExampleData.operatesByExample ? 'bg-primary text-white' : 'bg-white'}`}>
                  {personalExampleData.operatesByExample && <Check className="h-4 w-4" />}
                </div>
                <span>I confirm that I operate by personal example</span>
              </Label>
              <input 
                id="operates-by-example"
                type="checkbox"
                className="hidden"
                checked={personalExampleData.operatesByExample}
                onChange={() => toggleCheckbox(setPersonalExampleData, 'operatesByExample')}
              />
            </div>
            
            <Textarea 
              placeholder="Provide examples of how you lead by personal example..."
              className="min-h-32 mb-4"
              value={personalExampleData.exampleDetails}
              onChange={(e) => handleTextChange(e, 'exampleDetails', setPersonalExampleData)}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.5.3').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.5.3"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.5.3')}
                className="hidden"
              />
              {selectedFiles['6.5.3'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.5.3'].name}</span>
              )}
            </div>
            {existingPdfs['6.5.3'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Business Benefit */}
      <Card>
        <CardHeader>
          <CardTitle>Business Benefit (6.5.4)</CardTitle>
          <CardDescription>Works for the benefit of the business as a whole</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="business-benefit" className="flex items-center gap-2 cursor-pointer">
                <div className={`w-6 h-6 border rounded flex items-center justify-center ${businessBenefitData.worksForBusinessBenefit ? 'bg-primary text-white' : 'bg-white'}`}>
                  {businessBenefitData.worksForBusinessBenefit && <Check className="h-4 w-4" />}
                </div>
                <span>I confirm that I work for the benefit of the business as a whole</span>
              </Label>
              <input 
                id="business-benefit"
                type="checkbox"
                className="hidden"
                checked={businessBenefitData.worksForBusinessBenefit}
                onChange={() => toggleCheckbox(setBusinessBenefitData, 'worksForBusinessBenefit')}
              />
            </div>
            
            <Textarea 
              placeholder="Provide examples of how you contribute to the business as a whole..."
              className="min-h-32 mb-4"
              value={businessBenefitData.businessBenefitDetails}
              onChange={(e) => handleTextChange(e, 'businessBenefitDetails', setBusinessBenefitData)}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.5.4').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.5.4"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.5.4')}
                className="hidden"
              />
              {selectedFiles['6.5.4'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.5.4'].name}</span>
              )}
            </div>
            {existingPdfs['6.5.4'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* File Management */}
      <Card>
        <CardHeader>
          <CardTitle>File Management (6.5.5)</CardTitle>
          <CardDescription>Oversees the smooth running of files to ensure that clients and matters are opened and managed in accordance with defined process and good practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="file-management" className="flex items-center gap-2 cursor-pointer">
                <div className={`w-6 h-6 border rounded flex items-center justify-center ${fileManagementData.overseesFileManagement ? 'bg-primary text-white' : 'bg-white'}`}>
                  {fileManagementData.overseesFileManagement && <Check className="h-4 w-4" />}
                </div>
                <span>I confirm that I oversee smooth file management according to defined processes</span>
              </Label>
              <input 
                id="file-management"
                type="checkbox"
                className="hidden"
                checked={fileManagementData.overseesFileManagement}
                onChange={() => toggleCheckbox(setFileManagementData, 'overseesFileManagement')}
              />
            </div>
            
            <Textarea 
              placeholder="Provide examples of how you ensure proper file management and client matter handling..."
              className="min-h-32 mb-4"
              value={fileManagementData.fileManagementDetails}
              onChange={(e) => handleTextChange(e, 'fileManagementDetails', setFileManagementData)}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-6.5.5').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-6.5.5"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '6.5.5')}
                className="hidden"
              />
              {selectedFiles['6.5.5'] && (
                <span className="text-sm text-gray-500">{selectedFiles['6.5.5'].name}</span>
              )}
            </div>
            {existingPdfs['6.5.5'] && (
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