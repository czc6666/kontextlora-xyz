/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'sc-maas.oss-cn-shanghai.aliyuncs.com',
            },
            {
                protocol: 'https',
                hostname: 'image.cdn2.seaart.me',
            }
        ]
    }
};

module.exports = nextConfig; 