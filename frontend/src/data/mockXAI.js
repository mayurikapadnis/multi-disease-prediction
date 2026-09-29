// Mock XAI (Explainability) data
// Replace with API calls from services/xaiService.js when backend is ready
// SHAP / Integrated Gradients values simulated here

export const mockXAIData = {
  diabetes: {
    modelName: "Transformer-based Diabetes Classifier",
    baseValue: 0.35,
    topFeatures: [
      { feature: "HbA1c Level", value: 8.4, shap: 0.28, direction: "positive", description: "HbA1c > 7% strongly indicates poor glycemic control" },
      { feature: "Fasting Glucose", value: 210, shap: 0.22, direction: "positive", description: "Glucose > 200 mg/dL is a primary diabetes indicator" },
      { feature: "BMI", value: 31.2, shap: 0.14, direction: "positive", description: "BMI > 30 (Obese) increases insulin resistance" },
      { feature: "Family History (Diabetes)", value: 1, shap: 0.11, direction: "positive", description: "First-degree relative with diabetes increases risk" },
      { feature: "Age", value: 58, shap: 0.09, direction: "positive", description: "Risk increases significantly after age 45" },
      { feature: "Physical Activity", value: "Low", shap: 0.07, direction: "positive", description: "Sedentary lifestyle impairs glucose metabolism" },
      { feature: "Cholesterol", value: 238, shap: 0.04, direction: "positive", description: "Dyslipidemia often accompanies insulin resistance" },
      { feature: "Gender (Male)", value: 1, shap: -0.03, direction: "negative", description: "Slight protective effect compared to model baseline" },
    ],
    naturalLanguage: "The patient's HbA1c of 8.4% and fasting glucose of 210 mg/dL are the strongest indicators driving this high diabetes risk prediction. Combined with obesity (BMI 31.2) and a positive family history, the model assigns a risk probability of 84%. The patient's low physical activity further compounds the risk. Immediate glycemic management and lifestyle intervention are advised.",
    modelAccuracy: 0.943,
    modelAUC: 0.971,
  },
  heartDisease: {
    modelName: "Transformer-based Cardiac Risk Classifier",
    baseValue: 0.28,
    topFeatures: [
      { feature: "Cholesterol", value: 238, shap: 0.15, direction: "positive", description: "Total cholesterol > 200 mg/dL elevates cardiac risk" },
      { feature: "Blood Pressure (Systolic)", value: 148, shap: 0.12, direction: "positive", description: "Systolic BP > 140 mmHg is hypertensive range" },
      { feature: "Age", value: 58, shap: 0.09, direction: "positive", description: "Cardiovascular risk rises sharply after 50" },
      { feature: "Family History (Heart Disease)", value: 1, shap: 0.08, direction: "positive", description: "Genetic predisposition to cardiovascular disease" },
      { feature: "Triglycerides", value: 195, shap: 0.07, direction: "positive", description: "Elevated triglycerides linked to atherosclerosis" },
      { feature: "BMI", value: 31.2, shap: 0.06, direction: "positive", description: "Obesity strains cardiac function" },
      { feature: "Smoking (Former)", value: 1, shap: -0.04, direction: "negative", description: "Former smoker — partial risk reduction vs current smoker" },
      { feature: "HbA1c", value: 8.4, shap: 0.05, direction: "positive", description: "Poorly controlled diabetes increases cardiovascular events" },
    ],
    naturalLanguage: "The moderate-to-high cardiac risk (51%) is primarily driven by elevated cholesterol (238 mg/dL) and hypertension (148/92 mmHg). The patient's age and family history of heart disease are significant contributing factors. Notably, having quit smoking provides a marginal protective effect. Lipid-lowering therapy and strict BP control are recommended.",
    modelAccuracy: 0.931,
    modelAUC: 0.958,
  },
  ckd: {
    modelName: "Transformer-based CKD Progression Classifier",
    baseValue: 0.22,
    topFeatures: [
      { feature: "Creatinine", value: 1.4, shap: 0.14, direction: "positive", description: "Serum creatinine > 1.2 mg/dL suggests reduced filtration" },
      { feature: "eGFR", value: 62, shap: 0.12, direction: "positive", description: "eGFR 60-89 = CKD Stage G2 (mildly decreased)" },
      { feature: "Blood Pressure", value: 148, shap: 0.09, direction: "positive", description: "Hypertension is a major cause of CKD progression" },
      { feature: "Diabetes Duration", value: "8 years", shap: 0.08, direction: "positive", description: "Diabetic nephropathy risk increases with disease duration" },
      { feature: "HbA1c", value: 8.4, shap: 0.07, direction: "positive", description: "Hyperglycemia damages glomeruli over time" },
      { feature: "Age", value: 58, shap: 0.05, direction: "positive", description: "Age-related nephron loss reduces renal reserve" },
      { feature: "Proteinuria", value: "Trace", shap: -0.06, direction: "negative", description: "Minimal proteinuria is a protective sign" },
      { feature: "Physical Activity", value: "Low", shap: 0.03, direction: "positive", description: "Sedentary lifestyle accelerates metabolic complications" },
    ],
    naturalLanguage: "The moderate CKD risk (43%) is driven by mildly elevated creatinine (1.4 mg/dL) and an eGFR of 62 mL/min/1.73m², consistent with CKD Stage G2. Long-standing hypertension and poorly controlled diabetes are the principal modulators of disease progression. Minimal proteinuria offers partial reassurance. Nephrology referral and ACE inhibitor use should be considered.",
    modelAccuracy: 0.918,
    modelAUC: 0.947,
  },
  stroke: {
    modelName: "Transformer-based Stroke Risk Classifier",
    baseValue: 0.18,
    topFeatures: [
      { feature: "Age", value: 58, shap: 0.08, direction: "positive", description: "Stroke risk doubles every decade after 55" },
      { feature: "Blood Pressure", value: 148, shap: 0.07, direction: "positive", description: "Hypertension is the #1 modifiable stroke risk factor" },
      { feature: "Atrial Fibrillation", value: 0, shap: -0.08, direction: "negative", description: "Absence of AF significantly reduces cardioembolic stroke risk" },
      { feature: "Smoking (Former)", value: 1, shap: -0.03, direction: "negative", description: "Former smoker — reduced vs current smoker risk" },
      { feature: "Cholesterol", value: 238, shap: 0.06, direction: "positive", description: "Dyslipidemia promotes cerebrovascular atherosclerosis" },
      { feature: "Diabetes", value: 1, shap: 0.07, direction: "positive", description: "Diabetes increases ischemic stroke risk by 2x" },
      { feature: "Physical Activity", value: "Low", shap: 0.04, direction: "positive", description: "Inactivity is an independent stroke risk factor" },
      { feature: "Family History (Stroke)", value: 0, shap: -0.04, direction: "negative", description: "No family history of stroke reduces genetic risk" },
    ],
    naturalLanguage: "The low stroke risk (22%) reflects the absence of atrial fibrillation and no family history of stroke — both strong protective factors. However, hypertension, age, and diabetes remain significant contributors. The former smoking status provides a modest protective effect compared to active smoking. Continued BP monitoring and lifestyle management are recommended.",
    modelAccuracy: 0.924,
    modelAUC: 0.953,
  },
};

export const getDiseaseXAI = (disease) => mockXAIData[disease] || null;
