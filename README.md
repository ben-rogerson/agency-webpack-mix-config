# Agency Webpack-Mix Config

<p><img width="100%" style="max-width:650px;" src="src/images/demo-logo.png" alt="Icon"></p>

<big>
A capable website/webapp config built for the modern web agency.

Featuring a top-class developer experience and simple filing system for your project assets, this config provides a solid platform for your next website (or web app).</big>

### Modern mainstream defaults

Use next generation JavaScript and CSS with polyfills automatically applied to the browsers you choose to support.

### Frictionless media additions

Add project files or npm libraries without restarting your dev server. Generate additional style and script files just by adding them to their src directories.

### Minimal config files

Avoids excessive build configuration files. All the config is defined in `webpack.mix.js` and `package.json`.

### Source folder aliases to reduce folder traversals

More `images/resource.jpg` with less `./../../images/resource.jpg`.

### Sensible configuration complexity

Raw Webpack configs are complex and can take a long time to learn. [Laravel Mix](https://laravel.com/docs/5.8/mix#introduction) provides a simple layer upon Webpack to help make many build adjustments quick and painless.

## Build actions

### `src/styles`

Style files are compiled to CSS and PostCss plugins provide additional transformations and optimisations.

<p><img width="100%" style="max-width:600px;" src="src/images/demo-styles.png" alt="Styles src folder"></p>

#### Features

-   [Sass](http://sass-lang.com) / [Less](http://lesscss.org) auto compiling, prefixing, minifying and sourcemaps
-   [CriticalCSS](https://github.com/addyosmani/critical) and [PurgeCSS](https://www.purgecss.com/) come preconfigured to improve your page speed
-   [Autoprefixer](https://github.com/postcss/autoprefixer) and [PostCSS Preset Env](https://github.com/csstools/postcss-preset-env) provide support for older browsers
-   [StyleLint](https://github.com/stylelint/stylelint) provides error linting for oopsies

### `src/scripts`

...

<p><img width="100%" style="max-width:600px;" src="src/images/demo-scripts.png" alt="Script src folder"></p>

#### Features

-   Script transpiling with [Babel](https://babeljs.io) with minifying and sourcemaps
-   Automatic polyfills are provided by core-js 3
-   [ESLint](https://eslint.org/) is provided for error linting

### `src/images`

Images are optimized with [Imagemin](https://github.com/imagemin/imagemin) and copied to the `dist` folder.

<p><img width="100%" style="max-width:600px;" src="src/images/demo-images.png" alt="Image src folder"></p>

### `src/icons`

Individual SVG icons are optimised then combined into a single cacheable SVG.

<p><img width="100%" style="max-width:600px;" src="src/images/demo-icons.png" alt="Icons src folder"></p>

An async script then adds the svg sprite which lets you display an icon like this:<br/>

```html
<svg><use xlink:href="icon-code" /></svg>
```

### `src/static`

Additional folders with no build processing requirements which are copied to your build folders.

<p><img width="100%" style="max-width:600px;" src="src/images/demo-static.png" alt="Static src folder"></p>

## Getting started

### 1. Copy this repo into a new project folder:

```bash
npx degit ben-rogerson/agency-webpack-mix-config
```

&hellip;or use Github's new tool to [create a new repository](https://github.com/ben-rogerson/agency-webpack-mix-config/generate).

### 2. Install the dependencies:

```bash
npm install
```

### 3. Add your project files

In this example I'll merge in the files from the [Craft CMS starter](https://github.com/craftcms/craft) on Github:<br>

```bash
npx degit --force craftcms/craft
# or
# npx degit --force https://bitbucket.org/user/repo
```

## Tasks

```bash
npm run dev
# Development server

npm run start
# Development build

npm run build
# Production build

npm run fix-scripts
# Fixes your javascript with eslint

npm run fix-styles
# Fixes your styles with stylelint
```

## Further reading

-   [Laravel Mix Docs](https://laravel.com/docs/5.8/mix)
-   [Webpack HMR](https://webpack.js.org/concepts/hot-module-replacement/) (Hot Module Replacement)
