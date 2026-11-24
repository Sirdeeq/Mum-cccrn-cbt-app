export interface GlossaryItem {
  term: string;
  fullName?: string;
  category: 'HIV/AIDS' | 'Tuberculosis' | 'Malaria' | 'MNCH' | 'Data & M&E' | 'Laboratory' | 'Quality Improvement' | 'General Public Health';
  definition: string;
  practicalRelevance: string;
}

export const glossaryItems: GlossaryItem[] = [
  // HIV / AIDS
  {
    term: "ART",
    fullName: "Antiretroviral Therapy",
    category: "HIV/AIDS",
    definition: "Lifelong medication combination that suppresses HIV replication, restores immune function (CD4 count), and prevents disease progression.",
    practicalRelevance: "Candidates must remember that ART must be taken daily at the same time to prevent drug resistance."
  },
  {
    term: "ARV",
    fullName: "Antiretroviral Drugs",
    category: "HIV/AIDS",
    definition: "The specific pharmaceutical agents (e.g. Dolutegravir, Tenofovir, Lamivudine - TLD) used in ART regimens.",
    practicalRelevance: "TLD is the preferred first-line regimen for adults and adolescents in Nigeria."
  },
  {
    term: "Viral Load (VL)",
    fullName: "HIV Viral Load",
    category: "HIV/AIDS",
    definition: "The concentration of HIV RNA copies per milliliter of blood (copies/mL), measuring treatment efficacy.",
    practicalRelevance: "Viral suppression is defined nationally as <1000 copies/mL. Undetectable is <50 copies/mL."
  },
  {
    term: "U=U",
    fullName: "Undetectable = Untransmittable",
    category: "HIV/AIDS",
    definition: "A proven scientific consensus showing that people living with HIV who maintain an undetectable viral load cannot transmit the virus through sexual intercourse.",
    practicalRelevance: "A central counseling and anti-stigma message for Client Navigators and Testing Assistants."
  },
  {
    term: "HTS",
    fullName: "HIV Testing Services",
    category: "HIV/AIDS",
    definition: "The full spectrum of pre-test information, counseling, rapid testing, and post-test linkage services.",
    practicalRelevance: "Must strictly follow the 5 Cs: Consent, Confidentiality, Counseling, Correct test results, and Connection (linkage)."
  },
  {
    term: "PMTCT",
    fullName: "Prevention of Mother-to-Child Transmission",
    category: "HIV/AIDS",
    definition: "Interventions provided to pregnant and breastfeeding women living with HIV and their infants to eliminate perinatal HIV transmission.",
    practicalRelevance: "Includes maternal ART, viral load tracking, safe delivery, infant ARV prophylaxis, and infant DNA-PCR testing at 6 weeks."
  },
  {
    term: "PrEP",
    fullName: "Pre-Exposure Prophylaxis",
    category: "HIV/AIDS",
    definition: "Daily oral medication taken by HIV-negative individuals at ongoing substantial risk of HIV infection to prevent acquiring the virus.",
    practicalRelevance: "Targeted at serodiscordant couples, key populations, and individuals with high-risk exposures."
  },
  {
    term: "PEP",
    fullName: "Post-Exposure Prophylaxis",
    category: "HIV/AIDS",
    definition: "Short-course (28 days) antiretroviral medication taken within 72 hours following potential accidental exposure to HIV (e.g., needle prick or sexual assault).",
    practicalRelevance: "Critical exam point: PEP MUST be initiated as soon as possible, ideally within 2 hours and no later than 72 hours."
  },
  {
    term: "EAC",
    fullName: "Enhanced Adherence Counseling",
    category: "HIV/AIDS",
    definition: "Structured, multidimensional adherence sessions provided to clients with high viral loads (≥1000 copies/mL) before repeating viral load testing.",
    practicalRelevance: "A minimum of 3 consecutive monthly EAC sessions are required before a follow-up viral load test is drawn."
  },
  {
    term: "DSD",
    fullName: "Differentiated Service Delivery",
    category: "HIV/AIDS",
    definition: "Patient-centered healthcare models that adapt ART delivery to the needs of specific client groups (e.g., stable clients receive 3 or 6-month multi-month dispensing).",
    practicalRelevance: "Reduces congestion at health facilities and lowers travel costs for stable patients."
  },
  {
    term: "OTZ",
    fullName: "Operation Triple Zero",
    category: "HIV/AIDS",
    definition: "An adolescent and youth-friendly club initiative aimed at achieving Zero Missed Appointments, Zero Missed Doses, and Zero Viral Load.",
    practicalRelevance: "Provides peer-to-peer psychosocial support for adolescents living with HIV."
  },
  {
    term: "Index Case Testing (ICT)",
    fullName: "Index Client Contact Tracing",
    category: "HIV/AIDS",
    definition: "Voluntary process where sexual partners and biological children of a person confirmed to be living with HIV are elicited and offered HIV testing.",
    practicalRelevance: "One of the highest-yield case-finding strategies in public health programs."
  },

  // TUBERCULOSIS
  {
    term: "DOTS",
    fullName: "Directly Observed Therapy, Short-Course",
    category: "Tuberculosis",
    definition: "An internationally recommended TB control strategy where an appointed treatment supporter observes the patient swallowing every dose of anti-TB medication.",
    practicalRelevance: "Ensures completion of the full 6-month treatment course to prevent drug-resistant TB (MDR-TB)."
  },
  {
    term: "GeneXpert MTB/RIF",
    fullName: "Automated Molecular Nucleic Acid Amplification Test",
    category: "Tuberculosis",
    definition: "Rapid molecular cartridge test that detects Mycobacterium tuberculosis DNA and Rifampicin resistance mutations simultaneously in under 2 hours.",
    practicalRelevance: "The national primary diagnostic tool for presumptive TB cases across Nigeria."
  },
  {
    term: "TPT / 3HP / IPT",
    fullName: "TB Preventive Treatment",
    category: "Tuberculosis",
    definition: "Preventive medication course (such as 3 months of once-weekly Isoniazid + Rifapentine, or daily Isoniazid) given to people living with HIV or child contacts to prevent TB disease.",
    practicalRelevance: "All eligible clients living with HIV who screen negative for active TB symptoms must be evaluated for TPT."
  },
  {
    term: "ACF",
    fullName: "Active Case Finding",
    category: "Tuberculosis",
    definition: "Proactive screening for TB symptoms (cough, fever, weight loss, night sweats) in clinical waiting rooms and high-risk community settings rather than waiting for patients to present voluntarily.",
    practicalRelevance: "A core daily duty of facility Client Navigators and healthcare workers."
  },
  {
    term: "MDR-TB",
    fullName: "Multidrug-Resistant Tuberculosis",
    category: "Tuberculosis",
    definition: "A strain of TB bacteria resistant to at least Isoniazid and Rifampicin, the two most powerful first-line TB medications.",
    practicalRelevance: "Requires longer, specialized second-line treatment regimens and strict infection control isolation."
  },

  // MALARIA
  {
    term: "mRDT",
    fullName: "Malaria Rapid Diagnostic Test",
    category: "Malaria",
    definition: "Point-of-care antigen-detection cassette test (detecting Plasmodium falciparum HRP-2 or pLDH) providing results within 15–20 minutes.",
    practicalRelevance: "National policy mandates parasitological confirmation by mRDT or microscopy before initiating antimalarial therapy."
  },
  {
    term: "ACT",
    fullName: "Artemisinin-based Combination Therapy",
    category: "Malaria",
    definition: "The first-line pharmaceutical therapy for uncomplicated Plasmodium falciparum malaria in Nigeria (e.g. Artemether-Lumefantrine or Artesunate-Amodiaquine).",
    practicalRelevance: "Must never be prescribed as monotherapy; combination prevents the emergence of drug resistance."
  },
  {
    term: "IPTp-SP",
    fullName: "Intermittent Preventive Treatment in Pregnancy with Sulfadoxine-Pyrimethamine",
    category: "Malaria",
    definition: "Presumptive antimalarial prevention given to pregnant women at each scheduled antenatal care visit starting from the 13th week of pregnancy (second trimester), at least 1 month apart.",
    practicalRelevance: "Protects maternal health and prevents low birth weight, maternal anemia, and stillbirth."
  },
  {
    term: "LLIN",
    fullName: "Long-Lasting Insecticidal Net",
    category: "Malaria",
    definition: "Factory-treated mosquito bed nets that provide both physical barrier and insecticide repellent protection against nocturnal Anopheles mosquitoes.",
    practicalRelevance: "Distributed routinely to pregnant mothers during ANC registration and infants completing measles vaccination."
  },

  // MNCH
  {
    term: "ANC",
    fullName: "Antenatal Care",
    category: "MNCH",
    definition: "Comprehensive healthcare and clinical monitoring provided to pregnant women throughout pregnancy to promote maternal and fetal health.",
    practicalRelevance: "National guidelines recommend at least 4 to 8 focused ANC contacts during pregnancy."
  },
  {
    term: "PNC",
    fullName: "Postnatal Care",
    category: "MNCH",
    definition: "Care provided to mothers and newborns immediately after delivery and extending up to 6 weeks postpartum.",
    practicalRelevance: "Critical period where the highest percentage of maternal and neonatal mortalities occur."
  },
  {
    term: "EPI",
    fullName: "Expanded Programme on Immunization",
    category: "MNCH",
    definition: "National vaccination schedule protecting infants against vaccine-preventable diseases (BCG, OPV, Pentavalent, Rotavirus, Measles, Yellow Fever, HPV).",
    practicalRelevance: "Client Navigators cross-check child immunization cards during every health facility encounter."
  },
  {
    term: "EID",
    fullName: "Early Infant Diagnosis",
    category: "MNCH",
    definition: "Molecular DNA-PCR testing performed on dried blood spots (DBS) from HIV-exposed infants at 6 weeks of age.",
    practicalRelevance: "Standard antibody tests cannot be used at this age due to persisting maternal antibodies crossing the placenta."
  },
  {
    term: "SBA",
    fullName: "Skilled Birth Attendant",
    category: "MNCH",
    definition: "An accredited health professional (doctor, midwife, nurse) trained in managing normal pregnancy, childbirth, and immediate postnatal complications.",
    practicalRelevance: "Facility delivery with an SBA is a prime objective of CCCRN BRIDGE-N maternal health programs."
  },

  // DATA & M&E
  {
    term: "EMR / NMRS",
    fullName: "Electronic Medical Records / Nigeria Medical Record System",
    category: "Data & M&E",
    definition: "Software database used across supported health facilities to capture and track longitudinal patient clinical encounters, laboratory results, and pharmacy pickups.",
    practicalRelevance: "Integrated Data Assistants enter data, perform backups, and generate cohort analyses from NMRS."
  },
  {
    term: "DQA / RDQA",
    fullName: "Routine Data Quality Assessment",
    category: "Data & M&E",
    definition: "Systematic auditing process comparing primary registers against monthly summary forms and electronic databases to measure accuracy and completeness.",
    practicalRelevance: "A recount factor between 95% and 105% indicates acceptable reporting concordance."
  },
  {
    term: "UIC",
    fullName: "Unique Identifier Code",
    category: "Data & M&E",
    definition: "An alphanumeric code assigned to a specific patient to deduplicate records and link their clinical visits while maintaining anonymity.",
    practicalRelevance: "Prevents double-counting clients who transfer between clinics or receive community services."
  },
  {
    term: "DHIS2",
    fullName: "District Health Information Software 2",
    category: "Data & M&E",
    definition: "Web-based open-source platform adopted by Nigeria's Federal Ministry of Health for national aggregate health data reporting and analytics.",
    practicalRelevance: "Monthly facility summary data feeds directly from paper summaries into national DHIS2 instances."
  },
  {
    term: "Audit Trail",
    fullName: "System Security Audit Log",
    category: "Data & M&E",
    definition: "A chronological record that tracks who accessed, created, edited, or deleted clinical records in electronic databases or physical filing systems.",
    practicalRelevance: "Guarantees accountability and identifies unauthorized alterations or confidentiality breaches."
  },
  {
    term: "Recount Factor",
    fullName: "Data Verification Recount Percentage",
    category: "Data & M&E",
    definition: "Formula: (Recounted Number in Primary Registers ÷ Reported Number on Summary Form) × 100.",
    practicalRelevance: "Over-reporting (>105%) or under-reporting (<95%) requires immediate register reconciliation."
  },

  // LABORATORY & BIOSAFETY
  {
    term: "IQC",
    fullName: "Internal Quality Control",
    category: "Laboratory",
    definition: "Daily operational checks run using known positive and negative control specimens to confirm reagent and analyzer validity before patient samples are tested.",
    practicalRelevance: "If IQC fails, patient results must NEVER be released. Trouble-shoot and re-run immediately."
  },
  {
    term: "EQA / PT",
    fullName: "External Quality Assessment / Proficiency Testing",
    category: "Laboratory",
    definition: "Blind test specimens dispatched by accredited reference bodies to evaluate a testing facility's diagnostic accuracy against peer institutions.",
    practicalRelevance: "Mandatory for laboratory accreditation and ongoing quality certification."
  },
  {
    term: "TAT",
    fullName: "Turnaround Time",
    category: "Laboratory",
    definition: "The exact time interval from when a specimen is collected or received in the lab to when the verified result is delivered to the clinical team.",
    practicalRelevance: "Short TAT allows same-day clinical management and prevents lost-to-follow-up."
  },
  {
    term: "Triple Packaging System",
    fullName: "Infectious Specimen Packaging Standard",
    category: "Laboratory",
    definition: "Three-layer biosafety packaging for transporting infectious samples: 1) Primary leak-proof receptacle with absorbent material; 2) Secondary leak-proof packaging; 3) Rigid outer shipping container with biohazard labeling.",
    practicalRelevance: "Mandatory standard for sending viral load and TB sputum samples from peripheral clinics to regional PCR hubs."
  },
  {
    term: "Cold Chain",
    fullName: "Temperature-Controlled Supply Chain",
    category: "Laboratory",
    definition: "Unbroken system of storage and transport maintaining specimens and vaccines within required temperature ranges (+2°C to +8°C, or -20°C/-80°C).",
    practicalRelevance: "Temperature logs must be monitored and documented twice daily (morning and evening)."
  },
  {
    term: "SOP",
    fullName: "Standard Operating Procedure",
    category: "Laboratory",
    definition: "A step-by-step written protocol approved by laboratory management detailing exact instructions for performing a clinical or technical procedure.",
    practicalRelevance: "Health workers must strictly follow approved SOPs rather than personal intuition."
  },

  // QUALITY IMPROVEMENT
  {
    term: "CQI",
    fullName: "Continuous Quality Improvement",
    category: "Quality Improvement",
    definition: "Ongoing organizational philosophy and methodology focused on incremental improvements in healthcare processes, safety, and clinical outcomes.",
    practicalRelevance: "Involves multidisciplinary facility teams reviewing data and testing small-scale changes."
  },
  {
    term: "PDSA Cycle",
    fullName: "Plan - Do - Study - Act",
    category: "Quality Improvement",
    definition: "Four-stage iterative problem-solving model used for testing quality improvement changes on a small, rapid scale.",
    practicalRelevance: "Plan the test, Do the test on a small scale, Study the results vs baseline, Act (adopt, adapt, or abandon)."
  },
  {
    term: "RCA",
    fullName: "Root Cause Analysis",
    category: "Quality Improvement",
    definition: "A structured investigation technique (using 5 Whys and Fishbone diagrams) designed to identify the fundamental systemic breakdown causing a problem.",
    practicalRelevance: "Solves underlying system failures rather than blaming frontline individuals."
  },
  {
    term: "Fishbone Diagram",
    fullName: "Ishikawa Cause-and-Effect Diagram",
    category: "Quality Improvement",
    definition: "Visual tool categorizing potential causes of a problem into People, Process, Policy, Equipment, and Environment.",
    practicalRelevance: "Used in facility QI meetings to map out complex clinical challenges like high wait times or viral non-suppression."
  },
  {
    term: "Run Chart",
    fullName: "Time-Series Performance Chart",
    category: "Quality Improvement",
    definition: "Line graph plotting clinical indicator data chronologically over time with a median line to determine if changes produce true improvement.",
    practicalRelevance: "A shift is defined as 6 or more consecutive points above or below the median."
  },

  // GENERAL PUBLIC HEALTH & ETHICS
  {
    term: "NDPR",
    fullName: "Nigeria Data Protection Regulation",
    category: "General Public Health",
    definition: "National legal framework establishing strict requirements for the lawful collection, processing, confidentiality, and storage of personal citizen information.",
    practicalRelevance: "Healthcare workers face disciplinary and legal sanctions for unauthorized disclosure of patient records."
  },
  {
    term: "Informed Consent",
    fullName: "Voluntary Client Consent",
    category: "General Public Health",
    definition: "Clear permission granted by a patient with full knowledge of the possible risks, benefits, and voluntary nature of a diagnostic or therapeutic procedure.",
    practicalRelevance: "No health worker may draw blood, perform an HIV test, or initiate treatment without informed consent."
  },
  {
    term: "Standard Precautions",
    fullName: "Universal Biosafety Precautions",
    category: "General Public Health",
    definition: "Basic infection prevention practices that apply to all patient care, regardless of suspected or confirmed infection status, in any setting where healthcare is delivered.",
    practicalRelevance: "Hand hygiene, proper PPE, safe sharps handling, clean equipment, and environmental sanitation."
  }
];
