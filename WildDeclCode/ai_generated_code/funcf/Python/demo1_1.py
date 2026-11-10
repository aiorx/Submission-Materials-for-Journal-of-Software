```python
def get_entities(sentence):
    entity1 = ""
    entity2 = ""

    previous_token_dep = ""  # dependency tag of previous token in the sentence
    previous_token_text = ""  # previous token in the sentence
    prefix = ""
    modifier = ""

    # following code is Aided with basic GitHub coding tools automatically. I checked it and did some modifications
    for token in nlp(sentence):
        # check if the token is a punctuation mark. If so, move to next token directly
        if token.dep_ != "punct":
            # check if the token is a compound word or not
            if token.dep_ == "compound":
                prefix = token.text
                # if the previous word was also a 'compound' then add the current word to it
                if previous_token_dep == "compound":
                    prefix = previous_token_text + " " + token.text

            # check if the token is a modifier or not
            if token.dep_.endswith("mod") == True:
                modifier = token.text
                # if the previous word was also a 'compound' then add the current word to it
                if previous_token_dep == "compound":
                    modifier = previous_token_text + " " + token.text

            if token.dep_.find("subj") == True:
                entity1 = modifier + " " + prefix + " " + token.text
                prefix = ""
                modifier = ""
                previous_token_dep = ""
                previous_token_text = ""

            if token.dep_.find("obj") == True:
                entity2 = modifier + " " + prefix + " " + token.text

            # update variables
            previous_token_dep = token.dep_
            previous_token_text = token.text

    return [entity1.strip(), entity2.strip()]
```