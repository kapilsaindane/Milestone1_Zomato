import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import time
from components.sidebar import log_activity

def render_analytics():
    """Render the analytics dashboard"""
    
    st.header("📊 Analytics Dashboard")
    
    # Time period selector
    time_period = st.selectbox(
        "Select Time Period:",
        ["Last 7 Days", "Last 30 Days", "Last 90 Days", "All Time"],
        index=1
    )
    
    # Main metrics
    render_main_metrics()
    
    # Charts section
    tab1, tab2, tab3, tab4 = st.tabs(["📈 Overview", "🍽️ Restaurant Analytics", "👤 User Behavior", "🎯 Performance"])
    
    with tab1:
        render_overview_charts()
    
    with tab2:
        render_restaurant_analytics()
    
    with tab3:
        render_user_behavior_analytics()
    
    with tab4:
        render_performance_analytics()

def render_main_metrics():
    """Render main metrics cards"""
    
    # Mock data for metrics
    metrics = {
        "Total Recommendations": "2,847",
        "Active Users": "1,234",
        "Avg. Rating": "4.3 ⭐",
        "Success Rate": "87%",
        "Response Time": "245ms",
        "Daily Active": "567"
    }
    
    # Create columns for metrics
    cols = st.columns(3)
    
    for i, (metric, value) in enumerate(metrics.items()):
        with cols[i % 3]:
            st.metric(metric, value)

