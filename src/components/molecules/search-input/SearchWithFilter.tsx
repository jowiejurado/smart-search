'use client';

import React, { useState, useRef, useEffect } from 'react';
import Typesense from 'typesense';
import { createAutocomplete } from '@algolia/autocomplete-core';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import style from "./SearchWithFilter.module.scss";

const SearchWithFilter = () => {
	const [autocompleteState, setAutocompleteState] = useState<any>({ collections: [] });
	const inputRef = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

	const autocomplete = createAutocomplete({
		placeholder: 'Type keywords...',
		openOnFocus: true,
		onStateChange({ state }) {
			setAutocompleteState(state);
		},
		getSources({ query }): any {
			if (!query) return [];

			const typesenseClient = new Typesense.Client({
				apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY ?? 'xyz',
				nodes: [
					{
						url: `${process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL}://${process.env.NEXT_PUBLIC_TYPESENSE_HOST}`,
					},
				],
				connectionTimeoutSeconds: 2,
			});

			return [
				{
					sourceId: 'articles',
					async getItems() {
						const result = await typesenseClient
							.collections('articles')
							.documents()
							.search({
								q: query,
								query_by: 'title,content,tags',
								highlight_full_fields: 'title,content,tags',
								highlight_start_tag: '<b>',
								highlight_end_tag: '</b>',
								per_page: 5,
							});

						return result.hits;
					},
					getItemInputValue({ item }: any) {
						return item.document.title;
					},
				}
			];
		}
	});

	const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		autocomplete.setQuery(event.target.value);
		setQuery(event.target.value);

		if (event.target.value.trim() !== '') {
			autocomplete.setIsOpen(true);
		} else {
			autocomplete.setIsOpen(false);
		}
		autocomplete.refresh();
	};

	useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      autocomplete.setQuery(debouncedQuery);
      autocomplete.setIsOpen(true);
    } else {
      autocomplete.setIsOpen(false);
    }
    autocomplete.refresh();
  }, [debouncedQuery]);

	return (
		<div className="min-w-screen relative">
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
				className="max-w-md flex flex-col mx-auto relative" // <-- flex-col
			>
				<div className="relative w-full">
					<span className="absolute bg-gray-900 dark:bg-white rounded-full p-2 top-3 left-1">
						<MagnifyingGlassIcon className="w-5 h-5 text-white dark:text-gray-900" />
					</span>
					<input
						ref={inputRef}
						id="autocomplete-input"
						autoComplete="off"
						autoCorrect="off"
						autoCapitalize="off"
						spellCheck={false}
						maxLength={512}
						value={query}
						onChange={handleInput}
						onFocus={() => {
							if (query?.trim()) {
								autocomplete.setIsOpen(true);
								autocomplete.refresh();
							}
						}}
						placeholder="Type keywords"
						className="block mt-2 py-3 pl-12 pr-24 w-full placeholder-gray-900/50 rounded-full border border-gray-900 bg-transparent text-gray-900 outline-0 dark:placeholder-white/50 dark:border-gray-600 dark:text-white"
					/>
					<button
						type="submit"
						className="absolute bg-gray-900 dark:bg-white rounded-full py-2.5 px-4 top-2.75 right-1 capitalize font-semibold text-white dark:text-gray-900"
					>
						Search
					</button>
				</div>

				{autocompleteState.isOpen && (
					<div
						className="absolute top-full mt-2 w-full rounded-md bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg z-10"
					>
						{autocompleteState.collections.map((collection: any, index: number) => (
							<div key={index}>
								{collection.items.length > 0 ? (
									<ul>
										{collection.items.map((item: any, index: number) => (
											<li
												key={index}
												className="cursor-pointer px-4 py-5 hover:bg-gray-800 dark:hover:bg-gray-200 hover:rounded-md">
												<div className={style.highlighted} dangerouslySetInnerHTML={{ __html: item.highlight.title.value }}></div>
											</li>
										))}
									</ul>
								) : (
									<div className="p-4 text-gray-500">No results</div>
								)}
							</div>
						))}
					</div>
				)}
			</form>
		</div>
	);
}

export default SearchWithFilter
