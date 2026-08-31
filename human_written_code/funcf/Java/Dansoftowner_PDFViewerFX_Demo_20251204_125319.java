```java
private void loadPDF(PDFDisplayer pdfDisplayer) {
    try {
        pdfDisplayer.loadPDF(new URL("https://www.tutorialspoint.com/jdbc/jdbc_tutorial.pdf"));
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```