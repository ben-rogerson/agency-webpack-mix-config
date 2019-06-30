/**
 * ===========================
 * Agency Webpack-Mix Config
 * A capable website/webapp config built for the modern web agency.
 * https://github.com/ben-rogerson/agency-webpack-mix-config
 * ===========================
 *
 * Contents
 *
 * 🎚️ Settings
 * 🏠 Templates
 * 🎭 Hashing
 * 🎨 Styles
 * 🎨 Styles: CriticalCSS
 * 🎨 Styles: PurgeCSS
 * 🎨 Styles: PostCSS
 * 🎨 Styles: Linting
 * 🎨 Styles: Other
 * 📑 Scripts
 * 📑 Scripts: Polyfills
 * 📑 Scripts: Auto import libraries
 * 📑 Scripts: Linting
 * 🏞 Images
 * 🎆 Icons
 * 🗂️ Static
 * 🛁 Cleaning
 * 🚧 Webpack-dev-server
 */

// 🎚️ Base config
const config = {
    // Valet/Homestead/etc domain to proxy
    devProxyDomain: "http://mix.test",

    // Paths to observe for changes
    devWatchPaths: ["src/templates"],

    // Folders where purgeCss can look for used selectors
    purgeCssGrabFolders: ["src"],

    // Build a static site from the src/template files
    buildStaticSite: true,

    // Urls for CriticalCss to look for "above the fold" Css
    criticalCssUrls: [
        { urlPath: "/", label: "index" },
        // { urlPath: "/about", label: "about" },
    ],

    // Paths to clean before each start (publicFolder base)
    publicToCleanBeforeStart: ["dist/**/*", "*.+(js|map|html|json)"],

    // Folder served to users
    publicFolder: "web",

    // Foldername for built src assets (publicFolder base)
    publicBuildFolder: "dist",
}

// 🎚️ Imports
const mix = require("laravel-mix")
const path = require("path")
const getFilesIn = require("get-files-in")

// 🎚️ Source folders
const source = {
    icons: path.resolve("src/icons"),
    images: path.resolve("src/images"),
    scripts: path.resolve("src/scripts"),
    styles: path.resolve("src/styles"),
    static: path.resolve("src/static"),
    templates: path.resolve("src/templates"),
}

// 🎚️ Base public path
mix.setPublicPath(config.publicFolder)

// 🎚️ Source maps
mix.sourceMaps()

// 🎚️ Notifications
// https://laravel-mix.com/docs/4.0/os-notifications
mix.disableNotifications()

// 🎚️ Aliases
// Add aliases to your project folders
mix.webpackConfig({ resolve: { alias: source } })

/**
 * 🏠 Templates
 * Processed to create static html files
 * https://github.com/jantimon/html-webpack-plugin
 */
// Use src/templates if the folder exists
const buildSrcTemplates = config.buildStaticSite && source.templates && getFilesIn(path.resolve(__dirname, source.templates), ["twig"], true).length > 0
if (buildSrcTemplates) {
    const HtmlWebpackPlugin = require("html-webpack-plugin")
    const templateFiles = getFilesIn(path.resolve(__dirname, source.templates), ["twig"], true)
    const templatePages = templateFiles.map(file => {
        const isSubPath = source.templates !== path.dirname(file)
        const prefixPath = isSubPath ? path.dirname(file).split(path.sep).pop() : ''
        const newFileName = `${path.basename(file, path.extname(file))}.html`
        return (
            new HtmlWebpackPlugin({
                template: file,
                filename: path.join(prefixPath, newFileName),
                hash: mix.inProduction(),
            })
        )
    })
    mix.webpackConfig({
        module: {
            rules: [{
                test: /\.twig$/,
                use: ['raw-loader', {
                    loader: 'twig-html-loader',
                    options: { autoescape: true },
                }]
            }]
        },
        output: { publicPath: '' }, // Fix path issues
        plugins: templatePages
    })
}

/**
 * 🎭 Hashing
 * Mix has querystring hashing by default, eg: main.css?id=abcd1234
 * This script converts it to filename hashing, eg: main.abcd1234.css
 * https://github.com/JeffreyWay/laravel-mix/issues/1022#issuecomment-379168021
 */
