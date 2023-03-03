import mailchimp from '@mailchimp/mailchimp_marketing';
import { getExistingMembers } from '../../../api/services/mailchimpSyncContactsService';


/*
This test suite checks the functionality of the getExistingMembers function, which is
responsible for retrieving the existing members of a Mailchimp list. The tests verify that
the function correctly calls the Mailchimp API with the appropriate parameters, handles
API errors as expected, and returns the existing members from the API response. These tests
ensure that the getExistingMembers function is working correctly and can be relied upon in
the Mailchimp synchronization process.
*/
jest.mock('@mailchimp/mailchimp_marketing');

describe('getExistingMembers', () => {
  it('should call mailchimp.lists.getListMembersInfo with the correct parameters', async () => {
    const listId = '123abc';
    const existingMembersResponse = { members: [] };
    mailchimp.lists.getListMembersInfo.mockResolvedValueOnce(existingMembersResponse);

    await getExistingMembers(listId);

    expect(mailchimp.lists.getListMembersInfo).toHaveBeenCalledTimes(1);
    expect(mailchimp.lists.getListMembersInfo).toHaveBeenCalledWith(listId, { count: 50 });
  });

  it('should throw an error if mailchimp.lists.getListMembersInfo returns an error', async () => {
    const listId = '123abc';
    const errorMessage = 'Failed to get existing members from Mailchimp list.';
    mailchimp.lists.getListMembersInfo.mockRejectedValueOnce(new Error(errorMessage));

    await expect(getExistingMembers(listId)).rejects.toThrow(errorMessage);
  });

  it('should return the existing members from the API response', async () => {
    const listId = '123abc';
    const existingMembersResponse = {
      members: [
        { id: 'member1', email_address: 'test1@example.com' },
        { id: 'member2', email_address: 'test2@example.com' },
      ],
    };
    mailchimp.lists.getListMembersInfo.mockResolvedValueOnce(existingMembersResponse);

    const result = await getExistingMembers(listId);

    expect(result).toEqual(existingMembersResponse.members);
  });
});
