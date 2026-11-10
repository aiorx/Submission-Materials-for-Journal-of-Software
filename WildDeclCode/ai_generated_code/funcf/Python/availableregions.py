def check_region(region):
        try:
            polly_client = session.client('polly', region_name=region)
            polly_client.describe_voices()
            return region
        except (ClientError, EndpointConnectionError):
            return None
        
    with ThreadPoolExecutor(max_workers = 10) as executor:
        futures = {executor.submit(check_region, region): region for region in regions}
        for future in as_completed(futures):
            result = future.result()
            if result:
                accessibleRegions.append(result)