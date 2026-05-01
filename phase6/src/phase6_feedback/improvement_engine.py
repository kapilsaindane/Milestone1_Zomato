import json
import sqlite3
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Tuple
from collections import defaultdict
import statistics

from .schemas import (
    ImprovementInsight, PromptTuningSuggestion, RankingAdjustment, 
    ImprovementReport, FeedbackAnalytics
)
from .config import (
    MIN_FEEDBACK_SAMPLES, PROMPT_TUNING_THRESHOLD, 
    RANKING_METRICS, PROMPT_METRICS, IMPROVEMENT_REPORT_PATH
)
from .analytics_engine import AnalyticsEngine
from .feedback_collector import FeedbackCollector

class ImprovementEngine:
    """Generate improvement suggestions based on feedback analytics"""
    
    def __init__(self):
        self.analytics_engine = AnalyticsEngine()
        self.feedback_collector = FeedbackCollector()
    
    def generate_improvement_report(self, days: int = 30) -> ImprovementReport:
        """Generate comprehensive improvement report"""
        # Get analytics data
        analytics = self.analytics_engine.generate_analytics(days)
        insights = self.analytics_engine.generate_improvement_insights(days)
        
        # Generate prompt suggestions
        prompt_suggestions = self._generate_prompt_suggestions(analytics, insights)
        
        # Generate ranking adjustments
        ranking_adjustments = self._generate_ranking_adjustments(analytics, insights)
        
        # Calculate performance trends
        performance_trends = self._calculate_performance_trends(days)
        
        # Generate next steps
        next_steps = self._generate_next_steps(insights, analytics)
        
        report = ImprovementReport(
            report_period={
                "start": datetime.now() - timedelta(days=days),
                "end": datetime.now()
            },
            total_recommendations=analytics.total_feedback_count,
            total_feedback=analytics.total_feedback_count,
            overall_satisfaction=analytics.satisfaction_score,
            key_insights=insights,
            prompt_suggestions=prompt_suggestions,
            ranking_adjustments=ranking_adjustments,
            performance_trends=performance_trends,
            next_steps=next_steps
        )
        
        # Save report
        self._save_report(report)
        
        return report
    
    def _generate_prompt_suggestions(self, analytics: FeedbackAnalytics, insights: List[ImprovementInsight]) -> List[PromptTuningSuggestion]:
        """Generate suggestions for improving LLM prompts"""
        suggestions = []
        
        # Check explanation quality
        low_explanation_insights = [i for i in insights if i.insight_type == "poor_explanations"]
        if low_explanation_insights:
            suggestions.append(PromptTuningSuggestion(
                current_prompt_version="v1.0",
                suggested_changes=[
                    "Add specific restaurant details to explanations",
                    "Include price range and distance information",
                    "Emphasize unique selling points",
                    "Add personalization based on user preferences"
                ],
                reasoning="Users report explanations lack sufficient detail and personalization",
                expected_improvement=0.25,
                test_hypothesis="More detailed explanations will increase user satisfaction by 25%"
            ))
        
        # Check cuisine diversity
        cuisine_insights = [i for i in insights if i.insight_type == "cuisine_bias"]
        if cuisine_insights:
            suggestions.append(PromptTuningSuggestion(
                current_prompt_version="v1.0",
                suggested_changes=[
                    "Add diversity constraints to recommendations",
                    "Ensure variety in cuisine types in top 5",
                    "Balance popular and niche cuisines",
                    "Consider user's cuisine history"
                ],
                reasoning="System shows bias towards certain cuisine types",
                expected_improvement=0.15,
                test_hypothesis="Diverse cuisine recommendations will improve overall satisfaction"
            ))
        
        # Check location relevance
        if analytics.location_performance:
            low_performing_locations = [
                loc for loc, metrics in analytics.location_performance.items()
                if metrics['satisfaction'] < 0.5
            ]
            
            if low_performing_locations:
                suggestions.append(PromptTuningSuggestion(
                    current_prompt_version="v1.0",
                    suggested_changes=[
                        "Enhance location-specific reasoning",
                        "Include proximity information",
                        "Add local context and landmarks",
                        "Consider travel time and accessibility"
                    ],
                    reasoning=f"Poor performance in locations: {', '.join(low_performing_locations)}",
                    expected_improvement=0.20,
                    test_hypothesis="Location-aware explanations will improve local user satisfaction"
                ))
        
        return suggestions
    
    def _generate_ranking_adjustments(self, analytics: FeedbackAnalytics, insights: List[ImprovementInsight]) -> List[RankingAdjustment]:
        """Generate suggestions for ranking algorithm adjustments"""
        adjustments = []
        
        # Rating weight adjustment
        if analytics.average_rating and analytics.average_rating < 3.5:
            adjustments.append(RankingAdjustment(
                factor_name="rating_weight",
                current_weight=0.3,
                suggested_weight=0.4,
                reasoning="Low average ratings suggest need for higher rating emphasis",
                expected_improvement=0.15,
                confidence=0.7
            ))
        
        # Cost sensitivity adjustment
        if analytics.cuisine_performance:
            # Check if budget-sensitive cuisines are underperforming
            budget_cuisines = ['North Indian', 'South Indian', 'Chinese']
            budget_performance = [
                metrics['satisfaction'] for cuisine, metrics in analytics.cuisine_performance.items()
                if cuisine in budget_cuisines
            ]
            
            if budget_performance and statistics.mean(budget_performance) < 0.6:
                adjustments.append(RankingAdjustment(
                    factor_name="cost_fit_weight",
                    current_weight=0.2,
                    suggested_weight=0.3,
                    reasoning="Budget-friendly cuisines showing poor satisfaction",
                    expected_improvement=0.12,
                    confidence=0.6
                ))
        
        # Location proximity adjustment
        location_variance = statistics.variance([
            metrics['satisfaction'] for metrics in analytics.location_performance.values()
        ]) if len(analytics.location_performance) > 1 else 0
        
        if location_variance > 0.1:  # High variance suggests location issues
            adjustments.append(RankingAdjustment(
                factor_name="location_proximity_weight",
                current_weight=0.15,
                suggested_weight=0.25,
                reasoning="High variance in location performance indicates need for better location ranking",
                expected_improvement=0.18,
                confidence=0.8
            ))
        
        # Popularity vs diversity balance
        if analytics.top_performing_restaurants:
            # Check if same restaurants always appear
            top_restaurant_names = [r['restaurant_name'] for r in analytics.top_performing_restaurants]
            if len(top_restaurant_names) < len(analytics.top_performing_restaurants):
                adjustments.append(RankingAdjustment(
                    factor_name="diversity_weight",
                    current_weight=0.1,
                    suggested_weight=0.2,
                    reasoning="Need to balance popularity with diversity in recommendations",
                    expected_improvement=0.10,
                    confidence=0.5
                ))
        
        return adjustments
    
    def _calculate_performance_trends(self, days: int) -> Dict[str, List[float]]:
        """Calculate performance trends over time"""
        trends = {
            'satisfaction_scores': [],
            'conversion_rates': [],
            'click_through_rates': [],
            'average_ratings': []
        }
        
        # Calculate daily metrics for trend analysis
        for day_offset in range(min(days, 30), 0, -7):  # Weekly data points
            day_analytics = self.analytics_engine.generate_analytics(day_offset)
            
            trends['satisfaction_scores'].append(day_analytics.satisfaction_score)
            trends['conversion_rates'].append(day_analytics.conversion_rate)
            trends['click_through_rates'].append(day_analytics.click_through_rate)
            
            if day_analytics.average_rating:
                trends['average_ratings'].append(day_analytics.average_rating)
            else:
                trends['average_ratings'].append(0.0)
        
        # Reverse to get chronological order
        for key in trends:
            trends[key] = list(reversed(trends[key]))
        
        return trends
    
    def _generate_next_steps(self, insights: List[ImprovementInsight], analytics: FeedbackAnalytics) -> List[str]:
        """Generate actionable next steps"""
        next_steps = []
        
        # High priority insights first
        high_priority_insights = [i for i in insights if i.priority == "high"]
        
        if high_priority_insights:
            next_steps.append("Implement high-priority improvements immediately")
            next_steps.extend([i.actionable_recommendation for i in high_priority_insights])
        
        # Data collection improvements
        if analytics.total_feedback_count < MIN_FEEDBACK_SAMPLES:
            next_steps.append("Increase feedback collection to reach minimum sample size")
            next_steps.append("Add more prominent feedback mechanisms in UI")
        
        # System maintenance
        next_steps.append("Schedule regular performance reviews (weekly)")
        next_steps.append("Monitor improvement suggestions implementation")
        next_steps.append("A/B test ranking adjustments before full deployment")
        
        # Long-term improvements
        next_steps.append("Consider implementing user segmentation for personalization")
        next_steps.append("Explore collaborative filtering techniques")
        next_steps.append("Plan for seasonal preference adjustments")
        
        return next_steps
    
    def _save_report(self, report: ImprovementReport):
        """Save improvement report to file"""
        IMPROVEMENT_REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
        
        with open(IMPROVEMENT_REPORT_PATH, 'w') as f:
            json.dump(report.dict(), f, indent=2, default=str)
    
    def test_improvement_hypothesis(self, hypothesis: str, test_duration_days: int = 7) -> Dict[str, Any]:
        """Test a specific improvement hypothesis"""
        # This would implement A/B testing logic
        # For now, return a placeholder
        return {
            "hypothesis": hypothesis,
            "test_duration": test_duration_days,
            "status": "pending",
            "baseline_metrics": {},
            "test_metrics": {},
            "statistical_significance": 0.0,
            "recommendation": "Implement full testing framework"
        }
    
    def get_improvement_history(self, days: int = 90) -> List[Dict[str, Any]]:
        """Get history of implemented improvements and their impact"""
        # This would track implemented improvements over time
        # For now, return placeholder
        return [
            {
                "date": datetime.now() - timedelta(days=30),
                "improvement_type": "ranking_adjustment",
                "description": "Increased rating weight from 0.3 to 0.4",
                "impact": {"satisfaction_change": 0.05, "conversion_change": 0.02}
            }
        ]
