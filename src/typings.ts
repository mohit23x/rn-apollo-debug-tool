import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export type ApolloClientType = ApolloClient<NormalizedCacheObject>;

export interface Query {
  id: number;
  name: string | null;
  variables: object;
}

export type QueryData = Query & {
  queryString: string;
  cachedData: object;
};

export type MutationData = {
  id: string;
  name: string | null;
  variables: object;
  loading: boolean;
  error: object;
  body: object;
};
