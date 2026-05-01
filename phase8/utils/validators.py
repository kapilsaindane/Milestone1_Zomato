import re
from typing import Dict, Any, List, Optional

def validate_preferences(preferences: Dict[str, Any]) -> bool:
    """Validate user preferences data"""
    
    required_fields = ['location', 'budget', 'min_rating']
    
    # Check required fields
    for field in required_fields:
        if field not in preferences or not preferences[field]:
            return False
    
    # Validate location
    if not validate_location(preferences['location']):
        return False
    
    # Validate budget
    if not validate_budget(preferences['budget']):
        return False
    
    # Validate rating
    if not validate_rating(preferences['min_rating']):
        return False
    
    # Validate optional fields if present
    if 'max_distance' in preferences:
        if not validate_distance(preferences['max_distance']):
            return False
    
    if 'group_size' in preferences:
        if not validate_group_size(preferences['group_size']):
            return False
    
    return True

def validate_location(location: str) -> bool:
    """Validate location input"""
    
    if not isinstance(location, str):
        return False
    
    # Remove whitespace and check if not empty
    location = location.strip()
    if not location:
        return False
    
    # Check minimum length
    if len(location) < 2:
        return False
    
    # Check maximum length
    if len(location) > 100:
        return False
    
    # Check for valid characters (letters, numbers, spaces, commas, hyphens)
    if not re.match(r'^[a-zA-Z0-9\s,\-\.]+$', location):
        return False
    
    return True

def validate_budget(budget: str) -> bool:
    """Validate budget level"""
    
    valid_budgets = ['$', '$$', '$$$', '$$$$']
    return budget in valid_budgets

def validate_rating(rating: float) -> bool:
    """Validate rating value"""
    
    if not isinstance(rating, (int, float)):
        return False
    
    if rating < 1.0 or rating > 5.0:
        return False
    
    return True

def validate_distance(distance: int) -> bool:
    """Validate distance value"""
    
    if not isinstance(distance, int):
        return False
    
    if distance < 1 or distance > 100:
        return False
    
    return True

def validate_group_size(group_size: int) -> bool:
    """Validate group size"""
    
    if not isinstance(group_size, int):
        return False
    
    if group_size < 1 or group_size > 20:
        return False
    
    return True

def validate_email(email: str) -> bool:
    """Validate email address"""
    
    if not isinstance(email, str):
        return False
    
    # Basic email regex
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    """Validate phone number"""
    
    if not isinstance(phone, str):
        return False
    
    # Remove common formatting characters
    clean_phone = re.sub(r'[\s\-\(\)]', '', phone)
    
    # Check if it's all digits and reasonable length
    return clean_phone.isdigit() and 10 <= len(clean_phone) <= 15

def validate_name(name: str) -> bool:
    """Validate person name"""
    
    if not isinstance(name, str):
        return False
    
    name = name.strip()
    
    if not name:
        return False
    
    if len(name) < 2 or len(name) > 50:
        return False
    
    # Check for valid characters (letters, spaces, hyphens, apostrophes)
    if not re.match(r'^[a-zA-Z\s\'\-\.]+$', name):
        return False
    
    return True

def validate_cuisine_list(cuisines: List[str]) -> bool:
    """Validate cuisine list"""
    
    if not isinstance(cuisines, list):
        return False
    
    valid_cuisines = [
        'Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican', 
        'Thai', 'American', 'Mediterranean', 'French', 'Korean'
    ]
    
    for cuisine in cuisines:
        if cuisine not in valid_cuisines:
            return False
    
    return True

def validate_dietary_restrictions(restrictions: List[str]) -> bool:
    """Validate dietary restrictions"""
    
    if not isinstance(restrictions, list):
        return False
    
    valid_restrictions = [
        'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 
        'Dairy-Free', 'Nut-Free'
    ]
    
    for restriction in restrictions:
        if restriction not in valid_restrictions:
            return False
    
    return True

def validate_search_query(query: str) -> bool:
    """Validate search query"""
    
    if not isinstance(query, str):
        return False
    
    query = query.strip()
    
    if not query:
        return False
    
    if len(query) < 2 or len(query) > 100:
        return False
    
    # Check for potentially harmful content
    dangerous_patterns = [
        r'<script.*?>.*?</script>',
        r'javascript:',
        r'on\w+\s*=',
        r'<.*?>',
        r'&lt;.*?&gt;'
    ]
    
    for pattern in dangerous_patterns:
        if re.search(pattern, query, re.IGNORECASE):
            return False
    
    return True

def sanitize_input(input_string: str) -> str:
    """Sanitize user input"""
    
    if not isinstance(input_string, str):
        return ''
    
    # Remove HTML tags
    clean_string = re.sub(r'<[^>]+>', '', input_string)
    
    # Remove potentially harmful characters
    clean_string = re.sub(r'[<>"\']', '', clean_string)
    
    # Trim whitespace
    clean_string = clean_string.strip()
    
    return clean_string

