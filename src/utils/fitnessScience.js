/**
 * FitScan Pro - Premium Body Composition & Fitness Science calculations
 * Reference formulas: U.S. Navy Circumference Body Fat Method, Mifflin-St Jeor BMR, Adjusted FFMI.
 */

// Helper to convert imperial to metric
export const imperialToMetric = {
  lbsToKg: (lbs) => lbs * 0.45359237,
  inchesToCm: (inches) => inches * 2.54,
  kgToLbs: (kg) => kg * 2.20462262,
  cmToInches: (cm) => cm * 0.393700787,
};

/**
 * Calculates complete fitness body composition assessment parameters.
 * Inputs are expected to be in METRIC (kg, cm).
 */
export function calculateAssessment({
  name = "Client",
  gender = "male", // male | female
  age = 30,
  weight = 80, // kg
  height = 180, // cm
  waist = 85, // cm
  neck = 38, // cm
  hip = 95, // cm (used for females)
  activityLevel = "moderate", // sedentary | light | moderate | active | athlete
  fitnessGoal = "recomp", // fatLoss | bulk | recomp | performance | general
  dailyWater = 2.5, // Litres (user input current)
  sleepHours = 7, // hours
  experience = "intermediate", // beginner | intermediate | advanced
}) {
  const heightM = height / 100;
  
  // 1. BMI
  const bmi = weight / (heightM * heightM);

  // 2. Body Fat % (U.S. Navy Method)
  // Formulas:
  // Male: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
  // Female: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
  // Values must be converted to centimeters for standard metric Navy equations.
  let bodyFat = 15; // default fallback
  try {
    if (gender === "male") {
      const logVal = Math.log10(waist - neck);
      const logHeight = Math.log10(height);
      if (waist > neck) {
        bodyFat = 495 / (1.0324 - 0.19077 * logVal + 0.15456 * logHeight) - 450;
      }
    } else {
      const logVal = Math.log10(waist + hip - neck);
      const logHeight = Math.log10(height);
      if ((waist + hip) > neck) {
        bodyFat = 495 / (1.29579 - 0.35004 * logVal + 0.22100 * logHeight) - 450;
      }
    }
  } catch (e) {
    console.error("Error calculating body fat, fallback to baseline", e);
  }

  // Bound body fat to realistic physical limits
  bodyFat = Math.max(3, Math.min(60, bodyFat));

  // 3. Lean Body Mass (LBM)
  const lbm = weight * (1 - bodyFat / 100);

  // 4. Fat Mass
  const fatMass = weight - lbm;

  // 5. FFMI (Fat-Free Mass Index)
  const ffmi = lbm / (heightM * heightM);
  // Adjusted FFMI standardizes measurements to average height (1.8m)
  const adjustedFfmi = ffmi + 6.1 * (1.8 - heightM);

  // 6. BMR (Mifflin-St Jeor)
  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // 7. TDEE (Total Daily Energy Expenditure)
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    athlete: 1.9,
  };
  const multiplier = activityFactors[activityLevel] || 1.55;
  const tdee = bmr * multiplier;

  // 8. Ideal Weight Range (based on healthy BMI 18.5 - 24.9)
  const minIdealWeight = 18.5 * (heightM * heightM);
  const maxIdealWeight = 24.9 * (heightM * heightM);

  // 9. Protein Requirement (g)
  // Higher multiplier for building muscle/cutting body fat safely
  let proteinMultiplier = 1.8; // default
  if (fitnessGoal === "fatLoss") proteinMultiplier = 2.2;
  else if (fitnessGoal === "bulk") proteinMultiplier = 2.0;
  else if (fitnessGoal === "recomp") proteinMultiplier = 2.1;
  else if (fitnessGoal === "performance") proteinMultiplier = 2.3;
  const proteinReq = lbm * proteinMultiplier;

  // 10. Water Requirement (L)
  // Base 35 ml per kg of total body weight + exercise adjustment
  let waterReq = (weight * 0.035);
  if (activityLevel === "active") waterReq += 0.8;
  if (activityLevel === "athlete") waterReq += 1.2;
  if (fitnessGoal === "performance") waterReq += 0.5;

  // 11. Metabolic Age Estimate
  // Highly premium calculation correlating body fat % to reference ranges.
  // Standard healthy body fat % averages: Male = 15-20%, Female = 22-27% for age 30.
  const baselineFat = gender === "male" ? 18 : 25;
  const fatDiff = bodyFat - baselineFat;
  // Increase metabolic age if body fat is high, decrease if low
  let metabolicAge = age + (fatDiff * 0.5) - (adjustedFfmi > 21 ? 2 : 0);
  // Cap metabolic age delta at +/- 15 years
  metabolicAge = Math.max(age - 15, Math.min(age + 15, metabolicAge));
  metabolicAge = Math.round(metabolicAge);

  // 12. Fitness Score (0-100)
  // Calculated using:
  // - Body Fat score (optimal is 10-15% male, 18-23% female) -> 35 points
  // - FFMI score (higher fat-free index reflects athletic composition) -> 30 points
  // - Waist-to-Height Ratio (0.43 - 0.49 is ideal, representing abdominal fat health) -> 15 points
  // - Sleep Score (7-9 hours ideal) -> 10 points
  // - Active Lifestyle (1.55+ activity factor) -> 10 points
  let bfScore = 0;
  if (gender === "male") {
    if (bodyFat >= 10 && bodyFat <= 15) bfScore = 35;
    else if (bodyFat > 15 && bodyFat <= 20) bfScore = 30;
    else if (bodyFat > 20 && bodyFat <= 25) bfScore = 20;
    else if (bodyFat < 10 && bodyFat >= 6) bfScore = 32;
    else bfScore = Math.max(5, 35 - Math.abs(bodyFat - 12.5) * 1.5);
  } else {
    if (bodyFat >= 18 && bodyFat <= 23) bfScore = 35;
    else if (bodyFat > 23 && bodyFat <= 28) bfScore = 30;
    else if (bodyFat > 28 && bodyFat <= 33) bfScore = 20;
    else if (bodyFat < 18 && bodyFat >= 14) bfScore = 32;
    else bfScore = Math.max(5, 35 - Math.abs(bodyFat - 20.5) * 1.5);
  }

  let ffmiScore = Math.min(30, Math.max(5, (adjustedFfmi - 15) * 3));
  
  const whtr = waist / height; // Waist-to-height ratio
  let whtrScore = 0;
  if (whtr >= 0.42 && whtr <= 0.48) whtrScore = 15;
  else if (whtr > 0.48 && whtr <= 0.52) whtrScore = 10;
  else whtrScore = Math.max(0, 15 - Math.abs(whtr - 0.45) * 100);

  const sleepScore = Math.max(2, 10 - Math.abs(sleepHours - 8) * 2);
  
  const actScore = activityLevel === "athlete" ? 10 : activityLevel === "active" ? 9 : activityLevel === "moderate" ? 7 : activityLevel === "light" ? 5 : 3;

  const fitnessScore = Math.round(bfScore + ffmiScore + whtrScore + sleepScore + actScore);

  // 13. Genetic Muscle Potential Estimate (Casey Butt's height & bone structure approximation)
  // High-fidelity natural skeletal muscular potential:
  // Approximate maximum lean mass (excl. water/glycogen shifts) based on wrist/neck metrics.
  // We approximate ankle/wrist structures from neck circumference.
  const neckRatio = neck / height;
  const estimatedWristInches = (neck * 0.393701) * 0.45; // Skeletal scale proxy
  const maxLbmCasey = (height * 0.393701) * (1 + estimatedWristInches / 5) * 0.72; // Casey Butt adaptation
  const maxLbmMetric = imperialToMetric.lbsToKg(maxLbmCasey);
  const musclePotential = Math.max(lbm + 2, maxLbmMetric * 1.05);

  return {
    bmi: parseFloat(bmi.toFixed(1)),
    bodyFat: parseFloat(bodyFat.toFixed(1)),
    lbm: parseFloat(lbm.toFixed(1)),
    fatMass: parseFloat(fatMass.toFixed(1)),
    ffmi: parseFloat(ffmi.toFixed(1)),
    adjustedFfmi: parseFloat(adjustedFfmi.toFixed(1)),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    idealWeightRange: {
      min: parseFloat(minIdealWeight.toFixed(1)),
      max: parseFloat(maxIdealWeight.toFixed(1)),
    },
    proteinReq: Math.round(proteinReq),
    waterReq: parseFloat(waterReq.toFixed(1)),
    metabolicAge,
    fitnessScore: Math.min(100, Math.max(0, fitnessScore)),
    musclePotential: parseFloat(musclePotential.toFixed(1)),
    waistToHeightRatio: parseFloat(whtr.toFixed(3)),
  };
}

