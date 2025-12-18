/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/register',
        permanent: false,
      },
    ]
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "images.unsplash.com"
    ],
  },
}

module.exports = nextConfig