const reviewSchema = {
	name: "reviews",
	enable_nested_fields: true,
	fields: [
		{ name: "id", type: "string" },
    { name: "content", type: "string" },
    { name: "rating", type: "int32", facet: true },
    { name: "author_id", type: "string" },
    { name: "author_name", type: "string" },
    { name: "practitioner_id", type: "string" },
    { name: "popularity", type: "int32" },
    { name: "created_at", type: "int64" },
	],
	default_sorting_field: "popularity",
	symbols_to_index: ["#"]
} as const;

export default reviewSchema;
