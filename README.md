<p><img width="100%" src="" alt="Agency Webpack Mix Config words"></p>

# Agency Webpack-Mix Config

A modern build config built with the busy web agency in mind.

It provides an excellent developer experience with a familiar filesystem for your project files and Webpacks fast dev server.

Waste less time testing in older browsers with automatic polyfills to the browsers you support.

## Config features

- Adapts well to new projects<br>
[Laravel Mix](https://laravel.com/docs/5.8/mix#introduction) helps make build adjustments quick and painless

- Frictionless media additions<br>
Add project files or npm libraries without restarting your dev server

- Minimal config files<br>
Avoid excessive build files polluting your project

- Modern and popular defaults<br>
ES6+ JavaScript, Style and script linting, Fast development builds

- Source aliases to reduce folder traversals<br>
More `images/resource.jpg`, less `./../../images/resource.jpg`
- [Browserslist](https://github.com/browserslist/browserslist#browserslist-) powered polyfills<br>
TODO: Elaborate...
- Scripts > Separate node_module scripts file
- Scripts > Library autoimport
- Scripts > Linting with EsLint
- Styles > [PurgeCSS](https://www.purgecss.com/)
- Styles > [PostCSS](https://postcss.org/)
- Styles > Linting with StyleLint
- Images > SVG icon sprite
- Images > Image and SVG compression
- Sourcemaps
- Manifest updates
- Filename hashing

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

## Tasks:

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
- [Laravel Mix Docs](https://laravel.com/docs/5.8/mix)
- [Webpack HMR](https://webpack.js.org/concepts/hot-module-replacement/) (Hot Module Replacement)