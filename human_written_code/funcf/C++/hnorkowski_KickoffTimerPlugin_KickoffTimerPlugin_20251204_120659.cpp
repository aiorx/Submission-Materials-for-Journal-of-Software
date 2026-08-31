```cpp
void KickoffTimerPlugin::onHitBall(std::string eventName) 
{
	if (!gameWrapper->IsInGame() || hitted || spawn == 0)
		return;

	timeHit = gameWrapper->GetGameEventAsServer().GetSecondsElapsed() - timeStart;
	hitted = true;
	if (timeHit < 1.5 || timeHit > 4) 
		return;

	if (spawn->personalBest == -1) 
	{
		spawn->personalBest = timeHit;
		pBallHitted.color = { 255,255,255 };
	}
	else
	{
		if (timeHit < spawn->personalBest)
		{
			pBallHitted.color = { 255,200,0 };
			spawn->personalBest = timeHit;
		}
		else {
			pBallHitted.color = { 255,0,0 };
		}
		
	}
	if (timeHit < spawn->normalTime) 
	{
		pBallHitted.color = { 0,255,0 };
	}

	pBallHitted.text = string("Ball hitted after ") + to_string_with_precision(timeHit, 2) + string(" seconds.");
	lastMsg = chrono::system_clock::now();
}
```