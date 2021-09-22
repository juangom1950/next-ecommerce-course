import { Product } from "@common/types/product";


type AvailableChoices = "color" | "size" | string

export type Choices = {
  [P in AvailableChoices]: string
}

//If it is true. It would return the variant
export const getVariant = (product: Product, choices: Choices) =>
  product.variants.find(variant =>
    //I want to find our if every option in the variant is matching my choices
    variant.options.every(variantOption => {
      const optionName = variantOption.displayName.toLocaleLowerCase()
        return optionName in choices &&
         choices[optionName] === variantOption.values[0].label
    })
  )

