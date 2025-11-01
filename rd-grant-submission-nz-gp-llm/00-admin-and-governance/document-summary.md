# Document Summary ? All 10 Project Files
## Quick Reference Guide with Content Lists

**Last Updated:** 2025-11-01  
**Version:** 1.0

---

## 00-admin-and-governance/

### 1. `project-master-index.md` (Navigation Hub)

**Description:** Central navigation hub providing project overview, document map, key dates, objectives, and task-based guidance for LLM agents.

**Content List:**
- Project overview (ClinicPro, dates, contacts, financial summary)
- Document map (all 10 files with purpose and when to use)
- Key dates and milestones (project timeline, quarterly claims schedule)
- Objectives quick reference (O1-O5, CD-A/B/C with hours and costs)
- Version control and file naming conventions
- ?? For LLM Agents: Task-based guidance (6 task types: Compliance, Financial, Safety, CapDev, Governance, General)
- Common task workflows (quarterly claims, adding sub-processors, safety regressions, model releases)
- Document cross-references (where to find what)
- Success metrics (utility, safety, performance targets)
- Next actions checklist (before start, Month 1, Q1 claim)

**Key Numbers:**
- Total eligible costs: $107,232
- Grant (40%): $42,893
- Co-funding (60%): $64,339
- R&D: 1,062 hours = $101,952
- CapDev: 30 hours = $2,880

---

### 2. `risk-and-change-management.md` (Living Governance)

**Description:** Living document tracking project risks, change log for all documents, stage-gates for objectives, release checklist, and review/escalation procedures.

**Content List:**
- **Risk Register** with 9 initial risks:
  1. Cross-border PHI leakage
  2. Re-identification from de-identified data
  3. Unsafe model output (hallucination, clinical advice)
  4. Over-reliance by clinicians
  5. Scope creep / misconfiguration
  6. Vendor / sub-processor breach
  7. Model drift / safety degradation
  8. CapDev < 5% of grant
  9. Cashflow shortfall
- Risk review cadence (monthly, quarterly, on material change)
- **Change Log** for all 10 documents (version history table)
- Change request template
- **Stage-Gates** (O1-O5 entry/exit criteria and safety gates)
- **Release Checklist** (security, safety, compliance, approvals, rollback)
- Review and escalation procedures (quarterly review process, escalation triggers, contact paths)

**Key Triggers:**
- ?? Prohibited-claim rate > 0.5%
- ?? PHI leakage detected
- ?? New sub-processor/region
- ?? Cashflow negative

---

## 01-application-narrative/

### 3. `forge-application-narrative.md` (Forge Submission)

**Description:** Complete Forge portal submission narrative with application title, eligibility confirmations, R&D activities, uncertainty/newness narratives, and 5 R&D objectives + 2 Capability Development streams.

**Content List:**
- Application title and proposed dates (27 Jan 2026 - 26 Jan 2027)
- ANZSIC code (J5420 Software Publishing)
- Background and compliance (?250 words: assist-only, synthetic data, IPP 12, NAIAEAG)
- Eligibility confirmations (new to R&D, solvent, co-funding, not grouped)
- Planned R&D activities (?250 words: scribe, inbox, history; domain adaptation; safety; Medtech sandbox)
- Uncertainty narrative (?250 words: small/medium model balance; NZ constraints)
- R&D challenge (?250 words: emergent behavior, systematic experiments needed)
- Knowledge availability (?250 words: overseas scribes not NZ-tuned; no NZ inbox solution)
- Newness (?250 words: NZ-tuned inbox management; transparent data lineage)
- Why better (?250 words: clinician value, safety, sovereignty, procurement-ready)
- Overseas labour (None; AU inference only)
- Hosting and data residency statement (Option B: AU inference, no persistent PHI outside NZ)
- **O1-O5 Objectives** with dates, deliverables, targets
- **CD-A, CD-B** with deliverables
- Success metrics (utility ?30% edit reduction, safety prohibited-claim ?0.5%, performance P95 ?2.5s)

**Word Limits:** All narratives ?250 words (Forge-compliant)

---

## 02-financials/

### 4. `cost-template/cost-template.md` (Cost Breakdown)

**Description:** Submission-ready cost template with assumptions, internal labour breakdown by objective, capability development costs, materials & consumables, and quarterly claims schedule.

**Content List:**
- Assumptions (rate $96/hr, hours ramp 16?20?24/week, M&C $200/month, no overseas labour)
- Objectives reference (O1-O5, CD-A/B/C dates)
- **Internal Labour Tab** (1,062 hours @ $96/hr = $101,952):
  - O1: 180h = $17,280
  - O2: 290h = $27,840
  - O3: 300h = $28,800
  - O4: 170h = $16,320
  - O5: 122h = $11,712
