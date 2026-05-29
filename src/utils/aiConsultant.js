/**
 * FitScan Pro - AI Fitness Assessment & Coaching Feedback Engine
 * Simulates a high-end sports science, gym consultant, and nutritional report.
 */

export function generateAICoachingReport(clientData, stats) {
  const { gender, age, fitnessGoal, activityLevel, sleepHours, dailyWater, experience } = clientData;
  const { bmi, bodyFat, lbm, fatMass, ffmi, adjustedFfmi, bmr, tdee, idealWeightRange, proteinReq, waterReq, metabolicAge, fitnessScore, waistToHeightRatio } = stats;

  const isMale = gender === "male";
  
  // 1. Current Fitness Status
  let statusSummary = "";
  let overallClassification = "";
  if (bodyFat < (isMale ? 8 : 15)) {
    overallClassification = "Hyper-Lean / Athletic Elite";
    statusSummary = `Excellent, highly vascular athletic condition. Your body fat of ${bodyFat}% indicates an elite physical profile, well below average gym ranges, optimizing power-to-weight ratios.`;
  } else if (bodyFat <= (isMale ? 14 : 22)) {
    overallClassification = "Lean / Peak Athletic Range";
    statusSummary = `Optimal metabolic conditioning. Your body fat of ${bodyFat}% paired with an adjusted FFMI of ${adjustedFfmi} signifies a robust physical structure typical of advanced sports performance and healthy muscle distribution.`;
  } else if (bodyFat <= (isMale ? 20 : 28)) {
    overallClassification = "Average Fitness / Active Standard";
    statusSummary = `Healthy body composition. Your body fat percentage is in the healthy baseline range. There is a strong structural foundation, but room exists for body recomposition and optimized lean tissue recruitment.`;
  } else if (bodyFat <= (isMale ? 26 : 34)) {
    overallClassification = "Moderate Adiposity / Recomposition Priority";
    statusSummary = `Sub-optimal body composition. With a body fat of ${bodyFat}% and a waist-to-height ratio of ${waistToHeightRatio}, we recommend prioritizing functional resistance training and a structured nutritional block to manage visceral fat.`;
  } else {
    overallClassification = "Elevated Adiposity / Metabolic Focus";
    statusSummary = `Action required. Elevated body fat levels (${bodyFat}%) suggest a higher risk profile for metabolic stressors. Strategic structural and dietary shifts are indicated to reduce fat mass while safeguarding skeletal muscle.`;
  }

  // 2. Strengths
  const strengths = [];
  if (adjustedFfmi > (isMale ? 21 : 17.5)) {
    strengths.push("High Muscle Density: Your high relative Fat-Free Mass Index (FFMI) points to excellent baseline strength and hypertrophic potential.");
  } else {
    strengths.push("Healthy skeletal baseline: Standard joint load support ensures low injury risk during high-impact resistance regimens.");
  }
  if (sleepHours >= 8) {
    strengths.push("Excellent Neural Recovery: Consistent 8+ hour sleep windows provide massive hormone optimization (GH/Testosterone) and cellular repair.");
  } else if (sleepHours >= 7) {
    strengths.push("Adequate Rest Cycles: 7+ hours support moderate neural freshness, maintaining cortisol profiles within standard guidelines.");
  }
  if (waistToHeightRatio <= 0.46) {
    strengths.push("Low Visceral Fat Hazard: A waist-to-height ratio of less than 0.48 indicates an outstanding cardiovascular health profile and minimal systemic inflammation.");
  }
  if (dailyWater >= waterReq) {
    strengths.push("Optimal Cellular Hydration: Meeting water standards ensures high intracellular pressure, promoting muscle protein synthesis and fluid homeostasis.");
  }

  // 3. Weaknesses / Focus Areas
  const weaknesses = [];
  if (adjustedFfmi < (isMale ? 18.5 : 15)) {
    weaknesses.push("Low Skeletal Muscle Mass: Relatively low lean tissue increases vulnerability to early sarcopenia and limits BMR capacity.");
  }
  if (sleepHours < 7) {
    weaknesses.push("Recovery Debt: Restricting sleep to under 7 hours spikes evening ghrelin (appetite stimulation), elevates resting cortisol, and lowers glycogen replenishment rates.");
  }
  if (waistToHeightRatio > 0.50) {
    weaknesses.push("Visceral Adiposity Hazard: Elevated waist measurements suggest visceral fat buildup surrounding vital organs, which can trigger low-grade insulin resistance.");
  }
  if (dailyWater < waterReq) {
    weaknesses.push("Intracellular Fluid Deficit: Current hydration fails to support dynamic electrolyte exchange, causing early performance fatigue and sluggish nutrient transport.");
  }
  if (bodyFat > (isMale ? 22 : 30)) {
    weaknesses.push("High Fat Mass Index: Surplus fat storage exerts unnecessary mechanical stress on key joints and lowers active oxygen usage during training.");
  }

  // 4. Fat Loss Recommendation
  let fatLossGuide = "";
  if (bodyFat < (isMale ? 9 : 16)) {
    fatLossGuide = "Fat loss is NOT recommended at your current lean profile. A minor hyper-caloric lean bulk is optimal to build functional structural units.";
  } else {
    const caloricDeficit = Math.round(tdee - 450);
    fatLossGuide = `Aim for a structured caloric deficit targeting approximately ${caloricDeficit} kcal/day (a moderate 15-20% cut). Maintain high protein (~${proteinReq}g) to guard against muscle catabolism. Combine 3-4 heavy resistance sessions with 120-150 minutes of weekly Zone 2 cardio (steady-state aerobic pacing).`;
  }

  // 5. Muscle Gain Recommendation
  let muscleGainGuide = "";
  if (bodyFat > (isMale ? 23 : 31)) {
    muscleGainGuide = "Direct muscle bulking is deferred. Focus instead on body recomposition (maintaining or slightly cutting calories) to force the body to use stored lipid reserves to fuel muscular energy needs.";
  } else {
    const caloricSurplus = Math.round(tdee + 250);
    muscleGainGuide = `Adopt a controlled caloric surplus of ${caloricSurplus} kcal/day (a conservative +250-300 kcal over maintenance). Prioritize progressive overload targeting compounds (squats, deadlifts, presses) inside a 6-12 rep range. Aim for a tissue growth target of 0.5 - 1.0 kg per month to minimize fat gain.`;
  }

  // 6. Nutrition Recommendation
  const carbRatio = fitnessGoal === "fatLoss" ? "35%" : fitnessGoal === "bulk" ? "50%" : "40%";
  const fatRatio = fitnessGoal === "fatLoss" ? "25%" : fitnessGoal === "bulk" ? "25%" : "30%";
  const protRatio = fitnessGoal === "fatLoss" ? "40%" : fitnessGoal === "bulk" ? "25%" : "30%";
  const nutritionGuide = `Establish a professional macronutrient split: ${protRatio} Protein, ${carbRatio} Carbs, and ${fatRatio} Fats. Target ${proteinReq}g of highly bioavailable protein daily (lean poultry, wild-caught fish, egg whites, whey/casein, or quality plant isolates) split across 3-5 meals. Ensure a minimum hydration benchmark of ${waterReq}L per day, adding electrolyte supplementation (sodium, potassium, magnesium) before training windows.`;

  // 7. Recovery Recommendation
  const recoveryGuide = `Implement a mandatory 48-hour recovery buffer between training identical muscle groups. Enhance sleep hygiene to consistently hit 8 hours by maintaining a dark, temperature-controlled environment (18°C/65°F) and eliminating screens 60 minutes before bed. Incorporate active recovery components (breathwork, mobility flows, contrast therapy, or magnesium baths) on non-training days.`;

  // 8. Lifestyle Recommendation
  const lifestyleGuide = `Focus on non-exercise activity thermogenesis (NEAT) by committing to a baseline of 10,000 steps daily. Set hourly workstation prompts to perform 2-minute dynamic stretching to counteract the physiological stresses of sedentary desk work. Schedule high-stress tasks adjacent to deep diaphragmatic breathing windows to control sympathetic nervous activation.`;

  // 9. Elite Coach Feedback (Tailored, highly technical sports scientist style)
  let coachFeedback = "";
  if (fitnessGoal === "fatLoss") {
    coachFeedback = `Hey ${clientData.name}, looking closely at your scan data, we've got a brilliant roadmap here. Your metabolic age is estimated at ${metabolicAge} years, and your current Fitness Score is ${fitnessScore}/100. Our immediate target is to systematically strip away fat mass without sacrificing a single ounce of your ${lbm}kg of active lean body mass. 
    
To accomplish this, your nutrition must be highly disciplined. We are positioning your daily protein intake at a firm ${proteinReq}g. This will act as our metabolic shield, preventing muscle breakdown while we run a moderate caloric deficit of 450 calories relative to your TDEE of ${tdee} kcal. Focus on structural mechanical tension in the gym—heavy, low-repetition compound movements are your best friend on a cut because they instruct the body that your current skeletal muscle is vital for survival. Do not fall into the trap of doing light weights for high reps. Keep pushing heavy, sleep like a professional athlete (let's aim to raise those ${sleepHours} hours), and keep your daily hydration locked at ${waterReq}L. You've got an excellent skeletal frame; let's reveal it.`;
  } else if (fitnessGoal === "bulk") {
    coachFeedback = `Hey ${clientData.name}, welcome to the muscle-building protocol. Your current skeletal infrastructure supports a genetic potential limit of around ${stats.musclePotential}kg of lean mass, and you're currently sitting at ${lbm}kg of active muscle. That means there's a highly encouraging hyper-trophic runway ahead of you!
    
Our goal is a clean, hyper-targeted hyper-trophic block. We will aim for a daily intake of ${tdee + 250} calories. Pushing calories too high will only result in unnecessary fat storage, which ruins insulin sensitivity and slows long-term gains. Maintain a steady stream of ${proteinReq}g of high-quality protein to keep your nitrogen balance in a positive state. Because you're pushing a surplus, leverage the extra glycogen for high-volume hypertrophy workouts. Ensure you track your sleep closely—muscle doesn't grow in the gym; it grows during deep stage-3 slow-wave sleep. If you maintain a strict progressive overload and hit your ${waterReq}L water targets, we will see steady, high-quality lean gains over the coming months. Let's get to work!`;
  } else {
    // Recomposition or general fitness / performance
    coachFeedback = `Hey ${clientData.name}, your body composition scan shows a very interesting profile. Your metabolic age is ${metabolicAge} (against chronological ${age}), and your Fitness Score stands at a solid ${fitnessScore}/100. For an intermediate-to-advanced athletic profile, a recomposition protocol represents the gold standard: simultaneously rebuilding skeletal muscle density while gradually oxidizing adipose tissue.
    
To trigger this, we'll keep your daily intake at a recomposition maintenance profile of ${tdee} kcal. We will keep your protein locked at a premium ${proteinReq}g. By maintaining a high protein target, we ensure ample amino acid availability for myofibrillar repair, forcing the body to draw upon body fat stores (${fatMass}kg of fat mass) to fuel daily activity. Prioritize high-quality, dense compound movements 4 days a week, and ensure your hydration matches your calculated benchmark of ${waterReq}L. Since your current sleep stands at ${sleepHours} hours, pushing that closer to 8 hours will yield a massive, compounding return on your physical output and daily recovery. This is about precision execution. Let's unlock your absolute best.`;
  }

  return {
    overallClassification,
    statusSummary,
    strengths,
    weaknesses,
    fatLossGuide,
    muscleGainGuide,
    nutritionGuide,
    recoveryGuide,
    lifestyleGuide,
    coachFeedback,
  };
}
