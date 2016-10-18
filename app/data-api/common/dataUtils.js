(function() {
    window.dataUtils = {

        createItem: function(store) {
            return {
                upc: Date.now(),
                price: Math.random() * (30 - 1) + 1,
                store: store,
                quantity: Math.floor(Math.random() * (5 - 1)) + 1
            };
        },

        createItemHtml: function(item) {
            return '<div class="item">' +
                '<div class="item-column">' +
                    '<div class="remove-item">' +
                        '<button>X</button>' +
                    '</div>' +
                '</div>' +
                '<div class="item-column">' +
                    '<div>' +
                        '<label>UPC: </label>' +
                        '<span>' + item.upc + '</span>' +
                    '</div>' +
                '</div>' +
                '<div class="item-column">' +
                    '<div>' +
                        '<label>Price: $</label>' +
                        '<span>' + item.price.toFixed(2) + '</span>' +
                    '</div>' +
                '</div>' +
                '<div class="item-column">' +
                    '<div>' +
                        '<label>Quantity: </label>' +
                        '<span>' + item.quantity + '</span>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }

    };
})();
