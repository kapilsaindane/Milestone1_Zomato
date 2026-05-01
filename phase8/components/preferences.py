import streamlit as st
import time
from services.api_client import submit_preferences
from utils.validators import validate_preferences
from components.sidebar import log_activity

def render_preferences():
    """Render the preferences form page"""
    
    st.header("🎯 Set Your Restaurant Preferences")
    
    # Progress indicator
    progress = calculate_preferences_progress()
    st.progress(progress / 100)
    st.caption(f"Profile Completion: {progress}%")
    
    # Create tabs for different preference categories
    tab1, tab2, tab3, tab4 = st.tabs(["📍 Basic Info", "🍽️ Food Preferences", "💰 Budget & Distance", "🔔 Notifications"])
    
    with tab1:
        render_basic_preferences()
    
    with tab2:
        render_food_preferences()
    
    with tab3:
        render_budget_preferences()
    
    with tab4:
        render_notification_preferences()
    
    # Summary and submit section
    st.subheader("📋 Preference Summary")
    
    # Display current preferences
    current_prefs = st.session_state.get('user_preferences', {})
    
    if current_prefs:
        col1, col2 = st.columns(2)
        
        with col1:
            st.write("**Basic Info:**")
            st.write(f"• Location: {current_prefs.get('location', 'Not set')}")
            st.write(f"• Max Distance: {current_prefs.get('max_distance', 'Not set')} km")
        
        with col2:
            st.write("**Food Preferences:**")
            st.write(f"• Budget: {current_prefs.get('budget', 'Not set')}")
            st.write(f"• Min Rating: {current_prefs.get('min_rating', 'Not set')} ⭐")
            st.write(f"• Cuisines: {', '.join(current_prefs.get('cuisines', ['None']))}")
    
    # Submit button
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        if st.button("🚀 Get Recommendations", type="primary", use_container_width=True):
            handle_preferences_submission()
    
    # Quick actions
    st.subheader("⚡ Quick Actions")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("🎲 Random Preferences", use_container_width=True):
            set_random_preferences()
    
    with col2:
        if st.button("🔄 Reset to Default", use_container_width=True):
            reset_preferences()
    
    with col3:
        if st.button("💾 Save as Template", use_container_width=True):
            save_preferences_template()

def render_basic_preferences():
    """Render basic preference inputs"""
    
    st.subheader("📍 Basic Information")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Location
        location = st.text_input(
            "📍 Location",
            value=st.session_state.user_preferences.get('location', ''),
            placeholder="Enter your city or neighborhood",
            help="We'll use this to find restaurants near you"
        )
        
        # Max distance
        max_distance = st.slider(
            "📏 Maximum Distance (km)",
            min_value=1,
            max_value=50,
            value=st.session_state.user_preferences.get('max_distance', 10),
            step=1,
            help="Maximum distance for restaurant recommendations"
        )
    
    with col2:
        # Group size
        group_size = st.number_input(
            "👥 Group Size",
            min_value=1,
            max_value=20,
            value=st.session_state.user_preferences.get('group_size', 2),
            step=1,
            help="Number of people in your group"
        )
        
        # Occasion
        occasion = st.selectbox(
            "🎉 Occasion",
            ["Casual Meal", "Date Night", "Business Meeting", "Family Gathering", "Celebration", "Quick Bite"],
            index=0,
            help="What's the occasion for dining out?"
        )
    
    # Update session state
    st.session_state.user_preferences.update({
        'location': location,
        'max_distance': max_distance,
        'group_size': group_size,
        'occasion': occasion
    })

