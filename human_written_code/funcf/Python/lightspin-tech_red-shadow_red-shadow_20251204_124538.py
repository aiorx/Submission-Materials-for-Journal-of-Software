```python
def is_group_misconfig(statement):

    if 'Effect' not in statement or 'Action' not in statement or 'Resource' not in statement:
        return False
    
    is_deny = statement['Effect'] == 'Deny'

    is_user_action = False
    for action in statement['Action']:
        if action in AWS_USER_ACTIONS:
            is_user_action = True

    is_group_resource = False
    if isinstance(statement['Resource'], list):
        for resource in statement['Resource']:
            if re.match(AWS_GROUP_PATTERN, resource):
                is_group_resource = True
    else:
        if re.match(AWS_GROUP_PATTERN, statement['Resource']):
            is_group_resource = True

    return is_deny and is_user_action and is_group_resource
```