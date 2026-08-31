```python
async def main():
    telegram_list = open('telegram_db', 'r').readlines()
    for (i,telegram_channel) in enumerate(telegram_list):
        if "https://" in telegram_channel:
            telegram_channel = telegram_channel.split('/')[-1]
        elif '@' in telegram_channel:
            telegram_channel = telegram_channel[1:]
        print(telegram_channel)
        try:
            result = await client(functions.account.ReportPeerRequest(
                peer=telegram_channel,
                reason=types.InputReportReasonSpam(),
                message='RUSSIAN PROPAGANDA AGAINST UKRAINE DURING RUSSIAN INVASION IN UKRAINE' + str(random.random())
            ))
            print(result)
        except ValueError:
            print("Channel not found")
        await asyncio.sleep(3 + 2 * random.random())
```