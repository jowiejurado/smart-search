const articleSchema = {
	name: "articles",
	enable_nested_fields: true,
	fields: [
		{ name: "id", type: "string" },
    { name: "title", type: "string" },
    { name: "content", type: "string" },
    { name: "tags", type: "string[]", facet: true },
    { name: "author_id", type: "string" },
    { name: "author_name", type: "string" },
    { name: "published_at", type: "int64" },
    { name: "reviews", type: "int32" },
		{ name: "created_at", type: "int64" },
	],
	default_sorting_field: "reviews",
	symbols_to_index: ["#"]
} as const;

export default articleSchema;
