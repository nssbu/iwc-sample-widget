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

    var shoppingCartRef = new iwc.data.Reference('/shoppingCart', { collect: true });

    var cart = {
        total: 0,
        count: 0,
        items: []
    };

    var updateDisplay = function(value) {
        $('#output').text(JSON.stringify(value));
    };

    var onChange = function(change, done) {
        console.log('Shopping cart changed', change);
        // shoppingCartRef.list()
        //     .then(function(resources) {
        //         resources.forEach(function(resource) {
        //             var reference = new iwc.data.Reference(resource);
        //             console.log('Resource', resource);
        //             reference.get()
        //                 .then(function(response) {
        //                     // console.log('Resource response', response);
        //                 });
        //         });
        //     });
    };

    var onInitialize = function(response) {
        console.log('Shopping cart initialized', response);
    };

    shoppingCartRef.watch(onChange)
        .then(onInitialize);
})();
