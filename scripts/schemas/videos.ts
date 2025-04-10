const videoSchema = {
	name: "videos",
	enable_nested_fields: true,
	fields: [
		{ name: "id", type: "string" },
		{ name: "title", type: "string" },
		{ name: "summary", type: "string" },
		{ name: "tags", type: "string[]", facet: true },
		{ name: "duration", type: "string" },
		{ name: "uploaded_by", type: "string" },
		{ name: "date", type: "string" },
	],
	symbols_to_index: ["#"],
} as const;

export default videoSchema;
