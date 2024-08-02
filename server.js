const  express = require('express');
const app = express();
const path = require("path");
const dbConfig = require('./db')
const roomsRoute = require('./routes/roomsRoute')
const usersRoute = require('./routes/usersRoute')
const bookingsRoute = require('./routes/bookingsRoute');
const { default: mongoose } = require('mongoose');


app.use(express.json())


app.use('/api/rooms' , roomsRoute)
app.use('/api/users', usersRoute)
app.use('/api/bookings',bookingsRoute)

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "client", "build")));
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});
    
app.listen(port,()=>console.log(`Server runing on port ${port}`));