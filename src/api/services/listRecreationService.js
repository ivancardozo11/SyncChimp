import mailchimp from "@mailchimp/mailchimp_marketing";


async function recreateList(name) {
  try {
    // Get all created lists
    const { lists } = await mailchimp.lists.getAllLists();
    // Check if a list already exists with the specified name
    const existingList = lists.find((list) => list.name === name);
    if (existingList) {
      // If the list already exists, return its ID without creating a new one
      console.log(`Using existing list "${name}" with ID ${existingList.id}.`);
      return existingList.id;
    } else {
      // If the list does not exist, create a new one with the specified name
      const response = await mailchimp.lists.createList({
        name: name,
        contact: {
          company: 'My company',
          address1: '123 Main Street',
          address2: '',
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
          country: 'US',
          phone: '',
        },
        permission_reminder: 'You have subscribed to our newsletter',
        use_archive_bar: true,
        campaign_defaults: {
          from_name: 'Juan Perez',
          from_email: 'juan.perez@mycompany.com',
          subject: 'Subscribe to our newsletter',
          language: 'en',
        },
        notify_on_subscribe: '',
        notify_on_unsubscribe: '',
        email_type_option: true,
        visibility: 'prv',
      });
      // Return the ID of the created list
      console.log(`List "${name}" successfully recreated with ID ${response.id}.`);
      return response.id;
    }
  } catch (error) {
    if (error.status) {
      // Error with the Mailchimp API
      console.error(`Mailchimp API error ${error.status}: ${error.detail}`);
      throw new Error(`Mailchimp API error ${error.status}: ${error.detail}`);
    } else if (error.request) {
      // Error making the request to Mailchimp
      console.error(`Could not connect to Mailchimp API: ${error.request}`);
      throw new Error('Could not connect to Mailchimp API');
    } else {
      // Other error
      console.error(`An error occurred while processing the request: ${error.message}`);
      throw new Error(`Request processing error: ${error.message}`);
    }
  }
}


export { recreateList };

