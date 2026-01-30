import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import time
from datetime import datetime
import random

# --- PAGE CONFIG & STABLE CSS ---
st.set_page_config(page_title="VitalGuard AI", layout="wide")

# This CSS "locks" the container height to prevent the scroll bar from jumping
st.markdown("""
    <style>
    [data-testid="stVerticalBlock"] > div:has(div.stPlotlyChart) {
        min-height: 450px; 
    }
    </style>
    """, unsafe_allow_html=True)

# --- ENHANCED PREDICTION LOGIC ---
def analyze_health(vitals):
    """Predicts health status and disease possibilities based on clinical ranges."""
    issues = []
    possibilities = []
    
    # Heart Rate Analysis
    if vitals['HR'] > 120: 
        issues.append("Critical Tachycardia")
        possibilities.append("Arrhythmia / Stress Response")
    elif vitals['HR'] < 50:
        issues.append("Critical Bradycardia")
        possibilities.append("Conduction Disorder")

    # Blood Pressure Analysis
    if vitals['SYS'] > 160 or vitals['DIA'] > 100:
        issues.append("Stage 2 Hypertension")
        possibilities.append("Cardiovascular Risk")
    
    # Oxygen Analysis
    if vitals['SPO2'] < 90:
        issues.append("Critical Hypoxia")
        possibilities.append("Respiratory Failure / Lung Distress")
    elif vitals['SPO2'] < 95:
        issues.append("Low Oxygen Saturation")

    # Temperature Analysis
    if vitals['TEMP'] > 101:
        issues.append("High Fever (Pyrexia)")
        possibilities.append("Infection / Inflammation")
    
    status = "CRITICAL" if any("Critical" in i for i in issues) else "STABLE"
    color = "red" if status == "CRITICAL" else "green"
    
    return status, color, issues, possibilities

# --- DATA STORAGE ---
if 'history' not in st.session_state:
    st.session_state.history = pd.DataFrame(columns=['Time', 'HR', 'SYS', 'DIA', 'TEMP', 'SPO2'])

# --- UI LAYOUT (STATIC) ---
st.title("🩺 VitalGuard AI Dashboard")

with st.sidebar:
    st.header("Patient Setup")
    name = st.text_input("Patient Name", "John Doe")
    run = st.toggle("Live Monitoring", value=True)
    if st.button("Clear History"):
        st.session_state.history = st.session_state.history.iloc[0:0]

# Create persistent placeholders (This prevents the scroll jump)
metric_row = st.empty()
ai_analysis_row = st.empty()
chart_row = st.empty()

# --- THE STABLE FRAGMENT ---
@st.fragment(run_every=2)
def update_vitals():
    if not run:
        st.warning("Monitoring Paused")
        return

    # 1. Generate/Simulate Data
    new_data = {
        'Time': datetime.now().strftime("%H:%M:%S"),
        'HR': 75 + random.gauss(0, 10),
        'SYS': 120 + random.gauss(0, 12),
        'DIA': 80 + random.gauss(0, 6),
        'TEMP': 98.6 + random.gauss(0, 0.6),
        'SPO2': 98 + random.gauss(0, 1.5)
    }
    
    # Update Session State
    df = pd.concat([st.session_state.history, pd.DataFrame([new_data])], ignore_index=True).iloc[-30:]
    st.session_state.history = df

    # 2. Update Metrics in the placeholder
    with metric_row.container():
        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Heart Rate", f"{new_data['HR']:.0f} BPM")
        c2.metric("BP (Sys/Dia)", f"{new_data['SYS']:.0f}/{new_data['DIA']:.0f}")
        c3.metric("Temp", f"{new_data['TEMP']:.1f} °F")
        c4.metric("Oxygen", f"{new_data['SPO2']:.1f}%")

    # 3. Predict Health Status & Diseases
    status, color, issues, possibilities = analyze_health(new_data)
    
    with ai_analysis_row.container():
        st.divider()
        col_a, col_b = st.columns(2)
        with col_a:
            st.subheader(f"Status: :{color}[{status}]")
            for issue in issues:
                st.write(f"⚠️ {issue}")
        with col_b:
            st.subheader("Disease Possibilities")
            if possibilities:
                st.info(", ".join(set(possibilities)))
            else:
                st.success("No immediate disease markers detected.")
        st.divider()

    # 4. Update Charts in the placeholder
    with chart_row.container():
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df['Time'], y=df['HR'], name="Heart Rate", line=dict(color='red')))
        fig.add_trace(go.Scatter(x=df['Time'], y=df['SPO2'], name="Oxygen", line=dict(color='green')))
        
        # Add a "Normal Range" shaded area for HR
        fig.add_hrect(y0=60, y1=100, fillcolor="green", opacity=0.1, line_width=0, annotation_text="Normal HR")
        
        fig.update_layout(height=400, margin=dict(l=10, r=10, t=10, b=10), template="plotly_white")
        st.plotly_chart(fig, use_container_width=True, key="vital_chart")

# Execute
update_vitals()