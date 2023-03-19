import mailchimp from "@mailchimp/mailchimp_marketing";
import { recreateList } from '../../../api/services/listRecreationService';
import dotenv from 'dotenv';

jest.mock("@mailchimp/mailchimp_marketing");

dotenv.config();
const apiKey = process.env.MAILCHIMP_API_KEY;
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
/*
This test file imports necessary modules such as Mailchimp API, dotenv and a function called recreateList from listRecreationService.js. 
It then sets up mock functions and configures the API key and server prefix. The test suite describe is set to test the recreateList function.

The first test case is checking if a new list is created when it doesn't exist. 
It sets mock responses for the getAllLists and createList functions from Mailchimp API. 
The test case then calls the recreateList function and expects the mock functions to have been called and the output to equal the mocked response.

The second test case checks if an existing list is used when it exists. 
It sets a mock response for getAllLists function from Mailchimp API. 
The test case then calls the recreateList function and expects the getAllLists function to have been called once, 
createList function not to have been called, and the output to equal the existing list's ID.
*/
mailchimp.setConfig({
  apiKey: apiKey,
  server: `${serverPrefix}`
});

describe("recreateList", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new list if it does not exist", async () => {
    const mockResponse = { id: "abc123" };
    mailchimp.lists.getAllLists.mockResolvedValueOnce({ lists: [] });
    mailchimp.lists.createList.mockResolvedValueOnce(mockResponse);

    const result = await recreateList("My New List");

    expect(mailchimp.lists.getAllLists).toHaveBeenCalledTimes(1);
    expect(mailchimp.lists.createList).toHaveBeenCalledTimes(1);
    expect(mailchimp.lists.createList).toHaveBeenCalledWith({
      name: "My New List",
      contact: {
        company: "My company",
        address1: "123 Main Street",
        address2: "",
        city: "Anytown",
        state: "CA",
        zip: "12345",
        country: "US",
        phone: "",
      },
      permission_reminder: "You have subscribed to our newsletter",
      use_archive_bar: true,
      campaign_defaults: {
        from_name: "Juan Perez",
        from_email: "juan.perez@mycompany.com",
        subject: "Subscribe to our newsletter",
        language: "en",
      },
      notify_on_subscribe: "",
      notify_on_unsubscribe: "",
      email_type_option: true,
      visibility: "prv",
    });
    expect(result).toEqual("abc123");
  });

  it("should use an existing list if it exists", async () => {
    const mockResponse = {
      lists: [
        {
          id: "xyz789",
          name: "My Existing List",
        },
      ],
    };
    mailchimp.lists.getAllLists.mockResolvedValueOnce(mockResponse);

    const result = await recreateList("My Existing List");

    expect(mailchimp.lists.getAllLists).toHaveBeenCalledTimes(1);
    expect(mailchimp.lists.createList).not.toHaveBeenCalled();
    expect(result).toEqual("xyz789");
  });
});
