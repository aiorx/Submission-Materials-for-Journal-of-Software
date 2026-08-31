/*********************************************************************
 * \file   kcommonfunction.h
 * \brief  常用函数
 *
 * \author jiang
 * \date   2023.06.01
 *********************************************************************/
#pragma once

#pragma comment(lib, "Advapi32.lib")  // 关键：链接 Advapi32.lib
#include <iostream>
#ifdef _WIN64
#include <windows.h>
#else
#include <unistd.h>
#endif
#include "kfile.h"
#include <iostream>
#include <cstdio>
#include <array>
#include <memory>
#include <stdexcept>
#include <string>
#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#include <iostream>
#include <shellapi.h>
#include <sddl.h>  // For security functions

#ifdef _WIN64
inline string GetProcessName(HMODULE hModule = NULL)
{
    // 获取当前进程句柄
    HANDLE hProcess = GetCurrentProcess();
    // 获取进程名称
    char szProcessName[MAX_PATH];
    GetModuleFileName(hModule, szProcessName, MAX_PATH);
    std::cout << "Process name: " << szProcessName << std::endl;
    string process_name = szProcessName;
    process_name = KFile(process_name).file_name;
    return process_name;
}
#else
inline string  GetProcessName()
{
    // 定义一个字符数组用于存储进程名称
    char szProcessName[1024];

    // 使用readlink函数读取/proc/self/exe符号链接指向的路径
    // 并将该路径作为进程名称返回
    ssize_t count = readlink("/proc/self/exe", szProcessName, sizeof(szProcessName));
    if (count != -1)
    {
        szProcessName[count] = '\0';
        std::cout << "Process name: " << szProcessName << std::endl;
    }
    else
    {
        std::cerr << "Failed to get process name." << std::endl;
    }

    return szProcessName;
}
#endif

/**
 * 小数点精度.
 */
inline double Precision(double value, int precision)
{
    stringstream ss;
    ss << fixed << setprecision(precision) << value;
    return stod(ss.str());
}

inline string Precision(string double_value, int precision)
{ 
    return to_string(Precision(stod(double_value), precision));
}

template <typename T>
inline std::string to_string_with_precision(const T a_value, const int precision = 6)
{
    std::ostringstream out;
    out << std::fixed << std::setprecision(precision) << a_value;
    return out.str();
}

template <typename T>
inline std::string to_string_with_precision(const T a_value, const int precision, const int set)
{
    std::ostringstream out;
    out << std::setprecision(precision) << std::setw(set) << setfill('0') << std::fixed << a_value;
    return out.str();
}

template <typename T>
inline std::string to_string_with_setw(const T a_value, const int set)
{
    std::ostringstream out;
    out << std::setw(set) << std::setfill('0') << std::fixed << a_value;
    return out.str();
}

inline double to_double(const std::string& valueAsString, const int precision = 3, const int set = 6)
{
    istringstream totalSString(valueAsString);
    double valueAsDouble = 0;
    // maybe use some manipulators
    totalSString >> std::setprecision(precision) >> std::setw(set) >> std::fixed >> valueAsDouble;
    if (!totalSString)
        throw std::runtime_error("Error converting to double");
    return valueAsDouble;
}

inline string BytesToString(const std::vector<std::byte>& bytes)
{
    // 输入
#if 0
    std::cout << "Byte array in hex: ";
    for (std::byte b : bytes)
    {
        std::cout << std::hex << std::setw(2) << std::setfill('0') << std::to_integer<int>(b) << " ";
    }
    std::cout << std::endl;
#endif
    // 创建一个 std::vector<std::byte> 并填充一些数据
    //std::vector<std::byte> bytes = {std::byte{0x48}, std::byte{0x65}, std::byte{0x6C}, std::byte{0x6C}, std::byte{0x6F}};  // "Hello" 的 ASCII 值
    // 创建一个 std::string 并将 bytes 转换到字符串
    std::string str;
    str.resize(bytes.size());  // 调整字符串大小以匹配字节数组的大小
    std::transform(bytes.begin(), bytes.end(), str.begin(), [](std::byte b) -> char { return std::to_integer<char>(b); });
    // 输出结果
#if 0
    std::cout << "String: " << str << std::endl;
#endif
    return str;
}

inline std::vector<std::byte> StringToBytes(const string& str)
{
    // 输入
#if 0
    std::cout << "String: " << str << std::endl;
#endif
    // 创建一个 std::string
    //std::string str = "Hello";
    // 创建一个 std::vector<std::byte> 来存储字节数据
    std::vector<std::byte> bytes;
    // 将字符串转换为 std::vector<std::byte>
    bytes.reserve(str.size());  // 预留空间以避免频繁分配内存
    for (char c : str)
    {
        bytes.push_back(std::byte(static_cast<unsigned char>(c)));
    }
    // 输出结果
#if 0
    std::cout << "Byte array in hex: ";
    for (std::byte b : bytes)
    {
        std::cout << std::hex << std::setw(2) << std::setfill('0') << std::to_integer<int>(b) << " ";
    }
    std::cout << std::endl;
#endif
    return bytes;
}

