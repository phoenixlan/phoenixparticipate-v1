import path from 'path';
import type { StorybookConfig } from '@storybook/react-webpack5';
import type { RuleSetRule } from 'webpack';

const config: StorybookConfig = {
    stories: ['../stories/**/*.stories.tsx'],
    addons: ['@storybook/addon-webpack5-compiler-swc', '@storybook/addon-essentials', '@storybook/addon-interactions'],
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
    // Serves the app's images so the mocked site config / avatars can point at them
    staticDirs: [{ from: '../src/assets', to: '/mock-assets' }],
    // The app reads these at import time and throws without them. BASE_URL is relative so the logo resolves against
    // the storybook itself, both in dev and in a static build
    env: (config) => ({
        ...config,
        BASE_URL: '.',
        HOST: 'http://localhost:6006',
        EVENT_BRAND: 'storybook-brand',
        STRIPE_PK: process.env.STRIPE_PK ?? 'pk_test_storybook',
    }),
    webpackFinal: async (config) => {
        const rules = (config.module?.rules ?? []) as Array<RuleSetRule>;

        // The app imports SVGs as React components (see webpack.common.js)
        for (const rule of rules) {
            if (rule && rule.test instanceof RegExp && rule.test.test('.svg')) {
                rule.exclude = /\.svg$/;
            }
        }
        rules.push({ test: /\.svg$/, use: ['svg-react-loader'] });

        config.module = { ...config.module, rules };
        config.resolve = {
            ...config.resolve,
            fallback: { ...config.resolve?.fallback, crypto: false },
            alias: {
                ...config.resolve?.alias,
                // All API calls go through a mock that serves story-controlled data. It re-exports the real library
                // for everything that isn't a network call
                '@phoenixlan/phoenix.js$': path.resolve(__dirname, '../stories/mocks/phoenix.ts'),
                // The real library imports node:crypto, which webpack can't bundle for the browser
                'totp-generator$': path.resolve(__dirname, '../stories/mocks/totp-generator.ts'),
            },
        };
        return config;
    },
};

export default config;
