const path = require('path');

/**
 * Webpack Plugins
 */
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = {
    /**
     * Developer tool to enhance debugging
     *
     * See: http://webpack.github.io/docs/configuration.html#devtool
     * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
     */
    devtool: 'source-map',

    /*
     * The entry point for the bundle
     *
     * See: http://webpack.github.io/docs/configuration.html#entry
     */
    entry: {
        'main.umd': path.resolve(__dirname, './src/main/ngx-emoji.module.ts'),
        'main.umd.min': path.resolve(__dirname, './src/main/ngx-emoji.module.ts')
    },

    /**
     * Options affecting the output of the compilation.
     *
     * See: http://webpack.github.io/docs/configuration.html#output
     */
    output: {
        /**
         * The output directory as absolute path (required).
         *
         * See: http://webpack.github.io/docs/configuration.html#output-path
         */
        path: path.resolve(__dirname, './build'),

        /**
         * Specifies the name of each output file on disk.
         * IMPORTANT: You must not specify an absolute path here!
         *
         * See: http://webpack.github.io/docs/configuration.html#output-filename
         */
        filename: '[name].js',

        /**
         * The filename of the SourceMaps for the JavaScript files.
         * They are inside the output.path directory.
         *
         * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
         */
        sourceMapFilename: '[file].map',

        /**
         * Which format to export the library.
         *
         * @see: https://github.com/webpack/docs/wiki/configuration#outputlibrarytarget
         */
        libraryTarget: 'umd'
    },

    /**
     * Options affecting the resolving of modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve
     */
    resolve: {
        /*
         * An array of extensions that should be used to resolve modules.
         *
         * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
         */
        extensions: ['.ts', '.js', '.json'],

        // An array of directory names to be resolved to the current directory
        modules: ['src', 'node_modules']
    },

    /*
     * Options affecting the normal modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#module
     */
    module: {
        /**
         * An array of applied pre and post loaders.
         *
         * See: https://webpack.js.org/configuration/module/#rule-enforce
         */
        rules: [
            /**
             * Static analysis linter for TypeScript advanced options configuration
             * Description: An extensible linter for the TypeScript language.
             *
             * See: https://github.com/wbuchwalter/tslint-loader
             */
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    emitErrors: true,
                    failOnHint: true,
                    resourcePath: 'src'
                }
            },

            /**
             * Typescript loader support for .ts
             *
             * Component Template/Style integration using `angular2-template-loader`
             * Angular 2 lazy loading (async routes) via `ng-router-loader`
             *
             * `ng-router-loader` expects vanilla JavaScript code, not TypeScript code. This is why the
             * order of the loader matter.
             *
             * See: https://github.com/s-panferov/awesome-typescript-loader
             * See: https://github.com/TheLarkInn/angular2-template-loader
             * See: https://github.com/shlomiassaf/ng-router-loader
             */
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            useCache: false
                        }
                    }
                ],
                exclude: [/\.(spec|e2e)\.ts$/]
            }
        ]
    },

    /**
     * The externals configuration option provides a way of excluding dependencies from the output bundles.
     *
     * @see: https://webpack.js.org/configuration/externals/
     * @see: https://stackoverflow.com/a/38248500/1617101
     */
    externals: [
        /^@angular\//,
        /^rxjs\//
    ],

    /**
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
        /**
         * Switch loaders to debug mode.
         *
         * See: https://webpack.js.org/plugins/loader-options-plugin/#options
         */
        new LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            options: {}
        }),

        /**
         * Plugin: UglifyJsPlugin
         * Description: Minimize all JavaScript output of chunks.
         * Loaders are switched into minimizing mode.
         *
         * See: https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
         */
        // NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
        new UglifyJsPlugin({
            // beautify: true, //debug
            // mangle: false, //debug
            // dead_code: false, //debug
            // unused: false, //debug
            // deadCode: false, //debug
            // compress: {
            //   screw_ie8: true,
            //   keep_fnames: true,
            //   drop_debugger: false,
            //   dead_code: false,
            //   unused: false
            // }, // debug
            // comments: true, //debug
            test: 'main.umd.min.js',
            beautify: false, //prod
            mangle: {screw_ie8: true, keep_fnames: true}, //prod
            compress: {screw_ie8: true}, //prod
            comments: false, //prod
            sourceMap: true
        })
    ],

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
        global: true,
        crypto: 'empty',
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
};
