```python
def create_card(session: Session, deck: Deck) -> None:
    """
    Created a new deck with the information gathered,
    and gives some feesessionack to the user.

    :param session: a SQLAlchemy Session object
    :returns: None. This is is intended, because in this way you won't
        get the "What to do with this card?" menu but go directly back.
    """
    answers = prompt(
        [
            {"type": "input", "name": "question", "message": "Question:"},
            {"type": "input", "name": "answer", "message": "Answer:"},
        ]
    )

    # This happens in case of a Ctrl+C during the above questions
    if not answers.get("question") or not answers.get("answer"):
        click.echo("Card creation stopped: no card was created.")
        return

    question = Fact.create(
        session=session, value=answers["question"], format="plaintext"
    )
    answer = Fact.create(session=session, value=answers["answer"], format="plaintext")
    Card.create(
        session=session, deck_id=deck.id, question_id=question.id, answer_id=answer.id
    )
    click.echo("New card created!")
```