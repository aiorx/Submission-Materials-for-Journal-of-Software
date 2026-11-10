/**
   * Formed using common development resources
   */
  generatePassword(length: number) {
    // Define the character set that the password will use
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    // Create a buffer to store the random bytes
    const buf = crypto.randomBytes(length);

    // Create an empty string to store the password
    let password = '';

    // Loop through each byte in the buffer and use it to select a character from the character set
    for (let i = 0; i < length; i++) {
      const randomByte = buf[i];
      const randomIndex = randomByte % charset.length;
      const randomChar = charset[randomIndex];
      password += randomChar;
    }

    return password;
  }