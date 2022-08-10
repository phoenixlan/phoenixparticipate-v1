# Phoenix Participate

The frontend system for customer access to the phoenix web system

## Getting it up

### Private NPM Registry
For ```yarn install``` to work, you will need to supply the .env file with a gitlab api token into the variable ```GITLAB_NPM_AUTH_TOKEN```.  See the .env-sample file

On mac, use the command ```export $(grep -v '^#' .env | xargs -0)``` to export all the variables in the .env file.

### Local Development

Local development requires [Node.js](https://nodejs.org/).

_**notice**: copy the file `.env-sample` and rename it to `.env`. It provides the
environment variables required, such as the base url for API-calls. See ["Building and environment variables"](#building-and-environment-variables) below._

* To start the development server simply execute `yarn start`.

### Build and Deployment
TODO

#### Building and Environment Variables

The building process uses a set of environment variables (f.ex. the API base-url).
Webpack uses the [`dotenv-webpack`](https://www.npmjs.com/package/dotenv-webpack) plugin, and the process works as follows:

1. Variables defined in an optional `.env` file in root is loaded into the global `process.env` object.
   _`.env` files are intended for running and building locally._
2. Environment variables from the executing system/CLI session is loaded into the same global object. 
   _Names from the executing system/CLI session are prioritzed over the `.env` file._
3. References to `process.env.{NAME}` in the source code is substituted with the environment variable values at build time.

## Tech

### General
* [React](https://reactjs.org) / react-dom – only using functional components and [hooks](https://reactjs.org/docs/hooks-intro.html)
* [Typescript](https://www.typescriptlang.org)
* [styled-components](https://styled-components.com)

### Routing
* [react-router-dom](https://reactrouter.com/web)
* history

### Forms
* [React Hook Form](https://react-hook-form.com)
* [yup](https://github.com/jquense/yup)

### QA

#### Linting and Code Formatting

* [Eslint](https://eslint.org), with plugins for the following (see `.eslintrc.json` for details):
    * [TypeScript](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin)
    * [React](https://www.npmjs.com/package/eslint-plugin-react) and [React Hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
    * [JSX a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y)
* [Prettier](https://prettier.io)
* [lint-staged](https://www.npmjs.com/package/lint-staged)

#### Git Hooks

* [Husky](https://www.npmjs.com/package/husky)
    * pre-commit: lint-staged
    * pre-push: linting and testing