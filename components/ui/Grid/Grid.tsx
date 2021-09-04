
import { FC, ReactNode } from "react"
import s from "./Grid.module.css"
//Install this package: npm install --save classnames
import cn from "classnames"

interface Props {
  children: ReactNode[]
  layout?: "A" | "B"
}

const Grid: FC<Props> = ({
  children,
  //The default would be A
  layout = "A"
}) => {
  //This will allow as to add a class if the condition is met
  //You need to install this package: npm install --save classnames
  //and then import it here
  const rootClassName = cn(
    s.root,
    {
      //I want to applay layoutA if layout="A"
      [s.layoutA]: layout === "A",
      [s.layoutB]: layout === "B",
    }
  )

  return (
    <div className={rootClassName}>
      {children}
    </div>
  )
}

export default Grid
