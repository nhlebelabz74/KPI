import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Save, CheckCircle, Loader2, XCircle, Download } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/authContext';
import request from '@/utils/request';
import { KPI_Types as types } from '@/constants';

const TeamworkBase = ({ role }) => {
  const [selfAssessment, setSelfAssessment] = useState('');
  const [documents, setDocuments] = useState({
    director: null,
    peer: null
  });
  const [existingDocuments, setExistingDocuments] = useState({
    director: false,
    peer: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const { isAuthenticated } = useAuth();
  const encryptedEmail = localStorage.getItem('encryptedEmail');

  const roleMap = {
    'Equity Partner': 5,
    'Salaried Partner': 4,
    'Candidate Attorney': 1,
    'Senior Associate': 3,
    'Associate': 2,
  }

  // deal with this later
  const ca_teamwork = () => {}

  // KPI Mappings
  const TEAMWORK_KPIS = {
    selfAssessment: {
      number: `2.${roleMap[role]}.1`,
      question: `${role} Teamwork Self-Assessment`,
    },
    directorDocument: {
      number: `2.${roleMap[role]}.2`,
      question: 'Director Assessment Document',
    },
    peerDocument: {
      number: `2.${roleMap[role]}.3`,
      question: 'Peer Assessment Document',
    }
  };

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        
        // Load self-assessment text
        const selfAssessmentResponse = await request({
          type: 'GET',
          route: `/users/get/response/:email/:kpiNumber`,
          routeParams: {
            email: encodeURIComponent(encryptedEmail),
            kpiNumber: TEAMWORK_KPIS.selfAssessment.number
          }
        });
        
        if (selfAssessmentResponse.data?.response?.answer) {
          setSelfAssessment(selfAssessmentResponse.data.response.answer);
        }
        
        // Check which documents exist
        const documentTypes = ['director', 'peer'];
        const docStatus = {};
        
        for (const docType of documentTypes) {
          const kpiNumber = docType === 'director' 
            ? TEAMWORK_KPIS.directorDocument.number 
            : TEAMWORK_KPIS.peerDocument.number;
            
          const docResponse = await request({
            type: 'GET',
            route: `/users/get/response/:email/:kpiNumber`,
            routeParams: {
              email: encodeURIComponent(encryptedEmail),
              kpiNumber: kpiNumber
            }
          });
          
          docStatus[docType] = !!docResponse.data?.response?.documents;
        }
        
        setExistingDocuments(docStatus);
      } catch (error) {
        console.error(`Error loading saved ${role.toLowerCase()} teamwork data:`, error);
        setError('Failed to load teamwork data');
      } finally {
        setLoading(false);
      }
    };
    
    loadSavedData();
  }, [isAuthenticated]);

  // Function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

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
      setLoading(true);
      setError(null);
      setActionMessage("Saving teamwork assessment data");
      setShowLoadingDialog(true);
      
      // Save self-assessment text
      await request({
        type: 'POST',
        route: '/users/update/response',
        body: {
          email: encodeURIComponent(encryptedEmail),
          kpiNumber: TEAMWORK_KPIS.selfAssessment.number,
          type: types.TEAMWORK,
          question: TEAMWORK_KPIS.selfAssessment.question,
          answer: selfAssessment
        }
      });
      
      // Save documents if present
      for (const docType in documents) {
        if (documents[docType]) {
          setActionMessage(`Processing ${docType} document`);
          
          // Convert file to base64
          const base64Data = await fileToBase64(documents[docType]);
          
          // Determine KPI number based on document type
          const kpiNumber = docType === 'director' 
            ? TEAMWORK_KPIS.directorDocument.number 
            : TEAMWORK_KPIS.peerDocument.number;
            
          const questionText = docType === 'director' 
            ? TEAMWORK_KPIS.directorDocument.question 
            : TEAMWORK_KPIS.peerDocument.question;
          
          // Create documents metadata with filename
          const documentsMetadata = JSON.stringify({
            fileName: documents[docType].name,
            uploadDate: new Date().toISOString()
          });
          
          // Save document
          await request({
            type: 'POST',
            route: '/users/update/response',
            body: {
              email: encodeURIComponent(encryptedEmail),
              kpiNumber: kpiNumber,
              type: types.TEAMWORK,
              question: questionText,
              answer: `${docType} document uploaded`,
              documents: base64Data,
              documents_metadata: documentsMetadata
            }
          });
          
          // Update existing documents status
          setExistingDocuments(prev => ({
            ...prev,
            [docType]: true
          }));
        }
      }
      
      // Clear document selections after successful save
      setDocuments({
        director: null,
        peer: null
      });
      
      setShowLoadingDialog(false);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error(`Error saving ${role.toLowerCase()} teamwork data:`, error);
      setError(error.message || 'Failed to save teamwork data');
      setShowLoadingDialog(false);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to download the existing documents
  const downloadDocuments = async (docType) => {
    try {
      setLoading(true);
      setActionMessage(`Downloading ${docType} document`);
      setShowLoadingDialog(true);
      
      // Determine KPI number based on document type
      const kpiNumber = docType === 'director' 
        ? TEAMWORK_KPIS.directorDocument.number 
        : TEAMWORK_KPIS.peerDocument.number;
        
      // Fetch document data
      const response = await request({
        type: 'GET',
        route: `/users/get/response/:email/:kpiNumber`,
        routeParams: {
          email: encodeURIComponent(encryptedEmail),
          kpiNumber: kpiNumber
        }
      });
      
      // Check if document exists
      if (!response.data?.response?.documents) {
        throw new Error(`No ${docType} document found`);
      }
      
      const documentData = response.data.response.documents;
      
      // Get filename from metadata if available
      let fileName = `${docType}-assessment.pdf`;
      try {
        if (response.data.response.documents_metadata) {
          const metadata = JSON.parse(response.data.response.documents_metadata);
          if (metadata.fileName) {
            fileName = metadata.fileName;
          }
        }
      } catch (e) {
        console.error('Error parsing document metadata:', e);
      }
      
      // Create download link
      const linkSource = documentData;
      const downloadLink = document.createElement('a');
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
      
      setShowLoadingDialog(false);
    } catch (error) {
      console.error(`Error downloading ${docType} document:`, error);
      setError(`Failed to download ${docType} document: ${error.message}`);
      setShowLoadingDialog(false);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{role} Teamwork Assessment</CardTitle>
        <CardDescription>
          Provide a self-assessment of your teamwork abilities and upload supporting documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Self-Assessment</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Describe how you demonstrate the following {role.toLowerCase()} teamwork capabilities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Mentorship & Development</h4>
              <ul className="text-sm text-muted-foreground list-disc ml-6 space-y-1">
                <li>Mentoring and developing candidate attorneys</li>
                <li>Seeking feedback and learning opportunities</li>
                <li>Coaching junior colleagues</li>
                <li>Sharing knowledge and resources</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Collaboration & Communication</h4>
              <ul className="text-sm text-muted-foreground list-disc ml-6 space-y-1">
                <li>Collaborating to solve problems</li>
                <li>Working with colleagues across the firm</li>
                <li>Effective communication and honest feedback</li>
                <li>Contributing to matters led by senior colleagues</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Professional Responsibility</h4>
              <ul className="text-sm text-muted-foreground list-disc ml-6 space-y-1">
                <li>Identifying potential risks and seeking guidance</li>
                <li>Taking responsibility for delegated work</li>
                <li>Working at sustained levels of high intensity</li>
                <li>Acknowledging others' contributions</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Adaptability & Growth</h4>
              <ul className="text-sm text-muted-foreground list-disc ml-6 space-y-1">
                <li>Challenging without confrontation</li>
                <li>Responding positively to change and challenges</li>
                <li>Understanding the impact of personal style</li>
                <li>Self-awareness and adapting to situations</li>
              </ul>
            </div>
          </div>
          <Textarea 
            placeholder={`Provide your self-assessment of ${role.toLowerCase()} teamwork capabilities...`}
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
                <Button 
                  onClick={() => document.getElementById(`${role.toLowerCase().split(" ").join("-")}-file-director`).click()}
                  className="cursor-pointer"
                  disabled={loading}
                >
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Director Document
                </Button>
                <input
                  id={`${role.toLowerCase().split(" ").join("-")}-file-director`}
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
                {/* For Director document */}
                {existingDocuments.director && (
                  <Button 
                    variant="outline" 
                    onClick={() => downloadDocuments('director')}
                    disabled={loading}
                    className="cursor-pointer"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download Director Assessment
                  </Button>
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
                <Button 
                  onClick={() => document.getElementById(`${role.toLowerCase().split(" ").join("-")}-file-peer`).click()}
                  className="cursor-pointer"
                  disabled={loading}
                >
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Peer Document
                </Button>
                <input
                  id={`${role.toLowerCase().split(" ").join("-")}-file-peer`}
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
                {/* For Peer document */}
                {existingDocuments.peer && (
                  <Button 
                    variant="outline" 
                    onClick={() => downloadDocuments('peer')}
                    disabled={loading}
                    className="cursor-pointer"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download Peer Assessment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={saveTeamworkData} 
          disabled={loading}
          className="cursor-pointer"
        >
          <Save className="mr-2 h-4 w-4" /> Save {role} Teamwork Assessment
        </Button>

        {/* Loading Dialog */}
        <AlertDialog open={showLoadingDialog} onOpenChange={setShowLoadingDialog}>
          <AlertDialogContent>
            <div className="flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <AlertDialogTitle>Saving Teamwork Data</AlertDialogTitle>
              <AlertDialogDescription>
                {actionMessage || 'Please wait while your teamwork data is being saved...'}
              </AlertDialogDescription>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Success Dialog */}
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <AlertDialogTitle>Teamwork Data Saved</AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                Your {role.toLowerCase()} teamwork assessment and supporting documents have been saved successfully.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Error Dialog */}
        <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
          <AlertDialogContent className="border-red-500">
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <AlertDialogTitle>Error Saving Teamwork Data</AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                {error || 'Failed to save teamwork data. Please try again.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default TeamworkBase;