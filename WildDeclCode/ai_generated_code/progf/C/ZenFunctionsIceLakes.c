class ZenFunctionsIceLakes
{
	//! Return a list of objects the player is aiming at within X meters distance
	static array<Object> GetObjectsRayCastCamera(float distance = UAMaxDistances.BASEBUILDING, PlayerBase ourPlayer = NULL)
	{
		array<Object> aimedObjects = new array<Object>;

		if (!ourPlayer)
			ourPlayer = PlayerBase.Cast(GetGame().GetPlayer());

		if (!ourPlayer)
			return aimedObjects;

		int hitComponentIndex;
		vector playerPos = ourPlayer.GetPosition();
		vector headingDirection = MiscGameplayFunctions.GetHeadingVector(ourPlayer);

		vector m_RayStart = GetGame().GetCurrentCameraPosition();
		vector m_RayEnd = m_RayStart + GetGame().GetCurrentCameraDirection() * distance;

		RaycastRVParams rayInput = new RaycastRVParams(m_RayStart, m_RayEnd, ourPlayer);
		rayInput.flags = CollisionFlags.ALLOBJECTS;
		array<ref RaycastRVResult> results = new array<ref RaycastRVResult>;
		RaycastRVResult res;

		if (DayZPhysics.RaycastRVProxy(rayInput, results))
		{
			for (int i = 0; i < results.Count(); i++)
			{
				if (results.Get(i).obj == ourPlayer)
					continue;

				aimedObjects.Insert(results.Get(i).obj);
			}
		}

		return aimedObjects;
	}

	//! Return a list of objects the player is standing on
	static array<Object> GetObjectsRayCastBeneath(float distance = 2.0, PlayerBase ourPlayer = NULL)
	{
		array<Object> aimedObjects = new array<Object>;

		if (!ourPlayer)
			ourPlayer = PlayerBase.Cast(GetGame().GetPlayer());

		if (!ourPlayer)
			return aimedObjects;

		int hitComponentIndex;
		vector playerPos = ourPlayer.GetPosition();
		vector headingDirection = MiscGameplayFunctions.GetHeadingVector(ourPlayer);

		vector distanceVector = ourPlayer.GetPosition();
		distanceVector[1] = distanceVector[1] - distance;

		vector m_RayStart = ourPlayer.GetPosition();
		vector m_RayEnd = m_RayStart + (ourPlayer.GetPosition() - distanceVector);

		RaycastRVParams rayInput = new RaycastRVParams(m_RayStart, m_RayEnd, ourPlayer);
		rayInput.flags = CollisionFlags.ALLOBJECTS;
		array<ref RaycastRVResult> results = new array<ref RaycastRVResult>;
		RaycastRVResult res;

		if (DayZPhysics.RaycastRVProxy(rayInput, results))
		{
			for (int i = 0; i < results.Count(); i++)
			{
				if (results.Get(i).obj == ourPlayer)
					continue;

				aimedObjects.Insert(results.Get(i).obj);
			}
		}

		return aimedObjects;
	}

	//! Orientates given object to vector pos. Thanks ChatGPT ;) I might have failed math, but I still know how to write a good prompt
	static void OrientObjectToPosition(Object object, vector targetPos, vector oriOffset = "0 0 0")
	{
		// Calculate direction vector from object to target
		vector startPos = object.GetPosition();
		vector direction = targetPos - startPos;

		// Calculate yaw angle in radians. Note that in Enfusion's coordinate system,
		// Z is typically the forward axis and X is the side axis.
		float yawRadians = Math.Atan2(direction[0], direction[2]); // [0] is X, [2] is Z

		// Convert radians to degrees
		float yawDegrees = yawRadians * Math.RAD2DEG;

		// Adjust the angle to be between 0 and 360 degrees if necessary
		if (yawDegrees < 0)
			yawDegrees += 360;

		// Set object orientation's yaw angle
		vector objectOri = object.GetOrientation();
		objectOri[0] = yawDegrees;

		object.SetOrientation(objectOri + oriOffset);
	}
};