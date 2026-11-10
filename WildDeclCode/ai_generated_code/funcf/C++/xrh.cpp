// Aided with basic GitHub coding tools
std::string ToString(XrSessionState sessionState) {
  switch (sessionState) {
    case XR_SESSION_STATE_UNKNOWN:
      return "UNKNOWN";
    case XR_SESSION_STATE_IDLE:
      return "IDLE";
    case XR_SESSION_STATE_READY:
      return "READY";
    case XR_SESSION_STATE_SYNCHRONIZED:
      return "SYNCHRONIZED";
    case XR_SESSION_STATE_VISIBLE:
      return "VISIBLE";
    case XR_SESSION_STATE_FOCUSED:
      return "FOCUSED";
    case XR_SESSION_STATE_STOPPING:
      return "STOPPING";
    case XR_SESSION_STATE_LOSS_PENDING:
      return "LOSS_PENDING";
    case XR_SESSION_STATE_EXITING:
      return "EXITING";
    default:
      return "<unknown>";
  }
}