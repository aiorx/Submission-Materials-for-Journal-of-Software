# docstrings are generated using github copilot
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.chat_history import (
    BaseChatMessageHistory,
    InMemoryChatMessageHistory,
)
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.callbacks import get_openai_callback
import tkinter as tk

# Path to the system prompt file
SYS_PROMPT_PATH = "sys_prompts/system_prompt1.txt"
session = {"configurable": {"session_id": "1"}}

# Load the environment variables
load_dotenv(override=True)


def read_file(file_path):
    """
    Function to read the content of a file.

    Args:
        file_path (str): The path to the file.

    Returns:
        str: The content of the file.
    """
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()

# Initialize the chat History
store = {}


def get_session_history(session_id: str) -> BaseChatMessageHistory:
    """Get the chat message history for a given session ID.

    Args:
        session_id (str): The session ID.

    Returns:
        BaseChatMessageHistory: The chat message history for the session.
    """
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]


model = ChatOpenAI(model="gpt-4o")

# Read System Prompt from File and remove special characters
system_prompt = read_file(SYS_PROMPT_PATH)

# Prompt Template
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            system_prompt,
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

chain = prompt | model
llm_with_history = RunnableWithMessageHistory(chain, get_session_history)


def calculate_complexity(code_text, output_label):
    """
    Function to calculate the complexity of the given code text
    and update the output label with the response.
    """
    with get_openai_callback() as cb:
        response = llm_with_history.invoke(
                    code_text,
                    config=session,
                )
        print(cb)

    update_text(output_label, response.content)  # Update the label in the GUI, for tkText


def update_text(text_widget, new_text):
    # Clear any existing content in the Text widget
    text_widget.config(state="normal")
    text_widget.delete("1.0", tk.END)
    # Insert new content
    text_widget.insert(tk.END, new_text)
    text_widget.config(state="disabled")


def paste_example(text_widget, path: str):
    """
    Reads the content of a file and inserts it into a text widget.

    Args:
        text_widget (tk.Text): The text widget where the file content will be inserted.
        path (str): The path to the file to be read.

    Returns:
        None
    """
    example_code = read_file(path)
    text_widget.delete("1.0", tk.END)
    text_widget.insert(tk.END, example_code)

def delete_code(text_widget):
    """
    Deletes all content from the given text widget.

    Args:
        text_widget (tk.Text): The text widget from which to delete all content.
    """
    text_widget.delete("1.0", tk.END)
    
