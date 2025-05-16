import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/context/authContext';
import request from '@/utils/request';
import { toast } from 'sonner';
import { KPI_Types as types } from '@/constants';

const SectionBase = ({ config }) => {
  const { isAuthenticated } = useAuth();
  const encryptedEmail = localStorage.getItem('encryptedEmail');
  const [textAnswers, setTextAnswers] = useState({});
  const [radioAnswers, setRadioAnswers] = useState({});
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
          route: '/appraisal/get-response',
          params: {
            email: encodeURIComponent(encryptedEmail),
            sectionId: config.section
          }
        });

        const savedData = response.data?.answers || [];
        const newTextAnswers = {};
        const newRadioAnswers = {};

        savedData.forEach(answer => {
          if (config.withTextArea && config.withTextArea.some(ta => ta.id === answer.id)) {
            newTextAnswers[answer.id] = answer.answer;
          }
          if (config.withRadioGroup && config.withRadioGroup.some(rg => rg.id === answer.id)) {
            newRadioAnswers[answer.id] = answer.answer;
          }
        });

        setTextAnswers(newTextAnswers);
        setRadioAnswers(newRadioAnswers);
      } catch (err) {
        console.error('Error loading saved answers:', err);
        setError('Failed to load saved data');
      } finally {
        setLoading(false);
        setIsMounted(true);
      }
    };

    fetchSavedAnswers();
  }, [isAuthenticated, config.section]);

  const handleTextChange = (id, value) => {
    setTextAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleRadioChange = (id, value) => {
    setRadioAnswers(prev => ({ ...prev, [id]: value }));
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
        ...(config.withRadioGroup || []).map(rg => ({
          id: rg.id,
          title: rg.title || '',
          answer: radioAnswers[rg.id] || ''
        }))
      ];

      await request({
        type: 'POST',
        route: '/appraisal/save-response',
        body: {
          email: encodeURIComponent(encryptedEmail),
          sectionId: config.section,
          answers: answers
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
            />
          </div>
        ))}

        {/* Radio Groups */}
        {config.withRadioGroup && config.withRadioGroup.map((rg) => (
          <div key={rg.id} className="mb-6">
            <Label>{rg.title || ''}</Label>
            <RadioGroup
              value={radioAnswers[rg.id] || ''}
              onValueChange={(value) => handleRadioChange(rg.id, value)}
              className="mt-2"
            >
              {rg.options && rg.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.value} 
                    id={`${rg.id}-${option.value}`} 
                  />
                  <Label htmlFor={`${rg.id}-${option.value}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </CardContent>

      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleSubmit} disabled={loading}>
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
  // Example configuration - should be passed as props or imported
  const sections = [
    {
      section: "Introduction",
      introParagraph: `Please provide:
  (a) Total billable and non-billable hours recorded
  (b) Total fees recorded
  (c) Actual fees invoiced up to last month
  (d) Percentage of fees written off
  (e) Hours recorded vs hours billed
  (f) Compliance with annual budget`,
      withTextArea: [
        {
          id: "introduction-details",
          text_placeholder: "Provide detailed information covering all requested metrics and comments..."
        }
      ]
    },
    {
      section: "Technical Skills",
      introParagraph: `Discuss:
  - Examples of involvement in various matters
  - Complexity of handled cases
  - Number of front-end/litigation matters assisted
  - Level of involvement and contribution to outcomes
  - Initiative and exercise of discretion/judgment
  - Compliance with technical skill targets`,
      withTextArea: [
        {
          id: "technical-skills-examples",
          text_placeholder: "Describe your technical skills and provide specific examples..."
        }
      ],
      withRadioGroup: [
        {
          id: "technical-skills-rating",
          title: "Technical Skills Rating",
          options: [
            { value: "1", label: "1 - Far below KPIs" },
            { value: "2", label: "2 - Below KPIs" },
            { value: "3", label: "3 - Meets KPIs" },
            { value: "4", label: "4 - Exceeds KPIs" },
            { value: "5", label: "5 - Far Exceeds KPIs" }
          ]
        }
      ]
    },
    {
      section: "Goodwill",
      introParagraph: `Discuss and provide specific examples of:
  - New client introductions
  - Expanding existing client relationships
  - Referrals from other professionals
  - Compliance with goodwill targets`,
      withTextArea: [
        {
          id: "goodwill-examples",
          text_placeholder: "Describe your goodwill contributions..."
        }
      ],
      withRadioGroup: [
        {
          id: "goodwill-rating",
          title: "Goodwill Rating",
          options: [
            { value: "1", label: "1 - Far below KPIs" },
            { value: "2", label: "2 - Below KPIs" },
            { value: "3", label: "3 - Meets KPIs" },
            { value: "4", label: "4 - Exceeds KPIs" },
            { value: "5", label: "5 - Far Exceeds KPIs" }
          ]
        }
      ]
    },
    {
      section: "Responsive Leadership",
      introParagraph: `1. Provide examples of:
  - Taking ownership in billable matters
  - Contributing to firm development
  - Demonstrating firm values
  - Showing initiative beyond obstacles
  
  2. Discuss mentoring activities:
  - Candidate attorney development
  - Peer practitioner support`,
      withTextArea: [
        {
          id: "leadership-examples",
          text_placeholder: "Describe your leadership initiatives..."
        },
        {
          id: "mentoring-examples",
          text_placeholder: "Detail your mentoring activities..."
        }
      ],
      withRadioGroup: [
        {
          id: "leadership-rating",
          title: "Leadership Rating",
          options: [
            { value: "1", label: "1 - Far below KPIs" },
            { value: "2", label: "2 - Below KPIs" },
            { value: "3", label: "3 - Meets KPIs" },
            { value: "4", label: "4 - Exceeds KPIs" },
            { value: "5", label: "5 - Far Exceeds KPIs" }
          ]
        }
      ]
    },
    {
      section: "Building and Maintaining the Firm",
      introParagraph: `1. Practice group initiatives:
  - Suggestions and participation
  - Departmental projects
  
  2. External promotion:
  - Articles authored
  - Presentations given
  - External engagements`,
      withTextArea: [
        {
          id: "initiatives-examples",
          text_placeholder: "Describe your internal initiatives..."
        },
        {
          id: "promotion-examples",
          text_placeholder: "List external promotion activities..."
        }
      ],
      withRadioGroup: [
        {
          id: "firm-building-rating",
          title: "Firm Building Rating",
          options: [
            { value: "1", label: "1 - Far below KPIs" },
            { value: "2", label: "2 - Below KPIs" },
            { value: "3", label: "3 - Meets KPIs" },
            { value: "4", label: "4 - Exceeds KPIs" },
            { value: "5", label: "5 - Far Exceeds KPIs" }
          ]
        }
      ]
    },
    {
      section: "Knowledge Management",
      introParagraph: `Discuss:
  - Knowledge database maintenance
  - Expertise development
  - Compliance with knowledge targets
  - Specific examples of knowledge sharing`,
      withTextArea: [
        {
          id: "knowledge-management",
          text_placeholder: "Describe your knowledge management activities..."
        }
      ],
      withRadioGroup: [
        {
          id: "knowledge-rating",
          title: "Knowledge Management Rating",
          options: [
            { value: "1", label: "1 - Far below KPIs" },
            { value: "2", label: "2 - Below KPIs" },
            { value: "3", label: "3 - Meets KPIs" },
            { value: "4", label: "4 - Exceeds KPIs" },
            { value: "5", label: "5 - Far Exceeds KPIs" }
          ]
        }
      ]
    },
    {
      section: "Business Development",
      introParagraph: `Discuss:
  - Business development approaches
  - Sector-specific initiatives
  - Compliance with development plan
  - Attach latest business development plan draft (include dates)`,
      withTextArea: [
        {
          id: "business-development",
          text_placeholder: "Describe business development efforts..."
        }
      ],
      withRadioGroup: [
        {
          id: "business-rating",
          title: "Business Development Rating",
          options: [
            { value: "1", label: "1 - Far below KPIs" },
            { value: "2", label: "2 - Below KPIs" },
            { value: "3", label: "3 - Meets KPIs" },
            { value: "4", label: "4 - Exceeds KPIs" },
            { value: "5", label: "5 - Far Exceeds KPIs" }
          ]
        }
      ]
    },
    {
      section: "Self-Assessment",
      introParagraph: "Honest self-evaluation for professional development:",
      withTextArea: [
        {
          id: "strengths",
          title: "1. Key Strengths",
          text_placeholder: "Identify strengths with examples..."
        },
        {
          id: "development-needs",
          title: "2. Development Needs",
          text_placeholder: "Identify key areas for improvement..."
        }
      ]
    },
    {
      section: "Career Plans/Aspirations",
      introParagraph: "Outline your career objectives:",
      withTextArea: [
        {
          id: "short-term",
          title: "Short Term (3-6 months)",
          text_placeholder: "Include promotion motivations if applicable..."
        },
        {
          id: "medium-term",
          title: "Medium Term (6-24 months)",
          text_placeholder: "Describe mid-term goals..."
        },
        {
          id: "long-term",
          title: "Long Term (24+ months)",
          text_placeholder: "Outline long-term aspirations..."
        }
      ]
    }
  ];

  return (
    <div className="min-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Performance Appraisal</h1>
        <p className="text-muted-foreground">
          Supervisor: {supervisor || 'Not Assigned'}
        </p>
      </div>

      {sections.map((sectionConfig) => (
        <SectionBase 
          key={sectionConfig.section} 
          config={sectionConfig} 
        />
      ))}
    </div>
  );
};

export { AppraisalForm };