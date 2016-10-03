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

    var iwc = new ozpIwc.Client('http://localhost:13000');

    // Only need to call connect() explicitly when we need to handle the promise it returns
    iwc.connect()
        .then(getConnectionStatusHandler(true))
        .catch(getConnectionStatusHandler(false));

    var printRef = new iwc.intents.Reference('/application/json/print');
    var reverseRef = new iwc.intents.Reference('/application/json/print/com.clabas.reverse');
    var capitalizeRef = new iwc.intents.Reference('/application/json/print/com.clabas.capitalize');

    var getInputValue = function() {
        return $('#value').val();
    };

    var updateOutput = function(value) {
        console.log(value);
    };

    var logInvokeCallback = function(intentState, done) {
        console.log('Intent state:', intentState);
    };

    var reverseInput = function() {
        reverseRef.invoke(getInputValue(), logInvokeCallback)
            .then(updateOutput)
            .catch(updateOutput);
    };

    var capitalizeInput = function() {
        capitalizeRef.invoke(getInputValue(), logInvokeCallback)
            .then(updateOutput)
            .catch(updateOutput);
    };

    var invokeAll = function() {
        printRef.invoke(getInputValue(), logInvokeCallback)
            .then(updateOutput)
            .catch(updateOutput);
    };

    var broadcastIntent = function() {
        printRef.broadcast(getInputValue())
            .then(updateOutput)
            .catch(updateOutput);
    };

    $('#invoke-reverser').click(reverseInput);
    $('#invoke-capper').click(capitalizeInput);
    $('#invoke-all').click(invokeAll);
    $('#broadcast').click(broadcastIntent);
})();
