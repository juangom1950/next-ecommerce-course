
import { useApiProvider } from "@common"
import { ApiFetcher } from "@common/types/api"
import { ApiHooks, Hook } from "@common/types/hooks"
import { MutationHook } from "@common/types/hooks"
import useSWR from "swr"

//This function is responsible for giving me the hook from the provider
//apiHooks is the hook that useApiProvider() is going to return
export const useHook = <H>(fn: (apiHooks: ApiHooks) => H) => {
  //Here we are getting this particular hook
  const { hooks } = useApiProvider()
  //This makes the function to execute from where it is coming from
  return fn(hooks)
}

export const useMutationHook = (
  hook: MutationHook
) => {
  //fetcher should be doing the request to GraphQL
  const { fetcher } = useApiProvider()

  return hook.useHook({
    fetch: (input: any) => {
      return hook.fetcher({
        input,
        fetch: fetcher,
        options: hook.fetcherOptions
      })
    }
  })
}

const useData = (hook: any, fetcher: ApiFetcher, ctx: any) => {
  const hookFetcher = async (query: string) => {
    try {
      return await hook.fetcher({
        fetch: fetcher,
        options: { query },
        input: {}
      })
    } catch(error) {
      throw error
    }
  }

  const response = useSWR(
    hook.fetcherOptions.query,
    hookFetcher,
    ctx.swrOptions
  )

  return response
}

// cache data first if possible
export const useSWRHook = (hook: any) => {
  const { fetcher } = useApiProvider()

  return hook.useHook({
    useData(ctx: any) {
      const data = useData(
        hook,
        fetcher,
        ctx
      )
      return data
    }
  })
}
