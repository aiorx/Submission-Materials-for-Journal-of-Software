```java
private void initCloudService() {
    AVAnalytics.setAnalyticsEnabled(false);
    // 初始化参数依次为 this, AppId, AppKey
    AVOSCloud.initialize(this, Constants.APP_ID, Constants.APP_KEY);
//        AVAnalytics.enableCrashReport(this, true);
    //调试过程中，出现debug的log
    AVOSCloud.setDebugLogEnabled(true);
}
```