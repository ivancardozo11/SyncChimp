import axios from 'axios';
import { lists } from '@mailchimp/mailchimp_marketing'; // importa 'lists' en lugar de 'mailchimp'
import { Contact } from '../types/contacts';
import { SyncedContacts } from '../types/syncedContacts';
import configureMailchimp from '../../../mailchimp.config';



async function addMembersToList(listId: string, members: Contact[]): Promise<number> {
  const response = await lists.addListMembers(listId, { // actualiza la llamada a 'addListMembers'
    members: members.map((member) => {
      return {
        email_address: member.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: member.firstName,
          LNAME: member.lastName
        }
      };
    })
  });

  return response.add_count;
}

async function getMembersFromList(listId: string): Promise<Contact[]> {
  const response = await lists.getListMembersInfo(listId); // actualiza la llamada a 'getListMembersInfo'

  return response.members.map((member) => {
    return {
      firstName: member.merge_fields.FNAME,
      lastName: member.merge_fields.LNAME,
      email: member.email_address
    };
  });
}

export async function syncContacts(contacts: Contact[]): Promise<SyncedContacts> {
  const listName = 'Name of developer';
  const listId = await createList(listName);
  const addedCount = await addMembersToList(listId, contacts);
  const syncedContacts: SyncedContacts = {
    syncedContacts: addedCount,
    contacts: await getMembersFromList(listId)
  };
  
  return syncedContacts;
}

export default {
  addMembersToList,
  getMembersFromList,
  syncContacts,
};