def render_food_preferences():
    """Render food preference inputs"""
    
    st.subheader("🍽️ Food Preferences")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Cuisine preferences
        st.write("**Preferred Cuisines**")
        cuisine_options = [
            "Italian", "Chinese", "Japanese", "Indian", "Mexican", 
            "Thai", "American", "Mediterranean", "French", "Korean"
        ]
        
        selected_cuisines = st.multiselect(
            "Select your favorite cuisines",
            cuisine_options,
            default=st.session_state.user_preferences.get('cuisines', []),
            help="Choose the cuisines you enjoy"
        )
        
        # Disliked cuisines
        st.write("**Cuisines to Avoid**")
        disliked_cuisines = st.multiselect(
            "Select cuisines to exclude",
            cuisine_options,
            default=st.session_state.user_preferences.get('disliked_cuisines', []),
            help="Choose cuisines you don't want"
        )
    
    with col2:
        # Minimum rating
        min_rating = st.slider(
            "⭐ Minimum Rating",
            min_value=1.0,
            max_value=5.0,
            step=0.5,
            value=st.session_state.user_preferences.get('min_rating', 3.0),
            help="Minimum restaurant rating you're willing to try"
        )
        
        # Spice level
        spice_level = st.select_slider(
            "🌶️ Spice Level",
            options=["Mild", "Medium", "Spicy", "Very Spicy"],
            value=st.session_state.user_preferences.get('spice_level', 'Medium'),
            help="How spicy do you like your food?"
        )
        
        # Dietary restrictions
        dietary_options = ["Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher", "Dairy-Free"]
        dietary_restrictions = st.multiselect(
            "🥗 Dietary Restrictions",
            dietary_options,
            default=st.session_state.user_preferences.get('dietary_restrictions', []),
            help="Any dietary restrictions we should consider?"
        )
    
    # Update session state
    st.session_state.user_preferences.update({
        'cuisines': selected_cuisines,
        'disliked_cuisines': disliked_cuisines,
        'min_rating': min_rating,
        'spice_level': spice_level,
        'dietary_restrictions': dietary_restrictions
    })

def render_budget_preferences():
    """Render budget and distance preferences"""
    
    st.subheader("💰 Budget & Distance Preferences")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Budget level
        budget = st.select_slider(
            "💵 Budget Level",
            options=["$", "$$", "$$$", "$$$$"],
            value=st.session_state.user_preferences.get('budget', '$$'),
            help="Your preferred price range"
        )
        
        # Delivery preference
        delivery_preference = st.radio(
            "🚚 Delivery Preference",
            ["Dine-in Only", "Delivery Available", "Either"],
            index=2,
            help="Do you prefer dine-in, delivery, or both?"
        )
    
    with col2:
        # Price sensitivity
        price_sensitivity = st.slider(
            "💰 Price Sensitivity",
            min_value=1,
            max_value=10,
            value=st.session_state.user_preferences.get('price_sensitivity', 5),
            help="How important is price to you? (1=Not important, 10=Very important)"
        )
        
        # Ambiance preference
        ambiance_options = ["Casual", "Fine Dining", "Romantic", "Family-Friendly", "Outdoor", "Trendy"]
        ambiance = st.multiselect(
            "🎨 Preferred Ambiance",
            ambiance_options,
            default=st.session_state.user_preferences.get('ambiance', ['Casual']),
            help="What kind of atmosphere do you prefer?"
        )
    
    # Update session state
    st.session_state.user_preferences.update({
        'budget': budget,
        'delivery_preference': delivery_preference,
        'price_sensitivity': price_sensitivity,
        'ambiance': ambiance
    })

def render_notification_preferences():
    """Render notification preferences"""
    
    st.subheader("🔔 Notification Preferences")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Email notifications
        email_notifications = st.checkbox(
            "📧 Email Notifications",
            value=st.session_state.user_preferences.get('email_notifications', True),
            help="Receive recommendations via email"
        )
        
        # Push notifications
        push_notifications = st.checkbox(
            "📱 Push Notifications",
            value=st.session_state.user_preferences.get('push_notifications', True),
            help="Receive push notifications on your device"
        )
        
        # SMS notifications
        sms_notifications = st.checkbox(
            "📞 SMS Notifications",
            value=st.session_state.user_preferences.get('sms_notifications', False),
            help="Receive SMS notifications"
        )
    
    with col2:
        # Notification frequency
        notification_frequency = st.selectbox(
            "📅 Notification Frequency",
            ["Immediate", "Daily", "Weekly", "Never"],
            index=1,
            help="How often do you want to receive recommendations?"
        )
        
        # Recommendation types
        recommendation_types = st.multiselect(
            "🎯 Recommendation Types",
            ["New Restaurants", "Special Offers", "Similar to Favorites", "Trending Now"],
            default=st.session_state.user_preferences.get('recommendation_types', ['New Restaurants', 'Similar to Favorites']),
            help="What types of recommendations interest you?"
        )
    
    # Update session state
    st.session_state.user_preferences.update({
        'email_notifications': email_notifications,
        'push_notifications': push_notifications,
        'sms_notifications': sms_notifications,
        'notification_frequency': notification_frequency,
        'recommendation_types': recommendation_types
    })

