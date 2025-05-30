import { APIClient, CollectionFieldInterface } from '@nocobase/client';
export declare const getFieldTitle: ({ field }: {
    field: CollectionFieldInterface;
}) => string;
export declare const useCreateCollectionField: () => {
    run(): Promise<void>;
};
export declare const useAsyncDataSource: (api: APIClient) => (field: any) => Promise<any>;
