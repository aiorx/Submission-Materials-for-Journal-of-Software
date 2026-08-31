# import sys
# import traceback
# from datetime import datetime
# import logging
# import json
# import uuid
# import csv
# import time
# import boto3
# import os
# import io
# import re
# from urllib.parse import unquote_plus
# from collections import defaultdict

# logger = logging.getLogger()
# logger.setLevel(logging.INFO)
# textract = boto3.client("textract")
# s3 = boto3.client("s3")

# def convert_to_standard_date(date_str):
#     date_patterns = [ #chatGPT Generated
#         (re.compile(r"(\d{2}/\d{2}/\d{2})"), "%y/%m/%d"),  # YY/MM/DD 
#         (re.compile(r"(\d{1,2}/\d{1,2}/\d{2})"), "%m/%d/%y"),  # MM/DD/YY or M/D/YY
#         (re.compile(r"(\d{4}/\d{1,2}/\d{1,2})"), "%Y/%m/%d"),  # YYYY/MM/DD or YYYY/M/D
#         (re.compile(r"(\d{1,2}-\d{1,2}-\d{4})"), "%d-%m-%Y"),  # DD-MM-YYYY or D-M-YYYY
#         (re.compile(r"(\d{1,2}\.\d{1,2}\.\d{4})"), "%d.%m.%Y"),  # DD.MM.YYYY or D.M.YYYY
#         (re.compile(r"(\d{1,2}/\d{1,2}/\d{4})"), "%m/%d/%Y"),  # MM/DD/YYYY or M/D/YYYY
#         (re.compile(r"(\d{4}-\d{1,2}-\d{1,2})"), "%Y-%m-%d")  # YYYY-MM-DD
#     ]

#     for pattern, date_format in date_patterns:
#         match = pattern.search(date_str)
#         if match:
#             return datetime.strptime(match.group(), date_format).strftime("%Y-%m-%d")

#     raise ValueError(f"Unsupported date format: {date_str}")

# def convert_to_standard_time(time_str):
#     time_patterns = [ #chat GPT generated regex
#         (re.compile(r"(\d{1,2}:\d{2}\s?[APap][Mm])"), "%I:%M %p"),  # HH:MM AM/PM (Handles "10:30 AM", "7:45PM")
#         (re.compile(r"(\d{2}:\d{2}:\d{2})"), "%H:%M:%S"),  # HH:MM:SS (24-hour format)
#         (re.compile(r"(\d{1,2}:\d{2})"), "%H:%M"),  # H:MM or HH:MM (24-hour format)
#     ]

#     for pattern, time_format in time_patterns:
#         match = pattern.search(time_str)
#         if match:
#             return datetime.strptime(match.group(), time_format).strftime("%H:%M:%S")

#     raise ValueError(f"Unsupported time format: {time_str}")

# def filter_out_numbers(value):# GPT Generated
#     return re.sub(r'\d+', '', value) 

# def convert_to_numeric(value):# GPT Generated
#     match = re.search(r'\d+(\.\d+)?', value)  
#     return float(match.group()) if match else 0

# def extract_tables_from_textract(textract_response):
#     tables = []
#     blocks = {block['Id']: block for block in textract_response['Blocks']}
    
#     for block in textract_response['Blocks']:
#         if block['BlockType'] == 'TABLE':
#             table = []
#             cell_map = {}
            
#             for relationship in block.get('Relationships', []):
#                 if relationship['Type'] == 'CHILD':
#                     for child_id in relationship['Ids']:
#                         cell = blocks[child_id]
#                         if cell['BlockType'] == 'CELL':
#                             row_index = cell['RowIndex']
#                             col_index = cell['ColumnIndex']
#                             text = ''
                            
#                             for cell_rel in cell.get('Relationships', []):
#                                 if cell_rel['Type'] == 'CHILD':
#                                     text = ' '.join(
#                                         [blocks[text_id]['Text'] for text_id in cell_rel['Ids'] if blocks[text_id]['BlockType'] == 'WORD']
#                                     )
                            
#                             if row_index not in cell_map:
#                                 cell_map[row_index] = {}
#                             cell_map[row_index][col_index] = text
            