if (mix.inProduction() && !buildSrcTemplates) {
    // Allow versioning in production
    mix.version()
    // Get the manifest filepath for filehash conversion
    const manifestPath = path.join(config.publicFolder, "mix-manifest.json")
    // Run after mix finishes
    mix.then(() => {
        const laravelMixMakeFileHash = require("laravel-mix-make-file-hash")
        laravelMixMakeFileHash(config.publicFolder, manifestPath)
    })
}

/**
 * 🎨 Styles: Main
 * Uses dart-sass which has a replica API to Node-Sass
 * https://laravel-mix.com/docs/4.0/css-preprocessors
 * https://github.com/sass/node-sass#options
 */
// Get a list of style files within the base styles folder
const styleFiles = getFilesIn(path.resolve(__dirname, source.styles), [ "scss", "sass" ])
// Data to send to style files
const styleData = `$isDev: ${!mix.inProduction()};`
// Create an asset for every style file
styleFiles.forEach(styleFile => {
    mix.sass(
        styleFile,
        path.join(config.publicFolder, config.publicBuildFolder),
        { data: styleData }
    )
})

/**
 * 🎨 Styles: CriticalCSS
 * https://github.com/addyosmani/critical#options
 */
// (Optional) Set the baseurl in your .env, eg: `BASE_URL=http://google.com`
const criticalDomain = process.env.BASE_URL || config.devProxyDomain
if (criticalDomain) {
    require("laravel-mix-critical")
    const url = require("url")
    mix.critical({
        enabled: mix.inProduction() && config.criticalCssUrls.length,
        urls: config.criticalCssUrls.map(page => ({
            src: url.resolve(criticalDomain, page.urlPath),
            dest: path.join(
                config.publicFolder,
                config.publicBuildFolder,
                `critical-${page.label}.css`
            ),
        })),
        options: {
            width: 1200,
            height: 1200,
        },
    })
}

/**
 * 🎨 Styles: PurgeCSS
 * https://github.com/spatie/laravel-mix-purgecss#usage
 */
if (config.purgeCssGrabFolders.length) {
    require("laravel-mix-purgecss")
    mix.purgeCss({
        enabled: mix.inProduction(),
        globs: [path.join(__dirname, config.publicFolder, "*.html")],
        folders: config.purgeCssGrabFolders, // Folders scanned for selectors
        extensions: ["php", "twig", "html", "js", "mjs", "vue"],
    })
}

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
 * 🎨 Styles: Linting
 */
if (!mix.inProduction()) {
    require("laravel-mix-stylelint")
    mix.stylelint({ configFile: null, context: null })
}

/**
 * 🎨 Styles: Other
 * https://laravel-mix.com/docs/4.0/options
 */
mix.options({
    // Disable processing css urls for speed
    // https://laravel-mix.com/docs/4.0/css-preprocessors#css-url-rewriting
    processCssUrls: false,
})

/**
 * 📑 Scripts: Main
 * Script files are transpiled to vanilla JavaScript
 * https://laravel-mix.com/docs/4.0/mixjs
 */
const scriptFiles = getFilesIn(path.resolve(__dirname, source.scripts), [ "js", "mjs"])
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
 * 📑 Scripts: Linting
 */
if (!mix.inProduction()) {
    require("laravel-mix-eslint")
    mix.eslint()
}

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
 * 🎆 Icons
 * Individual SVG icons are optimised then combined into a single cacheable SVG
 * https://github.com/kisenka/svg-sprite-loader#configuration
 */
require("laravel-mix-svg-sprite")
mix.svgSprite(source.icons, path.join(config.publicBuildFolder, "sprite.svg"), {
    symbolId: filePath => `icon-${path.parse(filePath).name}`,
    extract: true,
})

/**
 * 🗂️ Static
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
            cleanOnceBeforeBuildPatterns: config.publicToCleanBeforeStart,
        }),
    ],
})

/**
 * 🚧 Webpack-dev-server
 * https://webpack.js.org/configuration/dev-server/
 */
mix.webpackConfig({
    devServer: {
        clientLogLevel: "none", // Hide console feedback so eslint can take over
        open: true,
        overlay: true,
        public: "localhost:8080",
        host: "0.0.0.0", // Allows access from network
        https: config.devProxyDomain.includes("https://"),
        contentBase: config.devWatchPaths.length ? config.devWatchPaths : undefined,
        watchContentBase: config.devWatchPaths.length > 0,
        watchOptions: {
            aggregateTimeout: 200,
            poll: 200, // Lower for faster reloads (more cpu intensive)
            ignored: /node_modules/,
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