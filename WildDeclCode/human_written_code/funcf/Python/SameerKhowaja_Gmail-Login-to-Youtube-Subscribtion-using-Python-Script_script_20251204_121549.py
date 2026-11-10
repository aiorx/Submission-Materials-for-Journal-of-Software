```python
def Connecting_To_Browser(id_str, pass_str):
    if id_str != "" and pass_str != "":
        browser = webdriver.Chrome("chromedriver.exe")
        try:
            browser.get('https://www.gmail.com/')

            email_field = browser.find_element_by_id("identifierId")
            email_field.clear()

            email_field.send_keys(id_str)

            email_next_button = browser.find_element_by_id("identifierNext")
            email_next_button.click()

            time.sleep(2)

            password_field = browser.find_element_by_name("password")
            password_field.clear()

            password_field.send_keys(pass_str)

            password_next_button = browser.find_element_by_id("passwordNext")
            password_next_button.click()

            time.sleep(3)

            browser.get('https://www.youtube.com/channel/UCp0aUP9U8MQ3rNcUOz1YjuA')

            
            subscribe_next_button = browser.find_element_by_class_name("style-scope ytd-subscribe-button-renderer")
            subscribe_next_button.click()

            time.sleep(10)
            browser.quit()
        except:
            browser.quit()
    else:
        print("Either ID or PASSWORD is null")
```