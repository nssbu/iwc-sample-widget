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
    $('#intent-name').text(INTENT_NAME);

    var metaData = {
        label: 'Displays the value in an alert.',
        icon: 'https://a2ua.com/alert/alert-001.jpg'
    };

    var capitalizeInput = function(value) {
        $('#result').text(value.toUpperCase());
        return 'Capper finished!';
    };

    functionRef.register(metaData, capitalizeInput)
        .then(function() {
            console.log('intent registered successfully');
        }).catch(function(error) {
            console.log('intent registration failed', error);
        });
})();