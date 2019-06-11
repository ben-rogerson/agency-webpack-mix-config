import "./modules/hotModuleSupport"
import "./modules/svgIconSprite"

/**
 * Dynamic imports
 * Load JavaScript only when you need it
 */
const dynamicImports = async () => {
    // Example #1: Dynamically import a demo module and call the default export
    if (document.querySelector("body")) {
        const {
            default: demo,
        } = await import(/* webpackChunkName: "module-dynamic-import" */
        "./modules/dynamicImportDemo")
        demo()
    }

    // Example #2: Dynamically import and start a Vue app
    if (document.querySelector("#app")) {
        await import(/* webpackChunkName: "vue-app" */ "./vue/app")
    }
}
dynamicImports()
