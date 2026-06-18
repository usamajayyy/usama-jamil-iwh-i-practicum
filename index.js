const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const HUBSPOT_PRIVATE_APP_TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;

const headers = {
    Authorization: `Bearer ${HUBSPOT_PRIVATE_APP_TOKEN}`,
    'Content-Type': 'application/json'
};

// ROUTE 1 - Homepage
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=name,director,genre`;

    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;

        res.render('homepage', {
            title: 'Homepage | Integrating With HubSpot I Practicum',
            data
        });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.send('Error fetching movies');
    }
});

// ROUTE 2 - Show form
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// ROUTE 3 - Create movie
app.post('/update-cobj', async (req, res) => {

    const { name, director, genre } = req.body;

    const newMovie = {
        properties: {
            name,
            director,
            genre
        }
    };

    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

    try {
        await axios.post(url, newMovie, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.send('Error creating movie');
    }
});

app.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});