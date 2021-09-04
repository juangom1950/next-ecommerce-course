
import "@assets/main.css"
import 'keen-slider/keen-slider.min.css'
import { AppProps } from "next/app"
import { FC } from "react"
import { UIProvider } from "@components/ui/context"

//Add this to avoid undefine error if we don't add Home.Layout = Layout in the index.tsx page
const Noop: FC = ({children}) => <>{children}</>

//This file will wrap all of your pages. This is specific of next.js
//Here we need to extend the Component to have to include Layout: FC Video: Reusable layout 4:30min
function MyApp({Component, pageProps}: AppProps & {Component: {Layout: FC}}) {
  //If Component.Layout is undefine then go with Noop
  const Layout = Component.Layout ?? Noop

  return (
    <UIProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UIProvider>
  )
}

export default MyApp
