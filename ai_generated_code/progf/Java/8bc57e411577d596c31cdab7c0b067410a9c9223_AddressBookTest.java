        //COPILOT PROMPT: The phone and email overload for findContact should allow searching for an empty string
        //So it should return the first Contact that has an empty string for phone number and email respectively

        //Below tests Assisted using common GitHub development utilities
        @Test
        @DisplayName("FindContact should return the first Contact with an empty phone number if searchCriteria is an empty string")
        public void testFindContactReturnsContactWithEmptyPhoneNumberIfSearchCriteriaIsEmptyString()
        {
            Contact contact = mock(Contact.class);
            when(contact.getName()).thenReturn("emptyPhoneNumber");
            when(contact.getPhoneNumber()).thenReturn("");
            when(contact.getEmailAddress()).thenReturn("testEmail");
            addressBook.addContact(contact);
            assertEquals(contact, addressBook.findContact("", ContactDetailType.PHONE_NUMBER));
        }

        @Test
        @DisplayName("FindContact should return the first Contact with an empty email if searchCriteria is an empty string")
        public void testFindContactReturnsContactWithEmptyEmailIfSearchCriteriaIsEmptyString()
        {
            Contact contact = mock(Contact.class);
            when(contact.getName()).thenReturn("emptyEmail");
            when(contact.getPhoneNumber()).thenReturn("12345678910");
            when(contact.getEmailAddress()).thenReturn("");
            addressBook.addContact(contact);
            assertEquals(contact, addressBook.findContact("", ContactDetailType.EMAIL_ADDRESS));
        }

