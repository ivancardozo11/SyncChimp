import { addMembersToList } from '../../../api/services/mailchimpSyncContactsService';
import mailchimp from '@mailchimp/mailchimp_marketing';
import dotenv from 'dotenv';
dotenv.config();

/*
The test imports a function called addMembersToList from the mailchimpSyncContactsService module and uses the @mailchimp/mailchimp_marketing 
library to perform Mailchimp operations. It configures Mailchimp with the API key and server prefix from environment variables, 
creates a new contact object with a randomly generated email, first name, and last name, and then adds the contact to the Mailchimp 
list specified by the first list returned by mailchimp.lists.getAllLists(). 
It asserts that the response status is 200 and that the new member was added to the list with the correct email, first name, and last name.
*/

const apiKey = process.env.MAILCHIMP_API_KEY;
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

mailchimp.setConfig({
  apiKey: apiKey,
  server: serverPrefix
});

jest.setTimeout(100000)

test('should add a new member to the list', async () => {
  const lists = await mailchimp.lists.getAllLists();
  const listId = lists.lists[0].id;

  const contact = {
    email: `${Math.random().toString(36).substring(2, 12)}@hotmail.com`,
    firstName: 'Jon',
    lastName: 'Dowwe'
  };

  const response = await addMembersToList(listId, [contact]);

  // Expect the response status to be 200
  expect(response.response.status).toBe(200);

  // Expect the member to be added to the list
  const members = await mailchimp.lists.getListMembersInfo(listId, { count: 1000 });
  const newMember = members.members.find(member => member.email_address === contact.email);

  expect(newMember).toBeDefined();
  expect(newMember.email_address).toBe(contact.email);
  expect(newMember.merge_fields.FNAME).toBe(contact.firstName);
  expect(newMember.merge_fields.LNAME).toBe(contact.lastName);
});
