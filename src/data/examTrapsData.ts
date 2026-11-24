export interface ExamTrap {
  number: number;
  title: string;
  trapDescription: string;
  exampleQuestion: {
    question: string;
    options: { key: string; text: string }[];
    correctAnswer: string;
    explanation: string;
  };
  keyTakeaway: string;
}

export interface InterviewQuestion {
  question: string;
  competency: string;
  whatPanelLooksFor: string;
  starModelAnswer: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  proTip: string;
}

export const examTraps: ExamTrap[] = [
  {
    number: 1,
    title: 'The "ALL of the following EXCEPT..." or Negative Stem Trap',
    trapDescription: 'Candidates rushing through questions often overlook the negative word "EXCEPT", "NOT", or "FALSE", and reflexively pick the first correct-sounding statement (Option A).',
    exampleQuestion: {
      question: 'All of the following are recommended infection control measures when collecting sputum for TB diagnosis EXCEPT:',
      options: [
        { key: 'A', text: 'Collecting sputum in an open, well-ventilated outdoor area' },
        { key: 'B', text: 'Instructing the patient to produce a deep cough away from others' },
        { key: 'C', text: 'Collecting sputum inside an enclosed, air-conditioned consultation room with closed windows' },
        { key: 'D', text: 'Wearing an approved N95 or FFP2 respirator mask when supervising specimen collection' }
      ],
      correctAnswer: 'C',
      explanation: 'Sputum collection generates aerosols containing infectious Mycobacterium tuberculosis. It must NEVER be done in closed, unventilated, or air-conditioned rooms. Options A, B, and D are standard infection prevention guidelines; therefore C is the exception.'
    },
    keyTakeaway: 'Always re-read the final sentence of every question stem. If you see "EXCEPT" or "NOT", circle it mentally and search for the single incorrect or unsafe practice.'
  },
  {
    number: 2,
    title: 'The "FIRST Action" vs "BEST / FINAL Action" Trap',
    trapDescription: 'In emergency or safety questions, multiple choices are good actions, but the question asks what you must do FIRST. Choosing a later action (like reporting or documenting) will cause you to lose marks.',
    exampleQuestion: {
      question: 'A Testing Assistant experiences an accidental needle prick while disposing of a used blood lancet. What is the FIRST immediate action they must take?',
      options: [
        { key: 'A', text: 'Report the incident to the facility focal person and complete an incident log' },
        { key: 'B', text: 'Immediately wash the injured site thoroughly with soap and clean running water' },
        { key: 'C', text: 'Squeeze the puncture wound aggressively to force out contaminated blood' },
        { key: 'D', text: 'Immediately swallow a 28-day course of Post-Exposure Prophylaxis (PEP)' }
      ],
      correctAnswer: 'B',
      explanation: 'First aid is the priority. The first step is to wash the wound gently with soap and water under a running tap. Squeezing (C) is contraindicated because it damages tissue and increases viral inoculation. Reporting (A) and PEP evaluation (D) come immediately after wound decontamination.'
    },
    keyTakeaway: 'When a question asks for the "FIRST" step, focus on immediate client/worker safety and initial decontamination before administrative reporting or paperwork.'
  },
  {
    number: 3,
    title: 'The Invalid Rapid Test vs Negative Rapid Test Trap',
    trapDescription: 'Candidates mistake a test cassette with no lines at all as "negative". If the Control Line (C) is missing, the test is INVALID, regardless of what appears in the Test Line (T).',
    exampleQuestion: {
      question: 'After waiting 15 minutes for an HIV rapid diagnostic test cassette to develop, the Testing Assistant observes a distinct red band at the Test line (T), but no band is visible at the Control line (C). How should this result be interpreted?',
      options: [
        { key: 'A', text: 'The result is positive / reactive' },
        { key: 'B', text: 'The result is negative / non-reactive' },
        { key: 'C', text: 'The result is invalid and must be repeated with a new test device from a fresh lot' },
        { key: 'D', text: 'The result is indeterminate; record it in the register as inconclusive' }
      ],
      correctAnswer: 'C',
      explanation: 'The Control line verifies that sufficient buffer fluid migrated across the nitrocellulose strip and that reagents are active. Without a visible Control line, the test has completely failed and cannot be interpreted. It must be repeated using a new device.'
    },
    keyTakeaway: 'No Control Line = Zero Validity. Never interpret or report an invalid cassette as positive, negative, or inconclusive.'
  },
  {
    number: 4,
    title: 'The "Open-Loop" vs "Closed-Loop" Referral Trap',
    trapDescription: 'In Client Navigation and linkage questions, examiners test whether you understand when a referral is truly complete.',
    exampleQuestion: {
      question: 'A Client Navigator writes a referral letter for an expectant mother diagnosed with active TB to be seen at the chest clinic. Under what condition is this referral officially considered "closed-loop"?',
      options: [
        { key: 'A', text: 'As soon as the referral form is handed to the client with clinic directions' },
        { key: 'B', text: 'When the client calls the navigator to say she intends to visit the clinic tomorrow' },
        { key: 'C', text: 'Only when the receiving chest clinic confirms in writing or verbally that the client was received and evaluated' },
        { key: 'D', text: 'When the navigator logs the referral in the outgoing facility referral register' }
      ],
      correctAnswer: 'C',
      explanation: 'A referral remains open and unconfirmed until documented feedback is received from the destination provider verifying that the client actually reached the clinic and received services.'
    },
    keyTakeaway: 'A referral is never complete until the receiving facility confirms that services were delivered to the patient.'
  },
  {
    number: 5,
    title: 'The Data Discrepancy & Guesswork Trap',
    trapDescription: 'In data management questions, when figures do not tally between summary forms and registers, candidates might choose options suggesting "adjusting numbers to match" or "estimating averages". This is a critical error.',
    exampleQuestion: {
      question: 'During monthly report compilation, an Integrated Data Assistant discovers that the Monthly Summary Form indicates 145 clients received viral load tests, but counting the facility register yields only 132. What is the correct procedure?',
      options: [
        { key: 'A', text: 'Adjust the register to 145 so both documents match the supervisor target' },
        { key: 'B', text: 'Recount the primary registers and verify against daily client encounter logs before correcting the summary form' },
        { key: 'C', text: 'Calculate the mathematical average of 145 and 132 (138.5) and report 139' },
        { key: 'D', text: 'Submit the report as 145 to avoid missing the monthly submission deadline' }
      ],
      correctAnswer: 'B',
      explanation: 'Primary source documents (patient folders, registers, encounter forms) are the absolute ground truth in health data management. Discrepancies must be physically reconciled against primary records; fabrication or averaging of health data is a severe professional violation.'
    },
    keyTakeaway: 'Always verify against the primary paper or clinical source document. Never alter, estimate, or fabricate numbers to make reports match targets.'
  },
  {
    number: 6,
    title: 'The Patient Confidentiality vs Family/Spouse Demand Trap',
    trapDescription: 'Scenarios where a husband, mother-in-law, or pastor demands to know a patient\'s HIV or lab test result to "help them" or "prevent family conflict".',
    exampleQuestion: {
      question: 'The husband of a pregnant client attending the antenatal clinic approaches the Client Navigator demanding to know his wife\'s HIV status, claiming he pays for all her hospital care. How should the navigator respond?',
      options: [
        { key: 'A', text: 'Disclose the result privately because spouses have a legal right to know for transmission prevention' },
        { key: 'B', text: 'Politely refuse to disclose any medical information and counsel the couple on voluntary mutual assisted disclosure' },
        { key: 'C', text: 'Instruct the laboratory assistant to discreetly hand the lab slip to the husband' },
        { key: 'D', text: 'Tell the husband his wife is negative to avoid domestic violence, regardless of the true result' }
      ],
      correctAnswer: 'B',
      explanation: 'Patient medical confidentiality is absolute under Nigerian law (NDPR) and medical ethics. No relative, spouse, or paying party has the right to access a client\'s confidential diagnostic records without explicit, written informed consent from the client. The ethical pathway is voluntary mutual disclosure counseling.'
    },
    keyTakeaway: 'Client confidentiality cannot be breached for family members, partners, or community leaders without the client\'s explicit written authorization.'
  },
  {
    number: 7,
    title: 'The Viral Suppression Thresholds Trap',
    trapDescription: 'Questions that test exact numerical cutoffs for viral load suppression according to national PEPFAR/WHO guidelines.',
    exampleQuestion: {
      question: 'According to national HIV clinical guidelines in Nigeria, what is the viral load threshold below which a client on ART is officially classified as "Virally Suppressed"?',
      options: [
        { key: 'A', text: 'Less than 50 copies/mL' },
        { key: 'B', text: 'Less than 200 copies/mL' },
        { key: 'C', text: 'Less than 1,000 copies/mL' },
        { key: 'D', text: 'Zero copies/mL' }
      ],
      correctAnswer: 'C',
      explanation: 'National guidelines classify viral suppression as <1000 copies/mL. Clients below this threshold continue their routine ART regimen. Undetectable is typically <50 copies/mL. If a client is ≥1000 copies/mL, they must immediately receive Enhanced Adherence Counseling (EAC).'
    },
    keyTakeaway: 'Viral Suppression = <1,000 copies/mL. High Viral Load (requiring EAC) = ≥1,000 copies/mL. Undetectable = <50 copies/mL.'
  },
  {
    number: 8,
    title: 'The Quality Improvement "Scale of Change" Trap',
    trapDescription: 'Candidates often pick the most ambitious-sounding change idea, like "immediately roll out the new scheduling policy hospital-wide across all departments". In QI methodology, that is incorrect.',
    exampleQuestion: {
      question: 'A facility QI team develops an innovative stamp to remind clinicians to order viral load tests for eligible clients. What is the proper first step in testing this change idea using the PDSA cycle?',
      options: [
        { key: 'A', text: 'Print 1,000 stamps and distribute them to every clinical department across the entire state' },
        { key: 'B', text: 'Mandate that all clinicians use the stamp for 12 months before evaluating impact' },
        { key: 'C', text: 'Test the stamp with one clinician or during one clinic day with 5 to 10 clients to assess feasibility' },
        { key: 'D', text: 'Submit the proposal to the Federal Ministry of Health for national policy approval' }
      ],
      correctAnswer: 'C',
      explanation: 'The fundamental principle of Plan-Do-Study-Act (PDSA) is small-scale, rapid-cycle testing. Testing on 1 doctor, 1 day, or 5 patients minimizes risk, allows immediate refinement (Adapt), and prevents wasted resources before broad adoption.'
    },
    keyTakeaway: 'In PDSA and Quality Improvement questions, the correct initial test of change is ALWAYS on a small, manageable scale (1 provider, 1 day, or few clients).'
  },
  {
    number: 9,
    title: 'The Universal Precautions vs Selective Precautions Trap',
    trapDescription: 'Assuming that personal protective equipment (PPE) like gloves and masks are only necessary when dealing with patients known or suspected to have HIV or TB.',
    exampleQuestion: {
      question: 'When should a healthcare worker implement Standard (Universal) Precautions during phlebotomy and sample handling?',
      options: [
        { key: 'A', text: 'Only when treating patients who have tested positive for HIV or Hepatitis B' },
        { key: 'B', text: 'Only when the client looks visibly malnourished or chronically ill' },
        { key: 'C', text: 'Consistently with ALL clients and biological specimens, regardless of their presumed diagnosis' },
        { key: 'D', text: 'Only during national public health outbreaks and epidemics' }
      ],
      correctAnswer: 'C',
      explanation: 'Standard Precautions are universal: every sample of human blood and bodily fluid must be treated as potentially infectious. You cannot identify infectious status by visual appearance.'
    },
    keyTakeaway: 'Standard precautions apply to EVERY client, EVERY specimen, EVERY time.'
  },
  {
    number: 10,
    title: 'The Specimen Transport Cold Chain Temperature Trap',
    trapDescription: 'Mixing up storage temperatures for whole blood, plasma, vaccines, and frozen specimens.',
    exampleQuestion: {
      question: 'What is the required temperature range for maintaining the cold chain during the routine transportation of whole blood samples and rapid test reagents from central stores to health facilities?',
      options: [
        { key: 'A', text: '-20°C to -10°C (Deep freezing)' },
        { key: 'B', text: '+2°C to +8°C (Refrigerated cold chain)' },
        { key: 'C', text: '+15°C to +25°C (Controlled room temperature)' },
        { key: 'D', text: '0°C (Ice packing)' }
      ],
      correctAnswer: 'B',
      explanation: '+2°C to +8°C is the universal refrigerated temperature range for vaccines, whole blood specimens, and standard laboratory diagnostic supplies. Freezing whole blood causes hemolysis (rupturing of red cells), invalidating test results.'
    },
    keyTakeaway: 'Standard clinical specimen and vaccine cold chain = +2°C to +8°C. Whole blood must NEVER be frozen.'
  }
];

