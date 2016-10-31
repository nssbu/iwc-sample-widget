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

    // Only need to call connect() explicitly when we need to handle the promise it returns
    iwc.connect()
        .then(getConnectionStatusHandler(true))
        .catch(getConnectionStatusHandler(false));

    var clickRef = new iwc.data.Reference('/actions/click');

    var action = {
        type: 'click',
        count: 0,
        lastAction: undefined
    };

    $('#update').click(function() {
        action.count++;
        action.lastAction = Date.now();

        clickRef.set(action);

        var actionLog = $('.action-log');

        actionLog.append('<div>' +
                '<label>Clicks: </label><span>' + action.count + '</span>' +
                '<label>Last action: </label><span>' + action.lastAction + '</span>' +
            '</div>');

        actionLog.scrollTop(actionLog[0].scrollHeight);
    });

    $('#clear-log').click(function() {
        $('.action-log').empty();
    });

})();
