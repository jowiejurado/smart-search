// components/molecules/search-filters/SearchFilters.tsx

import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useState } from "react";

type FiltersModal = {
	closeFilterModal: (isOpen: boolean) => void;
};

const FiltersModal = ({ closeFilterModal }: FiltersModal) => {
	const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(
		[]
	);
	const [tags, setTags] = useState("");
	const [location, setLocation] = useState("");
	const [specialty, setSpecialty] = useState("");

	const contentTypes = [
		"practitioners",
		"articles",
		"comments",
		"forum_posts",
		"locations",
		"reviews",
		"social_posts",
		"users",
		"videos",
	];

	const toggleContentType = (type: string) => {
		setSelectedContentTypes((prev) =>
			prev.includes(type)
				? prev.filter((item) => item !== type)
				: [...prev, type]
		);
	};

	return (
		<div className="absolute inset-0 z-20 bg-gray-900/50 bg-opacity-50 flex justify-center items-center">
			<div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-lg shadow-lg">
				<div className="flex justify-between mb-5">
					<h3 className="text-lg font-medium">Filters</h3>
					<button
						className="text-gray-500 hover:text-gray-700"
						onClick={() => closeFilterModal(false)}
					>
						<Icon path={mdiClose} size={0.8} />
					</button>
				</div>
				<div className="space-y-4">
					<div>
						<h4 className="font-medium mb-2">Content Type</h4>
						<div className="grid grid-cols-2 gap-2">
							{contentTypes.map((type) => (
								<label key={type} className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={selectedContentTypes.includes(type)}
										onChange={() => toggleContentType(type)}
									/>
									<span className="capitalize">{type.replace("_", " ")}</span>
								</label>
							))}
						</div>
					</div>

					<div>
						<label className="block font-medium mb-1">Tags</label>
						<input
							type="text"
							value={tags}
							onChange={(e) => setTags(e.target.value)}
							className="w-full p-2 border rounded"
							placeholder="Enter tags"
						/>
					</div>

					<div>
						<label className="block font-medium mb-1">Location</label>
						<input
							type="text"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							className="w-full p-2 border rounded"
							placeholder="Enter location"
						/>
					</div>

					<div>
						<label className="block font-medium mb-1">Specialty</label>
						<input
							type="text"
							value={specialty}
							onChange={(e) => setSpecialty(e.target.value)}
							className="w-full p-2 border rounded"
							placeholder="Enter specialty"
						/>
					</div>

					<div className="flex justify-end gap-x-2">
						<button
							onClick={() => closeFilterModal(false)}
							className="uppercase text-red-500 outline-1 outline-red-500 px-4 py-1 rounded-sm hover:bg-red-500 hover:text-white transition-all ease-in"
						>
							Cancel
						</button>
						<button className="uppercase text-blue-500 outline-1 outline-blue-500 px-4 py-1 rounded-sm hover:bg-blue-500 hover:text-white transition-all ease-in">
							Apply
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FiltersModal;
