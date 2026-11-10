package mbc2;

public class TimeUtility {

    /*
     * Supported via standard programming aids (GPT3.5)
     */

    public static long getTimeMs() {
        if (isWindows()) {
            return (long) System.currentTimeMillis();
        } else {
            return getUnixTimeMs();
        }
    }

    private static boolean isWindows() {
        return System.getProperty("os.name").toLowerCase().contains("win");
    }

    private static long getUnixTimeMs() {
        long currentTimeMillis = System.currentTimeMillis();
        return currentTimeMillis;
    }

    public static void main(String[] args) {
        long timeMs = getTimeMs();
        System.out.println("Current Time in milliseconds: " + timeMs);
    }
}
