/*
Ts code was entireley Penned via standard programming aids
Cuz I had no fucking clue how to do ts updating typeshit
Ts code is part of da ThreadAssassin project
Thx GPT
*/

#include <stdio.h>
#include <string.h>
#include <windows.h>
#include <winhttp.h>
#include <stdbool.h>

#pragma comment(lib, "winhttp.lib")

bool STATE;

int check_for_update(float *version) {
    HINTERNET hSession = NULL, hConnect = NULL, hRequest = NULL;
    BOOL bResults = FALSE;
    DWORD dwSize = 0;
    DWORD dwDownloaded = 0;
    char response[128] = {0};
    BOOL success = FALSE;

    hSession = WinHttpOpen(L"UpdateChecker/1.0", WINHTTP_ACCESS_TYPE_DEFAULT_PROXY, WINHTTP_NO_PROXY_NAME, WINHTTP_NO_PROXY_BYPASS, 0);
    if (!hSession) {
        fprintf(stderr, "WinHttpOpen failed\n");
        return 0;
    }

    hConnect = WinHttpConnect(hSession, L"raw.githubusercontent.com", INTERNET_DEFAULT_HTTPS_PORT, 0);
    if (!hConnect) {
        fprintf(stderr, "WinHttpConnect failed\n");
        WinHttpCloseHandle(hSession);
        return 0;
    }

    hRequest = WinHttpOpenRequest(hConnect, L"GET", L"/NoOneIsHereFr/ThreadAssassin/refs/heads/main/version", NULL, WINHTTP_NO_REFERER, WINHTTP_DEFAULT_ACCEPT_TYPES, WINHTTP_FLAG_SECURE);
    if (!hRequest) {
        fprintf(stderr, "WinHttpOpenRequest failed\n");
        WinHttpCloseHandle(hConnect);
        WinHttpCloseHandle(hSession);
        return 0;
    }

    bResults = WinHttpSendRequest(hRequest, WINHTTP_NO_ADDITIONAL_HEADERS, 0, WINHTTP_NO_REQUEST_DATA, 0, 0, 0);
    if (!bResults) {
        fprintf(stderr, "WinHttpSendRequest failed\n");
        WinHttpCloseHandle(hRequest);
        WinHttpCloseHandle(hConnect);
        WinHttpCloseHandle(hSession);
        return 0;
    }

    bResults = WinHttpReceiveResponse(hRequest, NULL);
    if (!bResults) {
        fprintf(stderr, "WinHttpReceiveResponse failed\n");
        WinHttpCloseHandle(hRequest);
        WinHttpCloseHandle(hConnect);
        WinHttpCloseHandle(hSession);
        return 0;
    }

    do {
        dwSize = 0;
        if (!WinHttpQueryDataAvailable(hRequest, &dwSize)) {
            fprintf(stderr, "WinHttpQueryDataAvailable failed\n");
            break;
        }

        if (dwSize == 0)
            break;

        if (!WinHttpReadData(hRequest, response, dwSize, &dwDownloaded)) {
            fprintf(stderr, "WinHttpReadData failed\n");
            break;
        }

        response[dwDownloaded] = '\0';
    } while (dwSize > 0);

    float latest_version = atof(response);
    if (latest_version != *version) {
        STATE = TRUE;
        success = TRUE;
    }

    WinHttpCloseHandle(hRequest);
    WinHttpCloseHandle(hConnect);
    WinHttpCloseHandle(hSession);

    return success;
}