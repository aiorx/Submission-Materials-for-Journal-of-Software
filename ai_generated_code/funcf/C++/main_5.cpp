std::vector<Bird> createRandomBirds(int n) { //thanks chatgpt
	vector<Bird> birds;
	random_device rd;//this creates a more uniformly distributed randomness over 2d space.
	mt19937 gen(rd()); //apparently also more suitable for multithreaded operations.
	uniform_real_distribution<float> xDist(wallx0, wallx1);
	uniform_real_distribution<float> yDist(wally0, wally1);
	uniform_real_distribution<float> rotDist(0.0f, 360.0f);
	
	for (int i = 0; i < n; ++i) {
		float randomX = xDist(gen);
		float randomY = yDist(gen);
		float randomRot = rotDist(gen);
		birds.emplace_back(randomX, randomY, randomRot);
	}
	return birds;
}

void WaitForEndOfFrame(){ //thanks chat gpt
	static struct timespec last_time;
	struct timespec this_time;
	clock_gettime(CLOCK_MONOTONIC, &this_time);
	if(last_time.tv_sec == 0 && last_time.tv_nsec == 0) {
		last_time = this_time; //Initialize last_time on the first call
	} 
	else{
		// Calculate the time to sleep to achieve the desired frame rate
		const long NANOSECONDS_PER_SECOND = 1000000000;
		const int timePerFrame = NANOSECONDS_PER_SECOND / FPS_LIMIT;

		// Calculate the time difference between this_time and last_time
		long elapsed_ns = (this_time.tv_sec - last_time.tv_sec) * NANOSECONDS_PER_SECOND +
							this_time.tv_nsec - last_time.tv_nsec;

		long timeToSleep = timePerFrame - elapsed_ns;
		if (timeToSleep > 0) {
			struct timespec sleep_duration;
			sleep_duration.tv_sec = timeToSleep / NANOSECONDS_PER_SECOND;
			sleep_duration.tv_nsec = timeToSleep % NANOSECONDS_PER_SECOND;

			//Sleep for the required duration
			nanosleep(&sleep_duration, NULL);
		}
	}
	last_time = this_time;
}