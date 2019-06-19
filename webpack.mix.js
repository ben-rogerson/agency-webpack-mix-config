/**
 * ===========================
 * Agency Webpack Mix Config
 * A modern build config built with the busy web agency in mind.
 * https://github.com/ben-rogerson/agency-webpack-mix-config
 * ===========================
 *
 * Contents
 *
 * ⚙️ Settings
 * 🎨 Styles
 * 🎨 Styles: PurgeCSS
 * 🎨 Styles: PostCSS
 * 📑 Scripts
 * 📑 Scripts: Vendor
 * 📑 Scripts: Polyfills
 * 📑 Scripts: Auto import libraries
 * 🎆 SVG icon sprite
 * 🏞 Images
 * 🗂️ Static files
 * 🎁 Webpack config
 * 🎭 File hashing
 * 👷 Style files HMR patch
 */

/**
 * TODO:
 * - Add instructions for Craft install
 * - Template reload watcher (reload after error?)
 * - Customise the notification message
 * - Add postcss-preset-env
 * - PurgeCSS config + testing
 * - Critical CSS config + testing
 * - Reduce the build path key
 *
 */

/**
 * ⚙️ Settings: General
 */
const config = {
    devProxyDomain: "http://mix.test",
    publicFolder: "web",
    publicBuildFolder: "dist",
    cleanBeforeBuildGlobs: ["dist/**/*", "static/**/*", "mix-manifest.json"],
}

// Imports
const mix = require("laravel-mix")
const path = require("path")
const fs = require("fs")

/**
 * ⚙️ Settings: Source folders
 * The keys double as aliases in this project
 */
const source = {
    icons: path.resolve("src/icons"),
    images: path.resolve("src/images"),
    scripts: path.resolve("src/scripts"),
    styles: path.resolve("src/styles"),
    static: path.resolve("src/static"),
}

// ⚙️ Base public path
mix.setPublicPath(config.publicFolder)

// ⚙️ Notifications
// https://laravel-mix.com/docs/4.0/os-notifications
mix.disableSuccessNotifications()

// ⚙ Source maps
if (mix.inProduction()) mix.sourceMaps()

/**
 * 🎨 Styles: Main
 * Uses dart-sass which has a replica API to Node-Sass
 * https://laravel.com/docs/5.8/mix#sass
 * https://github.com/sass/node-sass#options
 */
// Get a list of style files within the base styles folder
const styleFiles = getFilesIn(path.resolve(__dirname, source.styles), [
    "scss",
    "sass",
])
// Create an asset for every style file
styleFiles.forEach(styleFile => {
    mix.sass(
        styleFile,
        path.join(config.publicFolder, config.publicBuildFolder),
        {
            // Send data to the style file
            data: `$isDev: ${!mix.inProduction()};`,
        }
    )
})

/**
 * 🎨 Styles: CriticalCSS
 * https://github.com/addyosmani/critical#options
 */
const criticalUrls = [{ urlPath: "/", label: "index" }]
const criticalDomain = process.env.BASE_URL || config.devProxyDomain
require("laravel-mix-critical")
const url = require("url")
mix.critical({
    enabled: mix.inProduction(),
    urls: criticalUrls.map(page => ({
        src: url.resolve(criticalDomain, page.urlPath),
        dest: path.join(
            config.publicFolder,
            config.publicBuildFolder,
            "criticalcss",
            `${page.label}_critical.min.css`
        ),
    })),
    options: {
        width: 1200,
        height: 1200,
    },
})

/**
 * 🎨 Styles: PurgeCSS
 */
// require("laravel-mix-purgecss")
// mix.purgeCss({
//     enabled: mix.inProduction(),
//     folders: ["src", "templates"],
//     extensions: ["php", "twig", "html", "js", "mjs", "vue"],
// })

/**
 * 🎨 Styles: PostCSS + other options
 * https://laravel-mix.com/docs/4.0/options
 */
mix.options({
    extractVueStyles: false,
    // https://laravel-mix.com/docs/4.0/css-preprocessors#postcss-plugins
    postCss: [
        // https://github.com/csstools/postcss-preset-env#readme
        require("postcss-preset-env")({ stage: 2 }),
    ],
    // Disable processing css urls for speed
    // https://laravel-mix.com/docs/4.0/css-preprocessors#css-url-rewriting
    processCssUrls: false,
})

/**
 * 📑 Scripts: Main
 * https://laravel-mix.com/docs/4.0/mixjs
 */
const scriptFiles = getFilesIn(path.resolve(__dirname, source.scripts), [
    "js",
    "mjs",
    "vue",
])
scriptFiles.forEach(scriptFile => {
    mix.js(scriptFile, config.publicBuildFolder)
})

/**
 * 📑 Scripts: Polyfills
 * Automatically support target browsers with core-js@3
 * https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md
 * https://github.com/scottcharlesworth/laravel-mix-polyfill#options
 */
require("laravel-mix-polyfill")
mix.polyfill({
    enabled: mix.inProduction(),
    useBuiltIns: "usage", // Only add a polyfill when the feature is used
    targets: false, // "false" falls back to browserslist in package.json
    corejs: 3,
    debug: false, // "true" to check which polyfills are being used
})

