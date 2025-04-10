const commentSchema = {
	name: "comments",
	enable_nested_fields: true,
	fields: [
		{ name: "id", type: "string" },
		{ name: "content_id", type: "string" },
		{ name: "type", type: "string" },
		{ name: "text", type: "string" },
		{ name: "author", type: "string" },
		{ name: "date", type: "string" },
	],
	symbols_to_index: ["#"],
} as const;

export default commentSchema;
