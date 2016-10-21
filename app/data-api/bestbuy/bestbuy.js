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

    var cart = { total: 0.00, count: 0, items: [] };

    var items = [
        { name: 'Item 1', upc: '123456', price: 49.99 },
        { name: 'Item 2', upc: '234561', price: 29.95 },
        { name: 'Item 3', upc: '345612', price: 9.49 },
        { name: 'Item 4', upc: '456123', price: 199.99 },
        { name: 'Item 5', upc: '561234', price: 79.95 }
    ];

    var itemRefs = [];

    var addItemToCart = function(item) {
        cart.count++;
        cart.items.push(item);

        cart.total = 0;
        cart.items.forEach(function(item){
            cart.total += item.price;
        });
    };

    var createItem =  function(item) {
        var itemElement = '<div class="item">' +
                '<div class="name">' + item.name + '</div>' +
                '<div class="price">$' + item.price + '</div>' +
                '<button id="' + item.upc + '"">Add to Cart</button>' +
            '</div>';

        $('.item-container').append(itemElement);

        itemRefs.push(new iwc.data.Reference('/shoppingCart/bestBuy/' + item.upc));

        $('#' + item.upc).click(function() {
            addItemToCart(item);
            bestBuyCart.set(cart);
        });
    };

    items.forEach(createItem);

    var updateCartDisplay = function(change, done) {
        $('.cart .items').text((change.newValue.count));
        $('.cart .total').text(change.newValue.total.toFixed(2));
    };

    // Initialize cart display
    updateCartDisplay({ newValue: cart });

    var logShoppingCartList = function(value) {
        console.log('Cart list', value);
    };

    // Get root-level shopping cart reference
    // var shoppingCart = new iwc.data.Reference('/shoppingCart', { collect: true });

    // Setup bestBuy shopping cart data
    var bestBuyCart = new iwc.data.Reference('/shoppingCart/bestBuy', { collect: true });
    // bestBuyCart.set(cart);

    // Log the list and setup some handlers
    // shoppingCart.list().then(logShoppingCartList);
    // shoppingCart.watch(updateCartDisplay);
    // bestBuyCart.watch(watchbestBuyCart);

    bestBuyCart.get()
        .then(function(response) {
            cart = response;
            updateCartDisplay(cart);
        })
        .catch(function(error) {
            console.log('cart get failed', error);
        });

    bestBuyCart.watch(updateCartDisplay);

    $('#empty-cart').click(function() {
        bestBuyCart.delete()
            .then(function() {
                console.log('resolved delete');
            })
            .catch(function(error) {
                console.log('Delete failed:', error);
            });
    });

    // var watchbestBuyCart = function(change, done) {
    //     console.log('bestBuyCart change', change);
    //
    //     $('#total').text(change.newValue.total);
    //     $('#count').text(change.newValue.count);
    // };
    //
    //
    // // Add a click handler to create and add random items
    // $('#add').click(function() {
    //     var newItem = window.createItem('bestBuy.com');
    //     var itemRef = new iwc.data.Reference('/shoppingCart/bestBuy/' + newItem.upc);
    //     itemRef.set(newItem);
    // });
})();
