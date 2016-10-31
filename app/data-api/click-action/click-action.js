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
    var $addItemButton = $('#add-item');
    var $removeAllButton = $('#remove-all');

    var iwc = new ozpIwc.Client(iwcSampleConfig.iwcHost);

    // Only need to call connect() explicitly when we need to handle the promise it returns
    iwc.connect()
        .then(getConnectionStatusHandler(true))
        .catch(getConnectionStatusHandler(false));

    // Populate our log with a list of existing click items
    var clickActionRef = new iwc.data.Reference('/actions/click');
    clickActionRef.list()
        .then(function(references) {
            references.forEach(function(reference) {
                createItem(reference);
            });
        });

    var items = [];

    var addItemToLog = function (item, itemRef) {
        var itemId = 'item-' + item.timestamp;
        var buttonId = 'remove-' + item.timestamp;

        $actionLog.append('<div id="' + itemId + '" class="action-log-entry">' +
                '<button id="' + buttonId + '">Remove</button>' +
                '<div><label>Item: </label><span>' + item.name + '</span></div>' +
                '<div><label>Created: </label><span>' + item.timestamp + '</span></div>' +
            '</div>');

        $('#' + buttonId).click(function() {
            itemRef.delete()
                .then(function() {
                    var itemIndex = items.indexOf(item);
                    items.splice(itemIndex, 1);

                    $('#' + itemId).remove();
                });
        });

        $actionLog.scrollTop($actionLog[0].scrollHeight);
    };

    var createItem = function(reference) {
        var item;
        var itemRef;

        console.log(reference)

        // If given a reference, create an item from that reference. Otherwise create a new item.
        if (reference) {
            itemRef = new iwc.data.Reference(reference);
            itemRef.get()
                .then(function(item) {
                    items.push(item);
                    addItemToLog(item, itemRef);
                });
        }
        else {
            item = {
                name: 'New Item ' + items.length,
                timestamp: Date.now(),
                creationMethod: 'click'
             };

            itemRef = new iwc.data.Reference('/actions/click/' + item.timestamp);
            itemRef.set(item);
            items.push(item);
            addItemToLog(item, itemRef);
        }
    };

    $addItemButton.click(function() {
        createItem();
    });

    $removeAllButton.click(function() {
        var success = true;

        var clickRef = new iwc.data.Reference('/actions/click/');
        clickRef.list()
            .then(function(references) {
                references.forEach(function(reference) {
                    var itemRef = new iwc.data.Reference(reference);

                    itemRef.delete()
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
