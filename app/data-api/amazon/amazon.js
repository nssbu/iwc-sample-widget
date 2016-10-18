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

    var STORE_NAME = 'amazon';

    var iwc = new ozpIwc.Client('http://localhost:13000');

    // Only need to call connect() explicitly when we need to handle the promise it returns
    iwc.connect()
        .then(getConnectionStatusHandler(true))
        .catch(getConnectionStatusHandler(false));

    var amazonCartRef = new iwc.data.Reference('/shoppingCart/' + STORE_NAME, { collect: true });

    var cart = {
        total: 0,
        count: 0,
        items: []
    };

    var createItem = function() {
        var item = dataUtils.createItem(STORE_NAME);

        var itemRef = new iwc.data.Reference('/shoppingCart/' + STORE_NAME + '/' + item.upc);
        itemRef.set(item);

        cart.items.push(item);

        $('.item-list').append(dataUtils.createItemHtml(item));
    };

    var updateCart = function(item) {
        var total = 0;
        var count = 0;

        cart.items.forEach(function(item) {
            total += (item.price * item.quantity);
            count += item.quantity;
        });

        cart.total = total;
        cart.count = count;

        amazonCartRef.set(cart);
    }

    $('#add-item').click(function() {
        createItem();
        updateCart();
    });

})();
