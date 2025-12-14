<<<<<<< HEAD
# hcn-email-management
hcn-email-management application
=======
# HCN Email Management System

Complete email management system for handling Hotel Confirmation Numbers (HCN) with **THREE** user interfaces to choose from!

## 🚀 Quick Start

### Option 1: Web UI (Streamlit) - Recommended ⭐
```bash
streamlit run streamlit_app.py
```
**Features:** Interactive dashboard, charts, filters, Excel-like table, mobile-friendly

### Option 2: Terminal UI (Rich)
```bash
python main_ui.py
```
**Features:** Beautiful terminal interface, Excel-like table view, real-time progress

### Option 3: Original CLI
```bash
python sending_update.py
```
**Features:** Classic menu-driven interface, lightweight, scriptable

## 📦 Installation

```bash
# Clone or download the project
cd hcn

# Install dependencies
pip install -r requirements.txt
```

## ✨ Features

- ✅ **Automated Email Management**: Send HCN requests, check inbox, send reminders
- ✅ **OpenAI Integration**: Intelligent email analysis and categorization
- ✅ **Excel Integration**: Read/write booking data from Excel files
- ✅ **Multiple Interfaces**: Web, Terminal, or CLI - your choice!
- ✅ **Real-time Progress**: Visual feedback during operations
- ✅ **Data Export**: Download filtered data as CSV
- ✅ **Visual Analytics**: Charts and statistics (Streamlit UI)

## 🎨 User Interfaces

### 1. Streamlit Web UI (NEW!)

**Launch:**
```bash
streamlit run streamlit_app.py
# or use launcher: ./run_web_ui.sh
```

**What you get:**
- 🌐 Modern web interface in your browser
- 📊 Interactive dashboard with metrics and charts
- 📋 Excel-like data table with sorting and filtering
- 📥 One-click CSV export
- 📱 Mobile-responsive design
- 🎯 Visual status indicators and alerts

**Perfect for:**
- Users who prefer graphical interfaces
- Teams needing shared access
- Mobile or tablet access
- Data visualization needs

### 2. Rich Terminal UI

**Launch:**
```bash
python main_ui.py
```

**What you get:**
- 💻 Beautiful terminal-based interface
- 📊 Excel-like table with pagination
- 🎨 Color-coded status indicators
- ⚡ Real-time progress bars
- ⌨️ Keyboard-driven navigation

**Perfect for:**
- Terminal enthusiasts
- SSH/remote server access
- Lightweight resource usage
- Fast keyboard navigation

### 3. Original CLI

**Launch:**
```bash
python sending_update.py
```

**What you get:**
- 📝 Simple menu-driven interface
- 🔧 Classic command-line experience
- 💾 Minimal dependencies
- 🤖 Scriptable operations

**Perfect for:**
- Automation scripts
- Legacy systems
- Minimal resource environments
- Quick one-off tasks

## 📊 Visual Comparison

| Feature | Streamlit Web | Rich Terminal | Original CLI |
|---------|---------------|---------------|--------------|
| Interface | Browser | Terminal | Terminal |
| Visual Appeal | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Ease of Use | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Charts/Graphs | ✅ | ❌ | ❌ |
| Filters | ✅ | ❌ | ❌ |
| Export Data | ✅ CSV | ❌ | ❌ |
| Mobile Access | ✅ | ❌ | ❌ |
| Multi-user | ✅ | ❌ | ❌ |
| Resource Usage | Higher | Medium | Low |

## 🔧 Configuration

Edit `sending_update.py` to configure:

```python
# Gmail credentials
GMAIL_ADDRESS = "your_email@gmail.com"
GMAIL_APP_PASSWORD = "your_app_password"

# OpenAI API Key
OPENAI_API_KEY = "sk-your-api-key"

# Excel file
EXCEL_FILE_PATH = "HCN1.xlsx"
SHEET_NAME = "HotelReport (1)"

# Settings
REMINDER_AFTER_HOURS = 2
DAYS_TO_CHECK = 7
```

## 📖 How It Works

1. **Read Bookings**: Loads confirmed/vouchered bookings from Excel
2. **Send Emails**: Sends HCN request emails to hotels
3. **Check Inbox**: Monitors Gmail for replies
4. **AI Analysis**: Uses OpenAI to categorize responses:
   - ✅ **Received**: HCN provided
   - 🚨 **Critical**: Cannot provide HCN
   - ⏳ **Pending**: No response yet
   - ℹ️ **Non-Critical**: Acknowledged, processing
5. **Auto-Remind**: Sends reminders after 2 hours if no HCN
6. **Update Excel**: Saves all data back to Excel file

## 📁 Project Structure

```
hcn/
├── streamlit_app.py         # Streamlit web UI (NEW!)
├── run_web_ui.sh           # Web UI launcher (macOS/Linux)
├── run_web_ui.bat          # Web UI launcher (Windows)
├── hcn_ui.py               # Rich terminal UI
├── main_ui.py              # Terminal UI entry point
├── sending_update.py       # Core logic and original CLI
├── receive_email.py        # Email receiving utilities
├── HCN1.xlsx              # Excel data file
├── requirements.txt        # Dependencies
├── README.md              # This file
├── STREAMLIT_GUIDE.md     # Streamlit UI documentation
├── STREAMLIT_SUMMARY.md   # Streamlit implementation details
├── UI_USAGE.md            # Rich terminal UI guide
└── IMPLEMENTATION_SUMMARY.md # Rich UI implementation details
```

