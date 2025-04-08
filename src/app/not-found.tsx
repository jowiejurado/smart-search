import type { Metadata } from 'next'
import Container from '@/components/util/container/Container'
import Button from '@/components/atoms/button/Button'
import Heading from '@/components/atoms/typography/heading/Heading'
import style from '@/app/page.module.scss'

export const metadata: Metadata = {
	title: 'Page not found',
}

const NotFound = async () => {
	return (
		<Container classes={`${style.bgImage} flex items-center align-center min-h-screen`}>
			<div className={'text-center'}>
				<Heading as={'h1'} size='xlarge' weight='extrabold'>404</Heading>
				<p className='mb-10'>Sorry, the page you are looking for does not exist.</p>
				<Button href={'/'} label={'Back to home'} variant={"primary"} />
			</div>
		</Container>
	)
}

export default NotFound
