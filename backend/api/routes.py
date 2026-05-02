from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List, Dict, Any
import json
import sys
from pathlib import Path

# Add backend directory to Python path for Streamlit deployment
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from services.phase_service import PhaseService
from models.schemas import (
    PreferenceProfileRequest,
    PreferenceProfileResponse,
    RecommendationResponse,
    PhaseStatusResponse
)

router = APIRouter()

# Initialize phase service
phase_service = PhaseService()

@router.get("/status", response_model=PhaseStatusResponse)
async def get_system_status():
    """Get the status of all phases and system health"""
    return await phase_service.get_system_status()

@router.post("/preferences", response_model=PreferenceProfileResponse)
async def create_preference_profile(request: PreferenceProfileRequest):
    """Create or update user preference profile"""
    try:
        return await phase_service.create_preference_profile(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/preferences", response_model=PreferenceProfileResponse)
async def get_current_preferences():
    """Get current preference profile"""
    try:
        return await phase_service.get_current_preferences()
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    background_tasks: BackgroundTasks,
    preferences: PreferenceProfileRequest = None
):
    """Get restaurant recommendations based on preferences"""
    try:
        return await phase_service.get_recommendations(preferences, background_tasks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recommendations/latest", response_model=RecommendationResponse)
async def get_latest_recommendations():
    """Get the latest recommendations without recalculating"""
    try:
        return await phase_service.get_latest_recommendations()
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/phases/{phase_name}/run")
async def run_phase(phase_name: str, background_tasks: BackgroundTasks):
    """Manually run a specific phase"""
    try:
        return await phase_service.run_phase(phase_name, background_tasks)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/phases/{phase_name}/status")
async def get_phase_status(phase_name: str):
    """Get status of a specific phase"""
    try:
        return await phase_service.get_phase_status(phase_name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/restaurants/search")
async def search_restaurants(
    query: str = None,
    location: str = None,
    cuisine: str = None,
    limit: int = 10
):
    """Search restaurants with filters"""
    try:
        return await phase_service.search_restaurants(query, location, cuisine, limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics/summary")
async def get_analytics_summary():
    """Get analytics summary of the system"""
    try:
        return await phase_service.get_analytics_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Phase 6 Feedback and Improvement Endpoints
@router.post("/feedback/sessions")
async def create_feedback_session(user_preferences: dict):
    """Create a new feedback session"""
    try:
        # Import Phase 6 service
        import sys
        sys.path.append(str(Path(__file__).parent.parent.parent / "phase6" / "src"))
        from phase6_feedback.service import Phase6Service
        
        phase6_service = Phase6Service()
        session_id = phase6_service.create_feedback_session(user_preferences)
        
        return {"session_id": session_id, "status": "created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/feedback/recommendations")
async def record_recommendation_feedback(feedback_data: dict):
    """Record feedback on restaurant recommendations"""
    try:
        import sys
        sys.path.append(str(Path(__file__).parent.parent.parent / "phase6" / "src"))
        from phase6_feedback.service import Phase6Service
        
        phase6_service = Phase6Service()
        success = phase6_service.record_recommendation_feedback(**feedback_data)
        
        return {"success": success, "status": "recorded"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/feedback/sessions/{session_id}/end")
async def end_feedback_session(session_id: str, satisfaction_data: dict = None):
    """End a feedback session"""
    try:
        import sys
        sys.path.append(str(Path(__file__).parent.parent.parent / "phase6" / "src"))
        from phase6_feedback.service import Phase6Service
        
        phase6_service = Phase6Service()
        satisfaction_score = satisfaction_data.get("satisfaction_score") if satisfaction_data else None
        phase6_service.end_feedback_session(session_id, satisfaction_score)
        
        return {"status": "session_ended"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/feedback/analytics")
async def get_feedback_analytics(days: int = 30):
    """Get feedback analytics and insights"""
    try:
        import sys
        sys.path.append(str(Path(__file__).parent.parent.parent / "phase6" / "src"))
        from phase6_feedback.service import Phase6Service
        
        phase6_service = Phase6Service()
        analytics = phase6_service.get_feedback_analytics(days)
        
        return analytics.dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/feedback/improvement-report")
async def get_improvement_report(days: int = 30):
    """Get improvement report with suggestions"""
    try:
        import sys
        sys.path.append(str(Path(__file__).parent.parent.parent / "phase6" / "src"))
        from phase6_feedback.service import Phase6Service
        
        phase6_service = Phase6Service()
        report = phase6_service.get_improvement_report(days)
        
        return report.dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/feedback/insights")
async def get_improvement_insights(days: int = 30):
    """Get actionable improvement insights"""
    try:
        import sys
        sys.path.append(str(Path(__file__).parent.parent.parent / "phase6" / "src"))
        from phase6_feedback.service import Phase6Service
        
        phase6_service = Phase6Service()
        insights = phase6_service.get_improvement_insights(days)
        
        return {"insights": insights, "total_count": len(insights)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/feedback/restaurant/{restaurant_name}")
async def get_restaurant_feedback(restaurant_name: str, limit: int = 50):
    """Get feedback for a specific restaurant"""
    try:
        import sys
        sys.path.append(str(Path(__file__).parent.parent.parent / "phase6" / "src"))
        from phase6_feedback.service import Phase6Service
        
        phase6_service = Phase6Service()
        feedback = phase6_service.get_restaurant_feedback(restaurant_name, limit)
        
        return {
            "restaurant_name": restaurant_name,
            "feedback_count": len(feedback),
            "feedback": [f.dict() for f in feedback]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/feedback/recent")
async def get_recent_feedback(limit: int = 20):
    """Get recent feedback across all sessions"""
    try:
        import sys
        sys.path.append(str(Path(__file__).parent.parent.parent / "phase6" / "src"))
        from phase6_feedback.service import Phase6Service
        
        phase6_service = Phase6Service()
        feedback = phase6_service.get_recent_feedback(limit)
        
        return {
            "feedback_count": len(feedback),
            "feedback": [f.dict() for f in feedback]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/feedback/export")
async def export_feedback_data(days: int = 30, format: str = "json"):
    """Export feedback data for analysis"""
    try:
        import sys
        sys.path.append(str(Path(__file__).parent.parent.parent / "phase6" / "src"))
        from phase6_feedback.service import Phase6Service
        
        phase6_service = Phase6Service()
        export_data = phase6_service.export_feedback_data(days, format)
        
        return export_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/feedback/test-improvement")
async def test_improvement_hypothesis(test_data: dict):
    """Test an improvement hypothesis"""
    try:
        import sys
        sys.path.append(str(Path(__file__).parent.parent.parent / "phase6" / "src"))
        from phase6_feedback.service import Phase6Service
        
        phase6_service = Phase6Service()
        result = phase6_service.test_improvement(
            test_data.get("hypothesis"),
            test_data.get("test_duration_days", 7)
        )
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
