import Vue from "vue"

Vue.config.productionTip = false;

new Vue({
    el: "#app",
    delimiters: ["${", "}"],
    components: {},
    data: {},
    methods: {},
    mounted() {
        console.log("👍 Dynamically imported: vue/app.js")
    },
})