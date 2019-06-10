const mix = require("laravel-mix")
const path = require("path")
const fs = require("fs")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const StyleLintPlugin = require("stylelint-webpack-plugin")

/**
 * Agency Webpack Mix Config
 *
 * ⚙️ Settings
 * 🎆 SVG icon sprite
 * 🎨 Styles
 *  - PostCss
 * 📑 Scripts
 *  - Vendor
 *  - Polyfills
 *  - Auto import libraries
 * 🏞 Images
 * 🗂️ Static files
 * 🎁 Webpack config
 * =====
 * 🙊 Patches
 * 🎭 File hashing
 */

/**
 * TODO:
 * - Adjust manifest build locations
 * - Add instructions for Craft install
 * - Display link to localhost + branding
 * - Template reload watcher (reload after error?)
 * - Test JS Uglification
 * - Vue.js modules (add some components)
 * - Customise the notification message
 * - Critical CSS (wishlist)
 */

const getFilesIn = (folderPath, matchFiletypes = []) => {
    const entryPaths = fs
        .readdirSync(folderPath)
        .map(entry => path.join(folderPath, entry))
    const entryPathFiles = entryPaths.filter(entry => {
        const fileTypeArray = Array.isArray(matchFiletypes)
            ? matchFiletypes
            : [matchFiletypes]
        return fileTypeArray.includes(
            entry
                .slice()
                .split(".")
                .pop()
        )
    })
    const filePaths = entryPathFiles.filter(entryPath =>
        fs.statSync(entryPath).isFile()
    )
    return filePaths
}

// ⚙️ Import aliases
const importAliases = {
    icons: path.resolve("src/icons"),
    images: path.resolve("src/images"),
    scripts: path.resolve("src/scripts"),
    styles: path.resolve("src/styles"),
}

/**
 * ⚙️ Settings: From folders
 */
const from = {
    icons: "src/icons",
    images: "src/images",
    scripts: "src/scripts",
    static: "src/static",
    styles: "src/styles",
}

/**
 * ⚙️ Settings: To folders
 */
const to = {
    icons: "dist/sprite.svg",
    images: "dist",
    scripts: "dist",
    static: "web/static",
    styles: "web/dist",
    manifest: "web/mix-manifest.json",
}

/**
 * ⚙️ Settings: General
 */
const devProxyDomain = "http://lencom.test"
const publicFolder = "web"
const cleanBeforeBuildGlobs = ["dist/**/*", "static/**/*", "mix-manifest.json"]

// ⚙️ Base public path
mix.setPublicPath(publicFolder)

// ⚙️ Disable notifications on each success
mix.disableSuccessNotifications()

// ⚙️ Source maps
if (mix.inProduction()) mix.sourceMaps()

/**
 * 🎆 SVG icon sprite
 * Combines SVG icons into a single SVG
 * https://github.com/kisenka/svg-sprite-loader#configuration
 */
require("laravel-mix-svg-sprite")
mix.svgSprite(from.icons, to.icons, {
    symbolId: filePath => `icon-${path.parse(filePath).name}`,
    extract: true,
})

/**
 * 🎨 Styles: Main
 * Uses dart-sass which has a replica API to Node-Sass
 * https://laravel.com/docs/5.8/mix#sass
 * https://github.com/sass/node-sass#options
 */
const styleFiles = getFilesIn(path.resolve(__dirname, from.styles), [
    "scss",
    "sass",
    "less",
])
styleFiles.forEach(styleFile => {
    mix.sass(styleFile, to.styles, {
        // Send data to the stylesheet
        data: `$isDev: ${!mix.inProduction()};`,
    })
})

/**
 * 🎨 Styles: PostCss + other options
 */
mix.options({
    postCss: [],
    processCssUrls: false, // Off as this process is expensive
})

/**
 * 📑 Scripts: Main
 */
const scriptFiles = getFilesIn(path.resolve(__dirname, from.scripts), [
    "js",
    "mjs",
    "vue",
])
scriptFiles.forEach(scriptFile => {
    mix.js(scriptFile, to.scripts)
})

/**
 * 📑 Scripts: Polyfills
 * Uses core-js@3 to automatically support target browsers
 * https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md
 * https://github.com/scottcharlesworth/laravel-mix-polyfill#options
 */
require("laravel-mix-polyfill")
mix.polyfill({
    enabled: true,
    useBuiltIns: "usage", // Only add a polyfill when the feature is used
    targets: false, // "false" falls back default to package.json definitions
    corejs: 3,
    debug: false, // "true" to check which polyfills are being used
})

/**
 * 📑 Scripts: Vendor
 * Separate the JavaScript code imported from node_modules
 * https://github.com/JeffreyWay/laravel-mix/blob/master/docs/extract.md
 */
// mix.extract() // Empty params = separate all node_modules
// mix.extract(['jquery']) // Specify packages to add to the vendor file

/**
 * 📑 Scripts: Auto import libraries
 * Make JavaScript libraries available without an import
 * https://github.com/JeffreyWay/laravel-mix/blob/master/docs/autoloading.md
 */