inline string BytesToHexString(const std::vector<std::byte>& bytes)
{
    std::stringstream ss;
    for (std::byte b : bytes)
    {
        ss << std::hex << std::setw(2) << std::setfill('0') << std::to_integer<int>(b) << " ";
    }
#if 0
    std::cout << "Byte array in hex: ";
    std::cout << ss.str();
    std::cout << std::endl;
    std::cout << "String: " << ss.str() << std::endl;
#endif
    return ss.str();
}

inline std::vector<std::byte> HexStringToBytes(const string& hexstr)
{
    std::vector<std::byte> bytes;
    std::stringstream ss(hexstr);
    std::string byteStr;
    while (ss >> byteStr)
    {
        // 将每个两字符的十六进制数转换为 byte
        std::byte byteValue = static_cast<std::byte>(std::stoi(byteStr, nullptr, 16));
        bytes.push_back(byteValue);
    }
#if 0
    std::cout << "String: " << hexstr << std::endl;
    std::cout << "Byte array in hex: ";
    for (std::byte b : bytes)
    {
        std::cout << std::hex << std::setw(2) << std::setfill('0') << std::to_integer<int>(b) << " ";
    }
    std::cout << std::endl;
#endif
    return bytes;
}

inline std::string StringToHexString(const std::string& str)
{
    std::vector<std::byte> bytes = StringToBytes(str);
    std::stringstream ss;
    for (std::byte b : bytes)
    {
        ss << std::hex << std::setw(2) << std::setfill('0') << std::to_integer<int>(b) << " ";
    }
#if 0
    std::cout << "Byte array in hex: ";
    std::cout << ss.str();
    std::cout << std::endl;
    std::cout << "String: " << ss.str() << std::endl;
#endif
    return ss.str();
}

inline string HexStringToString(const string& hexstr)
{
    std::vector<std::byte> bytes;
    std::stringstream ss(hexstr);
    std::string byteStr;
    while (ss >> byteStr)
    {
        // 将每个两字符的十六进制数转换为 byte
        std::byte byteValue = static_cast<std::byte>(std::stoi(byteStr, nullptr, 16));
        bytes.push_back(byteValue);
    }
#if 0
    std::cout << "String: " << hexstr << std::endl;
    std::cout << "Byte array in hex: ";
    for (std::byte b : bytes)
    {
        std::cout << std::hex << std::setw(2) << std::setfill('0') << std::to_integer<int>(b) << " ";
    }
    std::cout << std::endl;
#endif
    string str = BytesToString(bytes);
    return str;
}

inline bool isAlreadyRunning(const std::string& lockfile)
{
    std::lock_guard<std::mutex> lock(std::mutex);  // 确保线程安全
    std::ifstream file(lockfile);
    if (file)
    {
        return true;  // 如果文件存在，表示程序已经启动
    }
    std::ofstream outFile(lockfile);  // 如果文件不存在，创建文件
    return false;
}

inline void cleanup(const std::string& lockfile)
{
    std::remove(lockfile.c_str());  // 程序退出时删除锁文件
}


/// from deepseek begin
inline std::string execCmd(const char* cmd)
{
    std::array<char, 128> buffer;
    std::string result;
    std::unique_ptr<FILE, decltype(&_pclose)> pipe(_popen(cmd, "r"), _pclose);
    if (!pipe) {
        throw std::runtime_error("popen() failed!");
    }
    while (fgets(buffer.data(), buffer.size(), pipe.get()) != nullptr) {
        result += buffer.data();
    }
    return result;
}

#if 0
std::string exec(const char* cmd) {
    std::array<char, 128> buffer;
    std::string result;
    std::unique_ptr<FILE, decltype(&pclose)> pipe(popen(cmd, "r"), pclose);
    if (!pipe) {
        throw std::runtime_error("popen() failed!");
    }
    while (fgets(buffer.data(), buffer.size(), pipe.get()) != nullptr) {
        result += buffer.data();
    }
    return result;
}

