const articleSchema = {
	name: "articles",
	enable_nested_fields: true,
	fields: [
		{ name: "id", type: "string" },
		{ name: "title", type: "string" },
		{ name: "tags", type: "string[]", facet: true },
		{ name: "author", type: "string" },
		{ name: "summary", type: "string" },
		{ name: "body", type: "string" },
		{ name: "published_date", type: "string" },
	],
	symbols_to_index: ["#"],
} as const;

export default articleSchema;
