import axios from 'axios';
import mailchimpConfig from '../../../mailchimp.config';

/**
 * Este servicio se encarga de verificar si ya existe una lista creada en Mailchimp,
 * la borra y crea una nueva lista con el nombre "Ivan Cardozo".
 * @param name Nombre de la lista a crear
 * @returns El ID de la lista creada
 */
export async function recreateList(name: string): Promise<string> {
  // Obtenemos todas las listas creadas
  const listsResponse = await axios.get(`https://${mailchimpConfig.server}.api.mailchimp.com/3.0/lists`, {
    auth: {
      username: 'anystring',
      password: mailchimpConfig.apiKey,
    },
  });


  // Verificamos si ya existe una lista
  if (listsResponse.data.lists.length > 0) {
    const existingList = listsResponse.data.lists[0];

    // Si existe una lista, la borramos
    await axios.delete(`https://{mailchimpConfig.server}.api.mailchimp.com/3.0/lists/${existingList.id}`, {
      auth: {
        username: 'anystring',
        password: mailchimpConfig.apiKey || '',
      },
    });
  }

  // Creamos la nueva lista con los datos necesarios
  const response = await axios.post(
    'https://{mailchimpConfig.server}.api.mailchimp.com/3.0/lists',
    {
      name: 'Name of developer',
      contact: {
        company: 'Mi empresa',
        address1: '123 Main Street',
        address2: '',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'US',
        phone: '',
      },
      permission_reminder: 'Usted se ha suscrito a nuestro boletín',
      use_archive_bar: true,
      campaign_defaults: {
        from_name: 'Juan Pérez',
        from_email: 'juan.perez@miempresa.com',
        subject: 'Suscríbase a nuestro boletín',
        language: 'es',
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

  // Devolvemos el ID de la lista creada
  return response.data.id;
}
