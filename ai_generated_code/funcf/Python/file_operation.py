```python
def create_query_step(addon):
    individual_test_cases = 'Generate selenium generic step_definition for new ' \
                            'lines/steps in detail using java language, generic means do not use any testcases ' \
                            'reference like login button, continue button, search field, etc. and ' \
                            'avoid ambiguity while generating step definition.' \
                            'step definition method name should be generic like clickElement(),enterValue(), etc. ' \
                            'and strictly use webelement declaration with ele1 or ele2 name only' \
                            'and take step definition argument name relevant to step line ' \
                            'like element, pageName, valueToEnter, expectedValue, sropdownOption, etc.' \
                            'and make sure strictly no duplicate stepdefinition ' \
                            'and each steps needs to generate only once.' \
                            'use this methods <load_and_find_page_element> to find the web element. and I ' \
                            'want all code inside step definition only related to selenium commands.' \
                            'Do not add commented line in step definition related to selenium commands.' \
                            'For step def argument use {string}' \
                            ' Please generate complete end to end code ' \
                            'and will not change ' \
                            'any thing in code Supported via standard programming aids\n' + addon
    return individual_test_cases
```