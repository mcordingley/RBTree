const webpack = require('webpack');

module.exports = {
    entry: "./src/VuexRBTree.js",
    module: {
        rules: [
            {
                exclude: /(node_modules|bower_components)/,
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ]
            }
        ]
    },
    output: {
        filename: "VuexRBTree.js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};