#             for row in sorted(cell_map.keys()):
#                 table.append([cell_map[row].get(col, '') for col in sorted(cell_map[row].keys())])
            
#             tables.append(table)
    
#     return tables

# def unit_conversion(lst):
#     for i in range(len(lst)):
#         if "lb" in lst[i][4]:
#             lst[i][3] = lst[i][3] / 2.205
#         elif "oz" in lst[i][4]:
#             lst[i][3] = lst[i][3] * 28.34952
#     return lst

# def merge_duplicates(lst):
#     unique_items = {}
#     for item in lst:
#         key = tuple(item[:2] + item[3:])  # Exclude the count at index 2
#         if key in unique_items:
#             unique_items[key][2] += item[2]  # Increment count
#         else:
#             unique_items[key] = item[:]  # Copy original item

#     return list(unique_items.values())

# def process_error() -> dict:
#     ex_type, ex_value, ex_traceback = sys.exc_info()
#     traceback_string = traceback.format_exception(ex_type, ex_value, ex_traceback)
#     error_msg = json.dumps(
#         {
#             "errorType": ex_type.__name__,
#             "errorMessage": str(ex_value),
#             "stackTrace": traceback_string,
#         }
#     )
#     return error_msg

# def extract_text(response: dict, extract_by="LINE") -> list:
#     text = []
#     for block in response["Blocks"]:
#         if block["BlockType"] == extract_by:
#             text.append(block["Text"])
#     return text

# def get_full_ocr_results(job_id):
#     """Retrieve full OCR results, handling pagination."""
#     pages = []
#     next_token = None

#     while True:
#         if next_token:
#             response = textract.get_document_text_detection(JobId=job_id, NextToken=next_token)
#         else:
#             response = textract.get_document_text_detection(JobId=job_id)

#         pages.extend(response.get("Blocks", []))

#         next_token = response.get("NextToken")
#         if not next_token:
#             break  # No more pages

#     return {"Blocks": pages}

# def parse_receipt_data(raw_data):
    
#     #Store name
#     store_name = raw_data[0] 

#     as_string = " ".join(raw_data)
#     if "Sysco" in as_string:
#         store_name = "Sysco"
#     elif "Costco" in as_string:
#         store_name = "Costco"
#     elif "Walmart" in as_string:
#         store_name = "Walmart"
#     elif "GFS" in as_string:
#         store_name = "GFS"
#     elif "T&T" in as_string:
#         store_name = "T&T"
#     elif "GFS" in as_string:
#         store_name = "GFS"
    
#     #Regex Designed via basic programming aids
#     date_time_patterns = [
#         re.compile(r"(\d{2}/\d{2}/\d{2})\s(\d{2}[: ]\d{2}[apmAPM]{2})"),  # MM/DD/YY HH:MM AM/PM
#         re.compile(r"(\d{4}/\d{2}/\d{2})\s(\d{2}:\d{2}:\d{2})"),  # YYYY/MM/DD HH:MM:SS
#         re.compile(r"(\d{2}-\d{2}-\d{4})\s(\d{2}:\d{2})"),  # DD-MM-YYYY HH:MM
#         re.compile(r"(\d{2}\.\d{2}\.\d{4})\s(\d{2}:\d{2})"),  # DD.MM.YYYY HH:MM
#         re.compile(r"(\d{2}/\d{2}/\d{4})\s(\d{2}:\d{2})"),  # MM/DD/YYYY HH:MM
#         re.compile(r"(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2})")   # YYYY-MM-DD HH:MM
#     ]
    
#     date, time = None, None
#     for item in raw_data:
#         for pattern in date_time_patterns:
#             match = pattern.search(item)
#             if match:
#                 date, time = match.groups()
#                 break
#         if date and time:
#             break
#     if not (date and time):
#         date_pattern = re.compile(r'(\d{1,2})/(\d{1,2})/(\d{2})')
#         time_pattern = re.compile(r'(\d{1,2}):(\d{2})\s?(AM|PM)', re.IGNORECASE)
#         for item in raw_data:
#             if not date:
#                 date = date_pattern.search(item)
#             if not time:
#                 time = time_pattern.search(item)
#             if date and time:
#                 date = date
#                 time = time
#                 break
#         if date:
#             date = date.group()
#         if time:
#             time = time.group()
#     date = convert_to_standard_date(date)
#     time = convert_to_standard_time(time)

