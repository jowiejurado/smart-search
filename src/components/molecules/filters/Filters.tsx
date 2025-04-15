import Icon from "@mdi/react";
import { mdiTuneVerticalVariant } from "@mdi/js";
import { useState } from "react";

type FiltersProps = {
	openFilterModal: (isOpen: boolean) => void;
};

const Filters = ({ openFilterModal }: FiltersProps) => {
	return (
		<button
			onClick={() => openFilterModal(true)}
			className="rounded-full p-2 hover:bg-gray-300 transition-all"
		>
			<Icon
				path={mdiTuneVerticalVariant}
				size={1}
				className="dark:text-gray-500"
			/>
		</button>
	);
};

export default Filters;
