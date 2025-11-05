# Rule System Test Scenarios

## Epic 1: New Project Creation - SaaS Startup (Ideation Stage)

### User Story
**As a** founder with a vague idea  
**I want** to start documenting my SaaS project  
**So that** I can track progress and get structured guidance

### Simulated User Input
```
User: "I have this idea for a SaaS product. I want to build something that helps teams collaborate better. Not sure where to start."
```

### Expected AI Behavior
1. **Character Check**: Read `ai-character.mdc` - should be brutally honest, challenge assumptions
2. **Context Check**: Understands system from `system-context.mdc`
3. **Intent Understanding**: Recognizes vague request, should clarify:
   - What specific collaboration problem?
   - Target market (B2B/B2C)?
   - Current stage (Ideation/Validation)?
   - Team size?
4. **Research**: May research collaboration tools market if needed
5. **Template Selection**: Should auto-select `Idea_Validation.md` template based on "idea" and "not sure where to start"
6. **Project Creation**:
   - Create project directory (kebab-case)
   - IMMEDIATELY create `PROJECT_SUMMARY.md` (CRITICAL)
   - Populate from template with YAML front matter
   - Create adaptive folder structure based on gathered info
   - Update `PROJECTS_OVERVIEW.md` dashboard

### Verification Points
- ✅ `PROJECT_SUMMARY.md` created immediately (mandatory)
- ✅ Template auto-selected (not asking user to pick)
- ✅ User prompted for missing details (stage, product type, etc.)
- ✅ AI challenges vague "collaborate better" - asks specific questions
- ✅ Dashboard updated with new project
- ✅ Folder structure adapts to SaaS type if identified

---

## Epic 2: Project Update - Stage Transition

### User Story
**As a** project owner  
**I want** to mark my project as moving from Validation to Build stage  
**So that** the system reflects current progress

### Simulated User Input
```
User: "Update my project status. We're starting to build now."
```

### Expected AI Behavior
1. **Character Check**: Direct, honest about what needs clarification
2. **Intent Understanding**: "my project" is ambiguous - should:
   - Check `PROJECTS_OVERVIEW.md` for active projects
   - Ask which project if multiple exist
   - If only one, infer but confirm
3. **PROJECT_SUMMARY.md Check**: Verify exists (CRITICAL)
4. **Update Process**:
   - Update `PROJECT_SUMMARY.md` metadata (`project_stage: Build`)
   - Update `last_updated` and bump `version`
   - Update `PROJECTS_OVERVIEW.md` dashboard:
     - Update Active Projects Index
     - Refresh AI-Generated Highlights (achievement: "Moved to Build stage")
     - Update Quick Status Summary counts
5. **Folder Structure**: May suggest adding product development folders if missing

### Verification Points
- ✅ Clarifies which project if ambiguous
- ✅ Updates both `PROJECT_SUMMARY.md` AND `PROJECTS_OVERVIEW.md`
- ✅ Dashboard highlights updated
- ✅ Date-stamped changes
- ✅ AI suggests folder structure evolution (Validation → Build)

---

## Epic 3: Missing PROJECT_SUMMARY.md - Error Recovery

### User Story
**As a** user with an existing project folder  
**I want** to work on the project  
**But** the `PROJECT_SUMMARY.md` file is missing

### Simulated User Input
```
User: "Can you help me update my project in the 'new_feature' folder?"
```

### Expected AI Behavior
1. **PROJECT_SUMMARY.md Validation** (CRITICAL CHECK):
   - Checks if file exists
   - If missing: STOP immediately
   - Creates `PROJECT_SUMMARY.md` using appropriate template
   - Prompts user for missing metadata
2. **Character**: Honest about the critical error, explains why it's required
3. **Template Selection**: Infers from existing folder structure or prompts user
4. **Recovery**: Creates file with YAML front matter, then proceeds with user request

### Verification Points
- ✅ Treats missing `PROJECT_SUMMARY.md` as CRITICAL error
- ✅ Creates file immediately before proceeding
- ✅ Uses template appropriately
- ✅ Updates dashboard if project was missing from overview

---

## Epic 4: Ambiguous Request - User Intent Understanding

