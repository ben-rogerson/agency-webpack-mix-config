# Agency Webpack-Mix Config

<p><img width="80%" src="https://i.imgur.com/r5iZONo.png" alt="Icon"></p>

Featuring a top-class developer experience and simple filing system for your project assets, this config provides a solid platform for your next website (or web app).

## Features

### Sensible configuration complexity

Because of the complexity of raw Webpack configs, they can take an extended time to understand. [Laravel Mix](https://laravel.com/docs/5.8/mix#introduction) provides a simple layer upon Webpack to help make many build adjustments quick and painless.

### Modern mainstream defaults

Use next generation JavaScript and CSS with polyfills automatically applied to the browsers you choose to support.

### Development proxy with script and style injection

A pre-configured webpack development server rewards your code changes with snappy browser updates.
Generate additional style and script outputs just by adding them to a folder in the `src` directory.

### Static site generator

Get straight to the build with a static site generator that converts twig to html.<br>
There's also full support for CMS based sites by updating a few config values.

### Minimal config files

Avoid excessive build configuration files with all config defined in `webpack.mix.js`.<br>
The `package.json` contains browser targets and linting configs.

## Build actions

### `src/styles`

Style files are compiled to CSS and PostCss plugins provide additional transformations and optimisations.

<p><img width="80%" src="https://i.imgur.com/H3IkPgK.png" alt="Styles src folder"></p>

-   [Sass](http://sass-lang.com) auto compiling, prefixing, minifying and sourcemaps
-   [CriticalCSS](https://github.com/addyosmani/critical) and [PurgeCSS](https://www.purgecss.com/) come preconfigured to improve your page speed
-   [Autoprefixer](https://github.com/postcss/autoprefixer) and [PostCSS Preset Env](https://github.com/csstools/postcss-preset-env) provide support for older browsers
-   [StyleLint](https://github.com/stylelint/stylelint) provides error linting for oopsies

<br>

### `src/scripts`

Script files are transpiled to vanilla JavaScript and the necessary polyfills included.

<p><img width="80%" src="https://i.imgur.com/pkRrCcB.png" alt="Script src folder"></p>

-   Script transpiling with [Babel](https://babeljs.io) with minifying and sourcemaps
-   Automatic polyfills are provided by core-js 3
    Uses dart-sass which has a replica API to Node-Sass
-   [ESLint](https://eslint.org/) is provided for error linting

<br>

### `src/images`

Images are optimized and copied to the build directory.

<p><img width="80%" src="https://i.imgur.com/k0zVopU.png" alt="Image src folder"></p>

-   Optimisations are provided by [Imagemin](https://github.com/imagemin/imagemin)

<br>

### `src/icons`

Individual SVG icons are optimised then combined into a single cacheable SVG.

<p><img width="80%" src="https://i.imgur.com/YHQ82r9.png" alt="Icons src folder"></p>

-   An async script adds the svg sprite to your page
-   You can display an icon with svg use:<br/>

```html
<svg><use xlink:href="icon-code" /></svg>
```

<br>

### `src/static`

Additional folders with no transform requirements are copied to your build folders.

<p><img width="80%" src="https://i.imgur.com/aZc9602.png" alt="Static src folder"></p>

<br>

## Getting started

### 1. Copy this repo into a new project folder:

```bash
npx degit ben-rogerson/agency-webpack-mix-config new-project
```

&hellip;or use Github's new tool to [create a new repository](https://github.com/ben-rogerson/agency-webpack-mix-config/generate) then clone the project down.

### 2. Install the dependencies:

```bash
cd new-project && npm install
```

### 3. Update the proxy domain and start adding project files

This config allows for either static or dynamic templates.

#### a) Start a static site

This option converts the Twig templates in `src/templates` into static Html files and hashes assets during a production build.

Add the new site to proxy using Valet/Homestead/etc and update the `devProxyDomain` in `webpack.mix.js`, eg:

```javascript
const config = {
    devProxyDomain: "http://my-static-site.test",
}
```

Then run `npm run dev` to start your development server.

#### b) Start a dynamic site

This option lets you use a CMS and during production it compresses and hashes assets and creates a manifest file.

You could add any CMS but in this example I'll copy in the files from the [Craft CMS starter](https://github.com/craftcms/craft):<br>

```bash
npx degit --force craftcms/craft
```

Craft requires a `templates` directory in the base folder for its twig templates so I'll update the following config values in `webpack.mix.js`:

```javascript
const config = {
    devProxyDomain: "http://my-craft-site.test",
    devWatchTemplatePaths: ["templates"],
    purgeCssGrabFolders: ["src", "templates"],
    buildStaticSite: false,
}
```

You'd then add the new site to proxy using Valet/Homestead/etc and complete the Craft install.

Then run `npm run dev` to start your development server.

## Tasks

The following tasks are available:

```bash
npm run dev
# Run the development server

npm run start
# Run the development build

npm run build
# Run the production build

npm run fix-scripts
# Fixes your javascript with eslint

npm run fix-styles
# Fixes your styles with stylelint
```
