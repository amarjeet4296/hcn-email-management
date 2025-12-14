#!/usr/bin/env python3
"""
HCN Email Management System - Rich UI Entry Point
=================================================
Launch the beautiful terminal UI for the HCN Email Management System.

Usage:
    python main_ui.py

Features:
- Excel-like table view of all bookings
- Real-time progress updates
- Color-coded status indicators
- Interactive menu system
- Live statistics dashboard
"""

import sys
import os

# Ensure the script can find the modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from hcn_ui import main

if __name__ == "__main__":
    print("=" * 60)
    print("HCN EMAIL MANAGEMENT SYSTEM - RICH UI")
    print("=" * 60)
    print("\nInitializing terminal UI...")
    print("Please wait...\n")

    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        print("\nIf you encounter issues, try running the CLI version:")
        print("  python sending_update.py")
        sys.exit(1)
