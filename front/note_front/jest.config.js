export default {
  testEnvironment: "jsdom",
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
     "\\.(css|less|scss|sass)$": "jest-transform-stub",
   },
};
