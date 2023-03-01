import syncService from '../services/mockApiSyncService.js'; // Import the syncService function from the mockApiSyncService module

const syncContacts = async (req, res) => { // Define an asynchronous function called syncContacts that takes a request object and a response object as arguments
  try {
    const syncedContacts = await syncService(); // Call the syncService function to synchronize contacts and wait for it to complete
    const response = { // Create a response object
      success: true, // Set a success flag to true
      data: syncedContacts, // Add the synced contacts to the response data
    };
    res.status(200).send(response); // Send the response with a 200 status code
  } catch (error) {
    console.error(error); // Log any errors that occur during the synchronization process
    res.status(500).send({ error: 'Internal Server Error' }); // Send an error response with a 500 status code
  }
};

export default syncContacts; // Export the syncContacts function as the default export of this module
