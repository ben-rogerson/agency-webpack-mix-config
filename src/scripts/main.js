import { requireAll } from "./utils"

/**
 * Dynamic imports
 * Load JavaScript only when you need it
 */
const dynamicImports = async () => {
    // Import helper
    const dynamicImport = async (folder, moduleName) =>
        await import(/* webpackChunkName: "assets/build/[request]" */ `./${folder}/${moduleName}`)

    // Example #1: Dynamically import a demo module and call the default export
    if (document.querySelector("body")) {
        ;(await dynamicImport("modules", "dynamicImportDemo")).default()
    }

    // Example #2: Dynamically import and start a Vue app
    if (document.querySelector("#app")) {
        await dynamicImport("vue", "app")
    }
}
dynamicImports()

/**
 * SVG icon sprite
 * Combine all .svg files from the icons folder into a sprite
 * Html usage: <svg><use xlink:href="{{ "#icon-FILENAME" }}"/></svg>
 */
requireAll(require.context("icons", true, /\.svg$/))

/**
 * Accept hot reloading from dev server
 */
if (module.hot) module.hot.accept()
