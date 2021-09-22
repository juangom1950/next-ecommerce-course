

import { useAddItem } from "@common/cart"
import { UseAddItem } from "@common/cart/use-add-item"
import useCart from "@common/cart/use-cart"
import { Cart } from "@common/types/cart"
import { MutationHook } from "@common/types/hooks"
import { CheckoutLineItemsAddPayload } from "@framework/schema"
import { checkoutToCart, getCheckoutId } from "@framework/utils"
import { checkoutLineItemsAddMutation } from "@framework/utils/mutations"

export default useAddItem as UseAddItem<typeof handler>

export type AddItemHookDescriptor = {
  fetcherInput: {
    variantId: string
    quantity: number
  }
  fetcherOutput: {
    checkoutLineItemsAdd: CheckoutLineItemsAddPayload
  }
  data: Cart
}


export const handler: MutationHook<AddItemHookDescriptor> = {
  fetcherOptions: {
    query: checkoutLineItemsAddMutation
  },
  //I am getting back this values fetch, options, input
  fetcher: async ({fetch, options, input}) => {

    const variables = {
      checkoutId: getCheckoutId(),
      lineItems: [
        {
         variantId: input.variantId,
         quantity: 1
        }
      ]
    }

    debugger
    //Here we are sending data to the server
    const { data } = await fetch({
      //Object destructuring options I can get: "query" and "variables"
       ...options,
       variables
    })

    const cart = checkoutToCart(data.checkoutLineItemsAdd.checkout)
    return cart
  },
  //This fetch comes from useMutationHooks. Famework>common>utils>use-hook.ts
  useHook: ({fetch}) => () => {
    const { mutate: updateCart } = useCart()
    debugger
    return async (input) => {
      const response = await fetch(input)
      await updateCart(response, false)
      return response
    }
  }
}
