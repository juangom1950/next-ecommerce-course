import { ReactNode, FC, ComponentType, HTMLAttributes } from "react";


interface Props {
  //ReactNode[] is to allow multiple children
  children: ReactNode | ReactNode[]
  el?: ComponentType<HTMLAttributes<HTMLElement>>
}

// The div here is provided by default
const Container: FC<Props> = ({children, el: Component = "div"}) => {

  return (
    <Component
      //mx-auto will style the element in the middle
      // To add max-w-8xl here you need to add "macWidth" in tailwind.config.js
      className="px-6 mx-auto max-w-8xl">
      {children}
    </Component>
  )
}

export default Container;
