const locationSchema = {
	name: "locations",
	enable_nested_fields: true,
	fields: [
		{ name: "id", type: "string" },
		{ name: "city", type: "string" },
		{ name: "state", type: "string" },
		{ name: "country", type: "string" },
		{ name: "latitude", type: "float" },
		{ name: "longitude", type: "float" },
	],
	symbols_to_index: ["#"],
} as const;

export default locationSchema;
