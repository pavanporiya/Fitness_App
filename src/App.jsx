import React, { useState, useEffect } from 'react';
import { 
  Activity, User, Plus, Award, Flame, Droplet, Brain, Scale, 
  Dumbbell, ShieldAlert, CheckCircle2, ChevronRight, Download, 
  Users, TrendingUp, Sparkles, MessageSquare, Moon, RefreshCw, 
  Layers, Compass, HelpCircle, FileText, ArrowLeftRight, Heart, Trash2
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, BarChart, Bar, ReferenceLine 
} from 'recharts';
import { calculateAssessment, PRESETS, imperialToMetric } from './utils/fitnessScience';
import { generateAICoachingReport } from './utils/aiConsultant';

export default function App() {
  // --- STATE ---
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('fitscan_clients');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return PRESETS; }
    }
    return PRESETS;
  });
  
  const [activeClientId, setActiveClientId] = useState(PRESETS[0].id);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [unitSystem, setUnitSystem] = useState('metric'); // metric (kg, cm, cm) | imperial (lbs, in, in)
  
  // Tab control: 'dashboard' | 'trainer' | 'ai-coach' | 'comparison'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // AI Coach Sub-tab: 'fitness' | 'nutrition'
  const [activeCoachTab, setActiveCoachTab] = useState('fitness');
  
  // Client selection for comparison
  const [compareClientIds, setCompareClientIds] = useState([PRESETS[0].id, PRESETS[1].id]);

  // Form State for new scan / new client
  const [formData, setFormData] = useState({
    name: '',
    age: '28',
    gender: 'male',
    weight: '80', // kg or lbs depending on unitSystem
    height: '180', // cm or inches
    waist: '85', // cm or inches
    neck: '38', // cm or inches
    hip: '95', // cm or inches
    activityLevel: 'moderate',
    fitnessGoal: 'recomp',
    dailyWater: '2.5',
    sleepHours: '8',
    experience: 'intermediate'
  });

  // AI chat states
  const [fitnessChatMessages, setFitnessChatMessages] = useState([
    { sender: 'coach', text: "Welcome to the Elite Performance Lab! I am your AI Body Composition Coach. Ask me anything about your muscular distribution, genetic ceiling, progressive overload, or target athletic weight." }
  ]);
  const [nutritionChatMessages, setNutritionChatMessages] = useState([
    { sender: 'coach', text: "Greetings, athlete. I am your AI Sports Nutritionist. I design macronutrient schedules, hydration blocks, and electrolyte protocols specifically adjusted to your lean mass and metabolic expenditure." }
  ]);
  const [chatInput, setChatInput] = useState('');

  // --- LOCALSTORAGE PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('fitscan_clients', JSON.stringify(clients));
  }, [clients]);

  // --- RETRIEVE ACTIVE CLIENT ---
  const activeClient = clients.find(c => c.id === activeClientId) || clients[0] || PRESETS[0];

  // --- CONVERT CURRENT CLIENT TO METRIC STATS FOR CALC ENGINE ---
  const activeStats = calculateAssessment({
    name: activeClient.name,
    gender: activeClient.gender,
    age: Number(activeClient.age),
    weight: Number(activeClient.weight),
    height: Number(activeClient.height),
    waist: Number(activeClient.waist),
    neck: Number(activeClient.neck),
    hip: Number(activeClient.hip || 0),
    activityLevel: activeClient.activityLevel,
    fitnessGoal: activeClient.fitnessGoal,
    dailyWater: Number(activeClient.dailyWater),
    sleepHours: Number(activeClient.sleepHours),
    experience: activeClient.experience
  });

  const aiReport = generateAICoachingReport(activeClient, activeStats);

  // --- DYNAMIC FORM CONVERSIONS ---
  const handleUnitToggle = () => {
    const isToImperial = unitSystem === 'metric';
    setUnitSystem(isToImperial ? 'imperial' : 'metric');
    
    // Convert current form values so they match the toggled system
    setFormData(prev => {
      if (isToImperial) {
        return {
          ...prev,
          weight: prev.weight ? (Number(prev.weight) * 2.20462).toFixed(1) : '',
          height: prev.height ? (Number(prev.height) * 0.39370).toFixed(1) : '',
          waist: prev.waist ? (Number(prev.waist) * 0.39370).toFixed(1) : '',
          neck: prev.neck ? (Number(prev.neck) * 0.39370).toFixed(1) : '',
          hip: prev.hip ? (Number(prev.hip) * 0.39370).toFixed(1) : '',
        };
      } else {
        return {
          ...prev,
          weight: prev.weight ? (Number(prev.weight) / 2.20462).toFixed(1) : '',
          height: prev.height ? (Number(prev.height) / 0.39370).toFixed(1) : '',
          waist: prev.waist ? (Number(prev.waist) / 0.39370).toFixed(1) : '',
          neck: prev.neck ? (Number(prev.neck) / 0.39370).toFixed(1) : '',
          hip: prev.hip ? (Number(prev.hip) / 0.39370).toFixed(1) : '',
        };
      }
    });
  };

  // --- SIMULATED SCAN ENGINE TRIGGER ---
  const handleRunScan = (e) => {
    e.preventDefault();
    if (!formData.name) return alert("Please specify the client's name.");

    // Convert inputs to Metric internally if they are Imperial
    let finalWeight = Number(formData.weight);
    let finalHeight = Number(formData.height);
    let finalWaist = Number(formData.waist);
    let finalNeck = Number(formData.neck);
    let finalHip = Number(formData.hip || 0);

    if (unitSystem === 'imperial') {
      finalWeight = finalWeight * 0.45359237;
      finalHeight = finalHeight * 2.54;
      finalWaist = finalWaist * 2.54;
      finalNeck = finalNeck * 2.54;
      finalHip = finalHip * 2.54;
    }

    setIsScanning(true);
    setScanStep(1);

    // Dynamic high-end HUD scanner phase shifts
    const interval = setInterval(() => {
      setScanStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          
          // Compile scan object
          const currentStats = calculateAssessment({
            name: formData.name,
            gender: formData.gender,
            age: Number(formData.age),
            weight: finalWeight,
            height: finalHeight,
            waist: finalWaist,
            neck: finalNeck,
            hip: finalHip,
            activityLevel: formData.activityLevel,
            fitnessGoal: formData.fitnessGoal,
            dailyWater: Number(formData.dailyWater),
            sleepHours: Number(formData.sleepHours),
            experience: formData.experience
          });

          const newScanHistoryItem = {
            date: new Date().toISOString().split('T')[0],
            weight: Number(finalWeight.toFixed(1)),
            bodyFat: Number(currentStats.bodyFat.toFixed(1)),
            fitnessScore: currentStats.fitnessScore
          };

          // Check if editing an existing client or adding new
          const existingClientIndex = clients.findIndex(c => c.name.toLowerCase() === formData.name.toLowerCase());
          
          let updatedClients;
          let targetClientId;

          if (existingClientIndex > -1) {
            // Add scan to existing history
            const targetClient = clients[existingClientIndex];
            const updatedHistory = [...targetClient.scansHistory, newScanHistoryItem];
            
            updatedClients = clients.map((c, i) => i === existingClientIndex ? {
              ...c,
              age: Number(formData.age),
              weight: finalWeight,
              height: finalHeight,
              waist: finalWaist,
              neck: finalNeck,
              hip: finalHip,
              activityLevel: formData.activityLevel,
              fitnessGoal: formData.fitnessGoal,
              dailyWater: Number(formData.dailyWater),
              sleepHours: Number(formData.sleepHours),
              experience: formData.experience,
              scansCount: updatedHistory.length,
              scansHistory: updatedHistory
            } : c);
            targetClientId = targetClient.id;
          } else {
            // Create brand new client
            const newId = 'client-' + Date.now();
            const newClient = {
              id: newId,
              name: formData.name,
              age: Number(formData.age),
              gender: formData.gender,
              weight: finalWeight,
              height: finalHeight,
              waist: finalWaist,
              neck: finalNeck,
              hip: finalHip,
              activityLevel: formData.activityLevel,
              fitnessGoal: formData.fitnessGoal,
              dailyWater: Number(formData.dailyWater),
              sleepHours: Number(formData.sleepHours),
              experience: formData.experience,
              scansCount: 1,
              scansHistory: [
                {
                  date: new Date().toISOString().split('T')[0],
                  weight: Number(finalWeight.toFixed(1)),
                  bodyFat: Number(currentStats.bodyFat.toFixed(1)),
                  fitnessScore: currentStats.fitnessScore
                }
              ],
              avatarColor: formData.gender === 'male' ? 'bg-emerald-500' : 'bg-pink-500',
              photoUrl: ""
            };
            updatedClients = [...clients, newClient];
            targetClientId = newId;
          }

          setClients(updatedClients);
          setActiveClientId(targetClientId);
          
          setTimeout(() => {
            setIsScanning(false);
            setShowNewClientForm(false);
            setActiveTab('dashboard');
          }, 600);

          return 0;
        }
        return prev + 1;
      });
    }, 1200);
  };

  // --- CHAT CONVERSATION AI LOGIC ---
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = { sender: 'user', text: chatInput };
    
    if (activeCoachTab === 'fitness') {
      const updatedMessages = [...fitnessChatMessages, userMessage];
      setFitnessChatMessages(updatedMessages);
      setChatInput('');

      setTimeout(() => {
        let replyText = "";
        const lowerInput = chatInput.toLowerCase();
        
        if (lowerInput.includes('lean') || lowerInput.includes('muscle') || lowerInput.includes('potential')) {
          replyText = `Regarding your lean potential, ${activeClient.name}, Casey Butt's skeletal equation models your framework's absolute natural muscle ceiling at ${activeStats.musclePotential}kg of dry lean body mass. Currently, you hold ${activeStats.lbm}kg. Your progressive overload potential is optimized inside a 6-12 rep heavy barbell block, prioritizing standard physical recovery.`;
        } else if (lowerInput.includes('fat') || lowerInput.includes('cardio') || lowerInput.includes('cut')) {
          replyText = `Based on your body fat composition of ${activeStats.bodyFat}%, the Navy assessment suggests focusing cardiorespiratory workload in Zone 2 cardio (steady-state pacing at 60-70% max heart rate) for 120 minutes weekly, protecting your ${activeStats.lbm}kg of active skeletal muscle tissue.`;
        } else if (lowerInput.includes('score') || lowerInput.includes('metric')) {
          replyText = `Your Composite Fitness Score of ${activeStats.fitnessScore}/100 is weighted against: Body Fat distribution (35%), relative muscular density (FFMI: ${activeStats.adjustedFfmi}) (30%), sleep efficiency (15%), metabolic lifestyle indexing (10%), and waist-to-height indices (10%). Elevating your sleep to 8+ hours will lift your active score by +5 points.`;
        } else {
          replyText = `Understood. Analyzing your athletic experience profile (${activeClient.experience} level) and active goal (${activeClient.fitnessGoal}), our sports sciences prioritize compound mechanical loading combined with specific functional core activations. We suggest doing 3-4 heavy lifts per week. How is your overall workout consistency?`;
        }
        
        setFitnessChatMessages(prev => [...prev, { sender: 'coach', text: replyText }]);
      }, 1000);
    } else {
      const updatedMessages = [...nutritionChatMessages, userMessage];
      setNutritionChatMessages(updatedMessages);
      setChatInput('');

      setTimeout(() => {
        let replyText = "";
        const lowerInput = chatInput.toLowerCase();

        if (lowerInput.includes('protein') || lowerInput.includes('eat') || lowerInput.includes('chicken')) {
          replyText = `To support your target of ${activeClient.fitnessGoal === 'fatLoss' ? 'rapid fat oxidization' : 'hypertrophic synthesis'}, our sports nutrition model outlines exactly ${activeStats.proteinReq}g of daily protein, distributed in 40-45g blocks across 4 meals. Focus on highly bioavailable sources: wild fish, cage-free poultry, high-grade egg whites, and pure whey isolate.`;
        } else if (lowerInput.includes('water') || lowerInput.includes('drink') || lowerInput.includes('hydration')) {
          replyText = `Intracellular water holds a direct link to protein synthesis. Your base calculated requirement stands at ${activeStats.waterReq}L per day. During training days, you should supplement this with 600ml of water containing 500mg sodium and 150mg potassium to sustain intra-muscular pump and prevent sodium depletion.`;
        } else if (lowerInput.includes('calorie') || lowerInput.includes('deficit') || lowerInput.includes('surplus')) {
          replyText = `Your Total Daily Energy Expenditure (TDEE) is calculated at ${activeStats.tdee} kcal, with a BMR of ${activeStats.bmr} kcal. For ${activeClient.fitnessGoal === 'fatLoss' ? 'cutting body fat' : 'clean lean bulk'}, we recommend consuming exactly ${activeClient.fitnessGoal === 'fatLoss' ? activeStats.tdee - 450 : activeStats.tdee + 250} kcal. This creates a highly controlled metabolic environment.`;
        } else {
          replyText = `Excellent. Let's analyze this nutritional angle. Your BMR requires a core baseline of ${activeStats.bmr} kcal just for essential cellular maintenance. Adjusting for your ${activeClient.activityLevel} activity scale, we hold a substantial dynamic caloric framework. Do you utilize any training supplementation currently?`;
        }

        setNutritionChatMessages(prev => [...prev, { sender: 'coach', text: replyText }]);
      }, 1000);
    }
  };

  // --- COMPARE CLIENT MANAGEMENT ---
  const handleToggleCompare = (id) => {
    if (compareClientIds.includes(id)) {
      if (compareClientIds.length <= 1) return; // Keep at least one
      setCompareClientIds(compareClientIds.filter(cid => cid !== id));
    } else {
      if (compareClientIds.length >= 3) {
        // Swap first element
        setCompareClientIds([compareClientIds[1], id]);
      } else {
        setCompareClientIds([...compareClientIds, id]);
      }
    }
  };

  const handleDeleteClient = (id, e) => {
    e.stopPropagation();
    if (clients.length <= 1) {
      alert("A minimum of 1 client profile is required.");
      return;
    }
    if (confirm("Are you sure you want to permanently delete this client body profile?")) {
      const remaining = clients.filter(c => c.id !== id);
      setClients(remaining);
      if (activeClientId === id) {
        setActiveClientId(remaining[0].id);
      }
    }
  };

  // Pre-fill form when click edit / new scan
  const handleOpenScanForm = (client = null) => {
    if (client) {
      // Pre-fill with existing client data (converted to active unit system)
      let w = client.weight;
      let h = client.height;
      let wa = client.waist;
      let n = client.neck;
      let hi = client.hip || 0;

      if (unitSystem === 'imperial') {
        w = w * 2.20462;
        h = h * 0.39370;
        wa = wa * 0.39370;
        n = n * 0.39370;
        hi = hi * 0.39370;
      }

      setFormData({
        name: client.name,
        age: String(client.age),
        gender: client.gender,
        weight: String(w.toFixed(1)),
        height: String(h.toFixed(1)),
        waist: String(wa.toFixed(1)),
        neck: String(n.toFixed(1)),
        hip: String(hi.toFixed(1)),
        activityLevel: client.activityLevel,
        fitnessGoal: client.fitnessGoal,
        dailyWater: String(client.dailyWater),
        sleepHours: String(client.sleepHours),
        experience: client.experience
      });
    } else {
      // Clear form for brand new client
      setFormData({
        name: '',
        age: '30',
        gender: 'male',
        weight: unitSystem === 'metric' ? '75' : '165',
        height: unitSystem === 'metric' ? '175' : '69',
        waist: unitSystem === 'metric' ? '82' : '32',
        neck: unitSystem === 'metric' ? '37' : '14.5',
        hip: unitSystem === 'metric' ? '92' : '36',
        activityLevel: 'moderate',
        fitnessGoal: 'recomp',
        dailyWater: '2.5',
        sleepHours: '8',
        experience: 'intermediate'
      });
    }
    setShowNewClientForm(true);
  };

  // Convert client display numbers for active UI system
  const formatWeight = (kg) => {
    if (unitSystem === 'imperial') {
      return `${(kg * 2.20462).toFixed(1)} lbs`;
    }
    return `${kg.toFixed(1)} kg`;
  };

  const formatHeight = (cm) => {
    if (unitSystem === 'imperial') {
      return `${(cm * 0.39370).toFixed(1)} in`;
    }
    return `${cm.toFixed(0)} cm`;
  };

  const formatCircumference = (cm) => {
    if (unitSystem === 'imperial') {
      return `${(cm * 0.39370).toFixed(1)} in`;
    }
    return `${cm.toFixed(1)} cm`;
  };

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 flex flex-col antialiased select-none relative overflow-x-hidden">
      
      {/* BACKGROUND NEON GLOWS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neonBlue-light opacity-[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neonGreen-light opacity-[0.03] blur-[150px] pointer-events-none" />

      {/* --- HUD BIOMETRIC SCANNING OVERLAY --- */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-obsidian-dark bg-opacity-95 flex flex-col items-center justify-center p-6 scan-hud-grid select-none">
          <div className="absolute top-6 left-6 flex items-center space-x-2">
            <Activity className="w-6 h-6 text-neonBlue-glow animate-pulse-glow" />
            <span className="text-xs font-mono text-neonBlue-glow tracking-widest uppercase">FITSCAN PRO // BIOMETRICS</span>
          </div>

          <div className="w-80 h-96 relative flex flex-col items-center justify-center border border-slate-800 rounded-2xl glass-card overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-opacity-5" style={{
              backgroundImage: 'radial-gradient(circle, rgba(0, 242, 254, 0.15) 1px, transparent 1px)',
              backgroundSize: '15px 15px'
            }} />

            {/* Glowing Laser Scan Bar */}
            <div className="absolute left-0 right-0 h-20 scan-bar-active animate-scan-line top-0 z-10" />

            {/* Anatomical Skeletal Visual (CSS representation) */}
            <div className="relative z-0 flex flex-col items-center space-y-4 opacity-70">
              <Brain className="w-12 h-12 text-neonBlue-glow animate-pulse" />
              <div className="w-1 h-16 bg-slate-700 rounded-full" />
              <div className="w-24 h-1 bg-slate-700 rounded-full" />
              <Layers className="w-16 h-16 text-neonGreen-glow animate-bounce" />
              <div className="w-1 h-20 bg-slate-700 rounded-full" />
              <Scale className="w-10 h-10 text-neonPurple-glow animate-pulse" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] font-mono text-slate-500">
              <span>VOLTAGE: 50kHz / 250kHz</span>
              <span>IMPEDANCE ACTIVE</span>
            </div>
          </div>

          {/* Scanning step titles */}
          <div className="mt-8 text-center max-w-md">
            <div className="text-xl font-bold tracking-widest text-slate-100 uppercase mb-2">
              {scanStep === 1 && "INTAKE STRUCTURAL VERIFICATION..."}
              {scanStep === 2 && "CALCULATING NAVY BODY COMPOSITION..."}
              {scanStep === 3 && "SKELETAL MUSCLE FAT MASS COMPILING..."}
              {scanStep === 4 && "AI COACH RECOMMENDATIONS COMPILING..."}
            </div>
            
            <div className="w-64 bg-slate-800 h-1.5 rounded-full overflow-hidden mx-auto mb-4 border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-neonBlue-glow to-neonGreen-glow transition-all duration-1000"
                style={{ width: `${(scanStep / 4) * 100}%` }}
              />
            </div>

            <p className="text-xs text-slate-400 font-mono">
              {scanStep === 1 && "Parsing height metrics, anatomical coordinates, gender scaling."}
              {scanStep === 2 && "Analyzing circumference difference equations: Waist to Neck variance."}
              {scanStep === 3 && "Segmenting dry lean mass threshold. Constructing Mifflin BMR balance."}
              {scanStep === 4 && "Writing metabolic age matrices, protein thresholds and trainer reports."}
            </p>
          </div>
        </div>
      )}

      {/* --- TOP APPLICATION HEADER --- */}
      <header className="no-print border-b border-glass-border glass-card px-6 py-4 flex flex-wrap items-center justify-between sticky top-0 z-40 select-none">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-neonBlue-light to-neonBlue-glow rounded-xl shadow-lg glow-border-blue">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center">
              FitScan<span className="text-neonBlue-glow">Pro</span>
              <span className="ml-2 text-[9px] font-mono border border-neonBlue-glow text-neonBlue-glow px-1.5 py-0.5 rounded uppercase">GYM CORE</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Bio-Composition Assessment</p>
          </div>
        </div>

        {/* Dynamic Mode Selector */}
        <nav className="flex items-center space-x-1 my-2 md:my-0">
          <button 
            onClick={() => { setActiveTab('dashboard'); setShowNewClientForm(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'dashboard' && !showNewClientForm
                ? 'bg-gradient-to-r from-neonBlue-light to-neonBlue-glow text-white shadow-md' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Client Scan Report
          </button>
          
          <button 
            onClick={() => { setActiveTab('trainer'); setShowNewClientForm(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'trainer'
                ? 'bg-gradient-to-r from-neonBlue-light to-neonBlue-glow text-white shadow-md' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Trainer Console ({clients.length})
          </button>

          <button 
            onClick={() => { setActiveTab('comparison'); setShowNewClientForm(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'comparison'
                ? 'bg-gradient-to-r from-neonBlue-light to-neonBlue-glow text-white shadow-md' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Metric Comparison
          </button>

          <button 
            onClick={() => { setActiveTab('ai-coach'); setShowNewClientForm(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'ai-coach'
                ? 'bg-gradient-to-r from-neonBlue-light to-neonBlue-glow text-white shadow-md' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            AI Consultation Desk
          </button>
        </nav>

        {/* Global Controls & Preset Switcher */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleUnitToggle}
            className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-slate-300 hover:text-white tracking-widest uppercase transition"
          >
            UNITS: {unitSystem.toUpperCase()}
          </button>

          <button
            onClick={() => handleOpenScanForm(null)}
            className="bg-neonGreen-light hover:bg-neonGreen hover:shadow-lg hover:shadow-neonGreen/10 text-obsidian px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Gym Scan</span>
          </button>
        </div>
      </header>

      {/* --- MAIN SPLIT DASHBOARD LAYOUT --- */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative select-none">
        
        {/* --- CLIENT SELECTOR SIDEBAR (Visible for quick switches on large screens) --- */}
        <aside className="no-print w-full lg:w-72 border-r border-glass-border glass-card p-4 flex flex-col space-y-4 shrink-0 lg:max-h-[calc(100vh-73px)] overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">GYM CLIENT BASE</span>
            <span className="bg-slate-800 text-slate-300 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">LIVE SYNC</span>
          </div>

          <div className="space-y-2 flex-1">
            {clients.map(client => {
              const isActive = client.id === activeClientId;
              const clStats = calculateAssessment({
                name: client.name,
                gender: client.gender,
                age: Number(client.age),
                weight: Number(client.weight),
                height: Number(client.height),
                waist: Number(client.waist),
                neck: Number(client.neck),
                hip: Number(client.hip || 0),
                activityLevel: client.activityLevel,
                fitnessGoal: client.fitnessGoal,
                dailyWater: Number(client.dailyWater),
                sleepHours: Number(client.sleepHours),
                experience: client.experience
              });
              
              return (
                <div 
                  key={client.id}
                  onClick={() => {
                    setActiveClientId(client.id);
                    if (activeTab === 'ai-coach') {
                      // refresh chat intro
                    }
                  }}
                  className={`p-3 rounded-xl cursor-pointer flex items-center justify-between border transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-neonBlue-glow shadow-md glow-border-blue' 
                      : 'bg-transparent border-glass-border hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full ${client.avatarColor} flex items-center justify-center font-bold text-xs text-white`}>
                      {client.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">{client.name}</h4>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5 capitalize">
                        {client.fitnessGoal === 'recomp' ? 'Recomp' : client.fitnessGoal === 'fatLoss' ? 'Fat Loss' : 'Lean Bulk'} • {clStats.fitnessScore} Score
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1.5">
                    {/* Tiny trend spark indicators */}
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-slate-200 block">
                        {formatWeight(client.weight)}
                      </span>
                      <span className="text-[8px] font-mono text-slate-400 block capitalize">
                        {client.gender}
                      </span>
                    </div>

                    <button 
                      onClick={(e) => handleDeleteClient(client.id, e)}
                      className="p-1 text-slate-500 hover:text-rose-500 hover:bg-slate-800 rounded transition"
                      title="Delete profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-glass-border">
            <button
              onClick={() => handleOpenScanForm(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Gym Client</span>
            </button>
          </div>
        </aside>

        {/* --- DYNAMIC DASHBOARD CONTAINER --- */}
        <section className="flex-1 p-6 overflow-y-auto lg:max-h-[calc(100vh-73px)] space-y-6">

          {/* --- SUB-VIEW: SCAN INPUT FORM / UPDATE CLIENT --- */}
          {showNewClientForm && (
            <div className="max-w-3xl mx-auto glass-card rounded-2xl border border-glass-border p-6 shadow-xl relative animate-fadeIn select-none">
              <button 
                onClick={() => setShowNewClientForm(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-mono border border-slate-800 px-2.5 py-1 rounded-md"
              >
                ESC CANCEL
              </button>

              <div className="flex items-center space-x-2.5 mb-6">
                <Sparkles className="w-5 h-5 text-neonGreen-glow animate-pulse-glow" />
                <div>
                  <h3 className="text-lg font-bold text-white">Biometric Body Scan Assessment Intake</h3>
                  <p className="text-xs text-slate-400">Replicating a professional clinical gym evaluation (InBody/Tanita U.S. Navy Method)</p>
                </div>
              </div>

              <form onSubmit={handleRunScan} className="space-y-6">
                {/* 1. Primary Identifiers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Client Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neonBlue-glow"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Chronological Age</label>
                    <input 
                      type="number" 
                      min="15" 
                      max="100"
                      value={formData.age}
                      onChange={e => setFormData({...formData, age: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neonBlue-glow"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Biological Gender</label>
                    <select 
                      value={formData.gender}
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neonBlue-glow"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                {/* 2. Biometric Metrics (Handles Metric vs Imperial dynamically) */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-neonBlue-glow uppercase tracking-widest font-mono">Biometrics ({unitSystem === 'metric' ? 'Metric System' : 'Imperial System'})</span>
                    <button 
                      type="button"
                      onClick={handleUnitToggle}
                      className="text-[9px] font-mono text-slate-400 hover:text-white underline"
                    >
                      Convert to {unitSystem === 'metric' ? 'Imperial (lbs/in)' : 'Metric (kg/cm)'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">
                        Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                      </label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={formData.weight}
                        onChange={e => setFormData({...formData, weight: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neonBlue-glow"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">
                        Height ({unitSystem === 'metric' ? 'cm' : 'inches'})
                      </label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={formData.height}
                        onChange={e => setFormData({...formData, height: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neonBlue-glow"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">
                        Waist ({unitSystem === 'metric' ? 'cm' : 'inches'})
                      </label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={formData.waist}
                        onChange={e => setFormData({...formData, waist: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neonBlue-glow"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">
                        Neck ({unitSystem === 'metric' ? 'cm' : 'inches'})
                      </label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={formData.neck}
                        onChange={e => setFormData({...formData, neck: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neonBlue-glow"
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5 ${formData.gender === 'male' ? 'opacity-30' : ''}`}>
                        Hip ({unitSystem === 'metric' ? 'cm' : 'inches'}) *F
                      </label>
                      <input 
                        type="number" 
                        step="0.1"
                        disabled={formData.gender === 'male'}
                        value={formData.gender === 'male' ? '0' : formData.hip}
                        onChange={e => setFormData({...formData, hip: e.target.value})}
                        className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neonBlue-glow ${formData.gender === 'male' ? 'opacity-30 cursor-not-allowed' : ''}`}
                        required={formData.gender === 'female'}
                      />
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-500 font-mono">
                    * U.S. Navy Circumference formula takes waist and neck metrics for males. Hip measurements are standard for female client evaluations.
                  </p>
                </div>

                {/* 3. Training & Recovery Modifiers */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Gym Goals</label>
                    <select 
                      value={formData.fitnessGoal}
                      onChange={e => setFormData({...formData, fitnessGoal: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neonBlue-glow"
                    >
                      <option value="recomp">Body Recomposition</option>
                      <option value="fatLoss">Rapid Fat Loss</option>
                      <option value="bulk">Lean Bulk Hypertrophy</option>
                      <option value="performance">Athlete Peak Performance</option>
                      <option value="general">General Physical Health</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Activity Factor</label>
                    <select 
                      value={formData.activityLevel}
                      onChange={e => setFormData({...formData, activityLevel: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neonBlue-glow"
                    >
                      <option value="sedentary">Sedentary (Office/Desk)</option>
                      <option value="light">Light Active (1-2x gym)</option>
                      <option value="moderate">Moderately Active (3-4x gym)</option>
                      <option value="active">Very Active (5+ heavy lifts)</option>
                      <option value="athlete">Elite Athlete (Two-a-days)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Daily Water (Liters)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      min="0.5" 
                      max="10"
                      value={formData.dailyWater}
                      onChange={e => setFormData({...formData, dailyWater: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neonBlue-glow"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Sleep Compliance (Hours)</label>
                    <input 
                      type="number" 
                      step="0.5" 
                      min="3" 
                      max="15"
                      value={formData.sleepHours}
                      onChange={e => setFormData({...formData, sleepHours: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neonBlue-glow"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Lifting History Experience</label>
                    <select 
                      value={formData.experience}
                      onChange={e => setFormData({...formData, experience: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neonBlue-glow"
                    >
                      <option value="beginner">Beginner (Under 1 Year)</option>
                      <option value="intermediate">Intermediate (1-3 Years)</option>
                      <option value="advanced">Advanced (3+ Years Overload)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex space-x-3">
                  <button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-neonBlue-light to-neonBlue-glow hover:shadow-lg hover:shadow-neonBlue-light/10 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition"
                  >
                    Run Body Scan Analyzer
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowNewClientForm(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-6 rounded-xl text-xs uppercase transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- TAB VIEW 1: CLIENT ASSESSMENT REPORT (DASHBOARD) --- */}
          {activeTab === 'dashboard' && !showNewClientForm && (
            <div className="space-y-6">
              
              {/* --- ACTION HEADER ROW --- */}
              <div className="no-print flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-xl border border-glass-border glass-card select-none">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full ${activeClient.avatarColor} flex items-center justify-center font-bold text-lg text-white`}>
                    {activeClient.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold text-white">{activeClient.name}</h2>
                      <span className="text-[10px] bg-slate-800 text-neonBlue-glow px-2 py-0.5 rounded font-mono capitalize">{activeClient.experience} Athlete</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Last Assessment Scan: {activeClient.scansHistory[activeClient.scansHistory.length - 1]?.date || 'Today'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleOpenScanForm(activeClient)}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-Scan Intake</span>
                  </button>

                  <button 
                    onClick={() => window.print()}
                    className="bg-neonBlue hover:bg-neonBlue-light text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md glow-border-blue transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Print InBody Report</span>
                  </button>
                </div>
              </div>

              {/* --- PRINT ONLY MEDICAL HEADER --- */}
              <div className="hidden print-only text-black p-6 border-b-2 border-slate-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">FITSCAN PRO</h1>
                    <p className="text-xs font-mono uppercase tracking-widest text-slate-600">CLINICAL GYM BODY COMPOSITION REPORT</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">CLIENT: {activeClient.name}</p>
                    <p className="text-xs text-slate-600">Age: {activeClient.age} • Gender: {activeClient.gender} • Goal: {activeClient.fitnessGoal}</p>
                    <p className="text-xs text-slate-600">Generated: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* --- 1. CORE COMPOSITION SCORES GRID --- */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 select-none">
                
                {/* 1A. Composite Fitness Score */}
                <div className="glass-card print-card rounded-2xl border border-glass-border p-5 flex flex-col items-center justify-between text-center relative overflow-hidden">
                  <div className="absolute top-3 left-3">
                    <Award className="w-5 h-5 text-neonBlue-glow animate-pulse-glow" />
                  </div>
                  
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-4">FITNESS SCORE</span>

                  <div className="relative w-36 h-36 flex items-center justify-center select-none">
                    {/* SVG Circular Progress Bar */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="42" 
                        fill="transparent" 
                        stroke="rgba(255,255,255,0.03)" 
                        strokeWidth="8"
                      />
                      <circle 
                        cx="50" cy="50" r="42" 
                        fill="transparent" 
                        stroke="url(#fitnessGrad)" 
                        strokeWidth="8"
                        strokeDasharray={263.89}
                        strokeDashoffset={263.89 - (263.89 * activeStats.fitnessScore) / 100}
                        strokeLinecap="round"
                        className="circular-progress"
                      />
                      <defs>
                        <linearGradient id="fitnessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00f2fe" />
                          <stop offset="100%" stopColor="#0072ff" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-extrabold text-white tracking-tight glow-text-blue">{activeStats.fitnessScore}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">OF 100</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 font-mono mt-4">
                    Excellent athletic efficiency. High FFMI ratio relative to skeletal indices.
                  </p>
                </div>

                {/* 1B. Metabolic Age vs Chronological */}
                <div className="glass-card print-card rounded-2xl border border-glass-border p-5 flex flex-col items-center justify-between text-center relative overflow-hidden">
                  <div className="absolute top-3 left-3">
                    <Brain className="w-5 h-5 text-neonGreen-glow animate-pulse-glow" />
                  </div>
                  
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-4">METABOLIC AGE</span>

                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="42" 
                        fill="transparent" 
                        stroke="rgba(255,255,255,0.03)" 
                        strokeWidth="8"
                      />
                      {/* Scale comparison indicator */}
                      <circle 
                        cx="50" cy="50" r="42" 
                        fill="transparent" 
                        stroke="url(#metabolicGrad)" 
                        strokeWidth="8"
                        strokeDasharray={263.89}
                        strokeDashoffset={263.89 - (263.89 * Math.max(30, 100 - (activeStats.metabolicAge - activeClient.age) * 5)) / 100}
                        strokeLinecap="round"
                        className="circular-progress"
                      />
                      <defs>
                        <linearGradient id="metabolicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#05ffc4" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-extrabold text-white tracking-tight glow-text-green">{activeStats.metabolicAge}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">YEARS OLD</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 font-mono mt-4">
                    Chronological Age: <span className="text-white font-bold">{activeClient.age}</span> • Variance: <span className={`font-bold ${activeStats.metabolicAge <= activeClient.age ? 'text-neonGreen-glow' : 'text-rose-500'}`}>{activeStats.metabolicAge - activeClient.age} yrs</span>
                  </p>
                </div>

                {/* 1C. WHOOP-Style Health Recovery Ring */}
                <div className="glass-card print-card rounded-2xl border border-glass-border p-5 flex flex-col items-center justify-between text-center relative overflow-hidden">
                  <div className="absolute top-3 left-3">
                    <Heart className="w-5 h-5 text-neonPurple-glow animate-pulse-glow" />
                  </div>
                  
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-4">HEALTH / STRIPE SCORE</span>

                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="42" 
                        fill="transparent" 
                        stroke="rgba(255,255,255,0.03)" 
                        strokeWidth="8"
                      />
                      <circle 
                        cx="50" cy="50" r="42" 
                        fill="transparent" 
                        stroke="url(#healthGrad)" 
                        strokeWidth="8"
                        // Score formula using sleep, water and waist indices
                        strokeDasharray={263.89}
                        strokeDashoffset={263.89 - (263.89 * Math.round((Number(activeClient.sleepHours)/8)*50 + (Number(activeClient.dailyWater)/activeStats.waterReq)*50)) / 100}
                        strokeLinecap="round"
                        className="circular-progress"
                      />
                      <defs>
                        <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#d946ef" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-extrabold text-white tracking-tight glow-text-purple">
                        {Math.min(100, Math.round((Number(activeClient.sleepHours)/8)*50 + (Number(activeClient.dailyWater)/activeStats.waterReq)*50))}%
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">RECOVERY</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 font-mono mt-4">
                    Sleep: <span className="text-white font-bold">{activeClient.sleepHours} hrs</span> • Fluids: <span className="text-white font-bold">{activeClient.dailyWater}L</span>
                  </p>
                </div>

                {/* 1D. Body Fat Scale Gauge */}
                <div className="glass-card print-card rounded-2xl border border-glass-border p-5 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-3 left-3">
                    <Scale className="w-5 h-5 text-slate-400" />
                  </div>
                  
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block mb-4">BODY FAT %</span>
                    <span className="text-4xl font-extrabold text-white tracking-tight glow-text-blue block my-2">
                      {activeStats.bodyFat}%
                    </span>
                    <span className="bg-slate-800 text-[10px] text-slate-300 font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                      {activeStats.bodyFat < (activeClient.gender === 'male' ? 8 : 15) ? 'Hyper-Lean' : 
                       activeStats.bodyFat <= (activeClient.gender === 'male' ? 14 : 22) ? 'Peak Athletic' : 
                       activeStats.bodyFat <= (activeClient.gender === 'male' ? 20 : 28) ? 'Active Normal' : 
                       activeStats.bodyFat <= (activeClient.gender === 'male' ? 26 : 34) ? 'Moderate Excess' : 'High Excess'}
                    </span>
                  </div>

                  {/* Visual segment slider */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                      <span>LEAN</span>
                      <span>FIT</span>
                      <span>AVG</span>
                      <span>HIGH</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-rose-500" 
                        style={{ width: '100%' }}
                      />
                      {/* Marker */}
                      <div 
                        className="absolute w-2 h-4 bg-white border border-black rounded-sm top-[-5px] -translate-x-1/2 shadow transition-all duration-700"
                        style={{ left: `${Math.min(100, Math.max(0, (activeStats.bodyFat / 40) * 100))}%` }}
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 font-mono">
                        Fat Mass: <span className="text-white font-bold">{formatWeight(activeStats.fatMass)}</span>
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* --- 2. SIGNATURE INBODY SKELETAL-MUSCLE-FAT BALANCE GRID --- */}
              <div className="glass-card print-card rounded-2xl border border-glass-border p-6 shadow-md select-none">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-1.5">
                      <Layers className="w-4 h-4 text-neonBlue-glow" />
                      <span>InBody Muscle-Fat Mass Analysis</span>
                    </h3>
                    <p className="text-xs text-slate-400">Classic diagnostic comparison balancing total weight, active skeletal muscle, and stored body fat.</p>
                  </div>
                  <span className="bg-slate-800/80 border border-slate-700 text-slate-300 text-[10px] px-2.5 py-1 rounded-md font-mono">
                    SIGNATURE METRIC CHART
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Weight Row */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300 w-32 font-mono">Weight (Body Mass)</span>
                      <span className="text-xs font-bold text-slate-200 font-mono">{formatWeight(activeClient.weight)}</span>
                    </div>
                    <div className="relative flex items-center h-5">
                      {/* Baseline indicators */}
                      <div className="absolute inset-y-0 left-[35%] w-0.5 bg-slate-700 border-dashed" title="Under Limit" />
                      <div className="absolute inset-y-0 left-[60%] w-0.5 bg-slate-700 border-dashed" title="Ideal Baseline" />
                      <div className="absolute inset-y-0 left-[85%] w-0.5 bg-slate-700 border-dashed" title="Over Limit" />
                      
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-sky-500 to-sky-600 transition-all duration-700"
                          style={{ width: `${Math.min(100, Math.max(10, (activeClient.weight / 150) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skeletal Muscle Mass Row (LBM) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300 w-32 font-mono">Lean Body Mass (LBM)</span>
                      <span className="text-xs font-bold text-neonGreen-glow font-mono">{formatWeight(activeStats.lbm)}</span>
                    </div>
                    <div className="relative flex items-center h-5">
                      <div className="absolute inset-y-0 left-[35%] w-0.5 bg-slate-700 border-dashed" />
                      <div className="absolute inset-y-0 left-[60%] w-0.5 bg-slate-700 border-dashed" />
                      <div className="absolute inset-y-0 left-[85%] w-0.5 bg-slate-700 border-dashed" />

                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-700"
                          style={{ width: `${Math.min(100, Math.max(10, (activeStats.lbm / 110) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fat Mass Row */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300 w-32 font-mono">Fat Mass</span>
                      <span className="text-xs font-bold text-rose-400 font-mono">{formatWeight(activeStats.fatMass)}</span>
                    </div>
                    <div className="relative flex items-center h-5">
                      <div className="absolute inset-y-0 left-[35%] w-0.5 bg-slate-700 border-dashed" />
                      <div className="absolute inset-y-0 left-[60%] w-0.5 bg-slate-700 border-dashed" />
                      <div className="absolute inset-y-0 left-[85%] w-0.5 bg-slate-700 border-dashed" />

                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-700"
                          style={{ width: `${Math.min(100, Math.max(10, (activeStats.fatMass / 50) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-glass-border text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">BMI RANGE</span>
                    <span className="font-bold text-white font-mono mt-0.5 block">{activeStats.bmi}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">IDEAL WEIGHT</span>
                    <span className="font-bold text-white font-mono mt-0.5 block">
                      {formatWeight(activeStats.idealWeightRange.min)} - {formatWeight(activeStats.idealWeightRange.max)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">WAIST TO HEIGHT</span>
                    <span className="font-bold text-white font-mono mt-0.5 block">{activeStats.waistToHeightRatio}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">CIRCUMFERENCES</span>
                    <span className="font-bold text-white font-mono mt-0.5 block">
                      W: {formatCircumference(activeClient.waist)} • N: {formatCircumference(activeClient.neck)}
                    </span>
                  </div>
                </div>
              </div>

              {/* --- 3. DETAILED CALCULATED PARAMETERS TABS GRID --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
                
                {/* 3A. Energy & Expenditure */}
                <div className="glass-card print-card rounded-2xl border border-glass-border p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5 uppercase tracking-wider">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>Metabolic & Daily Energy</span>
                  </h4>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-glass-border">
                      <span className="text-slate-400">Basal Metabolic Rate (BMR)</span>
                      <span className="font-bold text-white text-right">{activeStats.bmr} kcal</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-glass-border">
                      <span className="text-slate-400">TDEE Expenditure</span>
                      <span className="font-bold text-white text-right">{activeStats.tdee} kcal</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-glass-border">
                      <span className="text-slate-400">Target Calories ({activeClient.fitnessGoal === 'fatLoss' ? 'Deficit' : activeClient.fitnessGoal === 'bulk' ? 'Surplus' : 'Recomp'})</span>
                      <span className="font-bold text-neonBlue-glow text-right">
                        {activeClient.fitnessGoal === 'fatLoss' 
                          ? activeStats.tdee - 450 
                          : activeClient.fitnessGoal === 'bulk' 
                            ? activeStats.tdee + 250 
                            : activeStats.tdee} kcal
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Activity Multiplier</span>
                      <span className="text-slate-300 text-right capitalize">{activeClient.activityLevel} (x{activeStats.tdee / activeStats.bmr ? (activeStats.tdee / activeStats.bmr).toFixed(3) : '1.55'})</span>
                    </div>
                  </div>
                </div>

                {/* 3B. Sports Science Athletic Indices */}
                <div className="glass-card print-card rounded-2xl border border-glass-border p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5 uppercase tracking-wider">
                    <Dumbbell className="w-4 h-4 text-neonGreen-glow" />
                    <span>Athletic & Skeletal Indices</span>
                  </h4>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-glass-border">
                      <span className="text-slate-400">Fat-Free Mass Index (FFMI)</span>
                      <span className="font-bold text-white text-right">{activeStats.ffmi}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-glass-border">
                      <span className="text-slate-400">Height-Adjusted FFMI</span>
                      <span className="font-bold text-neonGreen-glow text-right">{activeStats.adjustedFfmi}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-glass-border">
                      <span className="text-slate-400">Max Natural LBM Capacity</span>
                      <span className="font-bold text-white text-right">{formatWeight(activeStats.musclePotential)}</span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Muscle Growth Room</span>
                      <span className="text-slate-300 text-right">
                        +{formatWeight(Math.max(0, activeStats.musclePotential - activeStats.lbm))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3C. Sports Nutrition & Fluid Protocol */}
                <div className="glass-card print-card rounded-2xl border border-glass-border p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5 uppercase tracking-wider">
                    <Droplet className="w-4 h-4 text-teal-400" />
                    <span>Sports Nutrition Quotas</span>
                  </h4>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-glass-border">
                      <span className="text-slate-400">Protein Target</span>
                      <span className="font-bold text-neonGreen-glow text-right">{activeStats.proteinReq} g / day</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-glass-border">
                      <span className="text-slate-400">Baseline Hydration Quota</span>
                      <span className="font-bold text-sky-400 text-right">{activeStats.waterReq} L / day</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-glass-border">
                      <span className="text-slate-400">Current Water Intake</span>
                      <span className="font-bold text-white text-right">{activeClient.dailyWater} L / day</span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Hydration Fulfillment</span>
                      <span className={`font-bold text-right ${Number(activeClient.dailyWater) >= activeStats.waterReq ? 'text-neonGreen-glow' : 'text-amber-400'}`}>
                        {Math.round((Number(activeClient.dailyWater) / activeStats.waterReq) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* --- 4. ADVANCED CHARTS & TREND GRAPHING (Recharts Integration) --- */}
              <div className="no-print glass-card rounded-2xl border border-glass-border p-6 shadow-md select-none">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-1.5">
                      <TrendingUp className="w-4 h-4 text-neonBlue-glow" />
                      <span>Biometric Trend & Score Tracking</span>
                    </h3>
                    <p className="text-xs text-slate-400">Mapping client historical progress scans to capture body fat oxidation curves and fitness gains.</p>
                  </div>
                  <div className="bg-slate-800/80 text-slate-300 text-[10px] px-2.5 py-1 rounded-md font-mono border border-slate-700">
                    HISTORIC SCANS ({activeClient.scansHistory.length})
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeClient.scansHistory} margin={{ top: 10, right: 30, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis yAxisId="left" stroke="#38bdf8" fontSize={10} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" stroke="#fb7185" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                      <Line yAxisId="left" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#00f2fe" strokeWidth={3} activeDot={{ r: 8 }} />
                      <Line yAxisId="right" type="monotone" dataKey="bodyFat" name="Body Fat (%)" stroke="#fb7185" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* --- 5. AI SPORTS SCIENCE & COACHING RECOMMENDATION REPORT --- */}
              <div className="glass-card print-card rounded-2xl border border-glass-border p-6 shadow-md select-none space-y-6">
                <div className="flex items-center space-x-2.5 pb-4 border-b border-glass-border">
                  <Sparkles className="w-5 h-5 text-neonGreen-glow animate-pulse-glow" />
                  <div>
                    <h3 className="text-base font-bold text-white">Elite Science Coaching & Sports Assessment</h3>
                    <p className="text-xs text-slate-400">Automated diagnostic summaries parsed across metabolic, skeletal and lipid metrics.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Strengths & Weaknesses */}
                  <div className="lg:col-span-1 space-y-5">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neonGreen-glow flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Identified Strengths</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {aiReport.strengths.map((str, idx) => (
                          <li key={idx} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                            {str}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                        <ShieldAlert className="w-4 h-4" />
                        <span>Identified Risks / Focus Areas</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {aiReport.weaknesses.map((weak, idx) => (
                          <li key={idx} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                            {weak}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Goal Recommendations Panels */}
                  <div className="lg:col-span-2 space-y-5">
                    <div className="p-4 bg-slate-900/40 border border-glass-border rounded-xl space-y-2">
                      <h4 className="text-xs font-bold text-white font-mono uppercase tracking-widest flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-neonBlue-glow rounded-full mr-1.5" />
                        <span>AI Coach Diagnostic Summary</span>
                      </h4>
                      <p className="text-xs text-slate-300 italic whitespace-pre-line leading-relaxed">
                        "{aiReport.coachFeedback}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">FAT OXIDIZATION RECOMMENDATION</span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {aiReport.fatLossGuide}
                        </p>
                      </div>

                      <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">HYPERTROPHIC MUSCLE RECOMMENDATION</span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {aiReport.muscleGainGuide}
                        </p>
                      </div>

                      <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">SPORTS NUTRITION SUMMARY</span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {aiReport.nutritionGuide}
                        </p>
                      </div>

                      <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">RECOVERY & NEURAL PROTOCOL</span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {aiReport.recoveryGuide}
                        </p>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* --- TAB VIEW 2: TRAINER HUB TERMINAL (MULTIPLE CLIENTS OVERVIEW) --- */}
          {activeTab === 'trainer' && (
            <div className="space-y-6 select-none">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-glass-border glass-card">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Users className="w-5 h-5 text-neonBlue-glow" />
                    <span>Gym Trainer Terminal</span>
                  </h2>
                  <p className="text-xs text-slate-400">Comprehensive overview managing all body assessments and client records in real-time.</p>
                </div>
                
                <button
                  onClick={() => handleOpenScanForm(null)}
                  className="bg-neonGreen hover:bg-neonGreen-light text-obsidian px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Scan New Client</span>
                </button>
              </div>

              {/* Client List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {clients.map(client => {
                  const clStats = calculateAssessment({
                    name: client.name,
                    gender: client.gender,
                    age: Number(client.age),
                    weight: Number(client.weight),
                    height: Number(client.height),
                    waist: Number(client.waist),
                    neck: Number(client.neck),
                    hip: Number(client.hip || 0),
                    activityLevel: client.activityLevel,
                    fitnessGoal: client.fitnessGoal,
                    dailyWater: Number(client.dailyWater),
                    sleepHours: Number(client.sleepHours),
                    experience: client.experience
                  });

                  return (
                    <div 
                      key={client.id}
                      className="glass-card rounded-2xl border border-glass-border p-5 space-y-4 hover:border-neonBlue-glow/40 transition-all cursor-pointer"
                      onClick={() => {
                        setActiveClientId(client.id);
                        setActiveTab('dashboard');
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full ${client.avatarColor} flex items-center justify-center font-bold text-white`}>
                            {client.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">{client.name}</h3>
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">
                              {client.gender} • {client.age} years
                            </span>
                          </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 text-neonBlue-glow text-xs font-mono font-bold px-2 py-1 rounded">
                          {clStats.fitnessScore} pts
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-glass-border/60 text-xs font-mono">
                        <div>
                          <span className="text-[9px] text-slate-500 block">WEIGHT</span>
                          <span className="font-bold text-slate-200 mt-0.5 block">{formatWeight(client.weight)}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">BODY FAT</span>
                          <span className="font-bold text-slate-200 mt-0.5 block">{clStats.bodyFat}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">LEAN MASS</span>
                          <span className="font-bold text-slate-200 mt-0.5 block">{formatWeight(clStats.lbm)}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">METABOLIC AGE</span>
                          <span className={`font-bold mt-0.5 block ${clStats.metabolicAge <= client.age ? 'text-neonGreen-glow' : 'text-amber-500'}`}>
                            {clStats.metabolicAge} yrs
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenScanForm(client);
                          }}
                          className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] py-1.5 rounded-lg border border-slate-800 transition text-center font-bold"
                        >
                          Modify Scan
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveClientId(client.id);
                            setActiveTab('dashboard');
                          }}
                          className="flex-1 bg-neonBlue/20 hover:bg-neonBlue/30 text-neonBlue-glow text-[10px] py-1.5 rounded-lg border border-neonBlue-glow/30 transition text-center font-bold"
                        >
                          View Reports
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* --- TAB VIEW 3: COMPOSITE CLIENTS COMPARISON TAB --- */}
          {activeTab === 'comparison' && (
            <div className="space-y-6 select-none">
              
              <div className="bg-slate-900/40 p-4 rounded-xl border border-glass-border glass-card">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <ArrowLeftRight className="w-5 h-5 text-neonBlue-glow" />
                  <span>Interactive Client Comparison</span>
                </h2>
                <p className="text-xs text-slate-400">Select multiple gym clients below to cross-evaluate key biological metrics side-by-side.</p>

                {/* Switch list */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {clients.map(c => {
                    const isCompared = compareClientIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleToggleCompare(c.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
                          isCompared 
                            ? 'bg-neonBlue-glow text-obsidian font-bold' 
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{c.name}</span>
                        {isCompared && <span className="bg-white/30 text-[9px] px-1 rounded">ON</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Side-by-side metrics table */}
              <div className="glass-card rounded-2xl border border-glass-border overflow-hidden">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-glass-border">
                      <th className="p-4 text-slate-400 font-bold uppercase tracking-wider">Biological Metric</th>
                      {compareClientIds.map(cid => {
                        const client = clients.find(c => c.id === cid) || clients[0];
                        return (
                          <th key={cid} className="p-4 text-white font-bold text-center">
                            <div className="flex flex-col items-center">
                              <span className="block">{client.name}</span>
                              <span className="text-[9px] text-slate-400 font-normal uppercase mt-0.5">{client.fitnessGoal}</span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {/* 1. Age */}
                    <tr className="border-b border-glass-border/40 hover:bg-slate-900/20">
                      <td className="p-4 font-bold text-slate-300">Age / Gender</td>
                      {compareClientIds.map(cid => {
                        const cl = clients.find(c => c.id === cid) || clients[0];
                        return <td key={cid} className="p-4 text-center text-slate-200 capitalize">{cl.age} yrs / {cl.gender}</td>;
                      })}
                    </tr>

                    {/* 2. Weight */}
                    <tr className="border-b border-glass-border/40 hover:bg-slate-900/20">
                      <td className="p-4 font-bold text-slate-300">Weight</td>
                      {compareClientIds.map(cid => {
                        const cl = clients.find(c => c.id === cid) || clients[0];
                        return <td key={cid} className="p-4 text-center text-slate-200 font-bold">{formatWeight(cl.weight)}</td>;
                      })}
                    </tr>

                    {/* 3. Body Fat */}
                    <tr className="border-b border-glass-border/40 hover:bg-slate-900/20">
                      <td className="p-4 font-bold text-slate-300">Body Fat Percentage</td>
                      {compareClientIds.map(cid => {
                        const cl = clients.find(c => c.id === cid) || clients[0];
                        const stats = calculateAssessment(cl);
                        return <td key={cid} className="p-4 text-center text-rose-400 font-bold">{stats.bodyFat}%</td>;
                      })}
                    </tr>

                    {/* 4. Muscle Mass */}
                    <tr className="border-b border-glass-border/40 hover:bg-slate-900/20">
                      <td className="p-4 font-bold text-slate-300">Lean Body Mass (LBM)</td>
                      {compareClientIds.map(cid => {
                        const cl = clients.find(c => c.id === cid) || clients[0];
                        const stats = calculateAssessment(cl);
                        return <td key={cid} className="p-4 text-center text-neonGreen-glow font-bold">{formatWeight(stats.lbm)}</td>;
                      })}
                    </tr>

                    {/* 5. FFMI */}
                    <tr className="border-b border-glass-border/40 hover:bg-slate-900/20">
                      <td className="p-4 font-bold text-slate-300">Height-Adjusted FFMI</td>
                      {compareClientIds.map(cid => {
                        const cl = clients.find(c => c.id === cid) || clients[0];
                        const stats = calculateAssessment(cl);
                        return <td key={cid} className="p-4 text-center text-slate-200 font-bold">{stats.adjustedFfmi}</td>;
                      })}
                    </tr>

                    {/* 6. BMR */}
                    <tr className="border-b border-glass-border/40 hover:bg-slate-900/20">
                      <td className="p-4 font-bold text-slate-300">Basal BMR</td>
                      {compareClientIds.map(cid => {
                        const cl = clients.find(c => c.id === cid) || clients[0];
                        const stats = calculateAssessment(cl);
                        return <td key={cid} className="p-4 text-center text-slate-200">{stats.bmr} kcal</td>;
                      })}
                    </tr>

                    {/* 7. Fitness Score */}
                    <tr className="hover:bg-slate-900/20">
                      <td className="p-4 font-bold text-slate-300">Fitness Score</td>
                      {compareClientIds.map(cid => {
                        const cl = clients.find(c => c.id === cid) || clients[0];
                        const stats = calculateAssessment(cl);
                        return (
                          <td key={cid} className="p-4 text-center">
                            <span className="bg-neonBlue/20 text-neonBlue-glow px-2.5 py-1 rounded font-bold">
                              {stats.fitnessScore} pts
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* --- TAB VIEW 4: AI SPORTS SCIENTIST CHAT DESK --- */}
          {activeTab === 'ai-coach' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 select-none">
              
              {/* Left Bar: Active Client Summary for AI */}
              <div className="lg:col-span-1 glass-card rounded-2xl border border-glass-border p-5 space-y-4">
                <div className="text-center pb-4 border-b border-glass-border">
                  <div className={`w-12 h-12 rounded-full ${activeClient.avatarColor} mx-auto flex items-center justify-center font-bold text-white mb-2`}>
                    {activeClient.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <h3 className="text-sm font-bold text-white">{activeClient.name}</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">ACTIVE SCANNED BIO</p>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Weight</span>
                    <span className="text-slate-300 font-bold">{formatWeight(activeClient.weight)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Body Fat %</span>
                    <span className="text-rose-400 font-bold">{activeStats.bodyFat}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">LBM Muscle</span>
                    <span className="text-neonGreen-glow font-bold">{formatWeight(activeStats.lbm)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Goal</span>
                    <span className="text-white capitalize">{activeClient.fitnessGoal}</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[10px] text-slate-400 leading-relaxed font-mono">
                  All messages are processed through the Sports Science model tuned to your exact biological circumferences.
                </div>
              </div>

              {/* Chat Column */}
              <div className="lg:col-span-3 glass-card rounded-2xl border border-glass-border flex flex-col h-[500px]">
                
                {/* Chat Header Tabs */}
                <div className="flex border-b border-glass-border bg-slate-950/60 rounded-t-2xl">
                  <button
                    onClick={() => setActiveCoachTab('fitness')}
                    className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 border-r border-glass-border rounded-tl-2xl ${
                      activeCoachTab === 'fitness' ? 'bg-slate-900 text-neonBlue-glow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>AI Strength Coach</span>
                  </button>

                  <button
                    onClick={() => setActiveCoachTab('nutrition')}
                    className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 rounded-tr-2xl ${
                      activeCoachTab === 'nutrition' ? 'bg-slate-900 text-neonGreen-glow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Droplet className="w-3.5 h-3.5" />
                    <span>AI Sports Nutritionist</span>
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {(activeCoachTab === 'fitness' ? fitnessChatMessages : nutritionChatMessages).map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-neonBlue-glow text-obsidian font-semibold rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-3 border-t border-glass-border bg-slate-950/30 flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder={
                      activeCoachTab === 'fitness' 
                        ? "Ask about genetic limits, muscle ceiling, LBM hypertrophy..." 
                        : "Ask about protein targets, hydration volume, metabolic adjustments..."
                    }
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-neonBlue-glow"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-neonBlue hover:bg-neonBlue-light text-white px-4 rounded-xl text-xs font-bold transition flex items-center justify-center"
                  >
                    Send
                  </button>
                </div>

              </div>

            </div>
          )}

        </section>
      </main>

      {/* --- FOOTER HUD --- */}
      <footer className="no-print border-t border-glass-border glass-card px-6 py-3 flex items-center justify-between text-[10px] font-mono text-slate-500 select-none">
        <span>© 2026 FITSCAN PRO CORE SYSTEM INC.</span>
        <div className="flex items-center space-x-4">
          <span>LATENCY: 12ms</span>
          <span>BIA VOLTAGE: ACTIVE</span>
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span>ONLINE NODE</span>
          </span>
        </div>
      </footer>

    </div>
  );
}
