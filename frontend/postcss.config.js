module.exports = {
  plugins: {
    ...(process.env.NODE_ENV !== 'test' && {
      tailwindcss: {},
      autoprefixer: {},
    }),
  },
}
