import React from 'react';
import { KPI_Types as types } from '@/constants';
import QualitativeKPISectionBase from '../../QualitativeKPISectionBase';

const TechnicalSkills = () => {
  const KPI_CONFIG = [
    {
      number: "3.1.1",
      title: "Contract & Dispute Experience",
      description: "Experience working with contracts and disputes during the year.",
      text_placeholder: "Describe your experience working on contracts and disputes this year.",
      withProgress: [
        {
          id: "contractsWorked",
          title: "Contracts Worked On",
          target: 2,
          units: "contracts"
        },
        {
          id: "disputesWorked",
          title: "Disputes Worked On",
          target: 2,
          units: "disputes"
        }
      ]
    },
    {
      number: "3.1.2",
      title: "End-to-End Matter Management",
      description: "Experience seeing disputes/contracts through from start to finish.",
      text_placeholder: "Describe at least one dispute/contract you've seen through from start to finish.",
      withProgress: [
        {
          id: "completeMatters",
          title: "Matters Completed Start to Finish",
          target: 1,
          units: "matters"
        }
      ],
      withTextAreas: [
        {
          id: "matterDescription",
          title: "Matter Description",
          placeholder: "Provide details about the dispute/contract you managed from start to finish",
          minHeight: "16"
        }
      ]
    },
    {
      number: "3.1.3",
      title: "Article Writing",
      description: "Articles written per year with proper research.",
      text_placeholder: "Describe the articles you've written, including your research process and drafting approach.",
      withProgress: [
        {
          id: "articlesWritten",
          title: "Articles Written Per Year",
          target: 4,
          units: "articles"
        }
      ],
      withCheckBox: [
        {
          id: "researchDone",
          label: "Comprehensive Research",
          description: "Have read the case/legislation and done the first draft of the article"
        }
      ]
    },
    {
      number: "3.1.4",
      title: "Brief Drafting Skills",
      description: "Mastery of drafting briefs to counsel following established protocols.",
      text_placeholder: "Describe your experience drafting briefs to counsel and your familiarity with brief protocols.",
      withRadioGroup: [
        {
          id: "briefMastery",
          title: "Brief Drafting Proficiency",
          options: [
            { value: "learning", label: "Still Learning" },
            { value: "familiar", label: "Familiar with Protocol" },
            { value: "proficient", label: "Proficient" },
            { value: "mastered", label: "Mastered" }
          ],
          defaultValue: "familiar"
        }
      ]
    },
    {
      number: "3.1.5",
      title: "Research Capabilities",
      description: "Ability to produce on-point and usable research when requested.",
      text_placeholder: "Provide examples of research you've conducted that was on point and used by the team.",
      withCheckBox: [
        {
          id: "usableResearch",
          label: "Usable Research",
          description: "Produces research when requested which is on point and able to be used"
        },
        {
          id: "problemSolving",
          label: "Problem-Solving Research",
          description: "Undertakes research to solve problems and present effective solutions"
        }
      ],
      withTextAreas: [
        {
          id: "researchExamples",
          title: "Research Examples",
          placeholder: "Provide specific examples of research tasks you've completed",
          minHeight: "12"
        }
      ]
    },
    {
      number: "3.1.6",
      title: "Professional Credibility",
      description: "Establishing credibility through consistent high-quality work.",
      text_placeholder: "Describe how you've established personal credibility through high-quality work.",
      withRadioGroup: [
        {
          id: "workQuality",
          title: "Quality of Work",
          options: [
            { value: "developing", label: "Developing" },
            { value: "consistent", label: "Consistently Good" },
            { value: "highQuality", label: "High Quality" },
            { value: "exceptional", label: "Exceptional" }
          ],
          defaultValue: "consistent"
        }
      ],
      withTextAreas: [
        {
          id: "credibilityExamples",
          title: "Examples of Building Credibility",
          placeholder: "Describe how you've inspired confidence in clients and colleagues",
          minHeight: "12"
        }
      ]
    },
    {
      number: "3.1.7",
      title: "Initiative & Proactivity",
      description: "Going beyond the initial task by considering and proposing further steps.",
      text_placeholder: "Provide examples of when you've proposed further steps beyond the initial task.",
      withCheckBox: [
        {
          id: "goingBeyond",
          label: "Beyond Initial Task",
          description: "Considers and proposes further steps beyond the initial task"
        }
      ]
    },
    {
      number: "3.1.8",
      title: "Writing & Drafting Skills",
      description: "Demonstration of strong writing and drafting abilities.",
      text_placeholder: "Describe your writing and drafting skills, including any particular strengths or areas you're developing.",
      withRadioGroup: [
        {
          id: "writingSkills",
          title: "Writing Proficiency",
          options: [
            { value: "developing", label: "Developing" },
            { value: "adequate", label: "Adequate" },
            { value: "strong", label: "Strong" },
            { value: "exceptional", label: "Exceptional" }
          ],
          defaultValue: "strong"
        }
      ],
      withTextAreas: [
        {
          id: "writingExamples",
          title: "Writing Examples",
          placeholder: "Briefly describe examples of your strong writing and drafting",
          minHeight: "12"
        }
      ]
    },
    {
      number: "3.1.9",
      title: "File Management",
      description: "Management of accurate and organized files in compliance with protocols.",
      text_placeholder: "Describe your approach to managing files in compliance with firm protocols.",
      withCheckBox: [
        {
          id: "accurateFiles",
          label: "Accurate Files",
          description: "Manages accurate files"
        },
        {
          id: "organizedFiles",
          label: "Organized Files",
          description: "Manages organized files"
        },
        {
          id: "complianceAdherence",
          label: "Compliance Adherence",
          description: "Files adhere to compliance protocols"
        },
        {
          id: "riskProtocols",
          label: "Risk Protocols",
          description: "Files adhere to risk protocols"
        }
      ]
    },
    {
      number: "3.1.10",
      title: "Professional Development",
      description: "Building knowledge and skills from previous instructions and available resources.",
      text_placeholder: "Describe how you build on your knowledge and skills from previous instructions and training.",
      withCheckBox: [
        {
          id: "knowledgeBuilding",
          label: "Knowledge Building",
          description: "Builds on knowledge and skills from previous instructions"
        },
        {
          id: "resourceUtilization",
          label: "Resource Utilization",
          description: "Uses available resources to develop skills and knowledge"
        },
        {
          id: "trainingParticipation",
          label: "Training Participation",
          description: "Participates in training to develop skills and knowledge"
        }
      ]
    },
    {
      number: "3.1.11",
      title: "Departmental Understanding",
      description: "Understanding of role contribution to department structure.",
      text_placeholder: "Describe your understanding of how your role contributes to the department structure.",
      withCheckBox: [
        {
          id: "roleUnderstanding",
          label: "Role Understanding",
          description: "Understands how role contributes to the department structure"
        }
      ],
      withTextAreas: [
        {
          id: "departmentContribution",
          title: "Department Contribution",
          placeholder: "Explain specifically how your role contributes to the department's goals",
          minHeight: "12"
        }
      ]
    },
    {
      number: "3.1.12",
      title: "Business & Legal Awareness",
      description: "Awareness of business, current affairs, compliance, regulation, and legal sector.",
      text_placeholder: "Describe your awareness of business, current affairs, compliance, regulation, and the legal sector.",
      withCheckBox: [
        {
          id: "businessAwareness",
          label: "Business Awareness",
          description: "Has awareness of business"
        },
        {
          id: "currentAffairs",
          label: "Current Affairs",
          description: "Has awareness of current affairs"
        },
        {
          id: "complianceAwareness",
          label: "Compliance Awareness",
          description: "Has awareness of compliance"
        },
        {
          id: "regulationAwareness",
          label: "Regulation Awareness",
          description: "Has awareness of regulation"
        },
        {
          id: "legalSectorAwareness",
          label: "Legal Sector Awareness",
          description: "Has awareness of legal sector"
        }
      ]
    },
    {
      number: "3.1.13",
      title: "Knowledge Development",
      description: "Commitment to continually developing a breadth of knowledge and expertise.",
      text_placeholder: "Describe how you seek to continually develop your breadth of knowledge and expertise.",
      withCheckBox: [
        {
          id: "continuousDevelopment",
          label: "Continuous Development",
          description: "Seeks to continually develop a breadth of knowledge and expertise"
        },
        {
          id: "lawReports",
          label: "Law Report Reading",
          description: "Regularly reads significant law reports in full"
        },
        {
          id: "judicialReasoning",
          label: "Judicial Reasoning",
          description: "Acquires full understanding of judicial reasoning"
        }
      ],
      withProgress: [
        {
          id: "hoursLawReports",
          title: "Hours Spent Reading Law Reports Monthly",
          target: 8,
          units: "hours"
        }
      ]
    }
  ];

  return (
    <QualitativeKPISectionBase KPI_CONFIG={KPI_CONFIG} type={types.TECHNICAL_SKILLS} />
  )
}

export default TechnicalSkills;