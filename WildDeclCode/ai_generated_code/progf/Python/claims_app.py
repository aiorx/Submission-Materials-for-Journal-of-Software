import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import plotly.express as px
import plotly.figure_factory as ff
import plotly.graph_objects as go
import statsmodels.api as sm
import seaborn as sns
import io

# --- THEME & PAGE CONFIG ---
st.set_page_config(page_title="Claims Explorer Pro", layout="wide", initial_sidebar_state="expanded")

# --- DARK MODE TOGGLE ---
if 'dark_mode' not in st.session_state:
    st.session_state['dark_mode'] = False

def set_dark_mode():
    st.session_state['dark_mode'] = not st.session_state['dark_mode']

st.sidebar.button('Toggle Dark Mode', on_click=set_dark_mode)
if st.session_state['dark_mode']:
    st.markdown('<style>body { background-color: #222; color: #eee; } .stApp { background-color: #222; color: #eee; } </style>', unsafe_allow_html=True)

# --- LOAD DATA ---
@st.cache_data
def load_data():
    url = 'https://drive.google.com/uc?id=1NicD1RBqaQWzDtB4cjjvZWJ7I4F2XAiv'
    return pd.read_csv(url)
df = load_data()

# --- SIDEBAR FILTERS ---
st.sidebar.header('Filter Data')
regions = st.sidebar.multiselect('Region', options=df['region'].unique(), default=list(df['region'].unique()))
smokers = st.sidebar.multiselect('Smoker Status', options=df['smoker'].unique(), default=list(df['smoker'].unique()))
sexes = st.sidebar.multiselect('Sex', options=df['sex'].unique(), default=list(df['sex'].unique()))
age_min, age_max = int(df['age'].min()), int(df['age'].max())
age_range = st.sidebar.slider('Age Range', min_value=age_min, max_value=age_max, value=(age_min, age_max))
bmi_min, bmi_max = float(df['bmi'].min()), float(df['bmi'].max())
bmi_range = st.sidebar.slider('BMI Range', min_value=float(bmi_min), max_value=float(bmi_max), value=(bmi_min, bmi_max))

filtered_df = df[
    df['region'].isin(regions) &
    df['smoker'].isin(smokers) &
    df['sex'].isin(sexes) &
    df['age'].between(*age_range) &
    df['bmi'].between(*bmi_range)
]

# --- DYNAMIC NARRATIVE ---
def narrative_summary(data):
    n = len(data)
    avg_claim = data['claim_amount'].mean()
    prop_smokers = (data['smoker'] == 'yes').mean()
    prop_claims = (data['insurance_claim'] == 'yes').mean()
    return f"In your current selection of {n} individuals, the average claim amount is ${avg_claim:,.0f}. {prop_smokers:.0%} are smokers, and {prop_claims:.0%} have made an insurance claim."

# --- MAIN TABS ---
tabs = st.tabs([
    "Data Explorer", "Visual Insights", "Predictive Tools", "Risk Scoring", "Correlations & Anomalies", "About"
])

# --- DATA EXPLORER TAB ---
with tabs[0]:
    st.header('Interactive Data Explorer')
    with st.expander('Show Filtered Data Table', expanded=False):
        # Ensure Arrow compatibility for all columns
        display_df = filtered_df.copy()
        for col in display_df.columns:
            # Convert all non-numeric columns to string for Arrow compatibility
            if not pd.api.types.is_numeric_dtype(display_df[col]):
                display_df[col] = display_df[col].astype(str)
        st.dataframe(display_df, use_container_width=True)
    st.info(narrative_summary(filtered_df))
    with st.expander('Summary Statistics', expanded=False):
        # Ensure Arrow compatibility for all columns in summary
        summary_df = filtered_df.describe(include='all').copy()
        for col in summary_df.columns:
            if not pd.api.types.is_numeric_dtype(summary_df[col]):
                summary_df[col] = summary_df[col].astype(str)
        st.dataframe(summary_df, use_container_width=True)

