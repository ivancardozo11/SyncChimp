import mailchimp from '@mailchimp/mailchimp_marketing';

// This function retrieves information about the existing members in a Mailchimp list
async function getExistingMembers(listId) {
  try {
    // Use the Mailchimp API to retrieve information about the list's members
    const existingMembersResponse = await mailchimp.lists.getListMembersInfo(listId, { count: 50 });
    // Extract the list members from the API response
    const existingMembers = existingMembersResponse.members;
    // Return the list members
    return existingMembers;
  } catch (error) {
    // If an error occurs, throw an exception
    throw new Error('Failed to get existing members from Mailchimp list.');
  }
}

// This function creates a new Mailchimp member object from the specified contact
function createMemberObject(contact) {
  // Define the member object with the required email address, subscription status, and merge fields
  const member = {
    email_address: contact.email,
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
function generateSyncedContactsResponse(addedCount, existingMembers) {
  // Calculate the total number of synced contacts
  const syncedContacts = {
    syncedContacts: addedCount + existingMembers.length,
    // Map the existing members to a list of objects containing their first name, last name, and email address
    contacts: existingMembers.map((member) => {
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
async function addMembersToList(listId, contacts) {
  try {
    // Initialize an empty array to hold the new members
    const members = [];
    // Initialize an empty object to hold the email addresses and IDs of existing members
    const existingEmails = {};

    // Get the list of existing members for the specified list ID
    const existingMembers = await getExistingMembers(listId);

    // Store the email addresses and IDs of existing members in the existingEmails object
    existingMembers.forEach(member => {
      existingEmails[member.email_address] = member.id;
    });

    // Initialize counters for the number of formatted and existing members
    let formattedCount = 0;
    let existingCount = 0;
    // Loop through the contacts to be added
    for (const contact of contacts) {
      // Check if the contact's email address already exists in the Mailchimp list
      const memberId = existingEmails[contact.email];

      // If the email address does not exist, create a new member object and add it to the members array
      if (!memberId) {
        // Create the member object
        const member = createMemberObject(contact);
        // Add the member object to the members array
        members.push(member);
        // Increment the formatted count
        formattedCount++;
      } else {
        // If the email address exists, log a message and increment the existing count
        existingCount++;
      }
    }

    // Use the Mailchimp API to batch add the new members to the specified list
    const response = await mailchimp.lists.batchListMembers(listId, {
      members: members,
      update_existing: true
    });

    //
    // If there are any errors in the API response, log them and throw an exception
    if (response.errors.length > 0) {
    for (const error of response.errors) {
    console.error(`Mailchimp error: ${error.error}`);
    }
    throw new Error('Failed to add contacts to Mailchimp list.');
    }
    // Log the number of members added (if any) and return the count
const addedCount = response.add_count || 0;

// Log the synced contacts response object and return it
console.log(`Successfully added ${addedCount} new contacts as audience members. Formatted: ${formattedCount}, Existing in mailchimp: ${existingCount}`);
return {
  existingMembers: existingMembers,
  addedCount: addedCount
};
} catch (error) {
  // If an error occurs, log the details and throw an exception
  if (error.response) {
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
  addMembersToList,
  getExistingMembers,
  createMemberObject,
  generateSyncedContactsResponse
  };