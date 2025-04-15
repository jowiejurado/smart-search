"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import Search from "@/components/molecules/search-input/Search";
import ButtonToggle from "@/components/atoms/button-toggle/ButtonToggle";
import SideBar from "@/components/molecules/sidebar/SideBar";
import { useState } from "react";
import Filters from "@/components/molecules/filters/Filters";
import Icon from "@mdi/react";
import FiltersModal from "@/components/molecules/filters/FiltersModal";

const Home = () => {
	const [summary, setSummary] = useState<string>("");
	const [isSummarize, setIsSummarizing] = useState<boolean>(false);
	const [isOpenFilterModal, setOpenFilterModal] = useState<boolean>(false);

	const summarizeResult = (result: string) => {
		setSummary(result);
	};

	const isSummarizing = (value: boolean) => {
		setIsSummarizing(value);
	};

	const openFilterModal = (isOpen: boolean) => {
		setOpenFilterModal(isOpen);
	};

	const closeFilterModal = (isClose: boolean) => {
		setOpenFilterModal(isClose);
	};

	return (
		<>
			<ThemeProvider>
				<main className="min-h-screen bg-white dark:bg-gray-900 dark:text-white relative">
					<div className="absolute top-6 right-6 z-10">
						<Filters openFilterModal={openFilterModal} />
						<ButtonToggle />
					</div>
					<div className="grid grid-cols-7">
						<div className="col-span-2 border-r border-gray-200">
							<SideBar summary={summary} isSummarizing={isSummarize} />
						</div>
						<div className="col-span-5 min-h-screen relative flex justify-center items-center">
							<Search
								summarizeResult={summarizeResult}
								isSummarizing={isSummarizing}
							/>
						</div>
					</div>
					{isOpenFilterModal && (
						<FiltersModal closeFilterModal={closeFilterModal} />
					)}
				</main>
			</ThemeProvider>
		</>
	);
};

export default Home;
