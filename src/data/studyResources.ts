export interface StudyTopic {
  title: string;
  summary: string;
  keyPoints: string[];
  practicalTip?: string;
}

export interface RoleStudyGuide {
  id: string;
  roleTitle: string;
  overview: string;
  keyResponsibilities: string[];
  coreTopics: StudyTopic[];
  examTips: string[];
}

export interface OrganizationInfo {
  name: string;
  acronym: string;
  fullName: string;
  mission: string;
  bridgeNAcronym: string;
  bridgeNMeaning: string;
  corePillars: { title: string; description: string }[];
  examFormatInfo: {
    duration: string;
    questionCount: string;
    style: string;
    recommendedStrategy: string[];
  };
}

export const organizationInfo: OrganizationInfo = {
  name: "CCCRN",
  acronym: "CCCRN",
  fullName: "Center for Clinical Care and Clinical Research",
  mission: "To promote best practices in healthcare delivery, public health interventions, and clinical research using locally adapted health systems strengthening approaches in Nigeria.",
  bridgeNAcronym: "BRIDGE-N",
  bridgeNMeaning: "Building Resilient Integrated Delivery of HIV, TB, Malaria and MNCH Services for Government-led Effective Health System in Nigeria",
  corePillars: [
    {
      title: "HIV/AIDS Care & Treatment",
      description: "Comprehensive HIV prevention, voluntary testing and counseling (HTS), antiretroviral therapy (ART) initiation, viral load monitoring, and viral suppression to achieve epidemic control."
    },
    {
      title: "Tuberculosis (TB) Program",
      description: "Active TB case finding, screening in clinics, sputum specimen transport, GeneXpert molecular testing, and Directly Observed Therapy (DOTS) adherence support."
    },
    {
      title: "Malaria Control",
      description: "Prompt parasite-based diagnosis using Malaria Rapid Diagnostic Tests (mRDTs) prior to artemisinin-based combination therapy (ACT), and distribution of long-lasting insecticidal nets (LLINs)."
    },
    {
      title: "Maternal, Newborn & Child Health (MNCH)",
      description: "Integrated antenatal care (ANC), facility-based skilled delivery, prevention of mother-to-child transmission (PMTCT), postnatal care (PNC), and routine childhood immunization."
    }
  ],
  examFormatInfo: {
    duration: "30 Minutes strictly timed from login",
    questionCount: "30 Questions (approximately 1 minute per question)",
    style: "Computer-Based Objective Assessment with four answer choices (A, B, C, D) featuring practical scenarios, standard operating procedures, and professional ethics.",
    recommendedStrategy: [
      "Pacing: Dedicate roughly 50 to 60 seconds per question. Do not spend 3 minutes on any single question.",
      "First Pass (Minutes 1–15): Rapidly answer straightforward definition and factual questions you know with confidence.",
      "Second Pass (Minutes 16–25): Read scenario questions carefully. Identify the worker's role, the standard operating procedure (SOP), and the single most ethical and professional response.",
      "Final Review (Minutes 26–30): Use the Question Navigator Palette to find any unanswered questions. Ensure zero questions are left blank (there is no negative marking).",
      "Stay Calm & Focused: Read all four choices (A, B, C, D) before selecting. The most client-centered and safe response is usually the intended answer."
    ]
  }
};

