import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'

type ButtonProps = {
  label: string
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'alternative'
  query?: {}
  classes?: string
}

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-800',
  secondary: 'bg-gray-500 text-white hover:bg-gray-600',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  alternative: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100',
}

const Button = ({
  label,
  onClick = () => {},
  href,
  type = 'button',
  loading = false,
  disabled = false,
  variant = 'primary',
  query,
  classes = ''
}: ButtonProps) => {

  const buttonClasses = clsx(
    'px-4 py-2 rounded',
    variant && variantClasses[variant],
    classes
  )

	if (href) {
    return (
      <Link className={buttonClasses} href={{ pathname: href, query: query }}>
        {loading ? 'Loading...' : label}
      </Link>
    )
  } else {
    return (
      <button onClick={onClick} type={type} className={buttonClasses} disabled={disabled}>
        {loading ? 'Loading...' : label}
      </button>
    )
  }
}

export default Button
