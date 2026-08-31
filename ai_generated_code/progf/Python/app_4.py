
import streamlit as st
import pandas as pd
import openai
import plotly.express as px
import tempfile
import fitz  # PyMuPDF for PDF

# ---- CONFIG ----
st.set_page_config(page_title="Smart AI Insight", page_icon="📊", layout="wide")

# ---- SIDEBAR ----
with st.sidebar:
    st.image("logo.png", width=200)
    st.markdown("## Smart AI Insight App")
    st.markdown("Upload files, ask a question, and get smart insights with charts and tables.")
    st.markdown("---")
    st.markdown("👨‍💻 Built by Your Name")
    st.markdown("---")
    # Display history in sidebar
    if 'history' in st.session_state and st.session_state['history']:
        st.markdown("### 📜 Query History")
        for item in st.session_state['history'][-5:][::-1]:
            st.markdown(f"- **{item['time']}**: {item['prompt']} ({', '.join(item['files'])})")

# ---- MAIN TITLE ----
st.markdown("<h1 style='text-align: center;'>📊 AI-Powered Data Insight Tool</h1>", unsafe_allow_html=True)

# ---- OpenAI Key ----
openai.api_key = st.secrets.get("OPENAI_API_KEY", "your-openai-key-here")

# Initialize history
if 'history' not in st.session_state:
    st.session_state['history'] = []

# ---- File Upload ----
uploaded_files = st.file_uploader("Upload 1 or 2 files (CSV, Excel, or PDF)", type=["csv", "xlsx", "xls", "pdf"], accept_multiple_files=True)
user_prompt = st.text_input("💬 What do you want to know from the data?", placeholder="e.g., Match IDs between files and show summary")

# ---- Load File Helper ----
def load_file(file):
    if file.name.endswith(".csv"):
        return pd.read_csv(file)
    elif file.name.endswith(".xlsx") or file.name.endswith(".xls"):
        return pd.read_excel(file)
    elif file.name.endswith(".pdf"):
        return extract_text_from_pdf(file)
    return None

def extract_text_from_pdf(uploaded_pdf):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(uploaded_pdf.read())
        doc = fitz.open(tmp.name)
        text = ""
        for page in doc:
            text += page.get_text()
        return pd.DataFrame({'PDF_Text': text.split("\n")})

# ---- MAIN PROCESS ----
if uploaded_files and user_prompt:
    # Save to history
    st.session_state['history'].append({
        'prompt': user_prompt,
        'files': [f.name for f in uploaded_files],
        'time': str(pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S'))
    })

    # Load data
    dfs = [load_file(f) for f in uploaded_files]
    sample_data = "\n\n".join([df.head(5).to_csv(index=False) for df in dfs if isinstance(df, pd.DataFrame)])

    system_prompt = f"""You are a data expert. Based on the user prompt and sample data, write Python code using pandas (and optionally plotly) to return the result.

User Prompt: {user_prompt}
Data Sample:
{sample_data}
Output only Python code using variables df1, df2 (if present).
"""

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": system_prompt}],
        temperature=0.3,
    )

    code = response['choices'][0]['message']['content']
    st.code(code, language="python")

    try:
        local_vars = {"df1": dfs[0], "pd": pd, "px": px}
        if len(dfs) > 1:
            local_vars["df2"] = dfs[1]

        exec(code, {}, local_vars)

        if "fig" in local_vars:
            st.plotly_chart(local_vars["fig"])
        if "result" in local_vars:
            result = local_vars["result"]
            st.write("🧾 Result Table:")
            st.dataframe(result)

            # Download results
            csv = result.to_csv(index=False).encode('utf-8')
            st.download_button("⬇️ Download Results", data=csv, file_name='result.csv', mime='text/csv')

    except Exception as e:
        st.error(f"⚠️ Error executing Standard coding segments: {e}")
