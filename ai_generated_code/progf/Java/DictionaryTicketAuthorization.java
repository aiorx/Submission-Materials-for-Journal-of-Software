package ticket;

//********************
//WARNING code Assisted with basic coding tools
//prompt
//I need a Java class that solves the problem solved by this class
// ... <follows the JSONTicketAuthorization code>
// BUT given an authorization ticket in a Dictionary implemented with the standard Java libraries
// AND use java.time.DateTime instead of java.time.ZonedDateTime
//

 import java.time.LocalDateTime;
 import java.time.format.DateTimeFormatter;
 import java.time.format.DateTimeParseException;
 import java.util.Map;
 import java.util.logging.Logger;

public class DictionaryTicketAuthorization {
    private static final Logger log = Logger.getLogger(DictionaryTicketAuthorization.class.getName());

    public static boolean validateTicket(Map<String, String> ticketDict) {
        log.info("enter validation ticket");
        try {
            String name = ticketDict.get("name");
            if (name == null) {
                logError("Ticket has no name", ticketDict);
                return false;
            }
            if (name.isEmpty()) {
                logError("Ticket has empty name", ticketDict);
                return false;
            }
            String authorization = ticketDict.get("authorization");
            if (authorization == null) {
                logError("Ticket has no authorization", ticketDict);
                return false;
            }
            if (!authorization.equals("Auth_" + name)) {
                logError("Ticket has bad authorization: name=" + name + ", authorization=" + authorization, ticketDict);
                return false;
            }
        } catch (Exception e) {
            logError("Access error: " + e.getMessage(), ticketDict);
            return false;
        }
        try {
            LocalDateTime startDate = LocalDateTime.parse(ticketDict.get("start_date"), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            LocalDateTime endDate = LocalDateTime.parse(ticketDict.get("end_date"), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            LocalDateTime dateToCheck = LocalDateTime.now();
            if ((dateToCheck.isEqual(startDate) || dateToCheck.isAfter(startDate))
                    && (dateToCheck.isEqual(endDate) || dateToCheck.isBefore(endDate))) {
                log.info("exit successfully");
                return true;
            } else {
                logError("Now is not inside the time range", ticketDict);
                return false;
            }
        } catch (DateTimeParseException e) {
            logError("Invalid date format: " + e.getMessage(), ticketDict);
            return false;
        }
    }

    static void logError(String message, Map<String, String> ticketDict) {
        log.warning(message);
        try {
            log.info("TRACE - Input Map = " + ticketDict.toString());
        } catch (Exception e) {
            log.info("TRACE - Access error: " + e.getMessage());
        }
    }
}
