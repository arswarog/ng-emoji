const path = require('path');
const fs = require('fs');
const gm = require('gm').subClass({imageMagick: true});

/**
 * Webpack Plugins
 */
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * Extract the style sheets into a dedicated file
 *
 * See: https://github.com/webpack-contrib/less-loader#in-production
 */
const extractLess = new ExtractTextPlugin({
    filename: "[name].css",
    allChunks: true
});

/**
 * Temporary building directory
 */
const buildDir = path.resolve(__dirname, './build-emoji');

/**
 * Build emoji CSS from node_modules/emoji-datasource
 *
 * see: https://github.com/iamcal/emoji-data
 */
const EmojiPlugin = class HelloWorldPlugin {

    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        const lessPath = this.options.path;
        compiler.plugin('before-run', function (compilation, cb) {
            console.log('Build emoji less to file ' + lessPath);
            const imgDir = path.dirname(lessPath) + '/img';
            if (!fs.existsSync(path.dirname(lessPath))) {
                fs.mkdirSync(path.dirname(lessPath));
            }
            if (!fs.existsSync(imgDir)) {
                fs.mkdirSync(imgDir);
            }

            const emojis = require('emoji-datasource/emoji.json').filter(function (emoji) {
                return emoji.has_img_apple;
            });
            console.log('Emoji data contains Apple ' + emojis.length + ' emojis');
            const sheetFile = path.resolve(__dirname, './node_modules/emoji-datasource/img/apple/sheets/32.png');

            let i = 0;
            for (let emoji of emojis) {
                if (++i > 20) break;
                gm(sheetFile)
                    .crop(32, 32, emoji.sheet_x * 32, emoji.sheet_y * 32)
                    .noProfile()
                    .write(imgDir + '/' + emoji.unified + '.png', function (err) {
                        if (err) throw err;
                    });
                fs.appendFileSync(lessPath, '.ngx-emoji-' + emoji.unified + ' {background-image: url("img/' + emoji.unified + '.png");}');
            }

            console.info('Build emoji complete!');
            cb();
        });
    }
};

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
        'emoji': buildDir + '/emoji.less'
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
        extensions: ['.less'],

        // An array of directory names to be resolved to the current directory
        modules: [buildDir]
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
        path: buildDir,

        /**
         * Specifies the name of each output file on disk.
         * IMPORTANT: You must not specify an absolute path here!
         *
         * See: http://webpack.github.io/docs/configuration.html#output-filename
         */
        filename: '[name].css',

        /**
         * The filename of the SourceMaps for the JavaScript files.
         * They are inside the output.path directory.
         *
         * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
         */
        sourceMapFilename: '[file].map'
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
             * Less loader
             *
             * See: https://github.com/webpack-contrib/less-loader#examples
             */
            {
                test: /\.less$/,
                include: buildDir,
                use: extractLess.extract({
                    use: [{
                        loader: "css-loader", // translates CSS into CommonJS
                        options: {
                            minimize: true || {
                                /**
                                 * CSSNano Options
                                 * see: http://cssnano.co/guides/optimisations/
                                 */
                            }
                        }
                    }, {
                        loader: "less-loader", // compiles Less to CSS
                        options: {}
                    }]
                })
            },

            /**
             * Loads files as `base64` encoded URL
             *
             * see: https://github.com/webpack-contrib/url-loader
             */
            {
                test: /\.png$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100000
                        }
                    }
                ]
            }
        ]
    },

    /**
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
        /**
         * Extract Less plugin
         *
         * See: https://github.com/webpack-contrib/less-loader#in-production
         */
        extractLess,

        /**
         * Build emoji CSS
         */
        new EmojiPlugin({
            path: buildDir + '/emoji.less'
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
