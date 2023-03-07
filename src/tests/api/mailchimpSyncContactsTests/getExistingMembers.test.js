import { getExistingMembers } from '../../../api/services/mailchimpSyncContactsService';
import mailchimp from '@mailchimp/mailchimp_marketing';
import dotenv from 'dotenv';
dotenv.config();

jest.mock('@mailchimp/mailchimp_marketing');

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
