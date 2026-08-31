```cpp
bool SimObj::bind(Actor *actor, std::vector<const char *>& boneNames, config_t &config)
{
	//logger.error("bind\n");


	auto loadedState = actor->loadedState;
	if (loadedState && loadedState->node) {
		bound = true;

		things.clear();
		for (const char * &b : boneNames) {
			BSFixedString cs(b);
			auto bone = loadedState->node->GetObjectByName(&cs.data);
			if (!bone) {
				logger.info("Failed to find Bone %s for actor %d\n", b, actor->formID);
			} else {
				things.emplace(b, Thing(bone, cs));
			}
		}
		updateConfig(config);
		return  true;
	}
	return false;
}
```