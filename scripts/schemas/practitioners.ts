const practitionerSchema = {
	name: "practitioners",
	enable_nested_fields: true,
	fields: [
		{ name: "id", type: "string" },
    { name: "full_name", type: "string" },
    { name: "specialty", type: "string", facet: true },
    { name: "location", type: "string", facet: true },
    { name: "profile_picture", type: "string" },
    { name: "reviews", type: "int32" },
		{ name: "created_at", type: "int64" },
	],
	default_sorting_field: "reviews",
	symbols_to_index: ["#"]
} as const;

export default practitionerSchema;
