import streamlit as st
import pyshorteners

# Streamlit app title
st.title("URL Shortener")

# Input field for the URL
url = st.text_input("Enter the URL to shorten:")

# Button to trigger URL shortening
if st.button("Shorten URL"):
    if url:
        try:
            # Shorten the URL using pyshorteners
            shortener = pyshorteners.Shortener()
            short_url = shortener.tinyurl.short(url)
            st.success(f"Shortened URL: {short_url}")
        except Exception as e:
            st.error(f"Error: {e}")
    else:
        st.warning("Please enter a valid URL.")

# Made using GitHub Copilot