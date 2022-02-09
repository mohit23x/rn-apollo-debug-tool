import type { QueryInfo } from "@apollo/client/core/QueryInfo";
import type { Query } from "./typings";
declare type WatchedQuery = Query & {
    queryString: string;
    cachedData: object;
};
export declare function getQueryData(query: any, key: number): WatchedQuery | undefined;
export declare function getQueries(queryMap: any): QueryInfo[];
export {};
