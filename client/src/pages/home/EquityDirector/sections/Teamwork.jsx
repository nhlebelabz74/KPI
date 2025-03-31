import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Save, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';

const Teamwork = () => {
  const [selfAssessment, setSelfAssessment] = useState('');
  const [documents, setDocuments] = useState({
    fellowDirector: null,
    colleague: null
  });
  const [existingDocuments, setExistingDocuments] = useState({
    fellowDirector: false,
    colleague: false
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load text input
        const savedData = await window.electronAPI.loadEquityDirectorTeamworkData();
        if (savedData && savedData.selfAssessment) {
          setSelfAssessment(savedData.selfAssessment);
        }
        
        // Check which documents exist
        const documentTypes = ['fellowDirector', 'colleague'];
        const docStatus = {};
        
        for (const docType of documentTypes) {
          docStatus[docType] = await window.electronAPI.checkEquityDirectorTeamworkDocExists(docType);
        }
        
        setExistingDocuments(docStatus);
      } catch (error) {
        console.error('Error loading saved equity director teamwork data:', error);
      }
    };
    
    loadSavedData();
  }, []);

  const handleFileChange = (event, docType) => {
    const file = event.target.files[0];
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [docType]: file
      }));
    }
  };

  const handleTextChange = (event) => {
    setSelfAssessment(event.target.value);
  };

  const saveTeamworkData = async () => {
    try {
      // Prepare data to save
      const dataToSave = {
        selfAssessment,
        documents
      };
      
      // Save all data at once
      await window.electronAPI.saveEquityDirectorTeamworkData(dataToSave);
      
      // Update existing documents status
      const updatedDocs = { ...existingDocuments };
      for (const docType in documents) {
        if (documents[docType]) {
          updatedDocs[docType] = true;
        }
      }
      setExistingDocuments(updatedDocs);
      
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error saving equity director teamwork data:', error);
      alert('Failed to save teamwork data');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Equity Director Teamwork Assessment</CardTitle>
        <CardDescription>
          Provide a self-assessment of your teamwork abilities and upload supporting documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Self-Assessment</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Describe how you demonstrate the following equity director teamwork capabilities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Management Team Participation</h4>
              <ul className="text-sm text-muted-foreground list-disc ml-6 space-y-1">
                <li>Making decisions as part of the management team</li>
                <li>Upholding and supporting management decisions</li>
                <li>Influencing positively and challenging negativity</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Cross-Departmental Collaboration</h4>
              <ul className="text-sm text-muted-foreground list-disc ml-6 space-y-1">
                <li>Building knowledge across departments</li>
                <li>Leading briefings and knowledge-sharing activities</li>
                <li>Establishing strong internal relationships</li>
                <li>Ensuring consistency and quality of delivery</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">People Development</h4>
              <ul className="text-sm text-muted-foreground list-disc ml-6 space-y-1">
                <li>Supervising junior colleagues effectively</li>
                <li>Providing honest feedback for development</li>
                <li>Managing technical competence and risk</li>
                <li>Seeking personal feedback to enhance performance</li>
              </ul>
            </div>
          </div>
          <Textarea 
            placeholder="Provide your self-assessment of equity director teamwork capabilities..."
            className="min-h-64"
            value={selfAssessment}
            onChange={handleTextChange}
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fellow Director Assessment</CardTitle>
              <CardDescription>Upload teamwork assessment from a fellow director</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Button onClick={() => document.getElementById('equity-director-file-fellow').click()}>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Fellow Director Document
                </Button>
                <input
                  id="equity-director-file-fellow"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'fellowDirector')}
                  className="hidden"
                />
                {documents.fellowDirector && (
                  <p className="text-sm text-muted-foreground">{documents.fellowDirector.name}</p>
                )}
                {existingDocuments.fellowDirector && !documents.fellowDirector && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Fellow director assessment document already uploaded
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Colleague Assessment</CardTitle>
              <CardDescription>Upload teamwork assessment from a work colleague</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Button onClick={() => document.getElementById('equity-director-file-colleague').click()}>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Colleague Document
                </Button>
                <input
                  id="equity-director-file-colleague"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'colleague')}
                  className="hidden"
                />
                {documents.colleague && (
                  <p className="text-sm text-muted-foreground">{documents.colleague.name}</p>
                )}
                {existingDocuments.colleague && !documents.colleague && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Colleague assessment document already uploaded
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveTeamworkData}>
          <Save className="mr-2 h-4 w-4" /> Save Equity Director Teamwork Assessment
        </Button>

        {/* Success Dialog */}
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Teamwork Data Saved</AlertDialogTitle>
              <AlertDialogDescription>
                Your equity director teamwork assessment and supporting documents have been saved successfully.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default Teamwork;