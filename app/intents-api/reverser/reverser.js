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
    $('#intent-name').text(INTENT_NAME);

    var metaData = {
        label: 'Logs the value to the html.',
        icon: 'https://d30y9cdsu7xlg0.cloudfront.net/png/62495-200.png'
    };

    var reverseInput = function(value) {
        $('#result').text(value.split('').reverse().join(''));
        return 'Reverser finished!';
    };

    functionRef.register(metaData, reverseInput)
        .then(function() {
            console.log('intent registered successfully');
        }).catch(function(error) {
            console.log('intent registration failed', error);
        });

})();
