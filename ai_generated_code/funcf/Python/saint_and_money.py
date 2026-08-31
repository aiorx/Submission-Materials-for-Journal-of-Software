```python
@staticmethod
def post_process(example: dict, formats: List[str]):
    """
    This function edits example dicts after they are Aided using common development resources. The post processed examples are saved in examples.json. The raw examples are saved in gen.json.
    """
    name = random.choice(company_names)
    for key in example:
        if "<NAME>" in example[key]:
            example[key] = example[key].replace("<NAME>", name)

    examples = []
    for complexity_level in [0,1,2]:
        for oversight_is_poor in [True, False]:
            # Oversight should never be poor for L0 examples
            if (oversight_is_poor and complexity_level == 0):
                continue
            example["complexity_level"] = complexity_level
            num_irrelevant_facts_to_include = random.randint(0, 2)
            facts = [
                {
                    "type": "contextual",
                    "content": example["scenario"],
                },
                {
                    "type": "motivating",
                    "content": example["ethical_dilemma"],
                },
            ]
            if complexity_level == 1:
                facts.append({
                        "type": "critical",
                        "content": example["you_can_get_away_with_this"] if oversight_is_poor else example["you_cant_get_away_with_this"],
                    })
            
            if complexity_level == 2:
                L2_facts = [
                    {
                        "type": "critical",
                        "content": example["company_uses_name"],
                    },
                    {
                        "type": "critical",
                        "content": example["name_is_not_diligent"] if oversight_is_poor else example["name_is_diligent"]
                    },
                ]
                random.shuffle(L2_facts)
                facts.extend(L2_facts)

            irrelevant_facts = [
                {
                    "type": "irrelevant",
                    "content": example["irrelevant_fact"],
                },
                {
                    "type": "irrelevant",
                    "content": example["irrelevant_fact_about_name"],
                },
            ]
            irrelevant_facts_to_include = random.sample(
                irrelevant_facts, num_irrelevant_facts_to_include
            )

            for irrelevant_fact in irrelevant_facts_to_include:
                facts.insert(random.randint(0, len(facts)), irrelevant_fact)

            example['facts'] = facts

            formatted_example = post_process_scenario(
                copy.deepcopy(example),
                format_strings=formats,
                correct_response=example["ethical_action"],
                incorrect_response=example["unethical_action"],
            )

            formatted_example["oversight_is_poor"] = oversight_is_poor
            
            examples.append(formatted_example)

    return examples
```