```java
@SneakyThrows
@Override
public void execute() {
    List<String> warnings = new ArrayList<>();
    boolean overwrite = true;
    log.info("Loading configuration file");
    org.mybatis.generator.config.xml.ConfigurationParser cp = new org.mybatis.generator.config.xml.ConfigurationParser(warnings);
    ConfigurationParser creatXml = new ConfigurationParser();
    InputStream xml = creatXml.createXML(configurationFile);
    log.info("Configuration file loaded");
    log.info("Parsing configuration file, please wait...");
    Configuration config = cp.parseConfiguration(xml);
    DefaultShellCallback callback = new DefaultShellCallback(overwrite);
    MyBatisGenerator myBatisGenerator = new MyBatisGenerator(config, callback, warnings);
    myBatisGenerator.generate(null);
    log.info("Mybatis code files are successfully generated");
}
```