export const roleStudyGuides: RoleStudyGuide[] = [
  {
    id: "data_assistant",
    roleTitle: "Integrated Data Assistant",
    overview: "The Integrated Data Assistant manages primary paper registers, electronic medical records (EMR / E-Deck), data validation, record reconciliation, and routine health facility reporting.",
    keyResponsibilities: [
      "Accurate and complete data capture from clinical source documents into electronic databases.",
      "Routine paper-to-electronic reconciliation to ensure registers and E-Deck match perfectly.",
      "Identifying and deduplicating client records using Unique Client Identifiers (UIC).",
      "Spreadsheet analysis, routine weekly and monthly indicator report compilation.",
      "Ensuring health information confidentiality, role-based password security, and automated backups."
    ],
    coreTopics: [
      {
        title: "1. The 5 Dimensions of Data Quality",
        summary: "Understanding Accuracy, Completeness, Consistency, Timeliness, and Validity.",
        keyPoints: [
          "Accuracy: Data recorded must faithfully represent the authorized clinical source document.",
          "Completeness: All mandatory fields (client ID, date, test result, regimen) must be filled without omissions.",
          "Consistency: Values recorded across different registers (e.g. ART register vs Pharmacy register) must agree.",
          "Timeliness: Records and monthly facility summaries must be finalized before established project reporting deadlines.",
          "Validity: Data entered must conform to national standard indicator definitions and allowable ranges."
        ],
        practicalTip: "Never guess missing figures. When numbers do not balance, check the physical paper source document first."
      },
      {
        title: "2. Record Reconciliation & Audit Trails",
        summary: "Matching physical patient tools against electronic systems.",
        keyPoints: [
          "Reconciliation involves cross-checking daily attendance registers, clinical encounter forms, and pharmacy pickup logs against electronic E-Deck entries.",
          "Any discrepancy identified must be verified against source documentation before making a correction.",
          "All corrections in registers and databases must maintain an audit trail showing who made the change, date, and reason.",
          "Never erase or use correction fluid (white-out) on official clinical registers; draw a neat line across the error, write the correct value, and initial it."
        ]
      },
      {
        title: "3. Spreadsheets & Reporting Fundamentals",
        summary: "Essential spreadsheet skills for facility reporting.",
        keyPoints: [
          "Basic formulas: SUM (totals), AVERAGE (means), and COUNTIF (counting specific client categories).",
          "Filtering: Quickly isolate blank entries, errors, or specific cohorts (e.g., missed appointments) without altering underlying data.",
          "Data sorting: Organize records chronologically or by ID for rapid lookup.",
          "Data security: Password-protect sensitive reporting workbooks and store backups on encrypted storage."
        ]
      },
      {
        title: "4. Confidentiality & Physical/Cyber Security",
        summary: "Protecting patient privacy and preventing unauthorized data access.",
        keyPoints: [
          "Health data confidentiality: Client identifiable information must never be shared on personal phones or social media.",
          "Access control: Log out or lock computers whenever leaving the workstation.",
          "Password security: Never share your EMR or E-Deck login credentials with colleagues.",
          "Regular data backup: Perform daily/weekly local database backups to prevent catastrophic data loss."
        ]
      }
    ],
    examTips: [
      "In scenario questions, the first step when discovering a discrepancy is always to verify against the primary source document.",
      "Remember that client confidentiality applies to electronic spreadsheets as strictly as paper folders."
    ]
  },
  {
    id: "lab_optimizer",
    roleTitle: "Integrated Laboratory Service Optimizer",
    overview: "Provides technical support, quality management, specimen transportation coordination, biosafety compliance, and equipment maintenance across health facility laboratories.",
    keyResponsibilities: [
      "Implement laboratory Quality Assurance (QA), Internal Quality Control (IQC), and External Quality Assessment (EQA).",
      "Oversee proper specimen collection, labelling, packaging, and cold-chain referral.",
      "Maintain biosafety standards, personal protective equipment (PPE) compliance, and chemical spill protocols.",
      "Ensure timely turnaround times (TAT) and prompt verbal/written escalation of critical panic results.",
      "Perform routine laboratory equipment preventive maintenance and calibration."
    ],
    coreTopics: [
      {
        title: "1. Three Phases of Laboratory Testing",
        summary: "Pre-analytical, Analytical, and Post-analytical quality assurance.",
        keyPoints: [
          "Pre-analytical (over 70% of errors): Patient identification, specimen collection, correct tube selection, immediate labelling, packaging, and transport temperature.",
          "Analytical: Test execution following approved SOPs, daily IQC verification, reagent expiry checks, and calibration.",
          "Post-analytical: Result verification, recording, turnaround time tracking, return to clinician, and critical value reporting."
        ]
      },
      {
        title: "2. Quality Control: IQC vs EQA",
        summary: "Maintaining analytical accuracy and precision.",
        keyPoints: [
          "Internal Quality Control (IQC): Conducted daily by facility staff before testing client samples to verify kit/analyzer performance.",
          "External Quality Assessment (EQA / PT): Periodic blind panels received from external reference laboratories to evaluate accuracy compared to peer labs.",
          "If IQC fails (out-of-range), do not release patient results. Investigate root causes (reagent, temperature, machine, operator) and re-run."
        ]
      },
      {
        title: "3. Biosafety & Infection Prevention",
        summary: "Protecting healthcare staff, clients, and the community from biohazards.",
        keyPoints: [
          "Universal Precautions: Treat all blood and body fluids as potentially infectious.",
          "PPE sequence: Donning (gown, mask, goggles, gloves); Doffing (gloves first, then gown, eye protection, mask last).",
          "Sharps safety: Dispose of lancets and needles immediately without recapping into puncture-resistant boxes filled to no more than 3/4 capacity.",
          "Spill management: Cover biohazard spill with paper towels, saturate with 0.5% (5,000 ppm) sodium hypochlorite (bleach), allow 15–20 minutes contact time, then clean."
        ]
      },
      {
        title: "4. Turnaround Time & Critical Results",
        summary: "Speed of diagnostic delivery and emergency escalation.",
        keyPoints: [
          "Turnaround Time (TAT): The total elapsed time from specimen collection/receipt to result delivery to the ordering health worker.",
          "Critical / Panic Value: An unexpected test result that indicates an immediate life-threatening risk (e.g. extremely low hemoglobin, critically high potassium).",
          "Protocol: Verbally communicate critical values immediately to the attending healthcare provider and document the date, time, and read-back confirmation."
        ]
      }
    ],
    examTips: [
      "In laboratory safety questions, never recap needles manually.",
      "Always verify test controls before analyzing patient specimens."
    ]
  },
  {
    id: "testing_assistant",
    roleTitle: "Integrated Testing Assistant",
    overview: "Performs authorized point-of-care rapid testing (HIV and Malaria RDTs), ensures client counseling and consent, maintains infection control, and facilitates immediate linkage to care.",
    keyResponsibilities: [
      "Conduct voluntary, confidential rapid diagnostic testing within approved scope of practice.",
      "Obtain informed consent and verify patient identification before specimen collection.",
      "Perform daily test kit inventory checks, monitoring expiry dates and storage temperatures.",
      "Segregate and safely dispose of clinical healthcare waste.",
      "Provide immediate, same-day linkage of reactive/positive clients to clinical treatment."
    ],
    coreTopics: [
      {
        title: "1. Scope of Practice & Informed Consent",
        summary: "Ethical boundaries and client voluntary participation.",
        keyPoints: [
          "Scope of practice: Perform only tests approved by facility SOPs; refer clients with medical complications to senior clinicians.",
          "Informed consent: Clients must understand the test purpose, procedure, potential outcomes, and voluntary nature before blood is drawn.",
          "Client privacy: Conduct testing and results disclosure in an auditory and visual private space."
        ]
      },
      {
        title: "2. Rapid Diagnostic Test (RDT) Protocols",
        summary: "Standard operating procedures for HIV and Malaria testing.",
        keyPoints: [
          "Storage: Keep rapid test kits in cool, dry conditions (typically 2°C–30°C) away from direct sunlight; never freeze test cassettes.",
          "Validity: Read results strictly within the manufacturer's specified reading window (e.g. 15 to 20 minutes). Never interpret after the maximum window.",
          "Control Line: A visible control line ('C') is required for a valid test. If the control line fails to appear, the test is INVALID regardless of test lines."
        ]
      },
      {
        title: "3. Handling Reactive HIV Results & Linkage",
        summary: "Confirmation algorithms and continuous care linkage.",
        keyPoints: [
          "National HIV Algorithm: An initial reactive screening result must be confirmed with a second, distinct rapid test kit (Confirmatory test).",
          "If the confirmatory test is non-reactive (discordant), a tie-breaker test is performed according to national guidelines.",
          "Immediate linkage: When a client is confirmed positive, escort them respectfully to the ART clinic for post-test counseling and baseline assessment."
        ]
      },
      {
        title: "4. Healthcare Waste Segregation",
        summary: "Safe color-coded disposal of biomedical waste.",
        keyPoints: [
          "Black bin/bag: General non-infectious waste (office paper, dry wrappers, clean packaging).",
          "Yellow bin/bag: Infectious clinical waste (blood-stained swabs, gloves, used test cassettes).",
          "Sharps container: Rigid puncture-proof box for lancets, needles, and capillary tubes. Seal when 3/4 full.",
          "Accidental needle stick: Wash immediately with soap and water (do not squeeze), report to supervisor, and seek Post-Exposure Prophylaxis (PEP) within 72 hours."
        ]
      }
    ],
    examTips: [
      "An RDT without a visible control line is ALWAYS invalid — repeat using a new device from a fresh lot.",
      "Infection control and PEP must be initiated within 72 hours of an occupational exposure."
    ]
  },
  {
    id: "health_qi_optimizer",
    roleTitle: "Integrated Health / Quality Improvement Service Optimizer",
    overview: "Champions continuous quality improvement (CQI) across integrated HIV, TB, malaria, and MNCH services, leading PDSA cycles, root-cause analyses, and workflow improvements.",
    keyResponsibilities: [
      "Support facility Quality Improvement (QI) teams to identify service bottlenecks.",
      "Develop SMART Aim Statements and lead Plan-Do-Study-Act (PDSA) improvement cycles.",
      "Track clinical quality indicators using run charts and monthly dashboards.",
      "Conduct root-cause analysis using 5 Whys and Fishbone diagrams.",
      "Mentor frontline healthcare staff and facilitate the spread of successful changes."
    ],
    coreTopics: [
      {
        title: "1. The Model for Improvement & PDSA",
        summary: "The global framework for testing and implementing change.",
        keyPoints: [
          "The 3 Questions: 1) What are we trying to accomplish? 2) How will we know that a change is an improvement? 3) What changes can we make that will result in improvement?",
          "Plan: Formulate hypothesis, define aim, identify change idea, and design test of change.",
          "Do: Execute the test on a small, manageable scale (e.g. 5 patients or 1 clinic day).",
          "Study: Compare collected data against baseline measurements and document lessons learned.",
          "Act: Decide whether to Adopt (expand facility-wide), Adapt (modify idea), or Abandon."
        ]
      },
      {
        title: "2. SMART Aim Statements",
        summary: "Setting clear, measurable targets for quality improvement.",
        keyPoints: [
          "Specific: Clear description of the service and target population.",
          "Measurable: Includes a numerical baseline and targeted improvement percentage.",
          "Achievable: Feasible within facility resource constraints.",
          "Relevant: Addresses a high-priority clinical or client-retention need.",
          "Time-bound: Has an explicit completion target date (e.g., 'Increase 6-month ART retention from 72% to 90% by December 2026')."
        ]
      },
      {
        title: "3. Quality Measurement: Process, Outcome & Balancing",
        summary: "Understanding the three types of QI indicators.",
        keyPoints: [
          "Process Measure: Are we carrying out the clinical steps correctly? (e.g. Percentage of clients screened for TB at each visit).",
          "Outcome Measure: Are patients getting healthier? (e.g. Percentage of clients on ART with viral suppression <1000 copies/mL).",
          "Balancing Measure: Did our change cause an unintended consequence elsewhere? (e.g. Did reducing wait times shorten clinician consultation quality?)."
        ]
      },
      {
        title: "4. Root-Cause Analysis Tools",
        summary: "Fishbone diagrams and the 5 Whys technique.",
        keyPoints: [
          "Fishbone (Ishikawa) Diagram: Categorizes causes of an issue into People, Process, Policy, Equipment, and Environment.",
          "5 Whys: Repeatedly asking 'Why?' to dig beneath surface symptoms until the fundamental operational breakdown is reached.",
          "Run Charts: Graphing indicator data over chronological time to detect true performance shifts versus random variation."
        ]
      }
    ],
    examTips: [
      "In CQI questions, always test changes on a SMALL scale first before rolling out facility-wide.",
      "An improvement aim statement must always have a specific target number and a deadline date."
    ]
  },
  {
    id: "client_navigator",
    roleTitle: "Client Navigator",
    overview: "Serves as the vital bridge between community clients and healthcare facilities, supporting appointment tracking, treatment retention, closed-loop referrals, and adherence across HIV, TB, Malaria, and MNCH services.",
    keyResponsibilities: [
      "Facilitate client navigation, seamless healthcare linkage, and retention in care.",
      "Maintain appointment tracking logs and execute prompt follow-up on missed appointments.",
      "Coordinate and document closed-loop referrals to guarantee verified service delivery.",
      "Provide treatment adherence counseling for clients on ART, TB DOTS, and maternal health.",
      "Uphold client confidentiality, obtain informed consent, and counter stigma and discrimination."
    ],
    coreTopics: [
      {
        title: "1. Client Navigation vs Peer Navigation",
        summary: "Key distinction highlighted in CCCRN recruitment materials.",
        keyPoints: [
          "Client Navigator: Focuses on broad system coordination, cross-departmental service linkages across HIV, TB, malaria, and MNCH, appointment log reconciliation, and tracking closed-loop referrals.",
          "Peer Navigator: Often has lived experience in a specific health category (e.g., a mother living with HIV supporting other pregnant mothers) providing empathetic peer-level encouragement.",
          "Both collaborate, but Client Navigators manage the systematic patient journey across all clinical departments."
        ]
      },
      {
        title: "2. Closed-Loop Referrals & Why They Matter",
        summary: "Eliminating lost-to-follow-up clients between health facilities.",
        keyPoints: [
          "Traditional Referral (Open Loop): A provider tells a client to go to another clinic with a paper note. No confirmation of arrival is made.",
          "Closed-Loop Referral: The Navigator initiates the referral, coordinates with the receiving facility, assists the client with navigation barriers, and receives written or verbal confirmation that the client was received and evaluated.",
          "The referral loop is ONLY closed when the receiving facility confirms that services were provided."
        ]
      },
      {
        title: "3. Appointment Tracking & Missed Visit Follow-up",
        summary: "Keeping clients retained in care and on life-saving therapy.",
        keyPoints: [
          "Tracking systems: Review appointment registers at the start of every clinic day to anticipate arrivals.",
          "Immediate action: If an appointment is missed, initiate follow-up within 24 to 48 hours according to the facility SOP.",
          "Confidential follow-up: When calling or visiting, never disclose the client's medical condition or clinic name to family members or neighbors.",
          "Always confirm that the client is speaking in private before discussing sensitive appointments."
        ]
      },
      {
        title: "4. Integrated Clinical Programs (HIV, TB, Malaria, MNCH)",
        summary: "Core medical knowledge required for navigator roles.",
        keyPoints: [
          "HIV & ART: Antiretroviral therapy (ART) must be taken daily as prescribed. Viral suppression (<1000 copies/mL or undetectable) means the virus cannot damage the immune system and cannot be transmitted sexually (U=U).",
          "Tuberculosis (TB): Caused by Mycobacterium tuberculosis and spread through airborne particles when an infected person coughs or sneezes. Classic symptoms: cough for 2+ weeks, night sweats, unexplained weight loss, and fever. Clients must complete all 6 months of DOTS treatment even when feeling better.",
          "Malaria: Transmitted by female Anopheles mosquitoes. Parasitological confirmation by rapid diagnostic test (mRDT) is mandatory before treatment with ACTs.",
          "Maternal & Child Health: Pregnant women must attend at least 4 to 8 antenatal care (ANC) visits, deliver at a health facility, receive postnatal care (PNC), and ensure infants receive all routine immunizations."
        ]
      },
      {
        title: "5. Workplace Scenarios & Ethics",
        summary: "Handling real-world client challenges with professionalism.",
        keyPoints: [
          "Transport barriers: Connect clients to community support funds, decentralized pickup points, or community ART groups.",
          "Client non-disclosure: Respect the client's right to confidentiality; never pressure them to disclose their status to relatives.",
          "Healthcare worker disrespect: Listen empathetically to the client's complaint, offer support, and guide them through official facility grievance procedures.",
          "De-escalating angry clients: Remain calm, use respectful non-defensive language, validate their frustration, and prioritize their healthcare needs."
        ]
      }
    ],
    examTips: [
      "In referral questions, a referral is never complete until the receiving facility confirms care was received (closed loop).",
      "Confidentiality is paramount: never disclose a client's health status to anyone without explicit written consent."
    ]
  }
];
