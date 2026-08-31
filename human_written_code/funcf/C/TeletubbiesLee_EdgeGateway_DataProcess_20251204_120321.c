```c
/**
 * @brief 获取当前时间字符串
 * @param timeStr 保存时间字符串
 * @return 成功:0 错误:-1
 */
int GetTimeStr(char *timeStr)
{
    time_t rawTime;
    struct tm *info;

    time(&rawTime);     //获取当前时间
    info = localtime(&rawTime);

    strftime(timeStr, 20, "%Y-%m-%d %H:%M:%S", info);    //时间字符串格式化

    return NO_ERROR;
}
```