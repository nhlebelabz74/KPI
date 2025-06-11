import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Save, Loader2, CheckCircle2, XCircle, Download, X } from 'lucide-react';
import { AlertDialog, AlertDialogHeader, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/authContext';
import request from '@/utils/request';
import { KPI_Types as types } from '@/constants';
import JSZip from 'jszip';

const leadershipIntro = `
Leadership doesn't apply only to people in positions of power, it applies to all of us. Responsive leadership doesn't apply only to directors, department leaders or management. It doesn't have a title, an age group or even a partner. In responsive organizations, people who take action are actively participating in the firm and communities. It means having responsibility for the good of the firm, your communities and your future people.
`;

// Common component for all leadership pages
const LeadershipBase = ({ role, criteria }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [explanations, setExplanations] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [existingPdf, setExistingPdf] = useState(false);
  const [documentMetadata, setDocumentMetadata] = useState({});
  
  const { isAuthenticated } = useAuth();
  const encryptedEmail = localStorage.getItem('encryptedEmail');

  const roleMapping = {
    "CA": 1,
    "Associate": 2,
    "SA": 3,
    "SDP": 4,
    "EDP": 5,
  }
  
  // KPI mapping
  const LEADERSHIP_KPI = {
    number: `5.${roleMapping[role]}`,
    type: types.LEADERSHIP,
    question: `${role} Leadership Requirements`,
  };

  useEffect(() => {
    const loadSavedData = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        
        // Get existing leadership data
        const response = await request({
          type: 'GET',
          route: `/users/get/response/:email/:kpiNumber`,
          routeParams: {
            email: encodeURIComponent(encryptedEmail),
            kpiNumber: LEADERSHIP_KPI.number
          }
        });
        
        // Set explanations from answer
        if (response.data?.response?.answer) {
          setExplanations(response.data.response.answer);
        }
        
        // Check if documents exist
        setExistingPdf(!!response.data?.response?.documents);
        
        // Parse metadata to get filenames
        if (response.data?.response?.documents_metadata) {
          try {
            const metadata = response.data.response.documents_metadata;
            setDocumentMetadata(metadata);
          } catch (e) {
            console.error('Error parsing document metadata:', e);
          }
        }
      } catch (error) {
        console.error('Error loading leadership data:', error);
        setError('Failed to load leadership data');
      } finally {
        setLoading(false);
      }
    };
    
    loadSavedData();
  }, [isAuthenticated, role]);

  // File processing functions
  const processFiles = async (files) => {
    try {
      // Add the new files to the selectedFiles state
      setSelectedFiles(prev => [...prev, ...Array.from(files)]);
    } catch (err) {
      console.error("Error processing files:", err);
      setError(`Error processing files: ${err.message}`);
    }
  };
  
  const filesToBase64 = async (files) => {
    // If there's only one file, just convert it to base64
    if (files.length === 1) {
      return await fileToBase64(files[0]);
    }
    
    // If there are multiple files, zip them first
    const zip = new JSZip();
    
    // Add all files to the zip
    for (const file of files) {
      zip.file(file.name, file);
    }
    
    // Generate zip file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    // Create a meaningful name for the zip file
    const zipFileName = `leadership-${role.toLowerCase()}-documents.zip`;
    const zipFile = new File([zipBlob], zipFileName, { type: 'application/zip' });
    
    // Convert zip to base64
    return await fileToBase64(zipFile);
  };
  
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };
  
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setActionMessage("Saving leadership evidence");
      setShowLoadingDialog(true);
      
      // Process documents if provided
      let documentsBase64 = null;
      let meta = null;
      
      if (selectedFiles.length > 0) {
        setActionMessage("Processing documents");
        documentsBase64 = await filesToBase64(selectedFiles);
        
        // Create metadata with filenames
        meta = {
          fileName: selectedFiles.length === 1 
            ? selectedFiles[0].name 
            : `${selectedFiles.length} files (zipped)`,
          fileCount: selectedFiles.length,
          fileNames: selectedFiles.map(file => file.name),
          uploadDate: new Date().toISOString()
        };
      }
      
      // Make the API request
      await request({
        type: 'POST',
        route: '/users/update/response',
        body: {
          email: encodeURIComponent(encryptedEmail),
          kpiNumber: LEADERSHIP_KPI.number,
          type: types.LEADERSHIP,
          question: LEADERSHIP_KPI.question,
          answer: explanations,
          documents: documentsBase64 ? documentsBase64 : "",
          documents_metadata: meta ? meta : {},
        }
      });
      
      // Update UI state
      if (selectedFiles.length > 0) {
        setExistingPdf(true);
        setDocumentMetadata(meta);
        setSelectedFiles([]);
      }
      
      setShowLoadingDialog(false);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error saving leadership data:', error);
      setError(error.message || 'Failed to save leadership data');
      setShowLoadingDialog(false);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };
  
  const downloadLeadershipPdf = async () => {
    try {
      setLoading(true);
      setActionMessage("Downloading leadership evidence");
      setShowLoadingDialog(true);
      
      // Fetch document data
      const response = await request({
        type: 'GET',
        route: `/users/get/response/:email/:kpiNumber`,
        routeParams: {
          email: encodeURIComponent(encryptedEmail),
          kpiNumber: LEADERSHIP_KPI.number
        }
      });
      
      // Check if document exists
      if (!response.data?.response?.documents) {
        throw new Error('No leadership document found');
      }
      
      const documentData = response.data.response.documents;
      
      // Get metadata and filename information
      let fileName = `leadership-${role.toLowerCase()}.pdf`;
      let isZipFile = false;
      
      try {
        if (response.data.response.documents_metadata) {
          const metadata = response.data.response.documents_metadata;
          
          // Check if this is a zip file (multiple files)
          if (metadata.fileCount && metadata.fileCount > 1) {
            fileName = `leadership-${role.toLowerCase()}-documents.zip`;
            isZipFile = true;
          } else if (metadata.fileName) {
            fileName = metadata.fileName;
          }
        }
      } catch (e) {
        console.error('Error parsing document metadata:', e);
      }
      
      // Extract base64 data (remove data URL prefix if present)
      let base64Data = documentData;
      if (base64Data.includes(',')) {
        base64Data = base64Data.split(',')[1];
      }
      
      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { 
        type: isZipFile ? 'application/zip' : 'application/pdf' 
      });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      setShowLoadingDialog(false);
    } catch (error) {
      console.error('Error downloading leadership document:', error);
      setError(`Failed to download leadership document: ${error.message}`);
      setShowLoadingDialog(false);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSuperDocument = async () => {
    try {
      await request({
        type: 'POST',
        route: '/users/request/super/document',
        body: {
          email: encodeURIComponent(encryptedEmail),
          type: types.LEADERSHIP,
        }
      });
    } catch (error) {
      console.error('Error requesting document:', error);

      if(error.sessionExpired) {
        
      }

      setError(`Failed to request document: ${error.message}`);
      setShowErrorDialog(true);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle>{role} Leadership Requirements</CardTitle>
          <CardDescription>{leadershipIntro}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Leadership Criteria:</h3>
            <ul className="list-disc pl-5 space-y-2">
              {criteria.map((criterion, index) => (
                <li key={index} className="text-sm">
                  {criterion}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Examples/Explanations:
            </label>
            <textarea
              className="w-full p-2 border rounded min-h-[150px]"
              placeholder="Describe how you've demonstrated these leadership characteristics with specific examples..."
              value={explanations}
              onChange={(e) => setExplanations(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className='flex items-center gap-2'>
                <Button 
                  onClick={() => document.getElementById('leadership-file').click()}
                  disabled={loading}
                  className="cursor-pointer"
                >
                  <UploadCloud className="mr-2 h-4 w-4" /> 
                  Upload Supporting PDF(s)
                </Button>

                <Button 
                  onClick={handleRequestSuperDocument}
                  disabled={loading}
                  className="cursor-pointer"
                >
                  <UploadCloud className="mr-2 h-4 w-4" /> 
                  Request document(s)
                </Button>
              </div>
              <input
                id="leadership-file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              
              {existingPdf && (
                <Button 
                  variant="outline" 
                  onClick={downloadLeadershipPdf}
                  disabled={loading}
                  className="cursor-pointer"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Document(s)
                </Button>
              )}
            </div>
            
            {/* Selected files display */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected files:</p>
                <div className="max-h-[150px] overflow-y-auto border rounded p-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-1 border-b last:border-0">
                      <span className="truncate max-w-[200px]">{file.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {selectedFiles.length > 1 && (
                  <p className="text-xs text-muted-foreground">
                    Multiple files will be zipped together automatically.
                  </p>
                )}
              </div>
            )}

            {/* Existing document information */}
            {existingPdf && selectedFiles.length === 0 && (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {documentMetadata?.fileCount > 1 
                  ? `${documentMetadata.fileCount} leadership documents already uploaded`
                  : 'Leadership evidence document already uploaded'}
                {documentMetadata?.fileNames && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({documentMetadata.fileNames.join(', ')})
                  </span>
                )}
              </div>
            )}
          </div>
          
          {error && !showErrorDialog && (
            <div className="text-sm text-red-500">
              Error: {error}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSave} 
            disabled={loading || (!selectedFiles.length && !explanations)}
            className="cursor-pointer"
          >
            <Save className="mr-2 h-4 w-4" /> Save Leadership Evidence
          </Button>
        </CardFooter>
      </Card>

      {/* Loading Dialog */}
      <AlertDialog open={showLoadingDialog} onOpenChange={setShowLoadingDialog}>
        <AlertDialogContent>
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <AlertDialogTitle>Processing</AlertDialogTitle>
            <AlertDialogDescription>
              {actionMessage || 'Processing your leadership data...'}
            </AlertDialogDescription>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertDialogTitle>Leadership Evidence Saved</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Your leadership documentation has been saved successfully.
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
              <AlertDialogTitle>Error</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              {error || 'An error occurred while saving your leadership data. Please try again.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeadershipBase;