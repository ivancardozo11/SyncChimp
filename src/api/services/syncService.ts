import axios from 'axios';
import mailchimpService from './mailchimp';
import { Contact } from '../types/contacts';
import { SyncedContacts } from '../types/syncedContacts';

const syncService = async (): Promise<SyncedContacts> => {
  try {
    const { data: contacts } = await axios.get<Contact[]>('https://challenge.trio.dev/api/v1/contacts');

    const members = contacts.map(({ firstName, lastName, email }) => ({
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    }));

    const newMembers = await mailchimpService.addMembersToList(members);

    return {
      syncedContacts: newMembers.total_created,
      contacts: newMembers.new_members.map((member: any) => ({
        email: member.email_address,
        firstName: member.merge_fields.FNAME,
        lastName: member.merge_fields.LNAME,
      })),
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error syncing contacts');
  }
};

export default syncService;
