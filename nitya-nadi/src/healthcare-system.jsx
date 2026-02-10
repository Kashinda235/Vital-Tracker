import React, { useState, useEffect, useRef } from 'react';
import { Camera, Calendar, Activity, FileText, MessageSquare, User, Settings, LogOut, Upload, Brain, AlertCircle, CheckCircle, Clock, Plus, Search, X, Menu, Heart, Thermometer, Droplet, Zap, TrendingUp, TrendingDown, Minus, Send, Image as ImageIcon, Download, Eye } from 'lucide-react';

// Simulated backend data store
const initialData = {
  users: [
    { id: 1, email: 'doctor@hospital.com', password: 'doctor123', role: 'doctor', name: 'Dr. Sarah Johnson', specialty: 'General Medicine' },
    { id: 2, email: 'patient@email.com', password: 'patient123', role: 'patient', name: 'John Doe', age: 35, gender: 'Male' }
  ],
  patients: [
    { 
      id: 'P001', 
      name: 'John Doe', 
      age: 35, 
      gender: 'Male', 
      email: 'patient@email.com',
      phone: '+1-555-0123',
      address: '123 Health St, Medical City',
      bloodType: 'O+',
      allergies: ['Penicillin'],
      emergencyContact: 'Jane Doe - 555-0124',
      registrationDate: '2024-01-15',
      medicalHistory: [
        { date: '2024-01-20', condition: 'Hypertension', notes: 'Prescribed medication' },
        { date: '2023-12-10', condition: 'Annual Checkup', notes: 'All clear' }
      ]
    }
  ],
  appointments: [
    {
      id: 'A001',
      patientId: 'P001',
      patientName: 'John Doe',
      doctorId: 1,
      doctorName: 'Dr. Sarah Johnson',
      date: '2026-02-10',
      time: '10:00 AM',
      status: 'scheduled',
      reason: 'Follow-up consultation'
    }
  ],
  prescriptions: [
    {
      id: 'RX001',
      patientId: 'P001',
      patientName: 'John Doe',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-01-20',
      medications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' }
      ],
      diagnosis: 'Hypertension'
    }
  ],
  vitals: [
    {
      id: 'V001',
      patientId: 'P001',
      date: '2026-02-08',
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.6,
      oxygenLevel: 98,
      weight: 165,
      notes: 'Normal readings'
    },
    {
      id: 'V002',
      patientId: 'P001',
      date: '2026-01-15',
      bloodPressure: '125/82',
      heartRate: 75,
      temperature: 98.4,
      oxygenLevel: 97,
      weight: 167,
      notes: 'Slight improvement'
    }
  ]
};

