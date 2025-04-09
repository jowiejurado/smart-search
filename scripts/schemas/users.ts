const userSchema = {
	name: "users",
	enable_nested_fields: true,
	fields: [
		{ name: "id", type: "string" },
    { name: "username", type: "string" },
    { name: "bio", type: "string" },
    { name: "tags", type: "string[]", facet: true },
    { name: "location", type: "string", facet: true },
    { name: "specialty", type: "string", facet: true },
    { name: "followers_count", type: "int32" },

	],
	default_sorting_field: "followers_count",
	symbols_to_index: ["#"]
} as const;

export default userSchema;
