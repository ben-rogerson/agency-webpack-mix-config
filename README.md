<p><img width="100%" src="" alt="Icon"></p>

# Agency Webpack-Mix Config

A capable website/webapp config built for the modern web agency.

Featuring a top-class developer experience and simple filing system for your project assets, this config provides a solid platform for your next website (or web app).

- Modern and popular defaults<br>
Use next generation JavaScript and CSS with polyfills automatically applied to the browsers you choose to support.

- Frictionless media additions<br>
Add project files or npm libraries without restarting your dev server. Generate additional style and script files just by adding them to their src directories.

- Minimal config files<br>
Avoids excessive build configuration files. All the config is defined in `webpack.mix.js` and `package.json`.

- Source folder aliases to reduce folder traversals<br>
More `images/resource.jpg` with less `./../../images/resource.jpg`.

- Sensible configuration complexity<br>
Raw Webpack configs are complex and can take a long time to learn. [Laravel Mix](https://laravel.com/docs/5.8/mix#introduction) provides a simple layer upon Webpack to help make many build adjustments quick and painless.

## Src folder actions

- ```styles```: [Sass](http://sass-lang.com) / [Less](http://lesscss.org) auto compiling, prefixing, minifying and sourcemapping. Preconfigured [CriticalCSS](https://github.com/addyosmani/critical) and [PurgeCSS](https://www.purgecss.com/) to improve your page speed and [postcss-preset-env](https://github.com/csstools/postcss-preset-env) to provide backwards capability. [PostCSS](https://postcss.org/) for Autoprefixer and additional plugins. [StyleLint](https://github.com/stylelint/stylelint) provided for error linting.
- ```scripts```: Script transpiling with [Babel](https://babeljs.io), minifying and sourcemapping. Automatic polyfills are provided by core-js 3. [ESLint](https://eslint.org/) provided for error linting.
- ```images```: Images are automatically optimized with [Imagemin](https://github.com/imagemin/imagemin)
- ```icon```: Individual SVG icons are combined into a single cacheable SVG
- ```static```: Additional folders to be copied to your build folders

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