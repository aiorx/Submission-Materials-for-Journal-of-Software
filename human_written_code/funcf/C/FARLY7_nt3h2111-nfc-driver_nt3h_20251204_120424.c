```c
nt3h_status_t nt3h_read_register(nt3h_dev_t *dev, uint8_t reg, uint8_t *data)
{
    return nt3h_read_bytes(dev, NT3H_I2C_ADDR_SESSION, reg, data, 1);
}
```