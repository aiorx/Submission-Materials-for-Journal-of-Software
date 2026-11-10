```c
// GPIO EXPORT
int gpio_export(int gpio_num) {
    char gpio_str[4];
    sprintf(gpio_str,"%d",gpio_num);
    return file_open_and_write_value(SYSFS_GPIO_PATH SYSFS_GPIO_EXPORT_FN,gpio_str);
}
```