### User Story
**As a** user who struggles with clear articulation  
**I want** help with fundraising  
**But** I'm not sure what I need

### Simulated User Input
```
User: "I need money. How do I get investors?"
```

### Expected AI Behavior
1. **Character**: Brutally honest - challenges vague approach, asks specific questions
2. **Intent Understanding**: Recognizes underlying need (fundraising) despite poor articulation
3. **Clarification**: Should ask:
   - How much funding needed?
   - What's it for?
   - What stage is project at?
   - Do you have a pitch deck?
   - What type of investors (angels/VCs)?
4. **Research**: May research fundraising best practices for user's stage
5. **Template Selection**: Should suggest `Fundraising_Preparation.md` template
6. **Guidance**: Provides structured approach, not just answers

### Verification Points
- ✅ AI challenges vague "need money" approach
- ✅ Asks specific clarifying questions
- ✅ Understands underlying intent (fundraising)
- ✅ Researches proactively if needed
- ✅ Provides template-driven guidance
- ✅ Doesn't assume user knows fundraising process

---

## Epic 5: Multiple Projects - Cross-Project Dependencies

### User Story
**As a** user managing multiple projects  
**I want** to see dependencies between projects  
**So that** I can prioritize and coordinate

### Simulated User Input
```
User: "I have Project A which needs data from Project B. Can you help me track this?"
```

### Expected AI Behavior
1. **Context Check**: Understands multi-project system
2. **Intent Understanding**: Recognizes dependency relationship
3. **Update Process**:
   - Updates both project `PROJECT_SUMMARY.md` files with dependency info
   - Updates `PROJECTS_OVERVIEW.md`:
     - Adds to "Cross-Project Themes & Dependencies" section
     - Updates AI-Generated Highlights
4. **Documentation**: Consolidates dependency info in appropriate `PROJECT_SUMMARY.md` files
5. **Dashboard**: Surfaces dependency in dashboard highlights

### Verification Points
- ✅ Recognizes cross-project relationship
- ✅ Updates multiple `PROJECT_SUMMARY.md` files
- ✅ Surfaces in dashboard highlights
- ✅ Consolidates info (not creating new docs)

---

## Epic 6: Template Selection - No Exact Match

### User Story
**As a** user with a unique project type  
**I want** project structure guidance  
**But** no template exactly matches

### Simulated User Input
```
User: "I'm building a hardware product with embedded software. Do you have a template?"
```

### Expected AI Behavior
1. **Template Selection**: Checks `Templates_Index.md`
2. **No Exact Match**: Recognizes hardware + software = unique combination
3. **Research**: Conducts research on hardware startup best practices
4. **Auto-Generation**: 
   - Creates new template combining elements from `Product_Development.md` and hardware-specific needs
   - Updates `Templates_Index.md` with new template
   - Saves template for future reuse
5. **Project Creation**: Uses new template for project setup

