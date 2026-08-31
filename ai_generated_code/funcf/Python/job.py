```python
def generatePDF(self, selected_rows, wage):
    # Create a PDF document
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    
    # Set font
    pdf.set_font("Arial", size=12)

    # Add a title
    pdf.cell(200, 10, txt="Selected Rows from Google Sheets", ln=True, align='C')
    pdf.ln(10)  # Line break
    
    # Add table header (you can customize this)
    headers = ["Start", "End", "Total Time"]
    for header in headers:
        pdf.cell(50, 10, txt=header, border=1)
    pdf.ln()  # New line for table
    total_hours = 0
    total_minutes = 0
    # Add rows to the PDF
    for row in selected_rows:
        for index, cell in enumerate(row):
            pdf.cell(50, 10, txt=str(cell), border=1)
            if index == len(row) - 1:
                hours, minutes = str(cell).split(":")
                total_hours += int(hours)
                total_minutes += int(minutes)
        pdf.ln()
    
    pdf.cell(50, 10, txt="", border=1)
    pdf.cell(50, 10, txt="Total", border=1)
    total_hours += total_minutes//60
    total_minutes %= 60
    pdf.cell(50, 10, txt=str(total_hours) + ":" + str(f"{total_minutes:02}"), border=1)
    pdf.ln()
    pdf.cell(50, 10, txt="", border=1)
    pdf.cell(50, 10, txt="Wage", border=1)
    pdf.cell(50, 10, txt=str(wage), border=1)
    pdf.ln()
    pdf.cell(50, 10, txt="", border=1)
    pdf.cell(50, 10, txt="Total Wage", border=1)
    
    total_wage = total_hours * wage + total_minutes/60 * wage
    formatted_wage = f"{total_wage:.2f}"
    pdf.cell(50, 10, txt=str(formatted_wage), border=1)
    
    # Save the PDF to a file
    pdf_output = "output.pdf"
    pdf.output(pdf_output)
```