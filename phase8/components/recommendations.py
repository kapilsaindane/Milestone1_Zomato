import streamlit as st
import pandas as pd
import time
from services.api_client import get_recommendations, submit_feedback
from components.sidebar import log_activity

def render_recommendations():
    """Render the recommendations display page"""
    
    st.header("🍽️ Your Restaurant Recommendations")
    
    # Check if recommendations exist
    if not st.session_state.recommendations:
        st.info("👋 No recommendations yet. Please set your preferences first!")
        
        # Quick set preferences button
        if st.button("🎯 Set Preferences Now", type="primary"):
            st.session_state.current_page = "Preferences"
            st.rerun()
        return
    
    # Filter and sort options
    render_filter_options()
    
    # Display recommendations
    filtered_recommendations = get_filtered_recommendations()
    
    if not filtered_recommendations:
        st.warning("⚠️ No recommendations match your current filters.")
        return
    
    # Recommendations header
    col1, col2, col3 = st.columns([2, 1, 1])
    
    with col1:
        st.subheader(f"🔥 {len(filtered_recommendations)} Recommendations")
    
    with col2:
        if st.button("🔄 Refresh", use_container_width=True):
            refresh_recommendations()
    
    with col3:
        if st.button("📊 Export", use_container_width=True):
            export_recommendations(filtered_recommendations)
    
    # Display recommendations in different views
    view_mode = st.radio("View Mode:", ["📋 List", "🎯 Cards", "📊 Table"], horizontal=True)
    
    if view_mode == "📋 List":
        render_list_view(filtered_recommendations)
    elif view_mode == "🎯 Cards":
        render_card_view(filtered_recommendations)
    else:
        render_table_view(filtered_recommendations)
    
    # Feedback section
    render_feedback_section()

def render_filter_options():
    """Render filter and sort options"""
    
    with st.expander("🔍 Filter & Sort Options", expanded=False):
        col1, col2 = st.columns(2)
        
        with col1:
            # Sort options
            sort_by = st.selectbox(
                "Sort by:",
                ["Best Match", "Rating", "Price", "Distance", "Name"],
                key="sort_by"
            )
            
            # Price filter
            price_filter = st.multiselect(
                "Price Range:",
                ["$", "$$", "$$$", "$$$$"],
                default=["$", "$$", "$$$", "$$$$"],
                key="price_filter"
            )
        
        with col2:
            # Rating filter
            min_rating = st.slider(
                "Minimum Rating:",
                min_value=1.0,
                max_value=5.0,
                step=0.5,
                value=3.0,
                key="min_rating_filter"
            )
            
            # Cuisine filter
            available_cuisines = list(set([r['cuisine'] for r in st.session_state.recommendations]))
            cuisine_filter = st.multiselect(
                "Cuisine:",
                available_cuisines,
                default=available_cuisines,
                key="cuisine_filter"
            )
        
        # Update session state
        st.session_state.filter_options = {
            'sort_by': sort_by,
            'price_filter': price_filter,
            'min_rating': min_rating,
            'cuisine_filter': cuisine_filter
        }

def get_filtered_recommendations():
    """Get filtered and sorted recommendations"""
    
    recommendations = st.session_state.recommendations.copy()
    filter_options = st.session_state.get('filter_options', {})
    
    # Apply filters
    if filter_options.get('price_filter'):
        recommendations = [r for r in recommendations if r['price_range'] in filter_options['price_filter']]
    
    if filter_options.get('min_rating'):
        recommendations = [r for r in recommendations if r['rating'] >= filter_options['min_rating']]
    
    if filter_options.get('cuisine_filter'):
        recommendations = [r for r in recommendations if r['cuisine'] in filter_options['cuisine_filter']]
    
    # Apply sorting
    sort_by = filter_options.get('sort_by', 'Best Match')
    
    if sort_by == 'Rating':
        recommendations.sort(key=lambda x: x['rating'], reverse=True)
    elif sort_by == 'Price':
        price_order = {'$': 1, '$$': 2, '$$$': 3, '$$$$': 4}
        recommendations.sort(key=lambda x: price_order.get(x['price_range'], 2))
    elif sort_by == 'Distance':
        recommendations.sort(key=lambda x: x.get('distance', float('inf')))
    elif sort_by == 'Name':
        recommendations.sort(key=lambda x: x['name'])
    # Best Match (default) - keep original order
    
    return recommendations

