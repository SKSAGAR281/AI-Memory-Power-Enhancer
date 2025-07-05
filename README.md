# Memory Enhancer Pro - AI-Powered Cognitive Training

A comprehensive memory training application with Flask backend, interactive tests, AI-powered tips, and feedback loops.

## Features

### Frontend (React + TypeScript)
- **Interactive Memory Tests**: Working memory, pattern memory, and word sequence tests
- **AI-Powered Tips**: Personalized recommendations based on performance
- **Feedback Loop**: User feedback collection and performance analytics
- **Progress Tracking**: Detailed analytics and trend analysis
- **Personalized Plans**: Custom training programs based on user goals
- **Memory Guide**: Comprehensive learning resources

### Backend (Flask + Python)
- **Dynamic Test Generation**: Adaptive difficulty based on user performance
- **AI Tips Engine**: Personalized recommendations using performance data
- **Performance Analytics**: Advanced progress tracking and trend analysis
- **Feedback System**: Collect and analyze user feedback
- **RESTful API**: Clean API design for frontend-backend communication

## Setup Instructions

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit .env file with your OpenAI API key (optional)
   ```

3. **Run the Flask backend:**
   ```bash
   cd backend
   python app.py
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables (optional):**
   ```bash
   # Create .env file in root directory
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## API Endpoints

### Test Generation
- `POST /api/generate-test` - Generate adaptive memory tests
- `POST /api/submit-test-result` - Submit test results and get feedback

### AI Features
- `POST /api/get-ai-tip` - Get personalized AI-powered tips
- `POST /api/adaptive-difficulty` - Get recommended difficulty level

### Analytics & Feedback
- `POST /api/get-performance-analytics` - Detailed performance analysis
- `POST /api/submit-feedback` - Submit user feedback
- `POST /api/register-user` - Register user profile

### Health Check
- `GET /api/health` - Backend health status

## Interactive Memory Tests

### Working Memory Test
- Memorize number sequences and recall in reverse order
- Adaptive difficulty based on sequence length and time limits
- Scoring based on accuracy and partial credit

### Pattern Memory Test
- Memorize visual patterns on a grid
- Variable grid sizes and pattern complexity
- Click-based interaction for pattern recreation

### Word Sequence Test
- Memorize word lists in specific order
- Difficulty varies by word complexity and list length
- Text input for sequence recall

## AI-Powered Features

### Personalized Tips
- Performance-based recommendations
- Learning style adaptation
- Goal-oriented suggestions
- Fallback to curated tips when AI is unavailable

### Adaptive Difficulty
- Real-time difficulty adjustment based on recent performance
- Test-type specific recommendations
- Progressive challenge scaling

### Performance Analytics
- Trend analysis using linear regression
- Consistency scoring
- Performance by test type
- Improvement tracking over time

## Feedback Loop System

### User Feedback Collection
- Rating system (1-5 stars)
- Categorized feedback (general, difficulty, features)
- Optional comments and context
- Real-time feedback submission

### Performance Analytics Dashboard
- Overall performance metrics
- Test-type specific analysis
- Trend direction indicators
- Recent vs historical comparison

## Offline Mode

The application gracefully handles backend unavailability:
- Visual indicators for backend status
- Disabled features when backend is offline
- Fallback to local storage for basic functionality
- Predefined tips when AI features are unavailable

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for development and building

### Backend
- Flask web framework
- NumPy and scikit-learn for analytics
- OpenAI integration for AI tips (optional)
- CORS enabled for cross-origin requests

## Development

### Running Both Services
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
npm run dev
```

### Building for Production
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## License

This project is licensed under the MIT License.