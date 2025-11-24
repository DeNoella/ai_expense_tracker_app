# FinWise Diagrams

This directory contains all the diagrams for the FinWise Expense Tracker application.

## 📊 Available Diagrams

### 1. Activity Diagram (`activity-diagram.md`)
Shows the flow of activities and user interactions:
- User Registration & Login Flow
- Expense Management Flow
- AI Chat Flow
- Budget Management Flow

### 2. Data Flow Diagram (`data-flow-diagram.md`)
Shows how data flows through the system:
- Level 0 - Context Diagram
- Level 1 - System Overview
- Authentication Data Flow
- Expense Management Data Flow
- AI Chat Data Flow
- Budget Management Data Flow
- Complete System Data Flow

### 3. Sequence Diagram (`sequence-diagram.md`)
Shows the sequence of interactions between components:
- User Registration Sequence
- User Login Sequence
- Add Expense Sequence
- View Dashboard Sequence
- AI Chat Sequence
- Set Budget Sequence
- Delete Expense Sequence
- Complete Authentication Flow Sequence

## 🎨 How to View These Diagrams

### Option 1: GitHub/GitLab
These diagrams use Mermaid syntax and will render automatically on:
- GitHub (when viewing .md files)
- GitLab
- Many other markdown viewers

### Option 2: Online Mermaid Editor
1. Go to [Mermaid Live Editor](https://mermaid.live/)
2. Copy the code from any diagram file
3. Paste it into the editor
4. View the rendered diagram

### Option 3: VS Code Extension
1. Install "Markdown Preview Mermaid Support" extension
2. Open the .md file
3. Use Markdown Preview to view diagrams

### Option 4: Mermaid CLI
```bash
# Install Mermaid CLI
npm install -g @mermaid-js/mermaid-cli

# Generate PNG from diagram
mmdc -i activity-diagram.md -o activity-diagram.png
```

### Option 5: Include in Documentation
You can include these diagrams in your documentation by referencing the markdown files or copying the mermaid code blocks.

## 📝 Diagram Syntax

All diagrams use **Mermaid** syntax, which is:
- Text-based (easy to version control)
- Widely supported
- Can be rendered in many platforms
- Easy to modify and maintain

## 🔧 Customization

To customize these diagrams:
1. Open the respective .md file
2. Modify the Mermaid code within the ```mermaid code blocks
3. Save and view the updated diagram

## 📚 Mermaid Documentation

For more information on Mermaid syntax:
- [Mermaid Documentation](https://mermaid.js.org/)
- [Flowchart Syntax](https://mermaid.js.org/syntax/flowchart.html)
- [Sequence Diagram Syntax](https://mermaid.js.org/syntax/sequenceDiagram.html)

## 🎯 Usage

These diagrams can be used for:
- Documentation
- Presentations
- System design reviews
- Onboarding new developers
- Understanding system architecture

