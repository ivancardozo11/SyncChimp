import axios from 'axios';

async function recreateList(name) {
  // Get all created lists
  const listsResponse = await axios.get(`https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists`, {
    auth: {
      username: 'anystring',
      password: process.env.MAILCHIMP_API_KEY,
    },
  });

  // Check if a list already exists, and if it does, delete it if the name is not "Ivan Cardozo"
  if (listsResponse.data.lists.length > 0) {
    const existingList = listsResponse.data.lists.find((list) => list.name !== 'Ivan Cardozo');
    if (existingList) {
      await axios.delete(`https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${existingList.id}`, {
        auth: {
          username: 'anystring',
          password: process.env.MAILCHIMP_API_KEY || '',
        },
      });
    }
  }

  // Create a new list with the necessary data
  const response = await axios.post(
    `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists`,
    {
      name: 'Ivan Cardozo',
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
    },
    {
      auth: {
        username: 'anystring',
        password: process.env.MAILCHIMP_API_KEY || '',
      },
    }
  );

  // Return the ID of the created list
  return response.data.id;
}

export { recreateList };