- **Capability Development Tab** (30 hours @ $96/hr = $2,880):
  - 3 free courses (OPC Privacy Act, OPC HIPC, Ko Awatea)
  - CD-A: 12h = $1,152 (Regulatory & Compliance)
  - CD-B: 10h = $960 (R&D Info Management)
  - CD-C: 8h = $768 (PM set-up)
- **Materials & Consumables Tab** ($200/month ? 12 = $2,400)
- Depreciation (none planned)
- Objective costing linkage
- Totals and CapDev requirement check (6.7% ?)
- **Quarterly claims schedule** (Q1-Q4 eligible costs and grant amounts)
- Evidence requirements (timesheets, payroll, M&C invoices, certificates, GST)
- Notes and reminders (overseas labour $0, eligible hours only, CapDev ?5%)

**Key Check:** CapDev = $2,880 (6.7% of grant) ? Exceeds 5% minimum

---

### 5. `cashflow-12-month.md` (Financial Forecast)

**Description:** 12-month cashflow forecast showing monthly labour plan, inflows/outflows, grant timing, and positive cash position throughout with operating profit funding co-funding.

**Content List:**
- Assumptions (rate, hours ramp, CapDev, M&C, operating profit $11k/month, opening cash $5k)
- **Monthly labour plan** (table: Months 1-12 with R&D/CapDev hours and costs)
- **Quarterly eligible totals and grant receipts** (Q1-Q4 with payment timing)
- **Monthly cashflow table** (Months 1-13):
  - Opening cash
  - Inflows (operating profit $11k/month + grants in Months 4, 7, 10, 13)
  - Outflows (R&D labour, CapDev labour, M&C)
  - Closing cash
- Spreadsheet structure recommendations (tabs: Assumptions, Cashflow, Hours Plan, Claims, Notes)
- Column formulas (R&D labour, CapDev labour, total outflows, closing cash)
- Governance and reviewer notes (60% co-funding from operating profit; cash always positive)
- **Summary: 12-month cash position** (opening $5k ? closing $73,461)
- What to upload to Forge (cashflow XLSX/PDF, bank statement, YTD P&L/Balance Sheet)

**Key Numbers:**
- Opening cash: $5,000
- Minimum cash: $8,216 (Month 1)
- Closing cash: $73,461 (Month 13)
- Operating profit: $11,000/month ? 12 = $132,000
- Total grants: $43,693 (received Months 4, 7, 10, 13)

**Status:** ? Cash position remains positive throughout

---

## 03-capability-development/

### 6. `capability-development-evidence-pack.md` (CapDev Courses & Setups)

**Description:** Submission-ready capability development evidence pack covering 3 certificate courses, one-off setups in 3 categories, evidence requirements, and Q1-Q4 claim mapping.

**Content List:**
- Purpose and scope (3 capability areas: Regulatory & Compliance, R&D Info Management, PM set-up)
- Selected categories (meets "?2 areas" requirement)
- **Certificate courses** (3 free, NZ-recognised):
  1. OPC Privacy Act 2020 (~30 min)
  2. OPC Health 101 (HIPC) (~30 min)
  3. Ko Awatea Privacy (National) (~20 min)
- **One-off setups** (30 hours total):
  - CD-A: 12 hours = $1,152 (DPIA, IPP 12, HISO, DPA templates, NAIAEAG note)
  - CD-B: 10 hours = $960 (MLflow/DVC, safety dashboard, transparency SOP)
  - CD-C: 8 hours = $768 (stage-gates, risk/change logs, release checklist)
- **Evidence pack index** with file naming conventions (~15-20 documents)
- Acceptance criteria (simple checks for each deliverable)
- **Timesheet mapping** (example entries for CD-A, CD-B, CD-C)
- **Claim mapping** (what to include Q1-Q4)
- Training record template
- Risks and mitigations (free courses, CapDev < 5%, transparency updates)
- Summary: CapDev costs (30 hours, $2,880, 6.7% of grant ?)
- **Ready-to-upload list (Q1)** with checkboxes

**Key Numbers:**
- Total hours: 30
- Total cost: $2,880
- Percentage of grant: 6.7% (exceeds 5% minimum ?)
- Q1 evidence files: ~15-20 documents

---

## 04-compliance-and-safety/

### 7. `dpia/dpia-draft.md` (Complete DPIA - 560 lines)

**Description:** Comprehensive Data Protection Impact Assessment covering project overview, IPP 12 cross-border controls, HISO 10029 security mapping, DPA key clauses, risk assessment, and NAIAEAG alignment.

