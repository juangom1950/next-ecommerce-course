
import {
  Checkout,
  CheckoutLineItemEdge,
  ImageEdge,
  MoneyV2,
  Product as ShopifyProduct,
  ProductOption,
  ProductVariantConnection,
  SelectedOption
} from "../schema"

import { Product } from "@common/types/product"
import { Cart, LineItem } from "@common/types/cart"

export const normalizeCart = (checkout: Checkout): Cart => {
  return {
    id: checkout.id,
    createdAt: checkout.createdAt,
    completedAt: checkout.completedAt,
    currency: {
      code: checkout.totalPriceV2.currencyCode
    },
    taxesIncluded: checkout.taxesIncluded,
    lineItemsSubtotalPrice: +checkout.subtotalPriceV2.amount,
    totalPrice: checkout.totalPriceV2.amount,
    lineItems: checkout.lineItems.edges.map(normalizeLineItem),
    discounts: []
  }
}

const normalizeLineItem = ({
  node: { id, title, variant, ...rest}
}: CheckoutLineItemEdge): LineItem => {
  return {
    id,
    variantId: String(variant?.id),
    productId: String(variant?.id),
    name: title,
    path: variant?.product?.handle ?? "",
    discounts: [],
    options: variant?.selectedOptions.map(({name, value}: SelectedOption) => {
      const option = normalizeProductOption({
        id,
        name,
        values: [value]
      })

      return option
    }),
    variant: {
      id: String(variant?.id),
      sku: variant?.sku ?? "",
      name: variant?.title,
      image: {
        url: process.env.NEXT_PUBLIC_FRAMEWORK === "shopify_local" ?
          `/images/${variant?.image?.originalSrc}` :
          variant?.image?.originalSrc ?? "/product-image-placeholder.svg"
      },
      requiresShipping: variant?.requiresShipping ?? false,
      price: variant?.priceV2.amount,
      listPrice: variant?.compareAtPriceV2?.amount,
    },
    ...rest
  }
}

//Here we are destructuring "ImageConnection". Check "ImageConnection" in schema.d.ts
const normalizeProductImages = ({edges}: {edges: Array<ImageEdge>}) =>
  // Here I am destruturing Image and then
  //I am creating an url alias for originalSrc
  edges.map(({node: { originalSrc: url, ...rest}}) => ({
    url: process.env.NEXT_PUBLIC_FRAMEWORK === "shopify_local" ?
    `/images/${url}` :
    url ?? "/product-image-placeholder.svg",
    ...rest }
  ))

const normalizeProductPrice = ({currencyCode, amount}: MoneyV2) => ({
  //+ sign will transform from string to number
  value: +amount,
  currencyCode
})

const normalizeProductOption = ({
  id,
  values,
  name: displayName
}: ProductOption) => {

  const normalized = {
    id,
    displayName,
    values: values.map(value => {
      let output: any = {
        label: value
      }
      //This match: color, colour,
      //gi menas case insensitive
      if (displayName.match(/colou?r/gi)) {
        output = {
          ...output,
          hexColor: value
        }
      }

      return output
    })
  }

  return normalized
}

const normalizeProductVariants = ({ edges }: ProductVariantConnection) => {

  return edges.map(({node}) => {
    const { id, selectedOptions, sku, title, priceV2, compareAtPriceV2} = node

    return {
      id,
      name: title,
      sku: sku || id,
      price: +priceV2.amount,
      listPrice: +compareAtPriceV2?.amount,
      requiresShipping: true,
      //Estructuring SelectOptions
      options: selectedOptions.map(({name, value}: SelectedOption) => {
        const option = normalizeProductOption({
          id,
          name,
          values: [value]
        })

        return option
      })
    }
  })
}

export function normalizeProduct(productNode: ShopifyProduct): Product {
  const {
    id,
    //name is an alias
    title: name,
    handle,
    vendor,
    description,
    //I am creating the imageConnection alias
    images: imageConnection,
    priceRange,
    options,
    variants,
    ...rest
  } = productNode

  const product = {
    id,
    name,
    vendor,
    description,
    path: `/${handle}`,
    //It will remove "\" from the beginning and the end. It will just get the name
    // Ex: /cool-hat/ It will get just "cool-hat" Video: "Normmalize Product" 11:15min
    slug: handle.replace(/^\/+|\/+$/g, ""),
    images: normalizeProductImages(imageConnection),
    price: normalizeProductPrice(priceRange.minVariantPrice),
    options: options ?
      options.filter(o => o.name !== "Title")
             .map(o => normalizeProductOption(o)) : [],
    variants: variants ?
      normalizeProductVariants(variants) : [],
    ...rest
  }

  return product
}
