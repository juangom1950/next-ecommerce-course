import { createContext, ReactNode, useContext, useMemo } from "react";
import { ApiConfig, ApiProviderContext } from "./types/api";
import { ApiHooks } from "./types/hooks";

interface ApiProviderProps {
  children: ReactNode | ReactNode[]
  config: ApiConfig,
  hooks: ApiHooks
}

//Partial should make the properties on the ApiProviderContext as an optional ones.
//ApiProviderContext is the value that it is going to return
export const ApiContext = createContext<Partial<ApiProviderContext>>({})

export const ApiProvider = ({
  children,
  config,
  hooks
}: ApiProviderProps) => {

  const coreConfig = useMemo(() => {
    return {
      fetcher: config.fetch,
      hooks,
      checkoutCookie: config.checkoutCookie
    }
  }, [
    //These are the dependencies of the useMemo hook
    config.fetch,
    config.checkoutCookie,
    hooks
  ])

  return (
    <ApiContext.Provider value={coreConfig}>
      { children }
    </ApiContext.Provider>
  )
}

export const useApiProvider = () => {
  return useContext(ApiContext) as ApiProviderContext
}
