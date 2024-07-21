/** @type {import('next').NextConfig} */
import path from 'path'
import tsconfig from './tsconfig.json' with { type: "json" };
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const alias = Object.entries(tsconfig.compilerOptions.paths)
    .reduce(
        (x, [name, [pathname]]) => (
            {
                ...x,
                [name.replace('/*', '')]: path.resolve('./' + pathname.replace('*', '')),
            }
        ), {})

const nextConfig = {
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            ...alias,
        }
        config.resolve.fallback = { fs: false, tls: false, net: false, child_process: false, canvas: false };

        return Object.assign({}, config, {
            module: Object.assign({}, config.module, {
                rules: config.module.rules.concat([
                    {
                        test: /\.html$/,
                        use: 'raw-loader',
                    },
                    {
                        test: /\.svg$/i,
                        use: [
                            {
                                loader: '@svgr/webpack',
                                options: {
                                    prettier: false,
                                    svgo: true,
                                    svgoConfig: {
                                        plugins: [{ removeViewBox: false }, {
                                            name: 'preset-default',
                                            params: {
                                                overrides: { removeViewBox: false },
                                            },
                                        }]
                                    },
                                    titleProp: true,
                                    svgo: false,
                                    memo: true,
                                    typescript: true,
                                },
                            }
                        ],

                    }
                ]),
            }),
        });
    },
    images: {
        minimumCacheTTL: 3600,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
            },
        ],
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    reactStrictMode: false,
    async headers() {
        return [
            {
                source: "/fonts/Stand-Alone.otf",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            {
                source: "/api/(.*)",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "*",
                    },
                ]
            }
        ]
    }
}

export default nextConfig

