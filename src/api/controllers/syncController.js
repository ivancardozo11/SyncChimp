import syncService from '../services/mockApiSyncService.js';

const syncContacts = async (req, res) => {
  try {

    const syncedContacts = await syncService();

    const response = {
      syncedContacts: syncedContacts.contacts.length,
      contacts: syncedContacts.contacts,
    };

    const json = JSON.stringify(response);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(json);

  } catch (error) {
    console.error(error);

    let status, message;

    if (error.response && error.response.status === 403) {
      status = 401;
      message = 'Unauthorized - insufficient permissions to access the Mailchimp API';
    } else if (error.response && error.response.status >= 400 && error.response.status < 500) {
      status = error.response.status;
      message = 'Error connecting to the MockAPI';
    } else if (error.message === 'Mailchimp error') {
      status = 502;
      message = 'Bad Gateway - Mailchimp API error';
    } else if (error.message === 'Request error') {
      status = 503;
      message = 'Service Unavailable - could not complete the request to Mailchimp';
    } else if (error.message === 'Processing error') {
      status = 500;
      message = 'Internal Server Error - error processing the request';
    } else {
      status = 500;
      message = 'Internal Server Error';
    }

    res.status(status).send({ error: message, details: error.stack });
  }
};

export default syncContacts;
