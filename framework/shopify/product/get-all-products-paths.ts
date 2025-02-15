import { ApiConfig } from "@common/types/api"
import { Product } from "@common/types/product"
import { ProductConnection } from "@framework/schema"
import getAllProductsPathsQuery from "@framework/utils/queries/get-all-products-paths"


type ReturnType = {
  //Pick is a special type where you can specify what property do you want to return from Product
  products: Pick<Product, "slug">[]
}

const getAllProductsPaths = async (config: ApiConfig): Promise<ReturnType> => {

  const { data } = await config.fetch<{products: ProductConnection}>({
    query: getAllProductsPathsQuery})

  const products = data.products.edges.map(({node: {handle}}) => {
    return {
      slug: handle
    }
  })

  return { products }
}

export default getAllProductsPaths
