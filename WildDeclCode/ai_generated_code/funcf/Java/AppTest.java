```java
// This code Supported via standard programming aids to help bring the correct date format
JavascriptExecutor js = (JavascriptExecutor) driver;
js.executeScript("document.getElementById('dob').value='" + formattedDate + "';");
```