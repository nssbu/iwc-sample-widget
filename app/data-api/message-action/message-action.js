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

    // Cache the DOM elements we'll use frequently
    var $actionLog = $('.action-log');
    var $addMessageButton = $('#add-message');
    var $messageInput = $('#message');
    var $removeAllButton = $('#remove-all');

    var iwc = new ozpIwc.Client(iwcSampleConfig.iwcHost);

    // Only need to call connect() explicitly when we need to handle the promise it returns
    iwc.connect()
        .then(getConnectionStatusHandler(true))
        .catch(getConnectionStatusHandler(false));

    // Populate our log with a list of existing messages
    var messageActionRef = new iwc.data.Reference('/actions/message');
    messageActionRef.list()
        .then(function(references) {
            references.forEach(function(reference) {
                createMessage(reference);
            });
        });

    var messages = [];

    var addMessageToLog = function(message, messageRef) {
        var messageId = 'message-' + message.timestamp;
        var buttonId = 'remove-' + message.timestamp;

        $actionLog.append('<div id="' + messageId + '" class="action-log-entry">' +
                '<button id="' + buttonId + '">Remove</button>' +
                '<div><label>message: </label><span>' + message.name + '</span></div>' +
                '<div><label>Created: </label><span>' + message.timestamp + '</span></div>' +
            '</div>');

        $('#' + buttonId).click(function() {
            messageRef.delete()
                .then(function() {
                    var messageIndex = messages.indexOf(message);
                    messages.splice(messageIndex, 1);

                    $('#' + messageId).remove();
                });
        });

        $messageInput.val('');
        $actionLog.scrollTop($actionLog[0].scrollHeight);
    };

    var createMessage = function(reference) {
        var message;
        var messageRef;

        // If given a reference, create a message from that reference. Otherwise create a new message.
        if (reference) {
            messageRef = new iwc.data.Reference(reference);
            messageRef.get()
                .then(function(message) {
                    messages.push(message);
                    addMessageToLog(message, messageRef);
                });
        }
        else {
            message = {
                name: $messageInput.val(),
                timestamp: Date.now(),
                creationMethod: 'message'
            };

            messageRef = new iwc.data.Reference('/actions/message/' + message.timestamp);
            messageRef.set(message);
            messages.push(message);
            addMessageToLog(message, messageRef);
        }
    };

    // Add the message on button click or 'Enter' keyup
    $addMessageButton.click(function() {
        createMessage();
    });

    $messageInput.keyup(function(event) {
        if (event.which === 13) {
            createMessage();
        }
    });

    $removeAllButton.click(function() {
        var success = true;

        var messageRef = new iwc.data.Reference('/actions/message/');
        messageRef.list()
            .then(function(references) {
                references.forEach(function(reference) {
                    var messageRef = new iwc.data.Reference(reference);

                    messageRef.delete()
                        .catch(function() {
                            success = false;
                        });
                });
            });

        if (success) {
            $actionLog.empty();
        }
    });

})();
