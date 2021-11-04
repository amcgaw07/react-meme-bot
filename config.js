require("dotenv").config();

const config = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
};

module.exports = config;

//Bearer Token: 'AAAAAAAAAAAAAAAAAAAAAK2UVQEAAAAAykGu3vqnXwI7baUL%2FxVW09c%2FTn4%3DZlTqjENEkD5EP3hGLRKURQ9YWqBgGddTbeAI5Gvkic2TtSwj81'
