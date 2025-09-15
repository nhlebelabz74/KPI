export const KPI_Types = {
  PROFITABILITY: "PROFITABILITY",
  LEADERSHIP: "LEADERSHIP",
  KNOWLEDGE_MANAGEMENT: "KNOWLEDGE MANAGEMENT",
  TEAMWORK: "TEAMWORK",
  FIRM_DEVELOPMENT: "FIRM DEVELOPMENT",
  TECHNICAL_SKILLS: "TECHNICAL SKILLS",
  BUSINESS_DEVELOPMENT: "BUSINESS DEVELOPMENT"
}

export const EMPLOYEE_ROLES = {
  CA: "Candidate Attorney",
  ASSOCIATE: "Associate",
  SENIOR_ASSOCIATE: "Senior Associate",
  EDP: "Equity Director",
  SDP: "Salaried Partner"
}

export const appraisal_sections = [
    {
      section: "Profitability",
      introParagraph: `Please provide: \n
                        (a) Total billable and non-billable hours recorded \n
                        (b) Total fees recorded \n
                        (c) Actual fees invoiced up to last month \n
                        (d) Percentage of fees written off \n
                        (e) Hours recorded vs hours billed \n
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
      introParagraph: `Discuss: \n
                        - Examples of involvement in various matters \n
                        - Complexity of handled cases \n
                        - Number of front-end/litigation matters assisted \n
                        - Level of involvement and contribution to outcomes \n
                        - Initiative and exercise of discretion/judgment \n
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

