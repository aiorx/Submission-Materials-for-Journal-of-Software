```cpp
} else if (m_state == MOVE_STEPS_AND_BACK) { //simple function Assisted with basic coding tools
    if(m_steps > 0) {
      m_stepper->step(calculateSteps(m_steps * 1.8));
      delay(1000);
      m_stepper->step(calculateSteps(-m_steps * 1.8));
      m_steps = 0;
    }
  }
```

```cpp
  } else if (m_state == AUTO_FOUNDATIONS) { //begun by ChatGPT, finished by me
    unsigned long now = millis();

    if (currentRotation >= 360) {
      //find optimal rotation angle after a 360
      double maxPower = recordedPower[0];
      int maxIndex = 0;
      for(int i = 0; i < 9; i++) {
        if(recordedPower[i] > maxPower) {
          maxPower = recordedPower[i];
          maxIndex = i;
        }
      }

      optimalRotation = maxIndex * 40; //40 degree increment

      //move to the optimal rotation
      currentRotation = optimalRotation;
      m_stepper->step(calculateSteps(-currentRotation));
      delay(5000);

      //clear recorded data and reset current rotation to start the process again
      for (int i = 0; i < 9; i++) {
        recordedPower[i] = 0;
      }
      currentIndex = 0;
      currentRotation = 0;
    } else {
      if (now - m_lastMove > 2000) {
        m_lastMove = now;
        //rotate the windmill by 40 degrees
        m_stepper->step(calculateSteps(40));
        currentRotation += 40;

        //record the power generation at this rotation angle
        double voltage = volts;
        if(currentIndex < 9) {
          currentIndex++;
          recordedPower[currentIndex] = volts;
        }
      }
    }
  }
```

```cpp
  } else if (m_state == AUTO_FINISHINGS) { //begun by me, finished by ChatGPT
    unsigned long now = millis();
    
    if(totalRotation < maxRotation) {
      if(now - m_lastMove > 2000) {
        m_lastMove = now;

        //store detected windmill generated voltage
        double voltage = volts;
        detectedVoltages[stepCount] = voltage;
        rotations[stepCount] = totalRotation;

        m_stepper->step(calculateSteps(rotationStep));

        totalRotation += rotationStep;
        stepCount++;
      }
    } else {
      //determine maximum voltage rotation
      double maxVoltage = detectedVoltages[0];
      int maxIndex = 0;
      for (int i = 1; i < stepCount; ++i) {
        if (detectedVoltages[i] > maxVoltage) {
          maxVoltage = detectedVoltages[i];
          maxIndex = i;
        }
      }
      double bestRotation = rotations[maxIndex];

      //rotate back to best voltage
      m_stepper->step(calculateSteps(-bestRotation));

      delay(5000);

      //clear variables
      for (int i = 0; i < 9; i++) {
        detectedVoltages[i] = 0.0;
        rotations[i] = 0.0;
      }
      totalRotation = 0.0;
      stepCount = 0;
      }
  }
```

```cpp
  } else if (m_state == AUTO_FULL) { //completely done by ChatGPT
    unsigned long now = millis();

    if (currRotation < 360.0) {
      if (now - m_lastMove > 2000) {
        m_lastMove = now;
        m_stepper->step(calculateSteps(rotation_step)); //40 degree steps

        double voltage = volts;

        if (voltage > maxVoltage) {
          maxVoltage = voltage;
          bestRotation = 360.0 - currRotation;
        }

        currRotation += rotation_step;
      }
    } else {
      //once optimal rotation found, maintain it
      m_stepper->step(calculateSteps(-bestRotation));

      delay(5000);

      //reset variables
      maxVoltage = 0.0;
      currRotation = 0.0;
      bestRotation = 0.0;
    }
  }
```