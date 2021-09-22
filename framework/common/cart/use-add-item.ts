

import { MutationHook } from "@common/types/hooks"
import {
  useHook,
  useMutationHook
} from "@common/utils/use-hook"

export type UseAddItem<
  H extends MutationHook = MutationHook<any>
> = ReturnType<H["useHook"]>

const useAddItem: UseAddItem = () => {
  debugger
  //hooks parameter returns with the list of APIHooks that is set in useHook()
  const hook = useHook((hooks) => {
    debugger
    //This returns a useAddItem which is an object that has: fetcherOptions, fetcher and useHook
    //Check: framework>common>types Hooks>ApiHooks
    return hooks.cart.useAddItem
  })

  //I am destructuring hooks here to get acess to the properties of the object
  //fetcherOptions, fetcher and useHook
  return useMutationHook({...hook})()
}

export default useAddItem
