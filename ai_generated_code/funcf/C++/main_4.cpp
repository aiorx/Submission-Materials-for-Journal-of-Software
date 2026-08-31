// check if random number is 69, from 1 to 1000
            // use c++11 random number generator
            // Generated Aided via basic GitHub coding utilities
            if (dis(gen) == 69) {
                PlayLayer *playLayer = PlayLayer::get();
                if (!playLayer) {
                    return;
                }
                playLayer->resetLevelFromStart();
            }