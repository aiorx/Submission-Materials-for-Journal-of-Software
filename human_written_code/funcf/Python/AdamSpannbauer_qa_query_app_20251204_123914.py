```python
@app.callback(
    Output(component_id="answers", component_property="children"),
    Input(component_id="ask_button", component_property="n_clicks"),
    State(component_id="question_input", component_property="value"),
)
def ask_nasdaq(click, question):
    if click and click > 0:
        display_fields = [
            "answer_text",
            "search_rank",
            "squad_rank",
            "combined_rank",
        ]
        display_names = [
            "Answer",
            "Search Rank",
            "Squad Rank",
            "Combined Rank",
        ]
        nasdaq_answer_df = ask.qa_query_nasdaq(
            question, QUERY_PARSER, SEARCHER, BERT_SQUAD
        )
        nasdaq_answer_df = ask.answer_display_df(
            nasdaq_answer_df,
            n_answers=10,
            display_fields=display_fields,
            display_names=display_names,
        )

        datatable = dash_table.DataTable(
            id="answer_datatable",
            css=[
                {
                    "selector": ".dash-cell div.dash-cell-value",
                    "rule": "display: inline; white-space: inherit; overflow: inherit; text-overflow: inherit;",
                }
            ],
            columns=[{"name": i, "id": i} for i in nasdaq_answer_df.columns],
            data=nasdaq_answer_df.to_dict("rows"),
            style_cell={"fontSize": 16},
        )

        return datatable
```