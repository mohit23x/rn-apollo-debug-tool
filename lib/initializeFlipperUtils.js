/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getOperationName } from '@apollo/client/utilities';
import { getQueries, getQueryData } from './flipperUtils';
let counter = 0;
function getTime() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
}
function extractQueries(client) {
    // @ts-expect-error queryManager is private method
    if (!client || !client.queryManager) {
        return new Map();
    }
    // @ts-expect-error queryManager is private method
    return client.queryManager.queries;
}
function getAllQueries(client) {
    // console.log("==========")
    // console.log("queries: ", client.queryManager.queries);
    // console.log("==========")
    const queryMap = extractQueries(client);
    const allQueries = getQueries(queryMap);
    return allQueries === null || allQueries === void 0 ? void 0 : allQueries.map(getQueryData);
}
function getMutationData(allMutations) {
    var _a;
    return (_a = [...Object.keys(allMutations)]) === null || _a === void 0 ? void 0 : _a.map((key) => {
        var _a, _b;
        const { mutation, variables, loading, error } = allMutations[key];
        // console.log({ key });
        // console.log(JSON.stringify(allMutations[key]));
        return {
            id: key,
            name: getOperationName(mutation),
            variables,
            loading,
            error,
            body: (_b = (_a = mutation === null || mutation === void 0 ? void 0 : mutation.loc) === null || _a === void 0 ? void 0 : _a.source) === null || _b === void 0 ? void 0 : _b.body,
        };
    });
}
function getAllMutations(client) {
    // @ts-expect-error todo todo
    const allMutations = client.queryManager.mutationStore || {};
    //   console.log('allmiutaion: ', JSON.stringify(allMutations));
    const final = getMutationData(allMutations);
    //   console.log(' ');
    //   console.log(JSON.stringify(final));
    return final;
}
export const initializeFlipperUtils = (flipperConnection, apolloClient) => {
    const logger = (logs) => {
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
