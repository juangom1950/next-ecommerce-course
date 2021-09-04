
//Here we provide mergin configuration
const path = require("path")
const fs = require("fs")
const merge = require("deepmerge")
const prettier = require("prettier")

const ALLOWED_FW = ["shopify", "bigcommerce", "shopify_local"]
const FALLBACK_FW = "shopify"

function withFrameworkConfig(defaultConfig = {}) {
  
  //? is for in case of undefine it should not through any error. It will acept "undefined"
  let framework = defaultConfig?.framework?.name

  if (!framework) {
    console.log("Framework: ", framework)
    throw new Error("The api framework is missing, please add a valid provider!")
  }

  if (!ALLOWED_FW.includes(framework)) {
    //join will transform an array into a string separated by comma in this case
    throw new Error(`The api framework: ${framework} cannot be found, please use one of ${ALLOWED_FW.join(", ")}`)
  }

  //If shopify_local then use framework = "shopify"
  if (framework === "shopify_local") {
    framework = FALLBACK_FW
  }

  //This is refering to ../shopify/next.config.js
  const frameworkNextConfig = require(path.join("../", framework, "next.config"))
  const config = merge(defaultConfig, frameworkNextConfig)

  //cwd: "Current Working Directory" 
  //process.cwd(),will give us the path of the cwd
  const tsPath = path.join(process.cwd(), "tsconfig.json")
  const tsConfig = require(tsPath)

  //With the compilerOptions you can access the "paths" in the tsconfig.json file
  tsConfig.compilerOptions.paths["@framework"] = [`framework/${framework}`]
  tsConfig.compilerOptions.paths["@framework/*"] = [`framework/${framework}/*`]

  //This will write these new paths in the tsconfig.json file and then format then correctly with prettier
  //To use pettier here you need to install prettier: npm install --save-dev prettier
  fs.writeFileSync(
    tsPath,
    prettier.format(
      JSON.stringify(tsConfig), { parser: "json" }
    )
  )

  return config
}

module.exports = { withFrameworkConfig }
