/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getOperationName } from "@apollo/client/utilities";
import { getQueries, getQueryData } from "./flipperUtils";
let counter = 0;
function getAllQueries(client) {
    // @ts-expect-error todo
    if (!client || !client.queryManager) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => { };
    }
    // @ts-expect-error todo
    const allQueries = getQueries(client.queryManager.queries);
    return allQueries === null || allQueries === void 0 ? void 0 : allQueries.map(getQueryData);
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
    const logger = ({ 
    // @ts-ignore
    state: { queries, mutations }, 
    // @ts-ignore
    dataWithOptimisticResults, }) => {
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
