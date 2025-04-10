const postSchema = {
	name: "forum_posts",
	enable_nested_fields: true,
	fields: [
		{ name: "id", type: "string" },
		{ name: "title", type: "string" },
		{ name: "category", type: "string" },
		{ name: "body", type: "string" },
		{ name: "author", type: "string" },
		{ name: "date", type: "string" },
		{ name: "comment_count", type: "int32" },
	],
	symbols_to_index: ["#"],
} as const;

export default postSchema;