**Content List:**
- **Project overview** (ClinicPro, Option B hosting: AU inference with no persistent PHI outside NZ)
- Roles and contacts (Controller: clinics; Processor: NexWave; Sub-processors)
- Purpose and lawful basis (assist-only service; no training on production PHI)
- Data subjects and categories (patients, clinicians, staff; PHI types)
- Data minimisation and separation (synthetic/de-identified for dev; least-privilege for pilot)
- **Data flows and storage** (NZ at rest, AU transient compute, return path, sub-processor transparency)
- **Cross-border compliance (IPP 12 controls)**:
  - Contractual safeguards (DPAs, cross-border annex)
  - Technical safeguards (TLS, AES-256, NZ-held keys)
  - Organisational safeguards (training, access reviews)
  - Transparency (publish regions, sub-processors)
- **Security controls (HISO 10029 and NZISM-aligned)**:
  - Governance, access, encryption, network, application safety, operations
- **Safety and clinical-use restrictions (NAIAEAG aligned)**:
  - Assist-only, refusal behaviour, human oversight, safety monitoring
- Retention, deletion, logs
- Transparency and notices (transparency page, clinic notice, patient consent)
- M?ori data and tikanga considerations
- Data subject rights (access, correction, objection, portability, deletion)
- **Risk assessment** (7 risks with mitigations)
- Incident response and breach notification (detect, contain, notify, learn)
- Change management and testing
- Third parties and sub-processors (to list on transparency page)
- DPAs and legal artefacts (Controller-Processor, Sub-processor, IPP 12 annex)
- DPIA approvals and review (quarterly; conditions to proceed)
- Attachments checklist (data flow diagram, IPP 12, HISO, DPAs, transparency, consent, SOPs)
- **IPP 12 Cross-Border Disclosure Control Checklist** (tickbox format)
- **HISO 10029 Control Mapping** (12 domains)
- **Controller-Processor DPA Key Clauses** (parties, purpose, security, location, sub-processing, breach, audit, retention, transparency)

**Key Stance:** Option B (AU inference, no persistent PHI outside NZ, NZ-held keys, IPP 12 safeguards)

---

### 8. `privacy-compliance-quick-reference.md` (Extracted Privacy Controls)

**Description:** Consolidated privacy compliance artefacts extracted from DPIA for quick LLM lookup, including IPP 12 checklist, HISO mapping, DPA clauses, and consent notices.

**Content List:**
- Purpose (quick reference without reading 560-line DPIA)
- **1. IPP 12 Cross-Border Control Checklist** (Option B):
  - Lawful basis and scope
  - Comparable safeguards (contractual)
  - Technical and organisational controls
  - Data minimisation and transparency
  - Data retention and deletion
  - Data subject rights support
  - Ongoing assurance
- **2. HISO 10029 Control Mapping Summary** (12 domains):
  1. Governance and policy
  2. Asset and data management
  3. Access control and identity
  4. Cryptography and key management
  5. Operations security
  6. Logging and monitoring
  7. Application and data protection
  8. Network security
  9. Supplier and sub-processor management
  10. Incident response and business continuity
  11. Privacy management
  12. Clinical safety and human oversight
- **3. DPA Key Clauses Summary**:
  - A. Controller-Processor DPA (Clinic ? NexWave): parties, purpose, security, location, sub-processing, breach, audit, retention
  - B. Sub-Processor DPA (NexWave ? AU Cloud/NZ Storage/ASR): comparable safeguards, region lock, breach duties
- **4. Consent and Notice Text**:
  - A. Clinician-facing notice (clinic agreement/handbook)
  - B. Patient consent/notice for scribing (consultation room/consent form)
  - C. Cross-border disclosure notice (transparency page/privacy policy)

**Use Case:** LLMs can review privacy controls without re-reading full DPIA; ready-to-use consent text

---

### 9. `safety-and-transparency-framework.md` (Operational Procedures)

**Description:** Comprehensive operational safety and transparency framework covering NAIAEAG alignment, safety regression template, incident runbook, transparency page, and synthetic/de-identification SOPs.

**Content List:**
- Purpose (operational safety and transparency procedures)
- **1. NAIAEAG Alignment Note**:
  - No PHI into unapproved LLMs
  - Transparency (data sources, model versions, regions, limitations)
  - Human oversight (assist-only, clinician-in-the-loop)
  - Safety and accountability (measurable metrics, incident response)
- **2. Safety Regression Pack Template** (monthly testing):
  - Test scenarios: prohibited claims, refusal appropriateness, PHI leakage
  - Metrics collection (prohibited-claim rate ?0.5%, refusal appropriateness ?95%, zero PHI leakage)
  - Safety pack output template (markdown)
  - Storage location (07-optional-strengthening/safety-regressions/YYYY-MM/)
- **3. Incident Runbook**:
  - Incident types (PHI breach, security breach, safety failure, sub-processor breach)
  - 6 phases: Detect, Contain (1 hour), Notify (24 hours), Investigate (7 days), Recover (30 days), Learn (60 days)
  - Incident contact points (Security Lead, Privacy Lead, Director, OPC)
  - Incident log template
