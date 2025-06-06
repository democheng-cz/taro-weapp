import { defineConfig, type UserConfigExport } from "@tarojs/cli"
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin"
import { UnifiedWebpackPluginV5 } from "weapp-tailwindcss"
import path from "path"

import devConfig from "./dev"
import prodConfig from "./prod"

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
// @ts-ignore
export default defineConfig<"webpack5">(async (merge, { command, mode }) => {
	const baseConfig: UserConfigExport<"webpack5"> = {
		projectName: "example-taro-nutui-webpack",
		date: "2024-8-19",
		designWidth: 375,
		deviceRatio: {
			640: 2.34 / 2,
			750: 1,
			375: 2,
			828: 1.81 / 2,
		},
		sourceRoot: "src",
		outputRoot: `dist/${process.env.TARO_ENV}`,
		plugins: ["@tarojs/plugin-html"],
		defineConstants: {},
		copy: {
			patterns: [],
			options: {},
		},
		framework: "react",
		compiler: {
			type: "webpack5",
			prebundle: {
				enable: false,
			},
		},
		alias: {
			"@": path.resolve(__dirname, "..", "src"),
		},
		// sass: {
		//   resource: [
		//     path.resolve(__dirname, '..', 'src/styles/custom-theme.scss')
		//   ]
		// },
		cache: {
			enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
		},
		mini: {
			// imageUrlLoaderOption: {
			//   limit: 10240
			// },
			miniCssExtractPluginOption: {
				ignoreOrder: true,
				// filename: 'css/[name].[fullhash].css',
				// chunkFilename: 'css/[name].[chunkhash].css'
			},
			postcss: {
				pxtransform: {
					enable: true,
					config: {
						selectorBlackList: ["nut-"],
					},
				},
				cssModules: {
					enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
					config: {
						namingPattern: "module", // 转换模式，取值为 global/module
						generateScopedName: "[name]__[local]___[hash:base64:5]",
					},
				},
			},
			webpackChain(chain) {
				chain.resolve.plugin("tsconfig-paths").use(TsconfigPathsPlugin)
				chain.merge({
					plugin: {
						install: {
							plugin: UnifiedWebpackPluginV5,
							args: [
								{
									appType: "taro",
									injectAdditionalCssVarScope: true,
								},
							],
						},
					},
				})
			},
			sourceMapType: "source-map",
			output: {
				devtoolModuleFilenameTemplate: info => {
					// 只让 src 文件夹下的代码生成源码映射
					if (info.resourcePath.includes("/src/")) {
						return `webpack:///${info.resourcePath}`
					}
					return `webpack:///./${info.resourcePath}`
				},
			},
		},
		h5: {
			publicPath: "/",
			staticDirectory: "static",
			output: {
				filename: "js/[name].[hash:8].js",
				chunkFilename: "js/[name].[chunkhash:8].js",
			},
			miniCssExtractPluginOption: {
				ignoreOrder: true,
				filename: "css/[name].[hash].css",
				chunkFilename: "css/[name].[chunkhash].css",
			},
			postcss: {
				autoprefixer: {
					enable: true,
					config: {},
				},
				cssModules: {
					enable: false,
					config: {
						namingPattern: "module",
						generateScopedName: "[name]__[local]___[hash:base64:5]",
					},
				},
			},
			webpackChain(chain) {
				chain.resolve.plugin("tsconfig-paths").use(TsconfigPathsPlugin)
			},
			devServer: {
				port: 3000,
				host: "localhost",
				open: true,
				hot: true,
				historyApiFallback: true,
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
			},
		},
		rn: {
			appName: "taroDemo",
			postcss: {
				cssModules: {
					enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
				},
			},
		},
	}
	if (process.env.NODE_ENV === "development") {
		// 本地开发构建配置（不混淆压缩）
		return merge({}, baseConfig, devConfig)
	}
	// 生产构建配置（默认开启压缩混淆等）
	return merge({}, baseConfig, prodConfig)
})
