from pathlib import Path
import sys
import json
from datetime import datetime

# Add phase6 to path
PHASE6_ROOT = Path(__file__).resolve().parents[1]
SRC_PATH = PHASE6_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from phase6_feedback.service import Phase6Service
from phase6_feedback.config import IMPROVEMENT_REPORT_PATH, FEEDBACK_EXPORT_PATH

def main():
    """Run Phase 6 feedback and improvement analysis"""
    print("Starting Phase 6: Feedback and Improvement Layer")
    
    # Initialize service
    phase6_service = Phase6Service()
    
    # Generate analytics
    print("Generating feedback analytics...")
    analytics = phase6_service.get_feedback_analytics(days=30)
    
    # Generate improvement report
    print("Generating improvement report...")
    improvement_report = phase6_service.get_improvement_report(days=30)
    
    # Export feedback data
    print("Exporting feedback data...")
    export_data = phase6_service.export_feedback_data(days=30)
    
    # Save export data
    FEEDBACK_EXPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(FEEDBACK_EXPORT_PATH, 'w') as f:
        json.dump(export_data, f, indent=2, default=str)
    
    # Display summary
    print("\nPhase 6 Analysis Summary:")
    print(f"   Total Feedback: {analytics.total_feedback_count}")
    print(f"   Satisfaction Score: {analytics.satisfaction_score:.2f}")
    print(f"   Conversion Rate: {analytics.conversion_rate:.2%}")
    print(f"   Click-Through Rate: {analytics.click_through_rate:.2%}")
    
    if analytics.top_performing_restaurants:
        print(f"   Top Restaurant: {analytics.top_performing_restaurants[0]['restaurant_name']}")
    
    print(f"\nImprovement Insights: {len(improvement_report.key_insights)}")
    for insight in improvement_report.key_insights:
        print(f"   - {insight.insight_type}: {insight.description[:80]}...")
    
    print(f"\nPrompt Suggestions: {len(improvement_report.prompt_suggestions)}")
    for suggestion in improvement_report.prompt_suggestions:
        print(f"   - {suggestion.reasoning[:80]}...")
    
    print(f"\nRanking Adjustments: {len(improvement_report.ranking_adjustments)}")
    for adjustment in improvement_report.ranking_adjustments:
        print(f"   - {adjustment.factor_name}: {adjustment.current_weight} → {adjustment.suggested_weight}")
    
    print(f"\nFiles Generated:")
    print(f"   - Improvement Report: {IMPROVEMENT_REPORT_PATH}")
    print(f"   - Feedback Export: {FEEDBACK_EXPORT_PATH}")
    
    print("\nPhase 6 completed successfully!")
    print("Review the generated reports for actionable improvement suggestions.")

if __name__ == "__main__":
    main()
