module.exports = {
	globals: {
		"ts-jest": {
			"diagnostics": false
		}
	},
	moduleDirectories: [
		"node_modules",
		"src"
	],
	moduleFileExtensions: [
		"ts",
		"js",
		"node"
	],
	moduleNameMapper: {
		"^~/(.*)$": "<rootDir>/src/$1",
		"^Controller(.*)$": "<rootDir>/src/controller$1",
		"^Model(.*)$": "<rootDir>/src/model$1",
		"^Services(.*)$": "<rootDir>/src/services$1"
	},
	reporters: [
		"default",
		"jest-junit"
	],
	testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
	testTimeout: 90000,
	transform: {
		".ts$": "ts-jest"
	},
	transformIgnorePatterns: [
		"!node_modules/"
	],
	verbose: true
}