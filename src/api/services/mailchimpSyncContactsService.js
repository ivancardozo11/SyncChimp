import mailchimp from '@mailchimp/mailchimp_marketing';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// This function retrieves information about the existing members in a Mailchimp list
 async function getExistingMembers(listId) {
  try {
    // Use the Mailchimp API to retrieve information about the list's members
    const existingMembersResponse = await mailchimp.lists.getListMembersInfo(listId, { count: 1000 });
    // Extract the list members from the API response
    const existingMembers = existingMembersResponse.members;
    // Return the list members
    return existingMembers;
  } catch (error) {
    if (error.response) {
      console.error(`Mailchimp responded with an error: ${error.response.status} - ${error.response.data.title}`);
    } else if (error.request) {
      console.error(`No response received from Mailchimp. Request details: ${error.request}`);
    } else {
      console.error(`An error occurred while sending the request to Mailchimp: ${error.message}`);
    }
    // Check if the error message indicates that the member does not exist
    if (error.code.includes(' ENOTFOUND ')) {
      // If so, return an empty array to indicate that the member does not exist
      console.log('Error recuperando el miembro, es posible que ya exista')
    }
    // If an error occurs for another reason, throw an exception
    throw new Error('Failed to get existing members from Mailchimp list.');
  }
}


// This function creates a new Mailchimp member object from the specified contact
function createMemberObject(contact) {
  // Generate a unique identifier
  const id = uuidv4();
  // Extract the last 6 characters of the identifier and append them to the domain name
  const emailParts = contact.email.split('@');
  const username = emailParts[0];
  const domain = emailParts[1];
  const uniqueEmail = `${username}${id.replace(/-/g, '').slice(0, 6)}@${domain}`;
  // Define the member object with the required email address, subscription status, and merge fields
  const member = {
    email_address: uniqueEmail,
    status: 'subscribed',
    merge_fields: {
      FNAME: contact.firstName,
      LNAME: contact.lastName
    }
  };
  // Return the member object
  return member;
}

// This function generates a response object containing the number of synced contacts and their details
function generateSyncedContactsResponse(addedCount, members) {
  // Calculate the total number of synced contacts
  const syncedContacts = {
    syncedContacts: addedCount,
    // Map the existing members to a list of objects containing their first name, last name, and email address
    contacts: members.map((member) => {
      return {
        firstName: member.merge_fields.FNAME,
        lastName: member.merge_fields.LNAME,
        email: member.email_address
      };
    })
  };
  // Return the synced contacts response object
  return syncedContacts;
}

// This function adds new members to the specified Mailchimp list
// This function adds new members to the specified Mailchimp list
async function addMembersToList(listId, contacts) {
  try {
    // Get existing members in the list
    const existingMembers = await getExistingMembers(listId);

    // Check if the email addresses of the new contacts already exist in the list
    const existingEmails = existingMembers.map((member) => member.email_address.toLowerCase());
    const newEmails = contacts.map((contact) => contact.email.toLowerCase());
    const commonEmails = existingEmails.filter((email) => newEmails.includes(email));
    // Filter out the existing contacts
    const filteredContacts = contacts.filter((contact) => !commonEmails.includes(contact.email.toLowerCase()));
    // Create member objects for the new contacts
    const members = filteredContacts.map(createMemberObject);

    // Add the new contacts to the Mailchimp list
    const response = await axios.post(`https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${listId}`, { members }, {
      auth: {
        username: 'apikey',
        password: process.env.MAILCHIMP_API_KEY
      }
    });

    // Check if any members were rejected due to an invalid email address
    if (response.data.error_count > 0 && response.data.errors[0].error_code === 'ERROR_GENERIC') {
      throw new Error('One or more email addresses are invalid.');
    }

    // Check if any members were added to the list
    if (response.data.new_members.length === 0) {
      throw new Error('No new members were added to the Mailchimp list.');
    }

    console.log(`Successfully added ${response.data.total_created} contacts`);
    const syncedMembers = generateSyncedContactsResponse(members.length, members);
    return { 
      response, 
      syncedMembers 
    };

  } catch (error) {
    if (error.response && error.response.status === 400 && error.response.data.title === 'Member Exists') {
      console.error(`One or more contacts already exist in the Mailchimp list.`);
      return error.response;
    } else if (error.response) {
      console.error(`Mailchimp responded with an error: ${error.response.status} - ${error.response.data.title}`);
    } else if (error.request) {
      console.error(`No response received from Mailchimp. Request details: ${error.request}`);
    } else {
      console.error(`An error occurred while sending the request to Mailchimp: ${error.message}`);
    }
    throw new Error('Failed to add contacts to Mailchimp list.');
  }
}


  // Export the necessary functions for external use
  export {
  getExistingMembers,
  createMemberObject,
  addMembersToList,
  generateSyncedContactsResponse
  };