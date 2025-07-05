const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface MemoryTest {
  type: string;
  test_id: string;
  sequence?: number[];
  reverse_sequence?: number[];
  pattern?: Array<{row: number, col: number}>;
  words?: string[];
  grid_size?: number;
  time_limit: number;
  instructions: string;
  difficulty: string;
}

export interface TestResult {
  test_id: string;
  test_type: string;
  score: number;
  time_taken: number;
  user_answer: any;
  correct_answer: any;
}

export interface PerformanceAnalysis {
  latest_score: number;
  average_score: number;
  improvement: number;
  trend_slope: number;
  consistency: number;
  total_tests: number;
  trend_direction: 'improving' | 'declining' | 'stable';
}

class MemoryAPI {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async generateTest(type: string, difficulty: string, userId: string): Promise<MemoryTest> {
    const response = await this.request('/generate-test', {
      method: 'POST',
      body: JSON.stringify({
        type,
        difficulty,
        user_id: userId,
      }),
    });

    return response.test;
  }

  async submitTestResult(userId: string, result: TestResult): Promise<{
    personalized_tip: string;
    performance_analysis: PerformanceAnalysis;
  }> {
    const response = await this.request('/submit-test-result', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        ...result,
      }),
    });

    return {
      personalized_tip: response.personalized_tip,
      performance_analysis: response.performance_analysis,
    };
  }

  async getAITip(userId: string): Promise<string> {
    const response = await this.request('/get-ai-tip', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    return response.tip;
  }

  async submitFeedback(
    userId: string,
    type: string,
    rating: number,
    comment?: string,
    context?: any
  ): Promise<void> {
    await this.request('/submit-feedback', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        type,
        rating,
        comment,
        context,
      }),
    });
  }

  async getPerformanceAnalytics(userId: string): Promise<{
    analysis: PerformanceAnalysis;
    performance_by_type: Record<string, number>;
    recent_performance: number;
    historical_performance: number;
    improvement_trend: number;
  }> {
    const response = await this.request('/get-performance-analytics', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    return response;
  }

  async registerUser(userId: string, profile: any): Promise<void> {
    await this.request('/register-user', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        profile,
      }),
    });
  }

  async getAdaptiveDifficulty(userId: string, testType: string): Promise<string> {
    const response = await this.request('/adaptive-difficulty', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        test_type: testType,
      }),
    });

    return response.recommended_difficulty;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.request('/health');
      return true;
    } catch {
      return false;
    }
  }
}

export const memoryAPI = new MemoryAPI();