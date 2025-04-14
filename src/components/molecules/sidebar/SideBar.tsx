import { mdiSearchWeb } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useRef, useState } from "react";

type SideBarProps = {
	summary?: string;
	isSummarizing: boolean;
};

const SideBar = ({ summary, isSummarizing }: SideBarProps) => {
	const [sentences, setSentences] = useState<string>("");
	const [displayedText, setDisplayedText] = useState<string>("");
	const index = useRef(0);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

	return (
		<aside>
			<h2 className="text-xl text-center font-semibold text-gray-800 dark:text-gray-100 mb-4">
				Search Summary
			</h2>
			{isSummarizing ? (
				<div className="flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-400">
					Please hold on while we compile the results...
					<Icon path={mdiSearchWeb} size={2} className="mt-4 animate-bounce" />
				</div>
			) : (
				<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
					{displayedText}
				</p>
			)}
		</aside>
	);
};

export default SideBar;
