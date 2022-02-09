import { getOperationName } from "@apollo/client/utilities";
import { print } from "graphql";
let done = true;
export function getQueryData(query, key) {
    if (!query || !query.document)
        return;
    // TODO: The current designs do not account for non-cached data.
    // We need a workaround to show that data + we should surface
    // the FetchPolicy.
    const name = getOperationName(query === null || query === void 0 ? void 0 : query.document);
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
export function getQueries(queryMap) {
    let queries = [];
    if (queryMap) {
        // @ts-expect-error todo
        queries = [...queryMap.values()].map(({ document, variables, diff }) => {
            var _a;
            return ({
                document,
                source: (_a = document === null || document === void 0 ? void 0 : document.loc) === null || _a === void 0 ? void 0 : _a.source,
                variables,
                cachedData: diff === null || diff === void 0 ? void 0 : diff.result,
            });
        });
    }
    return queries;
}
