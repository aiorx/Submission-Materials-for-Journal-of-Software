```java
private final Runnable batteryCheckRunnable = new Runnable() { //Drafted using standard development resources 3.5 with prompts from Coby's code

    @Override
    public void run() {
        bm = (BatteryManager) getSystemService(Context.BATTERY_SERVICE);
        phoneCharge = bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY);
        print_to_terminal("Read Phone battery level: " + phoneCharge);
        System.out.print("Battery level " +  String.valueOf(phoneCharge) + "\n");

        Log.d("BatteryLevel", String.valueOf(phoneCharge));

        batteryCheckHandler.postDelayed(batteryCheckRunnable, 60 * 1000); //delay
    }
};
```