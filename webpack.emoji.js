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
        const buildPath = this.options.buildPath;
        const bundleLimit = this.options.bundleLimit;

        compiler.plugin('before-run', function (compilation, cb) {
            console.log('Build emoji less files');
            const imgDir = buildPath + '/img';
            const jsonPath = buildPath + '/emojis.json';
            const categoriesPath = buildPath + '/categories.json';
            if (!fs.existsSync(buildPath)) {
                fs.mkdirSync(buildPath);
            }
            if (!fs.existsSync(imgDir)) {
                fs.mkdirSync(imgDir);
            }

            const emojis = require('emoji-datasource/emoji.json').filter(function (emoji) {
                return emoji.has_img_apple;
            }).filter(function (emoji) {
                return emoji.category != 'Skin Tones';
            }).sort(function (a, b) {
                if (a.category == b.categoy) {
                    return 0;
                }
                return (a.category < b.category) ? -1 : 1;
            });
            console.log('Emoji data contains Apple ' + emojis.length + ' emojis');

            const sheetFile = path.resolve(__dirname, './node_modules/emoji-datasource/img/apple/sheets/32.png');
            let json = [];
            let categories = [];

            let bundle = 0;
            let bundleCounter = 0;
            for (let emoji of emojis) {
                gm(sheetFile)
                    .crop(32, 32, emoji.sheet_x * 34 + 1, emoji.sheet_y * 34 + 1)
                    .noProfile()
                    .write(imgDir + '/' + emoji.unified + '.png', function (err) {
                        if (err) throw err;
                    });
                let codepoint = (emoji.non_qualified) ? emoji.non_qualified : emoji.unified;
                fs.appendFileSync(
                    buildPath + '/ngx-emoji-b' + bundle + '.less',
                    '.ngx-emoji-' + codepoint + ' {background-image: url("img/' + emoji.unified + '.png") !important;}'
                );
                json.push({unified: codepoint, category: emoji.category, bundle: bundle});
                categories.push(emoji.category);
                bundleCounter++;
                if (bundleCounter >= bundleLimit) {
                    bundle++;
                    bundleCounter = 0;
                }
            }
            fs.writeFileSync(jsonPath, JSON.stringify(json));
            fs.writeFileSync(categoriesPath, JSON.stringify(categories.filter(function (value, index, self) {
                return self.indexOf(value) === index;
            })));

            if (bundleCounter == 0) {
                bundle--;
            }
            console.info('Build emoji complete to ' + (bundle + 1) + ' bundles!');
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
        'ngx-emoji.min': path.resolve(__dirname, 'src/main/ngx-emoji.less'),
        'ngx-emoji-b0.min': buildDir + '/ngx-emoji-b0.less',
        'ngx-emoji-b1.min': buildDir + '/ngx-emoji-b1.less',
        'ngx-emoji-b2.min': buildDir + '/ngx-emoji-b2.less',
        'ngx-emoji-b3.min': buildDir + '/ngx-emoji-b3.less',
        'ngx-emoji-b4.min': buildDir + '/ngx-emoji-b4.less',
        'ngx-emoji-b5.min': buildDir + '/ngx-emoji-b5.less',
        'ngx-emoji-b6.min': buildDir + '/ngx-emoji-b6.less',
        'ngx-emoji-b7.min': buildDir + '/ngx-emoji-b7.less'
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
        extensions: ['.less']
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
            buildPath: buildDir,
            bundleLimit: 200
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