int main() {
    try {
        // 替换为你的BAT脚本路径
        std::string output = exec("path/to/your/script.bat");
        std::cout << "Output:\n" << output << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
    return 0;
}
#endif


// 读取进程的输出
inline std::string ReadOutputFromPipe(HANDLE hReadPipe)
{
    std::string output;
    constexpr DWORD BUFFER_SIZE = 4096;
    char buffer[BUFFER_SIZE];
    DWORD bytesRead;

    while (true) {
        // 从管道读取数据
        BOOL success = ReadFile(hReadPipe, buffer, BUFFER_SIZE - 1, &bytesRead, nullptr);
        if (!success || bytesRead == 0) {
            break; // 读取完成或出错
        }
        buffer[bytesRead] = '\0'; // 添加字符串结束符
        output += buffer;
    }

    return output;
}

// 执行 BAT 脚本并获取输出
inline std::string ExecuteBatScript(const std::string& batFilePath)
{
    // 定义安全属性，允许管道句柄被子进程继承
    SECURITY_ATTRIBUTES sa;
    sa.nLength = sizeof(SECURITY_ATTRIBUTES);
    sa.bInheritHandle = TRUE;
    sa.lpSecurityDescriptor = nullptr;

    // 创建管道
    HANDLE hReadPipe, hWritePipe;
    if (!CreatePipe(&hReadPipe, &hWritePipe, &sa, 0)) {
        throw std::runtime_error("Failed to create pipe!");
    }

    // 设置标准输出的写端
    STARTUPINFOA si;
    PROCESS_INFORMATION pi;
    ZeroMemory(&si, sizeof(si));
    si.cb = sizeof(si);
    si.dwFlags = STARTF_USESTDHANDLES;
    si.hStdOutput = hWritePipe;
    si.hStdError = hWritePipe; // 捕获错误输出
    si.hStdInput = GetStdHandle(STD_INPUT_HANDLE); // 使用父进程的标准输入

    ZeroMemory(&pi, sizeof(pi));

    // 创建进程
    if (!CreateProcessA(
            nullptr,                   // 不指定模块名，使用命令行
            const_cast<LPSTR>(batFilePath.c_str()), // BAT 文件路径
            nullptr,                   // 进程句柄不可继承
            nullptr,                   // 线程句柄不可继承
            TRUE,                      // 继承句柄
            0,                         // 无特殊标志
            nullptr,                   // 使用父进程环境变量
            nullptr,                   // 使用父进程工作目录
            &si,                       // 启动信息
            &pi                        // 进程信息
            )) {
        CloseHandle(hReadPipe);
        CloseHandle(hWritePipe);
        throw std::runtime_error("Failed to create process!");
    }

    // 关闭管道的写端，避免阻塞
    CloseHandle(hWritePipe);

    // 读取输出
    std::string output = ReadOutputFromPipe(hReadPipe);

    // 等待进程结束
    WaitForSingleObject(pi.hProcess, INFINITE);

    // 关闭句柄
    CloseHandle(hReadPipe);
    CloseHandle(pi.hProcess);
    CloseHandle(pi.hThread);

    return output;
}

#if 0
int main() {
    try {
        // 替换为你的 BAT 文件路径
        std::string batFilePath = R"(C:\path\to\your\script.bat)";
        std::string output = ExecuteBatScript(batFilePath);
        std::cout << "Output:\n" << output << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
    return 0;
}
#endif
/// from deepseek endif

/// Adapted from standard coding samples begin
inline std::string runBatchFile(const std::string& batFile) {
    // 使用 _popen 执行批处理文件并读取其输出
    std::string result;
    char buffer[128];
    FILE* fp = _popen(("cmd.exe /C " + batFile).c_str(), "r");

    if (fp == nullptr) {
        std::cerr << "Failed to open process!" << std::endl;
        return "";
    }

    // 读取命令输出
    while (fgets(buffer, sizeof(buffer), fp) != nullptr) {
        result += buffer;
    }

    // 关闭文件流
    fclose(fp);

    return result;
}

#if 0
int main() {
    std::string batFile = "scan_wifi.bat"; // 批处理文件路径
    std::string output = runBatchFile(batFile);

    std::cout << "Batch file output:\n" << output << std::endl;

    return 0;
}
#endif



inline std::string runBatchFile1(const std::string& batFile) {
    // 创建管道用于读取标准输出
    SECURITY_ATTRIBUTES sa;
    sa.nLength = sizeof(SECURITY_ATTRIBUTES);
    sa.bInheritHandle = TRUE;
    sa.lpSecurityDescriptor = NULL;

    HANDLE hReadPipe, hWritePipe;
    if (!CreatePipe(&hReadPipe, &hWritePipe, &sa, 0)) {
        std::cerr << "CreatePipe failed!" << std::endl;
        return "";
    }

    // 设置启动信息
    STARTUPINFO si;
    ZeroMemory(&si, sizeof(STARTUPINFO));
    si.cb = sizeof(STARTUPINFO);
    si.hStdOutput = hWritePipe;
    si.hStdError = hWritePipe;
    si.dwFlags = STARTF_USESTDHANDLES;

    PROCESS_INFORMATION pi;
    ZeroMemory(&pi, sizeof(PROCESS_INFORMATION));

    // 创建子进程
    std::string command = "cmd.exe /C " + batFile;
    if (!CreateProcess(NULL, const_cast<LPSTR>(command.c_str()), NULL, NULL, TRUE, 0, NULL, NULL, &si, &pi)) {
        std::cerr << "CreateProcess failed!" << std::endl;
        CloseHandle(hReadPipe);
        CloseHandle(hWritePipe);
        return "";
    }

    // 关闭写端
    CloseHandle(hWritePipe);

    // 读取输出
    char buffer[4096];
    DWORD bytesRead;
    std::string result;
    while (ReadFile(hReadPipe, buffer, sizeof(buffer), &bytesRead, NULL) && bytesRead > 0) {
        result.append(buffer, bytesRead);
    }

    // 等待子进程结束
    WaitForSingleObject(pi.hProcess, INFINITE);

    // 关闭句柄
    CloseHandle(hReadPipe);
    CloseHandle(pi.hProcess);
    CloseHandle(pi.hThread);

    return result;
}

#if 0
int main() {
    std::string batFile = "scan_wifi.bat"; // 批处理文件路径
    std::string output = runBatchFile(batFile);

    std::cout << "Batch file output:\n" << output << std::endl;

    return 0;
}
#endif
/// Adapted from standard coding samples end

/// from deepseek begin
inline bool IsRunAsAdmin() {
    BOOL isAdmin = FALSE;
    PSID adminGroupSid = NULL;

    // 创建管理员组的 SID
    SID_IDENTIFIER_AUTHORITY NtAuthority = SECURITY_NT_AUTHORITY;
    if (!AllocateAndInitializeSid(
            &NtAuthority, 2,
            SECURITY_BUILTIN_DOMAIN_RID,
            DOMAIN_ALIAS_RID_ADMINS,
            0, 0, 0, 0, 0, 0,
            &adminGroupSid)) {
        return false;
    }

    // 检查当前进程令牌是否属于管理员组
    CheckTokenMembership(NULL, adminGroupSid, &isAdmin);
    FreeSid(adminGroupSid);
    return isAdmin == TRUE;
}

inline void RestartAsAdmin() {
    CHAR szPath[MAX_PATH];
    GetModuleFileName(NULL, szPath, MAX_PATH); // 获取当前程序路径

    SHELLEXECUTEINFO sei = { sizeof(sei) };
    sei.lpVerb = "runas";          // 关键参数：请求管理员权限
    sei.lpFile = szPath;            // 程序路径
    sei.nShow = SW_SHOWNORMAL;      // 显示模式

    if (!ShellExecuteEx(&sei)) {
        DWORD err = GetLastError();
        if (err == ERROR_CANCELLED) {
            MessageBox(NULL, "用户拒绝了管理员权限请求！", "错误", MB_ICONERROR);
        } else {
            MessageBox(NULL, "提权启动失败！", "错误", MB_ICONERROR);
        }
        ExitProcess(1);             // 提权失败则退出
    }
    ExitProcess(0);                 // 原进程退出，等待新进程启动
}
#if 0
#include <windows.h>
#include <shellapi.h>
#include <sddl.h>  // For security functions

bool IsRunAsAdmin() {
    BOOL isAdmin = FALSE;
    PSID adminGroupSid = NULL;

    SID_IDENTIFIER_AUTHORITY NtAuthority = SECURITY_NT_AUTHORITY;
    if (!AllocateAndInitializeSid(
            &NtAuthority, 2,
            SECURITY_BUILTIN_DOMAIN_RID,
            DOMAIN_ALIAS_RID_ADMINS,
            0, 0, 0, 0, 0, 0,
            &adminGroupSid)) {
        return false;
    }

    CheckTokenMembership(NULL, adminGroupSid, &isAdmin);
    FreeSid(adminGroupSid);
    return isAdmin == TRUE;
}

void RestartAsAdmin() {
    WCHAR szPath[MAX_PATH];
    GetModuleFileNameW(NULL, szPath, MAX_PATH);

    SHELLEXECUTEINFO sei = { sizeof(sei) };
    sei.lpVerb = L"runas";
    sei.lpFile = szPath;
    sei.nShow = SW_SHOWNORMAL;

    if (!ShellExecuteExW(&sei)) {
        DWORD err = GetLastError();
        if (err == ERROR_CANCELLED) {
            MessageBoxW(NULL, L"用户拒绝了管理员权限请求！", L"错误", MB_ICONERROR);
        } else {
            MessageBoxW(NULL, L"提权启动失败！", L"错误", MB_ICONERROR);
        }
        ExitProcess(1);
    }
    ExitProcess(0);
}

int main() {
    if (!IsRunAsAdmin()) {
        RestartAsAdmin();
        return 0;
    }

    // 主逻辑（管理员权限下执行）
    MessageBoxW(NULL, L"程序已以管理员权限运行！", L"提示", MB_OK);
    return 0;
}
#endif
/// from deepseek end
