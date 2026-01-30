import streamlit as st
import numpy as np
import pandas as pd
import time
import random

st.set_page_config(page_title="Vital Tracking System", layout="wide")

# Sidebar - Patient Info
st.sidebar.title("Patient Information")
name = st.sidebar.text_input("Name")
age = st.sidebar.number_input("Age", 1, 120)
gender = st.sidebar.selectbox("Gender", ["Male", "Female", "Other"])

st.title("🫀 Vital Signs Monitoring Dashboard")

# Simulated vitals (replace later with real data)
def get_vitals():
    return {
        "Heart Rate": random.randint(60, 110),
        "Systolic BP": random.randint(100, 150),
        "Diastolic BP": random.randint(60, 95),
        "Temperature": round(random.uniform(97, 101), 1),
        "Oxygen": random.randint(90, 100)
    }

placeholder = st.empty()
data = []

for _ in range(50):
    vitals = get_vitals()
    data.append(vitals)

df = pd.DataFrame(data)

# Vitals Cards
col1, col2, col3, col4, col5 = st.columns(5)
col1.metric("Heart Rate", f"{df.iloc[-1]['Heart Rate']} bpm")
col2.metric("BP", f"{df.iloc[-1]['Systolic BP']}/{df.iloc[-1]['Diastolic BP']}")
col3.metric("Temp", f"{df.iloc[-1]['Temperature']} °F")
col4.metric("Oxygen", f"{df.iloc[-1]['Oxygen']} %")
col5.metric("Health", "Analyzing...")

# Charts
st.subheader("📈 Real-Time Vitals")
st.line_chart(df)
