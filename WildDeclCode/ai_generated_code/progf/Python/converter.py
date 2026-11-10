import math

from pypdf import PdfReader, PdfWriter, PageObject


# function Designed via basic programming aids
def merge_pages(input_pdf_path, output_pdf_path, pages_per_sheet):
    """

    :param input_pdf_path:
    :param output_pdf_path:
    :param pages_per_sheet:
    :return:
    """

    reader = PdfReader(input_pdf_path)
    writer = PdfWriter()

    num_pages = len(reader.pages)
    total_sheets = math.ceil(num_pages / pages_per_sheet)

    # Calculate grid size (number of rows and columns)
    cols = math.ceil(math.sqrt(pages_per_sheet))
    rows = math.ceil(pages_per_sheet / cols)

    # Assuming all pages are the same size
    page_width = reader.pages[0].mediabox.width
    page_height = reader.pages[0].mediabox.height

    new_width = page_width * cols
    new_height = page_height * rows

    for sheet_num in range(total_sheets):
        # Create a new blank page
        new_page = PageObject.create_blank_page(
            width=new_width, height=new_height
        )

        for i in range(pages_per_sheet):
            page_index = sheet_num * pages_per_sheet + i
            if page_index >= num_pages:
                break  # No more pages to process

            page = reader.pages[page_index]

            # Calculate position in the grid
            row = i // cols
            col = i % cols

            # Calculate translation values
            tx = col * page_width
            ty = new_height - (row + 1) * page_height  # PDF coordinate system origin is at bottom-left

            # Merge the page onto the new page
            new_page.merge_translated_page(page, tx=tx, ty=ty)

        # Add the merged page to the writer
        writer.add_page(new_page)

    # Write the output PDF
    with open(output_pdf_path, 'wb') as output_file:
        writer.write(output_file)


if __name__ == '__main__':
    input_pdf = 'download/20190327 妙法蓮華經-譬喻說(四)--20190327.pdf'
    output_pdf = 'download/output.pdf'
    pages_per_sheet = 4
    merge_pages(input_pdf, output_pdf, pages_per_sheet)
