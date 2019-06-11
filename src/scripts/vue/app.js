const App = async () => {
    const Vue = await import(/* webpackChunkName: "vue-import" */ "vue")

    new Vue.default({
        el: "#app",
        delimiters: ["${", "}"],
        components: {},
        data: {},
        methods: {},
        mounted() {
            console.log("👍 Dynamically imported: vue/app.js")
        },
    })
}

App()
