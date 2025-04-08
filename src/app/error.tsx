'use client';

import Container from '@/components/util/container/Container';
import Heading from '@/components/atoms/typography/heading/Heading';
import Button from '@/components/atoms/button/Button';
import style from '@/app/page.module.scss';

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
	return (
		<Container classes={`${style.bgImage} flex items-center align-center min-h-screen`}>
			<div className={'text-center'}>
				<Heading as={'h1'} size='xlarge' weight='extrabold'>Oops!</Heading>
				<p className='mb-10'>Sorry, something went wrong!</p>
				<Button href={'/'} label={'Back to home'} variant={"primary"} />
			</div>
		</Container>
	);
}

export default Error