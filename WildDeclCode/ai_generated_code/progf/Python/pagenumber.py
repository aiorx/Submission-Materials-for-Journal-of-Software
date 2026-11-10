# Drafted using common development resources

import fitz  # PyMuPDF
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
import os

def create_page_number_canvas(page_count, tmp_pdf_path, page_width, page_height, start_page_number):
    c = canvas.Canvas(tmp_pdf_path, pagesize=(page_width, page_height))
    
    for i in range(page_count):
        page_number = str(start_page_number + i)
        
        # Get the size of the text
        text_width = c.stringWidth(page_number, "Helvetica", 14)

        # Calculate the position
        x = page_width - text_width -1.2 * inch
        y = 0.5 * inch

        # Draw the white rectangle
        c.setFillColor(colors.white)
        c.rect(x - 5, y - 5, text_width + 10, 14 + 10, fill=1, stroke=0)
        
        # Draw the text
        c.setFont("Helvetica", 14)
        c.setFillColor(colors.black)
        c.drawString(x, y, page_number)
        
        c.showPage()
    c.save()

def add_page_numbers_to_pdf(input_pdf_path, output_pdf_path, start_page_number):
    doc = fitz.open(input_pdf_path)
    page_count = doc.page_count

    # Get the size of the first page
    first_page = doc.load_page(0)
    page_width = first_page.rect.width
    page_height = first_page.rect.height

    tmp_pdf_path = "tmp_page_numbers.pdf"
    create_page_number_canvas(page_count, tmp_pdf_path, page_width, page_height, start_page_number)

    tmp_pdf = fitz.open(tmp_pdf_path)
    for i in range(page_count):
        page = doc.load_page(i)
        tmp_page = tmp_pdf.load_page(i)
        
        # Overlay the page number
        page.show_pdf_page(fitz.Rect(0, 0, page.rect.width, page.rect.height), tmp_pdf, i)
    
    doc.save(output_pdf_path)
    doc.close()
    tmp_pdf.close()

def flatten_pdf(input_pdf_path, flattened_pdf_path):
    doc = fitz.open(input_pdf_path)
    for page in doc:
        page.clean_contents()  # Remove unsupported annotations
    doc.save(flattened_pdf_path)
    doc.close()

def process_all_pdfs_in_directory():
    input_directory = "."
    output_directory = "output"
    
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    for filename in os.listdir(input_directory):
        if filename.endswith(".pdf"):
            input_pdf_path = os.path.join(input_directory, filename)
            flattened_pdf_path = os.path.join(output_directory, "flattened_" + filename)
            output_pdf_path = os.path.join(output_directory, filename)
            
            # Ask user for the start page number
            start_page_number = int(input(f"Enter the start page number for {filename}: "))
            
            # Flatten the PDF to remove unsupported annotations
            flatten_pdf(input_pdf_path, flattened_pdf_path)
            
            # Add page numbers to the flattened PDF
            add_page_numbers_to_pdf(flattened_pdf_path, output_pdf_path, start_page_number)
            
            # Remove the flattened temporary PDF
            os.remove(flattened_pdf_path)
            
            print(f"Processed {filename}")

# Process all PDFs in the current directory
process_all_pdfs_in_directory()
