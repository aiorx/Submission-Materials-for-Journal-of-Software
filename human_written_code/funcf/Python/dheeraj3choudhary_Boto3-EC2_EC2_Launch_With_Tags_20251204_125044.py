```python
def create_instance(image_id, key_name, env_tag):
    client = boto3.client('ec2')
    response = client.run_instances(
        ImageId=image_id,
        InstanceType='t2.micro',
        MinCount=1,
        MaxCount=1,
        KeyName=key_name,
        TagSpecifications=[
            {
                'ResourceType': 'instance',
                'Tags': [{'Key': 'Env', 'Value': env_tag}]
            },
        ],
    )
    return response
```