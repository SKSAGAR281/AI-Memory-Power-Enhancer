from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta
import random
import numpy as np
from sklearn.linear_model import LinearRegression
import openai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI (you'll need to set your API key)
openai.api_key = os.getenv('OPENAI_API_KEY', 'your-openai-api-key-here')

# In-memory storage (in production, use a proper database)
users_data = {}
test_results = {}
feedback_data = {}

class MemoryTestGenerator:
    def __init__(self):
        self.difficulty_levels = {
            'easy': {'sequence_length': 4, 'time_limit': 10, 'complexity': 1},
            'medium': {'sequence_length': 6, 'time_limit': 8, 'complexity': 2},
            'hard': {'sequence_length': 8, 'time_limit': 6, 'complexity': 3}
        }
    
    def generate_working_memory_test(self, difficulty='medium'):
        config = self.difficulty_levels[difficulty]
        sequence = [random.randint(1, 9) for _ in range(config['sequence_length'])]
        
        return {
            'type': 'working_memory',
            'test_id': f"wm_{datetime.now().timestamp()}",
            'sequence': sequence,
            'reverse_sequence': sequence[::-1],
            'time_limit': config['time_limit'],
            'instructions': 'Memorize the sequence and enter it in reverse order',
            'difficulty': difficulty
        }
    
    def generate_pattern_memory_test(self, difficulty='medium'):
        config = self.difficulty_levels[difficulty]
        grid_size = 3 + config['complexity']
        pattern_count = 3 + config['complexity']
        
        pattern = []
        for _ in range(pattern_count):
            row = random.randint(0, grid_size - 1)
            col = random.randint(0, grid_size - 1)
            pattern.append({'row': row, 'col': col})
        
        return {
            'type': 'pattern_memory',
            'test_id': f"pm_{datetime.now().timestamp()}",
            'grid_size': grid_size,
            'pattern': pattern,
            'time_limit': config['time_limit'],
            'instructions': 'Memorize the highlighted squares and recreate the pattern',
            'difficulty': difficulty
        }
    
    def generate_word_sequence_test(self, difficulty='medium'):
        word_lists = {
            'easy': ['cat', 'dog', 'sun', 'car', 'book', 'tree', 'fish', 'bird'],
            'medium': ['elephant', 'mountain', 'keyboard', 'butterfly', 'telescope', 'umbrella', 'sandwich', 'bicycle'],
            'hard': ['phenomenon', 'architecture', 'psychology', 'mathematics', 'philosophy', 'technology', 'environment', 'communication']
        }
        
        config = self.difficulty_levels[difficulty]
        words = random.sample(word_lists[difficulty], config['sequence_length'])
        
        return {
            'type': 'word_sequence',
            'test_id': f"ws_{datetime.now().timestamp()}",
            'words': words,
            'time_limit': config['time_limit'],
            'instructions': 'Memorize the words in order and type them back',
            'difficulty': difficulty
        }

class AITipsGenerator:
    def __init__(self):
        self.tips_database = {
            'working_memory': [
                "Practice the 'chunking' technique: group information into smaller, manageable pieces",
                "Use visualization: create mental images to represent abstract information",
                "Try the dual n-back exercise to strengthen working memory capacity",
                "Practice mindfulness meditation to improve focus and attention control"
            ],
            'pattern_memory': [
                "Create stories or narratives that connect visual elements",
                "Use the method of loci: associate patterns with familiar locations",
                "Practice drawing patterns from memory to strengthen visual recall",
                "Break complex patterns into simpler geometric shapes"
            ],
            'word_sequence': [
                "Create acronyms using the first letters of words",
                "Build a story that incorporates all the words in sequence",
                "Use rhyming or alliteration to make words more memorable",
                "Practice spaced repetition: review words at increasing intervals"
            ],
            'general': [
                "Get 7-9 hours of quality sleep for optimal memory consolidation",
                "Exercise regularly to increase BDNF (brain-derived neurotrophic factor)",
                "Eat brain-healthy foods rich in omega-3 fatty acids",
                "Stay hydrated - even mild dehydration affects cognitive performance"
            ]
        }
    
    def get_personalized_tip(self, user_performance, test_type):
        # Analyze performance and provide targeted advice
        if user_performance < 60:
            difficulty_tips = [
                f"Focus on {test_type.replace('_', ' ')} exercises for 10-15 minutes daily",
                "Start with easier variations and gradually increase difficulty",
                "Don't get discouraged - improvement takes consistent practice"
            ]
            return random.choice(difficulty_tips + self.tips_database.get(test_type, []))
        elif user_performance < 80:
            return random.choice(self.tips_database.get(test_type, []))
        else:
            advanced_tips = [
                "Try increasing the difficulty level to continue challenging yourself",
                "Teach these techniques to others to reinforce your own learning",
                "Explore advanced memory techniques like the Major System"
            ]
            return random.choice(advanced_tips)
    
    async def generate_ai_tip(self, user_data, recent_performance):
        """Generate personalized AI tips using OpenAI"""
        try:
            prompt = f"""
            Based on this user's memory training data, provide a personalized tip:
            
            Recent Performance: {recent_performance}%
            Learning Style: {user_data.get('learning_style', 'mixed')}
            Goals: {', '.join(user_data.get('memory_goals', []))}
            Challenge Areas: {', '.join(user_data.get('challenge_areas', []))}
            
            Provide a specific, actionable tip (max 100 words) to help improve their memory performance.
            """
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            # Fallback to predefined tips if AI fails
            return self.get_personalized_tip(recent_performance, 'general')

class PerformanceAnalyzer:
    def __init__(self):
        pass
    
    def analyze_progress(self, user_id):
        if user_id not in test_results:
            return None
        
        results = test_results[user_id]
        if len(results) < 2:
            return None
        
        # Sort by date
        sorted_results = sorted(results, key=lambda x: x['date'])
        
        # Calculate trends
        scores = [r['score'] for r in sorted_results]
        dates = [(datetime.fromisoformat(r['date']) - datetime.fromisoformat(sorted_results[0]['date'])).days for r in sorted_results]
        
        if len(scores) > 1:
            # Linear regression for trend analysis
            X = np.array(dates).reshape(-1, 1)
            y = np.array(scores)
            model = LinearRegression().fit(X, y)
            trend_slope = model.coef_[0]
        else:
            trend_slope = 0
        
        # Performance metrics
        latest_score = scores[-1]
        average_score = np.mean(scores)
        improvement = scores[-1] - scores[0] if len(scores) > 1 else 0
        consistency = 100 - (np.std(scores) * 2)  # Lower std = higher consistency
        
        return {
            'latest_score': latest_score,
            'average_score': round(average_score, 1),
            'improvement': round(improvement, 1),
            'trend_slope': round(trend_slope, 3),
            'consistency': max(0, round(consistency, 1)),
            'total_tests': len(results),
            'trend_direction': 'improving' if trend_slope > 0 else 'declining' if trend_slope < 0 else 'stable'
        }

# Initialize components
test_generator = MemoryTestGenerator()
tips_generator = AITipsGenerator()
performance_analyzer = PerformanceAnalyzer()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/generate-test', methods=['POST'])
def generate_test():
    data = request.get_json()
    test_type = data.get('type', 'working_memory')
    difficulty = data.get('difficulty', 'medium')
    user_id = data.get('user_id')
    
    try:
        if test_type == 'working_memory':
            test = test_generator.generate_working_memory_test(difficulty)
        elif test_type == 'pattern_memory':
            test = test_generator.generate_pattern_memory_test(difficulty)
        elif test_type == 'word_sequence':
            test = test_generator.generate_word_sequence_test(difficulty)
        else:
            return jsonify({'error': 'Invalid test type'}), 400
        
        return jsonify({
            'success': True,
            'test': test,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/submit-test-result', methods=['POST'])
def submit_test_result():
    data = request.get_json()
    user_id = data.get('user_id')
    test_id = data.get('test_id')
    score = data.get('score')
    test_type = data.get('test_type')
    time_taken = data.get('time_taken')
    user_answer = data.get('user_answer')
    correct_answer = data.get('correct_answer')
    
    if not all([user_id, test_id, score is not None, test_type]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Store result
    if user_id not in test_results:
        test_results[user_id] = []
    
    result = {
        'test_id': test_id,
        'test_type': test_type,
        'score': score,
        'time_taken': time_taken,
        'user_answer': user_answer,
        'correct_answer': correct_answer,
        'date': datetime.now().isoformat(),
        'timestamp': datetime.now().timestamp()
    }
    
    test_results[user_id].append(result)
    
    # Generate personalized tip
    tip = tips_generator.get_personalized_tip(score, test_type)
    
    # Analyze performance
    analysis = performance_analyzer.analyze_progress(user_id)
    
    return jsonify({
        'success': True,
        'result_id': test_id,
        'personalized_tip': tip,
        'performance_analysis': analysis,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/get-ai-tip', methods=['POST'])
def get_ai_tip():
    data = request.get_json()
    user_id = data.get('user_id')
    
    if user_id not in users_data:
        return jsonify({'error': 'User not found'}), 404
    
    user_data = users_data[user_id]
    
    # Get recent performance
    recent_results = test_results.get(user_id, [])[-5:]  # Last 5 tests
    if recent_results:
        recent_performance = np.mean([r['score'] for r in recent_results])
    else:
        recent_performance = 50  # Default
    
    # For now, use predefined tips (implement AI integration as needed)
    tip = tips_generator.get_personalized_tip(recent_performance, 'general')
    
    return jsonify({
        'success': True,
        'tip': tip,
        'performance_context': recent_performance,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/submit-feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    user_id = data.get('user_id')
    feedback_type = data.get('type')  # 'tip_helpful', 'test_difficulty', 'general'
    rating = data.get('rating')  # 1-5 scale
    comment = data.get('comment', '')
    context = data.get('context', {})  # Additional context like test_id, tip_id
    
    if not all([user_id, feedback_type, rating]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Store feedback
    if user_id not in feedback_data:
        feedback_data[user_id] = []
    
    feedback = {
        'type': feedback_type,
        'rating': rating,
        'comment': comment,
        'context': context,
        'date': datetime.now().isoformat(),
        'timestamp': datetime.now().timestamp()
    }
    
    feedback_data[user_id].append(feedback)
    
    return jsonify({
        'success': True,
        'message': 'Feedback recorded successfully',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/get-performance-analytics', methods=['POST'])
def get_performance_analytics():
    data = request.get_json()
    user_id = data.get('user_id')
    
    if user_id not in test_results:
        return jsonify({'error': 'No test results found'}), 404
    
    analysis = performance_analyzer.analyze_progress(user_id)
    
    # Additional analytics
    results = test_results[user_id]
    
    # Performance by test type
    by_type = {}
    for result in results:
        test_type = result['test_type']
        if test_type not in by_type:
            by_type[test_type] = []
        by_type[test_type].append(result['score'])
    
    type_averages = {k: round(np.mean(v), 1) for k, v in by_type.items()}
    
    # Recent vs historical performance
    recent_results = results[-10:]  # Last 10 tests
    historical_results = results[:-10] if len(results) > 10 else []
    
    recent_avg = np.mean([r['score'] for r in recent_results]) if recent_results else 0
    historical_avg = np.mean([r['score'] for r in historical_results]) if historical_results else 0
    
    return jsonify({
        'success': True,
        'analysis': analysis,
        'performance_by_type': type_averages,
        'recent_performance': round(recent_avg, 1),
        'historical_performance': round(historical_avg, 1),
        'improvement_trend': round(recent_avg - historical_avg, 1) if historical_results else 0,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/register-user', methods=['POST'])
def register_user():
    data = request.get_json()
    user_id = data.get('user_id')
    user_profile = data.get('profile')
    
    if not user_id or not user_profile:
        return jsonify({'error': 'Missing user_id or profile'}), 400
    
    users_data[user_id] = {
        **user_profile,
        'registered_at': datetime.now().isoformat(),
        'last_active': datetime.now().isoformat()
    }
    
    return jsonify({
        'success': True,
        'message': 'User registered successfully',
        'user_id': user_id
    })

@app.route('/api/adaptive-difficulty', methods=['POST'])
def get_adaptive_difficulty():
    data = request.get_json()
    user_id = data.get('user_id')
    test_type = data.get('test_type')
    
    if user_id not in test_results:
        return jsonify({'recommended_difficulty': 'medium'})
    
    # Analyze recent performance for this test type
    user_results = test_results[user_id]
    type_results = [r for r in user_results if r['test_type'] == test_type]
    
    if not type_results:
        return jsonify({'recommended_difficulty': 'medium'})
    
    # Get last 3 results for this test type
    recent_results = type_results[-3:]
    avg_score = np.mean([r['score'] for r in recent_results])
    
    # Adaptive difficulty logic
    if avg_score >= 85:
        recommended = 'hard'
    elif avg_score >= 65:
        recommended = 'medium'
    else:
        recommended = 'easy'
    
    return jsonify({
        'recommended_difficulty': recommended,
        'based_on_score': round(avg_score, 1),
        'sample_size': len(recent_results)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)