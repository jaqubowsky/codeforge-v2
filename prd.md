- landing ze wszystkimi zescrapowanymi job boardami,
- next js + serwerowe akcje,
- postgresql + supabase,
- mikroserwis scraper w nodejs + google cloud jako lambdy po autoskalowalność

# Product Requirements Document: Job Application Tracker

### Version: 1.2 (AI-First)

### Status: Revised

## 1. Introduction & Goal

**This section summarizes the product's purpose, aligning the MVP's problem statement with strategic business and user goals.**

- **Problem:** Job seekers lack a centralized and efficient system to manage their job applications. Their application history becomes fragmented across various websites, and they waste significant time sifting through irrelevant job postings to find roles that truly match their skills and ambitions.
    
- **Value Proposition:** The product leverages an AI agent that learns a user's unique professional profile to automatically discover and aggregate highly relevant job opportunities. By moving beyond simple keyword matching to personalized discovery, it saves users time in the search phase and delivers a higher quality, curated list of potential roles.
    
- **Business & User Goals:**
    
    - **Business Goal:** Prove the core AI technology is viable by achieving a scraping accuracy rate of over 80% on the target job board within the initial launch phase.
        
    - **User Goal:** Reduce the time and mental effort required to find relevant job opportunities by delegating the initial search and filtering process to an intelligent AI agent.
        

## 2. User Personas & Scenarios

**This section expands the MVP's target audience into detailed personas and describes specific situations where they use the product.**

- **Persona 1: Jakub, the Efficient Developer**
    
    - **Description:** Jakub is a mid-level Fullstack Developer in his late 20s. He values efficiency and automation and dislikes repetitive, low-value tasks. His current job search is frustrating because keyword searches for "Senior Fullstack Developer" return hundreds of results, most of which are irrelevant to his specific tech stack (React, Node.js) or interests.
        
    - **Frustrations:**
        
        - Wastes hours sifting through job boards to find the 2-3 listings that are a perfect fit.
            
        - Hates keyword-based search that doesn't understand the nuance of his skills or career goals.
            
        - Loses track of the few good opportunities he finds amidst all the noise.
            
    - Scenario:
        
        It's Sunday evening, September 14, 2025. Jakub decides to look for jobs on his preferred Polish portal, justjoin.it. He sighs, knowing he'll have to scroll through pages of listings that mention "Java" or require management experience, which he wants to avoid.
        
        With the **Job Application Tracker**, Jakub's experience is different. During a one-time onboarding, he provides his key skills, years of experience, and a brief description of his ideal next role. Now, he just opens the app and clicks "Find Jobs." The AI agent scans `justjoin.it` in the background. A few minutes later, his dashboard populates with a short, highly-relevant list of 5-7 jobs that match his profile. He spends a few minutes reviewing these curated opportunities, marking them as `Saved` or `Archived`. The entire discovery process is now fast, efficient, and personalized.
        

## 3. Features & User Stories

**This section breaks down the MVP's high-level features into detailed user stories with clear acceptance criteria.**

- **Feature 1: Onboarding & AI Profile Creation**
    
    - **User Story 1.1:** As Jakub, I want to create a detailed professional profile during a guided onboarding process, so that I can provide the AI agent with the necessary data to find relevant jobs for me.
        
        - **Acceptance Criteria:**
            
            - Given I am a new user, I must be presented with a mandatory, multi-step onboarding flow.
                
            - I must be able to input my Job Title, Years of Experience, and key technical skills (as tags)  or upload resume to fill everything up
                
            - I must be able to write a short text description of my ideal role or career goals.
                
            - The system must save this profile information and associate it with my account.
                
- **Feature 2: AI-Powered Job Discovery**
    
    - **User Story 2.1:** As Jakub, I want to manually trigger an AI scan of `justjoin.it`, so that the system uses my profile to automatically find and display a list of relevant job opportunities.
        
        - **Acceptance Criteria:**
            
            - Given I am on the main dashboard, I must see a prominent "Find Jobs" button.
                
            - When I click the button, I must receive immediate visual feedback that the AI agent is running.
                
            - The AI agent must scrape `justjoin.it`, analyze the listings against my profile, and populate the dashboard with the results.
                
            - Each job in the list must display the Job Title, Company Name, Location, Salary Range, Original Job Link
                
