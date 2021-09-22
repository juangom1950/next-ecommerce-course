

import { Layout } from "@components/common"
import { getConfig } from "@framework/api/config"
import {
  getAllProductsPaths,
  getProduct
} from "@framework/product"
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next"
import { ProductView } from "@components/product"

// fetch all of the products slugs
export const getStaticPaths: GetStaticPaths = async () => {
  const config = getConfig()
  const { products } = await getAllProductsPaths(config)

  return {
    //Here I am just returning the paths. params: {slug: "cool-hat"}
    paths: products.map(p => ({params: {slug: p.slug}})),
    //Through and error when you try to navigate to a page that doesn't exist
    fallback: false
  }
}

// provide product specific data to the page
//You get the params from the props
export const getStaticProps = async ({
  params }: GetStaticPropsContext<{slug: string}>
) => {
  const config = getConfig()

  const { product } = await getProduct({
    config,
    variables: {slug: params?.slug}
  })

  return {
    props: {
      product
    }
  }
}

export default function ProductSlug({
  product }: InferGetStaticPropsType<typeof getStaticProps>
) {
  console.log(JSON.stringify(product, null, 2))

  return (
    <>
      {/* {JSON.stringify(product?.images, null, 2)} */}

      {/* {product?.name}
      {product?.slug}
      {product?.path}
      {product?.price.value}
      {product?.price.currencyCode} */}

      { product && <ProductView product={product} />}
    </>
  )
}


ProductSlug.Layout = Layout
