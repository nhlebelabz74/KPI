import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogHeader, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';
import { UploadCloud, Save, StarIcon, Check, Info } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Salaried and Equity Director Technical Skills Component
const TechnicalSkills = () => {
  const [technicalSkillsData, setTechnicalSkillsData] = useState({
    // 3.5.1 - Quality delivery
    qualityRating: 'meets',
    qualityEvidence: '',
    
    // 3.5.2 - Recognition as leading lawyer
    recognitionRating: 'meets',
    recognitionEvidence: '',
    
    // 3.5.3 - Sector specialism
    sectorSpecialism: '',
    sectorSpecialismEvidence: '',
    
    // 3.5.4 - Legal developments monitoring
    legalDevelopmentsRating: 'meets',
    legalDevelopmentsEvidence: '',
    
    // 3.5.5 - Client collaboration
    clientCollaborationRating: 'meets',
    clientCollaborationEvidence: '',
    
    // 3.5.6 - Interdepartmental relationships
    relationshipsRating: 'meets',
    relationshipsEvidence: '',
    
    // 3.5.7 - Learning and knowledge sharing
    knowledgeSharingRating: 'meets',
    knowledgeSharingEvidence: '',
    
    // 3.5.8 - Precedent development
    precedentDevelopmentRating: 'meets',
    precedentDevelopmentEvidence: ''
  });

  const [selectedFiles, setSelectedFiles] = useState({});
  const [existingPdfs, setExistingPdfs] = useState({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Simulating loading data from a file or API
        const savedTechnicalSkillsData = await window.electronAPI.readTechnicalSkillsFile('director');
        if (savedTechnicalSkillsData) {
          setTechnicalSkillsData(prev => ({
            ...prev,
            ...savedTechnicalSkillsData
          }));
        }

        // Check which PDFs exist
        const kpiIds = ['3.5.1', '3.5.2', '3.5.3', '3.5.4', '3.5.5', '3.5.6', '3.5.7', '3.5.8'];
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

  const handleRatingChange = (value, field) => {
    setTechnicalSkillsData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTextChange = (event, field) => {
    setTechnicalSkillsData(prev => ({
      ...prev,
      [field]: event.target.value
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

  const saveAllData = async () => {
    try {
      // Save technical skills data
      await window.electronAPI.saveTechnicalSkillsFile('director', technicalSkillsData);
      
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

  // Rating options for the performance evaluation
  const ratingOptions = [
    { value: 'exceeds', label: 'Exceeds Expectations' },
    { value: 'meets', label: 'Meets Expectations' },
    { value: 'developing', label: 'Developing' },
    { value: 'improvement', label: 'Needs Improvement' }
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Technical Skills - Equity Director</h1>
      
      {/* 3.5.1. Quality Delivery */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Delivery (3.5.1)</CardTitle>
          <CardDescription>Delivers the highest levels of quality, both personally and within the department as well as across departments to ensure consistency of delivery.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              <Label>Self-Assessment</Label>
              <RadioGroup 
                value={technicalSkillsData.qualityRating} 
                onValueChange={(value) => handleRatingChange(value, 'qualityRating')}
                className="flex flex-col space-y-2"
              >
                {ratingOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`quality-${option.value}`} />
                    <Label htmlFor={`quality-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="Provide evidence of how you consistently deliver high quality work..."
              className="min-h-32 mb-4"
              value={technicalSkillsData.qualityEvidence}
              onChange={(e) => handleTextChange(e, 'qualityEvidence')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-3.5.1').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-3.5.1"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '3.5.1')}
                className="hidden"
              />
              {selectedFiles['3.5.1'] && (
                <span className="text-sm text-gray-500">{selectedFiles['3.5.1'].name}</span>
              )}
            </div>
            {existingPdfs['3.5.1'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* 3.5.2. Recognition as a Leading Lawyer */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Recognition (3.5.2)</CardTitle>
          <CardDescription>Recognised externally and internally as a leading lawyer in their area of specialism.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              <Label>Self-Assessment</Label>
              <RadioGroup 
                value={technicalSkillsData.recognitionRating} 
                onValueChange={(value) => handleRatingChange(value, 'recognitionRating')}
                className="flex flex-col space-y-2"
              >
                {ratingOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`recognition-${option.value}`} />
                    <Label htmlFor={`recognition-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="Provide evidence of your recognition as a leading lawyer (e.g., awards, directory listings, speaking engagements)..."
              className="min-h-32 mb-4"
              value={technicalSkillsData.recognitionEvidence}
              onChange={(e) => handleTextChange(e, 'recognitionEvidence')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-3.5.2').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-3.5.2"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '3.5.2')}
                className="hidden"
              />
              {selectedFiles['3.5.2'] && (
                <span className="text-sm text-gray-500">{selectedFiles['3.5.2'].name}</span>
              )}
            </div>
            {existingPdfs['3.5.2'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* 3.5.3. Sector Specialism */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Specialism (3.5.3)</CardTitle>
          <CardDescription>A practice specialist who has at least one sector specialism.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              <Label>Sector Specialism(s)</Label>
              <Textarea 
                placeholder="List your sector specialisms..."
                className="min-h-16 mb-4"
                value={technicalSkillsData.sectorSpecialism}
                onChange={(e) => handleTextChange(e, 'sectorSpecialism')}
              />
            </div>
            
            <Textarea 
              placeholder="Provide evidence of your sector specialism (e.g., clients served, matters handled, knowledge shared)..."
              className="min-h-32 mb-4"
              value={technicalSkillsData.sectorSpecialismEvidence}
              onChange={(e) => handleTextChange(e, 'sectorSpecialismEvidence')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-3.5.3').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-3.5.3"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '3.5.3')}
                className="hidden"
              />
              {selectedFiles['3.5.3'] && (
                <span className="text-sm text-gray-500">{selectedFiles['3.5.3'].name}</span>
              )}
            </div>
            {existingPdfs['3.5.3'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* 3.5.4. Legal Developments Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Developments Monitoring (3.5.4)</CardTitle>
          <CardDescription>Monitors legal developments to anticipate changes and prepare for their impact.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              <Label>Self-Assessment</Label>
              <RadioGroup 
                value={technicalSkillsData.legalDevelopmentsRating} 
                onValueChange={(value) => handleRatingChange(value, 'legalDevelopmentsRating')}
                className="flex flex-col space-y-2"
              >
                {ratingOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`legal-${option.value}`} />
                    <Label htmlFor={`legal-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="Describe how you monitor legal developments and prepare for their impact..."
              className="min-h-32 mb-4"
              value={technicalSkillsData.legalDevelopmentsEvidence}
              onChange={(e) => handleTextChange(e, 'legalDevelopmentsEvidence')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-3.5.4').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-3.5.4"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '3.5.4')}
                className="hidden"
              />
              {selectedFiles['3.5.4'] && (
                <span className="text-sm text-gray-500">{selectedFiles['3.5.4'].name}</span>
              )}
            </div>
            {existingPdfs['3.5.4'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* 3.5.5. Client Collaboration */}
      <Card>
        <CardHeader>
          <CardTitle>Client Collaboration (3.5.5)</CardTitle>
          <CardDescription>Collaborates with clients to find innovative solutions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              <Label>Self-Assessment</Label>
              <RadioGroup 
                value={technicalSkillsData.clientCollaborationRating} 
                onValueChange={(value) => handleRatingChange(value, 'clientCollaborationRating')}
                className="flex flex-col space-y-2"
              >
                {ratingOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`client-${option.value}`} />
                    <Label htmlFor={`client-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="Provide examples of how you have collaborated with clients to find innovative solutions..."
              className="min-h-32 mb-4"
              value={technicalSkillsData.clientCollaborationEvidence}
              onChange={(e) => handleTextChange(e, 'clientCollaborationEvidence')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-3.5.5').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-3.5.5"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '3.5.5')}
                className="hidden"
              />
              {selectedFiles['3.5.5'] && (
                <span className="text-sm text-gray-500">{selectedFiles['3.5.5'].name}</span>
              )}
            </div>
            {existingPdfs['3.5.5'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* 3.5.6. Interdepartmental Relationships */}
      <Card>
        <CardHeader>
          <CardTitle>Interdepartmental Relationships (3.5.6)</CardTitle>
          <CardDescription>Creates strong relationships with all departments to share expertise and impart knowledge.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              <Label>Self-Assessment</Label>
              <RadioGroup 
                value={technicalSkillsData.relationshipsRating} 
                onValueChange={(value) => handleRatingChange(value, 'relationshipsRating')}
                className="flex flex-col space-y-2"
              >
                {ratingOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`relationships-${option.value}`} />
                    <Label htmlFor={`relationships-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="Describe how you create strong relationships with other departments and share expertise..."
              className="min-h-32 mb-4"
              value={technicalSkillsData.relationshipsEvidence}
              onChange={(e) => handleTextChange(e, 'relationshipsEvidence')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-3.5.6').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-3.5.6"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '3.5.6')}
                className="hidden"
              />
              {selectedFiles['3.5.6'] && (
                <span className="text-sm text-gray-500">{selectedFiles['3.5.6'].name}</span>
              )}
            </div>
            {existingPdfs['3.5.6'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* 3.5.7. Knowledge Sharing */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Sharing (3.5.7)</CardTitle>
          <CardDescription>Actively promotes, engages in and embeds learning and shares knowledge across the firm.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              <Label>Self-Assessment</Label>
              <RadioGroup 
                value={technicalSkillsData.knowledgeSharingRating} 
                onValueChange={(value) => handleRatingChange(value, 'knowledgeSharingRating')}
                className="flex flex-col space-y-2"
              >
                {ratingOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`knowledge-${option.value}`} />
                    <Label htmlFor={`knowledge-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="Provide examples of how you promote learning and share knowledge across the firm..."
              className="min-h-32 mb-4"
              value={technicalSkillsData.knowledgeSharingEvidence}
              onChange={(e) => handleTextChange(e, 'knowledgeSharingEvidence')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-3.5.7').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-3.5.7"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '3.5.7')}
                className="hidden"
              />
              {selectedFiles['3.5.7'] && (
                <span className="text-sm text-gray-500">{selectedFiles['3.5.7'].name}</span>
              )}
            </div>
            {existingPdfs['3.5.7'] && (
              <div className="text-sm text-green-600">
                Existing evidence PDF found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* 3.5.8. Precedent Development */}
      <Card>
        <CardHeader>
          <CardTitle>Precedent Development (3.5.8)</CardTitle>
          <CardDescription>Works closely with department to develop the most complex precedents.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              <Label>Self-Assessment</Label>
              <RadioGroup 
                value={technicalSkillsData.precedentDevelopmentRating} 
                onValueChange={(value) => handleRatingChange(value, 'precedentDevelopmentRating')}
                className="flex flex-col space-y-2"
              >
                {ratingOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`precedent-${option.value}`} />
                    <Label htmlFor={`precedent-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <Textarea 
              placeholder="Describe how you work with the department to develop complex precedents..."
              className="min-h-32 mb-4"
              value={technicalSkillsData.precedentDevelopmentEvidence}
              onChange={(e) => handleTextChange(e, 'precedentDevelopmentEvidence')}
            />
            
            <div className="flex items-center gap-2 mb-2">
              <Button onClick={() => document.getElementById('file-3.5.8').click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Evidence
              </Button>
              <input
                id="file-3.5.8"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, '3.5.8')}
                className="hidden"
              />
              {selectedFiles['3.5.8'] && (
                <span className="text-sm text-gray-500">{selectedFiles['3.5.8'].name}</span>
              )}
            </div>
            {existingPdfs['3.5.8'] && (
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
              Your technical skills assessment data has been saved.
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

export default TechnicalSkills;