export const interviewQuestions: InterviewQuestion[] = [
  {
    question: "Tell us about yourself and why you are the best fit for this CCCRN BRIDGE-N position.",
    competency: "Self-Introduction & Role Alignment",
    whatPanelLooksFor: "A concise, structured response focusing on relevant qualifications, experience in public health facilities, passion for community care, and alignment with CCCRN's mission.",
    starModelAnswer: {
      situation: "I have over 3 years of hands-on experience supporting primary healthcare delivery and community health projects in Nigeria.",
      task: "My objective has always been ensuring patient dignity, zero missed clinical appointments, and meticulous documentation in high-volume clinics.",
      action: "In my previous role, I actively managed appointment logs, coordinated with clinical teams to track clients, and upheld strict patient confidentiality while building trust with mothers and vulnerable patients.",
      result: "Through this dedication, our facility improved appointment return rates from 78% to over 92%. I am eager to bring this same work ethic, empathy, and attention to detail to the CCCRN BRIDGE-N team."
    },
    proTip: "Keep your answer under 2 minutes. Do not recite your entire CV. Highlight your relevant skills and your heart for client service."
  },
  {
    question: "How do you handle a client who has missed multiple appointments and states they want to stop taking their medication?",
    competency: "Client Retention & Empathy",
    whatPanelLooksFor: "Non-judgmental communication, active listening, identifying underlying barriers (stigma, side effects, transport, denial), and collaborative problem solving.",
    starModelAnswer: {
      situation: "A client who had missed 3 monthly ART appointments was contacted and expressed frustration with daily pill burden and fear of spouse discovery.",
      task: "My task was to de-escalate their anxiety, understand the root causes of non-adherence, and support them back into continuous care without making them feel blamed or scolded.",
      action: "I welcomed the client in a private room, listened attentively to their concerns without interruption, and validated their feelings. I explained the concept of U=U (Undetectable = Untransmittable) and coordinated with the clinician to evaluate side-effect management and discuss multi-month dispensing or community pickup.",
      result: "The client felt respected and reassured. They agreed to resume therapy, attended their next viral load test, and reached viral suppression within six months."
    },
    proTip: "Never say 'I will scold the client' or 'I will tell them they will get sick.' Health workers must be supportive, compassionate advocates, not disciplinarians."
  },
  {
    question: "Describe a situation where you discovered a significant error in monthly facility reports or patient records. What did you do?",
    competency: "Data Integrity & Problem Solving",
    whatPanelLooksFor: "Commitment to data accuracy, following standard verification procedures, transparency, and avoiding unapproved alterations.",
    starModelAnswer: {
      situation: "While preparing the monthly facility summary, I noticed that the number of clients initiated on treatment differed by 15 between the paper register and the electronic database.",
      task: "I needed to identify the exact cause of the variance and ensure the submitted report was 100% accurate before the deadline.",
      action: "Instead of guessing or adjusting figures, I performed a line-by-line reconciliation comparing daily clinical encounter forms against the physical register and electronic entries. I discovered that 15 weekend clinical encounters had not been synchronized into the electronic system.",
      result: "I entered the missing records, validated the entries with the facility in-charge, and submitted a completely reconciled, verified report on time."
    },
    proTip: "Emphasize that you never alter numbers arbitrarily and that source documents are the standard truth."
  },
  {
    question: "How do you prioritize your daily workload when faced with high patient volume and urgent reporting deadlines?",
    competency: "Time Management & Stress Tolerance",
    whatPanelLooksFor: "Organization, setting priorities based on patient safety first, and communicating transparently with supervisors.",
    starModelAnswer: {
      situation: "On a busy Monday morning, the facility had 60 waiting clients needing attention, while a regional quarterly reporting submission was due by 2:00 PM.",
      task: "I had to ensure client waiting times remained safe while meeting the fixed reporting deadline.",
      action: "I organized my morning by triaging immediate patient flow first—verifying client files, ensuring smooth movement between triage and counseling, and delegating non-clinical logistics. During lower-traffic midday windows, I focused intensely on finalizing and validating the report figures.",
      result: "All clients were attended to courteously without safety incidents, and the reporting summary was submitted to the M&E officer 30 minutes ahead of the deadline."
    },
    proTip: "Show that patient safety and dignity always come first, supported by disciplined personal time management."
  },
  {
    question: "Why is patient confidentiality so strictly enforced in CCCRN programs, and how do you protect it in daily practice?",
    competency: "Ethics, NDPR & Professional Integrity",
    whatPanelLooksFor: "Understanding that breach of confidentiality causes stigma, domestic violence, and loss to follow-up, and knowing concrete security steps.",
    starModelAnswer: {
      situation: "In high-volume community clinics, clients share sensitive health status information including HIV, TB, and reproductive health.",
      task: "My duty is to ensure that client trust is never compromised and that health records remain protected against unauthorized eyes.",
      action: "In daily work, I always close physical registers and lock file cabinets when stepping away from the desk. I never leave electronic screens open without password locking. When conducting phone tracking, I never mention clinical diagnoses or clinic names to third parties, and I always ensure the client is in a private location before speaking.",
      result: "This builds community trust, prevents stigma-related treatment abandonment, and ensures full compliance with CCCRN and national data protection standards."
    },
    proTip: "State clearly that confidentiality is not just a policy—it is a vital life-saving trust between the health system and the community."
  }
];
