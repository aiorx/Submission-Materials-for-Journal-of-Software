```python
####### FUNCTION AnalyzeMetadata doc ######
def Analyze_Metadata_doc(fileName):
	#Open file
	docxFile = docx.Document(file(fileName,'rb'))
	#Get the structure
	docxInfo= docxFile.core_properties
	#Print the metadata which it wants to display
	attribute = ["author", "category", "comments", "content_status", 
	    "created", "identifier", "keywords", "language", 
	    "last_modified_by", "last_printed", "modified", 
	    "revision", "subject", "title", "version"]
	#run the list in a for loop to print the value of each metadata
	print ' - Document: ' + str(fileName)
	for meta in attribute:
	    metadata = getattr(docxInfo,meta)
	    value = metadata([meta])
	    if metadata:
	    	if meta =="/Author":
	    		if value not in meta_author_array:
	    			meta_author_array.append(value)
			elif meta == "/Producer":
				if value not in meta_producer_array:
					meta_producer_array.append(value)
			elif meta =="/Creator":
				if value not in meta_creator_array:
					meta_creator_array.append(value)
	        #Separate the values unicode and time date
	        if isinstance(metadata, unicode): 
	            print " \n\t" + str(meta)+": " + str(metadata)
	        elif isinstance(metadata, datetime.datetime):
	            print " \n\t" + str(meta)+": " + str(metadata)
```