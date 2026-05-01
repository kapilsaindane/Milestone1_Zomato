import asyncio
import json
import time
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional
from fastapi import BackgroundTasks

from models.schemas import (
    PreferenceProfileRequest, PreferenceProfileResponse,
    RecommendationResponse, PhaseStatusResponse, PhaseInfo,
    PhaseStatus, SearchResult, AnalyticsSummary, BudgetLevel
)
from core.config import settings

# Import phase modules
import sys
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / "phase2" / "src"))
sys.path.insert(0, str(project_root / "phase3" / "src"))
sys.path.insert(0, str(project_root / "phase4" / "src"))

try:
    from preference_capture.service import (
        create_preference_profile as phase2_create_profile,
        load_preference_profile
    )
    from phase3_candidate.service import build_shortlist, load_cleaned_dataset
    from phase4_llm.service import run_phase4_recommendation, save_recommendations
except ImportError as e:
    print(f"Warning: Could not import phase modules: {e}")
    # Create dummy functions for now
    phase2_create_profile = None
    load_preference_profile = None
    build_shortlist = None
    load_cleaned_dataset = None
    run_phase4_recommendation = None
    save_recommendations = None

class PhaseService:
    def __init__(self):
        self.settings = settings
        self.phase_status: Dict[str, PhaseInfo] = {}
        self._initialize_phase_status()
    
    def _initialize_phase_status(self):
        """Initialize status for all phases"""
        phases = ["phase1", "phase2", "phase3", "phase4"]
        for phase in phases:
            self.phase_status[phase] = PhaseInfo(
                name=phase,
                status=PhaseStatus.PENDING,
                last_run=None
            )
    
    async def get_system_status(self) -> PhaseStatusResponse:
        """Get overall system status"""
        # Update current status
        await self._update_phase_status()
        
        return PhaseStatusResponse(
            system_status="healthy",
            phases=list(self.phase_status.values()),
            total_restaurants=await self._get_total_restaurants(),
            last_updated=datetime.now().isoformat()
        )
    
    async def create_preference_profile(self, request: PreferenceProfileRequest) -> PreferenceProfileResponse:
        """Create preference profile from user request"""
        try:
            # Convert request to preference profile format
            profile_data = {
                "location": request.location,
                "budget": request.budget.value,
                "cuisine": request.cuisine,
                "minimum_rating": request.minimum_rating,
                "additional_preferences": request.additional_preferences,
                "budget_range": self._get_budget_range(request.budget, request.max_budget_amount),
                "normalized_tags": request.additional_preferences
            }
            
            # Save profile using phase2 service
            profile_path = Path(__file__).parent.parent.parent / "phase2" / "output" / "latest_preference_profile.json"
            profile_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(profile_path, 'w') as f:
                json.dump(profile_data, f, indent=2)
            
            return PreferenceProfileResponse(**profile_data)
            
        except Exception as e:
            raise Exception(f"Failed to create preference profile: {str(e)}")
    
    async def get_current_preferences(self) -> PreferenceProfileResponse:
        """Get current preference profile"""
        try:
            profile_path = Path(__file__).parent.parent.parent / "phase2" / "output" / "latest_preference_profile.json"
            
            if not profile_path.exists():
                raise Exception("No preference profile found")
            
            with open(profile_path, 'r') as f:
                profile_data = json.load(f)
            
            return PreferenceProfileResponse(**profile_data)
            
        except Exception as e:
            raise Exception(f"Failed to load preference profile: {str(e)}")
    
    async def get_recommendations(
        self, 
        preferences: Optional[PreferenceProfileRequest],
        background_tasks: BackgroundTasks
    ) -> RecommendationResponse:
        """Get restaurant recommendations"""
        start_time = time.time()
        
        try:
            # Create preference profile if provided
            if preferences:
                await self.create_preference_profile(preferences)
            
            # Run all phases in background
            background_tasks.add_task(self._run_full_pipeline)
            
            # Get latest recommendations
            return await self.get_latest_recommendations()
            
        except Exception as e:
            raise Exception(f"Failed to get recommendations: {str(e)}")
    
    async def get_latest_recommendations(self) -> RecommendationResponse:
        """Get latest recommendations without recalculating"""
        try:
            recommendations_path = Path(__file__).parent.parent.parent / "phase4" / "output" / "phase4_recommendations.json"
            
            if not recommendations_path.exists():
                raise Exception("No recommendations found. Please generate recommendations first.")
            
            with open(recommendations_path, 'r') as f:
                recommendations_data = json.load(f)
            
            return RecommendationResponse(**recommendations_data)
            
        except Exception as e:
            raise Exception(f"Failed to load recommendations: {str(e)}")
    
    async def run_phase(self, phase_name: str, background_tasks: BackgroundTasks) -> Dict[str, Any]:
        """Run a specific phase"""
        if phase_name not in self.phase_status:
            raise ValueError(f"Invalid phase: {phase_name}")
        
        # Add background task to run the phase
        background_tasks.add_task(self._run_single_phase, phase_name)
        
        return {"message": f"Phase {phase_name} started", "status": "running"}
    
    async def get_phase_status(self, phase_name: str) -> PhaseInfo:
        """Get status of a specific phase"""
        if phase_name not in self.phase_status:
            raise ValueError(f"Invalid phase: {phase_name}")
        
        await self._update_phase_status()
        return self.phase_status[phase_name]
    
    async def search_restaurants(
        self, 
        query: Optional[str], 
        location: Optional[str], 
        cuisine: Optional[str], 
        limit: int
    ) -> SearchResult:
        """Search restaurants with filters"""
        try:
            # Load cleaned dataset
            data_path = Path(__file__).parent.parent.parent / "phase1" / "output" / "zomato_cleaned.csv"
            
            if not data_path.exists():
                raise Exception("Cleaned dataset not found. Please run phase1 first.")
            
            import pandas as pd
            df = pd.read_csv(data_path)
            
            # Apply filters
            filtered_df = df.copy()
            
            if location:
                filtered_df = filtered_df[filtered_df['location'].str.contains(location, case=False, na=False)]
            
            if cuisine:
                filtered_df = filtered_df[filtered_df['cuisines'].str.contains(cuisine, case=False, na=False)]
            
            if query:
                filtered_df = filtered_df[
                    filtered_df['name'].str.contains(query, case=False, na=False) |
                    filtered_df['cuisines'].str.contains(query, case=False, na=False)
                ]
            
            # Limit results
            result_df = filtered_df.head(limit)
            
            # Convert to restaurant info format
            restaurants = []
            for _, row in result_df.iterrows():
                restaurants.append({
                    "restaurant_name": row.get('name', ''),
                    "location": row.get('location', ''),
                    "cuisine": row.get('cuisines', ''),
                    "primary_cuisine": row.get('cuisines', '').split(',')[0] if pd.notna(row.get('cuisines')) else '',
                    "rating": row.get('rate', 0),
                    "cost_for_two": row.get('cost', 0),
                    "votes": row.get('votes', 0),
                    "online_order": row.get('online_order', ''),
                    "table_booking": row.get('book_table', '')
                })
            
            return SearchResult(
                restaurants=restaurants,
                total_found=len(filtered_df),
                search_time=0.1  # Placeholder
            )
            
        except Exception as e:
            raise Exception(f"Search failed: {str(e)}")
    
    async def get_analytics_summary(self) -> AnalyticsSummary:
        """Get analytics summary"""
        try:
            # Load data
            data_path = Path(__file__).parent.parent.parent / "phase1" / "output" / "zomato_cleaned.csv"
            
            if not data_path.exists():
                raise Exception("Cleaned dataset not found")
            
            import pandas as pd
            df = pd.read_csv(data_path)
            
            # Calculate analytics
            total_restaurants = len(df)
            
            # Popular locations
            location_counts = df['location'].value_counts().head(10)
            popular_locations = [{"location": loc, "count": int(count)} for loc, count in location_counts.items()]
            
            # Popular cuisines
            cuisine_series = df['cuisines'].str.split(',').explode().str.strip()
            cuisine_counts = cuisine_series.value_counts().head(10)
            popular_cuisines = [{"cuisine": cuisine, "count": int(count)} for cuisine, count in cuisine_counts.items()]
            
            # Average ratings
            avg_ratings = {
                "overall": df['rate'].mean(),
                "by_location": df.groupby('location')['rate'].mean().to_dict(),
                "by_cuisine": df.groupby(df['cuisines'].str.split(',').str[0])['rate'].mean().to_dict()
            }
            
            return AnalyticsSummary(
                total_restaurants=total_restaurants,
                total_recommendations_generated=0,  # Would track from database
                popular_locations=popular_locations,
                popular_cuisines=popular_cuisines,
                average_ratings=avg_ratings,
                system_performance={"avg_response_time": 0.5}  # Placeholder
            )
            
        except Exception as e:
            raise Exception(f"Analytics failed: {str(e)}")
    
    # Private helper methods
    
    def _get_budget_range(self, budget: BudgetLevel, max_amount: Optional[int]) -> List[int]:
        """Get budget range based on budget level"""
        if max_amount:
            return [0, max_amount]
        
        ranges = {
            BudgetLevel.LOW: [0, 500],
            BudgetLevel.MEDIUM: [500, 1500],
            BudgetLevel.HIGH: [1500, 5000]
        }
        return ranges.get(budget, [0, 2000])
    
    async def _update_phase_status(self):
        """Update phase status based on file existence"""
        base_path = Path(__file__).parent.parent.parent
        
        # Phase 1 - Check cleaned data
        phase1_output = base_path / "phase1" / "output" / "zomato_cleaned.csv"
        if phase1_output.exists():
            self.phase_status["phase1"].status = PhaseStatus.COMPLETED
            self.phase_status["phase1"].output_count = len(pd.read_csv(phase1_output))
        
        # Phase 2 - Check preference profile
        phase2_output = base_path / "phase2" / "output" / "latest_preference_profile.json"
        if phase2_output.exists():
            self.phase_status["phase2"].status = PhaseStatus.COMPLETED
        
        # Phase 3 - Check shortlisted candidates
        phase3_output = base_path / "phase3" / "output" / "phase3_shortlisted_candidates.json"
        if phase3_output.exists():
            self.phase_status["phase3"].status = PhaseStatus.COMPLETED
            with open(phase3_output, 'r') as f:
                data = json.load(f)
                self.phase_status["phase3"].output_count = len(data.get('candidates', []))
        
        # Phase 4 - Check recommendations
        phase4_output = base_path / "phase4" / "output" / "phase4_recommendations.json"
        if phase4_output.exists():
            self.phase_status["phase4"].status = PhaseStatus.COMPLETED
            with open(phase4_output, 'r') as f:
                data = json.load(f)
                self.phase_status["phase4"].output_count = len(data.get('recommendations', []))
    
    async def _run_full_pipeline(self):
        """Run the complete pipeline in background"""
        try:
            # Run Phase 3 (candidate retrieval)
            await self._run_single_phase("phase3")
            
            # Run Phase 4 (LLM recommendations)
            await self._run_single_phase("phase4")
            
        except Exception as e:
            print(f"Pipeline failed: {str(e)}")
    
    async def _run_single_phase(self, phase_name: str):
        """Run a single phase"""
        try:
            self.phase_status[phase_name].status = PhaseStatus.RUNNING
            self.phase_status[phase_name].last_run = datetime.now().isoformat()
            
            if phase_name == "phase3":
                # Run Phase 3
                script_path = Path(__file__).parent.parent.parent / "phase3" / "scripts" / "run_phase3.py"
                import subprocess
                result = subprocess.run(["python", str(script_path)], capture_output=True, text=True)
                
                if result.returncode == 0:
                    self.phase_status[phase_name].status = PhaseStatus.COMPLETED
                else:
                    self.phase_status[phase_name].status = PhaseStatus.FAILED
                    self.phase_status[phase_name].error_message = result.stderr
            
            elif phase_name == "phase4":
                # Run Phase 4
                script_path = Path(__file__).parent.parent.parent / "phase4" / "scripts" / "run_phase4.py"
                import subprocess
                result = subprocess.run(["python", str(script_path)], capture_output=True, text=True)
                
                if result.returncode == 0:
                    self.phase_status[phase_name].status = PhaseStatus.COMPLETED
                else:
                    self.phase_status[phase_name].status = PhaseStatus.FAILED
                    self.phase_status[phase_name].error_message = result.stderr
            
        except Exception as e:
            self.phase_status[phase_name].status = PhaseStatus.FAILED
            self.phase_status[phase_name].error_message = str(e)
    
    async def _get_total_restaurants(self) -> int:
        """Get total number of restaurants in dataset"""
        try:
            data_path = Path(__file__).parent.parent.parent / "phase1" / "output" / "zomato_cleaned.csv"
            if data_path.exists():
                import pandas as pd
                df = pd.read_csv(data_path)
                return len(df)
            return 0
        except:
            return 0