#     return {
#         "Store": store_name,
#         "Date": date,
#         "Time": time
#     }

# def invocie_total(raw_data):
#     i = len(raw_data) - 1
#     while i >= 0:
#         if "total" in raw_data[i].lower():
#             return raw_data[i+1]
#         i-=1
#     return 0

# def parse_receipt_items(raw_data):
#     items=[]
#     count=[]
#     weight=[]
#     weightUnit=[]
#     for i in range(len(raw_data)):
#         if "ks" in raw_data[i]:
#             raw_data[i] = raw_data[i].replace("ks","kg")
#         unit = "na"
#         if "$" in raw_data[i]: #if has $ in front then remove everything up until price
#             raw_data[i] = raw_data[i][raw_data[i].index("$")+1:]
#             if raw_data[i][0] == " ": #if starts with space then remove.
#                 raw_data[i] = raw_data[i][1:]
#         if re.match(r"^\d+\.\d+ [A-Za-z]$", raw_data[i]): #if there is character at end. remove
#             raw_data[i] = raw_data[i][:-2]
#         match = re.match(r"^(\d+\.\d+)-.*$", raw_data[i]) #if there is - at the end, then apply discount
#         if match:
#             raw_data[i] = f"-{match.group(1)}"
#         if bool(re.match(r'^-?\d+\.\d+$', raw_data[i])):
#             #print(raw_data[i])
#             n = raw_data[i-1]
#             counter = 1
#             while ("kg" in n or "lb" in n) and counter < i: #tries to find the correct name, also saves units if found
#                 if "kg" in n:
#                     unit = "kg"
#                 if "lb" in n:
#                     unit = "lb"
#                 counter += 1
#                 n = raw_data[i-counter]
#             if len(n) == 1 or n.isdigit() or n[:-1].isdigit(): #Also tries to find the correct name
#                 counter += 1
#                 n = raw_data[i-counter]
#             if(float(raw_data[i]) < 0):
#                 if(len(items))==0:
#                     continue
#                 items[len(items)-1][1] = str(round(float(items[len(items)-1][1])+float(raw_data[i]),2)) #if its a discount, apply discount
#             elif [n,raw_data[i]] in items:
#                 count[items.index([n,raw_data[i]])] += 1 #if item already exists, increment count
#             else:
#                 x = i-counter+1
#                 w=0 
#                 while (x < i) and unit != "na": #if there is a weight to it, find the
#                     if unit in raw_data[x] and not ("/"+unit) in raw_data[x]:
#                         match = re.search(r"[-+]?\d*\.\d+", raw_data[x])
#                         if match:
#                             w = float(match.group(0))
#                     x+=1
#                 items.append([n,raw_data[i]])
#                 count.append(1)
#                 weight.append(w)
#                 weightUnit.append(unit)
#     total = 0
#     for i in range(len(items)):
#         items[i].append(count[i])
#         items[i].append(weight[i])
#         items[i].append(weightUnit[i])
#         if "total" in items[i][0].lower():
#             total = items[i][1]
        

#     items = list(filter(lambda item: not ("tax" in item[0].lower() or "total" in item[0].lower() or "deposit cl" in item[0].lower() or "enviro fee c" in item[0].lower()), items))
#     return (items,total)

# def parse_invoice_items(data, store):
#     if store.lower() == "sysco":
#         ret = []
#         data=data[0]
#         for row in data:
#             if row[6] == "" or row[7] == "" or row[10]=="" or len(row)<11 or row[6].lower() == "item description":
#                 continue
#             logging.info(row)
#             count = convert_to_numeric(row[1].strip())
#             pack_weight = convert_to_numeric(row[4].strip())
#             if pack_weight == 0:
#                 pack_weight = convert_to_numeric(row[5].strip())
#             weight_units = filter_out_numbers(row[5].strip())
#             item = row[6].strip()
#             price = convert_to_numeric(row[10].strip())
#             if weight_units == "":
#                 weight_units = "na"
#             ret.append([item, price, count, pack_weight, weight_units.lower().strip()])
#         return ret
#     else:
#         return [["No format for this Store", 0, 0, 0, "na"]]

