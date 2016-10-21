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

    var INTENT_NAME = '/application/json/print/com.iwc-sample.capitalize';

    var iwc = new ozpIwc.Client(iwcSampleConfig.iwcHost);

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

        intentLog.append('<div>' +
            '<label>[' + intentUtils.getTimeString() + '] </label>' +
            '<label>Input: </label>' + value + ' ' +
            '<label>Capitalized: </label>' + output +
            '</div>');

        intentLog.scrollTop(intentLog[0].scrollHeight);

        return output;
    };

    functionRef.register(metaData, capitalizeInput)
        .then(function() {
            $('#intent-name').text(INTENT_NAME);
        }).catch(function(error) {
            $('#intent-name').text('Intent registration failed: ' + error);
        });

    $('#clear-log').click(function() {
        $('.intent-log').empty();
    });
})();
