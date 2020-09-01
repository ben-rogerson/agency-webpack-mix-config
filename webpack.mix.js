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
 * 🎨 Styles: Polyfills
 * 🎨 Styles: Vendor
 * 🎨 Styles: Other
 * 📑 Scripts
 * 📑 Scripts: Polyfills
 * 📑 Scripts: Auto import libraries
 * 📑 Scripts: Linting
 * 🏞 Images
 * 🎆 Icons
 * 🗂️ Static
 * 🚧 Webpack-dev-server
 */

// 🎚️ Base config
const config = {
    // Dev domain to proxy
    devProxyDomain: process.env.DEFAULT_SITE_URL || "http://site.test",
    // Paths to observe for changes then trigger a full page reload
    devWatchPaths: ["src/templates"],
    // Port to use with webpack-dev-server
    devServerPort: 8080,
    // Folders where purgeCss can look for used selectors
    purgeCssGrabFolders: ["src"],
    // Build a static site from the src/template files
    buildStaticSite: true,
    // Urls for CriticalCss to look for "above the fold" Css
    criticalCssUrls: [
        // { urlPath: "/", label: "index" },
        // { urlPath: "/about", label: "about" },
    ],
    // Folder served to users
    publicFolder: "web",
    // Foldername for built src assets (publicFolder base)
    publicBuildFolder: "dist",
}

// 🎚️ Imports
const mix = require("laravel-mix")
const path = require("path")
const globby = require("globby")

// 🎚️ Source folders
const source = {
    icons: path.resolve("src/icons"),
    images: path.resolve("src/images"),
    scripts: path.resolve("src/scripts"),
    styles: path.resolve("src/styles"),
    static: path.resolve("src/static"),
    templates: path.resolve("src/templates"),
}

// 🎚️ Misc
mix.setPublicPath(config.publicFolder)
mix.disableNotifications()
mix.webpackConfig({ resolve: { alias: source } })
!mix.inProduction() && mix.sourceMaps()

/**
 * 🏠 Templates (for static sites)
 * Convert Twig files to Html
 * https://github.com/ben-rogerson/laravel-mix-twig-to-html
 */
if (config.buildStaticSite && source.templates) {
    require("laravel-mix-twig-to-html")
    mix.twigToHtml({
        files: [
            {
                template: path.resolve(
                    __dirname,
                    source.templates,
                    "**/*.{twig,html}"
                ),
                minify: {
                    collapseWhitespace: mix.inProduction(),
                    removeComments: mix.inProduction(),
                },
            },
        ],
        fileBase: source.templates,
        twigOptions: {
            data: require(path.join(source.templates, "_data", "data.js")),
        },
    })
}

/**
 * 🎭 Hashing (for non-static sites)
 * Mix has querystring hashing by default, eg: main.css?id=abcd1234
 * This script converts it to filename hashing, eg: main.abcd1234.css
 * https://github.com/JeffreyWay/laravel-mix/issues/1022#issuecomment-379168021
 */
if (mix.inProduction() && !config.buildStaticSite) {
    // Allow versioning in production
    mix.version()
    // Get the manifest filepath for filehash conversion
    const manifestPath = path.join(config.publicFolder, "mix-manifest.json")
    // Run after mix finishes
    mix.then(() => {
        const convertToFileHash = require("laravel-mix-make-file-hash")
        convertToFileHash({
            publicPath: config.publicFolder,
            manifestFilePath: manifestPath,
        })
    })
}

/**
 * 🎨 Styles: Main
 * Uses dart-sass which has a replica API to Node-Sass
 * https://laravel-mix.com/docs/4.0/css-preprocessors
 * https://github.com/sass/node-sass#options
 */
// Get a list of style files within the base styles folder
const styleFiles = globby.sync(`${source.styles}/*.{scss,sass}`)
// Data to send to style files
const styleData = `$isDev: ${!mix.inProduction()};`
// Create an asset for every style file
styleFiles.forEach(styleFile => {
    mix.sass(
        styleFile,
        path.join(config.publicFolder, config.publicBuildFolder),
        { prependData: styleData }
    )
})

