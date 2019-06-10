const App = async () => {
    const Vue = await import(/* webpackChunkName: "vue-pkg" */ "vue")

    new Vue.default({
        el: "#app",
        delimiters: ["${", "}"],
        components: {},
        data: {},
        methods: {},
        mounted() {
            console.log("👍 Dynamically imported: vue/main.js")
        },
    })
}

App()
