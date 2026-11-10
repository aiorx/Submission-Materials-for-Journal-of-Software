```python
def loginByQrCode(self):
    if self.session.isLogin:
        logger.info('登录成功')
        return

    # download QR code
    qrCode = self.session.getQRcode()
    if not qrCode:
        raise JDException('二维码下载失败')

    fileName = 'QRcode.png'
    save_image(qrCode, fileName)
    logger.info('二维码获取成功，请打开京东APP扫描')
    open_image(fileName)

    # get QR code ticket
    ticket = None
    retryTimes = 85
    for i in range(retryTimes):
        ticket = self.session.getQRcodeTicket()
        if ticket:
            break
        time.sleep(2)
    else:
        raise JDException('二维码过期，请重新获取扫描')

    # validate QR code ticket
    if not self.session.validateQRcodeTicket(ticket):
        raise JDException('二维码信息校验失败')

    logger.info('二维码登录成功')
    self.session.isLogin = True
    self.session.saveCookies()
```