// Generate some premium default clients to show off "Multiple Clients" & "Trainer Dashboard" right away!
export const PRESETS = [
  {
    id: "preset-alex",
    name: "Alex Rivera",
    age: 28,
    gender: "male",
    weight: 88.5,
    height: 184,
    waist: 84,
    neck: 39,
    hip: 0,
    activityLevel: "active",
    fitnessGoal: "recomp",
    dailyWater: 3.2,
    sleepHours: 8,
    experience: "advanced",
    location: "Miami, US",
    cuisinePreference: "western",
    scansCount: 4,
    scansHistory: [
      { date: "2026-02-01", weight: 91.2, bodyFat: 19.8, fitnessScore: 76 },
      { date: "2026-03-01", weight: 90.0, bodyFat: 18.2, fitnessScore: 80 },
      { date: "2026-04-01", weight: 89.2, bodyFat: 16.5, fitnessScore: 84 },
      { date: "2026-05-28", weight: 88.5, bodyFat: 14.8, fitnessScore: 88 },
    ],
    avatarColor: "bg-emerald-500",
    photoUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "preset-sarah",
    name: "Sarah Jenkins",
    age: 32,
    gender: "female",
    weight: 64.2,
    height: 168,
    waist: 71,
    neck: 32,
    hip: 94,
    activityLevel: "moderate",
    fitnessGoal: "fatLoss",
    dailyWater: 2.1,
    sleepHours: 7,
    experience: "intermediate",
    location: "London, UK",
    cuisinePreference: "mediterranean",
    scansCount: 3,
    scansHistory: [
      { date: "2026-03-15", weight: 66.8, bodyFat: 26.5, fitnessScore: 71 },
      { date: "2026-04-15", weight: 65.4, bodyFat: 24.8, fitnessScore: 75 },
      { date: "2026-05-27", weight: 64.2, bodyFat: 23.2, fitnessScore: 81 },
    ],
    avatarColor: "bg-indigo-500",
    photoUrl: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "preset-marcus",
    name: "Marcus Chen",
    age: 24,
    gender: "male",
    weight: 74.0,
    height: 175,
    waist: 79,
    neck: 37,
    hip: 0,
    activityLevel: "athlete",
    fitnessGoal: "bulk",
    dailyWater: 4.0,
    sleepHours: 9,
    experience: "advanced",
    location: "Singapore",
    cuisinePreference: "east-asian",
    scansCount: 2,
    scansHistory: [
      { date: "2026-04-01", weight: 72.5, bodyFat: 11.2, fitnessScore: 86 },
      { date: "2026-05-25", weight: 74.0, bodyFat: 11.9, fitnessScore: 89 },
    ],
    avatarColor: "bg-amber-500",
    photoUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop"
  }
];
