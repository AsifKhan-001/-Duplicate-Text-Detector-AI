from fastapi import FastAPI, Path, HTTPException, Query
from pydantic import BaseModel, Field, computed_field
from typing import Literal, Annotated
from fastapi.responses import JSONResponse
import pickle
import pandas as pd
from contextlib import asynccontextmanager
import os

from schemas.user_input import UserInput, PredictionResponse, HealthResponse
from utils.features import query_point_creator


'''
==========================================================
App state - store model in Memory
==========================================================
'''


# 1. Define lifespan function first
@asynccontextmanager
async def lifespan(app: FastAPI):
    app_state['model'] = load_model()
    app_state['tfidf'] = load_cv()
    print("Model and Vectorization loaded Successfully")
    yield
    app_state.clear()

# 2. Create single app instance with lifespan registered 
app = FastAPI(lifespan=lifespan)

# 3. Apply CORS Middleware directly to the final app instance
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app_state = {}
Model_Version = '1.0.0'

'''
========================================================
import the ML models
======================================================== 
'''

def load_model():
    model_path = os.path.join("model", "model2.pkl") #here model just tell about model folder okk
    with open(model_path,'rb') as fm:
        model = pickle.load(fm)
    return model

def load_cv():
    tfidf_path = os.path.join("model", "tfidf1.pkl")   #here model just tell about model folder okk
    with open(tfidf_path,'rb') as fc:
        tfidf = pickle.load(fc)
    return tfidf
   







'''
===========================================================
GET
===========================================================
'''

@app.get('/')
def hello():
    return {'message':'Duplicate Question Detector API'}

@app.get('/about')
def about():
    return {'message':'A Fully Functional API to detect whether two questions are duplicates or not.'}

@app.get('/health',response_model=HealthResponse)
def health_check():
    return HealthResponse(status= 'ok', model_loaded = 'model' in app_state , vectorizer_loaded= 'tfidf' in app_state , version = Model_Version)

'''
========================================================
POST and Predict
========================================================
'''

@app.post('/predict',response_model=PredictionResponse)
def predict(pair:UserInput):

    #check model is loaded or not
    if 'model' not in app_state or 'tfidf' not in app_state:
        raise HTTPException(status_code=503,detail='Model not loaded yet')
    
    model = app_state['model']
    tfidf = app_state['tfidf']

    #call the ML function
    features = query_point_creator(pair.q1,pair.q2,tfidf)

    try:
        #predict the output
        prediction = int(model.predict(features)[0])

        #Confidence
        if hasattr(model, 'predict_proba'):
            confidence = float(model.predict_proba(features)[0][1])
        else:
            confidence = 1.0 if prediction == 1 else 0.0     # for SVM which has no predict_proba

        #return the response to user first way
        return PredictionResponse(q1=pair.q1,q2=pair.q2,is_duplicate=bool(prediction),confidence=round(confidence,4),label= 'Duplicate' if prediction==1 else 'Not Duplicate')

        #return the response to user Second way
        # return JSONResponse(status_code=200,content={'Prediction':prediction})

    except Exception as e:
        return JSONResponse(status_code=500,content=str(e))




    
