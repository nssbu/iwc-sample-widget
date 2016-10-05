(function() {
    window.intentUtils = {

        getTimeString: function() {
            var date = new Date();

            var hours = (date.getHours() < 10 ? '0' : '') + date.getHours();
            var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
            var seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();

            return hours + ':' + minutes + ':' + seconds;
        }

    };
})();
