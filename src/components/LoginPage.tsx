import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  Mail, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Brain,
  Sparkles,
  Star,
  ArrowRight,
  Zap,
  Target,
  Trophy,
  Lightbulb
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (userData: any) => void;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    occupation: '',
    education: '',
    memoryGoals: [] as string[],
    medicalConditions: [] as string[],
    currentMedications: '',
    sleepHours: 7,
    exerciseFrequency: 'moderate',
    stressLevel: 'medium',
    learningStyle: 'mixed' as 'visual' | 'auditory' | 'kinesthetic' | 'mixed',
    preferredDifficulty: 'medium' as 'easy' | 'medium' | 'hard',
    availableTimePerDay: 30,
    notifications: true,
    dataSharing: false
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordRequirements: PasswordRequirement[] = [
    {
      label: 'At least 8 characters',
      test: (password) => password.length >= 8,
      met: formData.password.length >= 8
    },
    {
      label: 'Contains uppercase letter',
      test: (password) => /[A-Z]/.test(password),
      met: /[A-Z]/.test(formData.password)
    },
    {
      label: 'Contains lowercase letter',
      test: (password) => /[a-z]/.test(password),
      met: /[a-z]/.test(formData.password)
    },
    {
      label: 'Contains number',
      test: (password) => /\d/.test(password),
      met: /\d/.test(formData.password)
    },
    {
      label: 'Contains special character (!@#$%^&*)',
      test: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)
    }
  ];

  const isPasswordValid = passwordRequirements.every(req => req.met);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGoalChange = (goal: string) => {
    const currentGoals = formData.memoryGoals;
    if (currentGoals.includes(goal)) {
      handleInputChange('memoryGoals', currentGoals.filter(g => g !== goal));
    } else {
      handleInputChange('memoryGoals', [...currentGoals, goal]);
    }
  };

  const handleMedicalConditionChange = (condition: string) => {
    const currentConditions = formData.medicalConditions;
    if (currentConditions.includes(condition)) {
      handleInputChange('medicalConditions', currentConditions.filter(c => c !== condition));
    } else {
      handleInputChange('medicalConditions', [...currentConditions, condition]);
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (!isPasswordValid) newErrors.password = 'Password does not meet requirements';
      
      if (!isLogin) {
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (!passwordsMatch) newErrors.confirmPassword = 'Passwords do not match';
        
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
      }
    }

    if (step === 2 && !isLogin) {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.occupation) newErrors.occupation = 'Occupation is required';
      if (!formData.education) newErrors.education = 'Education level is required';
    }

    if (step === 3 && !isLogin) {
      if (formData.memoryGoals.length === 0) newErrors.memoryGoals = 'Please select at least one memory goal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      if (validateStep(1)) {
        const userData = {
          email: formData.email,
          name: 'User',
          isAuthenticated: true
        };
        
        localStorage.clear();
        onLogin(userData);
      }
    } else {
      if (validateStep(currentStep)) {
        const userProfile = {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          age: new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear(),
          occupation: formData.occupation,
          education: formData.education,
          memoryGoals: formData.memoryGoals,
          medicalConditions: formData.medicalConditions,
          currentMedications: formData.currentMedications,
          sleepHours: formData.sleepHours,
          exerciseFrequency: formData.exerciseFrequency,
          stressLevel: formData.stressLevel,
          learningStyle: formData.learningStyle,
          preferredDifficulty: formData.preferredDifficulty,
          availableTimePerDay: formData.availableTimePerDay,
          notifications: formData.notifications,
          dataSharing: formData.dataSharing,
          isAuthenticated: true,
          createdAt: new Date(),
          challengeAreas: [],
          strengths: []
        };

        localStorage.clear();
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        onLogin(userProfile);
      }
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
              errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" />{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
              errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" />{errors.password}</p>}
        
        {!isLogin && formData.password && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-slate-700 mb-3">Password Requirements:</p>
            <div className="grid grid-cols-1 gap-2">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {req.met ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm transition-colors ${req.met ? 'text-emerald-700' : 'text-red-700'}`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!isLogin && (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" />{errors.confirmPassword}</p>}
            {formData.confirmPassword && passwordsMatch && (
              <div className="flex items-center space-x-2 mt-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-emerald-700">Passwords match</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="First name"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" />{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Last name"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" />{errors.lastName}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
              errors.dateOfBirth ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" />{errors.dateOfBirth}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Occupation</label>
          <input
            type="text"
            value={formData.occupation}
            onChange={(e) => handleInputChange('occupation', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
              errors.occupation ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="Your occupation"
          />
          {errors.occupation && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" />{errors.occupation}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Education Level</label>
        <select
          value={formData.education}
          onChange={(e) => handleInputChange('education', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
            errors.education ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <option value="">Select education level</option>
          <option value="high-school">High School</option>
          <option value="some-college">Some College</option>
          <option value="bachelors">Bachelor's Degree</option>
          <option value="masters">Master's Degree</option>
          <option value="doctorate">Doctorate</option>
          <option value="other">Other</option>
        </select>
        {errors.education && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" />{errors.education}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Sleep Hours (per night)</label>
          <input
            type="number"
            min="4"
            max="12"
            value={formData.sleepHours}
            onChange={(e) => handleInputChange('sleepHours', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-400 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Exercise Frequency</label>
          <select
            value={formData.exerciseFrequency}
            onChange={(e) => handleInputChange('exerciseFrequency', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-400 transition-all"
          >
            <option value="none">None</option>
            <option value="light">Light (1-2 times/week)</option>
            <option value="moderate">Moderate (3-4 times/week)</option>
            <option value="intense">Intense (5+ times/week)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Current Stress Level</label>
        <select
          value={formData.stressLevel}
          onChange={(e) => handleInputChange('stressLevel', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-400 transition-all"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Memory Goals (select all that apply)</label>
        <div className="grid grid-cols-1 gap-3">
          {[
            'Improve focus and concentration',
            'Better recall for names and faces',
            'Enhanced academic performance',
            'Increased work efficiency',
            'Better daily task management',
            'General cognitive wellness',
            'Prepare for exams/tests',
            'Professional development',
            'Age-related memory concerns',
            'Recovery from injury/illness'
          ].map(goal => (
            <label key={goal} className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={formData.memoryGoals.includes(goal)}
                onChange={() => handleGoalChange(goal)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-5 h-5"
              />
              <span className="text-sm text-slate-700 font-medium">{goal}</span>
            </label>
          ))}
        </div>
        {errors.memoryGoals && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle className="w-4 h-4 mr-1" />{errors.memoryGoals}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Medical Conditions (if any)</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            'ADHD/ADD',
            'Anxiety',
            'Depression',
            'Sleep disorders',
            'Chronic fatigue',
            'Migraine/headaches',
            'Diabetes',
            'Hypertension',
            'None of the above'
          ].map(condition => (
            <label key={condition} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={formData.medicalConditions.includes(condition)}
                onChange={() => handleMedicalConditionChange(condition)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Current Medications (optional)</label>
        <textarea
          value={formData.currentMedications}
          onChange={(e) => handleInputChange('currentMedications', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-400 transition-all"
          rows={3}
          placeholder="List any medications you're currently taking..."
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Learning Style</label>
          <select
            value={formData.learningStyle}
            onChange={(e) => handleInputChange('learningStyle', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-400 transition-all"
          >
            <option value="visual">Visual (images, diagrams)</option>
            <option value="auditory">Auditory (sounds, music)</option>
            <option value="kinesthetic">Kinesthetic (movement, touch)</option>
            <option value="mixed">Mixed (combination)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Difficulty</label>
          <select
            value={formData.preferredDifficulty}
            onChange={(e) => handleInputChange('preferredDifficulty', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-400 transition-all"
          >
            <option value="easy">Easy (gentle progression)</option>
            <option value="medium">Medium (balanced challenge)</option>
            <option value="hard">Hard (intensive training)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Available Time Per Day: {formData.availableTimePerDay} minutes
        </label>
        <input
          type="range"
          min="15"
          max="120"
          step="15"
          value={formData.availableTimePerDay}
          onChange={(e) => handleInputChange('availableTimePerDay', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-sm text-slate-500 mt-1">
          <span>15 min</span>
          <span>60 min</span>
          <span>120 min</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-xl border border-indigo-200">
          <div>
            <h4 className="font-medium text-slate-900">Email Notifications</h4>
            <p className="text-sm text-slate-600">Receive reminders and progress updates</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.notifications}
              onChange={(e) => handleInputChange('notifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-sky-50 rounded-xl border border-emerald-200">
          <div>
            <h4 className="font-medium text-slate-900">Anonymous Data Sharing</h4>
            <p className="text-sm text-slate-600">Help improve the platform (optional)</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.dataSharing}
              onChange={(e) => handleInputChange('dataSharing', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const totalSteps = isLogin ? 1 : 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-emerald-500 to-sky-600 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-white">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">Memory Enhancer Pro</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Transform Your Mind,
            <span className="block text-yellow-300">Unlock Your Potential</span>
          </h2>
          
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Experience the power of advanced memory training with personalized AI coaching, 
            scientifically-proven techniques, and a supportive community of learners.
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Master Memory Techniques</p>
                <p className="text-sm opacity-75">Learn proven methods used by memory champions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Personalized Training Plans</p>
                <p className="text-sm opacity-75">AI-powered programs tailored to your goals</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Rapid Results</p>
                <p className="text-sm opacity-75">See improvements in focus and recall within days</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Track Your Progress</p>
                <p className="text-sm opacity-75">Detailed analytics and achievement milestones</p>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="mt-8 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              ))}
            </div>
            <p className="text-sm italic mb-2">
              "This platform completely changed how I approach learning. My memory has improved dramatically, 
              and I feel more confident in both my personal and professional life."
            </p>
            <p className="text-xs opacity-75">- Sarah M., Software Engineer</p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-yellow-300/20 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-pink-300/20 rounded-full blur-md"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {isLogin ? 'Welcome Back!' : 'Join Memory Pro'}
              </h1>
              <p className="text-slate-600">
                {isLogin ? 'Continue your cognitive journey' : 'Start your memory transformation today'}
              </p>
            </div>

            {/* Progress Bar for Registration */}
            {!isLogin && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-slate-600">Step {currentStep} of {totalSteps}</span>
                  <span className="text-sm text-indigo-600 font-semibold">{Math.round((currentStep / totalSteps) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i < currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step Content */}
              <div className="min-h-[400px]">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8">
                {isLogin ? (
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex space-x-4">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        className="flex-1 bg-gray-100 text-slate-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                      >
                        Back
                      </button>
                    )}
                    {currentStep < totalSteps ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>Create Account</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </form>

            {/* Toggle Login/Register */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setCurrentStep(1);
                  setErrors({});
                  setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    dateOfBirth: '',
                    occupation: '',
                    education: '',
                    memoryGoals: [],
                    medicalConditions: [],
                    currentMedications: '',
                    sleepHours: 7,
                    exerciseFrequency: 'moderate',
                    stressLevel: 'medium',
                    learningStyle: 'mixed',
                    preferredDifficulty: 'medium',
                    availableTimePerDay: 30,
                    notifications: true,
                    dataSharing: false
                  });
                }}
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;