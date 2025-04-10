# VoiceGuide: Your Multilingual Voice-Activated Guide to Dubai

## Project Overview

**VoiceGuide** is an intelligent multilingual tourism companion designed to help international visitors navigate Dubai with ease. Using advanced AI technology and voice recognition, VoiceGuide bridges language barriers and provides real-time assistance for tourists regardless of their native language.

### 🏆 Dubai AI Challenge Submission
This project was developed as part of the **Future Tech Challenge: Building AI Application** 2025, which is part of the Dubai Festival. VoiceGuide addresses the common challenges faced by international tourists in Dubai, including language barriers, cultural misunderstandings, and navigation difficulties.

## 🌟 Key Features

### 🗣️ Multilingual Voice Interface
- Natural conversation in 8 languages with automatic language detection
- Currently supports: English, Arabic, Chinese, Russian, Hindi, Spanish, German, and French
- Voice and text input options available

### 🧠 Multi-Agent AI System
- Specialized AI agents for different tasks:
  - **Navigation Agent**: Provides directions and location information
  - **Cultural Agent**: Offers guidance on customs and etiquette
  - **Recommendation Agent**: Suggests attractions, restaurants, and activities

### 📍 Location-Based Services
- Interactive map integration with Google Maps
- Visual directions and location highlights
- Information about key attractions, historical sites, and hidden gems

### 🕌 Cultural Assistant
- Detailed cultural etiquette guidance
- Do's and Don'ts for specific situations
- Respect for local customs and religious practices

### 📱 Responsive Web Interface
- Works across all devices (mobile, tablet, desktop)
- Clean, intuitive design inspired by Arabic aesthetics
- Voice and text conversation history with download options

## 🖼️ Key Interface Descriptions

### Main Interface
**[Image Description: Main VoiceGuide Interface]**

The main interface features a clean, elegant design with:
- A central microphone button for voice input
- Language selection panel with 8 supported languages
- Side-by-side display showing user queries and AI responses
- Arabic-inspired design elements with a Dubai skyline background

### Cultural Etiquette Guidance
**[Image Description: Cultural Guidance Panel]**

The cultural guidance panel provides:
- Category-specific etiquette information (e.g., dress code, greetings)
- Clear "Do's" section with green highlighted recommendations
- "Don'ts" section with red highlighted warnings
- Cultural context explanations with Arabic-inspired visual elements

### Location Services
**[Image Description: Interactive Map Interface]**

The location services feature includes:
- Interactive Google Maps integration showing Dubai landmarks
- Location information cards with descriptions and categories
- Navigation options with route visualization
- Points of interest with custom markers and info windows

## 🔧 Technology Stack

### Frontend
- **React.js**: For building the responsive user interface
- **Tailwind CSS**: For styling and visual design
- **Web Speech API**: For voice recognition and text-to-speech functionality

### Backend
- **Node.js/Express**: For API endpoints and server-side logic
- **OpenAI API**: For natural language understanding and generation
- **Google Maps API**: For location and navigation services

### AI and NLP
- **LangChain**: Framework for building the multi-agent system
- **Vector Database**: For knowledge retrieval about Dubai
- **Retrieval-Augmented Generation (RAG)**: For delivering accurate, up-to-date information

## 🚀 How It Works

1. **Speak or Type**: Users can ask questions or request information in their preferred language
2. **Process**: VoiceGuide translates and processes the request using AI
3. **Respond**: Users receive voice responses with additional visual information when needed

## 🌈 Use Cases

- **International Tourists**: Navigate Dubai without language barriers
- **Business Travelers**: Quickly find information with limited time
- **New Expatriates**: Learn cultural norms and navigate the city
- **Accessibility-Focused Travelers**: Use voice interface for hands-free assistance

## 🔮 Future Enhancements

- **Offline Mode**: Basic functionality without internet connection
- **AR Integration**: Augmented reality features for landmark identification
- **More Languages**: Expanding language support to include more global languages
- **Personalization**: Learning user preferences over time
- **Event Integration**: Real-time information about local events and activities

## 🧑‍💻 Team

This project was developed by Suman Rao as a personal learning project for the Dubai AI Challenge, combining AI technology with practical tourism applications.

## 🚀 Running the Application Locally

Follow these steps to set up and run the VoiceGuide application on your local machine:

### Prerequisites
1. Node.js (v16+) and npm installed
2. Python 3.8+ installed
3. Visual Studio Code with Python and JavaScript/TypeScript extensions

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

### Frontend Setup
1. Open a new terminal (keep the backend running)
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install frontend dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. The application should now be running at http://localhost:5173/

### Notes
- For the Google Maps functionality to work properly, ensure your API key has the appropriate permissions
- Speech recognition works best in Chrome and Edge browsers
- For best results, use a microphone in a quiet environment

## 📝 License

```
MIT License

Copyright (c) 2025 Suman Rao

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

This project is licensed under the MIT License - see the full license text above or the LICENSE file for details.

## 💌 Contact

For any questions or feedback about the project, please reach out via LinkedIn.

---

*VoiceGuide - Bridging cultures through conversation*