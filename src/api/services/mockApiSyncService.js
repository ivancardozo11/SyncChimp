import axios from 'axios';
import { addMembersToList, generateSyncedContactsResponse } from './mailchimpSyncContactsService.js';
import { recreateList } from './listRecreationService.js';

async function syncContactsFromMockApi() {
  try {
    // Retrieve contacts from MockAPI
    const response = await axios.get(process.env.MOCK_API_URL);

    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new Error('Failed to retrieve contacts from MockAPI.');
    }

    // Recreate list with the necessary name if it does not exist or if it has a different name
    const listId = await recreateList('Ivan Cardozo');
    
    if (!listId) {
      throw new Error('Failed to recreate list in Mailchimp.');
    }

    // Add contacts to Mailchimp list if there are
    const syncedMembers = await addMembersToList(listId, response.data);
   
    if (!syncedMembers) {
      throw new Error('Failed to add contacts to Mailchimp list.');
    }
    // Generate the synced contacts response object
    const syncedContacts = generateSyncedContactsResponse(syncedMembers.addedCount, syncedMembers.existingMembers);

    if (!syncedContacts) {
      throw new Error('Failed to generate synced contacts response.');
    }
    // Return the synced contacts response object
    return syncedContacts;

  } catch (error) {
    console.error(error);
    throw new Error('Error syncing contacts');
  }
}

export default syncContactsFromMockApi;
