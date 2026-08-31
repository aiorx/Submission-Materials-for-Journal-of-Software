```java
@Override
public void validatePostLoad() throws ValidationException {
	if (atmosphereRadius >= portalDepth) {
		throw new ValidationException("atmosphereRadius should be smaller then portalDepth");
	}

	squaredAtmosphereRadius = Math.pow(atmosphereRadius, 2);
	squaredAtmosphereRadiusPlusOne = Math.pow(atmosphereRadius+1, 2);
	squaredAtmosphereRadiusMinusOne = Math.pow(atmosphereRadius-1, 2);
}
```