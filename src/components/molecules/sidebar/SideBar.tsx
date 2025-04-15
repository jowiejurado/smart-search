import { useEffect, useRef, useState } from "react";
import Typesense from "typesense";
import { mdiChat, mdiClipboardText, mdiSearchWeb, mdiStar } from "@mdi/js";
import Icon from "@mdi/react";

type SideBarProps = {
	summary?: string;
	isSummarizing: boolean;
};

const SideBar = ({ summary, isSummarizing }: SideBarProps) => {
	const [authors, setAuthors] = useState<[]>([]);
	const [contents, setContents] = useState<[]>([]);
	const [sentences, setSentences] = useState<string>("");
	const [displayedText, setDisplayedText] = useState<string>("");
	const index = useRef(0);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const typesenseClient = new Typesense.Client({
		apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY ?? "xyz",
		nodes: [
			{
				url: `${process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL}://${process.env.NEXT_PUBLIC_TYPESENSE_HOST}`,
			},
		],
		connectionTimeoutSeconds: 2,
	});

	useEffect(() => {
		setDisplayedText("");
		index.current = 0;

		if (summary) {
			setSentences(summary);
		} else {
			setSentences("");
		}
	}, [summary]);

	useEffect(() => {
		setDisplayedText("");
		index.current = 0;
		if (!sentences) {
			return;
		}

		const typeWriter = () => {
			const nextChar = sentences[index.current];
			setDisplayedText((prev) => prev + nextChar);
			index.current += 1;

			if (index.current < sentences.length) {
				timeoutRef.current = setTimeout(typeWriter, 30);
			}
		};

		typeWriter();

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [sentences]);

	useEffect(() => {
		if (authors) {
			fetchTopAuthors();
		}

		if (contents) {
			fetchTopContents();
		}
	}, []);

	const fetchTopAuthors = () => {
		typesenseClient
			.collections("users")
			.documents()
			.search({
				q: "*",
				query_by: "name",
				sort_by: "contribution_count:desc",
				per_page: 5,
			})
			.then((searchResults: any) => {
				setAuthors(searchResults?.hits.map((hit: any) => hit.document));
			});
	};

	const fetchTopContents = () => {
		typesenseClient
			.collections("forum_posts")
			.documents()
			.search({
				q: "*",
				query_by: "title",
				sort_by: "comment_count:desc",
				per_page: 5,
			})
			.then((searchResults: any) => {
				setContents(searchResults?.hits.map((hit: any) => hit.document));
			});
	};

	return (
		<aside className="overflow-y-auto p-6 max-h-screen">
			<h2 className="text-xl text-center font-semibold text-gray-800 dark:text-gray-100 mb-4">
				Search Summary
			</h2>
			{isSummarizing ? (
				<div className="flex flex-col items-center justify-center text-center font-light text-gray-600 dark:text-gray-400">
					Please hold on while we compile the results...
					<Icon path={mdiSearchWeb} size={2} className="mt-4 animate-bounce" />
				</div>
			) : (
				<p className="text-gray-600 dark:text-gray-300 leading-relaxed font-light">
					{displayedText}
				</p>
			)}
			<div className="mt-4 pt-4 border-t border-gray-200/50">
				<p className="text-lg font-medium mb-4">Top Contents</p>
				{contents && (
					<>
						{contents.map((content: any, index: number) => (
							<div key={index} className="flex flex-col gap-y-2 mb-4">
								<div className="flex justify-between gap-x-3 font-medium">
									<span className="flex gap-x-3">
										<Icon
											path={mdiClipboardText}
											size={1}
											className="text-yellow-500"
										/>
										{content?.title}
									</span>

									<span className="px-1 relative">
										<p className="absolute inset-0 flex items-center justify-center text-[10px] text-white dark:text-gray-900">
											{content?.comment_count}
										</p>
										<Icon
											path={mdiChat}
											size={1.25}
											className="text-yellow-500"
										/>
									</span>
								</div>
								<p className="flex gap-x-3 pl-9 text-sm italic text-gray-900/80 dark:text-gray-300">
									{content?.body}
								</p>
							</div>
						))}
					</>
				)}
			</div>
			<div className="mt-4 pt-4 border-t border-gray-200/50">
				<p className="text-lg font-medium mb-4">Top Authors</p>
				{authors && (
					<>
						{authors.map((author: any, index: number) => (
							<div key={index} className="flex flex-col gap-y-2 mb-4">
								<div className="flex justify-between gap-x-3 font-medium">
									<span className="flex gap-x-3">
										<Icon path={mdiStar} size={1} className="text-yellow-500" />
										{author?.name}
									</span>

									<span className="flex rounded-full bg-yellow-500 px-1 text-xs items-center text-white dark:text-gray-900">
										{author?.contribution_count}
									</span>
								</div>
								<div className="flex gap-x-2 pl-9">
									{author?.roles.length > 0 && (
										<>
											{author?.roles.map((role: string, index: number) => (
												<span
													key={index}
													className="flex items-center px-2 py-1 rounded-full bg-green-500 text-xs text-white dark:text-gray-900"
												>
													{role}
												</span>
											))}
										</>
									)}
								</div>
								<p className="flex gap-x-3 pl-9 text-sm italic text-gray-900/80 dark:text-gray-300">
									{author?.bio}
								</p>
							</div>
						))}
					</>
				)}
			</div>
		</aside>
	);
};

export default SideBar;
