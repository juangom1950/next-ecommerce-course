
const { withFrameworkConfig } = require("./framework/common/config")

module.exports = withFrameworkConfig({
  framework: {
    // name = "shopify_local" in this case. The process.env aren't working
    //name: process.env.NEXT_PUBLIC_FRAMEWORK
    name: "shopify_local"
  },
  i18n: {
    locales: ["en-US", "es"],
    defaultLocale: "en-US"
  }
})

console.log("next.config.js", JSON.stringify(module.exports, null, 2))
