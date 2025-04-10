const reviewSchema = {
	name: "reviews",
	enable_nested_fields: true,
	fields: [
		{ name: "id", type: "string" },
		{ name: "rating", type: "int32" },
		{ name: "text", type: "string" },
		{ name: "reviewer", type: "string" },
		{ name: "target_type", type: "string" },
		{ name: "target_id", type: "string" },
		{ name: "date", type: "string" },
	],
	symbols_to_index: ["#"],
} as const;

export default reviewSchema;
