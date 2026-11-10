```python
def send_email(sender_email, sender_password, receiver_email, subject, attachment_file):
    import smtplib
    from email.message import EmailMessage

    msg = EmailMessage()
    with open(attachment_file, 'rb') as f:
        file_data = f.read()
        file_name = f.name

    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject
    msg.set_content(f'Hello ! How are you??')
    msg.add_attachment(file_data, maintype='img', subtype='imghdr', filename=file_name)

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(sender_email, sender_password)
        smtp.send_message(msg)
```