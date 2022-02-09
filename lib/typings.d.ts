import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
export declare type ApolloClientType = ApolloClient<NormalizedCacheObject>;
export interface Query {
    id: number;
    name: string | null;
    variables: object;
}
export declare type QueryData = Query & {
    queryString: string;
    cachedData: object;
};
export declare type MutationData = {
    id: string;
    name: string | null;
    variables: object;
    loading: boolean;
    error: object;
    body: object;
};
