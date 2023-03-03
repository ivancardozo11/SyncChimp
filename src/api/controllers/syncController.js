import syncService from '../services/mockApiSyncService.js';

// Define an asynchronous function called syncContacts that takes a request object and a response object as arguments
const syncContacts = async (req, res) => {
  try {
    // Call the syncService function to synchronize contacts and wait for it to complete
    const syncedContacts = await syncService();
    // Create a response object with a success flag and the synced contacts
    const response = {
      success: true,
      data: syncedContacts,
    };
    // Send the response with a 200 status code
    res.status(200).send(response);
  } catch (error) {
    // Log any errors that occur during the synchronization process
    console.error(error);

    // Define variables to hold the HTTP status code and error message to be sent in the response
    let status, message;

    // Check if the error was caused by insufficient permissions to access the Mailchimp API
    if (error.response && error.response.status === 403) {
      status = 401;
      message = 'Unauthorized - insufficient permissions to access the Mailchimp API';
    // Check if the error was caused by an error connecting to the MockAPI
    } else if (error.response && error.response.status >= 400 && error.response.status < 500) {
      status = error.response.status;
      message = 'Error connecting to the MockAPI';
    // Check if the error was caused by an error in the Mailchimp API
    } else if (error.message === 'Mailchimp error') {
      status = 502;
      message = 'Bad Gateway - Mailchimp API error';
    // Check if the error was caused by the inability to complete the request to Mailchimp
    } else if (error.message === 'Request error') {
      status = 503;
      message = 'Service Unavailable - could not complete the request to Mailchimp';
    // Check if the error was caused by an error processing the request
    } else if (error.message === 'Processing error') {
      status = 500;
      message = 'Internal Server Error - error processing the request';
    // If none of the above errors occurred, assume an internal server error and return a 500 status code
    } else {
      status = 500;
      message = 'Internal Server Error';
    }

    // Send an error response with the appropriate status code and message, as well as the error stack trace for debugging purposes
    res.status(status).send({ error: message, details: error.stack });
  }
};

// Export the syncContacts function as the default export of this module
export default syncContacts;
