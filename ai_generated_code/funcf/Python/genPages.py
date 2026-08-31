```python
        #Format file
        new_text = "#Header Data\n#Title:\n" + topic + \
                "\n#Heading\n" + topic + \
                "\n#Article Formed using standard development resources3\n#\======/"
        for paragraph in paragraphs:
            paragraph.replace("\n\n\n", "\n")
            paragraph.replace("\n\n", "\n")
            new_text += paragraph
        new_text += "\n\======/"
        for image in images:
            new_text += ("\n" + image)
        new_text += "\n"
        
        #Save file
        f = open("/var/www/html/pages/" + topic.lower() + ".data", "w")
        f.write(new_text)
        f.close()
        print ("Success: " + topic.lower())
```