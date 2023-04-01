export default () => ({
  database: {
    url: process.env.BASE_URL,
    name: process.env.DATABASE_NAME,
  },
});
