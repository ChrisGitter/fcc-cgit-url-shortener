window.onload = function() {
    new Vue({
        el: '.app',
        data: {
            url: ''
        },
        methods: {
            createUrl: function() {
                if (this.url.length >= 4) {
                    var page = window.location.href;
                    if (page.charAt(page.length-1) !== '/')
                        page += '/';
                    window.location = page + 'new/'+ this.url;
                }
            }
        }
    })
}