```python
def process_input(input):

    #Run input through pipeline
    result = q3fer_pipe(input)

    pred = result[0]['label']
    #If the model predicts that the input is not a fallacy, 
    threshold = 0.5
    if result[0]['score'] <= threshold:
        pred = "No fallacy detected!"
        return pred + " with a score of " + str(result[0]['score'])
    try:
        message = f"The input is a {pred} fallacy. Please explain why this is a fallacy.\n\nInput: {input}\n\nExplanation:" # <- Assisted with basic coding tools
        explanation = llama_pipe(message, max_length=225)
        formatted_explanation = re.split(r"Explanation.*\n\n", explanation[0]["generated_text"])
        return formatted_explanation[1].strip() + "..."
    except Exception as e:
        print(f"Error generating explanation: {e}")
        return f"An error was encountered while generating a full explanation, but a {pred} fallacy was detected."
```