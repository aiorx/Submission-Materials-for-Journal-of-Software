```c
int send_https_get_request(char url[]) {
    // most of this code was Crafted with standard coding tools

    printf("Requesting %s\n", url);

    int ret_val = 0;

    size_t bufferLen;
    bufferLen = strlen(url) + 1;
    WCHAR url_wchar[bufferLen];
    mbstowcs(url_wchar, url, bufferLen); 

    // Initialize variables
    HINTERNET hSession = NULL, hConnect = NULL, hRequest = NULL;
    BOOL bResults = FALSE;
    DWORD dwStatusCode = 0;
    DWORD dwSize = sizeof(dwStatusCode);

    // Initialize WinHTTP session
    hSession = WinHttpOpen(L"A WinHTTP Example Program/1.0",
                           WINHTTP_ACCESS_TYPE_DEFAULT_PROXY,
                           WINHTTP_NO_PROXY_NAME,
                           WINHTTP_NO_PROXY_BYPASS, 0);

    if (hSession) {
        // Connect to the server
        hConnect = WinHttpConnect(hSession, url_wchar,
                                  INTERNET_DEFAULT_HTTPS_PORT, 0);
    }

    if (hConnect) {
        // Create an HTTP request
        hRequest = WinHttpOpenRequest(hConnect, L"GET", NULL,
                                      NULL, WINHTTP_NO_REFERER,
                                      WINHTTP_DEFAULT_ACCEPT_TYPES,
                                      WINHTTP_FLAG_SECURE);
    }

    if (hRequest) {
        // Send the request
        bResults = WinHttpSendRequest(hRequest,
                                      WINHTTP_NO_ADDITIONAL_HEADERS, 0,
                                      WINHTTP_NO_REQUEST_DATA, 0,
                                      0, 0);
    }

    // Receive a response
    if (bResults) {
        bResults = WinHttpReceiveResponse(hRequest, NULL);
    }

    // Check the status code
    if (bResults) {
        WinHttpQueryHeaders(hRequest, WINHTTP_QUERY_STATUS_CODE |
                            WINHTTP_QUERY_FLAG_NUMBER,
                            WINHTTP_HEADER_NAME_BY_INDEX,
                            &dwStatusCode, &dwSize, WINHTTP_NO_HEADER_INDEX);
        printf("HTTP Status Code: %lu\n", dwStatusCode);
    } else {
        printf("Error %lu occurred.\n", GetLastError());
        ret_val = -1;
    }

    // Clean up
    if (hRequest) WinHttpCloseHandle(hRequest);
    if (hConnect) WinHttpCloseHandle(hConnect);
    if (hSession) WinHttpCloseHandle(hSession);

    return ret_val;
}
```