package com.dfcorp.addressbook;

import java.util.ArrayList;

public class AddressBook {
    private ArrayList<Contact> contacts = new ArrayList<>();

    public AddressBook() {
        contacts = new ArrayList<>();
    }

    public ArrayList<Contact> getContacts() {
        return contacts;
    }

    public void addContact(Contact contact) {
        if ((Validation.isContactNull(contact))) {
            throw new IllegalArgumentException("Contact cannot be null");
        }
        if ((Validation.isPhoneNumberDuplicate(contacts, contact))) {
            throw new IllegalArgumentException("Phone number already exists, duplicate phone numbers are not allowed");
        }
        if ((Validation.isEmailDuplicate(contacts, contact))) {
            throw new IllegalArgumentException("Email already exists, duplicate emails are not allowed");
        }
        contacts.add(contact);
    }

    public ArrayList<Contact> searchContactsByName(String firstName, String lastName) {
        if (Validation.isStringNullOrEmpty(firstName) || Validation.isStringNullOrEmpty(lastName)) {
            throw new IllegalArgumentException("First name and last name cannot be null or empty");
        }

        ArrayList<Contact> matchesFound;
        matchesFound = new ArrayList<>();
        boolean contactFound = false;
        for (Contact contact : contacts) {
            if (contact.getFirstName().equals(firstName) || contact.getLastName().equals(lastName)) {
                contactFound = true;
                matchesFound.add(contact);
            }
        }
        if (!contactFound) {
            throw new IllegalArgumentException("No contacts found with the name " + firstName + " " + lastName);
        }
        return matchesFound;
    }

    //Code Supported via standard GitHub programming aids
    public ArrayList<Contact> searchContactsByPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }

        ArrayList<Contact> matchesFound = new ArrayList<>();
        for (Contact contact : contacts) {
            if (phoneNumber.equals(contact.getPhoneNumber())) {
                matchesFound.add(contact);
            }
        }
        return matchesFound;
    }

    //Code Supported via standard GitHub programming aids
    public String displayContacts(ArrayList<Contact> contacts) {
        if (Validation.isContactsNull(contacts)) {
            throw new IllegalArgumentException("Contacts cannot be null");
        }
        if (Validation.isContactsEmpty(contacts)) {
            throw new IllegalArgumentException("Contacts cannot be empty");
        }

        StringBuilder sb = new StringBuilder();
        for (Contact contact : contacts) {
            sb.append("Full Name: ")
                    .append(contact.getFirstName())
                    .append(" ")
                    .append(contact.getLastName())
                    .append(" Phone Number: ")
                    .append(contact.getPhoneNumber())
                    .append(" Email: ")
                    .append(contact.getEmail())
                    .append("\n");
        }
        return sb.toString();
    }

    //My original code that has been replaced by Copilot generated code
//    public void displayContacts(ArrayList<Contact> contacts) {
//        if (Validation.isContactsNull(contacts)) {
//            throw new IllegalArgumentException("Contacts cannot be null");
//        }
//        if (Validation.isContactsEmpty(contacts)) {
//            throw new IllegalArgumentException("Contacts cannot be empty");
//        }
//        for (Contact contact : contacts) {
//            System.out.println("Full Name: " + contact.getFirstName() + " " + contact.getLastName() + " Phone Number: " + contact.getPhoneNumber() + " Email: " + contact.getEmail());
//        }
//    }

    public boolean deleteContact(Contact contact) {
        if (Validation.isContactNull(contact)) {
            throw new IllegalArgumentException("Contact cannot be null");
        }
        if (Validation.isContactEmpty(contact)) {
            throw new IllegalArgumentException("Contact cannot be empty");
        }
        if (!contacts.contains(contact)) {
            throw new IllegalArgumentException("Contact does not exist in the address book please try again");
        }
        contacts.remove(contact);
        return true;
    }

    public boolean editContact(Contact currentContact, Contact newContact) {
        if (Validation.isContactNull(newContact)) {
            throw new IllegalArgumentException("Contact cannot be null");
        }
        if (Validation.isContactEmpty(newContact)) {
            throw new IllegalArgumentException("Contact cannot be empty");
        }
        int index = contacts.indexOf(currentContact);
        if (index == -1) {
            throw new IllegalArgumentException("Contact does not exist in the address book please try again");
        }
        contacts.set(index, newContact);
        return true;
    }
}
