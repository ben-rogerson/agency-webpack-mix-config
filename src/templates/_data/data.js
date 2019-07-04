// Faker creates random data
// https://github.com/marak/Faker.js/#api-methods
const faker = require('faker');

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

// Fake some articles
const articleItem = () => ({
    title: capitalize(faker.random.words(5).toLowerCase()),
    summary: faker.lorem.sentence(15),
    image: faker.image.image(),
    postDate: faker.date.recent().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    url: faker.internet.url(),
})

// Data sent to Twig context
module.exports = {
    articles: [...Array(5)].map(articleItem),
}