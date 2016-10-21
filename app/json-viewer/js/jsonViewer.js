(function() {
    var getConnectionStatusHandler = function(connected) {
        var connectionContainer = $('.connection-container');
        var connectionText = $('#connection');

        if (connected) {
            return function() {
                connectionText.text('Connected: ' + iwc.address);
                connectionContainer.addClass('connected');
            };
        }
        else {
            return function (error) {
                connectionText.text('Not Connected');
                connectionContainer.removeClass('connected');
                if (error) {
                    console.log('Connection error: ', error);
                }
            };
        }
    };

    var INTENT_NAME = '/application/json/print/com.iwc-sample.json-viewer';

    // Initialize the connection status display
    getConnectionStatusHandler(false)();

    var iwc = new ozpIwc.Client(iwcSampleConfig.iwcHost);
    // var iwc = new ozpIwc.Client('https://localhost:4440/iwc');

    // Only need to call connect() explicitly when we need to handle the promise it returns
    iwc.connect()
        .then(getConnectionStatusHandler(true))
        .catch(getConnectionStatusHandler(false));

    var functionRef = new iwc.intents.Reference(INTENT_NAME);

    var metaData = {
        label: 'JSON Viewer',
        icon: undefined
    };

    var renderJson = function(value) {
        $('.json pre').text(JSON.stringify(value, null, 2));

        return 'Printed JSON successfully';
    };

    functionRef.register(metaData, renderJson)
        .then(function() {
            $('#intent-name').text(INTENT_NAME);
        }).catch(function(error) {
            $('#intent-name').text('Intent registration failed: ' + error);
        });
})();
