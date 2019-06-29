/**
 * SVG Icon Sprite
 *
 * Usage in HTML:
 *
 * Add the data-icons attribute to the body:
 * <body data-icons="PATH_TO_ICON_SPRITE">
 *
 * Use this code to display an icon:
 * (Css is also required to display the icon correctly)
 * <svg><use xlink:href="{{ "#icon-FILENAME" }}"/></svg>
 */

/**
 * Require files for the SVG icon sprite
 */
require.context("icons", true, /\.svg$/)

/**
 * Insert a hidden SVG containing icons at the top of the body
 */
const bodyElement = document.querySelector("body")
const bodyAttribute = "data-icons"
const iconsPath = bodyElement.getAttribute(bodyAttribute)

const inlineFile = iconsPath => {
    if (!iconsPath) {
        return console.warn(
            `No body attribute of "${bodyAttribute}" found for SVG icon sprite`
        )
    }

    const request = new XMLHttpRequest()
    request.open("GET", iconsPath, true)

    request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
            const svgIcon = request.responseXML.documentElement
            svgIcon.setAttribute("display", "none")
            svgIcon.setAttribute("aria-hidden", true)
            bodyElement.insertBefore(svgIcon, bodyElement.firstChild),
                bodyElement.removeAttribute(bodyAttribute)
        }
    }

    request.send()
}

inlineFile(iconsPath)
