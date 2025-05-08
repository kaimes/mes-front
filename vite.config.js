import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import Components from "unplugin-vue-components/vite";
import * as path from "path";
import fs from 'fs';
import dayjs from 'dayjs'
import VueSetpUpExtend from "vite-plugin-vue-setup-extend";
import viteCompression from "vite-plugin-compression";
import OptimizationPersist from "vite-plugin-optimize-persist";
import PkgConfig from "vite-plugin-package-config";

// 读取 package.json 的版本号
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));
const appVersion = packageJson.version;
const buildTime = dayjs().format('YYYYMMDDHHmmss');
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [
            vue(),
            vuetify(),
            VueSetpUpExtend(),
            // 自定义插件，用于在构建结束后生成 version.json
            {
                name: 'generate-version-json',
                enforce: 'post', // 确保在打包后执行
                writeBundle(options) { // 使用 writeBundle 钩子，它在所有文件写入磁盘后执行
                    const outputDir = options.dir || path.resolve(__dirname, 'dist'); // 获取输出目录
                    if (!fs.existsSync(outputDir)) {
                        fs.mkdirSync(outputDir, { recursive: true });
                    }
                    const versionFilePath = path.join(outputDir, 'version.json');
                    const versionData = {
                        version: appVersion,
                        buildTime: buildTime,
                    };
                    fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2));
                    console.log(`\nGenerated ${versionFilePath}`);
                },
            },
            // gizp 压缩 ,提升性能
            viteCompression(),
            // monacoEditorPlugin({ languageWorkers: ["json"] }),
            Components({
                directoryAsNamespace: true,
            }),
            // vite 性能优化
            PkgConfig(),
            OptimizationPersist(),
            // requireTransform({
            //     fileRegex: /.js$|.vue$/
            // }),
            {
                resolveId(id) {
                    if (id.includes("vee-validate")) {
                        return "virtual:vee-validate";
                    }
                },
                load(id) {
                    if (id.includes("vee-validate")) {
                        return `
          let ValidationObserver, ValidationProvider, extend, localize, setInteractionMode, configure, mapFields, ErrorMessage, required, email;
          extend = localize = setInteractionMode = configure = mapFields = required = email = () => {}
          ValidationObserver = ValidationProvider = (_, { slots }) => slots.default({ errors: [], messages: [] })
          export { ValidationObserver, ValidationProvider, extend, localize, setInteractionMode, configure, mapFields, ErrorMessage, required, email };`;
                    }
                }
            }
        ],
        server: {
            fs: {
              cachedChecks: false
            },
            host: "127.0.0.1",
            cors: true,
            open: true,
            port: env.VUE_APP_PORT || 8080,
            proxy: {
                "/d/api": {
                    target: "http://127.0.0.1:8000",
                    changeOrigin: true,
                    ws: true,
                    rewrite: path => path.replace("/d/api", "/api")
                },
                "/api": {
                    target: "http://127.0.0.1:8000",
                    changeOrigin: true,
                    ws: true,
                    rewrite: path => path.replace("/api", "/api")
                }
            }
        },
        // output: {
        //     // 最小化拆分包
        //     manualChunks(id) {
        //         if (id.includes("node_modules")) {
        //             return id.toString().split("node_modules/")[1].split("/")[0].toString();
        //         }
        //     }
        // },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src")
            }
        },
        define: {
            __APP_ENV__: JSON.stringify(env.APP_ENV),
            // 确保注入的是字符串
            'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion),
            'import.meta.env.VITE_APP_BUILD_TIME': JSON.stringify(buildTime)
        },
        // vite.config.ts
        build: {
            target: "modules",
            outDir: "dist", //指定输出路径
            assetsDir: "assets", // 指定生成静态资源的存放路径
            minify: "terser", //是否禁用最小化混淆，esbuild打包速度最快，terser打包体积最小。
            terserOptions: {
                compress: {
                    drop_console: false, // 删除所有 console 消息
                    drop_debugger: true // 删除所有 debugger
                },
                format: {
                    comments: true // 删除所有注释
                }
            },
            chunkSizeWarningLimit: 2000, // chunk 超过 2000kb 之后进行提示
            cssCodeSplit: true, //css 拆分
            sourcemap: false, //不生成sourcemap
            assetsInlineLimit: 5000, //小于该值 图片将打包成Base64
            // rollup 配置
            rollupOptions: {
                output: {
                    manualChunks(id, { getModuleInfo }) {
                        const match = /.*.strings.(\w+).js/.exec(id);
                        if (match) {
                            const language = match[1]; // e.g. "en"
                            const dependentEntryPoints = [];
                            const idsToHandle = new Set(getModuleInfo(id).dynamicImporters);

                            for (const moduleId of idsToHandle) {
                                const { isEntry, dynamicImporters, importers } =
                                    getModuleInfo(moduleId);
                                if (isEntry || dynamicImporters.length > 0)
                                    dependentEntryPoints.push(moduleId);
                                for (const importerId of importers) idsToHandle.add(importerId);
                            }
                            if (dependentEntryPoints.length === 1) {
                                return `${dependentEntryPoints[0].split("/").slice(-1)[0].split(".")[0]
                                    }.strings.${language}`;
                            }
                            if (dependentEntryPoints.length > 1) {
                                return `shared.strings.${language}`;
                            }
                        }
                    }
                }
            }
        },
        // 就是说 所有的环境变量必须以 这个字符串 开头 , 否则不识别
        envPrefix: "VUE_APP_"
    };
});

// ()
