```python
def main():
    module_args = dict(
        vlan_id=dict(type='int', required=True),
        name=dict(type='str', default=None),
        description=dict(type='str', default=None),
        interfaces=dict(type='list', default=None),
        state=dict(default='present', choices=['present', 'absent'])
    )
    warnings = list()
    result = dict(changed=False, warnings=warnings)
    module = AnsibleModule(
        argument_spec=module_args,
        supports_check_mode=True
    )

    if module.check_mode:
        module.exit_json(changed=False)

    connection = Connection(module._socket_path)
    get_response = connection.get_running_config()
    module.log(msg=get_response)
    vid = module.params['vlan_id']
    name = module.params['name']
    description = module.params['description']
    interfaces = module.params['interfaces']
    state = module.params['state']
    try:
        json_data = json.loads(get_response)
    except ValueError:
        module.fail_json(msg="Failed to parse JSON from device response")

    vlan_exists = False
    vlan_data = None
    for vlan in json_data.get('vlans', []):
        if vlan.get('id') == vid:
            vlan_exists = True
            vlan_data = vlan
            break

    if state == 'present':
        if not vlan_exists:
            # Create VLAN
            payload = {
                "id": vid,
                "name": name,
                "description": description,
                "interfaces": interfaces or []
            }
            response = connection.post('/vlans', data=json.dumps(payload))
            if response.status_code != 201:
                module.fail_json(msg="Failed to create VLAN", response=response.text)
            result['changed'] = True
        else:
            # Update VLAN if needed
            update_needed = False
            payload = {}
            if name is not None and vlan_data.get('name') != name:
                payload['name'] = name
                update_needed = True
            if description is not None and vlan_data.get('description') != description:
                payload['description'] = description
                update_needed = True
            if interfaces is not None and set(vlan_data.get('interfaces', [])) != set(interfaces):
                payload['interfaces'] = interfaces
                update_needed = True
            if update_needed:
                response = connection.put(f'/vlans/{vid}', data=json.dumps(payload))
                if response.status_code != 200:
                    module.fail_json(msg="Failed to update VLAN", response=response.text)
                result['changed'] = True
    elif state == 'absent':
        if vlan_exists:
            response = connection.delete(f'/vlans/{vid}')
            if response.status_code != 204:
                module.fail_json(msg="Failed to delete VLAN", response=response.text)
            result['changed'] = True

    module.exit_json(**result)
```