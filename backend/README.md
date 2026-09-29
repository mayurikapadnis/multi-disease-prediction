# CDSS Backend — Placeholder

This directory is reserved for the backend of the **Explainable Transformer-based Multi-Disease Clinical Decision Support System (CDSS)**.

## Planned Stack (Future)

- **Framework**: FastAPI (Python)
- **ML Models**: Transformer-based classifiers for Diabetes, Heart Disease, CKD, Stroke
- **XAI**: SHAP / Integrated Gradients for explainability
- **Database**: PostgreSQL / MongoDB for patient EHR data
- **Auth**: JWT-based authentication
- **API**: RESTful endpoints consumed by the React frontend

## Planned Endpoints

```
POST /api/predict          → Run risk prediction for all diseases
GET  /api/patients         → List patients
GET  /api/patients/:id     → Patient detail + history
POST /api/patients         → Create patient record
GET  /api/history          → Prediction history
GET  /api/explain/:id      → XAI explanation for a prediction
GET  /api/reports/:id      → Patient risk report
```

## Frontend Integration

The frontend `src/services/` directory already contains stub API service files structured for real API calls. Replace `mock*` functions with real `axios`/`fetch` calls pointing to this backend once implemented.

---
> ⚠️ **Not yet implemented.** All current functionality is mocked in the frontend.