def validate_feedback_data(feedback: Dict[str, Any]) -> bool:
    """Validate feedback data"""
    
    required_fields = ['type', 'rating']
    
    for field in required_fields:
        if field not in feedback:
            return False
    
    # Validate feedback type
    valid_types = ['overall', 'individual', 'restaurant']
    if feedback['type'] not in valid_types:
        return False
    
    # Validate rating
    if not validate_rating(feedback['rating']):
        return False
    
    # Validate optional fields
    if 'restaurant_id' in feedback:
        if not isinstance(feedback['restaurant_id'], str) or not feedback['restaurant_id'].strip():
            return False
    
    if 'comment' in feedback:
        comment = feedback['comment']
        if not isinstance(comment, str):
            return False
        
        if len(comment.strip()) > 500:
            return False
    
    return True

def validate_api_response(response: Dict[str, Any]) -> bool:
    """Validate API response structure"""
    
    if not isinstance(response, dict):
        return False
    
    # Check for required fields
    if 'success' not in response:
        return False
    
    # If successful, should have data
    if response.get('success', False):
        if 'recommendations' in response:
            if not isinstance(response['recommendations'], list):
                return False
    
    return True

def validate_session_data(session_data: Dict[str, Any]) -> bool:
    """Validate session data integrity"""
    
    if not isinstance(session_data, dict):
        return False
    
    required_keys = ['session_id', 'preferences', 'recommendations']
    
    for key in required_keys:
        if key not in session_data:
            return False
    
    # Validate session ID
    session_id = session_data['session_id']
    if not isinstance(session_id, str) or len(session_id) < 10:
        return False
    
    # Validate preferences
    preferences = session_data['preferences']
    if not isinstance(preferences, dict):
        return False
    
    # Validate recommendations
    recommendations = session_data['recommendations']
    if not isinstance(recommendations, list):
        return False
    
    return True

def validate_file_upload(file_data: Dict[str, Any]) -> bool:
    """Validate file upload data"""
    
    if not isinstance(file_data, dict):
        return False
    
    required_fields = ['filename', 'content_type', 'size']
    
    for field in required_fields:
        if field not in file_data:
            return False
    
    # Validate filename
    filename = file_data['filename']
    if not isinstance(filename, str) or not filename.strip():
        return False
    
    # Check file extension
    allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    if not any(filename.lower().endswith(ext) for ext in allowed_extensions):
        return False
    
    # Validate content type
    content_type = file_data['content_type']
    allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if content_type not in allowed_types:
        return False
    
    # Validate file size (max 5MB)
    size = file_data['size']
    if not isinstance(size, int) or size > 5 * 1024 * 1024:
        return False
    
    return True

def get_validation_errors(preferences: Dict[str, Any]) -> List[str]:
    """Get detailed validation errors"""
    
    errors = []
    
    # Check required fields
    required_fields = ['location', 'budget', 'min_rating']
    
    for field in required_fields:
        if field not in preferences:
            errors.append(f"Missing required field: {field}")
        elif not preferences[field]:
            errors.append(f"Required field cannot be empty: {field}")
    
    # Validate specific fields
    if 'location' in preferences:
        if not validate_location(preferences['location']):
            errors.append("Invalid location format. Use letters, numbers, spaces, commas, and hyphens only.")
    
    if 'budget' in preferences:
        if not validate_budget(preferences['budget']):
            errors.append("Invalid budget level. Must be one of: $, $$, $$$, $$$$")
    
    if 'min_rating' in preferences:
        if not validate_rating(preferences['min_rating']):
            errors.append("Invalid rating. Must be between 1.0 and 5.0")
    
    if 'max_distance' in preferences:
        if not validate_distance(preferences['max_distance']):
            errors.append("Invalid distance. Must be between 1 and 100 km")
    
    if 'group_size' in preferences:
        if not validate_group_size(preferences['group_size']):
            errors.append("Invalid group size. Must be between 1 and 20 people")
    
    if 'cuisines' in preferences:
        if not validate_cuisine_list(preferences['cuisines']):
            errors.append("Invalid cuisine selection. Choose from the available options.")
    
    if 'dietary_restrictions' in preferences:
        if not validate_dietary_restrictions(preferences['dietary_restrictions']):
            errors.append("Invalid dietary restrictions. Choose from the available options.")
    
    return errors

def is_safe_input(input_string: str) -> bool:
    """Check if input is safe from common attacks"""
    
    if not isinstance(input_string, str):
        return False
    
    # Check for SQL injection patterns
    sql_patterns = [
        r'(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)',
        r'(\b(UNION|OR|AND)\b.*\b(1=1|1=2|true|false)\b)',
        r'(--|#|/\*|\*/)',
        r'(\bEXEC\b.*\b(XP_|SP_))'
    ]
    
    for pattern in sql_patterns:
        if re.search(pattern, input_string, re.IGNORECASE):
            return False
    
    # Check for XSS patterns
    xss_patterns = [
        r'<script.*?>.*?</script>',
        r'javascript:',
        r'on\w+\s*=',
        r'<iframe.*?>',
        r'<object.*?>',
        r'<embed.*?>'
    ]
    
    for pattern in xss_patterns:
        if re.search(pattern, input_string, re.IGNORECASE):
            return False
    
    return True

def validate_pagination_params(page: int, page_size: int) -> bool:
    """Validate pagination parameters"""
    
    if not isinstance(page, int) or not isinstance(page_size, int):
        return False
    
    if page < 1:
        return False
    
    if page_size < 1 or page_size > 100:
        return False
    
    return True
