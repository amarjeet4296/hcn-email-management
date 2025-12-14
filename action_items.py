"""
Action Items Management for HCN Bookings
Tracks all actions taken on each booking
"""
import json
import os
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

ACTION_ITEMS_FILE = "action_items.json"

class ActionItem(BaseModel):
    id: str
    booking_id: int
    action_type: str  # e.g., "email_sent", "reminder_sent", "hcn_received", "issue_marked", "note_added"
    description: str
    performed_by: str  # username
    timestamp: str
    metadata: Optional[Dict[str, Any]] = None

class ActionItemsManager:
    """Manager for booking action items"""

    @staticmethod
    def load_action_items() -> Dict[int, List[Dict]]:
        """Load action items from file"""
        if not os.path.exists(ACTION_ITEMS_FILE):
            return {}

        with open(ACTION_ITEMS_FILE, 'r') as f:
            return json.load(f)

    @staticmethod
    def save_action_items(items: Dict[int, List[Dict]]):
        """Save action items to file"""
        with open(ACTION_ITEMS_FILE, 'w') as f:
            json.dump(items, f, indent=2)

    @staticmethod
    def add_action_item(booking_id: int, action_type: str, description: str,
                       performed_by: str, metadata: Optional[Dict] = None) -> ActionItem:
        """Add a new action item for a booking"""
        items = ActionItemsManager.load_action_items()

        # Initialize booking's action list if it doesn't exist
        if str(booking_id) not in items:
            items[str(booking_id)] = []

        # Create new action item
        action_id = f"{booking_id}_{len(items[str(booking_id)]) + 1}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        action_item = {
            "id": action_id,
            "booking_id": booking_id,
            "action_type": action_type,
            "description": description,
            "performed_by": performed_by,
            "timestamp": datetime.now().isoformat(),
            "metadata": metadata or {}
        }

        items[str(booking_id)].append(action_item)
        ActionItemsManager.save_action_items(items)

        return ActionItem(**action_item)

    @staticmethod
    def get_booking_actions(booking_id: int) -> List[ActionItem]:
        """Get all action items for a specific booking"""
        items = ActionItemsManager.load_action_items()
        booking_items = items.get(str(booking_id), [])
        return [ActionItem(**item) for item in booking_items]

    @staticmethod
    def get_all_actions() -> Dict[int, List[ActionItem]]:
        """Get all action items grouped by booking_id"""
        items = ActionItemsManager.load_action_items()
        result = {}
        for booking_id, actions in items.items():
            result[int(booking_id)] = [ActionItem(**item) for item in actions]
        return result

    @staticmethod
    def delete_action_item(action_id: str) -> bool:
        """Delete a specific action item"""
        items = ActionItemsManager.load_action_items()

        for booking_id, actions in items.items():
            for i, action in enumerate(actions):
                if action['id'] == action_id:
                    del items[booking_id][i]
                    ActionItemsManager.save_action_items(items)
                    return True
        return False

    @staticmethod
    def get_recent_actions(limit: int = 50) -> List[ActionItem]:
        """Get the most recent action items across all bookings"""
        items = ActionItemsManager.load_action_items()
        all_actions = []

        for booking_id, actions in items.items():
            all_actions.extend([ActionItem(**item) for item in actions])

        # Sort by timestamp (newest first)
        all_actions.sort(key=lambda x: x.timestamp, reverse=True)

        return all_actions[:limit]