const HealthcareManagementSystem = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [data, setData] = useState(initialData);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    const user = data.users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      setCurrentView(user.role === 'doctor' ? 'doctor-dashboard' : 'patient-dashboard');
      
      // Generate AI health summary for patients on login
      if (user.role === 'patient') {
        generateHealthSummary(user.id);
      }
    } else {
      alert('Invalid credentials');
    }
  };

  // AI Health Summary Generator
  const generateHealthSummary = (userId) => {
    const patient = data.patients.find(p => p.email === currentUser?.email || p.id === 'P001');
    const vitals = data.vitals.filter(v => v.patientId === patient?.id).slice(-3);
    
    if (vitals.length > 1) {
      const latestVitals = vitals[vitals.length - 1];
      const previousVitals = vitals[vitals.length - 2];
      
      const bpTrend = latestVitals.bloodPressure < previousVitals.bloodPressure ? 'improved' : 'stable';
      const hrTrend = Math.abs(latestVitals.heartRate - previousVitals.heartRate) < 5 ? 'stable' : 'fluctuating';
      
      const summary = {
        title: 'Your Health Journey',
        message: `Since your last check-in on ${previousVitals.date}, your blood pressure has ${bpTrend} and your heart rate is ${hrTrend}. Your vitals are looking good! Keep up the healthy habits.`,
        trend: bpTrend === 'improved' ? 'positive' : 'stable',
        recommendations: [
          'Continue monitoring your blood pressure daily',
          'Maintain regular exercise routine',
          'Stay hydrated and follow prescribed medication'
        ]
      };
      
      setAiAnalysis(summary);
    }
  };

  // AI Chatbot Handler
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages([...chatMessages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = '';
      const input = chatInput.toLowerCase();

      if (input.includes('headache') || input.includes('pain')) {
        aiResponse = "I understand you're experiencing discomfort. Could you tell me: 1) How long have you had this symptom? 2) Rate the pain from 1-10. 3) Any other symptoms like fever or nausea?";
      } else if (input.includes('appointment') || input.includes('book')) {
        aiResponse = "I'd be happy to help you schedule an appointment! Let me redirect you to our booking system. Would you like to see available slots?";
      } else if (input.includes('days') || input.includes('week')) {
        aiResponse = "Based on your symptoms, I recommend scheduling an appointment with a doctor. Would you like me to pre-fill the symptom checker form for you? This will help the doctor prepare for your visit.";
      } else if (input.includes('yes') || input.includes('please')) {
        aiResponse = "Great! I've prepared a preliminary assessment. Click the 'View Recommendation' button below to see suggested next steps and book an appointment if needed.";
      } else {
        aiResponse = "Hello! I'm your AI health assistant. I can help you with: \n• Symptom assessment\n• Appointment scheduling\n• Medication reminders\n• Health tips\n\nHow can I assist you today?";
      }

      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    }, 1000);

    setChatInput('');
  };

  // Patient Registration
  const registerPatient = (patientData) => {
    const newPatient = {
      ...patientData,
      id: `P${String(data.patients.length + 1).padStart(3, '0')}`,
      registrationDate: new Date().toISOString().split('T')[0],
      medicalHistory: []
    };
    setData({ ...data, patients: [...data.patients, newPatient] });
  };

  // Book Appointment
  const bookAppointment = (appointmentData) => {
    const newAppointment = {
      ...appointmentData,
      id: `A${String(data.appointments.length + 1).padStart(3, '0')}`,
      status: 'scheduled'
    };
    setData({ ...data, appointments: [...data.appointments, newAppointment] });
  };

  // Add Vitals
  const addVitals = (vitalsData) => {
    const newVitals = {
      ...vitalsData,
      id: `V${String(data.vitals.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0]
    };
    setData({ ...data, vitals: [...data.vitals, newVitals] });
    generateHealthSummary(currentUser.id);
  };

  // OCR Simulation (would connect to real OCR service)
  const handleOCRUpload = (file) => {
    // Simulate OCR extraction
    const mockData = {
      bloodPressure: '118/76',
      heartRate: 68,
      temperature: 98.2,
      oxygenLevel: 99,
      weight: 163
    };
    
    setTimeout(() => {
      alert('Report scanned successfully! Data extracted and ready to save.');
      addVitals({ ...mockData, patientId: 'P001', notes: 'OCR extracted data' });
    }, 2000);
  };

  // Login Page Component
  const LoginPage = () => (
    <div className="min-h-screen flex items-center justify-center p-4 login-bg">
      <div className="login-card">
        <div className="text-center mb-8">
          <div className="logo-container">
            <Activity className="logo-icon" />
          </div>
          <h1 className="login-title">HealthCare Pro</h1>
          <p className="login-subtitle">Advanced Health Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">Email Address</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Sign In
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-slate-600 font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-slate-500">Doctor: doctor@hospital.com / doctor123</p>
          <p className="text-xs text-slate-500">Patient: patient@email.com / patient123</p>
        </div>

        {/* AI Chat Button */}
        <button
          onClick={() => setShowChat(true)}
          className="chat-fab"
          title="AI Health Assistant"
        >
          <MessageSquare size={24} />
        </button>
      </div>
    </div>
  );

  // Patient Dashboard
  const PatientDashboard = () => {
    const patient = data.patients.find(p => p.email === currentUser.email);
    const patientVitals = data.vitals.filter(v => v.patientId === patient?.id).sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestVitals = patientVitals[0];
    const patientAppointments = data.appointments.filter(a => a.patientId === patient?.id);
    const patientPrescriptions = data.prescriptions.filter(p => p.patientId === patient?.id);

    return (
      <div className="dashboard-container">
        <Sidebar />
        
        <div className="main-content">
          <Header title="Patient Dashboard" />

          {/* AI Health Summary */}
          {aiAnalysis && (
            <div className="ai-summary-card">
              <div className="flex items-start gap-4">
                <div className="ai-icon">
                  <Brain size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{aiAnalysis.title}</h3>
                  <p className="text-slate-600 mb-4">{aiAnalysis.message}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {aiAnalysis.recommendations.map((rec, idx) => (
                      <div key={idx} className="recommendation-tag">
                        <CheckCircle size={16} />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vitals Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <VitalsCard
              icon={<Activity size={24} />}
              title="Blood Pressure"
              value={latestVitals?.bloodPressure || 'N/A'}
              trend="stable"
              color="red"
            />
            <VitalsCard
              icon={<Heart size={24} />}
              title="Heart Rate"
              value={latestVitals?.heartRate ? `${latestVitals.heartRate} bpm` : 'N/A'}
              trend="up"
              color="pink"
            />
            <VitalsCard
              icon={<Thermometer size={24} />}
              title="Temperature"
              value={latestVitals?.temperature ? `${latestVitals.temperature}°F` : 'N/A'}
              trend="stable"
              color="orange"
            />
            <VitalsCard
              icon={<Droplet size={24} />}
              title="O₂ Saturation"
              value={latestVitals?.oxygenLevel ? `${latestVitals.oxygenLevel}%` : 'N/A'}
              trend="stable"
              color="blue"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <QuickActionCard
              icon={<Calendar size={32} />}
              title="Book Appointment"
              description="Schedule a visit with your doctor"
              onClick={() => setCurrentView('appointments')}
            />
            <QuickActionCard
              icon={<Upload size={32} />}
              title="Upload Report"
              description="OCR-powered report scanning"
              onClick={() => setCurrentView('upload-report')}
            />
            <QuickActionCard
              icon={<Activity size={32} />}
              title="Log Vitals"
              description="Track your health metrics"
              onClick={() => setCurrentView('log-vitals')}
            />
          </div>

          {/* Upcoming Appointments */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Upcoming Appointments</h2>
              <button onClick={() => setCurrentView('appointments')} className="btn-secondary">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {patientAppointments.filter(a => a.status === 'scheduled').slice(0, 3).map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
              {patientAppointments.filter(a => a.status === 'scheduled').length === 0 && (
                <p className="text-center text-slate-400 py-8">No upcoming appointments</p>
              )}
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="card">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Prescriptions</h2>
            <div className="space-y-4">
              {patientPrescriptions.slice(0, 2).map(prescription => (
                <PrescriptionCard key={prescription.id} prescription={prescription} />
              ))}
              {patientPrescriptions.length === 0 && (
                <p className="text-center text-slate-400 py-8">No prescriptions</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Doctor Dashboard
  const DoctorDashboard = () => {
    const todayAppointments = data.appointments.filter(a => a.date === '2026-02-10');
    const upcomingAppointments = data.appointments.filter(a => new Date(a.date) > new Date('2026-02-10'));

    return (
      <div className="dashboard-container">
        <Sidebar />
        
        <div className="main-content">
          <Header title="Doctor Dashboard" />

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Calendar size={24} />}
              title="Today's Appointments"
              value={todayAppointments.length}
              color="blue"
            />
            <StatCard
              icon={<User size={24} />}
              title="Total Patients"
              value={data.patients.length}
              color="green"
            />
            <StatCard
              icon={<FileText size={24} />}
              title="Prescriptions"
              value={data.prescriptions.length}
              color="purple"
            />
            <StatCard
              icon={<Activity size={24} />}
              title="Vitals Recorded"
              value={data.vitals.length}
              color="red"
            />
          </div>

          {/* Today's Schedule */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Today's Schedule</h2>
            <div className="space-y-4">
              {todayAppointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  showPatient 
                  onViewPatient={() => {
                    setSelectedPatient(data.patients.find(p => p.id === appointment.patientId));
                    setCurrentView('patient-details');
                  }}
                />
              ))}
              {todayAppointments.length === 0 && (
                <p className="text-center text-slate-400 py-8">No appointments today</p>
              )}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="card">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Upcoming Appointments</h2>
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 5).map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  showPatient 
                />
              ))}
              {upcomingAppointments.length === 0 && (
                <p className="text-center text-slate-400 py-8">No upcoming appointments</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Upload Report View (OCR Feature)
  const UploadReportView = () => {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setUploading(true);
        handleOCRUpload(file);
        setTimeout(() => setUploading(false), 2100);
      }
    };

    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <Header title="Upload Medical Report" />
          
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
                  <ImageIcon size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">OCR-Powered Report Scanner</h2>
                <p className="text-slate-600">Upload a photo or scan of your medical report. Our AI will extract the data automatically.</p>
              </div>

              <div className="upload-zone">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <div className="loader mb-4"></div>
                      <p className="text-slate-600 font-medium">Scanning report...</p>
                      <p className="text-slate-400 text-sm">Extracting vitals data</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Camera size={48} className="text-slate-400 mb-4" />
                      <p className="text-slate-600 font-medium mb-2">Click to upload or drag and drop</p>
                      <p className="text-slate-400 text-sm">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Zap size={20} className="text-blue-600" />
                  How it works
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Upload a photo of your lab report or medical document</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>AI extracts key vitals: BP, heart rate, temperature, oxygen levels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Data is automatically saved to your health records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>No manual typing required!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Log Vitals View
  const LogVitalsView = () => {
    const [vitalsForm, setVitalsForm] = useState({
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      oxygenLevel: '',
      weight: '',
      notes: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      addVitals({ ...vitalsForm, patientId: 'P001' });
      alert('Vitals logged successfully!');
      setVitalsForm({ bloodPressure: '', heartRate: '', temperature: '', oxygenLevel: '', weight: '', notes: '' });
      setCurrentView('patient-dashboard');
    };

    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <Header title="Log Your Vitals" />
          
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Blood Pressure</label>
                    <input
                      type="text"
                      value={vitalsForm.bloodPressure}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, bloodPressure: e.target.value })}
                      className="input-field"
                      placeholder="120/80"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={vitalsForm.heartRate}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, heartRate: e.target.value })}
                      className="input-field"
                      placeholder="72"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Temperature (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={vitalsForm.temperature}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, temperature: e.target.value })}
                      className="input-field"
                      placeholder="98.6"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Oxygen Level (%)</label>
                    <input
                      type="number"
                      value={vitalsForm.oxygenLevel}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, oxygenLevel: e.target.value })}
                      className="input-field"
                      placeholder="98"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Weight (lbs)</label>
                    <input
                      type="number"
                      value={vitalsForm.weight}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, weight: e.target.value })}
                      className="input-field"
                      placeholder="165"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Notes (Optional)</label>
                  <textarea
                    value={vitalsForm.notes}
                    onChange={(e) => setVitalsForm({ ...vitalsForm, notes: e.target.value })}
                    className="input-field"
                    rows="3"
                    placeholder="Any observations or symptoms..."
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Save Vitals
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Reusable Components
  const Sidebar = () => (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`sidebar ${showMobileMenu ? 'sidebar-mobile-open' : ''}`}>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">HealthCare Pro</h2>
              <p className="text-xs text-slate-500">{currentUser?.role === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {currentUser?.role === 'doctor' ? (
              <>
                <NavItem icon={<Activity />} label="Dashboard" active={currentView === 'doctor-dashboard'} onClick={() => setCurrentView('doctor-dashboard')} />
                <NavItem icon={<Calendar />} label="Appointments" onClick={() => setCurrentView('appointments')} />
                <NavItem icon={<User />} label="Patients" onClick={() => setCurrentView('patients')} />
                <NavItem icon={<FileText />} label="Prescriptions" onClick={() => setCurrentView('prescriptions')} />
              </>
            ) : (
              <>
                <NavItem icon={<Activity />} label="Dashboard" active={currentView === 'patient-dashboard'} onClick={() => setCurrentView('patient-dashboard')} />
                <NavItem icon={<Calendar />} label="Appointments" onClick={() => setCurrentView('appointments')} />
                <NavItem icon={<Heart />} label="My Vitals" onClick={() => setCurrentView('log-vitals')} />
                <NavItem icon={<FileText />} label="Reports" onClick={() => setCurrentView('upload-report')} />
                <NavItem icon={<MessageSquare />} label="AI Assistant" onClick={() => setShowChat(true)} />
              </>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              {currentUser?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 text-sm truncate">{currentUser?.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentUser(null);
              setCurrentView('login');
              setShowMobileMenu(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );

  const Header = ({ title }) => (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">{title}</h1>
      <p className="text-slate-500">Welcome back, {currentUser?.name}</p>
    </div>
  );

  const NavItem = ({ icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`nav-item ${active ? 'nav-item-active' : ''}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const VitalsCard = ({ icon, title, value, trend, color }) => (
    <div className="vitals-card">
      <div className={`vitals-icon vitals-icon-${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
      {trend === 'up' && <TrendingUp size={20} className="text-green-600" />}
      {trend === 'down' && <TrendingDown size={20} className="text-red-600" />}
      {trend === 'stable' && <Minus size={20} className="text-blue-600" />}
    </div>
  );

  const StatCard = ({ icon, title, value, color }) => (
    <div className="stat-card">
      <div className={`stat-icon stat-icon-${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );

  const QuickActionCard = ({ icon, title, description, onClick }) => (
    <div className="quick-action-card" onClick={onClick}>
      <div className="quick-action-icon">
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );

  const AppointmentCard = ({ appointment, showPatient, onViewPatient }) => (
    <div className="appointment-card">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {showPatient ? appointment.patientName?.charAt(0) : appointment.doctorName?.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{showPatient ? appointment.patientName : appointment.doctorName}</h3>
            <p className="text-sm text-slate-500">{appointment.reason}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600 ml-13">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{appointment.time}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`status-badge status-${appointment.status}`}>
          {appointment.status}
        </span>
        {showPatient && onViewPatient && (
          <button onClick={onViewPatient} className="btn-icon">
            <Eye size={18} />
          </button>
        )}
      </div>
    </div>
  );

  const PrescriptionCard = ({ prescription }) => (
    <div className="prescription-card">
      <div className="flex items-center gap-3 mb-4">
        <FileText size={24} className="text-purple-600" />
        <div>
          <h3 className="font-bold text-slate-800">Prescription #{prescription.id}</h3>
          <p className="text-sm text-slate-500">Dr. {prescription.doctorName} • {prescription.date}</p>
        </div>
      </div>
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm font-medium text-slate-700 mb-3">Diagnosis: {prescription.diagnosis}</p>
        <div className="space-y-2">
          {prescription.medications.map((med, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle size={16} className="text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-slate-800">{med.name} - {med.dosage}</p>
                <p className="text-slate-500">{med.frequency} for {med.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // AI Chatbot Component
  const AIChatbot = () => (
    <div className={`chat-container ${showChat ? 'chat-open' : ''}`}>
      <div className="chat-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Brain className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-white">AI Health Assistant</h3>
            <p className="text-xs text-purple-100">Powered by advanced medical AI</p>
          </div>
        </div>
        <button onClick={() => setShowChat(false)} className="text-white hover:bg-purple-500 p-1 rounded">
          <X size={24} />
        </button>
      </div>

      <div className="chat-messages">
        {chatMessages.length === 0 && (
          <div className="text-center py-8">
            <Brain size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-2">Hello! I'm your AI health assistant.</p>
            <p className="text-sm text-slate-400">How can I help you today?</p>
          </div>
        )}
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-ai'}`}>
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleChatSubmit} className="chat-input-container">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="chat-send-btn">
          <Send size={20} />
        </button>
      </form>
    </div>
  );

  // Main Render
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f8fafc;
          overflow-x: hidden;
        }

        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .login-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .login-bg::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }

        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .login-card {
          background: white;
          border-radius: 24px;
          padding: 48px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 480px;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .logo-container {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .logo-icon {
          color: white;
          width: 40px;
          height: 40px;
        }

        .login-title {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .login-subtitle {
          color: #64748b;
          font-size: 14px;
        }

        .input-field {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          transition: all 0.3s;
          outline: none;
        }

        .input-field:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }

        .btn-secondary {
          background: #f1f5f9;
          color: #475569;
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          color: #64748b;
        }

        .btn-icon:hover {
          background: #e2e8f0;
          color: #475569;
        }

        .chat-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
          transition: all 0.3s;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 40;
          transition: transform 0.3s;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar-mobile-open {
            transform: translateX(0);
          }
        }

        .main-content {
          flex: 1;
          padding: 32px;
          margin-left: 280px;
          max-width: 1400px;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 24px 16px;
          }
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: #64748b;
          font-weight: 500;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          background: #f1f5f9;
          color: #475569;
        }

        .nav-item-active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
        }

        .vitals-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s;
        }

        .vitals-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .vitals-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .vitals-icon-red { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; }
        .vitals-icon-pink { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: white; }
        .vitals-icon-orange { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; }
        .vitals-icon-blue { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon-blue { background: #dbeafe; color: #2563eb; }
        .stat-icon-green { background: #dcfce7; color: #16a34a; }
        .stat-icon-purple { background: #f3e8ff; color: #9333ea; }
        .stat-icon-red { background: #fee2e2; color: #dc2626; }

        .quick-action-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }

        .quick-action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          border-color: #667eea;
        }

        .quick-action-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: white;
        }

        .ai-summary-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
          color: white;
        }

        .ai-icon {
          width: 56px;
          height: 56px;
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .recommendation-tag {
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          padding: 12px 16px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .appointment-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border: 1px solid #e2e8f0;
        }

        .prescription-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-scheduled { background: #dbeafe; color: #2563eb; }
        .status-completed { background: #dcfce7; color: #16a34a; }
        .status-cancelled { background: #fee2e2; color: #dc2626; }

        .upload-zone {
          border: 2px dashed #cbd5e1;
          border-radius: 16px;
          padding: 64px 32px;
          text-align: center;
          transition: all 0.3s;
          cursor: pointer;
        }

        .upload-zone:hover {
          border-color: #667eea;
          background: #f8fafc;
        }

        .loader {
          width: 48px;
          height: 48px;
          border: 4px solid #f3f4f6;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .chat-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 400px;
          height: 600px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          transform: translateY(calc(100% + 24px));
          opacity: 0;
          transition: all 0.3s;
        }

        .chat-open {
          transform: translateY(0);
          opacity: 1;
        }

        @media (max-width: 480px) {
          .chat-container {
            width: calc(100vw - 32px);
            height: calc(100vh - 48px);
            right: 16px;
            bottom: 16px;
          }
        }

        .chat-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          border-radius: 20px 20px 0 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .chat-message {
          margin-bottom: 16px;
          padding: 12px 16px;
          border-radius: 12px;
          max-width: 85%;
          animation: messageSlide 0.3s ease-out;
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chat-message-user {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          margin-left: auto;
          border-bottom-right-radius: 4px;
        }

        .chat-message-ai {
          background: #f1f5f9;
          color: #1e293b;
          margin-right: auto;
          border-bottom-left-radius: 4px;
        }

        .chat-input-container {
          padding: 16px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 12px;
        }

        .chat-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          outline: none;
          font-size: 14px;
        }

        .chat-input:focus {
          border-color: #667eea;
        }

        .chat-send-btn {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .chat-send-btn:hover {
          transform: scale(1.05);
        }

        .grid {
          display: grid;
        }

        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

        @media (min-width: 768px) {
          .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }

        @media (min-width: 1024px) {
          .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }

        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }

        .space-y-2 > * + * { margin-top: 0.5rem; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .space-y-6 > * + * { margin-top: 1.5rem; }

        .flex { display: flex; }
        .flex-1 { flex: 1; }
        .flex-shrink-0 { flex-shrink: 0; }
        .items-center { align-items: center; }
        .items-start { align-items: flex-start; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }

        .min-h-screen { min-height: 100vh; }
        .min-w-0 { min-width: 0; }
        .max-w-2xl { max-width: 42rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }

        .p-1 { padding: 0.25rem; }
        .p-2 { padding: 0.5rem; }
        .p-3 { padding: 0.75rem; }
        .p-4 { padding: 1rem; }
        .p-6 { padding: 1.5rem; }

        .mb-1 { margin-bottom: 0.25rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-6 { margin-top: 1.5rem; }
        .mt-8 { margin-top: 2rem; }
        .mt-0\\.5 { margin-top: 0.125rem; }
        .ml-13 { margin-left: 3.25rem; }

        .w-10 { width: 2.5rem; }
        .w-12 { width: 3rem; }
        .w-full { width: 100%; }
        .h-10 { height: 2.5rem; }
        .h-12 { height: 3rem; }

        .rounded { border-radius: 0.25rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded-full { border-radius: 9999px; }

        .border { border-width: 1px; }
        .border-t { border-top-width: 1px; }
        .border-b { border-bottom-width: 1px; }
        .border-slate-200 { border-color: #e2e8f0; }
        .border-blue-200 { border-color: #bfdbfe; }

        .bg-slate-50 { background-color: #f8fafc; }
        .bg-blue-50 { background-color: #eff6ff; }
        .bg-red-50 { background-color: #fef2f2; }
        .bg-white { background-color: white; }

        .text-slate-400 { color: #94a3b8; }
        .text-slate-500 { color: #64748b; }
        .text-slate-600 { color: #475569; }
        .text-slate-700 { color: #334155; }
        .text-slate-800 { color: #1e293b; }
        .text-blue-600 { color: #2563eb; }
        .text-green-600 { color: #16a34a; }
        .text-red-600 { color: #dc2626; }
        .text-white { color: white; }

        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-lg { font-size: 1.125rem; }
        .text-xl { font-size: 1.25rem; }
        .text-2xl { font-size: 1.5rem; }
        .text-3xl { font-size: 1.875rem; }

        .font-medium { font-weight: 500; }
        .font-bold { font-weight: 700; }

        .text-center { text-align: center; }
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .block { display: block; }
        .inline-flex { display: inline-flex; }
        .hidden { display: none; }

        @media (min-width: 768px) {
          .md\\:hidden { display: none; }
        }

        .fixed { position: fixed; }
        .relative { position: relative; }
        .z-50 { z-index: 50; }

        .top-4 { top: 1rem; }
        .left-4 { left: 1rem; }

        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }

        .transition-colors { transition-property: color, background-color, border-color; }
        .hover\\:bg-red-100:hover { background-color: #fee2e2; }
        .hover\\:bg-purple-500:hover { background-color: #a855f7; }

        .overflow-hidden { overflow: hidden; }
        .cursor-pointer { cursor: pointer; }
      `}</style>

      {currentView === 'login' && <LoginPage />}
      {currentView === 'patient-dashboard' && <PatientDashboard />}
      {currentView === 'doctor-dashboard' && <DoctorDashboard />}
      {currentView === 'upload-report' && <UploadReportView />}
      {currentView === 'log-vitals' && <LogVitalsView />}
      
      <AIChatbot />
    </>
  );
};

export default HealthcareManagementSystem;