import lists  from '@mailchimp/mailchimp_marketing';
import { recreateList } from './listRecreationService.js';

/**
 * Add the given member to the Mailchimp list with the given ID.
 * 
 * @param listId The ID of the Mailchimp list to add the member to.
 * @param member The member to add to the Mailchimp list.
 * @returns The number of members added to the Mailchimp list.
 */
async function addMembersToList(listId, members) {
  let addedCount = 0; // Inicializar el contador de miembros añadidos a cero
  
  // Recorrer cada miembro en la lista de miembros a agregar
  for (const member of members) {
    try {
      // Agregar el miembro actual a la lista en Mailchimp
      await lists.addListMember(listId, {
        email_address: member.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: member.firstName,
          LNAME: member.lastName
        }
      });
      addedCount++; // Incrementar el contador de miembros añadidos si la solicitud fue exitosa
    } catch (error) {
      // Manejar cualquier error que se produzca al agregar el miembro a la lista
      console.error(`Error adding member ${member.email} to list ${listId}: ${error}`);
    }
  }
  
  return addedCount; // Devolver el número total de miembros añadidos
}

/**
 * Get the list of members from the Mailchimp list with the given ID.
 * 
 * @param listId The ID of the Mailchimp list to get members from.
 * @returns The list of members from the Mailchimp list.
 */
async function getMembersFromList(listId) {
  const response = await lists.getListMembersInfo(listId);
  return response.members.map((member) => {
    return {
      firstName: member.merge_fields.FNAME,
      lastName: member.merge_fields.LNAME,
      email: member.email_address
    };
  });
}

/**
 * Synchronize the contacts from the given list with the Mailchimp list.
 * 
 * @param contacts The list of contacts to synchronize with the Mailchimp list.
 * @param listName The name of the list to use in Mailchimp.
 * @returns The number of synced contacts and the list of contacts in the Mailchimp list.
 */
export async function syncContactsToMailchimp(contacts, listName) {
  const listId = await recreateList(listName); // Recreate the list if necessary and get the ID of the list

  let addedCount = 0;
  for (const member of contacts) { // Add each member to the Mailchimp list
    addedCount += await addMembersToList(listId, member);
  }

  const syncedContacts = {
    syncedContacts: addedCount, // The number of synced contacts
    contacts: await getMembersFromList(listId) // The list of contacts in the Mailchimp list
  };

  return syncedContacts; // Return the synced contacts
}

export { addMembersToList, getMembersFromList };