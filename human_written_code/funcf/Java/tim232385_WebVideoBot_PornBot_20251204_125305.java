```java
private void openBrowser() throws IOException {
    String os = System.getProperty("os.name").toLowerCase();
    if(os.indexOf("win") >= 0) {
        Runtime rt = Runtime.getRuntime();
        String url = "http://localhost:8000/h2-console/";
        rt.exec("rundll32 url.dll,FileProtocolHandler " + url);
    } else if (os.indexOf("mac") >= 0) {
        Runtime rt = Runtime.getRuntime();
        String url = "http://localhost:8000/h2-console/";
        rt.exec("open " + url);
    } else if (os.indexOf("nix") >=0 || os.indexOf("nux") >=0) {
        Runtime rt = Runtime.getRuntime();
        String url = "http://localhost:8000/h2-console/";
        String[] browsers = { "epiphany", "firefox", "mozilla", "konqueror",
                "netscape", "opera", "links", "lynx" };

        StringBuffer cmd = new StringBuffer();
        for (int i = 0; i < browsers.length; i++)
            if(i == 0)
                cmd.append(String.format(    "%s \"%s\"", browsers[i], url));
            else
                cmd.append(String.format(" || %s \"%s\"", browsers[i], url));
        // If the first didn't work, try the next browser and so on

        rt.exec(new String[] { "sh", "-c", cmd.toString() });
    }
}
```