# --- VISUAL INSIGHTS TAB ---
with tabs[1]:
    st.header('Unique Visual Insights')
    col1, col2 = st.columns(2)
    with col1:
        st.subheader('Claim Amount Distribution by Region')
        fig = px.box(filtered_df, x='region', y='claim_amount', color='region', points='all', title='Claim Amounts by Region')
        st.plotly_chart(fig, use_container_width=True)
    with col2:
        st.subheader('BMI vs Claim Amount (Smoker Highlight)')
        fig = px.scatter(filtered_df, x='bmi', y='claim_amount', color='smoker', hover_data=['age', 'sex'], title='BMI vs Claim Amount by Smoker Status')
        st.plotly_chart(fig, use_container_width=True)
    st.subheader('Age Grouped Claim Behavior')
    age_bins = pd.cut(filtered_df['age'], bins=[17, 30, 40, 50, 60, 100], labels=['18-30', '31-40', '41-50', '51-60', '61+'])
    fig = px.violin(filtered_df.assign(age_group=age_bins), x='age_group', y='claim_amount', color='smoker', box=True, points='all', title='Claim Amounts by Age Group & Smoker')
    st.plotly_chart(fig, use_container_width=True)

# --- PREDICTIVE TOOLS TAB ---
with tabs[2]:
    st.header('Predictive Claim Amount Estimator')
    st.markdown('Input patient details to estimate claim amount. Model: Random Forest Regressor.')
    with st.form('predict_form'):
        age = st.slider('Age', int(df['age'].min()), int(df['age'].max()), 40)
        sex = st.selectbox('Sex', df['sex'].unique())
        bmi = st.slider('BMI', float(df['bmi'].min()), float(df['bmi'].max()), 30.0)
        children = st.slider('Number of Children', int(df['children'].min()), int(df['children'].max()), 0)
        smoker = st.selectbox('Smoker', df['smoker'].unique())
        region = st.selectbox('Region', df['region'].unique())
        submitted = st.form_submit_button('Estimate Claim Amount')
    if submitted:
        X = df.drop(['claim_amount', 'insurance_claim'], axis=1)
        y = df['claim_amount']
        X = pd.get_dummies(X, columns=['sex', 'smoker', 'region'], drop_first=True)
        rf = RandomForestRegressor(n_estimators=100, random_state=42)
        rf.fit(X, y)
        input_df = pd.DataFrame([{ 'age': age, 'bmi': bmi, 'children': children,
            'sex_male': 1 if sex == 'male' else 0,
            'smoker_yes': 1 if smoker == 'yes' else 0,
            'region_northwest': 1 if region == 'northwest' else 0,
            'region_southeast': 1 if region == 'southeast' else 0,
            'region_southwest': 1 if region == 'southwest' else 0
        }])
        for col in X.columns:
            if col not in input_df.columns:
                input_df[col] = 0
        input_df = input_df[X.columns]
        pred = rf.predict(input_df)[0]
        st.success(f'Estimated Claim Amount: ${pred:,.2f}')
        st.caption('This is a model-based estimate. Actual claims may vary.')

