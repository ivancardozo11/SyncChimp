import mailchimp from '@mailchimp/mailchimp_marketing';
import configureMailchimp from '../../../mailchimp.config';

configureMailchimp();

const addMembersToList = async (members: any) => {
  try {
    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID!, {
      email_address: members[0].email_address,
      status: members[0].status,
      merge_fields: {
        FNAME: members[0].merge_fields.FNAME,
        LNAME: members[0].merge_fields.LNAME
      }
    });

    return {
      total_created: 1,
      new_members: [response]
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error adding members to Mailchimp list');
  }
};

export default {
  addMembersToList,
};