/**
 * 📑 Scripts: Vendor
 * Separate the JavaScript code imported from node_modules
 * https://laravel-mix.com/docs/4.0/extract
 */
mix.extract() // Empty params = separate all node_modules
// mix.extract(['jquery']) // Specify packages to add to the vendor file

/**
 * 📑 Scripts: Auto import libraries
 * Make JavaScript libraries available without an import
 * https://laravel-mix.com/docs/4.0/autoloading
 */
mix.autoload({
    jquery: ["$", "jQuery", "window.jQuery"],
})

/**
 * 🎆 SVG icon sprite
 * Combines SVG icons into a single SVG
 * https://github.com/kisenka/svg-sprite-loader#configuration
 */
require("laravel-mix-svg-sprite")
mix.svgSprite(source.icons, path.join(config.publicBuildFolder, "sprite.svg"), {
    symbolId: filePath => `icon-${path.parse(filePath).name}`,
    extract: true,
})

/**
 * 🏞 Images
 * Compresses the files and copies to build directory
 * https://github.com/Klathmon/imagemin-webpack-plugin#api
 * Locked at version 1.0.0 for config compat issues
 */
require("laravel-mix-imagemin")
mix.imagemin(
    {
        from: path.join(source.images, "**/*"),
        to: config.publicBuildFolder,
        flatten: true,
    },
    {},
    {
        gifsicle: { interlaced: true },
        mozjpeg: { progressive: true, arithmetic: false },
        optipng: { optimizationLevel: 3 }, // Lower number = speedier/reduced compression
        svgo: {
            plugins: [
                { convertPathData: false },
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
mix.copyDirectory(source.static, path.join(config.publicFolder, "static"))

/**
 * 🎁 Webpack config: Misc
 * Merged webpack configuration
 */
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
mix.webpackConfig({
    // output: {
    // Custom chunk filenames
    //     chunkFilename: path.join(config.publicBuildFolder, "[name].js"),
    // },
    resolve: {
        alias: source, // Project folder aliases
    },
    plugins: [
        // Clear previous build files before new build
        new CleanWebpackPlugin({
            dry: false,
            verbose: true,
            cleanOnceBeforeBuildPatterns: config.cleanBeforeBuildGlobs,
        }),
    ],
})

/**
 * 🎁 Webpack config: Non-production
 * Custom Webpack configuration
 */
if (!mix.inProduction()) {
    const StyleLintPlugin = require("stylelint-webpack-plugin")
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
        plugins: [
            // Lint styles
            new StyleLintPlugin(),
        ],
        // Custom webpack-dev-server options
        devServer: {
            open: true,
            public: "localhost:8080",
            host: "0.0.0.0", // Allows access from network
            https: config.devProxyDomain.includes("https://"),
            quiet: true,
            hot: true,
            overlay: true,
            contentBase: path.resolve(__dirname, "templates"),
            watchContentBase: true,
            watchOptions: {
                aggregateTimeout: 200,
                poll: 100, // Lower for faster reloads (more cpu intensive)
            },
            disableHostCheck: true, // Fixes "Invalid Host header error" on assets
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            proxy: {
                context: () => true,
                target: config.devProxyDomain,
                changeOrigin: true,
                secure: false,
            },
        },
    })
}

/**
 * 👷 Style files HMR patch
 * Removal of the deprecated loader with no hmr support
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

/**
 * 🎭 File hashing
 * Mix has querystring hashing by default, eg: main.css?id=abcd1234
 * This script converts it to filename hashing, eg: main.abcd1234.css
 * https://github.com/JeffreyWay/laravel-mix/issues/1022#issuecomment-379168021
 */
if (mix.inProduction()) {
    // Allow versioning in production
    mix.version()
    // Imports
    const _ = require("lodash")
    const del = require("del")
    const jsonFile = require("jsonfile")
    const manifestPath = path.join(config.publicFolder, "mix-manifest.json")
    // Run after mix finishes
    mix.then(() => {
        // Parse the mix-manifest file
        jsonFile.readFile(manifestPath, (err, obj) => {
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
                del.sync([`${config.publicFolder}${oldAsGlob}`])
                // Copy as new versioned file name
                fs.copyFile(
                    `${config.publicFolder}${key}`,
                    `${config.publicFolder}${newFilename}`,
                    err => {
                        err && console.error(err)
                    }
                )
                newJson[key] = newFilename
                oldFiles.push(key)
            })
            _.forEach(oldFiles, key => {
                del.sync([`${config.publicFolder}${key}`])
            })
            // Write the new contents of the mix manifest file
            jsonFile.writeFile(manifestPath, newJson, { spaces: 4 }, err => {
                if (err) console.error(err)
            })
        })
    })
}

/**
 * Get files helper
 * Returns a list of file paths of type in a directory
 * Usage: getFilesIn('/dir', ["js"])
 */
function getFilesIn(folderPath, matchFiletypes = []) {
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

/**
 * Dump the config to the console for debugging
 */
// mix.dump()
