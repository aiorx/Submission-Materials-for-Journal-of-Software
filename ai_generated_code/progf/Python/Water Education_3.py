# Code outline Aided using common development resources (lines 8-39 and 51-69) and prompts (in modules lines) were revised to best fit the requirements of the group

import streamlit as st
import fitz
import os
from openai import OpenAI

# Setup
BASE_DIR = os.path.dirname(__file__)
pdf_path = os.path.join(BASE_DIR, "data", "2025_03 March Water Quality Report.pdf")
with fitz.open(pdf_path) as doc:
    extracted_text = "".join(page.get_text() for page in doc)

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

st.title("💧 Water Educator")
st.markdown("Select any of the three options to learn more about San Jose Water and the WHO/EPA regulators. Data is based on Valley Water March's water quality report")

modules = {
    "Mineral Health Effects": (
        "Calcium, magnesium, chloride are some of the minerals are present in San Jose water and "
        "what are their health benefits and risks? Please also list out the other minerals found in the report and those benefits"
    ),
    "Safety Thresholds": (
        "What are the EPA/WHO safe limits for each mineral, and is our water within them? What are San Jose safe limits for each minerals"
    ),
    "Daily Drinking Tips": (
        "Based on the mineral profile, what practical tips should residents follow "
        "to stay healthy (e.g. filtering, consumption guidelines)?"
    ),
}

cols = st.columns(len(modules))
for col, (label, user_prompt) in zip(cols, modules.items()):
    if col.button(label):
        with st.spinner(f"Generating {label}…"):
            # 1) Get text answer
            full_prompt = (
                f"March 2025 San Jose water report:\n\n{extracted_text}\n\n"
                f"Explain simply:\n{user_prompt}"
            )
            chat = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system",
                     "content": "You are an educator that is contracted to Valley Water to teach San Jose's residents about water."},
                    {"role": "user", "content": full_prompt}
                ]
            )
            answer = chat.choices[0].message.content.strip()

            # 2) Build a DALL·E prompt
            image_prompt = (
               f"Create an illustration for: {label}. "
               f"label each icon only with a one- or two-word caption in the margin; "
               f"do NOT include any random filler text or lorem ipsum."
            )

            # 3) Call DALL·E 3 explicitly
            img_resp = client.images.generate(
                model="dall-e-3",
                prompt=image_prompt,
                n=1,
                size="1024x1792"
            )
            img_url = img_resp.data[0].url

        # 4) Display
        st.image(img_url, caption=f"{label} (DALL·E 3)", use_column_width=True)
        st.markdown(f"### {label}\n\n{answer}")
