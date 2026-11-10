```cpp
void Ship::UpdateRollAnimation(sf::Time dt)
{

	// Check if the ship type has roll animation enabled 
	if (Table[static_cast<int>(m_type)].m_has_roll_animation)
	{
		// Time-based animation using sine waves Adapted from standard coding samples

		static float timeAccumulator = 0.0f; // Accumulate elapsed time for smooth animation
		timeAccumulator += dt.asSeconds();
	
		// Bobbing effect (up and down movement)
		const float bobAmplitude = 0.2f;  // Adjust for how high/low the boat moves
		const float bobFrequency = 0.2f;  // Speed of bobbing
		float bobOffset = bobAmplitude * sin(timeAccumulator * bobFrequency);
	
		// Rotational tilt (left-right tilting)
		const float tiltAmplitude = 4.0f;  // Maximum tilt in degrees
		const float tiltFrequency = 1.5f;  // Speed of tilting
		float tiltAngle = tiltAmplitude * sin(timeAccumulator * tiltFrequency + 2.0f); // Offset phase for natural motion
	
		// Apply transformations
		m_sprite.setPosition(original_x, original_y + bobOffset); // Adjust Y position for bobbing
		m_sprite.setRotation(tiltAngle);                       // Apply tilt to the sprite
	}

}
```