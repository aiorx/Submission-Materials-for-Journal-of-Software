import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import { useTheme } from '../ThemeContext';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Templates = () => {
  const navigate = useNavigate();
  const [isSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { darkMode, currentTheme } = useTheme();

  const handleTemplateClick = (template) => {
    // Create a new standalone note with the template content
    fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ name: template.label, content: template.content }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          // Navigate to the newly created note's edit page
          navigate(`/notes/${data.id}`);
        } else {
          console.error('Error creating note:', data.error);
          alert('Failed to create note. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error creating note:', error);
        alert('An unexpected error occurred while creating the note.');
      });
  };

  const filteredTemplates = templates.filter(template =>
    template.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header islanding={false} />

      <div className="flex flex-1">
        <SideBar isOpen={isSidebarOpen} />

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className={`${currentTheme.text}`}>Templates</h1>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className={`input ${darkMode ? "bg-gray-800 text-white" : ""}`}
            />
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template, index) => (
              <li key={index}>
                <button
                  onClick={() => handleTemplateClick(template)}
                  className={`template-btn hover:bg-opacity-50 ${currentTheme.primary}`}
                >
                  {template.label}
                </button>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
};

/**
 * Templates Aided using common development resources
 */
const templates = [
  {
    label: 'Meeting Minutes',
    content: `# Meeting Minutes
  
  **Date:** YYYY-MM-DD  
  **Time:** HH:MM AM/PM  
  **Location:** [Location]  
  **Facilitator:** [Name]  
  **Note Taker:** [Name]  
  **Attendees:**  
  - [Name 1]
  - [Name 2]
  - [Name 3]
  
  ---
  
  ## Agenda
  1. [Agenda Item 1]
  2. [Agenda Item 2]
  3. [Agenda Item 3]
  
  ---
  
  ## Discussions
  
  ### 1. [Agenda Item 1]
  - **Discussion Points:**
    - Point 1
    - Point 2
  - **Decisions Made:**
    - Decision 1
    - Decision 2
  
  ### 2. [Agenda Item 2]
  - **Discussion Points:**
    - Point 1
    - Point 2
  - **Decisions Made:**
    - Decision 1
    - Decision 2
  
  ### 3. [Agenda Item 3]
  - **Discussion Points:**
    - Point 1
    - Point 2
  - **Decisions Made:**
    - Decision 1
    - Decision 2
  
  ---
  
  ## Action Items
  
  | Task | Assigned To | Due Date | Status |
  |------|-------------|----------|--------|
  | [Task Description] | [Name] | YYYY-MM-DD | [Status] |
  | [Task Description] | [Name] | YYYY-MM-DD | [Status] |
  
  ---
  
  ## Next Meeting
  
  **Date:** YYYY-MM-DD  
  **Time:** HH:MM AM/PM  
  **Location:** [Location]  
  **Proposed Agenda Items:**
  1. [Agenda Item]
  2. [Agenda Item]
  `
  },
  {
    label: 'Project Planner',
    content: `# Project Planner
  
  **Project Name:** [Project Title]  
  **Start Date:** YYYY-MM-DD  
  **End Date:** YYYY-MM-DD  
  **Project Manager:** [Name]  
  **Team Members:**  
  - [Name 1]
  - [Name 2]
  - [Name 3]
  
  ---
  
  ## Project Overview
  
  [Brief description of the project, its goals, and objectives.]
  
  ---
  
  ## Milestones
  
  | Milestone | Description | Due Date | Status |
  |-----------|-------------|----------|--------|
  | [Milestone 1] | [Description] | YYYY-MM-DD | [Status] |
  | [Milestone 2] | [Description] | YYYY-MM-DD | [Status] |
  | [Milestone 3] | [Description] | YYYY-MM-DD | [Status] |
  
  ---
  
  ## Tasks
  
  ### To Do
  - [ ] Task 1
  - [ ] Task 2
  - [ ] Task 3
  
  ### In Progress
  - [ ] Task 4
  - [ ] Task 5
  
  ### Completed
  - [x] Task 6
  - [x] Task 7
  
  ---
  
  ## Resources
  
  - **Documents:** [Link to document]
  - **Tools:** [List of tools]
  - **References:** [Links or references]
  
  ---
  
  ## Risks & Mitigations
  
  | Risk | Impact | Likelihood | Mitigation Strategy |
  |------|--------|------------|---------------------|
  | [Risk 1] | [High/Medium/Low] | [High/Medium/Low] | [Strategy] |
  | [Risk 2] | [High/Medium/Low] | [High/Medium/Low] | [Strategy] |
  `
  },
  {
    label: 'To-Do List',
    content: `# To-Do List
  
  **Date:** YYYY-MM-DD
  
  ---
  
  ## Priority Tasks
  
  1. [ ] **High Priority:** [Task Description]
  2. [ ] **High Priority:** [Task Description]
  
  ---
  
  ## Tasks
  
  ### Today
  - [ ] Task 1
  - [ ] Task 2
  
  ### This Week
  - [ ] Task 3
  - [ ] Task 4
  
  ### Later
  - [ ] Task 5
  - [ ] Task 6
  
  ---
  
  ## Notes
  
  [Additional notes or reminders.]
  `
  },
  {
    label: 'Weekly Agenda',
    content: `# Weekly Agenda
  
  **Week:** YYYY-MM-DD to YYYY-MM-DD
  
  ---
  
  ## Monday
  - [Agenda Item 1]
  - [Agenda Item 2]
  
  ## Tuesday
  - [Agenda Item 1]
  - [Agenda Item 2]
  
  ## Wednesday
  - [Agenda Item 1]
  - [Agenda Item 2]
  
  ## Thursday
  - [Agenda Item 1]
  - [Agenda Item 2]
  
  ## Friday
  - [Agenda Item 1]
  - [Agenda Item 2]
  
  ## Notes
  
  [Space for additional notes.]
  `
  },
  {
    label: 'Daily Journal',
    content: `# Daily Journal
  
  **Date:** YYYY-MM-DD
  
  ---
  
  ## Morning
  
  - [ ] **Goals for Today:**
    - Goal 1
    - Goal 2
  
  ## Afternoon
  
  - **Activities:**
    - Activity 1
    - Activity 2
  
  ## Evening
  
  - **Reflections:**
    - What went well?
    - What could be improved?
  
  ## Notes
  
  [Additional thoughts or notes.]
  `
  },
  {
    label: 'Knowledge Base Article',
    content: `# [Article Title]
  
  **Author:** [Name]  
  **Date:** YYYY-MM-DD  
  **Tags:** [Tag1], [Tag2], [Tag3]
  
  ---
  
  ## Introduction
  
  [Brief introduction to the topic.]
  
  ---
  
  ## Table of Contents
  
  1. [Section 1](#section-1)
  2. [Section 2](#section-2)
  3. [Section 3](#section-3)
  
  ---
  
  ## Section 1
  
  [Content for section 1.]
  
  ### Subsection 1.1
  
  [Content for subsection 1.1.]
  
  ## Section 2
  
  [Content for section 2.]
  
  ### Subsection 2.1
  
  [Content for subsection 2.1.]
  
  ## Section 3
  
  [Content for section 3.]
  
  ### Subsection 3.1
  
  [Content for subsection 3.1.]
  
  ---
  
  ## References
  
  - [Reference 1](#)
  - [Reference 2](#)
  `
  },
  {
    label: 'Bug Report',
    content: `# Bug Report
  
  **Reported By:** [Name]  
  **Date:** YYYY-MM-DD  
  **Project:** [Project Name]  
  **Version:** [Version Number]
  
  ---
  
  ## Description
  
  [A clear and concise description of the bug.]
  
  ---
  
  ## Steps to Reproduce
  
  1. Step 1
  2. Step 2
  3. Step 3
  
  ---
  
  ## Expected Behavior
  
  [Describe what you expected to happen.]
  
  ---
  
  ## Actual Behavior
  
  [Describe what actually happened.]
  
  ---
  
  ## Screenshots
  
  [Attach screenshots if applicable.]
  
  ---
  
  ## Environment
  
  - **OS:** [Operating System]
  - **Browser:** [Browser and version]
  - **Device:** [Device type]
  
  ---
  
  ## Additional Information
  
  [Any other relevant information.]
  `
  },
  {
    label: 'Feature Request',
    content: `# Feature Request
  
  **Requested By:** [Name]  
  **Date:** YYYY-MM-DD  
  **Project:** [Project Name]
  
  ---
  
  ## Title
  
  [Brief title of the feature request.]
  
  ---
  
  ## Description
  
  [A detailed description of the feature.]
  
  ---
  
  ## Benefits
  
  - Benefit 1
  - Benefit 2
  - Benefit 3
  
  ---
  
  ## Use Cases
  
  1. [Use Case 1]
  2. [Use Case 2]
  3. [Use Case 3]
  
  ---
  
  ## Priority
  
  - [ ] Low
  - [ ] Medium
  - [ ] High
  
  ---
  
  ## Additional Notes
  
  [Any additional information.]
  `
  },
  {
    label: 'Design Document',
    content: `# Design Document
  
  **Project Name:** [Project Title]  
  **Date:** YYYY-MM-DD  
  **Author:** [Name]
  
  ---
  
  ## Table of Contents
  
  1. [Introduction](#introduction)
  2. [Objectives](#objectives)
  3. [System Architecture](#system-architecture)
  4. [Components](#components)
  5. [User Interface](#user-interface)
  6. [Data Flow](#data-flow)
  7. [Security](#security)
  8. [Testing](#testing)
  9. [Deployment](#deployment)
  10. [Conclusion](#conclusion)
  
  ---
  
  ## Introduction
  
  [Overview of the project and its purpose.]
  
  ---
  
  ## Objectives
  
  - Objective 1
  - Objective 2
  - Objective 3
  
  ---
  
  ## System Architecture
  
  [Description and diagrams of the system architecture.]
  
  ---
  
  ## Components
  
  ### Component 1
  
  [Details about component 1.]
  
  ### Component 2
  
  [Details about component 2.]
  
  ---
  
  ## User Interface
  
  [Mockups or descriptions of the UI.]
  
  ---
  
  ## Data Flow
  
  [Description of how data moves through the system.]
  
  ---
  
  ## Security
  
  [Security measures and considerations.]
  
  ---
  
  ## Testing
  
  [Testing strategies and plans.]
  
  ---
  
  ## Deployment
  
  [Deployment process and requirements.]
  
  ---
  
  ## Conclusion
  
  [Final thoughts and next steps.]
  `
  },
  {
    label: 'Study Notes',
    content: `# Study Notes
  
  **Subject:** [Subject Name]  
  **Topic:** [Topic Title]  
  **Date:** YYYY-MM-DD  
  **Author:** [Name]
  
  ---
  
  ## Overview
  
  [A brief summary of the topic.]
  
  ---
  
  ## Key Concepts
  
  - **Concept 1:** [Description]
  - **Concept 2:** [Description]
  - **Concept 3:** [Description]
  
  ---
  
  ## Detailed Notes
  
  ### Subtopic 1
  
  [Detailed information about subtopic 1.]
  
  ### Subtopic 2
  
  [Detailed information about subtopic 2.]
  
  ### Subtopic 3
  
  [Detailed information about subtopic 3.]
  
  ---
  
  ## Diagrams
  
  ![Diagram Description](image-link)
  
  ---
  
  ## Summary
  
  [A concise summary of the study notes.]
  
  ---
  
  ## References
  
  - [Reference 1](#)
  - [Reference 2](#)
  `
  },
  {
    label: 'Event Planning',
    content: `# Event Planning
  
  **Event Name:** [Event Title]  
  **Date:** YYYY-MM-DD  
  **Location:** [Location]  
  **Organizer:** [Name]
  
  ---
  
  ## Event Overview
  
  [A brief description of the event.]
  
  ---
  
  ## Schedule
  
  | Time | Activity | Responsible |
  |------|----------|-------------|
  | HH:MM | Activity 1 | [Name] |
  | HH:MM | Activity 2 | [Name] |
  | HH:MM | Activity 3 | [Name] |
  
  ---
  
  ## Tasks
  
  ### Pre-Event
  
  - [ ] Task 1
  - [ ] Task 2
  
  ### During Event
  
  - [ ] Task 3
  - [ ] Task 4
  
  ### Post-Event
  
  - [ ] Task 5
  - [ ] Task 6
  
  ---
  
  ## Budget
  
  | Item | Estimated Cost | Actual Cost | Notes |
  |------|----------------|-------------|-------|
  | [Item 1] | $0.00 | $0.00 | [Notes] |
  | [Item 2] | $0.00 | $0.00 | [Notes] |
  
  ---
  
  ## Contacts
  
  - **Vendor 1:** [Name, Contact Info]
  - **Vendor 2:** [Name, Contact Info]
  
  ---
  
  ## Notes
  
  [Any additional information.]
  `
  },
  {
    label: 'Blog Post',
    content: `# [Blog Post Title]
  
  **Author:** [Name]  
  **Date:** YYYY-MM-DD  
  **Category:** [Category]  
  **Tags:** [Tag1], [Tag2], [Tag3]
  
  ---
  
  ## Introduction
  
  [Hook to grab the reader's attention.]
  
  ---
  
  ## Section 1: [Subtitle]
  
  [Content for section 1.]
  
  ---
  
  ## Section 2: [Subtitle]
  
  [Content for section 2.]
  
  ---
  
  ## Section 3: [Subtitle]
  
  [Content for section 3.]
  
  ---
  
  ## Conclusion
  
  [Wrap-up and final thoughts.]
  
  ---
  
  ## References
  
  - [Reference 1](#)
  - [Reference 2](#)
  
  ---
  
  ## Call to Action
  
  [Encourage readers to take action, comment, share, etc.]
  `
  },
  {
    label: 'Research Paper',
    content: `# [Research Paper Title]
  
  **Authors:** [Name 1], [Name 2]  
  **Date:** YYYY-MM-DD  
  **Affiliation:** [Institution or Organization]
  
  ---
  
  ## Abstract
  
  [A brief summary of the research.]
  
  ---
  
  ## Introduction
  
  [Background information and objectives of the research.]
  
  ---
  
  ## Literature Review
  
  [Summary of existing research related to the topic.]
  
  ---
  
  ## Methodology
  
  [Description of the research methods used.]
  
  ---
  
  ## Results
  
  [Presentation of the research findings.]
  
  ---
  
  ## Discussion
  
  [Interpretation of the results and their implications.]
  
  ---
  
  ## Conclusion
  
  [Summary of findings and suggestions for future research.]
  
  ---
  
  ## References
  
  - [Reference 1](#)
  - [Reference 2](#)
  
  ---
  
  ## Appendices
  
  - **Appendix A:** [Description]
  - **Appendix B:** [Description]
  `
  },
  {
    label: 'Code Documentation',
    content: `# [Project Name] Documentation
  
  **Version:** [Version Number]  
  **Author:** [Name]  
  **Date:** YYYY-MM-DD
  
  ---
  
  ## Table of Contents
  
  1. [Introduction](#introduction)
  2. [Installation](#installation)
  3. [Usage](#usage)
  4. [API Reference](#api-reference)
  5. [Contributing](#contributing)
  6. [License](#license)
  
  ---
  
  ## Introduction
  
  [Overview of the project and its purpose.]
  
  ---
  
  ## Installation
  
  ### Prerequisites
  
  - [Requirement 1]
  - [Requirement 2]
  
  ### Steps
  
  1. Step 1
  2. Step 2
  3. Step 3
  
  ---
  
  ## Usage
  
  [Instructions and examples on how to use the project.]
  
  \`\`\`bash
  # Example command
  command --option
  \`\`\`
  
  ---
  
  ## API Reference
  
  ### Endpoint 1: \`/api/endpoint1\`
  
  - **Method:** GET
  - **Description:** [Description]
  - **Parameters:**
    - \`param1\` (type): [Description]
    - \`param2\` (type): [Description]
  - **Response:**
  \`\`\`json
  {
    "key": "value"
  }
  \`\`\`
  
  ### Endpoint 2: \`/api/endpoint2\`
  
  - **Method:** POST
  - **Description:** [Description]
  - **Parameters:**
    - \`param1\` (type): [Description]
    - \`param2\` (type): [Description]
  - **Response:**
  \`\`\`json
  {
    "key": "value"
  }
  \`\`\`
  
  ---
  
  ## Contributing
  
  [Guidelines for contributing to the project.]
  
  ---
  
  ## License
  
  [License information.]
  `
  },
  {
    label: 'Book Summary',
    content: `# [Book Title] by [Author]
  
  **Date:** YYYY-MM-DD  
  **Genre:** [Genre]  
  **Rating:** ⭐⭐⭐⭐☆
  
  ---
  
  ## Summary
  
  [A brief overview of the book's plot or main ideas.]
  
  ---
  
  ## Key Themes
  
  - **Theme 1:** [Description]
  - **Theme 2:** [Description]
  - **Theme 3:** [Description]
  
  ---
  
  ## Characters
  
  ### Main Characters
  
  - **Character 1:** [Description]
  - **Character 2:** [Description]
  
  ### Supporting Characters
  
  - **Character 3:** [Description]
  - **Character 4:** [Description]
  
  ---
  
  ## Important Quotes
  
  - “Quote 1”
  - “Quote 2”
  - “Quote 3”
  
  ---
  
  ## Personal Reflections
  
  [Your thoughts and insights about the book.]
  
  ---
  
  ## Takeaways
  
  - Takeaway 1
  - Takeaway 2
  - Takeaway 3
  `
  },
  {
    label: 'Travel Itinerary',
    content: `# Travel Itinerary
  
  **Traveler:** [Name]  
  **Destination:** [City/Country]  
  **Dates:** YYYY-MM-DD to YYYY-MM-DD
  
  ---
  
  ## Overview
  
  [A brief description of the trip.]
  
  ---
  
  ## Day 1: YYYY-MM-DD
  
  ### Morning
  - Activity 1: [Details]
  - Activity 2: [Details]
  
  ### Afternoon
  - Activity 3: [Details]
  - Activity 4: [Details]
  
  ### Evening
  - Activity 5: [Details]
  - Dinner at [Restaurant]
  
  ---
  
  ## Day 2: YYYY-MM-DD
  
  ### Morning
  - Activity 1: [Details]
  - Activity 2: [Details]
  
  ### Afternoon
  - Activity 3: [Details]
  - Activity 4: [Details]
  
  ### Evening
  - Activity 5: [Details]
  - Dinner at [Restaurant]
  
  ---
  
  ## Day 3: YYYY-MM-DD
  
  ### Morning
  - Activity 1: [Details]
  - Activity 2: [Details]
  
  ### Afternoon
  - Activity 3: [Details]
  - Activity 4: [Details]
  
  ### Evening
  - Activity 5: [Details]
  - Dinner at [Restaurant]
  
  ---
  
  ## Accommodations
  
  - **Hotel Name:** [Name]
  - **Address:** [Address]
  - **Contact:** [Contact Information]
  - **Booking Details:** [Confirmation Number]
  
  ---
  
  ## Transportation
  
  - **Flight Details:**
    - **Airline:** [Airline]
    - **Flight Number:** [Number]
    - **Departure:** [Time, Airport]
    - **Arrival:** [Time, Airport]
  
  - **Local Transportation:**
    - [Details]
  
  ---
  
  ## Budget
  
  | Category | Estimated Cost | Actual Cost | Notes |
  |----------|----------------|-------------|-------|
  | Flights | $0.00 | $0.00 | [Notes] |
  | Accommodation | $0.00 | $0.00 | [Notes] |
  | Meals | $0.00 | $0.00 | [Notes] |
  | Activities | $0.00 | $0.00 | [Notes] |
  | Transportation | $0.00 | $0.00 | [Notes] |
  
  ---
  
  ## Notes
  
  [Any additional information or reminders.]
  `
  },
  {
    label: 'Recipe',
    content: `# [Recipe Name]
  
  **Author:** [Name]  
  **Date:** YYYY-MM-DD  
  **Servings:** [Number]  
  **Preparation Time:** [Time]  
  **Cooking Time:** [Time]
  
  ---
  
  ## Ingredients
  
  - [Quantity] [Ingredient 1]
  - [Quantity] [Ingredient 2]
  - [Quantity] [Ingredient 3]
  - [Quantity] [Ingredient 4]
  
  ---
  
  ## Instructions
  
  1. **Step 1:** [Description]
  2. **Step 2:** [Description]
  3. **Step 3:** [Description]
  4. **Step 4:** [Description]
  5. **Step 5:** [Description]
  
  ---
  
  ## Notes
  
  - [Tip or variation]
  - [Storage instructions]
  - [Serving suggestions]
  
  ---
  
  ## Nutrition Information
  
  - **Calories:** [Number] kcal
  - **Protein:** [Amount] g
  - **Carbohydrates:** [Amount] g
  - **Fats:** [Amount] g
  `
  },
  {
    label: 'Goal Setting',
    content: `# Goal Setting
  
  **Date:** YYYY-MM-DD  
  **Name:** [Name]
  
  ---
  
  ## Vision Statement
  
  [A clear and inspiring vision statement.]
  
  ---
  
  ## Long-Term Goals (1-5 years)
  
  1. **Goal 1:** [Description]
     - **Why:** [Reason]
     - **Steps to Achieve:**
       - Step 1
       - Step 2
  
  2. **Goal 2:** [Description]
     - **Why:** [Reason]
     - **Steps to Achieve:**
       - Step 1
       - Step 2
  
  ---
  
  ## Short-Term Goals (Next 3 months)
  
  1. **Goal 1:** [Description]
     - **Why:** [Reason]
     - **Steps to Achieve:**
       - Step 1
       - Step 2
  
  2. **Goal 2:** [Description]
     - **Why:** [Reason]
     - **Steps to Achieve:**
       - Step 1
       - Step 2
  
  ---
  
  ## Action Plan
  
  | Goal | Action Steps | Deadline | Status |
  |------|--------------|----------|--------|
  | [Goal 1] | [Step 1, Step 2] | YYYY-MM-DD | [Status] |
  | [Goal 2] | [Step 1, Step 2] | YYYY-MM-DD | [Status] |
  
  ---
  
  ## Progress Tracking
  
  - **Weekly Check-In:**
    - [Date]: [Progress Update]
    - [Date]: [Progress Update]
  
  - **Monthly Review:**
    - [Date]: [Review Notes]
  `
  },
  {
    label: 'SWOT Analysis',
    content: `# SWOT Analysis
  
  **Project/Business Name:** [Name]  
  **Date:** YYYY-MM-DD
  
  ---
  
  ## Strengths
  
  - Strength 1
  - Strength 2
  - Strength 3
  
  ---
  
  ## Weaknesses
  
  - Weakness 1
  - Weakness 2
  - Weakness 3
  
  ---
  
  ## Opportunities
  
  - Opportunity 1
  - Opportunity 2
  - Opportunity 3
  
  ---
  
  ## Threats
  
  - Threat 1
  - Threat 2
  - Threat 3
  
  ---
  
  ## Action Items
  
  ### Leverage Strengths
  
  - [Action 1]
  - [Action 2]
  
  ### Address Weaknesses
  
  - [Action 1]
  - [Action 2]
  
  ### Capitalize on Opportunities
  
  - [Action 1]
  - [Action 2]
  
  ### Mitigate Threats
  
  - [Action 1]
  - [Action 2]
  `
  },
  {
    label: 'Interview Notes',
    content: `# Interview Notes
  
  **Candidate Name:** [Name]  
  **Position:** [Job Title]  
  **Date:** YYYY-MM-DD  
  **Interviewer:** [Name]
  
  ---
  
  ## Background Information
  
  [Brief overview of the candidate’s background.]
  
  ---
  
  ## Questions & Responses
  
  ### 1. [Question 1]
  **Response:**
  [Candidate’s answer.]
  
  ### 2. [Question 2]
  **Response:**
  [Candidate’s answer.]
  
  ### 3. [Question 3]
  **Response:**
  [Candidate’s answer.]
  
  ### 4. [Question 4]
  **Response:**
  [Candidate’s answer.]
  
  ### 5. [Question 5]
  **Response:**
  [Candidate’s answer.]
  
  ---
  
  ## Skills Assessment
  
  - **Technical Skills:** [Assessment]
  - **Soft Skills:** [Assessment]
  - **Experience:** [Assessment]
  - **Cultural Fit:** [Assessment]
  
  ---
  
  ## Strengths
  
  - Strength 1
  - Strength 2
  - Strength 3
  
  ---
  
  ## Areas for Improvement
  
  - Area 1
  - Area 2
  - Area 3
  
  ---
  
  ## Recommendation
  
  [Recommended Hire/Not Recommended/Further Review]
  `
  },
];

export default Templates;
