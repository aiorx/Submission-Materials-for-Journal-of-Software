package com.challenges.helpers;

import com.challenges.addressbook.ContactDetailType;

public class ValidatorHelpers {

    /* regex pattern from: https://regexpattern.com/phone-number/#uk
    * pattern currently only works for UK phone numbers*/
    public static String PHONE_REGEX = "^(((\\+44\\s?\\d{4}|\\(?0\\d{4}\\)?)\\s?\\d{3}\\s?\\d{3})|((\\+44\\s?\\d{3}|\\(?0\\d{3}\\)?)\\s?\\d{3}\\s?\\d{4})|((\\+44\\s?\\d{2}|\\(?0\\d{2}\\)?)\\s?\\d{4}\\s?\\d{4}))(\\s?#(\\d{4}|\\d{3}))?$";


    public static String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$";

    /**
     * Checks if the given input string is null or empty after trimming. Documentation Assisted using common GitHub development utilities.
     *
     * @param input The string to check.
     * @return true if the input is null or its trimmed version is empty, false otherwise.
     */
    public static boolean isInputNullOrEmpty(String input)
    {
        if (input == null) return true;
        return input.trim().isEmpty();
    }

    /**
     * Validates the given contact detail based on the specified type. Documentation Assisted using common GitHub development utilities.
     *
     * @param contactDetail The contact detail to validate. This should be a phone number or an email address.
     * @param contactDetailType The type of the contact detail. This should be PHONE_NUMBER or EMAIL_ADDRESS.
     * @return true if the contact detail is valid, false otherwise.
     * @throws IllegalArgumentException If the contactDetail is null or empty.
     */
    public static boolean validateContactInput(String contactDetail, ContactDetailType contactDetailType) throws IllegalArgumentException
    {
        if (isInputNullOrEmpty(contactDetail)) throw new IllegalArgumentException();
        switch (contactDetailType) {
            case PHONE_NUMBER -> {
                return contactDetail.matches(PHONE_REGEX);
            }
            case EMAIL_ADDRESS -> {
                return contactDetail.matches(EMAIL_REGEX);
            }
            default -> {
                return false;
            }
        }
    }
}
