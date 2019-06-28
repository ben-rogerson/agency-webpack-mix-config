/**
 * ===========================
 * Agency Webpack-Mix Config
 * A capable website/webapp config built for the modern web agency.
 * https://github.com/ben-rogerson/agency-webpack-mix-config
 * ===========================
 *
 * Contents
 *
 * ⚙️ Settings
 * 🎨 Styles
 * 🎨 Styles: CriticalCSS
 * 🎨 Styles: PurgeCSS
 * 🎨 Styles: PostCSS
 * 🎨 Styles: Other
 * 📑 Scripts
 * 📑 Scripts: Polyfills
 * 📑 Scripts: Auto import libraries
 * 🎆 SVG icon sprite
 * 🏞 Images
 * 🗂️ Static files
 * 🛁 Cleaning
 * 🚨 Lint scripts
 * 🚨 Lint styles
 * 🚧 Webpack-dev-server
 * 🎭 File hashing
 */

/**
 * ⚙️ Settings: General
 */
const config = {
    devProxyDomain: "http://mix.test",
    publicFolder: "web",
    publicBuildFolder: "dist",
    publicCleanBefore: ["dist/**/*", "/*.js", "/*.map", "mix-manifest.json"],
}

// Imports
const mix = require("laravel-mix")
const path = require("path")
const getFilesIn = require("get-files-in")

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

// ⚙ Source maps
mix.sourceMaps()

// ⚙️ Notifications
// https://laravel-mix.com/docs/4.0/os-notifications
mix.disableNotifications()

// ⚙️ Aliases
// Add aliases to your project folders
mix.webpackConfig({ resolve: { alias: source } })

/**
 * 🎨 Styles: Main
 * Uses dart-sass which has a replica API to Node-Sass
 * https://laravel-mix.com/docs/4.0/css-preprocessors
 * https://github.com/sass/node-sass#options
 */
// Get a list of style files within the base styles folder
const styleFiles = getFilesIn(path.resolve(__dirname, source.styles), [ "scss", "sass" ])

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
// The urls for you'd like generated
const criticalUrls = [
    { urlPath: "/", label: "index" },
    // { urlPath: "/about", label: "about" },
]
// (Optional) Set the baseurl in your .env, eg: `BASE_URL=http://google.com`
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
 * https://github.com/spatie/laravel-mix-purgecss#usage
 */
require("laravel-mix-purgecss")
mix.purgeCss({
    enabled: mix.inProduction(),
    globs: [path.join(__dirname, config.publicFolder, "*.html")],
    folders: ["src", "templates"], // Folders scanned for selectors
    extensions: ["php", "twig", "html", "js", "mjs", "vue"],
})

/**
 * 🎨 Styles: PostCSS
 * https://laravel-mix.com/docs/4.0/css-preprocessors#postcss-plugins
 */
mix.options({
    postCss: [
        // Postcss preset env: Use pre-implemented css features
        // See https://cssdb.org/ for supported features
        // Note: Depending on support you may need to adjust
        // your development browserslist in package.json.
        // https://github.com/csstools/postcss-preset-env#readme
        require("postcss-preset-env")({ stage: 2 }),
    ],
})

/**
 * 🎨 Styles: Other
 * https://laravel-mix.com/docs/4.0/options
 */
mix.options({
    // Extract Vue styles to a separate file
    extractVueStyles: false,
    // Disable processing css urls for speed
    // https://laravel-mix.com/docs/4.0/css-preprocessors#css-url-rewriting
    processCssUrls: false,
})

/**
 * 📑 Scripts: Main
 * Script files are transpiled to vanilla JavaScript
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
 * Automatically add polyfills for target browsers with core-js@3
 * See "browserslist" in package.json for your targets
 * https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md
 * https://github.com/scottcharlesworth/laravel-mix-polyfill#options
 */
require("laravel-mix-polyfill")
mix.polyfill({
    enabled: mix.inProduction(),
    useBuiltIns: "usage", // Only add a polyfill when a feature is used
    targets: false, // "false" makes the config use browserslist targets in package.json
    corejs: 3,
    debug: false, // "true" to check which polyfills are being used
})

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
 * Individual SVG icons are optimised then combined into a single cacheable SVG
 * https://github.com/kisenka/svg-sprite-loader#configuration
 */
require("laravel-mix-svg-sprite")
mix.svgSprite(source.icons, path.join(config.publicBuildFolder, "sprite.svg"), {
    symbolId: filePath => `icon-${path.parse(filePath).name}`,
    extract: true,
})

/**
 * 🏞 Images
 * Images are optimized and copied to the build directory
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
 * Additional folders with no transform requirements are copied to your build folders
 */
mix.copyDirectory(
    source.static,
    path.join(config.publicFolder, config.publicBuildFolder)
)

/**
 * 🛁 Cleaning
 * Clear previous build files before new build
 */
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
mix.webpackConfig({
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: config.publicCleanBefore,
        }),
    ],
})

if (!mix.inProduction()) {
    /**
     * 🚨 Lint scripts
     */
    require("laravel-mix-eslint")
    mix.eslint()

    /**
     * 🚨 Lint styles
     */
    require("laravel-mix-stylelint")
    mix.stylelint({ configFile: null, context: null })

    /**
     * 🚧 Webpack-dev-server
     */
    mix.webpackConfig({
        devServer: {
            clientLogLevel: "none", // Hide console feedback so eslint can do it's thing
            open: true,
            public: "localhost:8080",
            host: "0.0.0.0", // Allows access from network
            https: config.devProxyDomain.includes("https://"),
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
 * 🎭 File hashing
 * Mix has querystring hashing by default, eg: main.css?id=abcd1234
 * This script converts it to filename hashing, eg: main.abcd1234.css
 * https://github.com/JeffreyWay/laravel-mix/issues/1022#issuecomment-379168021
 */
if (mix.inProduction()) {
    // Allow versioning in production
    mix.version()

    const manifestPath = path.join(config.publicFolder, "mix-manifest.json")
    // Run after mix finishes
    mix.then(() => {
        const laravelMixMakeFileHash = require("laravel-mix-make-file-hash")
        laravelMixMakeFileHash(config.publicFolder, manifestPath)
    })
}
