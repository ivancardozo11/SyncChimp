import axios from 'axios';
import mailchimpConfig from '../../../mailchimp.config';

/**
 * This service checks if a list has already been created in Mailchimp. If a list with a different name
 * is found, it deletes the existing list and creates a new one with the name "Ivan Cardozo". If no
 * list with a different name is found, it creates a new list with the name "Ivan Cardozo". It returns
 * the ID of the created list.
 *
 * @param name The name of the list to create
 * @returns The ID of the created list
 */
async function recreateList(name: string): Promise<string> {
  // Get all created lists
  const listsResponse = await axios.get(`https://${mailchimpConfig.server}.api.mailchimp.com/3.0/lists`, {
    auth: {
      username: 'anystring',
      password: mailchimpConfig.apiKey,
    },
  });

  // Check if a list already exists, and if it does, delete it if the name is not "Ivan Cardozo"
  if (listsResponse.data.lists.length > 0) {
    const existingList = listsResponse.data.lists.find((list) => list.name !== 'Ivan Cardozo');
    if (existingList) {
      await axios.delete(`https://${mailchimpConfig.server}.api.mailchimp.com/3.0/lists/${existingList.id}`, {
        auth: {
          username: 'anystring',
          password: mailchimpConfig.apiKey || '',
        },
      });
    }
  }

  // Create a new list with the necessary data
  const response = await axios.post(
    'https://${mailchimpConfig.server}.api.mailchimp.com/3.0/lists',
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
        password: mailchimpConfig.apiKey || '',
      },
    }
  );

  // Return the ID of the created list
  return response.data.id;
}

export { recreateList };