// mix.autoload({
//     jquery: ["$", "jQuery", "window.jQuery"],
// })

/**
 * 🏞 Images
 * Compresses the files and copies to build directory
 * https://github.com/Klathmon/imagemin-webpack-plugin#api
 */
require("laravel-mix-imagemin")
mix.imagemin(
    {
        from: `${from.images}/**/*`,
        to: to.images,
        flatten: true,
    },
    {},
    {
        gifsicle: { interlaced: true },
        mozjpeg: { progressive: true },
        optipng: { optimizationLevel: 1 }, // keeps compression speedy
        svgo: {
            plugins: [
                { convertColors: { currentColor: false } },
                { removeDimensions: true },
                { removeViewBox: false },
                { cleanupIDs: false },
            ],
        },
    }
)

/**
 * 🗂️ Static files
 * A copy and paste task
 */
mix.copyDirectory(from.static, to.static)

/**
 * 🎁 Webpack config: Misc
 * Merged webpack configuration
 */
mix.webpackConfig({
    resolve: {
        // Make folder aliases
        alias: importAliases,
    },
    plugins: [
        // Clear previous build files before new build
        new CleanWebpackPlugin({
            dry: false,
            verbose: false,
            cleanOnceBeforeBuildPatterns: cleanBeforeBuildGlobs,
        }),
        // Lint SASS
        new StyleLintPlugin(),
    ],
})

/**
 * 🎁 Webpack config: Development environment
 * Custom Webpack configuration
 */
if (!mix.inProduction()) {
    mix.webpackConfig({
        module: {
            rules: [
                {
                    // Run JavaScript through eslint
                    test: /\.(vue|js|jsx|mjs)$/,
                    enforce: "pre",
                    loader: "eslint-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        // Custom webpack-dev-server options
        devServer: {
            public: "http://localhost:8080",
            host: "0.0.0.0",
            https: false,
            disableHostCheck: true,
            hot: true,
            overlay: true,
            watchOptions: {
                poll: true,
                ignored: ["node_modules", "vendor", "storage", ".git"],
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            stats: "verbose",
            proxy: {
                "*": {
                    target: devProxyDomain,
                    changeOrigin: true,
                },
            },
            open: true,
            quiet: false,
        },
    })
}

/** ==================================================
 * 🙊 Patches
 * "Laravel Mix: An elegant wrapper around Webpack for the 80% use case."
 * Here you'll find the remaining 20%:
 */

/**
 * 🎭 File hashing
 * Mix has querystring hashing by default, eg: main.css?id=abcd1234
 * This script converts it to filename hashing, eg: main.abcd1234.css
 * https://github.com/JeffreyWay/laravel-mix/issues/1022#issuecomment-379168021
 */
if (mix.inProduction()) {
    mix.version()

    const _ = require("lodash")
    const del = require("del")
    const jsonFile = require("jsonfile")
    const fs = require("fs")

    mix.then(() => {
        // Parse the mix-manifest file
        jsonFile.readFile(to.manifest, (err, obj) => {
            const newJson = {}
            const oldFiles = []
            _.forIn(obj, (value, key) => {
                // Get the hash from the ?id= query string parameter and move it into the file name e.g. 'app.abcd1234.css'
                const newFilename = value.replace(
                    /([^.]+)\.([^?]+)\?id=(.+)$/g,
                    "$1.$3.$2"
                )
                // Create a glob pattern of all files with the new file naming style e.g. 'app.*.css'
                const oldAsGlob = value.replace(
                    /([^.]+)\.([^?]+)\?id=(.+)$/g,
                    "$1.*.$2"
                )
                // Delete old versioned file(s) that match the glob pattern
                del.sync([`${publicFolder}${oldAsGlob}`])
                // Copy as new versioned file name
                fs.copyFile(
                    `${publicFolder}${key}`,
                    `${publicFolder}${newFilename}`,
                    err => {
                        err && console.error(err)
                    }
                )
                newJson[key] = newFilename
                oldFiles.push(key)
            })
            _.forEach(oldFiles, key => {
                del.sync([`${publicFolder}${key}`])
            })
            // Write the new contents of the mix manifest file
            jsonFile.writeFile(to.manifest, newJson, { spaces: 4 }, err => {
                if (err) console.error(err)
            })
        })
    })
}

/**
 * 👷 Restore hot module reloading
 * Sass updates didn't have hmr so this fixes it
 * This removes the deprecated loader with no hmr support
 * https://github.com/webpack-contrib/extract-text-webpack-plugin
 */
if (!mix.inProduction()) {
    Mix.listen("configReady", config => {
        for (rule of config.module.rules) {
            if (styleFiles.includes(String(rule.test))) {
                rule.use = rule.use.filter(
                    i =>
                        !i.loader ||
                        !i.loader.includes(`extract-text-webpack-plugin`)
                )
            }
        }
    })
}

// Dump the Webpack config to the console
// mix.dump()
