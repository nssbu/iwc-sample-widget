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

    var INTENT_NAME = '/application/json/print/com.clabas.reverse';

    var iwc = new ozpIwc.Client('http://localhost:13000');

    // Only need to call connect() explicitly when we need to handle the promise it returns
    iwc.connect()
        .then(getConnectionStatusHandler(true))
        .catch(getConnectionStatusHandler(false));

    var functionRef = new iwc.intents.Reference(INTENT_NAME);

    var metaData = {
        label: 'Reverser',
        icon: 'https://d30y9cdsu7xlg0.cloudfront.net/png/62495-200.png'
    };

    var reverseInput = function(value) {
        var intentLog = $('.intent-log');
        var output = value.split('').reverse().join('');

        intentLog.append('<div>' +
            '<label>[' + intentUtils.getTimeString() + '] </label>' +
            '<label>Input: </label>' + value + ' ' +
            '<label>Reversed: </label>' + output +
            '</div>');
        intentLog.scrollTop(intentLog[0].scrollHeight);

        return output;
    };

    functionRef.register(metaData, reverseInput)
        .then(function() {
            $('#intent-name').text(INTENT_NAME);
        }).catch(function(error) {
            $('#intent-name').text('Intent registration failed: ' + error);
        });

})();
