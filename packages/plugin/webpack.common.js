const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
    entry: {
        popup: { import: "./src/entrypoint/popup.ts", filename: "popup/index.js" },
        background: { import: "./src/entrypoint/background.ts", filename: "plugin/[name].js" },
        content: { import: "./src/entrypoint/content.ts", filename: "plugin/[name].js" }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.json"
                    }
                }],
                exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                loader: "react-svg-loader"
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            }
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        plugins: [
            new TsconfigPathsPlugin()
        ]
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new HtmlWebpackPlugin({ 
            template: "packages/popup/index.html",
            filename: "popup/index.html",
            chunks: ["popup"]
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "./icons/**/*", to: "icons/[name][ext]" },
                { from: "./packages/popup/public/**/*", to: "popup/[name][ext]" },
                { from: "./manifest.json" }
            ],
        }),
    ],
    output: {
        filename: "[name].js", 
        path: path.resolve(__dirname, "dist") 
    },
};
