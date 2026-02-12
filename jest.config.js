module.exports = {
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "@/(.*)": "<rootDir>/src/$1",
    },
    transform: {
        "^.+\\.js$": "babel-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.js$",
    moduleFileExtensions: ["js", "json", "jsx", "node"],
};
