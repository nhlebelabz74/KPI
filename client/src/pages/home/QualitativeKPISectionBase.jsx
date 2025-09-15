import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UploadCloud, Save, PlusCircle, MinusCircle, Loader2, Download, CheckCircle2, XCircle } from 'lucide-react';
import { AlertDialog, AlertDialogHeader, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup as ShadcnRadioGroup, RadioGroupItem as ShadcnRadioGroupItem } from '@/components/ui/radio-group';

import { useAuth } from '@/context/authContext';
import request from '@/utils/request';
import JSZip from 'jszip';

const ProgressBar = ({ target, current, setCurrent, title, units, editable }) => {
  const [inputValue, setInputValue] = useState(current.toString());
  const progressValue = (current / target) * 100 >= 100 ? 100 : (current / target) * 100;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const newValue = parseInt(inputValue, 10);
    if (!isNaN(newValue)) {
      setCurrent(newValue);
    } else {
      setInputValue(current.toString());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  React.useEffect(() => {
    setInputValue(current.toString());
  }, [current]);

  return (
    <div className="flex flex-col gap-2">
      <Label>{title}</Label>
      <Progress value={progressValue} className="h-2 w-full" />
      <div className="flex flex-row items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCurrent(current - 1)} 
          className="rounded-full h-5 w-5"
        >
          <MinusCircle className="h-4 w-4" />
        </Button>
        
        {editable ? (
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className="w-16 h-8 text-center p-1"
              min="0"
            />
            <span>of {target} {units}</span>
          </div>
        ) : (
          <p>{current} of {target} {units}</p>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCurrent(current + 1)} 
          className="rounded-full h-5 w-5"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const CheckBox = ({ checked, setChecked, label, description, id }) => (
  <div className="flex items-center gap-2">
    <Checkbox
      id={id}
      className="h-6 w-6"
      checked={checked}
      onCheckedChange={setChecked}
    />
    <div className="grid gap-1.5 leading-none">
      <Label htmlFor={id} className="cursor-pointer">
        {label}
      </Label>
      {description && (
        <p className="text-sm text-muted-foreground">
          {description} 
        </p>
      )}
    </div>
  </div>
);

const RadioGroup = ({ value, onValueChange, options, title, id }) => (
  <div className="space-y-4">
    <Label>{title}</Label>
    <ShadcnRadioGroup 
      value={value}
      onValueChange={onValueChange}
      className="flex flex-col space-y-2"
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <ShadcnRadioGroupItem value={option.value} id={`${id}-${option.value}`} />
          <Label htmlFor={`${id}-${option.value}`}>{option.label}</Label>
        </div>
      ))}
    </ShadcnRadioGroup>
  </div>
);

const TextAreaField = ({ value, onChange, placeholder, title, minHeight }) => (
  <div className="space-y-4">
    {title && <Label>{title}</Label>}
    <Textarea 
      placeholder={placeholder || ''}
      className={`min-h-${minHeight || '16'} mb-4`}
      value={value}
      onChange={onChange}
    />
  </div>
);

const QualitativeKPISectionBase = ({ KPI_CONFIG, type }) => {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [textInputs, setTextInputs] = useState({});
  const [existingDocuments, setExistingDocuments] = useState({});
  const [documentMetadata, setDocumentMetadata] = useState({});
  const [progressValues, setProgressValues] = useState({});
  const [checkBoxValues, setCheckBoxValues] = useState({});
  const [radioValues, setRadioValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});

  const encryptedEmail = localStorage.getItem('encryptedEmail');
  const { isAuthenticated } = useAuth();

  // Initial state setup
  useEffect(() => {
    const initialValues = KPI_CONFIG.reduce((acc, kpi) => {
      if (kpi.withProgress) {
        kpi.withProgress.forEach(progress => {
          acc.progress[progress.id] = 0;
        });
      }
      if (kpi.withCheckBox) {
        kpi.withCheckBox.forEach(checkbox => {
          acc.checkbox[checkbox.id] = false;
        });
      }
      if (kpi.withRadioGroup) {
        kpi.withRadioGroup.forEach(radio => {
          acc.radio[radio.id] = radio.defaultValue || '';
        });
      }
      return acc;
    }, { progress: {}, checkbox: {}, radio: {} });

    setProgressValues(initialValues.progress);
    setCheckBoxValues(initialValues.checkbox);
    setRadioValues(initialValues.radio);
  }, [KPI_CONFIG]);

  // Load saved data
  useEffect(() => {
    const loadSavedData = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const savedData = await Promise.all(
          KPI_CONFIG.map(async kpi => {
            try {
              const response = await request({
                type: 'GET',
                route: '/users/get/response/:email/:kpiNumber',
                routeParams: {
                  email: encodeURIComponent(encryptedEmail),
                  kpiNumber: encodeURIComponent(kpi.number)
                }
              });

              return { kpi, responseData: response.data?.response };
            } catch (error) {
              console.error('Error fetching KPI response:', error);
              return { kpi, responseData: {} };
            }
          })
        );

        const newState = savedData.reduce((acc, { kpi, responseData }) => {
          const answer = typeof responseData.answer === 'object' ? responseData.answer : {};
          
          // Text inputs
          acc.textInputs[kpi.number] = answer.text_answer || responseData.text_answer || '';
          
          // Progress values
          kpi.withProgress?.forEach(progress => {
            acc.progressValues[progress.id] = Number(answer[progress.id] || 0);
          });
          
          // Checkbox values
          kpi.withCheckBox?.forEach(checkbox => {
            acc.checkBoxValues[checkbox.id] = !!answer[checkbox.id];
          });
          
          // Radio values
          kpi.withRadioGroup?.forEach(radio => {
            acc.radioValues[radio.id] = answer[radio.id] || radio.defaultValue || '';
          });
          
          // Additional text areas
          kpi.withTextAreas?.forEach(textArea => {
            acc.textInputs[textArea.id] = answer[textArea.id] || '';
          });

          // Document handling
          acc.docStatus[kpi.number] = !!responseData.documents;
          if (responseData.documents_metadata) {
            try {
              acc.docMetadata[kpi.number] = responseData.documents_metadata;
            } catch (e) {
              acc.docMetadata[kpi.number] = {};
            }
          }
          return acc;
        }, { 
          textInputs: {}, 
          progressValues: {}, 
          checkBoxValues: {}, 
          radioValues: {}, 
          docStatus: {}, 
          docMetadata: {} 
        });

        setTextInputs(newState.textInputs);
        setProgressValues(newState.progressValues);
        setCheckBoxValues(newState.checkBoxValues);
        setRadioValues(newState.radioValues);
        setExistingDocuments(newState.docStatus);
        setDocumentMetadata(newState.docMetadata);
      } catch (err) {
        console.error('Error loading saved data:', err);
        setError('Failed to load saved data');
      } finally {
        setLoading(false);
      }
    };
    
    loadSavedData();
  }, [isAuthenticated]);

  // Event handlers
  const handleRadioChange = (radioId, value) => {
    setRadioValues(prev => ({ ...prev, [radioId]: value }));
  };

  const handleFilesChange = (event, kpiNumber) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles(prev => ({
        ...prev,
        [kpiNumber]: files
      }));
    }
  };

  const handleTextChange = (event, kpiNumber) => {
    setTextInputs(prev => ({
      ...prev,
      [kpiNumber]: event.target.value
    }));
  };

  const handleAdditionalTextChange = (textAreaId, value) => {
    setTextInputs(prev => ({
      ...prev,
      [textAreaId]: value
    }));
  }

  const handleProgressChange = (progressId, value) => {
    setProgressValues(prev => ({
      ...prev,
      [progressId]: value
    }));
  };

  const handleCheckBoxChange = (checkboxId, value) => {
    setCheckBoxValues(prev => ({
      ...prev,
      [checkboxId]: value
    }));
  };

  const filesToBase64 = async (files, kpiNumber) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!files || files.length === 0) {
          resolve(null);
          return;
        }
        
        if (files.length === 1) {
          const file = files[0];
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            resolve({
              data: base64String,
              metadata: {
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                uploadDate: new Date().toISOString(),
                isZipped: false
              }
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
          return;
        }
        
        const zip = new JSZip();
        const metadata = {
          files: [],
          isZipped: true,
          zipName: `KPI_${kpiNumber}_documents.zip`,
          uploadDate: new Date().toISOString()
        };
        
        setUploadProgress(prev => ({
          ...prev,
          [kpiNumber]: 0
        }));
        
        const totalFiles = files.length;
        let processedFiles = 0;
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
          });
          
          zip.file(file.name, content);
          metadata.files.push({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size
          });
          
          processedFiles++;
          setUploadProgress(prev => ({
            ...prev,
            [kpiNumber]: Math.round((processedFiles / totalFiles) * 100)
          }));
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' }, metadata => {
          setUploadProgress(prev => ({
            ...prev,
            [kpiNumber]: 50 + Math.round(metadata.percent / 2)
          }));
        });
        
        const base64Zip = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            resolve({
              data: base64String,
              metadata: metadata
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(zipBlob);
        });
        
        resolve(base64Zip);
      } catch (err) {
        reject(err);
      } finally {
        setTimeout(() => {
          setUploadProgress(prev => {
            const newState = { ...prev };
            delete newState[kpiNumber];
            return newState;
          });
        }, 1000);
      }
    });
  };

  const downloadDocuments = async (kpiNumber) => {
    try {
      setLoading(true);
      setActionMessage(`Preparing documents for KPI ${kpiNumber}`);
      setShowLoadingDialog(true);
      
      const response = await request({
        type: 'GET',
        route: '/users/get/response/:email/:kpiNumber',
        routeParams: {
          email: encodeURIComponent(encryptedEmail),
          kpiNumber: kpiNumber
        }
      });
      
      const responseData = response.data?.response;
      
      if (!responseData?.documents) {
        throw new Error('No documents found');
      }
      
      let metadata = {};
      try {
        metadata = responseData.documents_metadata ? 
          responseData.documents_metadata : {};
      } catch (e) {
        console.error('Error parsing document metadata:', e);
      }
      
      if (metadata.isZipped) {
        const byteCharacters = atob(responseData.documents);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/zip' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = metadata.zipName || `KPI_${kpiNumber}_documents.zip`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 0);
      } else {
        const fileName = metadata.fileName || `KPI_${kpiNumber}_document.pdf`;
        const linkSource = `data:application/octet-stream;base64,${responseData.documents}`;
        const downloadLink = document.createElement('a');
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      }
      
      setShowLoadingDialog(false);
    } catch (err) {
      console.error('Error downloading documents:', err);
      setError(`Failed to download documents: ${err.message || 'Unknown error'}`);
      setShowLoadingDialog(false);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const saveKpiData = async (kpiNumber) => {
    try {
      setLoading(true);
      setError(null);
      setActionMessage(`Saving data for KPI ${kpiNumber}`);
      setShowLoadingDialog(true);
      
      const kpiConfig = KPI_CONFIG.find(kpi => kpi.number === kpiNumber);
      const text = textInputs[kpiNumber] || '';
      const files = selectedFiles[kpiNumber];
      
      let documentData = null;
      let documentMetadata = null;
      
      if (files && files.length > 0) {
        const { data, metadata } = await filesToBase64(files, kpiNumber);
        documentData = data;
        documentMetadata = metadata;
      }
      
      const answerObject = {
        text_answer: text
      };
      
      if (kpiConfig.withProgress) {
        kpiConfig.withProgress.forEach(progress => {
          answerObject[progress.id] = progressValues[progress.id] || 0;
        });
      }
      
      if (kpiConfig.withCheckBox) {
        kpiConfig.withCheckBox.forEach(checkbox => {
          answerObject[checkbox.id] = checkBoxValues[checkbox.id] || false;
        });
      }
      
      if (kpiConfig.withRadioGroup) {
        kpiConfig.withRadioGroup.forEach(radio => {
          answerObject[radio.id] = radioValues[radio.id] || '';
        });
      }
      
      if (kpiConfig.withTextAreas) {
        kpiConfig.withTextAreas.forEach(textArea => {
          answerObject[textArea.id] = textInputs[textArea.id] || '';
        });
      }
      
      const requestBody = {
        email: encodeURIComponent(encryptedEmail),
        kpiNumber: kpiNumber,
        type: type,
        question: kpiConfig.title,
        answer: answerObject
      };
      
      if (documentData) {
        requestBody.documents = documentData;
        requestBody.documents_metadata = documentMetadata;
      }

      console.log('Saving KPI data with body:', requestBody);
      
      await request({
        type: 'POST',
        route: '/users/update/response',
        body: requestBody
      });
      
      if (documentData) {
        setExistingDocuments(prev => ({
          ...prev,
          [kpiNumber]: true
        }));
        
        setDocumentMetadata(prev => ({
          ...prev,
          [kpiNumber]: documentMetadata
        }));
        
        setSelectedFiles(prev => {
          const newState = { ...prev };
          delete newState[kpiNumber];
          return newState;
        });
      }
      
      setShowLoadingDialog(false);
      setShowSuccessDialog(true);
    } catch (err) {
      console.error(`Save failed for KPI ${kpiNumber}:`, err);
      setError(`Failed to save data for KPI ${kpiNumber}: ${err.message || 'Unknown error'}`);
      setShowLoadingDialog(false);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const saveAllQualitativeData = async () => {
    try {
      setLoading(true);
      setError(null);
      setActionMessage("Saving all qualitative KPI data");
      setShowLoadingDialog(true);
      
      for (const kpi of KPI_CONFIG) {
        setActionMessage(`Saving KPI ${kpi.number}: ${kpi.title}`);
        await saveKpiData(kpi.number);
      }
      
      setShowLoadingDialog(false);
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error saving all qualitative data:', err);
      setError('Failed to save all qualitative data');
      setShowLoadingDialog(false);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const renderKpiCard = (kpi) => (
    <Card key={kpi.number}>
      <CardHeader>
        <CardTitle>{kpi.title}</CardTitle>
        <CardDescription>{kpi.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {kpi.withProgress && kpi.withProgress.length > 0 && (
          <div className="mb-6 space-y-4">
            {kpi.withProgress.map((progress) => (
              <ProgressBar
                key={progress.id}
                title={progress.title}
                target={progress.target}
                editable={progress?.editable ? true : false}
                current={progressValues[progress.id] || 0}
                units={progress.units}
                setCurrent={(value) => handleProgressChange(progress.id, value)}
              />
            ))}
          </div>
        )}
        
        {kpi.withCheckBox && kpi.withCheckBox.length > 0 && (
          <div className="mb-6 space-y-3">
            {kpi.withCheckBox.map((checkbox) => (
              <CheckBox
                key={checkbox.id}
                id={checkbox.id}
                label={checkbox.label}
                description={checkbox.description}
                checked={checkBoxValues[checkbox.id] || false}
                setChecked={(value) => handleCheckBoxChange(checkbox.id, value)}
              />
            ))}
          </div>
        )}

        {/* Radio Groups */}
        {kpi.withRadioGroup && kpi.withRadioGroup.length > 0 && (
          <div className="mb-6 space-y-3">
            {kpi.withRadioGroup.map(radio => (
              <RadioGroup key={radio.id} {...radio}
                value={radioValues[radio.id]}
                onValueChange={(val) => handleRadioChange(radio.id, val)}
              />
            ))}
          </div>
        )}

        {/* Additional Text Areas */}
        {kpi.withTextAreas && kpi.withTextAreas.length > 0 && (
          <div className="mb-6 space-y-3">
            {kpi.withTextAreas.map(textArea => (
              <TextAreaField key={textArea.id} {...textArea}
                value={textInputs[textArea.id] || ''}
                onChange={(e) => handleAdditionalTextChange(textArea.id, e.target.value)}
                placeholder={textArea.placeholder}
                minHeight={textArea.minHeight || '16'}
                title={textArea.title}
              />
            ))}
          </div>
        )}
        
        <Textarea 
          placeholder={`${kpi.text_placeholder}`}
          className="min-h-32 mb-4"
          onChange={(e) => handleTextChange(e, kpi.number)}
          value={textInputs[kpi.number] || ''}
        />
        
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => document.getElementById(`file-${kpi.number}`).click()}
              disabled={loading}
              className='cursor-pointer'
            >
              <UploadCloud className="mr-2 h-4 w-4" /> 
              {selectedFiles[kpi.number] ? 'Change Files' : 'Upload Evidence'}
            </Button>
            <input
              id={`file-${kpi.number}`}
              type="file"
              multiple
              onChange={(e) => handleFilesChange(e, kpi.number)}
              className="hidden"
            />
          </div>
          
          {existingDocuments[kpi.number] && (
            <Button 
              variant="outline" 
              onClick={() => downloadDocuments(kpi.number)}
              disabled={loading}
              className='cursor-pointer'
            >
              <Download className="mr-2 h-4 w-4" /> Download Evidence
            </Button>
          )}
          
          <Button 
            variant="secondary" 
            onClick={() => saveKpiData(kpi.number)}
            disabled={loading}
            className='cursor-pointer'
          >
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
        
        {/* File upload and other UI elements... */}
        {uploadProgress[kpi.number] !== undefined && (
          <div className="mt-2">
            <Progress value={uploadProgress[kpi.number]} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Uploading files... {uploadProgress[kpi.number]}%
            </p>
          </div>
        )}
        
        {/* File selection display and other UI elements... */}
        {selectedFiles[kpi.number] && (
          <div className="mt-2">
            <p className="text-sm font-medium">Selected files:</p>
            <ul className="text-sm text-gray-500 mt-1 space-y-1">
              {selectedFiles[kpi.number].map((file, index) => (
                <li key={index} className="flex items-center">
                  <span className="truncate max-w-xs">{file.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {existingDocuments[kpi.number] && !selectedFiles[kpi.number] && (
          <div className="mt-2">
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              <span>Existing evidence found:</span>
            </div>
            {documentMetadata[kpi.number]?.isZipped ? (
              <p className="text-sm text-muted-foreground ml-6 mt-1">
                {documentMetadata[kpi.number].files.length} files in archive
              </p>
            ) : (
              <p className="text-sm text-muted-foreground ml-6 mt-1">
                {documentMetadata[kpi.number]?.fileName || 'Document'}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {KPI_CONFIG.map(kpi => renderKpiCard(kpi))}
      
      <div className="mt-4">
        <Button 
          onClick={saveAllQualitativeData} 
          size="lg"
          disabled={loading}
          className='cursor-pointer'
        >
          <Save className="mr-2 h-4 w-4" /> Save All Qualitative Data
        </Button>
      </div>
      
      {/* Dialogs and alerts remain the same... */}
      {loading && (
        <div className="text-center mt-4">
          <Loader2 className="h-8 w-8 mx-auto animate-spin" />
          <p className="mt-2">Processing...</p>
        </div>
      )}
      
      <AlertDialog open={showLoadingDialog} onOpenChange={setShowLoadingDialog}>
        <AlertDialogContent>
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <AlertDialogTitle>Processing</AlertDialogTitle>
            <AlertDialogDescription>
              {actionMessage || 'Processing your request...'}
            </AlertDialogDescription>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertDialogTitle>Data Saved Successfully</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Your qualitative KPI data has been saved successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent className="border-red-500">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <AlertDialogTitle>Error</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              {error || 'An error occurred while saving your data. Please try again.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {error && !showErrorDialog && (
        <Alert variant="destructive" className="mt-4">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default QualitativeKPISectionBase;