# def mapping(data):
    
#     map= {}
#     try:
#         # Open and read the CSV file
#         response = s3.get_object(Bucket=os.getenv("BUCKETNAME2"), Key="map.csv")
#         content = response['Body'].read().decode('utf-8')
#         csv_reader = csv.DictReader(io.StringIO(content))  # This reads each row as a dictionary
#         for row in csv_reader:
#             # Map the 'key' column to the 'val' column
#             map[row['key']] = row['val']
#             logging.info(row['key'])
#     except Exception as e:
#         print(f"Error reading CSV file: {e}")
#         raise  # Re-raise the exception if you want to handle it in the lambda_handler
#     for i in range(len(data)):
#         try:
#             data[i][0] = map[data[i][0]]
#         except KeyError:
#             logging.info("No key: " + data[i][0])
#     return data

# def lambda_handler(event, context):
#     if event["filename"] == "none":
#         try:
#             response = s3.get_object(Bucket=os.getenv("BUCKETNAME2"), Key="map.csv")
#             file_content = response['Body'].read().decode('utf-8')
#             csv_reader = list(csv.reader(io.StringIO(file_content)))
#             new_row = [event["receiptItem"],event["ingredientName"]]
#             csv_reader.append(new_row)
#             header, *rows = csv_reader
#             unique_rows = [list(row) for row in {tuple(r) for r in rows}]
#             csv_reader = [header] + unique_rows
#             output = io.StringIO()
#             csv_writer = csv.writer(output)
#             csv_writer.writerows(csv_reader)
#             output.seek(0)
#             s3.put_object(Bucket=os.getenv("BUCKETNAME2"), Key="map.csv", Body=output.getvalue())
#             return {
#                 "statusCode": 200,
#                 "body": json.dumps("Receipt Mapping Added Successfully!")                
#             }
#         except:
#             return {"statusCode": 500, "body": json.dumps("Error updating mapping!")}
#     #email = (event["filename"].split('/'))[0]
#     try:

#         logging.info(f"Bucket: {os.getenv("BUCKETNAME")} ::: Key: {event["filename"]}")

#         if os.path.splitext(event["filename"])[1].lower()==".pdf":
#             response = textract.start_document_text_detection(
#                 DocumentLocation={
#                     "S3Object": {
#                         "Bucket": os.getenv("BUCKETNAME"),
#                         "Name": event["filename"],
#                     }
#                 }
#             )
#             job_id = response["JobId"]
#             print(f"Started Textract Job: {job_id}")

#             # Poll for job completion
#             while True:
#                 job_status = textract.get_document_text_detection(JobId=job_id)
#                 status = job_status["JobStatus"]
                
#                 if status in ["SUCCEEDED", "FAILED"]:
#                     break  # Stop polling when done
                
#                 print("Waiting for Textract to finish...")
#                 time.sleep(5)  # Wait before polling again

#             if status == "FAILED":
#                 raise Exception("Textract job failed")

#             # Retrieve the full OCR results
#             response = get_full_ocr_results(job_id)
        
#         else:
#             response = textract.detect_document_text(
#                 Document={
#                     "S3Object": {
#                         "Bucket": os.getenv("BUCKETNAME"),
#                         "Name": event["filename"],
#                     }
#                 }
#             )
#             if "invoice" in event["filename"].lower():
#                 response2 = textract.start_document_analysis(
#                     DocumentLocation={
#                         "S3Object": {
#                             "Bucket": os.getenv("BUCKETNAME"),
#                             "Name": event["filename"],
#                         }
#                     },
#                     FeatureTypes=['TABLES']
#                 )
#                 job_id = response2['JobId']

#                 # Wait and fetch results
#                 import time
#                 while True:
#                     result = textract.get_document_analysis(JobId=job_id)
#                     status = result['JobStatus']
#                     if status in ['SUCCEEDED', 'FAILED']:
#                         break
#                     time.sleep(2)  # Polling interval

