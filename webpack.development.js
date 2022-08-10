/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
const path = require('path');
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const styledComponentsTransformer = createStyledComponentsTransformer();

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].bundle.js',
        publicPath: "",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                loader: 'source-map-loader',
            },
            {
                test: /\.ts(x?)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    getCustomTransformers: () => ({before: [styledComponentsTransformer]}),
                },
            },
        ]
    },
    devServer: {
        host: '0.0.0.0',
        port: 3000,
        open: true,
        historyApiFallback: true,
        disableHostCheck: true,

    },
    ignoreWarnings: [/Failed to parse source map/],
});
