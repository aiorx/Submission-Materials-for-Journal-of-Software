```python
def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--baseurl', metavar='URL', default='http://192.168.10.1',
                        help='the url of the vehicle')

    parser.add_argument('--skill-key', type=str,
                        help='the import path of the ComLink Skill already on the R1')

    # NOTE: you'll need a token file in order to connect to a simulator.
    # Tokens are NOT required for real R1s.
    parser.add_argument('--token-file',
                        help='path to the auth token for your simulator')

    # Example actions for the ComLink skill
    parser.add_argument('--forward', metavar='X', type=float,
                        help='move forward X meters.')

    parser.add_argument('--loop', action='store_true',
                        help='keep sending messages')

    # Experimental: save a 720P image from the vehicle as a .png file
    parser.add_argument('--image', action='store_true',
                        help='save an image')

    parser.add_argument('--title', default='Hello World')

    args = parser.parse_args()

    # Create the client to use for all requests.
    client = HTTPClient(args.baseurl,
                        pilot=False,
                        token_file=args.token_file)

    # Create the request that we will send to the ComLink skill.
    request = {
        'title': 'Hello World',
        'detail': 0,
    }
    if args.forward:
        request['forward'] = args.forward

    # Continuously poll
    start_time = time.time()
    while True:
        elapsed_time = int(time.time() - start_time)
        request['detail'] = elapsed_time

        # Arbitrary data format. Using JSON here.
        t = time.time()
        response = client.send_custom_comms(args.skill_key, json.dumps(request))
        dt = int((time.time() - t) * 1000)
        print('Custom Comms Response (took {}ms) {}\n'
              .format(dt, json.dumps(response, sort_keys=True, indent=True)))

        if args.image:
            print('Requesting image')
            client.save_image(filename='image_{}.png'.format(elapsed_time))

        if args.loop:
            time.sleep(1.0)

            # Don't repeat the forward command.
            if 'forward' in request:
                del request['forward']

        else:
            # Exit the loop.
            break
```