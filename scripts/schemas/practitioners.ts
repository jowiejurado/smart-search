const practitionerSchema = {
	name: "practitioners",
	enable_nested_fields: true,
	fields: [
		{ name: "id", type: "string" },
		{ name: "name", type: "string" },
		{ name: "specialties", type: "string[]", facet: true },
		{ name: "location", type: "string" },
		{ name: "bio", type: "string" },
		{ name: "certifications", type: "string[]", facet: true },
	],
	symbols_to_index: ["#"],
} as const;

export default practitionerSchema;
