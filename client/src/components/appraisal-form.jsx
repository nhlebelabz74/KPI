import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/authContext';
import request from '@/utils/request';
import { toast } from 'sonner';
import { appraisal_sections as sections } from '@/constants';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CryptoJS, { AES } from "crypto-js";


const SECRET_KEY = import.meta.env.VITE_APP_ENCRYPTION_KEY;

// assuming supervisee email is encrypted
const SectionBase = ({ config, email, isSupervisor, appraisalPeriod }) => {
  const { isAuthenticated } = useAuth();
  const encryptedEmail = email ? AES.encrypt(email, import.meta.env.VITE_APP_ENCRYPTION_KEY).toString()
  : localStorage.getItem('encryptedEmail');
  const [textAnswers, setTextAnswers] = useState({});
  const [userRadioAnswers, setUserRadioAnswers] = useState({});
  const [supervisorRadioAnswers, setSupervisorRadioAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load saved answers
  useEffect(() => {
    const fetchSavedAnswers = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const response = await request({
          type: 'GET',
          route: '/users/appraisal/get-response/:email/:sectionId/:appraisalPeriod',
          routeParams: {
            email: encryptedEmail,
            sectionId: config.section,
            appraisalPeriod: appraisalPeriod
          }
        });

        const savedData = response.data?.answers || [];
        const newTextAnswers = {};
        const newUserRadioAnswers = {};
        const newSupervisorRadioAnswers = {};

        savedData.forEach(answer => {
          if (config?.withTextArea && config.withTextArea.some(ta => ta.id === answer.id)) {
            newTextAnswers[answer.id] = answer.answer;
          }

          if(config?.withRadioGroup && config.withRadioGroup.some(rg => answer.id.includes(rg.id))){
            if(answer.id.includes('rating-user')){
              newUserRadioAnswers[answer.id] = answer.answer;
            }
            else if(answer.id.includes('rating-supervisor')){
              newSupervisorRadioAnswers[answer.id] = answer.answer;
            }
          }
        });

        setTextAnswers(newTextAnswers);
        setUserRadioAnswers(newUserRadioAnswers);
        setSupervisorRadioAnswers(newSupervisorRadioAnswers);
      } catch (err) {
        console.error('Error loading saved answers:', err);
        setError('Failed to load saved data');
      } finally {
        setLoading(false);
        setIsMounted(true);
      }
    };

    fetchSavedAnswers();
  }, [isAuthenticated, config.section, appraisalPeriod]);

  const handleTextChange = (id, value) => {
    setTextAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleUserRadioChange = (id, value) => {
    setUserRadioAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSupervisorRadioChange = (id, value) => {
    setSupervisorRadioAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const answers = [
        ...(config.withTextArea || []).map(ta => ({
          id: ta.id,
          title: ta.title || '',
          answer: textAnswers[ta.id] || ''
        })),
        ...(config.withRadioGroup || []).flatMap(rg => [
          {
            id: `${rg.id}-user`,
            title: `${rg.title} (User)`,
            answer: userRadioAnswers[`${rg.id}-user`] || ''
          },
          {
            id: `${rg.id}-supervisor`,
            title: `${rg.title} (Supervisor)`,
            answer: supervisorRadioAnswers[`${rg.id}-supervisor`] || ''
          }
        ])
      ];

      await request({
        type: 'POST',
        route: '/users/appraisal/save',
        body: {
          email: encodeURIComponent(encryptedEmail),
          sectionId: config.section,
          answers: answers,
          appraisalPeriod: appraisalPeriod
        }
      });

      toast.success('Section saved successfully', {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
      });
    } catch (err) {
      console.error('Save failed:', err);
      setError(err.message || 'Failed to save section');
      toast.error('Failed to save section', {
        icon: <XCircle className="h-4 w-4 text-red-500" />
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <Card className="mb-6 w-full shadow-md">
      <CardHeader>
        <CardTitle>{config.section}</CardTitle>
        <CardDescription>{config.introParagraph}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Text Areas */}
        {config.withTextArea && config.withTextArea.map((ta) => (
          <div key={ta.id} className="mb-6">
            <Label htmlFor={ta.id}>{ta.title || ''}</Label>
            <Textarea
              id={ta.id}
              value={textAnswers[ta.id] || ''}
              onChange={(e) => handleTextChange(ta.id, e.target.value)}
              placeholder={ta.text_placeholder || ''}
              className="mt-2 min-h-[100px]"
              disabled={isSupervisor} // Only disable if the supervisor is viewing
            />
          </div>
        ))}

        {/* Radio Groups */}
        {config.withRadioGroup && config.withRadioGroup.map((rg) => (
          <div key={rg.id} className="mb-6 space-y-4">
            {/* User Rating */}
            <div>
              <Label className="block mb-2">{rg.title} (Self Assessment)</Label>
              <RadioGroup
                value={userRadioAnswers[`${rg.id}-user`] || ''}
                onValueChange={(value) => handleUserRadioChange(`${rg.id}-user`, value)}
                className="flex space-x-4"
                disabled={isSupervisor} // Disable if supervisor is viewing
              >
                {rg.options && rg.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-1">
                    <RadioGroupItem 
                      value={option.value} 
                      id={`${rg.id}-user-${option.value}`} 
                      className="cursor-pointer"
                    />
                    <Label htmlFor={`${rg.id}-user-${option.value}`} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {/* Supervisor Rating */}
            <div>
              <Label className="block mb-2">{rg.title} (Supervisor Assessment)</Label>
              <RadioGroup
                value={supervisorRadioAnswers[`${rg.id}-supervisor`] || ''}
                onValueChange={(value) => handleSupervisorRadioChange(`${rg.id}-supervisor`, value)}
                className="flex space-x-4"
                disabled={!isSupervisor} // Only enable if supervisor is viewing
              >
                {rg.options && rg.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-1">
                    <RadioGroupItem 
                      value={option.value} 
                      id={`${rg.id}-supervisor-${option.value}`} 
                      className="cursor-pointer"
                    />
                    <Label htmlFor={`${rg.id}-supervisor-${option.value}`} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleSubmit} disabled={loading} className="cursor-pointer">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Section'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const AppraisalForm = ({ supervisor }) => {
  const navigate = useNavigate();
  const isSupervisor = !!supervisor; // Check if supervisor is viewing
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [appraisalPeriod, setAppraisalPeriod] = useState('Mar 1, 2025 - Aug 31, 2025');
  const periods = ['Mar 1, 2025 - Aug 31, 2025', 'Sep 1, 2025 - Feb 28, 2026'];

  useEffect(() => {
    const checkIsEvaluated = async () => {
      const email = isSupervisor ? AES.encrypt(supervisor.superviseeEmail, import.meta.env.VITE_APP_ENCRYPTION_KEY).toString() : localStorage.getItem('encryptedEmail');
      const response = await request({
        type: 'GET',
        route: '/users/appraisal/status/:email/:appraisalPeriod',
        routeParams: {
          email: encodeURIComponent(email),
          appraisalPeriod: encodeURIComponent(appraisalPeriod)
        }
      });
      
      setIsEvaluated(response.data?.evaluated);
    }

    checkIsEvaluated();
  }, [appraisalPeriod]);

  const handleSwitchToggle = async (checked) => {
    try {
      await request({
        type: 'POST',
        route: '/users/appraisal/evaluate',
        body: {
          email: encodeURIComponent(AES.encrypt(supervisor.superviseeEmail, import.meta.env.VITE_APP_ENCRYPTION_KEY).toString()),
          appraisalPeriod: appraisalPeriod,
          evaluated: checked
        }
      });
      setIsEvaluated(checked);
      toast.success(`Proposal ${checked ? 'evaluated' : 'marked as not evaluated'}`, {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
      });
    }
    catch (error) {
      console.error('Error evaluating proposal:', error);
      toast.error('Failed to evaluate proposal', {
        icon: <XCircle className="h-4 w-4 text-red-500" />
      });
    }
  }
  const sendToPowerAutomate = async () => {
  const flowUrl = "https://default89055e55191e4127b426bad22809e6.4a.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/64e3a742aae841d59e647bdc3963ca13/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=YUnc8DRIcaPmlrL5pyrI27zrPCO50hjuHc-6JR7V_qw"; // set this in your .env
  if (!flowUrl) {
    toast.error("Power Automate URL is missing. Set VITE_POWER_AUTOMATE_URL in .env");
     return;
  }

  try {
    toast.loading("Collecting responses and sending to Power Automate...");

    // Build all requests concurrently
    const requests = sections.map((s) =>
      request({
        type: 'GET',
        route: '/users/appraisal/get-response/:email/:sectionId/:appraisalPeriod',
        routeParams: {
          email, // note: your code already sends encrypted + encodeURIComponent where needed
          sectionId: s.section,
          appraisalPeriod: appraisalPeriod,
        },
      }).then((res) => ({
        ok: true,
        sectionId: s.section,
        introParagraph: s.introParagraph || '',
        answers: res?.data?.answers || [],
        updatedAt: res?.data?.updatedAt || null,
      }))
      .catch((err) => ({
        ok: false,
        sectionId: s.section,
        error: err?.message || 'Failed to fetch section',
      }))
    );

    const settled = await Promise.allSettled(requests);

    // Normalize results
    const sectionsPayload = [];
    const failedSections = [];
    let lastUpdatedAt = null;

    for (const r of settled) {
      if (r.status === 'fulfilled') {
        const item = r.value;
        if (item.ok) {
          // Track last updated time
          if (item.updatedAt) {
            const t = new Date(item.updatedAt).getTime();
            if (!lastUpdatedAt || t > new Date(lastUpdatedAt).getTime()) {
              lastUpdatedAt = new Date(t).toISOString();
            }
          }
          sectionsPayload.push({
            sectionId: item.sectionId,
            introParagraph: item.introParagraph,
            answers: item.answers,
            updatedAt: item.updatedAt,
          });
        } else {
          failedSections.push({ sectionId: item.sectionId, error: item.error });
        }
      } else {
        // Promise rejected
        failedSections.push({ sectionId: 'unknown', error: r.reason?.message || 'Unknown error' });
      }
    }

    // Prepare final export payload
    console.log(AES.decrypt(email, SECRET_KEY).toString(CryptoJS.enc.Utf8));
    const exportPayload = {
      email: AES.decrypt(email, SECRET_KEY).toString(CryptoJS.enc.Utf8) || 'self', // send plaintext for Power Automate to consume
      emailEncrypted: email, // also include the encrypted email you’re using internally
      appraisalPeriod,
      submittedAt: new Date().toISOString(),
      sections: sectionsPayload,
      lastUpdatedAt,
      meta: {
        appVersion: import.meta.env.VITE_APP_VERSION || 'unknown',
        failedSections, // so you can see in the Flow which ones failed
        viewerRole: supervisor ? 'supervisor' : 'user',
      },
    };

    // Post to Power Automate Flow
    const resp = await fetch(flowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You can add auth if your Flow is a secured custom connector or behind APIM
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(exportPayload),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(`Flow responded with ${resp.status}: ${text || 'No details'}`);
    }

    toast.dismiss();
    if (failedSections.length) {
      toast.success(`Sent to Power Automate (with ${failedSections.length} section warning${failedSections.length > 1 ? 's' : ''}).`);
      console.warn('Sections that failed to fetch:', failedSections);
    } else {
      toast.success('Successfully sent to Power Automate!');
    }
  } catch (err) {
    console.error('sendToPowerAutomate error:', err);
    toast.dismiss();
    toast.error(err?.message || 'Failed to send to Power Automate');
  }
};

  return (
    <div className="min-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <Button 
          variant="outline"
          size="sm" 
          onClick={() => { navigate(-1) }} 
          className="mb-4 cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold mb-2">Performance Appraisal</h1>
          <p className="text-muted-foreground">
            {isSupervisor ? 
              `Viewing as supervisor for: ${supervisor.superviseeEmail}` : 
              'Self-Assessment Mode'}
          </p>
        </div>

        {/* Add switch */}
        <div className='flex flex-col gap-2'>
          <Label className="mb-2">{ isEvaluated ? 'Evaluated' : 'Not Evaluated'}</Label>
          <Switch
            checked={isEvaluated} 
            onCheckedChange={handleSwitchToggle} 
            disabled={!isSupervisor}
          />
        </div>
      </div>
      
      <Card className='mb-6 shadow-sm'>
        <CardHeader>
          <CardTitle>Appraisal Period</CardTitle>
          <CardDescription>
            {isSupervisor ? 'Select the appraisal period for the supervisee.' : 'Select your appraisal period.'}
          </CardDescription>
          <Select
            value={appraisalPeriod} 
            onValueChange={setAppraisalPeriod} 
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Appraisal Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {periods.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardHeader>
      </Card>

      {sections.map((sectionConfig) => (
        <SectionBase 
          key={sectionConfig.section} 
          config={sectionConfig} 
          email={isSupervisor ? supervisor.superviseeEmail : null}
          isSupervisor={isSupervisor}
          appraisalPeriod={appraisalPeriod}
        />
      ))}
       {/* ↓↓↓ ADD THIS RIGHT BELOW THE SECTIONS ↓↓↓ */}
      <div className="w-full flex justify-end mt-6">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={sendToPowerAutomate}
          className="cursor-pointer"
        >
          Send to Email
        </Button>
      </div>
    </div>
  );
};

export { AppraisalForm };
