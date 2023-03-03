import { recreateList } from '../../../api/services/listRecreationService';
import mailchimp from '@mailchimp/mailchimp_marketing';
import dotenv from 'dotenv';

dotenv.config();
const apiKey = process.env.MAILCHIMP_API_KEY;
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

mailchimp.setConfig({
  apiKey: apiKey,
  server: `${serverPrefix}.api.mailchimp.com`
});

describe('recreateList', () => {
  it('should return existing list ID if list with the same name already exists', async () => {
    // Create a mock list to simulate an existing list with the same name
    const mockExistingList = {
      id: '123456',
      name: 'Test List',
      contact: {},
      permission_reminder: '',
      use_archive_bar: false,
      campaign_defaults: {},
      notify_on_subscribe: '',
      notify_on_unsubscribe: '',
      email_type_option: false,
      visibility: 'pub',
    };
    // Mock the Mailchimp API to return the mock list
    jest.spyOn(mailchimp.lists, 'getAllLists').mockResolvedValue({ lists: [mockExistingList] });

    // Call the function with the existing list name
    const listId = await recreateList('Test List');

    // Verify that the function returned the existing list ID
    expect(listId).toEqual(mockExistingList.id);
  });

  it('should throw an error if list with the same name already exists', async () => {
    // Create a mock list to simulate an existing list with the same name
    const mockExistingList = {
      id: '123456',
      name: 'Test List',
      contact: {},
      permission_reminder: '',
      use_archive_bar: false,
      campaign_defaults: {},
      notify_on_subscribe: '',
      notify_on_unsubscribe: '',
      email_type_option: false,
      visibility: 'pub',
    };
    // Mock the Mailchimp API to return the mock list
    jest.spyOn(mailchimp.lists, 'getAllLists').mockResolvedValue({ lists: [mockExistingList] });

    // Call the function with the existing list name and expect it to throw an error
    await expect(recreateList('Test List')).rejects.toThrow('A list with the same name already exists');
  });

  it('should create a new list and return its ID', async () => {
    const listName = 'd129ac35c0';
    const listId = await recreateList(listName);

    // Check if the list was created successfully
    expect(typeof listId).toBe('string');
    expect(listId).not.toBe('');
  });
});
