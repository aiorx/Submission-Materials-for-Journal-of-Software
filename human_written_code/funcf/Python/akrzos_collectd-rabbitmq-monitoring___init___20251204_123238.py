```python
def configure(configobj):
    global INTERVAL
    global cl
    global queues_to_count

    config = {c.key: c.values for c in configobj.children}
    INTERVAL = config['interval'][0]
    host = config['host'][0]
    port = int(config['port'][0])
    username = config['username'][0]
    password = config['password'][0]
    queues_to_count = []
    if 'message_count' in config:
        queues_to_count = config['message_count']
    collectd.info('rabbitmq_monitoring: Interval: {}'.format(INTERVAL))
    cl = Client('{}:{}'.format(host, port), username, password)
    collectd.info(
        'rabbitmq_monitoring: Connecting to: {}:{} as user:{} password:{}'
        .format(host, port, username, password))
    collectd.info(
        'rabbitmq_monitoring: Counting messages on: {}'
        .format(queues_to_count))
    collectd.register_read(read, INTERVAL)
```