import "./modules/svgIconSprite"

/**
 * Dynamic imports
 * Load JavaScript only when you need it
 */
const doDynamicImports = async () => {
    // Example 1: Dynamically import a demo module and call the default export
    if (document.querySelector("body")) {
        const {
            default: demo,
        } = await import(/* webpackChunkName: "module-dynamic-import" */
        "./modules/dynamicImportDemo")
        demo()
    }

    // Example 2: Dynamically import and start a Vue app
    if (document.querySelector("#app")) {
        await import(/* webpackChunkName: "vue-app" */ "./vue/app")
    }
}
doDynamicImports()

/**
 * Accept hot reloading from dev server
 * Without this you may see this warning in your console:
 * "[HMR] Cannot apply update. Need to do a full reload!"
 */
if (module.hot) module.hot.accept()
