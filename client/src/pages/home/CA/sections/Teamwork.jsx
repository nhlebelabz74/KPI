import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Save, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';

const Teamwork = () => {
  const [selfAssessment, setSelfAssessment] = useState('');
  const [documents, setDocuments] = useState({
    director: null,
    peer: null
  });
  const [existingDocuments, setExistingDocuments] = useState({
    director: false,
    peer: false
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load text input
        const savedData = await window.electronAPI.loadTeamworkData();
        if (savedData && savedData.selfAssessment) {
          setSelfAssessment(savedData.selfAssessment);
        }
        
        // Check which documents exist
        const documentTypes = ['director', 'peer'];
        const docStatus = {};
        
        for (const docType of documentTypes) {
          docStatus[docType] = await window.electronAPI.checkTeamworkDocExists(docType);
        }
        
        setExistingDocuments(docStatus);
      } catch (error) {
        console.error('Error loading saved teamwork data:', error);
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
      await window.electronAPI.saveTeamworkData(dataToSave);
      
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
      console.error('Error saving teamwork data:', error);
      alert('Failed to save teamwork data');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Teamwork Assessment</CardTitle>
        <CardDescription>
          Provide a self-assessment of your teamwork abilities and upload supporting documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Self-Assessment</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Describe how you demonstrate the following teamwork capabilities:
          </p>
          <ul className="text-sm text-muted-foreground mb-4 list-disc ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
            <li>Building good interpersonal relationships</li>
            <li>Checking prejudices at the door</li>
            <li>Managing stress appropriately</li>
            <li>Taking initiative with colleagues</li>
            <li>Taking responsibility for actions</li>
            <li>Maintaining professional conduct</li>
            <li>Showing loyalty to the team</li>
            <li>Respecting colleagues' boundaries</li>
            <li>Communicating effectively</li>
            <li>Managing deadlines and expectations</li>
            <li>Planning and organizing priorities</li>
            <li>Working as a department resource</li>
            <li>Establishing strong department relationships</li>
          </ul>
          <Textarea 
            placeholder="Provide your self-assessment of teamwork capabilities..."
            className="min-h-64"
            value={selfAssessment}
            onChange={handleTextChange}
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Director Assessment</CardTitle>
              <CardDescription>Upload teamwork assessment from your director</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Button onClick={() => document.getElementById('file-director').click()}>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Director Document
                </Button>
                <input
                  id="file-director"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'director')}
                  className="hidden"
                />
                {documents.director && (
                  <p className="text-sm text-muted-foreground">{documents.director.name}</p>
                )}
                {existingDocuments.director && !documents.director && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Director assessment document already uploaded
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Peer Assessment</CardTitle>
              <CardDescription>Upload teamwork assessment from a peer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Button onClick={() => document.getElementById('file-peer').click()}>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Peer Document
                </Button>
                <input
                  id="file-peer"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'peer')}
                  className="hidden"
                />
                {documents.peer && (
                  <p className="text-sm text-muted-foreground">{documents.peer.name}</p>
                )}
                {existingDocuments.peer && !documents.peer && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Peer assessment document already uploaded
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveTeamworkData}>
          <Save className="mr-2 h-4 w-4" /> Save Teamwork Assessment
        </Button>

        {/* Success Dialog */}
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Teamwork Data Saved</AlertDialogTitle>
              <AlertDialogDescription>
                Your teamwork assessment and supporting documents have been saved successfully.
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