module.exports = (apiRootUrl, routes, services) => {
    console.log("api 404 path: " + apiRootUrl + '/{p*}'); 
    var apiNotFound = apiRootUrl + "/notFound"
    var router = routes.filter(r=>r.path == apiNotFound)[0]
    router && routes.push({
        method: '*',
        path: apiRootUrl + '/{p*}',
        config: router.config
    });

    return routes;
}
 