## 📚 Documentation

- **[README.md](README.md)** - This overview (start here!)
- **[STREAMLIT_GUIDE.md](STREAMLIT_GUIDE.md)** - Complete Streamlit web UI guide
- **[STREAMLIT_SUMMARY.md](STREAMLIT_SUMMARY.md)** - Streamlit technical details
- **[UI_USAGE.md](UI_USAGE.md)** - Rich terminal UI user guide
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Rich terminal UI technical details

## 🎯 Common Workflows

### Daily Use (Web UI)
```bash
# Launch web interface
streamlit run streamlit_app.py

# In browser:
# 1. Review dashboard metrics
# 2. Click "Process All" button
# 3. Check critical issues
# 4. Download updated data
```

### Daily Use (Terminal UI)
```bash
# Launch terminal UI
python main_ui.py

# Press 1: Process All
# Press 2: Refresh
# Press 3: Show Status
# Press Q: Quit
```

### Daily Use (Original CLI)
```bash
# Launch CLI
python sending_update.py

# Choose option 1: Run Process
# Choose option 2: Show Status
# Choose option 3: Exit
```

## 🔐 Security Notes

- Store credentials securely (consider environment variables)
- Gmail App Passwords recommended over regular passwords
- OpenAI API key should be kept private
- Excel file contains sensitive booking data

## 🐛 Troubleshooting

### Web UI won't start?
```bash
pip install --upgrade streamlit plotly
streamlit run streamlit_app.py --server.port 8502
```

### Terminal UI not displaying correctly?
- Ensure terminal supports UTF-8 and colors
- Try maximizing terminal window
- Use iTerm2 (Mac) or Windows Terminal for best results

### Data not loading?
- Check if HCN1.xlsx exists in the directory
- Verify Excel file path in sending_update.py
- Ensure proper file permissions

### Import errors?
```bash
pip install -r requirements.txt
```

## 📦 Dependencies

```
streamlit>=1.28.0    # Web UI framework
plotly>=5.0.0        # Interactive charts
rich>=13.0.0         # Terminal UI
pandas>=2.0.0        # Data manipulation
openpyxl>=3.0.0      # Excel handling
openai>=1.0.0        # AI analysis
```

## 🚀 Deployment

### Local Network Access (Web UI)
```bash
streamlit run streamlit_app.py --server.address 0.0.0.0
# Access from other devices: http://YOUR_IP:8501
```

### Cloud Deployment (Web UI)
- **Streamlit Cloud**: Free hosting for Streamlit apps
- **Heroku/Railway/Render**: Easy deployment platforms
- **AWS/GCP/Azure**: Full control deployment

## 💡 Tips

1. **Choose the right UI for your needs**:
   - Web UI for visualization and sharing
   - Terminal UI for speed and elegance
   - CLI for automation and scripting

2. **Start with Web UI** if you're new to the system

3. **Use filters** (Web UI) to focus on specific bookings

4. **Export data regularly** for backups and analysis

5. **Monitor critical issues** daily for quick resolution

## 🎓 Learning Path

1. **Beginner**: Start with Streamlit Web UI
   - Intuitive interface
   - Visual feedback
   - Easy to understand

2. **Intermediate**: Try Rich Terminal UI
   - Learn keyboard shortcuts
   - Faster navigation
   - Beautiful terminal experience

3. **Advanced**: Master Original CLI
   - Scriptable operations
   - Integration with other tools
   - Automation possibilities

## 🤝 Support

For issues or questions:
1. Check relevant documentation (see links above)
2. Review error messages in terminal/browser
3. Verify configuration settings
4. Ensure all dependencies installed

## 📝 License

[Your license here]

## 🙏 Acknowledgments

Built with:
- [Streamlit](https://streamlit.io/) - Web UI framework
- [Rich](https://rich.readthedocs.io/) - Terminal formatting
- [Plotly](https://plotly.com/) - Interactive charts
- [OpenAI](https://openai.com/) - AI email analysis
- [Pandas](https://pandas.pydata.org/) - Data manipulation

---

## 🎉 Quick Command Reference

```bash
# Web UI (Recommended)
streamlit run streamlit_app.py

# Terminal UI
python main_ui.py

# Original CLI
python sending_update.py

# Install dependencies
pip install -r requirements.txt

# Update dependencies
pip install --upgrade -r requirements.txt
```

**Choose your interface and start managing HCN emails with ease!** 🚀

For detailed guides, see:
- Web UI: [STREAMLIT_GUIDE.md](STREAMLIT_GUIDE.md)
- Terminal UI: [UI_USAGE.md](UI_USAGE.md)
>>>>>>> 85c9260 (Initial commit: HCN Email Management System)
