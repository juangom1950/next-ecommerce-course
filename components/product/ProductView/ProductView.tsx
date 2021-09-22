
import cn from 'classnames'
import { FC, useState } from 'react'
import s from './ProductView.module.css'
import { Container, Button } from '@components/ui'
import Image from "next/image"
import { Product } from '@common/types/product'
import { ProductSlider, Swatch } from "@components/product"
import { Choices, getVariant } from '../helpers'
import { useUI } from '@components/ui/context'
import useAddItem from "@framework/cart/use-add-item"

interface Props {
  product: Product
}

const ProductView: FC<Props> = ({ product }) => {
  const [ choices, setChoices ] = useState<Choices>({})
  const [ isLoading, setIsLoading ] = useState(false)

  const { openSidebar } = useUI()
  const addItem = useAddItem()

  const variant = getVariant(product, choices)

  const addToCart = async () => {
    try {
      const item = {
        //String wold ensure that this is string
        productId: String(product.id),
        variantId: String(variant ? variant.id : product.variants[0].id),
        quantity: 1
      }

      setIsLoading(true)
      await addItem(item)
      setIsLoading(false)
      openSidebar()
    } catch {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <div className={cn(s.root, 'fit', "mb-5")}>
        <div className={cn(s.productDisplay, 'fit')}>
          <div className={s.nameBox}>
            <h1 className={s.name}>
              {product.name}
            </h1>
            <div className={s.price}>
              {product.price.value}
              {` `}
              {product.price.currencyCode}
            </div>
          </div>
          <ProductSlider>
            { product.images.map(image =>
               //console.log("Image View: ", image.url)
               //Remember that you need to add a key whenver you are iterating through items
              <div key={image.url} className={s.imageContainer}>
                <Image
                  className={s.img}
                  src={"/images/" + image.url}
                  alt={image.alt}
                  width={1050}
                  height={1050}
                  quality="85"
                />
              </div>
            )}
          </ProductSlider>
        </div>
        <div className={s.sidebar}>
          {/* Check what we are giving back from product.options */}
          {/* { JSON.stringify(product.options) } */}
          <section>
            { product.options.map(option =>
              <div key={option.id} className="pb-4">
                <h2 className="uppercase font-medium">{option.displayName}</h2>
                <div className="flex flex-row py-4">
                  { option.values.map(optValue => {
                    //extracting here the active choice: size: "l", "s", "m" or color: "#ffffff"
                    const activeChoice = choices[option.displayName.toLowerCase()]
                    //console.log(activeChoice);
                    return (
                      <Swatch
                        key={`${option.id}-${optValue.label}`}
                        label={optValue.label}
                        color={optValue.hexColor}
                        variant={option.displayName}
                        active={optValue.label.toLowerCase() === activeChoice}
                        onClick={() => {
                          //Get the actual choices pluss the new choice
                          setChoices({
                            ...choices,
                            [option.displayName.toLowerCase()]: optValue.label.toLowerCase()
                          })
                        }}
                      />
                    )}
                  )}
                </div>
              </div>
            )}
            <div className="pb-14 break-words w-full max-w-xl text-lg">
              { product.description }
            </div>
          </section>
          <div>
            <Button
              className={s.button}
              onClick={addToCart}
              isLoading={isLoading}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ProductView