def calculate_preferences_progress():
    """Calculate preferences completion percentage"""
    preferences = st.session_state.get('user_preferences', {})
    
    required_fields = ['location', 'budget', 'min_rating']
    optional_fields = ['cuisines', 'max_distance', 'group_size', 'spice_level', 'ambiance']
    
    completed_required = sum(1 for field in required_fields if field in preferences and preferences[field])
    completed_optional = sum(1 for field in optional_fields if field in preferences and preferences[field])
    
    # Weight: 70% for required, 30% for optional
    required_progress = (completed_required / len(required_fields)) * 70
    optional_progress = (completed_optional / len(optional_fields)) * 30
    
    return int(required_progress + optional_progress)

def handle_preferences_submission():
    """Handle preferences form submission"""
    
    preferences = st.session_state.user_preferences
    
    # Validate preferences
    if not validate_preferences(preferences):
        st.error("❌ Please fill in all required fields (Location, Budget, Minimum Rating)")
        return
    
    # Show loading spinner
    with st.spinner("🤖 Generating personalized recommendations..."):
        try:
            # Submit preferences to API
            result = submit_preferences(preferences)
            
            if result.get('success', False):
                # Store recommendations
                st.session_state.recommendations = result.get('recommendations', [])
                
                # Log activity
                log_activity("Generated recommendations")
                
                # Show success message
                st.success(f"🎉 Generated {len(st.session_state.recommendations)} recommendations for you!")
                
                # Auto-navigate to recommendations after 2 seconds
                time.sleep(2)
                st.session_state.current_page = "Search"
                st.rerun()
                
            else:
                st.error("❌ Failed to generate recommendations. Please try again.")
                
        except Exception as e:
            st.error(f"❌ An error occurred: {str(e)}")

def set_random_preferences():
    """Set random preferences for testing"""
    import random
    
    random_prefs = {
        'location': random.choice(['New York', 'San Francisco', 'Chicago', 'Los Angeles']),
        'budget': random.choice(['$', '$$', '$$$', '$$$$']),
        'min_rating': round(random.uniform(3.0, 5.0), 1),
        'cuisines': random.sample(['Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican', 'Thai'], 3),
        'max_distance': random.randint(5, 25),
        'group_size': random.randint(1, 6),
        'spice_level': random.choice(['Mild', 'Medium', 'Spicy', 'Very Spicy']),
        'ambiance': random.sample(['Casual', 'Fine Dining', 'Romantic', 'Family-Friendly'], 2)
    }
    
    st.session_state.user_preferences.update(random_prefs)
    log_activity("Set random preferences")
    st.success("🎲 Random preferences set!")
    st.rerun()

def reset_preferences():
    """Reset preferences to default"""
    default_prefs = {
        'location': '',
        'budget': '$$',
        'min_rating': 3.0,
        'cuisines': [],
        'max_distance': 10,
        'group_size': 2,
        'spice_level': 'Medium',
        'ambiance': ['Casual'],
        'email_notifications': True,
        'push_notifications': True,
        'sms_notifications': False,
        'notification_frequency': 'Daily',
        'recommendation_types': ['New Restaurants', 'Similar to Favorites']
    }
    
    st.session_state.user_preferences = default_prefs
    log_activity("Reset preferences to default")
    st.success("🔄 Preferences reset to default!")
    st.rerun()

def save_preferences_template():
    """Save current preferences as a template"""
    if not st.session_state.user_preferences:
        st.warning("⚠️ No preferences to save!")
        return
    
    # In a real implementation, this would save to a database
    log_activity("Saved preferences template")
    st.success("💾 Preferences template saved!")
    
    # Show template name input
    template_name = st.text_input("Enter template name:", key="template_name")
    
    if template_name and st.button("Save Template"):
        # Save template logic here
        st.success(f"Template '{template_name}' saved successfully!")