#                 if status == 'SUCCEEDED':
#                     tables = extract_tables_from_textract(result)
#                 else:
#                     tables = []
#                 logging.info(tables)
#         logging.info(json.dumps(response))

#         # change LINE by WORD if you want word level extraction
#         raw_text = extract_text(response, extract_by="LINE")
#         logging.info(raw_text)
#         metaData = parse_receipt_data(raw_text)
#         if "invoice" not in event["filename"].lower():#"costco" in event["filename"]:
#             itemList,total = parse_receipt_items(raw_text)
#             itemList = merge_duplicates(itemList)
#             itemList = unit_conversion(itemList)
#         else:
#             itemList = parse_invoice_items(tables, metaData["Store"])
#             itemList = merge_duplicates(itemList)
#             itemList = unit_conversion(itemList)
#             total = invocie_total(raw_text)
#         metaData["Total"] = total
#         logging.info(metaData)
#         logging.info(itemList)
#         itemList = mapping(itemList)



#         # s3.put_object(
#         #     Bucket=bucketname,
#         #     Key=f"output/{filename.split('/')[-1]}_{uuid.uuid4().hex}.txt",
#         #     Body=str("\n".join(raw_text)),
#         # )

#         return {
#             "statusCode": 200,
#             "body": json.dumps("Receipt/Document processed successfully!"),
#             "storeAndTimeStamp": metaData,
#             "data": itemList #json.dumps(raw_text),
            
#         }
#     except:
#         error_msg = process_error()
#         logger.error(error_msg)

#     return {"statusCode": 500, "body": json.dumps("Error processing the recceipt/document!")}

# Testcase:
# {
#   "filename": "receiptcostco2.jpg"
# }

# Response:
# {
#   "statusCode": 200,
#   "body": "\"Receipt/Document processed successfully!\"",
#   "storeAndTimeStamp": {
#     "Store": "COSTCO",
#     "Date": "2021/08/27",
#     "Time": "17:36:19",
#     "Total": "201.33"
#   },
#   "data": [
#     [
#       "580517 **KS TOWEL**",
#       "19.99",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "1446056 SCOTTIES",
#       "16.99",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "1281 1% MILK",
#       "4.75",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "ENVIRO FEE C",
#       "0.11",
#       2,
#       0,
#       "na"
#     ],
#     [
#       "0.11",
#       "0.25",
#       2,
#       0,
#       "na"
#     ],
#     [
#       "DEPOSIT CL",
#       "4.75",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "DEPOSIT CL",
#       "3.79",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "ENVIRO FEE C",
#       "1.20",
#       2,
#       0,
#       "na"
#     ],
#     [
#       "DEPOSIT CL",
#       "4.00",
#       2,
#       0,
#       "na"
#     ],
#     [
#       "500666 KS WATR500**",
#       "3.79",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "4458722 PUREX BT 250",
#       "22.99",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "245554 GREEK YOGURT",
#       "9.49",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "320116 TACO SEASNG",
#       "4.99",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "724000 FROSTED FLKS",
#       "6.99",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "1704012 WELCH'S 60CT",
#       "9.49",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "1202501 POST-ITS",
#       "8.99",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "1202501 POST-ITS",
#       "8.99",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "324143 PURE PROTEIN",
#       "15.99",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "324143 PURE PROTEIN",
#       "15.99",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "379252 GF CKN FLNGS",
#       "9.99",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "379252 GF CKN FLNGS",
#       "9.99",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "1465453 OLDDUTCH725G",
#       "5.99",
#       1,
#       0,
#       "na"
#     ],
#     [
#       "00 APPROVED - THANK YOU 001",
#       "201.33",
#       1,
#       0,
#       "na"
#     ]
#   ]
# }

