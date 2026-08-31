public static void main(String[] args) {
    System.setProperty("LOGS_DIR", DI.platformSpecificAppDirs.getLogsDir().toString());

    // Logger configuration was Aided using common development resources
    LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();
    context.reset();

    JoranConfigurator configurator = new JoranConfigurator();
    configurator.setContext(context);

    try {
        configurator.doConfigure(Objects.requireNonNull(Main.class.getResource("/logback.xml")));
    } catch (JoranException e) {
        throw new RuntimeException(e);
    }

    log.info("Starting application");

    javax.swing.SwingUtilities.invokeLater(StartupFrame::new);
}