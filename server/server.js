const express = require('express');
const {connectToDatabase, getUser, addUser} = require('./Database/database');
const cors = require('cors');
const path = require('path');
const { auth } = require('express-oauth2-jwt-bearer');
const loginRouter = require('./Routes/login_endpoint');
const historyRouter = require('./Routes/history_endpoint')
const favoriteRouter = require('./Routes/favorite_endpoint')
const ratingRouter = require('./Routes/rating_endpoint')
const songRouter = require('./Routes/song_endpoint')


const clearCache = require('./utils/cache');

require('dotenv').config();

const start = () => {
    // protegge gli endpoint
    const jwtCheck = auth({
        audience: 'spottube-certificate',
        issuerBaseURL: 'https://dev-tq8wvm3avqr1gqu6.us.auth0.com/',
        tokenSigningAlg: 'RS256'
    });

    const app = express();
    app.use(cors());
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.json());
    app.use('/user/history',jwtCheck,historyRouter)
    app.use('/user/favorite',jwtCheck,favoriteRouter)
    app.use('/user/rating',jwtCheck,ratingRouter)
    app.use('/user/song',jwtCheck, songRouter);
    app.use('/login',jwtCheck,loginRouter);
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });
    

    const port = process.env.PORT || 80;
    const host = process.env.HOST;
    app.listen(port, host, () => {
        console.log(`App listening at http://${host}:${port}`);
    });
}

setInterval(clearCache, 1000*60*60); // svuota la cache ogni ora
connectToDatabase(start); // avvia il server solo se connesso al db