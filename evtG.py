import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import time
from datetime import datetime
import random

# --- CONFIGURATION ---
st.set_page_config(page_title="VitalGuard AI", layout="wide")

# --- MOCK ML MODEL ---
# In a real scenario, you would use: model = joblib.load('medical_model.pkl')
def predict_health_status(hr, sys, dia, temp, ox):
    """
    Simulates a machine learning model logic for health assessment.
    """
    score = 0
    possibilities = []
    
    # Simple logic-based 'AI' for demonstration
    if hr > 100 or hr < 60: score += 1
    if sys > 140 or dia > 90: 
        score += 2
        possibilities.append("Hypertension Risk")
    if temp > 100.4: 
        score += 1
        possibilities.append("Pyrexia (Fever)")
    if ox < 94: 
        score += 3
        possibilities.append("Hypoxia Warning")
    
    if score == 0:
        return "Stable", "Normal vitals detected.", "Green", possibilities
    elif score <= 2:
        return "Warning", "Minor fluctuations detected. Monitor closely.", "Orange", possibilities
    else:
        return "Critical", "Immediate medical attention may be required.", "Red", possibilities

# --- DATA GENERATION ---
def get_simulated_data():
    return {
        'Heart Rate': 75 + random.gauss(0, 8),
        'Systolic': 120 + random.gauss(0, 10),
        'Diastolic': 80 + random.gauss(0, 5),
        'Temperature': 98.6 + random.gauss(0, 0.5),
        'Oxygen': 98 + random.gauss(0, 1),
        'Timestamp': datetime.now().strftime("%H:%M:%S")
    }

# --- UI LAYOUT ---
st.title("🩺 VitalGuard AI: Real-Time Monitoring")

# Sidebar for Patient Info
with st.sidebar:
    st.header("Patient Profile")
    name = st.text_input("Full Name", "John Doe")
    age = st.number_input("Age", 0, 120, 30)
    gender = st.selectbox("Gender", ["Male", "Female", "Other"])
    med_id = st.text_input("Medical ID", "HID-9921")
    
    st.divider()
    run_monitoring = st.toggle("Start Live Stream", value=True)
    clear_data = st.button("Reset Session")

# Session State Initialization
if 'history' not in st.session_state or clear_data:
    st.session_state.history = pd.DataFrame(columns=['Timestamp', 'Heart Rate', 'Systolic', 'Diastolic', 'Temperature', 'Oxygen'])

# --- MAIN DASHBOARD ---
# Placeholders for dynamic content
metrics_placeholder = st.empty()
chart_placeholder = st.empty()
prediction_placeholder = st.empty()

# Simulation Loop
while run_monitoring:
    # 1. Get new data
    new_reading = get_simulated_data()
    st.session_state.history = pd.concat([st.session_state.history, pd.DataFrame([new_reading])], ignore_index=True)
    
    # Keep only last 50 readings (similar to your deque)
    if len(st.session_state.history) > 50:
        st.session_state.history = st.session_state.history.iloc[1:]

    # 2. Update Metrics (Top Row)
    with metrics_placeholder.container():
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Heart Rate", f"{new_reading['Heart Rate']:.0f} BPM", f"{new_reading['Heart Rate'] - 75:.1f}")
        col2.metric("Blood Pressure", f"{new_reading['Systolic']:.0f}/{new_reading['Diastolic']:.0f}", None)
        col3.metric("Temperature", f"{new_reading['Temperature']:.1f} °F", None)
        col4.metric("Oxygen (SpO2)", f"{new_reading['Oxygen']:.0f} %", None)

    # 3. Predict Health Status
    status, msg, color, issues = predict_health_status(
        new_reading['Heart Rate'], new_reading['Systolic'], 
        new_reading['Diastolic'], new_reading['Temperature'], new_reading['Oxygen']
    )

    with prediction_placeholder.container():
        st.divider()
        c1, c2 = st.columns([1, 2])
        with c1:
            st.subheader("AI Health Analysis")
            st.markdown(f"**Status:** :{color}[{status}]")
            st.write(msg)
        with c2:
            st.subheader("Potential Indicators")
            if issues:
                for issue in issues:
                    st.warning(f"⚠️ {issue}")
            else:
                st.success("✅ No immediate disease markers detected.")

    # 4. Update Charts
    with chart_placeholder.container():
        fig = make_subplots(rows=2, cols=2, 
                            subplot_titles=("Heart Rate History", "BP (Systolic/Diastolic)", 
                                            "Body Temp", "Oxygen Saturation"))
        
        hist = st.session_state.history
        
        # Heart Rate
        fig.add_trace(go.Scatter(x=hist['Timestamp'], y=hist['Heart Rate'], name="BPM", line=dict(color='red')), row=1, col=1)
        # BP
        fig.add_trace(go.Scatter(x=hist['Timestamp'], y=hist['Systolic'], name="Sys", line=dict(color='blue')), row=1, col=2)
        fig.add_trace(go.Scatter(x=hist['Timestamp'], y=hist['Diastolic'], name="Dia", line=dict(color='green')), row=1, col=2)
        # Temp
        fig.add_trace(go.Scatter(x=hist['Timestamp'], y=hist['Temperature'], name="Temp", line=dict(color='orange')), row=2, col=1)
        # SpO2
        fig.add_trace(go.Scatter(x=hist['Timestamp'], y=hist['Oxygen'], name="SpO2", line=dict(color='teal')), row=2, col=2)
        
        fig.update_layout(height=600, showlegend=False, template="plotly_white")
        st.plotly_chart(fig, use_container_width=True)

    time.sleep(2) # Refresh rate