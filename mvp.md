# MVP Definition: Job Application Tracker (v1.2 - AI-First)

### 1. Problem Statement

The core problem for job seekers is the lack of a centralized and efficient system to manage their job applications. Their application history becomes fragmented across various websites, making it difficult to track statuses and search or filter their history. This MVP aims to solve this by creating an intelligent agent that learns a user's profile to find relevant jobs.

### 2. Target Audience & Early Adopters

The primary user is a tech-savvy professional, such as a software developer, who values automation and is willing to provide detailed profile information in exchange for a highly personalized job feed.

### 3. Value Proposition

The product’s unique value is its AI agent that reads a user's profile to automatically find and aggregate highly relevant job listings from the web into a single, unified dashboard. This moves beyond simple keyword scraping to a more personalized discovery engine.

### 4. Core Features (The "Minimum" in MVP)

- **Onboarding & User Profile:** A mandatory onboarding flow where the user must create a detailed profile, including their primary job title, key skills (e.g., "React, Node.js, AWS"), and a short bio or description of their ideal role. Or upload the resume to fill everything up.
    
- **AI-Powered Job Scraping:** The core of the product. An AI agent that uses the information from the User Profile to scrape a single target website (`justjoin.it`) for relevant jobs. The scraping process is manually triggered by the user.
    
- **Unified `Inbox` Dashboard:** A single, simple view where all jobs found by the AI are displayed. There will not be a separate `My Pipeline` view for the MVP.
    
- **Simplified Job Tagging:** A minimal system to manage jobs. Users can assign one of two statuses: `Saved` or `Archived`. There will be no other statuses for the MVP.
    

### 5. "Measure" - Key Metrics for Success

Success for this technically-focused MVP is not based on user retention but on the AI's performance.

- **Primary KPI: AI Scraping Accuracy:** The percentage of jobs in the `Inbox` that the user marks as relevant (i.e., tags as `Saved`). **Success Target: >80% accuracy.**
    
- **Secondary KPI: AI Scraping Recall:** The percentage of relevant jobs on the target site that the AI successfully identifies. Measured manually during testing. **Success Target: >90% recall.**
    

### 6. "Learn" - Feedback and Iteration Plan

The feedback loop will focus on improving the AI model.

- **In-App Feedback:** Users will have a simple way to mark a job as "Not Relevant," which will provide data for retraining the AI model.
    

### 7. Assumptions & Risks

**Assumptions:**

- **Technical Assumption:** We can build an AI model that achieves >80% accuracy in parsing and matching jobs from `justjoin.it` within the projected timeline.
    
- **User Assumption:** Users are willing to provide detailed profile data in the onboarding process.
    

**Risks:**

- **Critical Technical Risk (High):** The AI agent may fail to achieve sufficient accuracy. If the signal-to-noise ratio is too low, the product will be unusable and the project will fail. This is the primary risk.
    
- **External Risk (High):** The target job board (`justjoin.it`) may change its site structure frequently or implement advanced anti-scraping measures, breaking our AI model.
    
- **Delayed Market Validation Risk (High):** By focusing entirely on technology, we will not know if the core value proposition of a centralized tracker is compelling to a wider market until well into 2026.
    

### 8. Future Vision (Post-MVP)

If the AI technology is proven successful, the roadmap will focus on expanding its capabilities and adding back user-facing features, evolving into a career co-pilot.

- Expand AI support to more job boards.
    
- Introduce advanced status tagging (`Applied`, `Interviewing`, `Offer`).
    
- Build automated scheduling and notifications.
    
- Add AI-Powered Job Summaries and Skill Gap Analysis.