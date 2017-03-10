/**
 * Object for send GET or POST request with Iframe
 * @type {{registry: {}, getRandomName: requestObject.getRandomName, createIframe: requestObject.createIframe, sendRequest: requestObject.sendRequest, getRequest: requestObject.getRequest, postRequest: requestObject.postRequest, showResponse: requestObject.showResponse}}
 * @author alyonakleba
 * @version 1.0
 * @updated 2017-03-09
 */
var requestObject = {

    /**
     * Registry of callbacks
     */
    registry: {},

    /**
     * Generate random name for iframe
     * @returns {number}
     */
    getRandomName: function () {
        return Math.random();
    },

    /**
     * Create iframe
     * @param {string} name Iframe name
     * @param {string} src Url for request
     * @returns {Node} Iframe object
     */
    createIframe: function (name, src) {
        src = src || 'javascript:false';
        var element = document.createElement('div');
        element.innerHTML = '<iframe name="' + name + '" id="' + name + '" src="' + src + '" style="display:none;">';
        var iframe = element.firstChild;
        document.body.appendChild(iframe);
        return iframe;
    },

    /**
     * Send request to server
     * @param {string} iframeName Iframe name
     * @param {string} url Url for request
     */
    sendRequest: function (iframeName, url) {
        var requestStatus = false;
        var iframe = requestObject.createIframe(iframeName, url);

        //Add callback into registry
        requestObject.registry[iframeName] = function (data) {
            requestStatus = true;
            requestObject.showResponse(data);
        };

        //Set iframe handle
        iframe.onload = function () {
            iframe.parentNode.removeChild(iframe);
            delete requestObject.registry[iframeName];
            if (!requestStatus) requestObject.showResponse(false);
        };
    },

    /**
     * Send GET request
     * @param {string} url Url for request
     */
    sendGetRequest: function (url) {
        var iframeName = requestObject.getRandomName();
        requestObject.sendRequest(iframeName, url);
    },

    /**
     * Send form data
     * @param {string} url Url for request
     * @param formId
     */
    sendPostRequest: function (url, formId) {
        var iframeName = requestObject.getRandomName();
        requestObject.sendRequest(iframeName, url);

        var form = document.getElementById(formId);
        form.method = "POST";
        form.enctype = "multipart/form-data";
        form.action = url;
        form.target = iframeName;
        form.submit();
    },

    /**
     * Show response data
     * @param response
     */
    showResponse: function (response) {
        response = response || "Some error was occurred";
        document.getElementById('responseWrapper').innerHTML = response;
    }

};
