# ⚡ FitScan Pro | Premium Clinical Gym Body Analyzer

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Recharts-38BDF8?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Recharts" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 🌟 Clinical Body Scan HUD Console

**FitScan Pro** is a premium, commercial-grade digital alternative to expensive professional body scanners (e.g., InBody, Tanita, and WHOOP). Designed for high-performance trainers, gym owners, and sports scientists, it features a state-of-the-art dark glassmorphic UI, dynamic biometric HUD scanning cycles, clinical skeletal-muscle-fat bar grids, multi-client trainer consoles, and real-time context-aware AI coaching interfaces.

---

## 🔬 Scientific Reference Formats

FitScan Pro computes 13 parameters in real-time, matching clinical assessment standards:

*   **U.S. Navy Body Fat Circumference Equation**:
    *   *Male*: $495 / (1.0324 - 0.19077 \times \log_{10}(\text{waist} - \text{neck}) + 0.15456 \times \log_{10}(\text{height})) - 450$
    *   *Female*: $495 / (1.29579 - 0.35004 \times \log_{10}(\text{waist} + \text{hip} - \text{neck}) + 0.22100 \times \log_{10}(\text{height})) - 450$
*   **Fat-Free Mass Index (FFMI)**: $\text{Lean Mass (kg)} / \text{Height (m)}^2$. Adjusted for skeletal scale using: $\text{FFMI} + 6.1 \times (1.8 - \text{Height (m)})$
*   **Energy Balance**: Mifflin-St Jeor BMR model adjusted for activity factor coefficients (1.2x to 1.9x).

---

## 💎 Core Interactive Features

*   **⚡ Biometric Scan HUD Animation**: Runs an engaging, glowing scanning line sequence verifying coordinates before populating reports.
*   **📊 InBody Muscular-Fat Grid**: The signature vertical bar layout contrasting body weight, dry lean mass, and adipose storage.
*   **🧬 Metabolic Age Badge**: Compares active physical scores with biological peer baselines.
*   **⭕ WHOOP-Style Status Rings**: Circular SVG progress metrics tracking cellular hydration and sleep recovery compliance.
*   **👥 Trainer Directory Console**: High-density dashboard keeping track of multiple gym clients, complete with comparative statistics and progress trend tracking.
*   **🔄 Instant Metric Toggle**: Dynamically converts all weights, heights, and circumferences (Metric ↔ Imperial) across scans in milliseconds without losing user input.
*   **💬 Dual AI Sports Desk**: Message dedicated AI coaches regarding genetic hypertrophic ceilings (AI Strength Coach) and targeted electrolyte/hydration allocations (AI Sports Nutritionist).
*   **🖨️ Physical Print Mode**: Custom CSS layouts formatting the dashboard directly into a beautiful physical clinical print folder.

---

## 🚀 Quick Local Setup

Start editing or running the local gym terminal in under 2 minutes:

1. **Clone & Navigate**:
   ```bash
   git clone https://github.com/pavanporiya/Fitness_App.git
   cd Fitness_App
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Launch local dev server**:
   ```bash
   npm run dev
   ```
   *Your terminal will mount the local instance immediately at `http://localhost:3000/`*

4. **Compile Production Bundle**:
   ```bash
   npm run build
   ```

---

## 🧬 Framework Adaptability

The codebase utilizes clean, decoupled modules. The calculation adapter (`src/utils/fitnessScience.js`) and report compiler (`src/utils/aiConsultant.js`) are built in pure ES6 JavaScript, allowing you to easily port them to:
*   📱 **React Native / Flutter** mobile projects
*   🔥 **Firebase / Supabase** standard cloud syncs
*   💾 **IndexedDB** high-density offline storage structures

---

<p align="center">
  Designed with ⚡ by FitScan Pro Sports Sciences • Clinical Gym Core System
</p>