/**
 * 🎨 Styles: CriticalCSS
 * https://github.com/addyosmani/critical#options
 */
const criticalDomain = config.devProxyDomain
if (criticalDomain && config.criticalCssUrls && config.criticalCssUrls.length) {
    require("laravel-mix-critical")
    const url = require("url")
    mix.critical({
        enabled: mix.inProduction(),
        urls: config.criticalCssUrls.map(page => ({
            src: url.resolve(criticalDomain, page.urlPath),
            dest: path.join(
                config.publicFolder,
                config.publicBuildFolder,
                `${page.label}-critical.css`
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
        folders: config.purgeCssGrabFolders, // Folders scanned for selectors
        whitelist: ["html", "body", "active", "wf-active", "wf-inactive"],
        whitelistPatterns: [],
        extensions: ["php", "twig", "html", "js", "mjs", "vue"],
    })
}

/**
 * 🎨 Styles: PostCSS
 * Extend Css with plugins
 * https://laravel-mix.com/docs/4.0/css-preprocessors#postcss-plugins
 */
const postCssPlugins = [
    // https://tailwindcss.com/docs/installation/#laravel-mix
    // require('tailwindcss')('./tailwind.config.js'),

    /**
     * 🎨 Styles: Polyfills
     * Postcss preset env lets you use pre-implemented css features
     * See https://cssdb.org/ for supported features
     * https://github.com/csstools/postcss-preset-env#readme
     */
    require("postcss-preset-env")({ stage: 2 }),
]
mix.options({ postCss: postCssPlugins })

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
const scriptFiles = globby.sync(`${source.scripts}/*.{js,mjs}`)
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
 * 📑 Scripts: Vendor
 * Separate the JavaScript code imported from node_modules
 * https://laravel-mix.com/docs/4.0/extract
 * Without mix.extract you'll see an annoying js error after
 * launching the dev server - this should be fixed in webpack 5
 */
mix.extract([]) // Empty params = separate all node_modules
// mix.extract(['jquery']) // Specify packages to add to the vendor file

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
 * https://github.com/CupOfTea696/laravel-mix-imagemin
 * https://github.com/Klathmon/imagemin-webpack-plugin#api
 *
 * Important: laravel-mix-imagemin is incompatible with
 * copy-webpack-plugin > 5.1.1, so keep that dependency at that version.
 * See: https://github.com/CupOfTea696/laravel-mix-imagemin/issues/9
 */
require("laravel-mix-imagemin")
mix.imagemin(
    {
        from: path.join(source.images, "**/*"),
        to: config.publicBuildFolder,
        context: "src/images",
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

// Icon options
mix.options({
    imgLoaderOptions: {
        svgo: {
            plugins: [
                { convertColors: { currentColor: true } },
                { removeDimensions: false },
                { removeViewBox: false },
            ],
        },
    },
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
 * 🚧 Webpack-dev-server
 * https://webpack.js.org/configuration/dev-server/
 */
mix.webpackConfig({
    devServer: {
        clientLogLevel: "none", // Hide console feedback so eslint can take over
        open: true,
        overlay: true,
        port: config.devServerPort,
        public: `localhost:${config.devServerPort}`,
        host: "0.0.0.0", // Allows access from network
        https: config.devProxyDomain.includes("https://"),
        contentBase: config.devWatchPaths.length
            ? config.devWatchPaths
            : undefined,
        watchContentBase: config.devWatchPaths.length > 0,
        watchOptions: {
            aggregateTimeout: 200,
            poll: 200, // Lower for faster reloads (more cpu intensive)
            ignored: ["storage", "node_modules", "vendor"],
        },
        disableHostCheck: true, // Fixes "Invalid Host header error" on assets
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        proxy: {
            "**": {
                target: config.devProxyDomain,
                changeOrigin: true,
                secure: false,
            },
        },
        publicPath: "/",
    },
})
mix.options({
    hmrOptions: {
        host: 'localhost',
        port: config.devServerPort
    },
})
