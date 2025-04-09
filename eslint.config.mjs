import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		rules: {
			"@typescript-eslint/ban-types": [
				"error",
				{
					extendDefaults: true, // Keep banning the dangerous defaults
					types: {
						// Allow object
						object: false,

						// If you want to allow {}, add this too:
						'{}': false,
					},
				},
			],
		}
	}
];

export default eslintConfig;
