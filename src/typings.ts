import type { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export type ApolloClientType = ApolloClient<NormalizedCacheObject>;

export interface Query {
  id: number;
  name: string | null;
  variables: object;
}
