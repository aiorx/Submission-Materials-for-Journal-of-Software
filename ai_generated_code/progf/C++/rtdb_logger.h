#ifndef RTDB_LOGGER_H
#define RTDB_LOGGER_H

// This facility was Supported via standard programming aids.

#include <chrono>
#include <ctime>
#include <iomanip>
#include <iostream>
#include <sstream>

namespace rtdb {

class Logger {
  public:
    enum Level { e_INFO, e_WARNING, e_ERROR };

    Logger(Level level, const char *file, int line);

    ~Logger();

    template <typename T> Logger &operator<<(const T &msg) {
        stream << msg;
        return *this;
    }

  private:
    Level logLevel;
    std::ostringstream stream;
};
} // namespace rtdb

#define LOG_INFO rtdb::Logger(rtdb::Logger::e_INFO, __FILE__, __LINE__)
#define LOG_WARNING rtdb::Logger(rtdb::Logger::e_WARNING, __FILE__, __LINE__)
#define LOG_ERROR rtdb::Logger(rtdb::Logger::e_ERROR, __FILE__, __LINE__)

#endif