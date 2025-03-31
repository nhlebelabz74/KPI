import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Save } from 'lucide-react';
import { AlertDialog, AlertDialogHeader, AlertDialogTrigger, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogContent } from '@/components/ui/alert-dialog';

const leadershipIntro = `
Leadership doesn't apply only to people in positions of power, it applies to all of us. Responsive leadership doesn't apply only to directors, department leaders or management. It doesn't have a title, an age group or even a partner. In responsive organizations, people who take action are actively participating in the firm and communities. It means having responsibility for the good of the firm, your communities and your future people.
`;

// Common component for all leadership pages
const LeadershipBase = ({ role, criteria }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [explanations, setExplanations] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [existingPdf, setExistingPdf] = useState(false);

  useEffect(() => {
    const checkExistingPdf = async () => {
      try {
        const exists = await window.electronAPI.checkPdfExists(`leadership-${role.toLowerCase().replace(/\s+/g, '-')}`);
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
      if (selectedFile && explanations) {
        await window.electronAPI.saveLeadershipFile({
          file: selectedFile,
          role,
          explanations
        });
        setExistingPdf(true);
        setShowSuccessDialog(true);
      }
    } catch (error) {
      console.error('Error saving leadership data:', error);
    }
  };

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
            />
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => document.getElementById('leadership-file').click()}>
              <UploadCloud className="mr-2 h-4 w-4" /> 
              Upload Supporting PDF
            </Button>
            <input
              id="leadership-file"
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
              Existing leadership evidence PDF found
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={!selectedFile || !explanations}>
            <Save className="mr-2 h-4 w-4" /> Save Leadership Evidence
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leadership Evidence Saved</AlertDialogTitle>
            <AlertDialogDescription>
              Your leadership documentation has been saved successfully.
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

export default LeadershipBase;