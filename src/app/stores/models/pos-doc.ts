export interface PosDoc {
    id: string;
    created?: Date;
    createdBy?: string;
    updatedBy?: string;
    lastUpdated?: Date;
    activated?: boolean;

    // couchdb refeerence
    _id?: string;
    _rev?: string;
}