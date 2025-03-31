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
        const savedData = await window.electronAPI.loadSeniorAssociateTeamworkData();
        if (savedData && savedData.selfAssessment) {
          setSelfAssessment(savedData.selfAssessment);
        }
        
        // Check which documents exist
        const documentTypes = ['director', 'peer'];
        const docStatus = {};
        
        for (const docType of documentTypes) {
          docStatus[docType] = await window.electronAPI.checkSeniorAssociateTeamworkDocExists(docType);
        }
        
        setExistingDocuments(docStatus);
      } catch (error) {
        console.error('Error loading saved senior associate teamwork data:', error);
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
      await window.electronAPI.saveSeniorAssociateTeamworkData(dataToSave);
      
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
      console.error('Error saving senior associate teamwork data:', error);
      alert('Failed to save teamwork data');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Senior Associate Teamwork Assessment</CardTitle>
        <CardDescription>
          Provide a self-assessment of your teamwork abilities and upload supporting documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Self-Assessment</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Describe how you demonstrate the following senior associate teamwork capabilities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Leadership & Development</h4>
              <ul className="text-sm text-muted-foreground list-disc ml-6 space-y-1">
                <li>Professional development of juniors</li>
                <li>Coaching and supervising junior colleagues</li>
                <li>Providing timely and honest feedback</li>
                <li>Delegating to develop and motivate others</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Communication & Guidance</h4>
              <ul className="text-sm text-muted-foreground list-disc ml-6 space-y-1">
                <li>Articulating instructions clearly for team understanding</li>
                <li>Being approachable and supporting junior colleagues</li>
                <li>Influencing through clear and persuasive communication</li>
                <li>Taking departmental responsibility as a role model</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Knowledge Sharing</h4>
              <ul className="text-sm text-muted-foreground list-disc ml-6 space-y-1">
                <li>Sharing knowledge and resources across the firm</li>
                <li>Considering commercial impact in knowledge sharing</li>
                <li>Identifying opportunities beyond own department</li>
                <li>Connecting team contributions to departmental goals</li>
              </ul>
            </div>
          </div>
          <Textarea 
            placeholder="Provide your self-assessment of senior associate teamwork capabilities..."
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
                <Button onClick={() => document.getElementById('senior-associate-file-director').click()}>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Director Document
                </Button>
                <input
                  id="senior-associate-file-director"
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
                <Button onClick={() => document.getElementById('senior-associate-file-peer').click()}>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Peer Document
                </Button>
                <input
                  id="senior-associate-file-peer"
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
          <Save className="mr-2 h-4 w-4" /> Save Senior Associate Teamwork Assessment
        </Button>

        {/* Success Dialog */}
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Teamwork Data Saved</AlertDialogTitle>
              <AlertDialogDescription>
                Your senior associate teamwork assessment and supporting documents have been saved successfully.
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