import axios from 'axios';
import { Contact } from '../types/contacts';
import { SyncedContacts } from '../types/syncedContacts';
import { addMembersToList, createList, getMembersFromList } from './mailchimpSyncContactsService';

let listId: string;

export async function syncContacts(): Promise<SyncedContacts> {
  try {
    // Retrieve contacts from MockAPI
    const response = await axios.get<Contact[]>('MOCK_API_URL');

    if (!listId) {
      // Create a new list in Mailchimp
      const listName = 'Name of developer';
      listId = await createList(listName);
    }

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
