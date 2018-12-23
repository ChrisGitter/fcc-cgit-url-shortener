import { VueConstructor } from "vue";

const Vue = (window as any).Vue as VueConstructor;

window.addEventListener("load", function() {
  new Vue({
    el: ".app",
    data: {
      url: ""
    },
    methods: {
      createUrl: function() {
        if (this.url.length >= 4) {
          let { href } = window.location;
          if (href.charAt(href.length - 1) !== "/") {
            href += "/";
          }
          window.location.assign(`${href}new/${encodeURIComponent(this.url)}`);
        }
      }
    }
  });
});
