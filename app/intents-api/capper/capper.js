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

    // Initialize the connection status display
    getConnectionStatusHandler(false)();

    var INTENT_NAME = '/application/json/print/com.clabas.capitalize';

    var iwc = new ozpIwc.Client('http://localhost:13000');

    // Only need to call connect() explicitly when we need to handle the promise it returns
    iwc.connect()
        .then(getConnectionStatusHandler(true))
        .catch(getConnectionStatusHandler(false));

    var functionRef = new iwc.intents.Reference(INTENT_NAME);

    var metaData = {
        label: 'Capper',
        icon: 'https://a2ua.com/alert/alert-001.jpg'
    };

    var capitalizeInput = function(value) {
        var intentLog = $('.intent-log');
        var output = value.toUpperCase();

        intentLog.append('<div><label>[' + intentUtils.getTimeString() + '] </label>'+ output + '</div>');
        intentLog.scrollTop(intentLog[0].scrollHeight);

        return output;
    };

    functionRef.register(metaData, capitalizeInput)
        .then(function() {
            $('#intent-name').text(INTENT_NAME);
        }).catch(function(error) {
            $('#intent-name').text('Intent registration failed: ' + error);
        });
})();
