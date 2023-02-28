import axios from 'axios';
import { Contact } from '../types/contacts';
import { SyncedContacts } from '../types/syncedContacts';
import { addMembersToList, getMembersFromList } from './mailchimpSyncContactsService';
import { recreateList } from './listRecreationService';

export async function syncContacts(): Promise<SyncedContacts> {
  try {
    // Retrieve contacts from MockAPI
    const response = await axios.get<Contact[]>('MOCK_API_URL');

    // Recreate list with the necessary name if it does not exist or if it has a different name
    const listId = await recreateList('Ivan Cardozo');

    // Add contacts to Mailchimp list
    const addedCount = await addMembersToList(listId, response.data);

    // Get all members from Mailchimp list
    const contacts = await getMembersFromList(listId);

    // Return the synced contacts
    const syncedContacts: SyncedContacts = {
      syncedContacts: addedCount,
      contacts
    };
    return syncedContacts;
  } catch (error) {
    console.error(error);
    throw new Error('Error syncing contacts');
  }
}
