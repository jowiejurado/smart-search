import style from './Container.module.scss'

type Props = {
  children: React.ReactNode
  size?: 'small' | 'medium' | 'mediumLarge' | 'large'
  wrap?: boolean
  classes?: string
}

const Container = ({ children, size = 'large', wrap = true, classes }: Props) => {
  const content = <div className={`${style.container} ${style[size]}`}>{children}</div>
  
  return wrap ? <div className={classes}>{content}</div> : content
}

export default Container
