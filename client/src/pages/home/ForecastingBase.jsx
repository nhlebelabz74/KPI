import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Save } from 'lucide-react';
import { AlertDialog, AlertDialogHeader, AlertDialogTrigger, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';

// Common component for all forecasting pages
const ForecastingBase = ({ role, requirements, supervisorTitle }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [existingPdf, setExistingPdf] = useState(false);

  // Check for existing PDF on component mount
  useEffect(() => {
    const checkExistingPdf = async () => {
      try {
        const exists = await window.electronAPI.checkPdfExists(`forecast-${role.toLowerCase().replace(/\s+/g, '-')}`);
        setExistingPdf(exists);
      } catch (error) {
        console.error('Error checking for existing PDF:', error);
      }
    };
    checkExistingPdf();
  }, [role]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedFile) {
        await window.electronAPI.saveForecastFile({
          file: selectedFile,
          role,
          confirmationEmail
        });
        setExistingPdf(true);
        setShowSuccessDialog(true);
      }
    } catch (error) {
      console.error('Error saving forecast data:', error);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle>{role} Forecasting Requirements</CardTitle>
          <CardDescription>
            Submit proof of completed forecasts and meeting attendance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Key Requirements:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Confirmation Email from {supervisorTitle}:
            </label>
            <textarea
              className="w-full p-2 border rounded min-h-[100px]"
              placeholder={`Paste the confirmation email from your ${supervisorTitle} acknowledging receipt of your forecast...`}
              value={confirmationEmail}
              onChange={(e) => setConfirmationEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => document.getElementById('forecast-file').click()}>
              <UploadCloud className="mr-2 h-4 w-4" /> 
              Upload Proof PDF
            </Button>
            <input
              id="forecast-file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFile && (
              <span className="text-sm text-gray-500">{selectedFile.name}</span>
            )}
          </div>

          {existingPdf && (
            <div className="text-sm text-green-600">
              Existing forecast proof PDF found
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={!selectedFile || !confirmationEmail}>
            <Save className="mr-2 h-4 w-4" /> Save Forecast Proof
          </Button>
        </CardFooter>
      </Card>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Forecast Proof Saved</AlertDialogTitle>
            <AlertDialogDescription>
              Your forecast documentation has been saved successfully.
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

export default ForecastingBase;