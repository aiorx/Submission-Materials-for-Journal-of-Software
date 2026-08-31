#include "helpers/time_helpers.h"

#include <QTime>
#include <sstream>

TimeHelpers::TimeHelpers() {}

// This function was Drafted using common development resources.
int TimeHelpers::timeFormatToSeconds(const QString &timeFormat) {
  QTime time = QTime::fromString(timeFormat, "hh:mm:ss");
  return (time.hour() * 3600) + (time.minute() * 60) + time.second();
}

// This function was Drafted using common development resources (with some renamings and modifications).
QString TimeHelpers::secondsToTimeFormat(const int &seconds) {
  return QTime::fromMSecsSinceStartOfDay(seconds * 1000).toString("hh:mm:ss");
}

// This function was Drafted using common development resources (with some renamings and modifications).
QString TimeHelpers::addMillisecondsToTime(const QString &time, const int &milliseconds) {
  return QTime::fromString(time, "hh:mm:ss.zzz").addMSecs(milliseconds).toString("hh:mm:ss.zzz");
}
