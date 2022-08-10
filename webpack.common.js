/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg)$/,
                use: ['file-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
            favicon: path.resolve(__dirname, 'src', 'assets', 'favicon.png'),
        }),
        new WebpackManifestPlugin({
            seed: {
                display: "standalone"
            }
        }),
        // Loads env. variables from the .env file
        new Dotenv({
            // This takes precedence over the .env file and allows loading of env. variables in CLI sessions
            systemvars: true
        })
    ],
};
