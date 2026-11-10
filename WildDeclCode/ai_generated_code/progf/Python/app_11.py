import streamlit as st
import pandas as pd
from transformers import GPT2Tokenizer

st.set_page_config(page_title="LLM Cost Estimator", page_icon=":moneybag:")

# Load the tokenizer
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")


# Updated rate prices with the accurate rates for each model
rate_prices = {
    "gpt-4": {"input": 0.03, "output": 0.06},
    "gpt-4-32k": {"input": 0.06, "output": 0.12},
    "gpt-4-1106-preview": {"input": 0.01, "output": 0.03},
    "gpt-4-1106-vision-preview": {"input": 0.01, "output": 0.03},
    "gpt-3.5-turbo-1106": {"input": 0.0010, "output": 0.0020},
    "gpt-3.5-turbo-instruct": {"input": 0.0015, "output": 0.0020},
    "gpt-3.5-turbo": {"input": 0.008, "output": 0.003, "additional_output": 0.006},
    "davinci-002": {"input": 0.006, "output": 0.012, "additional_output": 0.012},
    "babbage-002": {"input": 0.0004, "output": 0.0016, "additional_output": 0.0016},
}

def count_tokens(text):
    return len(tokenizer.encode(text))


def calculate_cost(model, input_tokens, output_tokens):
    input_rate = rate_prices[model]["input"]
    output_rate = rate_prices[model]["output"]
    additional_output_rate = rate_prices[model].get("additional_output", output_rate)
    
    input_cost = (input_tokens / 1000) * input_rate
    output_cost = (output_tokens / 1000) * output_rate
    additional_output_cost = (output_tokens / 1000) * additional_output_rate
    
    return input_cost + output_cost + additional_output_cost

# Streamlit App
st.title("GPT/LLM Usage Cost Estimator")
st.markdown("> _A simple tool to estimate the cost of using OpenAI models based on the number of input and output tokens._")

# User input
user_input = st.text_area("", placeholder="Paste your prompt here...")
estimated_output_tokens = st.number_input("Estimated number of output tokens", min_value=0, value=100)
selected_model = st.selectbox("Select the model", list(rate_prices.keys()))

if user_input:
    input_tokens = count_tokens(user_input)
    total_cost = calculate_cost(selected_model, input_tokens, estimated_output_tokens)

    st.markdown(f"### Estimated Cost: `${total_cost:.2f}`")
    # Create a DataFrame for displaying results
    results_df = pd.DataFrame({
        "Detail": ["Number of Input Tokens", "Estimated Number of Output Tokens", "Estimated Total Cost"],
        "Value": [input_tokens, estimated_output_tokens, f"${total_cost:.4f}"]
    })

    # Display the results in a table
    st.table(results_df)


# Note about the pricing source
st.markdown("""
---
<sup>**Note:** The pricing information is based on [OpenAI's pricing page](https://openai.com/pricing) as of 12/14/2023.</sup>
<br>
<sub>**Disclaimer:** This application was completely Supported via basic programming aids from a chat conversation.</sub>
""", unsafe_allow_html=True)
