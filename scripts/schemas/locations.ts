const locationSchema = {
	name: "locations",
	enable_nested_fields: true,
	fields: [
		{ name: "id", type: "string" },
    { name: "address", type: "string" },
    { name: "latitude", type: "float" },
    { name: "longitude", type: "float" },
		{ name: "created_at", type: "int64" },
	],
	default_sorting_field: "created_at",
	symbols_to_index: ["#"]
} as const;

export default locationSchema;
