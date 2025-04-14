"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import Search from "@/components/molecules/search-input/Search";
import ButtonToggle from "@/components/atoms/button-toggle/ButtonToggle";
import SideBar from "@/components/molecules/sidebar/SideBar";
import { useState } from "react";

const Home = () => {
	const [summary, setSummary] = useState<string>("");
	const [isSummarize, setIsSummarizing] = useState<boolean>(false);

	const summarizeResult = (result: string) => {
		setSummary(result);
	};

	const isSummarizing = (value: boolean) => {
		setIsSummarizing(value);
	};

	return (
		<>
			<ThemeProvider>
				<main className="min-h-screen bg-white dark:bg-gray-900 dark:text-white relative">
					<div className="absolute top-6 right-6">
						<ButtonToggle />
					</div>
					<div className="grid grid-cols-6">
						<div className="col-span-1 p-6 border-r border-gray-200">
							<SideBar summary={summary} isSummarizing={isSummarize} />
						</div>
						<div className="col-span-5 min-h-screen flex justify-center items-center">
							<Search
								summarizeResult={summarizeResult}
								isSummarizing={isSummarizing}
							/>
						</div>
					</div>
				</main>
			</ThemeProvider>
		</>
	);
};

export default Home;