def render_list_view(recommendations):
    """Render recommendations in list view"""
    
    for i, rec in enumerate(recommendations, 1):
        with st.expander(f"{i}. {rec['name']} ⭐ {rec['rating']} ({rec['price_range']})"):
            render_recommendation_details(rec, i)

def render_card_view(recommendations):
    """Render recommendations in card view"""
    
    cols = st.columns(min(3, len(recommendations)))
    
    for i, rec in enumerate(recommendations):
        with cols[i % 3]:
            render_recommendation_card(rec, i + 1)

def render_table_view(recommendations):
    """Render recommendations in table view"""
    
    # Create DataFrame
    df_data = []
    for rec in recommendations:
        df_data.append({
            'Name': rec['name'],
            'Cuisine': rec['cuisine'],
            'Rating': f"⭐ {rec['rating']}",
            'Price': rec['price_range'],
            'Location': rec['location'],
            'Distance': rec.get('distance', 'N/A'),
            'Match': f"{rec.get('match_score', 0.8) * 100:.0f}%"
        })
    
    df = pd.DataFrame(df_data)
    
    # Display table
    st.dataframe(df, use_container_width=True)
    
    # Add action buttons
    if st.button("📥 Download CSV"):
        csv = df.to_csv(index=False)
        st.download_button(
            label="Download CSV",
            data=csv,
            file_name="recommendations.csv",
            mime="text/csv"
        )

def render_recommendation_details(rec, index):
    """Render detailed recommendation information"""
    
    col1, col2 = st.columns([3, 1])
    
    with col1:
        # Basic info
        st.write(f"**Cuisine:** {rec['cuisine']}")
        st.write(f"**Location:** {rec['location']}")
        st.write(f"**Price Range:** {rec['price_range']}")
        st.write(f"**Rating:** {'⭐' * int(rec['rating'])} ({rec['rating']})")
        
        # Additional details
        if 'distance' in rec:
            st.write(f"**Distance:** {rec['distance']} km")
        if 'delivery_time' in rec:
            st.write(f"**Delivery Time:** {rec['delivery_time']} min")
        
        # Description and explanation
        st.write(f"**Description:** {rec['description']}")
        st.write(f"**Why we recommend this:** {rec['explanation']}")
        
        # Tags
        if 'tags' in rec and rec['tags']:
            st.write("**Tags:**")
            for tag in rec['tags']:
                st.badge(tag)
    
    with col2:
        # Actions
        st.write("**Actions:**")
        
        if st.button(f"📍 Details", key=f"details_{index}"):
            st.write(f"**Phone:** {rec.get('phone', 'N/A')}")
            st.write(f"**Address:** {rec.get('address', 'N/A')}")
            st.write(f"**Hours:** {rec.get('hours', 'N/A')}")
        
        if st.button(f"❤️ Save", key=f"save_{index}"):
            save_to_favorites(rec, index)
        
        if st.button(f"🗺️ Map", key=f"map_{index}"):
            show_on_map(rec)
        
        if st.button(f"📞 Call", key=f"call_{index}"):
            if 'phone' in rec:
                st.success(f"📞 Call {rec['phone']}")
            else:
                st.warning("Phone number not available")

def render_recommendation_card(rec, index):
    """Render recommendation as a card"""
    
    with st.container():
        # Card header
        st.markdown(f"### {index}. {rec['name']}")
        
        # Rating and price
        col1, col2 = st.columns(2)
        with col1:
            st.write(f"⭐ {rec['rating']}")
        with col2:
            st.write(rec['price_range'])
        
        # Basic info
        st.write(f"🍽️ {rec['cuisine']}")
        st.write(f"📍 {rec['location']}")
        
        # Match score
        if 'match_score' in rec:
            st.progress(rec['match_score'])
            st.write(f"Match: {rec['match_score'] * 100:.0f}%")
        
        # Actions
        col1, col2 = st.columns(2)
        with col1:
            if st.button(f"📍 View", key=f"card_view_{index}"):
                st.session_state.selected_restaurant = rec
                st.rerun()
        with col2:
            if st.button(f"❤️ Save", key=f"card_save_{index}"):
                save_to_favorites(rec, index)
        
        st.markdown("---")

