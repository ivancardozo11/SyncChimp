interface SyncedContact {
    email: string;
    firstName:string;
    lastName:string;
}

interface SyncedContacts  {
    syncedContacts: number;
    contacts: SyncedContact[];

}

export { SyncedContact, SyncedContacts };