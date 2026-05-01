from datetime import datetime
from typing import List, Dict, Any, Optional
import json

from .feedback_collector import FeedbackCollector, UserFeedback, FeedbackSession
from .analytics_engine import AnalyticsEngine, FeedbackAnalytics
from .improvement_engine import ImprovementEngine, ImprovementReport
from .schemas import FeedbackType, InteractionType

class Phase6Service:
    """Main service for Phase 6 feedback and improvement functionality"""
    
    def __init__(self):
        self.feedback_collector = FeedbackCollector()
        self.analytics_engine = AnalyticsEngine()
        self.improvement_engine = ImprovementEngine()
    
    def create_feedback_session(self, user_preferences: Dict[str, Any]) -> str:
        """Create a new feedback session"""
        return self.feedback_collector.create_session(user_preferences)
    
    def record_recommendation_feedback(
        self,
        session_id: str,
        restaurant_name: str,
        recommendation_id: str,
        feedback_type: str,
        interaction_type: str,
        preference_profile: Dict[str, Any],
        recommendation_context: Dict[str, Any],
        rating: Optional[int] = None,
        explanation_quality: Optional[int] = None,
        comments: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> bool:
        """Record user feedback on a specific recommendation"""
        
        feedback = UserFeedback(
            user_id=user_id,
            session_id=session_id,
            restaurant_name=restaurant_name,
            recommendation_id=recommendation_id,
            feedback_type=FeedbackType(feedback_type),
            interaction_type=InteractionType(interaction_type),
            rating=rating,
            timestamp=datetime.now(),
            preference_profile=preference_profile,
            recommendation_context=recommendation_context,
            explanation_quality=explanation_quality,
            comments=comments
        )
        
        return self.feedback_collector.record_interaction(session_id, feedback)
    
    def record_recommendations_shown(self, session_id: str, recommendations: List[Dict[str, Any]]):
        """Record which recommendations were shown to user"""
        self.feedback_collector.record_recommendation_shown(session_id, recommendations)
    
    def end_feedback_session(self, session_id: str, satisfaction_score: Optional[int] = None):
        """End a feedback session and calculate metrics"""
        self.feedback_collector.end_session(session_id, satisfaction_score)
    
    def get_feedback_analytics(self, days: int = 30) -> FeedbackAnalytics:
        """Get comprehensive feedback analytics"""
        return self.analytics_engine.generate_analytics(days)
    
    def get_improvement_report(self, days: int = 30) -> ImprovementReport:
        """Generate improvement report with suggestions"""
        return self.improvement_engine.generate_improvement_report(days)
    
    def get_restaurant_feedback(self, restaurant_name: str, limit: int = 100) -> List[UserFeedback]:
        """Get feedback for a specific restaurant"""
        return self.feedback_collector.get_feedback_by_restaurant(restaurant_name, limit)
    
    def get_session_feedback(self, session_id: str) -> Optional[FeedbackSession]:
        """Get complete feedback for a session"""
        return self.feedback_collector.get_session_feedback(session_id)
    
    def get_recent_feedback(self, limit: int = 50) -> List[UserFeedback]:
        """Get recent feedback across all sessions"""
        return self.feedback_collector.get_recent_feedback(limit)
    
    def get_improvement_insights(self, days: int = 30) -> List[Dict[str, Any]]:
        """Get actionable improvement insights"""
        insights = self.analytics_engine.generate_improvement_insights(days)
        return [insight.dict() for insight in insights]
    
    def export_feedback_data(self, days: int = 30, format: str = "json") -> Dict[str, Any]:
        """Export feedback data for analysis"""
        analytics = self.get_feedback_analytics(days)
        insights = self.get_improvement_insights(days)
        report = self.get_improvement_report(days)
        
        return {
            "export_timestamp": datetime.now().isoformat(),
            "period_days": days,
            "analytics": analytics.dict(),
            "insights": insights,
            "improvement_report": report.dict()
        }
    
    def get_feedback_summary(self, days: int = 7) -> Dict[str, Any]:
        """Get quick summary of recent feedback"""
        analytics = self.get_feedback_analytics(days)
        
        return {
            "period_days": days,
            "total_feedback": analytics.total_feedback_count,
            "satisfaction_score": analytics.satisfaction_score,
            "conversion_rate": analytics.conversion_rate,
            "top_restaurants": analytics.top_performing_restaurants[:3],
            "key_issues": [
                {
                    "type": "low_satisfaction",
                    "severity": "high" if analytics.satisfaction_score < 0.6 else "medium",
                    "message": f"Satisfaction score: {analytics.satisfaction_score:.2f}"
                },
                {
                    "type": "low_conversion",
                    "severity": "high" if analytics.conversion_rate < 0.1 else "medium", 
                    "message": f"Conversion rate: {analytics.conversion_rate:.2%}"
                }
            ]
        }
    
    def test_improvement(self, hypothesis: str, test_duration_days: int = 7) -> Dict[str, Any]:
        """Test an improvement hypothesis"""
        return self.improvement_engine.test_improvement_hypothesis(hypothesis, test_duration_days)
    
    def get_improvement_history(self, days: int = 90) -> List[Dict[str, Any]]:
        """Get history of implemented improvements"""
        return self.improvement_engine.get_improvement_history(days)
