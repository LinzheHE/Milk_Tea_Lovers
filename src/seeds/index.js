if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const path = require('path');
const mongoose = require('mongoose');

const Shop = require('../models/shop');
const cities = require('./cities');
const { brands, description } = require('./seedHelpers');

// connect to the database (mongoDB, using mongoose)
// const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp';
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Shop.deleteMany({});
    for (let i = 0; i < 3000; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 5) + 5;
        const sh = new Shop({
            author: '659def6fbe17f2089640eca3',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(brands)}`,
            description: `${sample(description)}`,
            price: randomPrice,
            geometry: { type: 'Point', 
            coordinates: [
                cities[random1000].longitude, 
                cities[random1000].latitude,
            ]
        },
            images: [
                {
                    url: 'https://res.cloudinary.com/dvbbvaond/image/upload/v1703739647/MilkTeaLover/fog6hueivcfoxuzlu5yd.jpg',
                    filename: 'MilkTeaLover/fog6hueivcfoxuzlu5yd'
                },
                {
                    url: 'https://res.cloudinary.com/dvbbvaond/image/upload/v1703739648/MilkTeaLover/kyci7xuljroufqmwrgce.jpg',
                    filename: 'MilkTeaLover/kyci7xuljroufqmwrgce'
                },
                {
                    url: 'https://res.cloudinary.com/dvbbvaond/image/upload/v1703739650/MilkTeaLover/hfzjok69ddyywkqlbprv.jpg',
                    filename: 'MilkTeaLover/hfzjok69ddyywkqlbprv'
                },
                {
                    url: 'https://res.cloudinary.com/dvbbvaond/image/upload/v1703739648/MilkTeaLover/x1ktonmqqh6hblg8pbvg.jpg',
                    filename: 'MilkTeaLover/x1ktonmqqh6hblg8pbvg'
                },
                {
                    url: 'https://res.cloudinary.com/dvbbvaond/image/upload/v1703739649/MilkTeaLover/yttifk6zhonttufcnzxe.jpg',
                    filename: 'MilkTeaLover/yttifk6zhonttufcnzxe'
                }
            ]
        })
        await sh.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})