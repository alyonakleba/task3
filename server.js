/**
 * Simple server
 * @author alyonakleba
 * @version 1.0
 * @updated 2017-03-09
 */
var http = require('http');
var static = require('node-static');
var url = require('url');
var multiparty = require('multiparty');
var file = new static.Server('.');

/**
 * Parse request and send some response data
 * @param request
 * @param response
 * @returns {boolean}
 */
function run(request, response) {
    var urlParsed = url.parse(request.url, true);
    response.setHeader('Cache-Control', 'no-cache');

    if (urlParsed.pathname == '/getData') {
        response.end(wrapResponse('Some data from server'));
        return true;
    } else if (urlParsed.pathname == '/postData') {
        var form = new multiparty.Form();
        form.parse(request, function (err, fields, files) {
            var sendingData = (fields.postField[0].length > 0 ) ? fields.postField[0] : 'is empty';
            var responseData = 'Your sending data: ' + sendingData;
            response.end(wrapResponse(responseData));
        });
        return true;
    } else {
        file.serve(request, response);
        return true;
    }
}

/**
 * Wrap response data before return it
 * @param responseData
 * @returns {string}
 */
function wrapResponse(responseData) {
    return '<script>parent.requestObject.registry[window.name](' + JSON.stringify(responseData) + ')</script>';
}

/**
 * Run server
 */
if (!module.parent) {
    http.createServer(run).listen(8080);
} else {
    exports.run = run;
}
