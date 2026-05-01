import sqlite3
import json
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Tuple
from collections import defaultdict, Counter
import statistics

from .schemas import FeedbackAnalytics, ImprovementInsight, FeedbackType
from .config import (
    FEEDBACK_DATABASE_PATH, 
    ANALYTICS_RETENTION_DAYS, 
    MIN_FEEDBACK_SAMPLES,
    RANKING_METRICS,
    PROMPT_METRICS
)

class AnalyticsEngine:
    """Analyze feedback data to generate insights and improvement suggestions"""
    
    def __init__(self):
        self.db_path = FEEDBACK_DATABASE_PATH
    
    def generate_analytics(self, days: int = 30) -> FeedbackAnalytics:
        """Generate comprehensive feedback analytics"""
        start_date = datetime.now() - timedelta(days=days)
        
        with sqlite3.connect(self.db_path) as conn:
            # Get feedback data
            feedback_df = pd.read_sql_query('''
                SELECT * FROM user_feedback 
                WHERE timestamp >= ?
                ORDER BY timestamp DESC
            ''', conn, params=[start_date.isoformat()])
            
            # Get session data
            sessions_df = pd.read_sql_query('''
                SELECT * FROM feedback_sessions 
                WHERE created_at >= ?
                ORDER BY created_at DESC
            ''', conn, params=[start_date.isoformat()])
        
        if feedback_df.empty:
            return self._empty_analytics(days)
        
        # Calculate metrics
        total_feedback = len(feedback_df)
        feedback_dist = dict(Counter(feedback_df['feedback_type']))
        avg_rating = feedback_df[feedback_df['rating'].notna()]['rating'].mean() if 'rating' in feedback_df.columns else None
        
        # Calculate satisfaction score (weighted by feedback type)
        satisfaction_weights = {
            'like': 1.0, 'selected': 1.0, 'neutral': 0.5, 
            'dislike': 0.0, 'ignored': 0.0
        }
        satisfaction_scores = [
            satisfaction_weights.get(ft, 0.5) for ft in feedback_df['feedback_type']
        ]
        satisfaction_score = statistics.mean(satisfaction_scores) if satisfaction_scores else 0.0
        
        # Calculate click-through rate
        click_through_rate = self._calculate_ctr(feedback_df)
        
        # Calculate conversion rate
        conversion_rate = self._calculate_conversion_rate(sessions_df)
        
        # Restaurant performance
        top_restaurants, underperforming_restaurants = self._analyze_restaurant_performance(feedback_df)
        
        # Cuisine and location performance
        cuisine_performance = self._analyze_cuisine_performance(feedback_df)
        location_performance = self._analyze_location_performance(feedback_df)
        
        return FeedbackAnalytics(
            total_feedback_count=total_feedback,
            feedback_distribution=feedback_dist,
            average_rating=avg_rating,
            satisfaction_score=satisfaction_score,
            click_through_rate=click_through_rate,
            conversion_rate=conversion_rate,
            top_performing_restaurants=top_restaurants,
            underperforming_restaurants=underperforming_restaurants,
            cuisine_performance=cuisine_performance,
            location_performance=location_performance,
            time_period={
                "start": start_date,
                "end": datetime.now()
            }
        )
    
    def generate_improvement_insights(self, days: int = 30) -> List[ImprovementInsight]:
        """Generate actionable insights for system improvement"""
        analytics = self.generate_analytics(days)
        insights = []
        
        # Low satisfaction insight
        if analytics.satisfaction_score < 0.6:
            insights.append(ImprovementInsight(
                insight_type="low_satisfaction",
                description=f"User satisfaction is low ({analytics.satisfaction_score:.2f})",
                confidence=0.8,
                actionable_recommendation="Review recommendation quality and adjust ranking weights",
                expected_impact="15-25% improvement in user satisfaction",
                priority="high"
            ))
        
        # Low conversion rate insight
        if analytics.conversion_rate < 0.1:
            insights.append(ImprovementInsight(
                insight_type="low_conversion",
                description=f"Conversion rate is low ({analytics.conversion_rate:.2%})",
                confidence=0.7,
                actionable_recommendation="Improve recommendation relevance and user experience",
                expected_impact="10-20% improvement in conversion",
                priority="medium"
            ))
        
        # Poor explanation quality
        if 'explanation_quality' in analytics.__dict__ and analytics.explanation_quality and analytics.explanation_quality < 3.5:
            insights.append(ImprovementInsight(
                insight_type="poor_explanations",
                description="AI explanations are not meeting user expectations",
                confidence=0.6,
                actionable_recommendation="Refine LLM prompts to generate more helpful explanations",
                expected_impact="20-30% improvement in explanation quality scores",
                priority="medium"
            ))
        
        # Cuisine bias insight
        cuisine_performances = analytics.cuisine_performance
        low_performing_cuisines = [
            cuisine for cuisine, metrics in cuisine_performances.items()
            if metrics.get('satisfaction', 0) < 0.4
        ]
        
        if low_performing_cuisines:
            insights.append(ImprovementInsight(
                insight_type="cuisine_bias",
                description=f"Poor performance for cuisines: {', '.join(low_performing_cuisines)}",
                confidence=0.5,
                actionable_recommendation="Adjust ranking weights for underperforming cuisines",
                expected_impact="15% improvement in cuisine diversity satisfaction",
                priority="low"
            ))
        
        return insights
    
    def _calculate_ctr(self, feedback_df: pd.DataFrame) -> float:
        """Calculate click-through rate"""
        if feedback_df.empty:
            return 0.0
        
        # Count views and clicks
        views = len(feedback_df[feedback_df['interaction_type'] == 'view'])
        clicks = len(feedback_df[feedback_df['interaction_type'].isin(['click', 'selected'])])
        
        return clicks / views if views > 0 else 0.0
    
    def _calculate_conversion_rate(self, sessions_df: pd.DataFrame) -> float:
        """Calculate conversion rate"""
        if sessions_df.empty:
            return 0.0
        
        conversions = sessions_df['conversion'].sum()
        total_sessions = len(sessions_df)
        
        return conversions / total_sessions if total_sessions > 0 else 0.0
    
    def _analyze_restaurant_performance(self, feedback_df: pd.DataFrame) -> Tuple[List[Dict], List[Dict]]:
        """Analyze individual restaurant performance"""
        restaurant_stats = defaultdict(lambda: {
            'feedback_count': 0,
            'likes': 0,
            'dislikes': 0,
            'selected': 0,
            'ratings': [],
            'satisfaction_scores': []
        })
        
        for _, row in feedback_df.iterrows():
            restaurant = row['restaurant_name']
            stats = restaurant_stats[restaurant]
            
            stats['feedback_count'] += 1
            stats['likes'] += 1 if row['feedback_type'] == 'like' else 0
            stats['dislikes'] += 1 if row['feedback_type'] == 'dislike' else 0
            stats['selected'] += 1 if row['feedback_type'] == 'selected' else 0
            
            if pd.notna(row['rating']):
                stats['ratings'].append(row['rating'])
            
            # Add satisfaction score
            satisfaction_weights = {'like': 1.0, 'selected': 1.0, 'neutral': 0.5, 'dislike': 0.0, 'ignored': 0.0}
            stats['satisfaction_scores'].append(satisfaction_weights.get(row['feedback_type'], 0.5))
        
        # Calculate metrics
        restaurant_performance = []
        for restaurant, stats in restaurant_stats.items():
            if stats['feedback_count'] >= 3:  # Minimum feedback threshold
                avg_rating = statistics.mean(stats['ratings']) if stats['ratings'] else None
                avg_satisfaction = statistics.mean(stats['satisfaction_scores'])
                
                restaurant_performance.append({
                    'restaurant_name': restaurant,
                    'feedback_count': stats['feedback_count'],
                    'like_ratio': stats['likes'] / stats['feedback_count'],
                    'selected_ratio': stats['selected'] / stats['feedback_count'],
                    'average_rating': avg_rating,
                    'satisfaction_score': avg_satisfaction
                })
        
        # Sort by satisfaction score
        restaurant_performance.sort(key=lambda x: x['satisfaction_score'], reverse=True)
        
        # Return top and bottom performers
        top_performers = restaurant_performance[:5]
        underperformers = restaurant_performance[-5:] if len(restaurant_performance) > 5 else []
        
        return top_performers, underperformers
    
    def _analyze_cuisine_performance(self, feedback_df: pd.DataFrame) -> Dict[str, Dict[str, float]]:
        """Analyze performance by cuisine type"""
        cuisine_stats = defaultdict(lambda: {
            'feedback_count': 0,
            'satisfaction_scores': [],
            'ratings': [],
            'selected_count': 0
        })
        
        for _, row in feedback_df.iterrows():
            # Extract cuisine from preference profile
            try:
                pref_profile = json.loads(row['preference_profile'])
                cuisine = pref_profile.get('cuisine', 'unknown')
            except:
                cuisine = 'unknown'
            
            stats = cuisine_stats[cuisine]
            stats['feedback_count'] += 1
            
            # Add satisfaction score
            satisfaction_weights = {'like': 1.0, 'selected': 1.0, 'neutral': 0.5, 'dislike': 0.0, 'ignored': 0.0}
            stats['satisfaction_scores'].append(satisfaction_weights.get(row['feedback_type'], 0.5))
            
            if pd.notna(row['rating']):
                stats['ratings'].append(row['rating'])
            
            if row['feedback_type'] == 'selected':
                stats['selected_count'] += 1
        
        # Calculate metrics
        cuisine_performance = {}
        for cuisine, stats in cuisine_stats.items():
            if stats['feedback_count'] >= 5:  # Minimum threshold
                avg_satisfaction = statistics.mean(stats['satisfaction_scores'])
                avg_rating = statistics.mean(stats['ratings']) if stats['ratings'] else None
                selection_rate = stats['selected_count'] / stats['feedback_count']
                
                cuisine_performance[cuisine] = {
                    'satisfaction': avg_satisfaction,
                    'average_rating': avg_rating or 0.0,
                    'selection_rate': selection_rate,
                    'feedback_count': stats['feedback_count']
                }
        
        return cuisine_performance
    
    def _analyze_location_performance(self, feedback_df: pd.DataFrame) -> Dict[str, Dict[str, float]]:
        """Analyze performance by location"""
        location_stats = defaultdict(lambda: {
            'feedback_count': 0,
            'satisfaction_scores': [],
            'ratings': [],
            'selected_count': 0
        })
        
        for _, row in feedback_df.iterrows():
            # Extract location from preference profile
            try:
                pref_profile = json.loads(row['preference_profile'])
                location = pref_profile.get('location', 'unknown')
            except:
                location = 'unknown'
            
            stats = location_stats[location]
            stats['feedback_count'] += 1
            
            # Add satisfaction score
            satisfaction_weights = {'like': 1.0, 'selected': 1.0, 'neutral': 0.5, 'dislike': 0.0, 'ignored': 0.0}
            stats['satisfaction_scores'].append(satisfaction_weights.get(row['feedback_type'], 0.5))
            
            if pd.notna(row['rating']):
                stats['ratings'].append(row['rating'])
            
            if row['feedback_type'] == 'selected':
                stats['selected_count'] += 1
        
        # Calculate metrics
        location_performance = {}
        for location, stats in location_stats.items():
            if stats['feedback_count'] >= 5:  # Minimum threshold
                avg_satisfaction = statistics.mean(stats['satisfaction_scores'])
                avg_rating = statistics.mean(stats['ratings']) if stats['ratings'] else None
                selection_rate = stats['selected_count'] / stats['feedback_count']
                
                location_performance[location] = {
                    'satisfaction': avg_satisfaction,
                    'average_rating': avg_rating or 0.0,
                    'selection_rate': selection_rate,
                    'feedback_count': stats['feedback_count']
                }
        
        return location_performance
    
    def _empty_analytics(self, days: int) -> FeedbackAnalytics:
        """Return empty analytics for periods with no data"""
        return FeedbackAnalytics(
            total_feedback_count=0,
            feedback_distribution={},
            average_rating=None,
            satisfaction_score=0.0,
            click_through_rate=0.0,
            conversion_rate=0.0,
            top_performing_restaurants=[],
            underperforming_restaurants=[],
            cuisine_performance={},
            location_performance={},
            time_period={
                "start": datetime.now() - timedelta(days=days),
                "end": datetime.now()
            }
        )
