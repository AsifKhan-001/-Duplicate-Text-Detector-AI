from fastapi import FastAPI,Path,HTTPException,Query
from pydantic import BaseModel,Field,computed_field
from typing import Literal,Annotated

'''
=========================================================
pydantic model to validate incoming data
=========================================================
'''

class UserInput(BaseModel):  #Request Body

    q1: Annotated[str,Field(...,min_length=3,max_length=500,description='Entre the First Question')]
    q2: Annotated[str,Field(...,min_length=3,max_length=500,description='Entre the Second Question')]


class PredictionResponse(BaseModel):  #Response Body

    q1 : str = Field(...,description="This is the question1.",example="This is an Apple.")
    q2 : str = Field(...,description="This is the question2.",example="This is an Apple's Macbook.")
    is_duplicate : bool = Field(...,description='This tell you Question Duplicate is True or False.',example='True')
    confidence : float = Field(...,description="This is the Confidence score of the prediction",example=0.876)
    label : str = Field(...,description="This is the label about the prediction.",example='Duplicate')

class HealthResponse(BaseModel):        #Health_Check Response
    status : str
    model_loaded : bool
    vectorizer_loaded : bool
    version : str
