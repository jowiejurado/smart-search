"use client";

import React, { useState, useRef, useEffect, use } from "react";
import Typesense from "typesense";
import { createAutocomplete } from "@algolia/autocomplete-core";
import Icon from "@mdi/react";
import { mdiLoading, mdiMagnify } from "@mdi/js";
import style from "./Search.module.scss";

type SearchProps = {
	summarizeResult: (result: string) => void;
	isSummarizing: (value: boolean) => void;
	selectedContentTypes: string[];
	tags: string;
	location: string;
	specialty: string;
};

const Search = ({ summarizeResult, isSummarizing, selectedContentTypes, tags, location, specialty }: SearchProps) => {
	const [autocompleteState, setAutocompleteState] = useState<any>({
		collections: [],
	});
	const inputRef = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [isSearching, setIsSearching] = useState<boolean>(false);

	const autocomplete = createAutocomplete({
		placeholder: "Enter keywords to search...",
		openOnFocus: true,
		onStateChange({ state }) {
			setAutocompleteState(state);
		},
		getSources({ query }): any {
			if (!query) return [];

			const typesenseClient = new Typesense.Client({
				apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY ?? "xyz",
				nodes: [
					{
						url: `${process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL}://${process.env.NEXT_PUBLIC_TYPESENSE_HOST}`,
					},
				],
				connectionTimeoutSeconds: 2,
			});

			return [
				{
					sourceId: "multi-search",
					async getItems() {
						setIsSearching(true);

						try {
							const baseCollections = [
								{
									name: "articles",
									query_by: "title,tags,author,summary",
								},
								{
									name: "locations",
									query_by: "city,state,country",
								},
								{
									name: "comments",
									query_by: "text,author,type",
								},
								{
									name: "users",
									query_by: "name,bio,roles,location",
								},
								{
									name: "practitioners",
									query_by: "name,specialties,location,bio,certifications",
								},
								{
									name: "reviews",
									query_by: "text,reviewer",
								},
								{
									name: "forum_posts",
									query_by: "author,category,title,body",
								},
								{
									name: "social_posts",
									query_by: "user,text,tags",
								},
								{
									name: "videos",
									query_by: "summary,uploaded_by,title,tags",
								},
							];

							const searches = baseCollections
								.filter((col) => selectedContentTypes.includes(col.name))
								.map((col) => {
									let filter_by = [];

									if (tags) {
										if (["articles", "social_posts", "videos"].includes(col.name)) {
											filter_by.push(`tags:=[${tags}]`);
										}
									}

									if (location) {
										if (["locations", "users", "practitioners"].includes(col.name)) {
											filter_by.push(`location:=${JSON.stringify(location)}`);
										}
									}

									if (specialty && col.name === "practitioners") {
										filter_by.push(`specialties:=[${specialty}]`);
									}

									return {
										collection: col?.name,
										q: query,
										query_by: col?.query_by,
										highlight_full_fields: col?.query_by,
										filter_by: filter_by?.length ? filter_by?.join(" && ") : undefined,
										per_page: 5,
									};
								});

							const multiSearchResults = await typesenseClient.multiSearch.perform({ searches });

							const groupedResults = multiSearchResults.results
								.flatMap((result: any) =>
									result?.hits?.map((hit: any) => ({
										collection: result?.request_params?.collection_name,
										document: hit?.document,
										highlight: hit?.highlight,
									}))
								)
								.reduce((acc: any, current: any) => {
									if (!acc[current?.collection]) acc[current?.collection] = [];
									acc[current?.collection].push(current);
									return acc;
								}, {});

							fetchSummary(groupedResults);

							return Object.keys(groupedResults).map((collectionName: string) => ({
								sourceId: collectionName,
								items: groupedResults[collectionName],
							}));
						} finally {
							setIsSearching(false);
						}
					},

					getItemInputValue({ item }: any) {
						return null;
					},
				},
			];
		},
	});

	const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
	};

	const fetchSummary = async (groupResults: any) => {
		const openAiSummary = await fetch("/api/summarize-results", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				results: groupResults,
			}),
		}).then((res: any) => res.json());

		summarizeResult(openAiSummary?.summary);
		isSummarizing(false);
	};

	const handleSubmit = () => {
		autocomplete?.setQuery(query);

		if (query.trim() !== "") {
			autocomplete?.setIsOpen(true);
		} else {
			autocomplete?.setIsOpen(false);
		}
		autocomplete?.refresh();
	};

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			isSummarizing(true);
			setDebouncedQuery(query);
		}, 1000);

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
		<div className="min-w-full relative">
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
					handleSubmit();
				}}
				className="max-w-2xl flex flex-col mx-auto relative"
			>
				<div className="relative w-full">
					<span className="absolute bg-gray-900 dark:bg-white rounded-full p-2.75 top-3 left-1">
						<Icon
							path={mdiMagnify}
							size={0.9}
							className="text-white dark:text-gray-900"
						/>
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
						placeholder="Enter keywords to search..."
						className="block mt-2 py-3 pl-14 pr-26 w-full placeholder-gray-900/50 rounded-full border border-gray-900 bg-transparent text-gray-900 outline-0 dark:placeholder-white/50 dark:border-gray-600 dark:text-white"
					/>
					<button
						type="submit"
						className="absolute bg-gray-900 dark:bg-white rounded-full py-2.5 px-4 top-2.75 right-1 capitalize font-semibold text-white dark:text-gray-900"
					>
						{isSearching ? (
							<Icon path={mdiLoading} size={0.8} className="animate-spin" />
						) : (
							<>Search</>
						)}
					</button>
				</div>

				{autocompleteState?.isOpen && (
					<div className="absolute top-full mt-2 w-full rounded-md bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg z-10 max-h-96 overflow-y-auto overflow-x-hidden">
						{autocompleteState?.collections?.map(
							(collection: any, index: number) => (
								<div key={index}>
									{collection?.items?.length > 0 ? (
										<>
											{collection.items.map((item: any, itemIndex: number) => (
												<div key={itemIndex} className="mb-4">
													<h6 className="text-sm font-bold px-4 py-2 capitalize relative inline-block">
														{item?.sourceId?.replace("_", " ")} Results
														<span className="absolute left-full top-1/2 w-xl h-px bg-white dark:bg-gray-900 transform -translate-y-1/4"></span>
													</h6>
													<ul>
														{item.items.map(
															(subItem: any, subItemIndex: number) => (
																<li
																	key={subItemIndex}
																	className="cursor-pointer px-8 py-3 flex flex-col gap-y-3 hover:bg-gray-800 dark:hover:bg-gray-300 hover:rounded-md"
																>
																	{item.sourceId === "articles" ? (
																		<>
																			<div className="flex gap-x-2 font-black">
																				<div
																					className={style.highlighted}
																					dangerouslySetInnerHTML={{
																						__html:
																							subItem?.highlight?.title
																								?.value ||
																							subItem.document.title,
																					}}
																				></div>
																				•
																				<div
																					className={style.highlighted}
																					dangerouslySetInnerHTML={{
																						__html:
																							subItem?.highlight?.author
																								?.value ||
																							subItem.document.author,
																					}}
																				></div>
																			</div>
																			{subItem?.document?.tags?.length > 0 ? (
																				<div className="flex gap-x-2 text-sm text-gray-300">
																					{subItem?.document?.tags?.map(
																						(tag: any, tagIndex: number) => (
																							<div
																								key={tagIndex}
																								className={`${style.highlighted} bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 rounded-full px-2 py-1`}
																								dangerouslySetInnerHTML={{
																									__html: tag,
																								}}
																							></div>
																						)
																					)}
																				</div>
																			) : null}
																			<div className="flex gap-x-2 text-sm text-gray-300 dark:text-gray-900">
																				<div
																					className={style.highlighted}
																					dangerouslySetInnerHTML={{
																						__html:
																							subItem?.highlight?.summary
																								?.value ||
																							subItem.document.summary,
																					}}
																				></div>
																			</div>
																		</>
																	) : null}

																	{item.sourceId === "locations" ? (
																		<div className="flex gap-x-2 font-black">
																			<div
																				className={style.highlighted}
																				dangerouslySetInnerHTML={{
																					__html:
																						subItem?.highlight?.city?.value ||
																						subItem.document.city,
																				}}
																			></div>
																			<div
																				className={style.highlighted}
																				dangerouslySetInnerHTML={{
																					__html:
																						subItem?.highlight?.state?.value ||
																						subItem.document.state,
																				}}
																			></div>
																			<div
																				className={style.highlighted}
																				dangerouslySetInnerHTML={{
																					__html:
																						subItem?.highlight?.country
																							?.value ||
																						subItem.document.country,
																				}}
																			></div>
																		</div>
																	) : null}

																	{item.sourceId === "comments" ? (
																		<div className="flex flex-col gap-y-2">
																			<div
																				className={`${style.highlighted} font-black`}
																				dangerouslySetInnerHTML={{
																					__html:
																						subItem?.highlight?.text?.value ||
																						subItem.document.text,
																				}}
																			></div>
																			<div
																				className={`${style.highlighted} text-xs text-gray-200 dark:text-gray-900`}
																				dangerouslySetInnerHTML={{
																					__html: subItem?.highlight?.author
																						?.value
																						? `Commented by: ${subItem.highlight.author.value}`
																						: `Commented by: ${subItem.document.author}`,
																				}}
																			></div>
																		</div>
																	) : null}

																	{item.sourceId === "users" ? (
																		<div className="flex flex-col gap-y-2">
																			<div
																				className={`${style.highlighted} font-black`}
																				dangerouslySetInnerHTML={{
																					__html:
																						subItem?.highlight?.name?.value ||
																						subItem.document.name,
																				}}
																			></div>
																			<div
																				className={`${style.highlighted} text-xs text-gray-200 dark:text-gray-900`}
																				dangerouslySetInnerHTML={{
																					__html: subItem?.highlight?.bio?.value
																						? subItem.highlight.bio.value
																						: subItem.document.bio,
																				}}
																			></div>
																			<div
																				className={`${style.highlighted} text-xs text-gray-200 dark:text-gray-900`}
																				dangerouslySetInnerHTML={{
																					__html: subItem?.highlight?.location
																						?.value
																						? subItem.highlight.location.value
																						: subItem.document.location,
																				}}
																			></div>
																		</div>
																	) : null}

																	{item.sourceId === "practitioners" ? (
																		<div className="flex flex-col gap-y-2">
																			<div
																				className={`${style.highlighted} font-black`}
																				dangerouslySetInnerHTML={{
																					__html:
																						subItem?.highlight?.name?.value ||
																						subItem.document.name,
																				}}
																			></div>

																			<div className="flex flex-wrap gap-x-2 gap-y-2">
																				{subItem?.document?.specialties
																					?.length > 0 ? (
																					<div className="flex gap-x-2 text-sm text-gray-300">
																						{subItem?.document?.specialties?.map(
																							(
																								specialty: string,
																								specialtyIndex: number
																							) => (
																								<div
																									key={specialtyIndex}
																									className={`${style.highlighted} bg-gray-700 dark:bg-gray-500 text-white dark:text-white rounded-full px-2 py-1`}
																									dangerouslySetInnerHTML={{
																										__html: specialty,
																									}}
																								></div>
																							)
																						)}
																					</div>
																				) : null}

																				{subItem?.document?.certifications
																					?.length > 0 ? (
																					<div className="flex gap-x-2 text-sm text-gray-300">
																						{subItem?.document?.certifications?.map(
																							(
																								certification: string,
																								certificationIndex: number
																							) => (
																								<div
																									key={certificationIndex}
																									className={`${style.highlighted} bg-gray-700 dark:bg-gray-500 text-white dark:text-white rounded-full px-2 py-1`}
																									dangerouslySetInnerHTML={{
																										__html: certification,
																									}}
																								></div>
																							)
																						)}
																					</div>
																				) : null}
																			</div>
																		</div>
																	) : null}

																	{item.sourceId === "reviews" ? (
																		<div className="flex flex-col gap-y-2">
																			<div
																				className={`${style.highlighted} font-black`}
																				dangerouslySetInnerHTML={{
																					__html:
																						subItem?.highlight?.text?.value ||
																						subItem.document.text,
																				}}
																			></div>
																			<div
																				className={`${style.highlighted} text-xs text-gray-200 dark:text-gray-900`}
																				dangerouslySetInnerHTML={{
																					__html: subItem?.highlight?.reviewer
																						?.value
																						? `Reviewed by: ${subItem.highlight.reviewer.value}`
																						: `Reviewed by: ${subItem.document.reviewer}`,
																				}}
																			></div>
																		</div>
																	) : null}

																	{item.sourceId === "forum_posts" ? (
																		<div className="flex flex-col gap-y-2">
																			<div className="flex flex-wrap gap-x-2">
																				<div
																					className={`${style.highlighted} font-black`}
																					dangerouslySetInnerHTML={{
																						__html:
																							subItem?.highlight?.title
																								?.value ||
																							subItem.document.title,
																					}}
																				></div>
																				•
																				<div
																					className={style.highlighted}
																					dangerouslySetInnerHTML={{
																						__html:
																							subItem?.highlight?.category
																								?.value ||
																							subItem.document.category,
																					}}
																				></div>
																			</div>
																			<div
																				className={`${style.highlighted} font-black italic text-sm`}
																				dangerouslySetInnerHTML={{
																					__html:
																						subItem?.highlight?.body?.value ||
																						subItem.document.body,
																				}}
																			></div>
																			<div
																				className={`${style.highlighted} text-xs text-gray-200 dark:text-gray-900`}
																				dangerouslySetInnerHTML={{
																					__html: subItem?.highlight?.author
																						?.value
																						? `Authored by: ${subItem.highlight.author.value}`
																						: `Authored by: ${subItem.document.author}`,
																				}}
																			></div>
																		</div>
																	) : null}

																	{item.sourceId === "social_posts" ? (
																		<div className="flex flex-col gap-y-2">
																			<div
																				className={`${style.highlighted} font-black`}
																				dangerouslySetInnerHTML={{
																					__html:
																						subItem?.highlight?.text?.value ||
																						subItem.document.text,
																				}}
																			></div>

																			{subItem?.document?.tags?.length > 0 ? (
																				<div className="flex gap-x-2 text-sm text-gray-300">
																					{subItem?.document?.tags?.map(
																						(tag: any, tagIndex: number) => (
																							<div
																								key={tagIndex}
																								className={`${style.highlighted} capitalize bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 rounded-full px-2 py-1`}
																								dangerouslySetInnerHTML={{
																									__html: tag,
																								}}
																							></div>
																						)
																					)}
																				</div>
																			) : null}

																			<div
																				className={`${style.highlighted} text-xs text-gray-200 dark:text-gray-900`}
																				dangerouslySetInnerHTML={{
																					__html: subItem?.highlight?.user
																						?.value
																						? `Posted by: ${subItem.highlight.user.value}`
																						: `Posted by: ${subItem.document.user}`,
																				}}
																			></div>
																		</div>
																	) : null}

																	{item.sourceId === "videos" ? (
																		<div className="flex flex-col gap-y-2">
																			<div className="flex flex-wrap gap-x-2">
																				<div
																					className={`${style.highlighted} font-black`}
																					dangerouslySetInnerHTML={{
																						__html:
																							subItem?.highlight?.title
																								?.value ||
																							subItem.document.title,
																					}}
																				></div>
																				•
																				<div
																					className={style.highlighted}
																					dangerouslySetInnerHTML={{
																						__html:
																							subItem?.highlight?.duration
																								?.value ||
																							subItem.document.duration,
																					}}
																				></div>
																			</div>

																			{subItem?.document?.tags?.length > 0 ? (
																				<div className="flex gap-x-2 text-sm text-gray-300">
																					{subItem?.document?.tags?.map(
																						(tag: any, tagIndex: number) => (
																							<div
																								key={tagIndex}
																								className={`${style.highlighted} bg-gray-700 capitalize dark:bg-gray-300 text-white dark:text-gray-900 rounded-full px-2 py-1`}
																								dangerouslySetInnerHTML={{
																									__html: tag,
																								}}
																							></div>
																						)
																					)}
																				</div>
																			) : null}

																			<div
																				className={`${style.highlighted} font-black italic text-sm`}
																				dangerouslySetInnerHTML={{
																					__html:
																						subItem?.highlight?.summary
																							?.value ||
																						subItem.document.summary,
																				}}
																			></div>

																			<div
																				className={`${style.highlighted} text-xs text-gray-200 dark:text-gray-900`}
																				dangerouslySetInnerHTML={{
																					__html: subItem?.highlight
																						?.uploaded_by?.value
																						? `Uploaded by: ${subItem.highlight.uploaded_by.value}`
																						: `Uploaded by: ${subItem.document.uploaded_by}`,
																				}}
																			></div>
																		</div>
																	) : null}
																</li>
															)
														)}
													</ul>
												</div>
											))}
										</>
									) : (
										<div className="p-4 text-gray-500">No results found</div>
									)}
								</div>
							)
						)}
					</div>
				)}
			</form>
		</div>
	);
};

export default Search;
