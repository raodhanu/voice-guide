### Backend Setup
1. Open a terminal in VS Code and navigate to the project root
2. Create a Python virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install the backend dependencies:
   ```
   pip install -r backend/requirements.txt
   ```
5. Create a `.env` file in the root directory with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```
6. Run the backend server:
   ```
   cd backend
   uvicorn main:app --reload --port 8000
   ```