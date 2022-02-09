import type { QueryInfo } from "@apollo/client/core/QueryInfo";
import { getOperationName } from "@apollo/client/utilities";
import { print } from "graphql";
import type { Query } from "./typings";

type WatchedQuery = Query & {
  queryString: string;
  cachedData: object;
};

let done = true;

export function getQueryData(query, key: number): WatchedQuery | undefined {
  if (!query || !query.document) return;
  // TODO: The current designs do not account for non-cached data.
  // We need a workaround to show that data + we should surface
  // the FetchPolicy.
  const name = getOperationName(query?.document);
  if (name === "IntrospectionQuery") {
    return;
  }

  if (done) {
    console.log("asdfasdf");
    console.log(JSON.stringify(query));
    done = false;
    return;
  }

  return {
    id: key,
    name,
    queryString: print(query.document),
    variables: query.variables,
    cachedData: query.cachedData,
  };
}

export function getQueries(queryMap): QueryInfo[] {
  let queries: QueryInfo[] = [];

  if (queryMap) {
    // @ts-expect-error todo
    queries = [...queryMap.values()].map(({ document, variables, diff }) => ({
      document,
      source: document?.loc?.source,
      variables,
      cachedData: diff?.result,
    }));
  }

  return queries;
}
