# https://www.youtube.com/watch?v=ErnWZxJovaM&list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI
# script 1 - using youtube_dl
# script 2 - using selenium and pandas 
# generate using gemini and chatgpt, transformers (gen ai solution )- 
# another way - azure open and whisper model 
# automate shorts making process
# automate video making process - like a make a complete video

# WebDriver is a compact object-oriented API.
# It drives the browser effectively.
# WebDriver is designed as a simple and more concise programming interface.



#Selenium supports automation of all the major browsers in the 
# market through the use of WebDriver.

import pandas as pd
import os
from time import sleep
from selenium import webdriver



# func 4= convert transcript to pdf
# func5 = convert transcript to csv 


# func1 = open_url_in_chrome
# mode = headed -> Opens the browser with a visible window. 
# mode = headless -> Opens the browser without a visible window.-> runs on server
def open_url_in_chrome(url , mode ):
    if mode=='headed' :
        driver = webdriver.Chrome()
    elif mode == 'headless':
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        driver = webdriver.Chrome('chromedriver.exe', options= options)
    driver.get(url)
    return driver

# Extra information about xpath
# A HTML document can be considered as a XML document, 
# and then we can use xpath which will be the path traversed to reach the element of interest to locate the element. 
#  The XPath could be absolute xpath,
# which is created from the root of the document

# func2 = accept terms and conditions
def accept_terms_and_conditions(driver):
    # step 1: click on the no thanks button 
    # doing this will click on no thanks when the user is prompted to sign in
    driver.find_element_by_xpath("//paper-button[@aria-label='No thanks']")
    # step 2: click on the accept button
# explaination : 
# google's cookie consent - inside an iframe 
# iframe - inline frame - is a webpage embedded inside another webpage
# selenium cant directly interact with elements inside an iframe unless it switches to the iframe
# use driver.switch_to.frame() to switch to the iframe
# function identifies the correct iframe by looking for an iframe whose src (source url) contains 'consent.google.com'

# google.consent.com - probably relates to cookie or privacy policy consent
    driver.switch_to.frame(driver.find_element_by_xpath("//iframe[@src , 'consent.google.com']"))

# wait for the page to load-Ensure that all elements inside the 
# iframe are loaded and ready for interaction.

    sleep(1)
# click on the I agree button on the cookie consent form
    driver.find_element_by_xpath('//*[@id="intorAgreeButton"]/span/span').click()
# wait for the page to refresh 
    sleep(3)
    # manually refresh the page to see if everything is loaded
    driver.refresh()



 # below content Written with routine coding tools
#  This function is essential in automation scripts to 
# ensure that YouTube's pop-ups (like cookie consent, 
# T&Cs, or sign-in prompts) do not block further 
# interactions, such as extracting the transcript. 
# It ensures that the script can proceed without manual 
# intervention.

def get_transcript(driver , mode):
    driver.implicitly_wait(10)

    if mode == 'headed':
        try :
            print('Accepting terms and conditons')
            accept_terms_and_conditions(driver)
        except:
            print('No terms and conditions to accept')


        # click on more actions to get to the transcript
        print('Opening transcripts')
        driver.find_element_by_xpath('//button[@aria-label="More Actions"]').click()
        # click on opening the transcript
        driver.find_element_by_xpath("//*[@id='items']/ytd-menu-service-item-renderer/tp-yt-paper-item").click()

    if mode =="headless":
        try:
             driver.find_element_by_xpath('//button[@aria-label="More Actions"]').click()
        except:
            # either look for more actions and click or repeat the process by calling back the func
            sleep(3)
            driver.refresh()
            get_transcript(driver, mode)

        try:
            # if the more actions button is clicked thne click on the transcript
            driver.find_element_by_xpath("//*[@id='items']/ytd-menu-service-item-renderer/tp-yt-paper-item").click()
        except:
            # else call back the func and repeat the process
            sleep(3)
            driver.refresh()
            get_transcript(driver, mode)

    print("Storing the transcript")
    transcript_element = driver.find_element_by_xpath("//*[@id='body']/ytd-transcript-segment-list-renderer")
    transcript = transcript_element.text
    return transcript



# func 4- convert the transcript tp pdf
def transcript_to_pdf( transcript):
    # process the yt transcript as a single string
    # split the entire transcript into a list of lines
    transcript = transcript.split('\n')
    # in a transcript , timestamps and text is seperated by a line
    # ex: 00:01 
    #     Hello world
    #     00:02
    #     How are you?

# after splitting the transcript into lines
# we get - '00:01' , 'Hello world' , '00:02' , 'How are you?'
# timestamps are at even indexes (0,2,4)
# slice the list to get even indexes
    timestamps = transcript[0::2] 
    # now we get - ['00:01' , '00:02']
    # get every second element starting from index 1
    # get all the odd indices- which is text
    text = transcript[1::2]
    df = pd.DataFrame({'timestamps':timestamps , 'text':text})

    return df 

# automate the extraction of a transcript from a YouTube video
# save it in a CSV file with time stamps
# also save the file as plain text
#  step 1: open a YT video 
# step2 : extract autogenerated transcript
# step3 : save the transcript as a CSV file

def main(url,mode='headless'):
    driver = open_url_in_chrome(url, mode)
    transcript = get_transcript(driver, mode)
    # close the browser window after the transcript is extracted
    driver.close()
    # breakdown the transcript so its easier to handle
    df = transcript_to_pdf(transcript)
    # create a output file if it doesnt already exists 
    if not os.path.exists("./output"):
        os.makedirs("./output")

# convert to csv
    path_to_transcript = "./output/"
    df.to_csv(f"{path_to_transcript}transcript.csv", index= False)

# convert to plain text
    with open(f"{path_to_transcript}transcript.csv" , "w") as file:
        print(" ".join(" ".join(df.text.values).split()), file=file)

    print(f"Transcript saved to: {path_to_transcript}")

    
    





    
    


if __name__ == '__main__':
    url = "https://www.youtube.com/watch?v=QDX-1M5Nj7s"
    mode = 'headed'
    main(url, mode)
    





