def render_feedback_section():
    """Render feedback section for recommendations"""
    
    st.subheader("📝 Feedback")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Overall feedback
        st.write("**How helpful were these recommendations?**")
        
        col1a, col2a = st.columns(2)
        with col1a:
            if st.button("👍 Helpful", type="primary"):
                submit_overall_feedback("helpful")
        with col2a:
            if st.button("👎 Not Helpful"):
                submit_overall_feedback("not_helpful")
    
    with col2:
        # Individual feedback
        st.write("**Rate individual recommendations:**")
        
        for i, rec in enumerate(st.session_state.recommendations[:3], 1):
            col1b, col2b = st.columns([3, 1])
            with col1b:
                st.write(f"{i}. {rec['name']}")
            with col2b:
                rating = st.selectbox(
                    "",
                    [1, 2, 3, 4, 5],
                    key=f"rating_{i}",
                    format_func=lambda x: f"{'⭐' * x}"
                )
                if rating:
                    submit_individual_feedback(rec['id'], rating)

def save_to_favorites(restaurant, index):
    """Save restaurant to favorites"""
    if 'favorites' not in st.session_state:
        st.session_state.favorites = []
    
    if restaurant not in st.session_state.favorites:
        st.session_state.favorites.append(restaurant)
        st.success(f"❤️ {restaurant['name']} added to favorites!")
        log_activity(f"Saved {restaurant['name']} to favorites")
    else:
        st.info(f"ℹ️ {restaurant['name']} is already in favorites!")

def show_on_map(restaurant):
    """Show restaurant on map (placeholder)"""
    st.info(f"🗺️ Map view for {restaurant['name']} would be shown here")
    log_activity(f"Viewed map for {restaurant['name']}")

def refresh_recommendations():
    """Refresh recommendations"""
    with st.spinner("🔄 Refreshing recommendations..."):
        time.sleep(1)  # Simulate API call
        st.success("✅ Recommendations refreshed!")
        log_activity("Refreshed recommendations")

def export_recommendations(recommendations):
    """Export recommendations to various formats"""
    
    export_format = st.selectbox("Export format:", ["JSON", "CSV", "PDF"])
    
    if export_format == "JSON":
        import json
        json_data = json.dumps(recommendations, indent=2, default=str)
        st.download_button(
            label="📥 Download JSON",
            data=json_data,
            file_name="recommendations.json",
            mime="application/json"
        )
    
    elif export_format == "CSV":
        df_data = []
        for rec in recommendations:
            df_data.append({
                'Name': rec['name'],
                'Cuisine': rec['cuisine'],
                'Rating': rec['rating'],
                'Price': rec['price_range'],
                'Location': rec['location'],
                'Description': rec['description']
            })
        
        df = pd.DataFrame(df_data)
        csv = df.to_csv(index=False)
        st.download_button(
            label="📥 Download CSV",
            data=csv,
            file_name="recommendations.csv",
            mime="text/csv"
        )
    
    else:  # PDF
        st.info("📄 PDF export would be implemented here")

def submit_overall_feedback(feedback):
    """Submit overall feedback"""
    feedback_data = {
        'type': 'overall',
        'feedback': feedback,
        'timestamp': time.time(),
        'recommendations_count': len(st.session_state.recommendations)
    }
    
    # In real implementation, send to API
    st.success(f"✅ Feedback submitted: {feedback}")
    log_activity(f"Submitted {feedback} feedback")

def submit_individual_feedback(restaurant_id, rating):
    """Submit individual restaurant feedback"""
    feedback_data = {
        'type': 'individual',
        'restaurant_id': restaurant_id,
        'rating': rating,
        'timestamp': time.time()
    }
    
    # In real implementation, send to API
    st.success(f"✅ Rating submitted: {'⭐' * rating}")
    log_activity(f"Rated restaurant {restaurant_id}: {rating} stars")
