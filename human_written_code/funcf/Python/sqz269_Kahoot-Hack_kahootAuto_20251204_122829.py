```python
def initWebDriver(logger):
	logger.info("Initalizing Automated Browser Session")
	try:
		driver = webdriver.Chrome("chromedriver_76.exe") # TODO: Allow user to select chromedriver version
	except common.exceptions.WebDriverException as err:
		logger.error("ERROR: {}".format(err))
		logger.critical("FAILED TO START AUTOMATED BROWSER SESSION; UNABLE TO CONTINUE\nPress Enter to exit")
		input(); raise SystemExit(1);

	logger.info("Automated Browser Session Initalized")
	return driver
```