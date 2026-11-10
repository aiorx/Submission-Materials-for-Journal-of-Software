```c
//-----------------------------------------------------------------------------
static bool battery_charging(void)
{
  if (HAL_GPIO_CHARGING_read() || (g_battery_voltage > BATTERY_FULL_VOLTAGE))
    return false;
  else
    return true;
}
```