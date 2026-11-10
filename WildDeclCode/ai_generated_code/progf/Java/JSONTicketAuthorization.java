package ticket;

//********************
//WARNING code Supported via standard programming aids
//prompt
//I need a Java class that reads a Json to solve this problem.
//Given an  authorization ticket JSON that contains the name of the user,
//a range of start and finish dates and time, and an authorization string,
//I need a Java method that verifies if the actual date and time is in
//the range and the name of the user corresponds to the authorization string.
//
// then modified by Roberto : added the checks for existence of the filed
//  and the logging of the exits "false"
//
import org.json.JSONObject;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.logging.Logger;

public class JSONTicketAuthorization {
    private static final Logger log =  Logger.getLogger(JSONTicketAuthorization.class.getName());

    public static boolean validateTicket(JSONObject ticketJson) {
        log.info("enter validation ticket");
        try {
            String name = ticketJson.getString("name");
            if (name == null ) {
                logError("Ticket has no name", ticketJson);
                return false;
            }
            if (name.isEmpty()) {
                logError("Ticket has empty name", ticketJson);
                return false;
            }
            String authorization = ticketJson.getString("authorization");
            if (authorization == null) {
                logError("Ticket has no authorization", ticketJson);
                return false;
            }
            if (!authorization.equals("Auth_" + name)) {
                logError("Ticket has bad authorization: name=" + name + ", authorization="+ authorization, ticketJson);
                return false;
            }

        } catch (org.json.JSONException e) {
            log.warning("JSON access error :" + e.getMessage());
            return false;
        }
        try {
            ZonedDateTime startDate = ZonedDateTime.parse(ticketJson.getString("start_date"), DateTimeFormatter.ISO_ZONED_DATE_TIME);
            ZonedDateTime endDate = ZonedDateTime.parse(ticketJson.getString("end_date"), DateTimeFormatter.ISO_ZONED_DATE_TIME);
            ZonedDateTime dateToCheck = ZonedDateTime.now();
            if ( (dateToCheck.isEqual(startDate) || dateToCheck.isAfter(startDate))
                    && (dateToCheck.isEqual(endDate) || dateToCheck.isBefore(endDate)) ) {
                log.info("exit successfully");
                return true;
            } else {
                logError("Now is not inside the time range", ticketJson);
                return false;
            }

        } catch (org.json.JSONException e) {
            log.warning("JSON access error : " + e.getMessage());
            return false;
        } catch (DateTimeParseException e) {
            logError("Invalid date format: " + e.getMessage(), ticketJson);
            return false;
        }
    }

    static void logError(String message, JSONObject ticketJson ) {
        log.warning(message);
        try {
            log.info("TRACE - Input JSON = " +  ticketJson.toString() );
        } catch (org.json.JSONException e) {
            log.info("TRACE - JSON access error : " + e.getMessage());
        }
    }
}
