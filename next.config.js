
const { withFrameworkConfig } = require("./framework/common/config")

module.exports = withFrameworkConfig({
  framework: {
    // name = "shopify_local" in this case
    name: process.env.NEXT_PUBLIC_FRAMEWORK
  },
  i18n: {
    locales: ["en-US", "es"],
    defaultLocale: "en-US"
  }
})

console.log("next.config.js", JSON.stringify(module.exports, null, 2))
