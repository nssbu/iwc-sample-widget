(function() {

    window.createItem = function(store) {
        return {
            upc: Date.now(),
            price: Math.random() * (30 - 1) + 1,
            store: store,
            quantity: 1
        };
    };

})();
