/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getOperationName } from "@apollo/client/utilities";
import type { Flipper } from "react-native-flipper";
import { getQueries, getQueryData } from "./flipperUtils";
import type { ApolloClientType } from "./typings";

let counter = 0;

function getAllQueries(client: ApolloClientType) {
  // @ts-expect-error todo
  if (!client || !client.queryManager) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  // @ts-expect-error todo
  const allQueries = getQueries(client.queryManager.queries);

  return allQueries?.map(getQueryData);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getMutationData(allMutations) {
  return [...Object.keys(allMutations)]?.map((key) => {
    const { mutation, variables, loading, error } = allMutations[key];

    // console.log({ key });
    // console.log(JSON.stringify(allMutations[key]));
    return {
      id: key,
      name: getOperationName(mutation),
      variables,
      loading,
      error,
      body: mutation?.loc?.source?.body,
    };
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getAllMutations(client: ApolloClientType) {
  // @ts-expect-error todo todo
  const allMutations = client.queryManager.mutationStore || {};

  //   console.log('allmiutaion: ', JSON.stringify(allMutations));

  const final = getMutationData(allMutations);

  //   console.log(' ');
  //   console.log(JSON.stringify(final));

  return final;
}

export const initializeFlipperUtils = (
  flipperConnection: Flipper.FlipperConnection,
  apolloClient: ApolloClientType,
) => {
  const logger = ({
    // @ts-ignore
    state: { queries, mutations },
    // @ts-ignore
    dataWithOptimisticResults,
  }): void => {
    counter++;

    // console.log('queries', JSON.stringify(queries));
    // console.log('mutations', JSON.stringify(mutations));
    // console.log('inspector', JSON.stringify(inspector));

    const payload = {
      id: counter,
      queries: getAllQueries(apolloClient),
      mutations: getAllMutations(apolloClient),
      cache: apolloClient.cache.extract(true),
    };

    // console.log('logger: ', payload?.mutations);
    // console.log(' ');
    console.log({ initial: JSON.stringify(payload.cache) });

    flipperConnection.send("gql:data", payload);

    // if (currentConnection !== null) {
    //   currentConnection.send('broadcast:new', enqueued)
    // }
  };

  const initial = {
    id: "initial",
    queries: getAllQueries(apolloClient),
    mutations: getAllMutations(apolloClient),
    cache: apolloClient.cache.extract(true),
  };

  //   console.log({ initial: JSON.stringify(initial.cache) });

  console.log("initial");
  console.log(initial.mutations);

  flipperConnection.send("gql:data", initial);

  // @ts-expect-errors
  apolloClient.__actionHookForDevTools(logger);
};
