# HairCare AI — Quality, Safety, & AI Model Limitations Document

## 1. Overview & Non-Diagnostic Principles

**HairCare AI** utilizes advanced multimodal artificial intelligence (Gemini 1.5 Flash Vision) to assist users in tracking hair strand appearance, scalp comfort, and routine adherence. 

### Critical Non-Diagnostic Disclaimer
> **IMPORTANT**: The AI visual assessment and wellness recommendations provided by HairCare AI are for general informational and educational wellness purposes only. They **do not constitute a medical diagnosis, clinical evaluation, or treatment plan** for alopecia, androgenetic loss, scarring conditions, scalp infections, or systemic nutritional deficiencies. Users with sudden, severe, or painful scalp conditions are instructed to consult a board-certified dermatologist or trichologist.

---

## 2. Image Quality & Visual Assessment Constraints

### 2.1 Environmental & Camera Requirements
- **Lighting**: Images require natural ambient daylight or neutral white diffuse room lighting. Direct harsh flashlight or extreme shadow degrades strand boundary recognition.
- **Framing & Distance**: Photos must capture the target scalp region (Front Hairline, Top Scalp, Left Side, Right Side) at 15–20 cm distance without blur.
- **Hair Styling / Styling Products**: Heavily gelled, powdered, wet, or braided hair alters light reflectance and visible scalp exposure, which may yield non-baseline density estimations.

### 2.2 Quality Verification Rules
- The Sharp preprocessing pipeline automatically detects corrupt images, low-resolution files (< 400x400), and invalid aspect ratios.
- If image quality is sub-optimal, `imageQualityStatus` is flagged as `MARGINAL` or `POOR` with an explicit prompt urging the user to retake the photograph under better lighting.

---

## 3. Allergy-Aware & Health Guidance Rules

### 3.1 Personalised Intake Considerations
- **Dietary Exclusions**: Intake responses capture dietary preferences (e.g. Vegetarian, Vegan, Dairy-Free, Nut-Free). The wellness plan generator cross-references recommendations to prevent allergen exposure.
- **Topical Sensitivity**: Routine recommendations prioritize gentle, sulfate-free, and fragrance-sensitive formulas when scalp sensitivity is reported.

### 3.2 Unsupported Diagnostic Claims Policy
The system strictly **filters out** and **prohibits**:
- Prescribing prescription-only pharmaceuticals (e.g. oral finasteride, oral spironolactone, systemic steroids).
- Diagnosing internal micronutrient deficiencies (e.g. diagnosing iron deficiency anemia or serum ferritin depletion purely from photographs).
- Claiming 100% hair follicle regeneration or permanent cure for genetic thinning.

---

## 4. Model Versioning & Safety Audit Log

| Component | Technology / Model | Governance Rule |
| :--- | :--- | :--- |
| Visual Assessment | Gemini 1.5 Flash Vision | Structured JSON schema validation, fallback error handling |
| Wellness Plan | Gemini 1.5 Flash Text | Curated trichology/nutrition knowledge base context retrieval |
| Data Privacy | Sharp + Local Object Store | Automatic EXIF GPS/camera metadata stripping |
| User Data Rights | PostgreSQL Cascading Delete | Instant permanent account data purge (`DELETE /api/v1/auth/account`) |
