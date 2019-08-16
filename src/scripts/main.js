import "./modules/svgIconSprite"
import "./vue/main"

/**
 * Accept hot reloading from dev server
 * Without this you may see this warning in your console:
 * "[HMR] Cannot apply update. Need to do a full reload!"
 */
if (module.hot) module.hot.accept()
