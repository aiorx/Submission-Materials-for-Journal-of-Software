```javascript
export function isValidEmail(email) {

    if (email.length == 0) {
        return false;
    }

    // Regex to test if email follows valid format (Assisted with basic coding tools)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}
```

```javascript
export function isValidPhoneNumber(phoneNumber) {

    if (phoneNumber.length == 0) {
        return false;
    }

    // Regex to test if phone number follows valid format (Assisted with basic coding tools)
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;

    return phonePattern.test(phoneNumber);
}
```