/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css)$': '<rootDir>/__mocks__/fileMock.ts',
    },
    setupFilesAfterEnv: [
        "<rootDir>/jest.setup.ts",
        "dotenv/config"
    ],
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)"
    ],
};