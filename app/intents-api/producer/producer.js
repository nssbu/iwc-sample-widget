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

    var iwc = new ozpIwc.Client(iwcSampleConfig.iwcHost);
    // var iwc = new ozpIwc.Client('https://localhost:4440/iwc');

    // Only need to call connect() explicitly when we need to handle the promise it returns
    iwc.connect()
        .then(getConnectionStatusHandler(true))
        .catch(getConnectionStatusHandler(false));

    var printRef = new iwc.intents.Reference('/application/json/print');
    var reverseRef = new iwc.intents.Reference('/application/json/print/com.iwc-sample.reverse');
    var capitalizeRef = new iwc.intents.Reference('/application/json/print/com.iwc-sample.capitalize');
    var jsonRef = new iwc.intents.Reference('/application/json/print/com.iwc-sample.json-viewer');

    var getInputValue = function() {
        return $('#value').val();
    };

    var updateOutput = function(value) {
        console.log(value);
    };

    var clearLog = function() {
        $('.intent-log').empty();
    };

    var logInvokeCallback = function(intentState, done) {
        console.log('Intent state:', intentState);

        var logOutput = '<div class="intent-state ' + intentState.state + '">' +
            '<div><label>State: </label>' + intentState.state + '</div>';

        if (intentState.state !== 'init'){
            logOutput += '<div><label>Handler: </label>' + intentState.handler.resource + '</div>';
        }

        if (intentState.state === 'complete') {
            logOutput += '<div><label>Response: </label>' + intentState.response + '</div>';
        }

        logOutput += '</div>';

        var intentLog = $('.intent-log');
        intentLog.append(logOutput);
        intentLog.scrollTop(intentLog[0].scrollHeight);
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

    var printJson = function() {
        var json = {
            message: getInputValue(),
            timestamp: Date.now()
        };

        jsonRef.invoke(json, logInvokeCallback)
            .then(updateOutput)
            .catch(updateOutput);
    };

    var invokeAll = function() {
        printRef.invoke(getInputValue(), logInvokeCallback)
            .then(updateOutput)
            .catch(updateOutput);
    };

    var broadcastIntent = function() {
        printRef.broadcast(getInputValue(), logInvokeCallback)
            .then(updateOutput)
            .catch(updateOutput);
    };

    $('#invoke-reverser').click(reverseInput);
    $('#invoke-capper').click(capitalizeInput);
    $('#invoke-json').click(printJson);
    $('#invoke-all').click(invokeAll);
    $('#broadcast').click(broadcastIntent);
    $('#clear-log').click(clearLog);
})();
