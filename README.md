Collecting workspace information# RSKD Talent - HR Management Tool

RSKD Talent is a full-stack HR management tool designed to streamline the candidate recruitment process. It provides an intuitive interface for managing candidates, tracking their progress through different recruitment stages, and generating reports.


### Data Import & Export
- Import candidates via CSV
- Generate PDF reports for candidates

### Job Postings
- View current job openings
- Track application statistics

## Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) - React framework
- [React](https://react.dev/) - UI library
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Lucide React](https://lucide.dev/) - Icon library

### Backend
- [FastAPI](https://fastapi.tiangolo.com/) - API framework
- [SQLAlchemy](https://www.sqlalchemy.org/) - ORM
- [SQLite](https://www.sqlite.org/) - Database
- [Pydantic](https://pydantic-docs.helpmanual.io/) - Data validation


## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv tool
   ```

3. Activate the virtual environment:
   - Windows: `tool\Scripts\activate`
   - macOS/Linux: `source tool/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Run the server:
   ```
   uvicorn main:app --reload
   ```
   
The API will be available at http://localhost:8000

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

The application will be available at http://localhost:3000

## Usage

### Importing Candidates
1. Click on the "Import Candidates" button on the dashboard
2. Upload a CSV file with the required format
3. The CSV should contain: name, avatar, rating, stage, role, files, email, phone, experience

### Managing Candidates
1. View all candidates in the table
2. Click on a candidate to view their details
3. Use the "Move to Next Step" button to advance a candidate's stage
4. Use the "Reject" button to reject a candidate
5. Generate a PDF report with the "PDF" button