def render_overview_charts():
    """Render overview charts"""
    
    st.subheader("📈 System Overview")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Recommendations over time
        st.write("**Recommendations Over Time**")
        
        # Mock data
        dates = pd.date_range(start=datetime.now() - timedelta(days=30), end=datetime.now(), freq='D')
        recommendations_count = [50 + (i % 10) * 5 for i in range(len(dates))]
        
        fig = px.line(
            x=dates, 
            y=recommendations_count,
            title="Daily Recommendations",
            labels={"x": "Date", "y": "Count"}
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        # User satisfaction
        st.write("**User Satisfaction**")
        
        satisfaction_data = {
            'Very Satisfied': 45,
            'Satisfied': 30,
            'Neutral': 15,
            'Dissatisfied': 7,
            'Very Dissatisfied': 3
        }
        
        fig = px.pie(
            values=list(satisfaction_data.values()),
            names=list(satisfaction_data.keys()),
            title="User Satisfaction Distribution"
        )
        st.plotly_chart(fig, use_container_width=True)
    
    # Popular cuisines
    st.write("**Popular Cuisines**")
    
    cuisine_data = {
        'Italian': 450,
        'Chinese': 380,
        'Japanese': 320,
        'Indian': 290,
        'Mexican': 250,
        'Thai': 180,
        'American': 160,
        'Mediterranean': 140
    }
    
    fig = px.bar(
        x=list(cuisine_data.keys()),
        y=list(cuisine_data.values()),
        title="Most Recommended Cuisines",
        labels={"x": "Cuisine", "y": "Recommendations"}
    )
    st.plotly_chart(fig, use_container_width=True)

def render_restaurant_analytics():
    """Render restaurant-specific analytics"""
    
    st.subheader("🍽️ Restaurant Performance Analytics")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Top rated restaurants
        st.write("**Top Rated Restaurants**")
        
        top_restaurants = [
            {"name": "The Italian Kitchen", "rating": 4.8, "recommendations": 234},
            {"name": "Sushi Master", "rating": 4.7, "recommendations": 198},
            {"name": "Spice Garden", "rating": 4.6, "recommendations": 176},
            {"name": "Burger Palace", "rating": 4.5, "recommendations": 165},
            {"name": "Pizza Paradise", "rating": 4.4, "recommendations": 154}
        ]
        
        df_top = pd.DataFrame(top_restaurants)
        st.dataframe(df_top, use_container_width=True)
    
    with col2:
        # Restaurant distribution by price
        st.write("**Restaurant Distribution by Price**")
        
        price_data = {
            '$': 120,
            '$$': 340,
            '$$$': 280,
            '$$$$': 95
        }
        
        fig = px.pie(
            values=list(price_data.values()),
            names=list(price_data.keys()),
            title="Price Range Distribution"
        )
        st.plotly_chart(fig, use_container_width=True)
    
    # Rating distribution
    st.write("**Rating Distribution**")
    
    rating_data = {
        '5.0': 45,
        '4.5': 120,
        '4.0': 180,
        '3.5': 150,
        '3.0': 95,
        '2.5': 60,
        '2.0': 25,
        '1.5': 15,
        '1.0': 10
    }
    
    fig = px.histogram(
        x=list(rating_data.keys()) * [rating_data[k] for k in rating_data.keys()],
        title="Restaurant Rating Distribution",
        labels={"x": "Rating", "y": "Count"},
        nbins=9
    )
    st.plotly_chart(fig, use_container_width=True)

def render_user_behavior_analytics():
    """Render user behavior analytics"""
    
    st.subheader("👤 User Behavior Analytics")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # User activity heatmap
        st.write("**User Activity Heatmap**")
        
        # Mock hourly data
        hours = list(range(24))
        activity = [10, 8, 5, 3, 5, 15, 45, 78, 65, 55, 48, 52, 
                  58, 62, 55, 48, 55, 68, 75, 45, 35, 25, 18, 12]
        
        fig = px.line(
            x=hours,
            y=activity,
            title="User Activity by Hour",
            labels={"x": "Hour of Day", "y": "Active Users"}
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        # Preference categories
        st.write("**Popular Preference Categories**")
        
        pref_data = {
            'Location': 890,
            'Cuisine': 750,
            'Price': 680,
            'Rating': 620,
            'Distance': 450,
            'Ambiance': 320,
            'Dietary': 280,
            'Spice Level': 195
        }
        
        fig = px.bar(
            x=list(pref_data.keys()),
            y=list(pref_data.values()),
            title="Preference Category Usage",
            labels={"x": "Category", "y": "Usage Count"}
        )
        st.plotly_chart(fig, use_container_width=True)
    
    # User journey
    st.write("**User Journey Funnel**")
    
    funnel_data = {
        'Page Views': 10000,
        'Preference Set': 3500,
        'Recommendations Generated': 2800,
        'Restaurant Viewed': 2100,
        'Feedback Given': 1400,
        'Saved to Favorites': 890
    }
    
    fig = px.funnel(
        y=list(funnel_data.keys()),
        x=list(funnel_data.values()),
        title="User Conversion Funnel"
    )
    st.plotly_chart(fig, use_container_width=True)

def render_performance_analytics():
    """Render performance analytics"""
    
    st.subheader("🎯 System Performance Analytics")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Response time trends
        st.write("**Response Time Trends**")
        
        # Mock response time data
        times = pd.date_range(start=datetime.now() - timedelta(hours=24), end=datetime.now(), freq='H')
        response_times = [200 + (i % 5) * 30 for i in range(len(times))]
        
        fig = px.line(
            x=times,
            y=response_times,
            title="API Response Time (ms)",
            labels={"x": "Time", "y": "Response Time (ms)"}
        )
        fig.add_hline(y=500, line_dash="dash", line_color="red", annotation_text="SLA: 500ms")
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        # Error rates
        st.write("**Error Rates**")
        
        error_data = {
            'Success': 94.5,
            'Client Error': 3.2,
            'Server Error': 1.8,
            'Timeout': 0.5
        }
        
        fig = px.pie(
            values=list(error_data.values()),
            names=list(error_data.keys()),
            title="Response Status Distribution"
        )
        st.plotly_chart(fig, use_container_width=True)
    
    # System health metrics
    st.write("**System Health Metrics**")
    
    health_metrics = {
        "CPU Usage": "45%",
        "Memory Usage": "62%",
        "Disk Usage": "38%",
        "Network I/O": "12 MB/s",
        "Cache Hit Rate": "89%",
        "Database Connections": "23/100"
    }
    
    cols = st.columns(3)
    for i, (metric, value) in enumerate(health_metrics.items()):
        with cols[i % 3]:
            # Color code based on value
            if "%" in value:
                percentage = float(value.replace("%", ""))
                if percentage < 50:
                    color = "normal"
                elif percentage < 80:
                    color = "normal"
                else:
                    color = "inverse"
            else:
                color = "normal"
            
            st.metric(metric, value)
    
    # Performance alerts
    st.write("**Performance Alerts**")
    
    alerts = [
        {"time": "2 hours ago", "type": "Warning", "message": "Response time exceeded 500ms"},
        {"time": "5 hours ago", "type": "Info", "message": "Cache cleared successfully"},
        {"time": "8 hours ago", "type": "Error", "message": "Database connection timeout"},
        {"time": "12 hours ago", "type": "Warning", "message": "Memory usage above 80%"}
    ]
    
    for alert in alerts:
        if alert["type"] == "Error":
            st.error(f"🔴 {alert['time']}: {alert['message']}")
        elif alert["type"] == "Warning":
            st.warning(f"🟡 {alert['time']}: {alert['message']}")
        else:
            st.info(f"🔵 {alert['time']}: {alert['message']}")

def get_analytics_data(time_period):
    """Get analytics data based on time period"""
    
    # Mock implementation - in real app, this would query database
    period_days = {
        "Last 7 Days": 7,
        "Last 30 Days": 30,
        "Last 90 Days": 90,
        "All Time": 365
    }
    
    days = period_days.get(time_period, 30)
    
    # Generate mock data
    data = {
        'recommendations': [100 + i * 10 for i in range(days)],
        'users': [50 + i * 5 for i in range(days)],
        'satisfaction': [4.0 + (i % 10) * 0.1 for i in range(days)]
    }
    
    return data

def export_analytics_report():
    """Export analytics report"""
    
    report_format = st.selectbox("Export format:", ["PDF", "Excel", "CSV"])
    
    if st.button("📥 Generate Report"):
        st.info(f"📄 {report_format} report would be generated here")
        log_activity(f"Generated {report_format} analytics report")

# Additional analytics functions
def calculate_user_engagement_score():
    """Calculate user engagement score"""
    
    # Mock calculation
    base_score = 70
    
    # Factors that affect score
    if st.session_state.get('recommendations'):
        base_score += 10
    
    if st.session_state.get('favorites'):
        base_score += 5
    
    if len(st.session_state.get('user_preferences', {})) > 3:
        base_score += 10
    
    return min(base_score, 100)

def get_recommendation_accuracy():
    """Get recommendation accuracy metrics"""
    
    # Mock accuracy data
    return {
        'overall_accuracy': 0.87,
        'cuisine_match': 0.92,
        'price_match': 0.78,
        'rating_match': 0.85,
        'location_match': 0.90
    }

def predict_user_churn():
    """Predict user churn probability"""
    
    # Mock churn prediction
    user_activity = len(st.session_state.get('activity_log', []))
    
    if user_activity < 5:
        churn_probability = 0.75
    elif user_activity < 10:
        churn_probability = 0.45
    else:
        churn_probability = 0.15
    
    return churn_probability
