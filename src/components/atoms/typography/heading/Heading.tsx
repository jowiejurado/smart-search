import React from 'react'
import style from './Heading.module.scss'

type HeadingProps = {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size: 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall'
  font?: 'lato' | 'arial'
  color?: string
  weight?: 'normal' | 'bold' | 'extrabold'
  children: React.ReactNode
}

const Heading = ({ as, size, children, font = 'lato', color = 'navy', weight = 'bold' }: HeadingProps) => {
  const HeaderTag = as;

  return (
    <HeaderTag className={`${style.heading} ${style[size]} ${style[font]} ${style[color]} ${style[weight]}`}>
      {children}
    </HeaderTag>
  )
}

export default Heading