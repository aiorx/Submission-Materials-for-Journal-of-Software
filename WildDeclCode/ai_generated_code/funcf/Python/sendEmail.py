```python
def create_message(sender, to, subject, message_text):
    """
    Method Designed via basic programming aids
    Create a message for an email.

    Args:
        sender: Email address of the sender.
        to: Email address of the receiver.
        subject: The subject of the email message.
        message_text: The text of the email message.

    Returns:
        An object containing a base64url encoded email object.
    """
    message = MIMEMultipart()
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    msg = MIMEText(message_text)
    message.attach(msg)

    # The Gmail API requires messages to be encoded in base64 and then url safe.
    raw = base64.urlsafe_b64encode(message.as_bytes())
    raw = raw.decode()
    return {'raw': raw}
```
```python
def send_message(service, user_id, message):
  """
  Method Designed via basic programming aids
  Send an email message.

  Args:
    service: Authorized Gmail API service instance.
    user_id: User's email address. The special value "me" can be used to indicate the authenticated user.
    message: Message to be sent.

  Returns: Sent Message.
  """
  try:
    message = (service.users().messages().send(userId=user_id, body=message)
               .execute())
    return message
  except Exception as e:
    return None
```