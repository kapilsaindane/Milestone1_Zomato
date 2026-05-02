import asyncio
import json
import time
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional
from fastapi import BackgroundTasks

# Import phase modules
import sys
backend_dir = Path(__file__).parent.parent
project_root = backend_dir.parent
sys.path.insert(0, str(backend_dir))
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / "phase2" / "src"))

from models.schemas import (
    PreferenceProfileRequest, PreferenceProfileResponse,
    RecommendationResponse, PhaseStatusResponse, PhaseInfo,
    PhaseStatus, SearchResult, AnalyticsSummary, BudgetLevel
)
from core.config import settings
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
            
            # Use basic CSV reading instead of pandas
            import csv
            with open(data_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                data = list(reader)
            
            # Apply filters
            filtered_data = data.copy()
            
            if location:
                filtered_data = [row for row in filtered_data if location.lower() in row.get('location', '').lower()]
            
            if cuisine:
                filtered_data = [row for row in filtered_data if cuisine.lower() in row.get('cuisines', '').lower()]
            
            if query:
                filtered_data = [row for row in filtered_data if 
                    query.lower() in row.get('name', '').lower() or 
                    query.lower() in row.get('cuisines', '').lower()
                ]
            
            # Limit results
            results = filtered_data[:limit]
            
            # Convert to restaurant info format
            restaurants = []
            for row in results:
                restaurants.append({
                    "restaurant_name": row.get('name', ''),
                    "location": row.get('location', ''),
                    "cuisine": row.get('cuisines', ''),
                    "primary_cuisine": row.get('cuisines', '').split(',')[0] if row.get('cuisines') else '',
                    "rating": row.get('rate', 0),
                    "cost_for_two": row.get('cost', 0),
                    "votes": row.get('votes', 0),
                    "online_order": row.get('online_order', ''),
                    "table_booking": row.get('book_table', '')
                })
            
            return SearchResult(
                restaurants=restaurants,
                total_found=len(filtered_data),
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
            
            # Use basic CSV reading instead of pandas
            import csv
            from collections import Counter
            
            with open(data_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                data = list(reader)
            
            # Calculate analytics
            total_restaurants = len(data)
            
            # Popular locations
            location_counter = Counter(row.get('location', '') for row in data)
            popular_locations = [{"location": loc, "count": count} for loc, count in location_counter.most_common(10)]
            
            # Popular cuisines
            all_cuisines = []
            for row in data:
                cuisines = row.get('cuisines', '').split(',')
                all_cuisines.extend([c.strip() for c in cuisines if c.strip()])
            
            cuisine_counter = Counter(all_cuisines)
            popular_cuisines = [{"cuisine": cuisine, "count": count} for cuisine, count in cuisine_counter.most_common(10)]
            
            # Average ratings
            ratings = [float(row.get('rate', 0)) for row in data if row.get('rate') and row.get('rate').replace('.', '').isdigit()]
            overall_avg = sum(ratings) / len(ratings) if ratings else 0
            
            # Ratings by location
            location_ratings = {}
            for location in location_counter.keys():
                location_data = [float(row.get('rate', 0)) for row in data if row.get('location') == location and row.get('rate') and row.get('rate').replace('.', '').isdigit()]
                location_ratings[location] = sum(location_data) / len(location_data) if location_data else 0
            
            # Ratings by cuisine
            cuisine_ratings = {}
            for cuisine in cuisine_counter.keys():
                cuisine_data = [float(row.get('rate', 0)) for row in data if cuisine in row.get('cuisines', '') and row.get('rate') and row.get('rate').replace('.', '').isdigit()]
                cuisine_ratings[cuisine] = sum(cuisine_data) / len(cuisine_data) if cuisine_data else 0
            
            avg_ratings = {
                "overall": overall_avg,
                "by_location": location_ratings,
                "by_cuisine": cuisine_ratings
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
                import csv
                with open(data_path, 'r', encoding='utf-8') as file:
                    reader = csv.DictReader(file)
                    data = list(reader)
                    return len(data)
            return 0
        except:
            return 0
