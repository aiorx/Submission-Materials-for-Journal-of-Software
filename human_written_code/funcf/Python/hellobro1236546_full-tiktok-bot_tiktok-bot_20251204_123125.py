```python
def loop2(): #followers
    sleep(10)
    try:
        driver.find_element_by_xpath("/html/body/div[4]/div[1]/div[3]/div/div[1]/div/button").click()
    except:
        print("You didn't solve the captcha yet. Need to refresh to avoid endless loop.")
        driver.refresh()
        loop2()
    try:
        sleep(2)
        driver.find_element_by_xpath("/html/body/div[4]/div[2]/div/div/div/form/div/input").send_keys(vidUrl)
        sleep(1)
        driver.find_element_by_xpath("//*[@id=\"sid\"]/div/div/div/form/div/div/button").click()
        sleep(2)
        driver.find_element_by_xpath("//*[@id=\"c2VuZF9mb2xsb3dlcnNfdGlrdG9r\"]/div[1]/div/form/button").click()
        sleep(10)
        driver.refresh()
        print("")
        print(">>> Followers Sent <<<")
        print("")
        sleep(900)
        loop2()
    except:
        print("A generic error occurred. Now will retry again")
        driver.refresh()
        sleep(20)
        loop2()
```