# --- RISK SCORING TAB ---
with tabs[3]:
    st.header('Insurance Claim Risk Scoring')
    st.markdown('Input profile to get risk score (probability of making a claim). Model: Logistic Regression.')
    with st.form('risk_form'):
        age_r = st.slider('Age', int(df['age'].min()), int(df['age'].max()), 40)
        sex_r = st.selectbox('Sex', df['sex'].unique(), key='sex_r')
        bmi_r = st.slider('BMI', float(df['bmi'].min()), float(df['bmi'].max()), 30.0, key='bmi_r')
        children_r = st.slider('Number of Children', int(df['children'].min()), int(df['children'].max()), 0, key='children_r')
        smoker_r = st.selectbox('Smoker', df['smoker'].unique(), key='smoker_r')
        region_r = st.selectbox('Region', df['region'].unique(), key='region_r')
        submitted_r = st.form_submit_button('Get Risk Score')
    if submitted_r:
        Xc = df.drop(['claim_amount', 'insurance_claim'], axis=1)
        yc = df['insurance_claim'].map({'yes': 1, 'no': 0})
        Xc = pd.get_dummies(Xc, columns=['sex', 'smoker', 'region'], drop_first=True)
        lr = LogisticRegression()
        lr.fit(Xc, yc)
        input_c = pd.DataFrame([{ 'age': age_r, 'bmi': bmi_r, 'children': children_r,
            'sex_male': 1 if sex_r == 'male' else 0,
            'smoker_yes': 1 if smoker_r == 'yes' else 0,
            'region_northwest': 1 if region_r == 'northwest' else 0,
            'region_southeast': 1 if region_r == 'southeast' else 0,
            'region_southwest': 1 if region_r == 'southwest' else 0
        }])
        for col in Xc.columns:
            if col not in input_c.columns:
                input_c[col] = 0
        input_c = input_c[Xc.columns]
        risk = lr.predict_proba(input_c)[0,1]
        st.info(f'Estimated Claim Risk: {risk*100:.1f}%')
        if risk > 0.7:
            st.error('High risk of claim!')
        elif risk > 0.4:
            st.warning('Moderate risk of claim.')
        else:
            st.success('Low risk of claim.')

# --- CORRELATIONS & ANOMALIES TAB ---
with tabs[4]:
    st.header('Correlations & Anomaly Detection')
    st.subheader('Correlation Heatmap')
    corr = filtered_df.select_dtypes(include=[np.number]).corr()
    fig = px.imshow(corr, text_auto=True, color_continuous_scale='RdBu', title='Correlation Matrix')
    st.plotly_chart(fig, use_container_width=True)
    st.subheader('Cluster Patterns (t-SNE)')
    from sklearn.manifold import TSNE
    Xv = filtered_df.drop(['claim_amount', 'insurance_claim'], axis=1)
    Xv = pd.get_dummies(Xv, columns=['sex', 'smoker', 'region'], drop_first=True)
    if len(Xv) > 10:
        tsne = TSNE(n_components=2, random_state=42, perplexity=min(30, len(Xv)-1))
        X_embedded = tsne.fit_transform(Xv)
        fig2 = px.scatter(x=X_embedded[:,0], y=X_embedded[:,1], color=filtered_df['insurance_claim'],
            title='t-SNE Cluster Visualization', labels={'color':'Insurance Claim'})
        st.plotly_chart(fig2, use_container_width=True)
    else:
        st.info('Not enough data for cluster visualization.')
    st.subheader('Anomaly Detection (Claim Amount)')
    q1 = filtered_df['claim_amount'].quantile(0.25)
    q3 = filtered_df['claim_amount'].quantile(0.75)
    iqr = q3 - q1
    outliers = filtered_df[(filtered_df['claim_amount'] < q1 - 1.5*iqr) | (filtered_df['claim_amount'] > q3 + 1.5*iqr)]
    st.write(f"Number of outlier claims: {len(outliers)}")
    if not outliers.empty:
        st.dataframe(outliers[['age','sex','bmi','children','smoker','region','claim_amount']], use_container_width=True)

# --- ABOUT TAB ---
with tabs[5]:
    st.header('About Claims Explorer Pro')
    st.markdown('''
    **Claims Explorer Pro** is a next-generation insurance analytics dashboard. It empowers analysts and underwriters to:
    - Explore and filter claims data interactively
    - Visualize hidden patterns and demographic effects
    - Predict claim amounts and risk in real time
    - Run what-if scenarios and see instant feedback
    - Detect anomalies and correlations
    - Get narrative insights for smarter decisions
    
    _Built with Streamlit, Plotly, and scikit-learn. Designed for insight, speed, and fun!_
    ''')
    st.caption('Created Supported by standard GitHub tools, 2025')
