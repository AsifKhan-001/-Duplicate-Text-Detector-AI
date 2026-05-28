# Duplicate Question Detector – FastAPI Backend

## Project Structure

```
dup_question_api/
│
├── main.py              ← FastAPI app  (routes, startup)
├── schemas.py           ← Pydantic models (input / output shapes)
├── requirements.txt     ← pip packages
│
├── utils/
│   ├── __init__.py
│   └── features.py      ← preprocess() + query_point_creator()
│
└── model/               ← PUT YOUR .pkl FILES HERE
    ├── model.pkl
    └── cv.pkl
```

## Setup

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Download NLTK stopwords (run once)
python -c "import nltk; nltk.download('stopwords')"

# 3. Copy your pkl files into the model/ folder
#    model.pkl  → trained RandomForest / Stacking model
#    cv.pkl     → fitted CountVectorizer

# 4. Start the server
uvicorn main:app --reload
```

## API Endpoints

| Method | URL        | What it does                        |
|--------|------------|-------------------------------------|
| GET    | `/`        | Welcome message                     |
| GET    | `/health`  | Check if model is loaded            |
| POST   | `/predict` | Predict if two questions are duplicates |

## Example Request

```bash
curl -X POST "http://localhost:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{"question1": "How to learn Python?",
          "question2": "What is the fastest way to learn Python?"}'
```

## Example Response

```json
{
  "question1": "How to learn Python?",
  "question2": "What is the fastest way to learn Python?",
  "is_duplicate": true,
  "confidence": 0.87,
  "label": "Duplicate"
}
```

## Interactive Docs

After starting the server, open your browser at:

- **Swagger UI** → http://localhost:8000/docs
- **ReDoc**       → http://localhost:8000/redoc
