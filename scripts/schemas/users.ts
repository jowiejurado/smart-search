const userSchema = {
	name: "users",
	enable_nested_fields: true,
	fields: [
		{ name: "id", type: "string" },
		{ name: "name", type: "string" },
		{ name: "bio", type: "string" },
		{ name: "roles", type: "string[]", facet: true },
		{ name: "contribution_count", type: "int32" },
		{ name: "location", type: "string" },
	],
	symbols_to_index: ["#"],
} as const;

export default userSchema;
