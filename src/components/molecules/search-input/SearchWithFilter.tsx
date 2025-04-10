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
					sourceId: 'multi-search',
					async getItems() {
						const multiSearchResults = await typesenseClient.multiSearch.perform({
							searches: [
								{
									collection: 'articles',
									q: query,
									query_by: 'title,tags,author_name',
									highlight_full_fields: 'title,tags,author_name',
									per_page: 5,
								},
								{
									collection: 'locations',
									q: query,
									query_by: 'address',
									highlight_full_fields: 'address',
									per_page: 5,
								},
								{
									collection: 'comments',
									q: query,
									query_by: 'content,author_name',
									highlight_full_fields: 'content,author_name',
									per_page: 5,
								},
								{
									collection: 'users',
									q: query,
									query_by: 'username,bio,specialty,location,tags',
									highlight_full_fields: 'username,bio,specialty,location,tags',
									per_page: 5,
								},
								{
									collection: 'practitioners',
									q: query,
									query_by: 'full_name,location,specialty',
									highlight_full_fields: 'full_name,location,specialty',
									per_page: 5,
								},
								{
									collection: 'reviews',
									q: query,
									query_by: 'author_name,content',
									highlight_full_fields: 'author_name,content',
									per_page: 5,
								},
								{
									collection: 'posts',
									q: query,
									query_by: 'author_name,content,title',
									highlight_full_fields: 'author_name,content,title',
									per_page: 5,
								}
							],
						});

						const groupedResults = multiSearchResults.results.flatMap((result: any) => result?.hits?.map((hit: any) => ({
							collection: result?.request_params?.collection_name,
							document: hit?.document,
							highlight: hit?.highlight,
						}))).reduce((acc: any, current: any) => {
							if (!acc[current.collection]) {
								acc[current.collection] = [];
							}
							acc[current.collection].push(current);
							return acc;
						}, {});

						return Object.keys(groupedResults).map((collectionName: string) => ({
							sourceId: collectionName,
							items: groupedResults[collectionName],
						}));
					},
					getItemInputValue({ item }: any) {
						return null;
					},
				}
			];
		}
	});

	const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		autocomplete?.setQuery(event.target.value);
		setQuery(event.target.value);

		if (event.target.value.trim() !== '') {
			autocomplete?.setIsOpen(true);
		} else {
			autocomplete?.setIsOpen(false);
		}
		autocomplete?.refresh();
	};

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedQuery(query);
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [query]);

	useEffect(() => {
		if (debouncedQuery) {
			autocomplete?.setQuery(debouncedQuery);
			autocomplete?.setIsOpen(true);
		} else {
			autocomplete?.setIsOpen(false);
		}
		autocomplete?.refresh();
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
					if (inputRef?.current) {
						inputRef?.current.blur();
					}
				}}
				className="max-w-2xl flex flex-col mx-auto relative">
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
								autocomplete?.setIsOpen(true);
								autocomplete?.refresh();
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

				{autocompleteState?.isOpen && (
					<div className="absolute top-full mt-2 w-full rounded-md bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg z-10 max-h-96 overflow-y-auto overflow-x-hidden">
						{autocompleteState?.collections?.map((collection: any, index: number) => (
							<div key={index} className="mb-4">
								{collection?.items?.length > 0 ? (
									<>
										{collection.items.map((item: any, itemIndex: number) => (
											<>
												<h6 className="text-sm font-bold px-4 py-2 capitalize relative inline-block">
													{item?.sourceId} Results
													<span className="absolute left-full top-1/2 w-xl h-px bg-white dark:bg-gray-900 transform -translate-y-1/4"></span>
												</h6>
												<ul>
													{item.items.map((subItem: any, subItemIndex: number) => (
														<li
															key={subItemIndex}
															className="cursor-pointer px-8 py-3 hover:bg-gray-800 dark:hover:bg-gray-300 hover:rounded-md">
															<div
																className={style.highlighted}
																dangerouslySetInnerHTML={{ __html: subItem?.highlight?.title?.value || subItem.document.title }}>
															</div>
															<div
																className={style.highlighted}
																dangerouslySetInnerHTML={{ __html: subItem?.highlight?.content?.value || subItem.document.content }}>
															</div>
															<div
																className={style.highlighted}
																dangerouslySetInnerHTML={{ __html: subItem?.highlight?.author_name?.value || subItem.document.author_name }}>
															</div>
															<div
																className={style.highlighted}
																dangerouslySetInnerHTML={{ __html: subItem?.highlight?.address?.value || subItem.document.address }}>
															</div>
														</li>
													))}
												</ul>
											</>
										))}
									</>
								) : (
									<div className="p-4 text-gray-500">No results found</div>
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
