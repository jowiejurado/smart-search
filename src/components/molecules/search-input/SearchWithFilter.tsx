import React, { useState, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const SearchWithFilter = () => {
	const [inputValue, setInputValue] = useState();
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className='min-w-screen'>
			<form
				action=""
				role="search"
				noValidate
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();

					if (inputRef.current) {
						inputRef.current.blur();
					}
				}}
				className="max-w-1/4 flex mx-auto relative items-center"
			>
				<span className="absolute bg-gray-900 dark:bg-white rounded-full p-2.5 top-2.75 left-0.75">
					<MagnifyingGlassIcon className="w-5 h-5 text-white dark:text-gray-900" />
				</span>
				<input
					ref={inputRef}
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="off"
					placeholder="Type keywords"
					spellCheck={false}
					maxLength={512}
					value={inputValue}
					// onChange={
					// 	(event) => {
					// 		setQuery(event.currentTarget.value);
					// 	}
					// }
					autoFocus
					className="block mt-2 py-3 pl-12 pr-24 w-full placeholder-gray-900/50 rounded-full border border-gray-900 bg-transparent text-gray-900 outline-0 dark:placeholder-white/50 dark:border-gray-600 dark:text-white"
				/>
				<button type="submit" className="absolute bg-gray-900 dark:bg-white rounded-full py-2.5 px-4 top-2.75 right-0.75 capitalize font-semibold text-white dark:text-gray-900">
					Search
				</button>
			</form>
		</div>
	);
}

export default SearchWithFilter;
