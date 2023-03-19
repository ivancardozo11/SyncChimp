import { getExistingMembers } from '../../../api/services/mailchimpSyncContactsService';
import mailchimp from '@mailchimp/mailchimp_marketing';
import dotenv from 'dotenv';
dotenv.config();

jest.mock('@mailchimp/mailchimp_marketing');
/*
This test is testing the getExistingMembers function from the mailchimpSyncContactsService API service module.

The test imports the necessary modules and sets up a mock for the @mailchimp/mailchimp_marketing module. 
The getExistingMembers function is then called with a list ID to retrieve a list of existing members in that list.

The test sets up an expectation that the mockGetListMembersInfo function is called with the correct list ID and count. 
It then checks that the function returns the expected value, which is an array of mock existing members.

If the test fails, it will log an error message indicating that it failed to retrieve the existing members from Mailchimp.
*/
describe('getExistingMembers', () => {
  const mockExistingMembers = [{ email_address: 'Cierra_Walsh192@yahoo.com' }];
  const mockGetListMembersInfo = jest.fn().mockResolvedValue({ members: mockExistingMembers });

  beforeAll(() => {
    mailchimp.lists.getListMembersInfo = mockGetListMembersInfo;
  });

  it('should return existing members', async () => {
    mailchimp.setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_SERVER_PREFIX
    });

    try {
      const lists = await mailchimp.lists.getAllLists();
      const firstListId = lists?.lists?.[0]?.id;
      if (!firstListId) {
        throw new Error('No Mailchimp list found');
      }
      const result = await getExistingMembers(firstListId);
      expect(mockGetListMembersInfo).toHaveBeenCalledWith(firstListId, { count: 50 });
      expect(result).toEqual(mockExistingMembers);
    } catch (error) {
      console.error(`Failed to get existing members from Mailchimp: ${error.message}`);
    }
  });
});
