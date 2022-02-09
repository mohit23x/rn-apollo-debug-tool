/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getOperationName } from '@apollo/client/utilities';
import type { Flipper } from 'react-native-flipper';
import { getQueries, getQueryData } from './flipperUtils';
import type { ApolloClientType, MutationData, QueryData } from './typings';


let counter = 0;

function getTime():string{
  const date=new Date()
  return `${date.getHours()}:${date.getMinutes()}`
}

function extractQueries(client: ApolloClientType): Map<any, any> {
  // @ts-expect-error queryManager is private method
  if (!client || !client.queryManager) {
    return new Map();
  }
  // @ts-expect-error queryManager is private method
  return client.queryManager.queries;
}



function getAllQueries(client: ApolloClientType): Array<QueryData | undefined> {

  // console.log("==========")
  // console.log("queries: ", client.queryManager.queries);
  // console.log("==========")

  const queryMap = extractQueries(client);

  const allQueries = getQueries(queryMap);



  return allQueries?.map(getQueryData);
}

function getMutationData(allMutations): Array<MutationData> {
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

function getAllMutations(client: ApolloClientType): Array<MutationData> {
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
): void => {
  const logger = (logs): void => {
    counter++;

    const payload = {
      id: counter,
      lastUpdateAt: getTime(),
      queries: getAllQueries(apolloClient),
      mutations: getAllMutations(apolloClient),
      cache: apolloClient.cache.extract(true),
    };


    flipperConnection.send('gql:data', payload);

    // if (currentConnection !== null) {
    //   currentConnection.send('broadcast:new', enqueued)
    // }
  };

  const initial = {
    id: 'initial',
    lastUpdateAt: getTime(),
    queries: getAllQueries(apolloClient),
    mutations: getAllMutations(apolloClient),
    cache: apolloClient.cache.extract(true),
  };

  //   console.log({ initial: JSON.stringify(initial.cache) });

  // console.log("initial");
  // console.log(initial.mutations);

  flipperConnection.send('gql:data', initial);

  // @ts-expect-errors
  apolloClient.__actionHookForDevTools(logger);
};
