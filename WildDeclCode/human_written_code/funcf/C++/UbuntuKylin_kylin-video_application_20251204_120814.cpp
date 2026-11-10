```cpp
Application::Application(int& argc, char** argv)
    : QCoreApplication(argc, argv)
{
    setOrganizationName("TianJin Kylin");
    setApplicationName("controllertest");
    setApplicationVersion("1.0.0");

    signalM = SignalManager::Instance();
}
```