### Verification Points
- ✅ Checks templates index first
- ✅ Researches when no match found
- ✅ Auto-generates template (doesn't ask user)
- ✅ Updates templates index
- ✅ Combines elements from multiple templates appropriately

---

## Epic 7: Dashboard Update - Major Milestone

### User Story
**As a** project owner  
**I want** to mark a major milestone complete  
**So that** progress is visible across the system

### Simulated User Input
```
User: "We just completed our MVP! Can you update the project?"
```

### Expected AI Behavior
1. **PROJECT_SUMMARY.md Update**: 
   - Adds milestone completion with date tag
   - Updates metadata if needed
2. **Dashboard Update** (after major change):
   - Updates `PROJECTS_OVERVIEW.md` Active Projects Index
   - Adds to "Recent Achievements Across Projects" highlights
   - Updates Quick Status Summary if stage changed
   - Updates Project Details section
   - Updates `last_updated` in dashboard YAML
3. **Character**: Honest celebration but also challenges what's next
4. **Guidance**: Suggests next steps based on template milestones

### Verification Points
- ✅ Updates `PROJECT_SUMMARY.md` with milestone
- ✅ Updates dashboard highlights (achievements section)
- ✅ Updates dashboard metadata
- ✅ AI challenges "what's next" - not just celebratory
- ✅ Provides next-step guidance

---

## Epic 8: Unclear Intent - Multiple Interpretations

### User Story
**As a** user with poor articulation  
**I want** help with something  
**But** my request is vague and could mean multiple things

### Simulated User Input
```
User: "I need to do something with my project."
```

### Expected AI Behavior
1. **Character**: Brutally honest - calls out vague request, explains why clarity matters
2. **Intent Understanding**: Recognizes request is too vague
3. **Clarification Strategy**:
   - Lists possible interpretations
   - Asks specific questions based on context
   - Checks `PROJECTS_OVERVIEW.md` for project context
   - Uses `PROJECT_SUMMARY.md` to understand current state
4. **Research**: May research common next steps for project stage
5. **Guidance**: Provides structured options, not generic answers

### Verification Points
- ✅ AI challenges vague request directly
- ✅ Asks specific clarifying questions
- ✅ Uses existing project context to inform questions
- ✅ Provides structured options
- ✅ Doesn't guess or assume

---

## Epic 9: File Consolidation - Information Scatter

### User Story
**As a** user with scattered project information  
**I want** everything organized  
**So that** I can find what I need

### Simulated User Input
```
User: "I have notes about my project in multiple files. Can you organize them?"
```

### Expected AI Behavior
1. **Character**: Honest about information scatter being a problem
2. **Consolidation Principle**: 
   - Identifies scattered information
   - Consolidates into `PROJECT_SUMMARY.md` (single source of truth)
   - Uses date tags for organization
   - Doesn't create new documents
3. **PROJECT_SUMMARY.md Update**: 
   - Adds consolidated information with clear sections
   - Date-stamps additions
   - Maintains structure
4. **Cleanup**: May suggest removing redundant files (with confirmation)

### Verification Points
- ✅ Consolidates into `PROJECT_SUMMARY.md`
- ✅ Uses date tags for organization
- ✅ Doesn't create new documents
- ✅ Maintains single source of truth principle
- ✅ Confirms before deleting redundant files

---

## Epic 10: Character Consistency - Challenging Weak Reasoning

### User Story
**As a** user with weak reasoning  
**I want** validation  
**But** I need honest challenge instead

### Simulated User Input
```
User: "I think I should pivot my entire product because one customer said they didn't like a feature."
```

### Expected AI Behavior
1. **Character Check**: Reads `ai-character.mdc` - should be brutally honest
2. **Challenge Reasoning**: 
   - Directly challenges the weak reasoning
   - Explains why "one customer" is insufficient data
   - Points out the logical flaw
   - Provides strategic perspective
3. **Actionable Guidance**: 
   - Suggests proper validation approach
   - Provides prioritized plan
   - Doesn't validate bad thinking
4. **Research**: May research pivot decision frameworks

### Verification Points
- ✅ Challenges weak reasoning directly
- ✅ Doesn't validate or soften truth
- ✅ Provides strategic, actionable alternatives
- ✅ Explains opportunity cost of bad decision
- ✅ Maintains honest advisor character throughout

---

## Summary of Rule System Validation

### Key Behaviors Validated:
1. ✅ `PROJECT_SUMMARY.md` always required (CRITICAL)
2. ✅ Template auto-selection (not asking user)
3. ✅ User intent understanding (clarify, don't assume)
4. ✅ Character consistency (brutally honest, challenging)
5. ✅ Dashboard updates (after major changes)
6. ✅ Research proactivity (when information gaps exist)
7. ✅ Consolidation principle (single source of truth)
8. ✅ Adaptive folder creation (based on project type/stage)
9. ✅ Error handling (missing files, unclear intent)
10. ✅ Cross-project awareness (dependencies, themes)

### Areas Tested:
- ✅ New project creation
- ✅ Project updates
- ✅ Stage transitions
- ✅ Error recovery
- ✅ Ambiguous requests
- ✅ Template selection
- ✅ Dashboard maintenance
- ✅ Information consolidation
- ✅ Character consistency
- ✅ Cross-project dependencies

---

*Test Scenarios Created: [2024-01-15]*
