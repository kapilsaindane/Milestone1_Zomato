import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from pathlib import Path

from .schemas import UserFeedback, FeedbackSession, FeedbackType, InteractionType
from .config import FEEDBACK_DATABASE_PATH, FEEDBACK_TYPES, INTERACTION_TYPES

class FeedbackCollector:
    """Collect and store user feedback for recommendations"""
    
    def __init__(self):
        self.db_path = FEEDBACK_DATABASE_PATH
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._initialize_database()
    
    def _initialize_database(self):
        """Initialize the feedback database"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Create feedback table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_feedback (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT,
                    session_id TEXT NOT NULL,
                    restaurant_name TEXT NOT NULL,
                    recommendation_id TEXT NOT NULL,
                    feedback_type TEXT NOT NULL,
                    interaction_type TEXT NOT NULL,
                    rating INTEGER,
                    timestamp DATETIME NOT NULL,
                    preference_profile TEXT,
                    recommendation_context TEXT,
                    explanation_quality INTEGER,
                    comments TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Create sessions table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS feedback_sessions (
                    session_id TEXT PRIMARY KEY,
                    user_preferences TEXT NOT NULL,
                    recommendations_shown TEXT NOT NULL,
                    user_interactions TEXT NOT NULL,
                    session_duration REAL,
                    conversion BOOLEAN,
                    satisfaction_score INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Create analytics cache table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS analytics_cache (
                    cache_key TEXT PRIMARY KEY,
                    cache_data TEXT NOT NULL,
                    expires_at DATETIME NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
    
    def create_session(self, user_preferences: Dict[str, Any]) -> str:
        """Create a new feedback session"""
        session_id = str(uuid.uuid4())
        
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO feedback_sessions 
                (session_id, user_preferences, recommendations_shown, user_interactions, session_duration, conversion)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                session_id,
                json.dumps(user_preferences),
                json.dumps([]),
                json.dumps([]),
                0.0,
                False
            ))
            conn.commit()
        
        return session_id
    
    def add_feedback(self, feedback: UserFeedback) -> bool:
        """Add user feedback to the database"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO user_feedback 
                    (user_id, session_id, restaurant_name, recommendation_id, feedback_type, 
                     interaction_type, rating, timestamp, preference_profile, 
                     recommendation_context, explanation_quality, comments)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    feedback.user_id,
                    feedback.session_id,
                    feedback.restaurant_name,
                    feedback.recommendation_id,
                    feedback.feedback_type.value,
                    feedback.interaction_type.value,
                    feedback.rating,
                    feedback.timestamp.isoformat(),
                    json.dumps(feedback.preference_profile),
                    json.dumps(feedback.recommendation_context),
                    feedback.explanation_quality,
                    feedback.comments
                ))
                conn.commit()
            return True
        except Exception as e:
            print(f"Error adding feedback: {e}")
            return False
    
    def record_recommendation_shown(self, session_id: str, recommendations: List[Dict[str, Any]]):
        """Record which recommendations were shown in a session"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE feedback_sessions 
                SET recommendations_shown = ?
                WHERE session_id = ?
            ''', (json.dumps(recommendations), session_id))
            conn.commit()
    
    def record_interaction(self, session_id: str, interaction: UserFeedback):
        """Record user interaction with recommendations"""
        # Add to feedback table
        self.add_feedback(interaction)
        
        # Update session interactions
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT user_interactions FROM feedback_sessions 
                WHERE session_id = ?
            ''', (session_id,))
            result = cursor.fetchone()
            
            if result:
                interactions = json.loads(result[0])
                interactions.append(interaction.dict())
                cursor.execute('''
                    UPDATE feedback_sessions 
                    SET user_interactions = ?
                    WHERE session_id = ?
                ''', (json.dumps(interactions), session_id))
                conn.commit()
    
    def end_session(self, session_id: str, satisfaction_score: Optional[int] = None):
        """End a feedback session and calculate metrics"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Calculate session duration
            cursor.execute('''
                SELECT created_at FROM feedback_sessions WHERE session_id = ?
            ''', (session_id,))
            result = cursor.fetchone()
            
            if result:
                start_time = datetime.fromisoformat(result[0].replace('Z', '+00:00'))
                duration = (datetime.now() - start_time).total_seconds()
                
                # Check if conversion occurred (any 'selected' feedback)
                cursor.execute('''
                    SELECT COUNT(*) FROM user_feedback 
                    WHERE session_id = ? AND feedback_type = ?
                ''', (session_id, FeedbackType.SELECTED.value))
                conversion_count = cursor.fetchone()[0]
                conversion = conversion_count > 0
                
                cursor.execute('''
                    UPDATE feedback_sessions 
                    SET session_duration = ?, conversion = ?, satisfaction_score = ?
                    WHERE session_id = ?
                ''', (duration, conversion, satisfaction_score, session_id))
                conn.commit()
    
    def get_feedback_by_restaurant(self, restaurant_name: str, limit: int = 100) -> List[UserFeedback]:
        """Get all feedback for a specific restaurant"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM user_feedback 
                WHERE restaurant_name = ?
                ORDER BY timestamp DESC
                LIMIT ?
            ''', (restaurant_name, limit))
            
            feedback_list = []
            for row in cursor.fetchall():
                feedback_list.append(UserFeedback(
                    user_id=row[1],
                    session_id=row[2],
                    restaurant_name=row[3],
                    recommendation_id=row[4],
                    feedback_type=FeedbackType(row[5]),
                    interaction_type=InteractionType(row[6]),
                    rating=row[7],
                    timestamp=datetime.fromisoformat(row[8].replace('Z', '+00:00')),
                    preference_profile=json.loads(row[9]),
                    recommendation_context=json.loads(row[10]),
                    explanation_quality=row[11],
                    comments=row[12]
                ))
            
            return feedback_list
    
    def get_session_feedback(self, session_id: str) -> Optional[FeedbackSession]:
        """Get all feedback for a specific session"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM feedback_sessions WHERE session_id = ?
            ''', (session_id,))
            
            result = cursor.fetchone()
            if result:
                return FeedbackSession(
                    session_id=result[0],
                    user_preferences=json.loads(result[1]),
                    recommendations_shown=json.loads(result[2]),
                    user_interactions=[UserFeedback(**interaction) 
                                     for interaction in json.loads(result[3])],
                    session_duration=result[4],
                    conversion=result[5],
                    satisfaction_score=result[6]
                )
        
        return None
    
    def get_recent_feedback(self, limit: int = 50) -> List[UserFeedback]:
        """Get the most recent feedback"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM user_feedback 
                ORDER BY timestamp DESC
                LIMIT ?
            ''', (limit,))
            
            feedback_list = []
            for row in cursor.fetchall():
                feedback_list.append(UserFeedback(
                    user_id=row[1],
                    session_id=row[2],
                    restaurant_name=row[3],
                    recommendation_id=row[4],
                    feedback_type=FeedbackType(row[5]),
                    interaction_type=InteractionType(row[6]),
                    rating=row[7],
                    timestamp=datetime.fromisoformat(row[8].replace('Z', '+00:00')),
                    preference_profile=json.loads(row[9]),
                    recommendation_context=json.loads(row[10]),
                    explanation_quality=row[11],
                    comments=row[12]
                ))
            
            return feedback_list
