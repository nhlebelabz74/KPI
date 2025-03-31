import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, Save } from 'lucide-react';
import { AlertDialog, AlertDialogHeader, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';

const QualitativeKPISection = () => {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [textInputs, setTextInputs] = useState({});
  const [existingPdfs, setExistingPdfs] = useState({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load text inputs
        const savedData = await window.electronAPI.loadQualitativeData();
        setTextInputs(savedData);
        
        // Check which PDFs exist
        const kpiNumbers = ['1.5.1', '1.5.2', '1.5.3', '1.5.4'];
        const pdfStatus = {};
        
        for (const kpiNumber of kpiNumbers) {
          pdfStatus[kpiNumber] = await window.electronAPI.checkPdfExists(kpiNumber);
        }
        
        setExistingPdfs(pdfStatus);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };
    
    loadSavedData();
  }, []);

  const handleFileChange = (event, kpiNumber) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFiles(prev => ({
        ...prev,
        [kpiNumber]: file
      }));
    }
  };

  const handleTextChange = (event, kpiNumber) => {
    setTextInputs(prev => ({
      ...prev,
      [kpiNumber]: event.target.value
    }));
  };

  const saveQualitativeData = async () => {
    try {
      // Prepare data to save
      const dataToSave = {
        textData: textInputs,
        files: selectedFiles
      };
      
      // Save all data at once
      const result = await window.electronAPI.saveQualitativeData(dataToSave);
      
      // Update existing PDFs status
      const updatedPdfs = { ...existingPdfs };
      for (const kpiNumber in selectedFiles) {
        updatedPdfs[kpiNumber] = true;
      }
      setExistingPdfs(updatedPdfs);
      
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error saving qualitative data:', error);
      alert('Failed to save qualitative data');
    }
  };

  // Render function for each KPI card
  const renderKpiCard = (kpiNumber, title, description) => (
    <Card key={kpiNumber} className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea 
          placeholder={`Describe how you meet this requirement...`}
          className="min-h-32 mb-4"
          onChange={(e) => handleTextChange(e, kpiNumber)}
          value={textInputs[kpiNumber] || ''}
        />
        <div className="flex items-center gap-2 mb-2">
          <Button onClick={() => document.getElementById(`file-${kpiNumber}`).click()}>
            <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
          </Button>
          <input
            id={`file-${kpiNumber}`}
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, kpiNumber)}
            className="hidden"
          />
          {selectedFiles[kpiNumber] && (
            <span className="text-sm text-gray-500">{selectedFiles[kpiNumber].name}</span>
          )}
        </div>
        {existingPdfs[kpiNumber] && (
          <div className="text-sm text-green-600">
            Existing evidence PDF found for this KPI
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 gap-4">
      {renderKpiCard(
        '1.5.1',
        'Financial Contribution',
        'Demonstrates significant measurable financial contribution to maintain or grow the margin.'
      )}
      
      {renderKpiCard(
        '1.5.2',
        'Fee Growth and Cross-Selling',
        'On leading work takes initiative to increase fees and cross sell other practice areas.'
      )}
      
      {renderKpiCard(
        '1.5.3',
        'Risk Management',
        'Reviews areas of potential risk and puts systems in place to manage these, reviewing progress and performance on a regular basis.'
      )}
      
      {renderKpiCard(
        '1.5.4',
        'Referral Generation',
        'Makes referrals to other areas of the firm that result in new opportunities.'
      )}
      
      <div className="mt-4">
        <Button onClick={saveQualitativeData} size="lg">
          <Save className="mr-2 h-4 w-4" /> Save All Qualitative Data
        </Button>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Data Saved Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              Your KPI data and supporting evidence have been saved.
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

const Profitability = () => {
  return (
    <Tabs defaultValue="qualitative" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="qualitative">Equity Director KPIs</TabsTrigger>
      </TabsList>

      <TabsContent value="qualitative">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Equity Director Performance Criteria</CardTitle>
            <CardDescription>
              Document your performance against the key requirements for Equity Directors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QualitativeKPISection />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Profitability;