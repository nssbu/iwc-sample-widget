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
    var $newItemSpan = $('.new-item span');
    var $actionLogCollection = $('.action-log .collection');

    var iwc = new ozpIwc.Client(iwcSampleConfig.iwcHost);

    // Only need to call connect() explicitly when we need to handle the promise it returns
    iwc.connect()
        .then(getConnectionStatusHandler(true))
        .catch(getConnectionStatusHandler(false));

    var actionsRef = new iwc.data.Reference('/actions', { collect: true });

    var getReference = function(reference) {
        return new iwc.data.Reference(reference);
    };

    var updateCollectionDisplay = function(collection) {
        getReference(collection[collection.length - 1]).get()
            .then(function(value) {
                $newItemSpan.text(value.name + ' created by: \'' + value.creationMethod + '\' on: ' + value.timestamp);
            });

        collection.forEach(function(item) {
            $actionLogCollection.append('<div>' + item + '</div>');
        });

        $actionLogCollection.scrollTop($actionLogCollection[0].scrollHeight);
    };

    var onChange = function(change, done) {
        $actionLogCollection.empty();
        updateCollectionDisplay(change.newCollection);
    };

    var onInitialize = function() {
        actionsRef.list().then(updateCollectionDisplay);
    };

    actionsRef.watch(onChange)
        .then(onInitialize);
})();
