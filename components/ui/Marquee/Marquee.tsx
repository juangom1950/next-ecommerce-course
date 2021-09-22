
import { ReactNode, FC } from "react"
import Ticker from "react-ticker"
import s from "./Marquee.module.css"
import cn from "classnames"

interface Props {
  children: ReactNode[]
  variant?: "primary" | "secondary"
}

const Marquee: FC<Props> = ({children, variant = "primary"}) => {
  const rootClassName = cn(
    s.root,
    {
      //This will apply only if the viriant that we are getting from the prop is secundary
      [s.secondary]: variant === "secondary"
    }
  )

  return (
    <div className={rootClassName}>
      {/* 80 is the number of pixels from where the slider should start */}
      <Ticker offset={80}>
        { () =>
          <div className={s.container}>
            {children}
          </div>
        }
      </Ticker>
    </div>
  )
}

export default Marquee