- **4. Transparency Page Draft** (public-facing):
  - Purpose, data sources (training data), processing locations (NZ at rest, AU transient), sub-processors, model version, safety/limitations, rights, contact, change log
- **5. Transparency SOP**:
  - Update cadence (new sub-processor, data source, model version, region change)
  - Update process (identify, update docs, review, publish)
  - Change log entry template
- **6. Source Register and Sub-Processors Register** (tables):
  - Source register (training data with permissions, last verified)
  - Sub-processors register (provider, service, region, DPA status, last audit)
- **7. Synthetic and De-Identification SOPs**:
  - A. Synthetic data generation SOP (types, process, quality checks)
  - B. De-identification SOP (principles, process, risk assessment)

**Key Templates:** Monthly safety regression, incident runbook, transparency page, source/sub-processor registers

---

## 05-claims-and-tracking/

### 10. `claims-toolkit.md` (Templates & Checklists)

**Description:** Complete claims toolkit with weekly timesheet template, quarterly claim evidence checklist, GST invoice template, claim calculation steps, progress note template, and common pitfalls.

**Content List:**
- **Timesheet template** (weekly):
  - Header (company, employee, week, location)
  - Objectives and codes (O1-O5, CD-A/B/C)
  - Daily entries table (date, start-end, hours, objective, task summary, artefact/evidence)
  - Weekly summary and sign-offs
- **Quarterly claim evidence checklist**:
  - Required every claim (cost template, GST invoice, timesheets, payroll, M&C invoices)
  - Q1 specific (3 certificates, DPIA, IPP 12, HISO, DPA templates, MLflow/DVC, PM artefacts)
  - Q2-Q4 updates (transparency page, safety dashboard, change logs)
- **GST invoice template** (to Callaghan):
  - Supplier details, invoice number, description, amounts (excl. GST, GST 15%, total incl. GST)
- **Claim calculation steps** (with worked example for Q1)
- **Claim calendar** (Q1-Q4 submission deadlines and grant receipt dates)
- **Progress note template** (1-2 pages, reusable):
  - Summary, objectives update (O1-O5), capability development, metrics, spend summary, changes/approvals
- **File naming conventions** (cost, financial, compliance, PM artefacts, certificates)
- **Common pitfalls and how to avoid them** (6 pitfalls):
  1. Drawings instead of PAYE
  2. Missing evidence
  3. Claiming unlinked costs
  4. CapDev < 5%
  5. Overseas labour
  6. GST mismatches
- **Submission steps in Forge** (5 steps: prepare, log in, upload, enter details, submit)
- Ready-to-use artefacts (timesheet, evidence pack, progress note, GST invoice)
- **Quarterly claim summary table** (Q1-Q4 eligible, grant, key evidence)

**Key Templates:** Timesheet, GST invoice, progress note, quarterly checklist

---

## ?? Document Statistics

| Document | Lines | Category | Status |
|----------|-------|----------|--------|
| 1. project-master-index.md | ~450 | Governance | Active |
| 2. risk-and-change-management.md | ~650 | Governance | Active |
| 3. forge-application-narrative.md | 218 | Application | Draft |
| 4. cost-template.md | 206 | Financial | Draft |
| 5. cashflow-12-month.md | 398 | Financial | Draft |
| 6. capability-development-evidence-pack.md | 368 | CapDev | Draft |
| 7. dpia-draft.md | 560 | Compliance | Draft |
| 8. privacy-compliance-quick-reference.md | ~550 | Compliance | Draft |
| 9. safety-and-transparency-framework.md | ~650 | Safety | Draft |
| 10. claims-toolkit.md | 410 | Claims | Draft |
| **Total** | **~4,460 lines** | **10 docs** | |

---

## ?? Quick Navigation by Need

### Need Forge Submission?
? `forge-application-narrative.md` (copy-paste narratives)  
? `cost-template.md` (upload to financial section)  
? `cashflow-12-month.md` (upload to financial section)

### Need Compliance Review?
? `dpia-draft.md` (full DPIA for clinic sign-off)  
? `privacy-compliance-quick-reference.md` (quick IPP 12/HISO checks)  
? `safety-and-transparency-framework.md` (transparency page, SOPs)

### Need Quarterly Claim?
? `claims-toolkit.md` (timesheets, GST invoice, checklist)  
? `cost-template.md` (verify quarterly costs)  
? `capability-development-evidence-pack.md` (Q1 evidence)

### Need Safety Regression?
? `safety-and-transparency-framework.md` (monthly template)  
? `risk-and-change-management.md` (escalation procedures)

### Need to Track Changes?
? `risk-and-change-management.md` (change log for all docs)  
? `project-master-index.md` (version control conventions)

### Need Project Overview?
? `project-master-index.md` (start here!)

---

**END OF DOCUMENT SUMMARY**
