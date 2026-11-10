```python
@survey_bp.route('/surveys/<int:survey_id>', methods=['PUT'])
def update_survey(survey_id):
    """Aggiorna un questionario esistente preservando ID delle domande"""
    # Assisted using common GitHub development utilities - Implementazione migliorata per preservare dati esistenti
    survey = Survey.query.get_or_404(survey_id)
    data = request.json
    
    # Aggiorna i campi del questionario
    if 'title' in data:
        survey.title = data['title']
    if 'description' in data:
        survey.description = data['description']
    if 'is_active' in data:
        survey.is_active = data['is_active']
    if 'expires_at' in data and data['expires_at']:
        survey.expires_at = datetime.fromisoformat(data['expires_at'])
    elif 'expires_at' in data and not data['expires_at']:
        survey.expires_at = None
    
    # Gestione intelligente delle domande se presenti
    if 'questions' in data:
        # Ottieni le domande esistenti
        existing_questions = {q.id: q for q in survey.questions}
        submitted_question_ids = set()
        
        position = 1
        for q_data in data['questions']:
            question_id = q_data.get('id')
            
            if question_id and question_id in existing_questions:
                # Aggiorna domanda esistente
                question = existing_questions[question_id]
                question.text = q_data['text']
                question.question_type = q_data['question_type']
                question.required = q_data.get('required', False)
                question.position = position
                
                # Aggiorna opzioni - rimuovi quelle vecchie e aggiungi quelle nuove
                for option in question.options:
                    db.session.delete(option)
                    
                submitted_question_ids.add(question_id)
            else:
                # Crea nuova domanda
                question = Question(
                    survey_id=survey.id,
                    text=q_data['text'],
                    question_type=q_data['question_type'],
                    required=q_data.get('required', False),
                    position=position
                )
                db.session.add(question)
                db.session.flush()  # Per ottenere l'ID della nuova domanda
            
            # Gestisci le opzioni per la domanda (nuova o aggiornata)
            if q_data.get('options') and question.question_type in ['single_choice', 'multiple_choice']:
                opt_position = 1
                for opt_text in q_data['options']:
                    option = QuestionOption(
                        question_id=question.id,
                        text=opt_text,
                        position=opt_position
                    )
                    db.session.add(option)
                    opt_position += 1
            
            position += 1
        
        # Rimuovi domande che non sono più presenti
        for question_id, question in existing_questions.items():
            if question_id not in submitted_question_ids:
                db.session.delete(question)
    
    db.session.commit()
    
    return jsonify({
        'id': survey.id,
        'title': survey.title,
        'message': 'Questionario aggiornato con successo'
    })
```
```python
def _process_survey_responses(survey_id):
    """
    Funzione di utilità per processare le risposte di un questionario
    Restituisce dati strutturati per export in vari formati
    Assisted using common GitHub development utilities
    """
    survey = Survey.query.get_or_404(survey_id)
    responses = SurveyResponse.query.filter_by(survey_id=survey_id, is_complete=True).all()
    
    # Ottieni tutte le domande del questionario per l'header CSV
    questions = Question.query.filter_by(survey_id=survey_id).order_by(Question.position).all()
    
    processed_data = {
        'survey': {
            'id': survey_id,
            'title': survey.title,
            'description': survey.description,
            'exported_at': datetime.now().isoformat(),
            'total_responses': len(responses)
        },
        'questions': [],
        'responses': []
    }
    
    # Processa le domande per l'header
    for question in questions:
        processed_data['questions'].append({
            'id': question.id,
            'text': question.text,
            'type': question.question_type,
            'position': question.position
        })
    
    # Processa le risposte
    for response in responses:
        response_data = {
            'id': response.id,
            'respondent_id': response.respondent_id,
            'started_at': response.started_at.isoformat() if response.started_at else None,
            'completed_at': response.completed_at.isoformat() if response.completed_at else None,
            'answers': {}
        }
        
        # Crea un mapping question_id -> answer per facilitare CSV export
        for answer in response.answers:
            question = Question.query.get(answer.question_id)
            if not question:
                continue
                
            answer_value = None
            
            # Formatta la risposta in base al tipo di domanda
            if question.question_type == 'text':
                answer_value = answer.text_answer or ""
                
            elif question.question_type in ['single_choice', 'multiple_choice']:
                if answer.selected_options:
                    try:
                        selected_ids = json.loads(answer.selected_options)
                        if not isinstance(selected_ids, list):
                            selected_ids = [selected_ids]
                            
                        selected_texts = []
                        for option_id in selected_ids:
                            option = QuestionOption.query.get(option_id)
                            if option:
                                selected_texts.append(option.text)
                        
                        # Per CSV, usa separatore ; per multiple choice
                        if question.question_type == 'single_choice':
                            answer_value = selected_texts[0] if selected_texts else ""
                        else:
                            answer_value = "; ".join(selected_texts)
                            
                    except (json.JSONDecodeError, TypeError) as e:
                        print(f"Errore nel parsing delle opzioni: {e}")
                        answer_value = ""
                else:
                    answer_value = ""
                    
            elif question.question_type == 'rating':
                answer_value = str(answer.rating_value) if answer.rating_value is not None else ""
            else:
                answer_value = answer.text_answer or ""
            
            response_data['answers'][question.id] = answer_value
        
        processed_data['responses'].append(response_data)
    
    return processed_data
```
```python
def _create_csv_export(processed_data):
    """
    Crea export CSV da dati processati
    Assisted using common GitHub development utilities
    """
    output = io.StringIO()
    
    # Crea header CSV
    fieldnames = ['response_id', 'respondent_id', 'started_at', 'completed_at']
    
    # Aggiungi le domande come colonne
    for question in processed_data['questions']:
        # Sanitizza il nome della colonna per CSV
        clean_text = question['text'].replace(',', ' ').replace('\n', ' ').replace('\r', ' ')[:50]
        fieldnames.append(f"Q{question['position']}_{clean_text}")
    
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    
    # Scrivi i dati delle risposte
    for response in processed_data['responses']:
        row = {
            'response_id': response['id'],
            'respondent_id': response['respondent_id'] or 'Anonimo',
            'started_at': response['started_at'] or '',
            'completed_at': response['completed_at'] or ''
        }
        
        # Aggiungi le risposte alle domande
        for question in processed_data['questions']:
            clean_text = question['text'].replace(',', ' ').replace('\n', ' ').replace('\r', ' ')[:50]
            col_name = f"Q{question['position']}_{clean_text}"
            row[col_name] = response['answers'].get(question['id'], '')
        
        writer.writerow(row)
    
    return output.getvalue()
```