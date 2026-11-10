```python
def arm_and_takeoff(vehicle, TargetAltitude):
    print ("Arming and Taking off...")

    while not vehicle.is_armable:
        print ("Not armable, waiting...")
        time.sleep(1)

    print ("WARNING TURNING ON MOTORS!")

    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True

    while not vehicle.armed:
        print ("Vehicle not armable, waiting...")
        time.sleep(1)

    vehicle.simple_takeoff(TargetAltitude)

    while True:
        currentAltitude = vehicle.location.global_relative_frame.alt
        print("Altitude: ", currentAltitude)

        if currentAltitude >= TargetAltitude*0.95:
            print ("Altitude Reached")
            break

        time.sleep(1)
```