- **Feature 3: Simplified Job Management & AI Feedback**
    
    - **User Story 3.1:** As Jakub, I want to review the jobs found by the AI and mark them as `Saved` or `Archived`, so I can manage my list and implicitly provide feedback to improve the AI model.
        
        - **Acceptance Criteria:**
            
            - Given I am viewing the list of AI-found jobs, each job card must have two clear action buttons: `Save` and `Archive`.
                
            - When I click `Save`, the job is moved to a "Saved" filter view.
                
            - When I click `Archive`, the job is removed from my main view.
                

## 4. Design & UX Requirements

**This section specifies the visual and interaction design guidelines for the product.**

- **Core UX Principles:**
    
    - **Intelligent:** The product must feel personalized and smart. The results should clearly reflect the user's profile.
        
    - **Simple:** The interface must be minimalist and focused on the core task of reviewing AI-generated job lists.
        
    - **Fast:** User actions and AI scan initiation must feel responsive.
        
- **Navigation:** A minimal static sidebar will contain:
    
    - `Inbox`: The main and only view for displaying and managing AI-found jobs.
        
    - `My Profile`: A page where the user can view and edit their profile data.
        
- **Onboarding:** The onboarding flow is a critical, multi-step modal experience that must be polished and intuitive to ensure high-quality data input from the user.
    

## 5. Technical Specifications & Constraints

**This section outlines the non-functional requirements and technical guardrails for the engineering team.**

- **Performance Requirements:**
    
    - **AI Agent Runtime:** A manually triggered AI scan should complete and populate results in under 90 seconds.
        
- **Security Requirements:**
    
    - User sign-in will be handled exclusively through Google OAuth.
        
    - The application must enforce HTTPS and implement standard protections against common web vulnerabilities.
        
- **Constraints & Dependencies:**
    
    - **Scraper Scope:** The V1 AI agent will **exclusively** target one Polish job portal: `justjoin.it`.
        
    - **Deployment:** The application will be deployed on the Vercel platform.
        

## 6. Success Metrics & Analytics

**This section refines the MVP's learning goals into specific, measurable KPIs for product performance.**

- **Key Performance Indicator 1:** AI Scraping Accuracy
    
    - **Measurement:** Calculated as the percentage of jobs a user marks as `Saved` out of the total number of jobs presented by the AI. This is the primary measure of the AI's relevance.
        
    - **Target:** Achieve an average accuracy of >80% across all users.
        
- **Key Performance Indicator 2:** AI Scraping Recall
    
    - **Measurement:** Manually measured during internal testing. Calculated as the percentage of truly relevant jobs on the target site that the AI successfully identifies and presents.
        
    - **Target:** Achieve a recall rate of >90%.
        

## 7. Launch & Go-to-Market Plan

**This section outlines the strategy for releasing the product to users.**

- **Rollout Strategy:**
    
    - **Phase 1 - Alpha Testing (Q4 2025):** The initial version will be used exclusively by the creator for personal use ("dogfooding"). The primary goal of this phase is to train, test, and validate the AI model's accuracy with real-world data.
        
    - **Phase 2 - Public Launch (Q1 2026):** Pending the successful achievement of the 80% accuracy KPI, the product will be launched publicly to attract early adopters.
        

## 8. Risks & Mitigation

This section provides a detailed look at potential risks and actionable plans to address them.

| Risk Category | Description | Likelihood (H/M/L) | Impact (H/M/L) | Mitigation Plan |

| :--- | :--- | :--- | :--- | :--- |

| Technical | The AI agent is inaccurate and provides irrelevant job listings, rendering the product useless. | H | H | Extensive offline model training and validation before Alpha. Implement a robust feedback mechanism (Save/Archive) to continuously retrain the model. |

| External | The target job board (justjoin.it) changes its site structure or implements anti-scraping tech. | M | H | Build the scraper with modularity in mind. Be prepared to quickly adapt the data extraction layer. Have a monitoring system to alert the team if the scraper fails. |

| Market | By focusing only on technology, we launch in 2026 and find out the market doesn't want the core product. | M | H | This risk is accepted as part of the AI-First strategy. The plan is to validate the technology first, then pivot quickly based on market feedback post-launch. |

## 9. Future Roadmap (Post-V1)

**This section provides a high-level view of what comes after this version, based on the MVP's long-term vision.**

- **Next Theme/Epic 1:** Expand AI Agent to Support More Job Boards
    
- **Next Theme/Epic 2:** Introduce Advanced Application Tracking (Add back statuses like `Applied`, `Interviewing`, `Offer`)
    
- **Next Theme/Epic 3:** Automated Scraper Scheduling
    
- **Next Theme/Epic 4:** AI-Generated Mock Interviews