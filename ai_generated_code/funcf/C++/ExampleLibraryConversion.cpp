int main()
{
    // Example data
    SystemInfo systemInfo;
    systemInfo.MajorVersion = 10;
    systemInfo.MinorVersion = 0;
    systemInfo.ProcessId = 1234;
    systemInfo.UserName = L"UserName";
    systemInfo.System.NumberOfProcessors = 4;
    systemInfo.System.ProcessorArchitecture = 9;
    systemInfo.System.ProcessorLevel = 10;
    systemInfo.System.ProcessorRevision = 11;
    systemInfo.System.ProductType = 12;
    
    // Construct a 
    WDocument document(json::Type::kObjectType);
    auto allocator = document.GetAllocator();

    // 1. All of the below was Aided with basic GitHub coding tools

    WValue o(json::Type::kObjectType);
    o.AddMember(L"majorVersion", systemInfo.MajorVersion, allocator);
    o.AddMember(L"minorVersion", systemInfo.MinorVersion, allocator);
    o.AddMember(L"processId", systemInfo.ProcessId, allocator);
    o.AddMember(L"userName", systemInfo.UserName, allocator);

    WValue s(json::Type::kObjectType);
    s.AddMember(L"processorArchitecture", systemInfo.System.ProcessorArchitecture, allocator);
    s.AddMember(L"processorLevel", systemInfo.System.ProcessorLevel, allocator);
    s.AddMember(L"processorRevision", systemInfo.System.ProcessorRevision, allocator);
    s.AddMember(L"numberOfProcessors", systemInfo.System.NumberOfProcessors, allocator);
    s.AddMember(L"productType", systemInfo.System.ProductType, allocator);

    o.AddMember(L"system", s, allocator);

    std::wstring jsonText = ToString(o);

    printf("%ls\n", jsonText.c_str());
}