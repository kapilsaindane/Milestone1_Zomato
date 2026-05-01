# Problem Statement: AI-Powered Restaurant Recommendation System (Zomato Use Case)

Build an intelligent restaurant recommendation application inspired by Zomato. The system should combine structured restaurant data with a Large Language Model (LLM) to generate personalized, user-friendly recommendations based on individual preferences.

## Objective

Design and implement an application that:

- Accepts user preferences such as location, budget, cuisine, and minimum rating
- Uses a real-world restaurant dataset
- Leverages an LLM to generate personalized, human-like recommendations
- Presents clear, useful, and explainable results to the user

## System Workflow

### 1) Data Ingestion

- Load and preprocess the Zomato dataset from Hugging Face: [ManikaSaini/zomato-restaurant-recommendation](https://huggingface.co/datasets/ManikaSaini/zomato-restaurant-recommendation)
- Extract relevant fields such as restaurant name, location, cuisine, cost, and rating

### 2) User Input

Collect user preferences, including:

- Location (for example: Delhi, Bangalore)
- Budget (low, medium, high)
- Cuisine (for example: Italian, Chinese)
- Minimum rating
- Additional preferences (for example: family-friendly, quick service)

### 3) Integration Layer

- Filter and prepare restaurant records based on user inputs
- Convert structured results into an LLM-ready prompt
- Design prompts that help the LLM reason about relevance and ranking

### 4) Recommendation Engine

Use the LLM to:

- Rank restaurants based on user preferences
- Explain why each recommendation is a good match
- Optionally provide a concise summary of top choices

### 5) Output Display

Present top recommendations in a user-friendly format with:

- Restaurant name
- Cuisine
- Rating
- Estimated cost
- AI-generated explanation

## Phase-Wise Architecture

### Phase 1: Data Foundation

**Goal:** Build a clean and reliable restaurant knowledge base.

**Components:**
- Dataset loader (Hugging Face source)
- Data cleaning and preprocessing module
- Feature extraction module (name, location, cuisine, cost, rating, metadata)
- Local storage (CSV/JSON/DB)

**Input:** Raw Zomato dataset  
**Output:** Structured and cleaned restaurant dataset

### Phase 2: Preference Capture Layer

**Goal:** Collect and validate user requirements.

**Components:**
- User interface form/API endpoint
- Input validation and normalization module
- Preference profile builder

**Input:** User preferences (location, budget, cuisine, minimum rating, optional constraints)  
**Output:** Standardized user preference object

### Phase 3: Candidate Retrieval Layer

**Goal:** Narrow down restaurants before sending context to the LLM.

**Components:**
- Rule-based filtering engine
- Basic ranking/scoring logic (rating, budget fit, cuisine match)
- Candidate selector (Top-N records)

**Input:** Cleaned dataset + standardized user preferences  
**Output:** Shortlisted restaurant candidates

### Phase 4: LLM Reasoning and Recommendation Layer

**Goal:** Generate personalized, explainable recommendations.

**Components:**
- Prompt builder (inject user preferences + shortlisted candidates)
- LLM inference service
- Response parser and formatter

**Input:** Shortlisted candidates + user preference object  
**Output:** Ranked recommendations with natural-language explanations

### Phase 5: Presentation Layer

**Goal:** Display recommendations in a simple and useful way.

**Components:**
- Results view/API response formatter
- Recommendation cards/list (name, cuisine, rating, cost, explanation)
- Optional summary block (top picks)

**Input:** LLM-generated recommendation response  
**Output:** User-facing recommendation list

### Phase 6: Feedback and Improvement Layer (Optional but Recommended)

**Goal:** Improve recommendation quality over time.

**Components:**
- User feedback capture (like/dislike, selected restaurant)
- Logging and analytics module
- Prompt and ranking tuning loop

**Input:** User interaction and feedback signals  
**Output:** Updated ranking heuristics and improved prompts

## End-to-End Data Flow

`Raw Dataset -> Cleaned Dataset -> User Preferences -> Candidate Filtering -> LLM Prompting -> Ranked Recommendations -> User Feedback -> System Improvement`
