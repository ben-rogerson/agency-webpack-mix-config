/**
 * Accept hot reloading from dev server
 * Without this you'll see a warning in your console
 * when running webpack-dev-server and you'll miss
 * out on hot module reloading
 */
if (module.hot) module.hot.accept()
