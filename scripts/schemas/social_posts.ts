const socialPostSchema = {
	name: "social_posts",
	enable_nested_fields: true,
	fields: [
		{ name: "id", type: "string" },
		{ name: "user", type: "string" },
		{ name: "text", type: "string" },
		{ name: "tags", type: "string[]", facet: true },
		{ name: "timestamp", type: "string" },
	],
	symbols_to_index: ["#"],
} as const;

export default socialPostSchema;
