import Vue from "vue"
import App from "./app"

Vue.config.productionTip = false

if (document.querySelector("#app")) {
    new Vue({
        el: "#app",
        delimiters: ["${", "}"],
        render: h => h(App),
    })
}
