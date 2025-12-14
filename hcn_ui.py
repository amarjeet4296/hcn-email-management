"""
HCN Email Management System - Rich Terminal UI
==============================================
Beautiful terminal UI with Excel-like table view using Rich library.
"""

import os
import sys
from datetime import datetime
from typing import Optional
import pandas as pd
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.layout import Layout
from rich.live import Live
from rich.progress import Progress, SpinnerColumn, BarColumn, TextColumn
from rich.text import Text
from rich.align import Align
from rich import box
from sending_update import HCNEmailManager


class ExcelTableView:
    """Excel-like table renderer with pagination"""

    def __init__(self, rows_per_page=20):
        self.rows_per_page = rows_per_page
        self.current_page = 1
        self.console = Console()

    def create_table(self, df, page=1):
        """Create a Rich table from DataFrame with pagination"""
        if df is None or len(df) == 0:
            table = Table(title="No Data Available", box=box.ROUNDED)
            return table, 0, 0

        # Filter relevant rows
        df['Status_lower'] = df['Status'].str.lower().str.strip()
        df_relevant = df[df['Status_lower'].isin(['confirmed', 'vouchered'])].copy()

        total_rows = len(df_relevant)
        total_pages = max(1, (total_rows + self.rows_per_page - 1) // self.rows_per_page)
        page = max(1, min(page, total_pages))

        start_idx = (page - 1) * self.rows_per_page
        end_idx = min(start_idx + self.rows_per_page, total_rows)

        df_page = df_relevant.iloc[start_idx:end_idx]

        # Create table
        table = Table(
            title=f"HCN Bookings - Page {page}/{total_pages}",
            box=box.DOUBLE_EDGE,
            header_style="bold magenta",
            show_lines=True
        )

        # Add columns
        table.add_column("#", justify="right", style="cyan", width=4)
        table.add_column("FileNo", style="cyan", width=10)
        table.add_column("Guest Name", style="white", width=20)
        table.add_column("Hotel Name", style="white", width=25)
        table.add_column("Status", justify="center", width=12)
        table.add_column("Email", justify="center", width=8)
        table.add_column("HCN", style="green", width=15)
        table.add_column("Issue", justify="center", width=12)

        # Add rows with color coding
        for idx, (_, row) in enumerate(df_page.iterrows(), start=start_idx + 1):
            # Determine row color based on issue status
            issue = str(row.get('Issue', '')).strip() if pd.notna(row.get('Issue')) else ''
            hcn = str(row.get('SupplierHCN', '-')).strip() if pd.notna(row.get('SupplierHCN')) else '-'
            email_sent = str(row.get('EmailSent', 'No')).strip()

            # Status icon and color
            if issue == 'Received':
                status_display = "[green]✅ Received[/green]"
                hcn_display = f"[green bold]{hcn}[/green bold]"
            elif issue == 'Critical':
                status_display = "[red]🚨 Critical[/red]"
                hcn_display = "[red]-[/red]"
            elif issue == 'Non Critical':
                status_display = "[blue]ℹ️  Non-Crit[/blue]"
                hcn_display = "[yellow]-[/yellow]"
            else:
                status_display = "[yellow]⏳ Pending[/yellow]"
                hcn_display = "[dim]-[/dim]"

            # Email sent status
            email_display = "[green]✓[/green]" if email_sent == 'Yes' else "[dim]-[/dim]"

            # Truncate long names
            guest_name = str(row.get('GuestName', ''))[:18]
            hotel_name = str(row.get('HotelName', ''))[:23]
            file_no = str(row.get('FileNo', ''))

            table.add_row(
                str(idx),
                file_no,
                guest_name,
                hotel_name,
                status_display,
                email_display,
                hcn_display,
                issue if issue else "[dim]Pending[/dim]"
            )

        return table, page, total_pages


class HCNDashboard:
    """Main dashboard UI controller"""

    def __init__(self):
        self.console = Console()
        self.manager = None
        self.table_view = ExcelTableView(rows_per_page=15)
        self.current_page = 1
        self.is_processing = False
        self.last_status = ""
        self.progress_info = {"message": "", "current": 0, "total": 0}

    def create_header(self):
        """Create header panel"""
        current_time = datetime.now().strftime("%I:%M:%S %p")
        header_text = Text()
        header_text.append("HCN EMAIL MANAGEMENT SYSTEM", style="bold blue")
        header_text.append(" " * 10)
        header_text.append(f"[{current_time}]", style="cyan")
        header_text.append("  ")
        header_text.append("● Online", style="green")

        return Panel(
            Align.center(header_text),
            style="bold white on blue",
            box=box.DOUBLE
        )

    def create_summary_panel(self, stats):
        """Create summary statistics panel"""
        summary_text = Text()
        summary_text.append("Summary: ", style="bold white")
        summary_text.append(f"✅ {stats['received']} Received", style="green")
        summary_text.append(" | ", style="white")
        summary_text.append(f"🚨 {stats['critical']} Critical", style="red")
        summary_text.append(" | ", style="white")
        summary_text.append(f"⏳ {stats['pending']} Pending", style="yellow")
        summary_text.append(" | ", style="white")
        summary_text.append(f"ℹ️  {stats['non_critical']} Non-Crit", style="blue")
        summary_text.append(" | ", style="white")
        summary_text.append(f"📧 {stats['emailed']} Emailed", style="cyan")

        return Panel(summary_text, style="white", box=box.ROUNDED)

    def create_menu_panel(self):
        """Create action menu panel"""
        menu_text = Text()
        menu_text.append("ACTIONS: ", style="bold yellow")
        menu_text.append("[1] ", style="cyan")
        menu_text.append("Process All  ", style="white")
        menu_text.append("[2] ", style="cyan")
        menu_text.append("Refresh  ", style="white")
        menu_text.append("[3] ", style="cyan")
        menu_text.append("Show Status  ", style="white")
        menu_text.append("[N] ", style="cyan")
        menu_text.append("Next Page  ", style="white")
        menu_text.append("[P] ", style="cyan")
        menu_text.append("Prev Page  ", style="white")
        menu_text.append("[Q] ", style="cyan")
        menu_text.append("Quit", style="white")

        return Panel(menu_text, style="yellow", box=box.ROUNDED)

    def create_progress_panel(self):
        """Create progress/status panel"""
        if self.is_processing:
            progress_text = Text()
            progress_text.append("📊 Processing... ", style="bold yellow")
            if self.progress_info['total'] > 0:
                progress_text.append(
                    f"{self.progress_info['message']} "
                    f"[{self.progress_info['current']}/{self.progress_info['total']}]",
                    style="cyan"
                )
            else:
                progress_text.append(self.progress_info['message'], style="cyan")
            return Panel(progress_text, style="yellow", box=box.ROUNDED)
        elif self.last_status:
            return Panel(
                Text(self.last_status, style="green"),
                style="green",
                box=box.ROUNDED
            )
        else:
            return Panel(
                Text("Ready. Select an action from the menu.", style="dim"),
                style="dim",
                box=box.ROUNDED
            )

    def progress_callback(self, message, current, total):
        """Callback for progress updates"""
        self.progress_info = {
            "message": message,
            "current": current or 0,
            "total": total or 0
        }

    def status_callback(self, status_type, message, data):
        """Callback for status updates"""
        self.last_status = message
        if status_type == 'emails_completed':
            self.is_processing = False

    def render_dashboard(self, df=None):
        """Render the complete dashboard"""
        layout = Layout()

        # Create layout structure
        layout.split_column(
            Layout(name="header", size=3),
            Layout(name="summary", size=3),
            Layout(name="main"),
            Layout(name="menu", size=3),
            Layout(name="status", size=3)
        )

        # Get stats
        if self.manager:
            stats = self.manager.get_summary_stats()
        else:
            stats = {'total': 0, 'received': 0, 'critical': 0, 'non_critical': 0, 'pending': 0, 'emailed': 0, 'reminded': 0}

        # Populate layout
        layout["header"].update(self.create_header())
        layout["summary"].update(self.create_summary_panel(stats))

        # Create table
        if df is not None:
            table, current_page, total_pages = self.table_view.create_table(df, self.current_page)
            self.current_page = current_page
            layout["main"].update(Panel(table, box=box.ROUNDED))
        else:
            layout["main"].update(Panel(Text("Loading data...", style="yellow"), box=box.ROUNDED))

        layout["menu"].update(self.create_menu_panel())
        layout["status"].update(self.create_progress_panel())

        return layout

    def refresh_data(self):
        """Refresh data from Excel"""
        if self.manager:
            return self.manager.read_excel()
        return None

    def process_all(self):
        """Run the full email processing workflow"""
        self.is_processing = True
        self.last_status = "Starting process..."
        self.manager.process_all()
        self.is_processing = False
        self.last_status = "✅ Processing complete!"

    def show_status(self):
        """Show detailed status"""
        self.last_status = "Displaying current status..."
        self.manager.show_status()
        self.last_status = "✅ Status displayed"

    def run(self):
        """Main UI loop"""
        # Initialize manager with callbacks
        self.manager = HCNEmailManager(
            progress_callback=self.progress_callback,
            status_callback=self.status_callback
        )

        # Initial data load
        df = self.refresh_data()

        self.console.clear()
        self.console.print(self.render_dashboard(df))

        # Main loop
        while True:
            self.console.print("\n[bold cyan]Enter command:[/bold cyan] ", end="")
            choice = input().strip().lower()

            if choice == 'q':
                self.console.print("[yellow]Goodbye![/yellow]")
                break
            elif choice == '1':
                self.console.clear()
                self.console.print("[bold green]Starting full process...[/bold green]")
                self.process_all()
                df = self.refresh_data()
                self.console.clear()
                self.console.print(self.render_dashboard(df))
            elif choice == '2':
                df = self.refresh_data()
                self.last_status = "✅ Data refreshed"
                self.console.clear()
                self.console.print(self.render_dashboard(df))
            elif choice == '3':
                self.console.clear()
                self.show_status()
                input("\nPress Enter to return to dashboard...")
                self.console.clear()
                self.console.print(self.render_dashboard(df))
            elif choice == 'n':
                self.current_page += 1
                self.console.clear()
                self.console.print(self.render_dashboard(df))
            elif choice == 'p':
                self.current_page = max(1, self.current_page - 1)
                self.console.clear()
                self.console.print(self.render_dashboard(df))
            else:
                self.last_status = "❌ Invalid command"
                self.console.clear()
                self.console.print(self.render_dashboard(df))


def main():
    """Entry point for Rich UI"""
    dashboard = HCNDashboard()
    try:
        dashboard.run()
    except KeyboardInterrupt:
        print("\n\nExiting...")
        sys.exit(0)


if __name__ == "__main__":
    main()