# Tabular format for invoice yielded something like this:
# ---------------------------------------------------------------------------------------------------------------------------------
# |    | QTY |    |    | PACK  |    |    |    | DRIVER:  | COVERT  |    |    |    |    |
# ---------------------------------------------------------------------------------------------------------------------------------
# |    |     |    |    |       | SIZE | ITEM DESCRIPTION                                              | ITEM CODE | UNIT PRICE | - AMOUNT | EXTENDED PRICE |    | INVOICE CODE | ADJUSTMENTS QTY |
# ---------------------------------------------------------------------------------------------------------------------------------
# |    |     |    |    |       |      | **DAIRY PRODUCTS**                                           |           |            |          |                |    |               |                 |
# ---------------------------------------------------------------------------------------------------------------------------------
# | C  |  1  |    | CS | 10    |      | O#AVGRBRLIMP CHEESE CHEDDAR SHARP PRIN SYS2822312 10.640 T/WT= 10.640 | 2822312 | 4.316      |          | 45.92          |    |               |                 |
# | C  | 1S  |    |    | ONLY'S | LB   | BBRLCLS CHEESE SWISS/AMER 120 SLI 14716                      | 5148453   | 17.79      |          | 17.79          |    |               |                 |
# ---------------------------------------------------------------------------------------------------------------------------------
# |    |     |    |    |       |      | **GROUP TOTAL**** POULTRY**                                  |           |            |          | 63.71          |    |               |                 |
# ---------------------------------------------------------------------------------------------------------------------------------
# | C  |  1  |    | CS |       | 410 LB | SYS CLS CHICKEN CVP WING 142JT JMB RND 52890               | 6344790   | 87.62      |          | 87.62          |    |               |                 |
# ---------------------------------------------------------------------------------------------------------------------------------
# |    |     |    |    |       |      | **GROUP TOTAL CANNED & DRY**                                |           |            |          | 87.62          |    |               |                 |
# ---------------------------------------------------------------------------------------------------------------------------------
# | D  |     | 1SCS |  | 123   | LB   | MORTON SALT KOSHER 1702                                     | 1995125   | 33.33      |          | 33.33          |    |               |                 |
# | D  | 1S  |    |    | ONLY1 | 8 oz | IMP/MCC SEASONING CAJUN 974235                             | 5228424   | 19.21      |          | 19.21          |    |               |                 |
# ---------------------------------------------------------------------------------------------------------------------------------
# |    |     |    |    |       |      | **GROUP TOTAL PRODUCE**                                    |           |            |          | 52.54          |    |               |                 |
# ---------------------------------------------------------------------------------------------------------------------------------
# | C  |  1  |    | CS | 11    | LB   | IMPFRSH DILL BABY FRESH HERB                               | 2005148   | 15.25      |          | 15.25          |    |               |                 |
# | C  |  1  | CS |    | 120   | LB   | PACKER CUCUMBER PICKLING FRESH                            | 2034023   | 37.28      |          | 37.28          |    |               |                 |
# |    |  2  | CS |    | 15    | LB   | PACKER CARROT BABY PLD TRI COLOR                          | 7680291   | 32.50      |          | 65.00          |    |               |                 |
# ---------------------------------------------------------------------------------------------------------------------------------
# |    |     |    |    |       |      | **GROUP TOTAL**                                           |           |            |          | 117.53         |    |               |                 |
# ---------------------------------------------------------------------------------------------------------------------------------
# |    | MISC |    |    | CHARGES |    | CHGS FOR FUEL SURCHARGE                                   |           |            |          | 3.50           |    |               |                 |
# ---------------------------------------------------------------------------------------------------------------------------------
# |    |     |    |    |       |      |                                                           |           |            |          |                |    |               |                 |
# ---------------------------------------------------------------------------------------------------------------------------------
# |    | ORDER |    |    | SUMMARY |    | : 1277265                                               |           |            |          |                |    |               |                 |
# ---------------------------------------------------------------------------------------------------------------------------------

# ---------------------------------------------------------------------------------------------------------------------------------
# | CASES | SPLIT | TOT PCS | CUBE | GROSS WT. |
# ---------------------------------------------------------------------------------------------------------------------------------
# |   7   |   2   |    g    | 4.9  |    132    |
# |   7   |   2   |    9    | 4.9  |    132    |
# ---------------------------------------------------------------------------------------------------------------------------------
