import path from "path";
import webpack from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import WebpackDevServer from "webpack-dev-server";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

import {} from "./src/environments/environment";

// const config: webpack.Configuration = {
module.exports = (env: { [name: string]: string | boolean }) => {
  const ProMode = env.mode === "production";
  const publicPath = ProMode ? "/" : "/";

  return {
    entry: ["babel-polyfill", "./src/index.tsx"],
    mode: "production",
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
          },
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          use: "file-loader",
          // use : [
          //   {loader : "file-loader"},
          //   {loader : "url-loader"},
          // ]
          // use: ['file-loader', 'url-loader'],
          // options: {
          //   publicPath: './build/assets/',
          // },
          // type: 'asset/resource',
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
          type: "asset/inline",
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "bundle.js",
      publicPath: publicPath,
    },
    devServer: {
      contentBase: path.join(__dirname, "build"),
      compress: true,
      port: 5500,
      open: true,
      hot: true,
      host: process.env.HOST,
      historyApiFallback: true,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        template: "./public/index.html",
        favicon: "./public/favicon.ico",
      }),
      new ForkTsCheckerWebpackPlugin({
        async: false,
        eslint: {
          files: path.resolve(__dirname, "./src/**/*.{ts,tsx,js,jsx}"),
        },
      }),
    ],
  };
};

// export default config;
