```python
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    language = data.get("language", "english")

    if not user_message and conversation_state["awaiting_answer"]:
        return jsonify({"error": "Message cannot be empty"}), 400

    if conversation_state["in_question_mode"]:
        if conversation_state["awaiting_answer"]:
            if language.lower() != "english":
                translated_answer = translate_to_english(user_message)
            else:
                translated_answer = user_message

        ## Code on line 60 to 88 was Aided via basic GitHub coding utilities with the following prompt:
        # "Add a feature that evaluates user answers to questions using the LLM. After each answer, 
        # send the question and answer to the LLM and request a confidence score between 0 and 1. 
        # If the score is below 0.9, re-ask the same question with a clearer or more specific wording. 
        # Repeat this process until the LLM returns a confidence score ≥ 0.9, then store the answer and proceed to the next question."
            """
            # Evaluate the answer using the LLM
            question = conversation_state["questions"][conversation_state["current_question_index"] - 1]
            evaluation_prompt = (
                f"Evaluate the following answer to the question and provide a confidence score between 0 and 1. "
                f"If the confidence score is below 0.9, suggest a clearer or more specific rewording of the question.\n\n"
                f"Question: {question}\nAnswer: {translated_answer}"
            )
            evaluation_messages = [{"role": "user", "content": evaluation_prompt}]
            try:
                evaluation_response = send_to_llm(evaluation_messages)
                import json
                try:
                    evaluation_data = json.loads(evaluation_response)
                except json.JSONDecodeError:
                    logging.error(f"Invalid JSON response from LLM: {evaluation_response}")
                    return jsonify({"error": "Failed to evaluate the answer due to invalid response from LLM."}), 500

                confidence_score = evaluation_data.get("confidence", 0)
                reworded_question = evaluation_data.get("reworded_question", question)

                if confidence_score < 0.9:
                    # Re-ask the question with the reworded version
                    conversation_state["questions"][conversation_state["current_question_index"] - 1] = reworded_question
                    conversation_state["awaiting_answer"] = True
                    conversation_state["conversation_history"].append({"role": "assistant", "content": reworded_question})
                    return jsonify({"reply": reworded_question})
            except Exception as e:
                logging.error(f"Error evaluating answer: {e}")
                return jsonify({"error": "Failed to evaluate the answer."}), 500
            """
            # Update the answer for the current question (answers align with original keys)
            index = conversation_state["current_question_index"] - 1
            if index < len(conversation_state["answers"]):
                conversation_state["answers"][index] = translated_answer
            else:
                conversation_state["answers"].append(translated_answer)
            
            conversation_state["awaiting_answer"] = False
            conversation_state["conversation_history"].append({"role": "user", "content": user_message})

            # If all questions have been answered, generate the filled PDF or QA file.
            if conversation_state["current_question_index"] >= len(conversation_state["questions"]):
                # Use the original field names (keys) to populate the PDF.
                form_data = dict(zip(conversation_state["original_questions"], conversation_state["answers"]))

                if conversation_state.get("original_pdf_path"):
                    input_pdf_path = conversation_state["original_pdf_path"]
                    output_pdf_path = os.path.join("temp", "filled_form.pdf")
                    
                    try:
                        populate_pdf_form(input_pdf_path, output_pdf_path, form_data)
                    except Exception as e:
                        logging.error(f"Error populating PDF: {e}")
                        return jsonify({"error": "Error populating PDF form"}), 500

                    download_link = f"/download/{os.path.basename(output_pdf_path)}"
                    summary = "Your form has been filled. You can download the completed PDF here: " + download_link
                else:
                    qa_filepath = generate_qa_file(conversation_state["original_questions"], conversation_state["answers"])
                    download_link = f"/download/{os.path.basename(qa_filepath)}"
                    summary = "Here are the questions and answers:\n"
                    for i, (question, answer) in enumerate(zip(conversation_state["original_questions"], conversation_state["answers"])):
                        summary += f"{i + 1}. Q: {question}\n   A: {answer}\n"
                    summary += f"\nYou can download the file here: {download_link}"

                # Reset conversation state for a new session.
                conversation_state["in_question_mode"] = False
                conversation_state["original_questions"] = []
                conversation_state["questions"] = []
                conversation_state["current_question_index"] = 0
                conversation_state["answers"] = []
                conversation_state["original_pdf_path"] = ""
                conversation_state["conversation_history"].append({"role": "assistant", "content": summary})

                return jsonify({"reply": summary, "download_link": download_link})

            # Ask the next question using the translated version.
            question = conversation_state["questions"][conversation_state["current_question_index"]]
            conversation_state["current_question_index"] += 1
            conversation_state["awaiting_answer"] = True
            conversation_state["conversation_history"].append({"role": "assistant", "content": question})
            return jsonify({"reply": question})
        else:
            question = conversation_state["questions"][conversation_state["current_question_index"]]
            conversation_state["awaiting_answer"] = True
            conversation_state["conversation_history"].append({"role": "assistant", "content": question})
            return jsonify({"reply": question})
    else:
        conversation_state["conversation_history"].append({"role": "user", "content": user_message})
        
        # Start timing
        start_time = time.time()
        
        llm_response = send_to_llm(conversation_state["conversation_history"])
        
        # End timing and calculate duration
        end_time = time.time()
        response_time = end_time - start_time
        
        # Log the response time
        log_message = f"Time between user message and LLM response: {response_time:.2f} seconds"
        logging.info(log_message)
        
        # Append the LLM response to the conversation history
        conversation_state["conversation_history"].append({"role": "assistant", "content": llm_response})
        
        # Send the response back to the frontend
        return jsonify({"reply": llm_response})  # Ensure the response is sent back to the frontend
```