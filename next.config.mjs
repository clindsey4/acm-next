/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
            }
        ]
    },
    webpack: (config) => {
        // add rule to allow for importing markdown files.
        config.module.rules.push(
            {
                test: /\.md$/,
                type: 'asset/source',
            }
        )

        return config
    }
};

export default nextConfig;
