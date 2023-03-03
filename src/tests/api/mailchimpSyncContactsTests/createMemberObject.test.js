/*
This test ensures that the createMemberObject function correctly generates 
a member object with the email, first name, and last name of a given contact. 
This is an important step in adding new members to a Mailchimp list, as the correct 
member object must be created and passed to the Mailchimp API in order for the member 
to be added successfully.
*/


import { createMemberObject } from '../../../api/services/mailchimpSyncContactsService';

describe('createMemberObject', () => {
  test('returns a properly formatted member object', () => {
    // Define a contact object to use as input
    const contact = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com'
    };

    // Call the createMemberObject function with the contact object
    const member = createMemberObject(contact);

    // Verify that the resulting member object is properly formatted
    expect(member).toEqual({
      email_address: 'johndoe@example.com',
      status: 'subscribed',
      merge_fields: {
        FNAME: 'John',
        LNAME: 'Doe'
      }
    });
  });
});
