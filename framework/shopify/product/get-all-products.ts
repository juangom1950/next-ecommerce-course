
import {
  normalizeProduct,
  getAllProductsQuery
} from "../utils"  //This automatically implies /utilis/index.js
import { ProductConnection } from "../schema"
import { Product } from "@common/types/product"
import { ApiConfig } from "@common/types/api"

type ReturnType = {
  products: ProductConnection
}

const getAllProducts = async (config: ApiConfig): Promise<Product[]> => {
  const { data } = await config.fetch<ReturnType>({
    query: getAllProductsQuery
  })

  //here we are destruturing "edge" to get "node"
  // Here I am doing aliese, I am changeing the name of node for product
  // Video: "Map Product from Conection Type" 2:30min
  const products = data.products.edges.map(({ node: product }) =>
    //normalize and return new data with the properties that we want
    normalizeProduct(product)
  ) ?? []    // Here I am saying if it is null or undefine then return an empty array

  return products
}

export default getAllProducts
