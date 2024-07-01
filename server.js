//  require the express
const express = require('express');
// require path to connect html to server
const path = require('path');

// create an instance of the express
const app = express();
// / assigning a port to use
const port = 3002;

// Enable middleware to serve static files from the "public" directory, this will send data to the html
app.use(express.static(path.join(__dirname, 'public')));

// Log request URLs, the next parameter is not always read, it is mostly used to call the nect middleware if any
app.use((req, res, next) => {
    console.log(req.url);
    next();
});

// adding Listen method
app.listen(port, () => console.log(`Running on port ${port}`));

// array of favorite foods to be used as db
const favFood = [
    { id: 1, food: 'meat', love: 2000 },
    { id: 2, food: 'plantain', love: 90 },
    { id: 3, food: 'yam', love: 80 },
    { id: 4, food: 'popcorn', love: 70 },
    { id: 5, food: 'amala', love: 105 },
    { id: 6, food: 'chocolate', love: 85 },
    { id: 7, food: 'spaghetti', love: 200 },
    { id: 8, food: 'shege', love: 0 },
    { id: 9, food: 'shegeProMax', love: "Mr usman i will do you back" },
];

// Endpoint to send the index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET request to get welcome message
app.get("/api", (req, res) => {
    const randomFood = favFood[Math.floor(Math.random() * favFood.length)];
    res.status(200).json({ info: 'I Love Food', favFood: randomFood });
});

// GET request to fetch favorite foods
app.get("/api/foods", (req, res) => {
    console.log(favFood);
    res.send(favFood);
});

// WORKING
// query params
// app.get("/api/foods", (req, res) => {
//     console.log(req.query);

//     const {query: { filter, value },
// } = req;
// // another way to destructure
// // const{ filter, value } = req.query;

// if(filter && value) {
//     return res.send(favFood.filter((food) => food[filter].includes(value))
// );
// }
// res.send(favFood);
// })

// GET request to fetch food by ID
// route parameters
// app.get("/api/foods/:id", (req, res) => {
//     console.log(req.params.food);
//     const { id } = req.params;
//     const myFood = favFood.find((f) => f.id === id);
//     res.send(myFood);
// });

app.get("/api/foods/:id", (req, res) => {
    console.log(req.params);
    const parsedId = parseInt(req.params.id);
    console.log(parsedId);
    if (isNaN(parsedId)) {
        return res.status(400).send({ msg: 'Bad Request. Invalid ID' });
    }
    const findFood = favFood.find((food) => food.id === parsedId);
    if (!findFood) {
        return res.sendStatus(404);
    }
    return res.send(findFood);
});

// POST request to add a new food
// post request -> posting from postman
app.post("/api/foods", (req, res) => {
    console.log(req.body);
    favFood.push(req.body);
    res.send(200);
});

// // posting with thunder client
app.post("/api/foods", (req, res) => {
    const { body } = req;
    const newFood = { id: favFood[favFood.length - 1].id + 1, ...body };
    favFood.push(newFood);
    return res.status(200).send(newFood);
});

// PUT request to update a food by ID
app.put("/api/foods/:id", (req, res) => {
    const { 
        body, 
        params: { id } 
    } = req;
     // convert to make sure of number
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    // to find food to be updated, first find index
    const findFoodIndex = favFood.findIndex((food) => food.id === parsedId);
    if (findFoodIndex === -1) return res.sendStatus(404);
    favFood[findFoodIndex] = { id: parsedId, ...body };
    return res.sendStatus(200);
});

// PATCH request to partially update a food by ID
app.patch("/api/foods/:id", (req, res) => {
    const { 
        body, 
        params: { id } 
    } = req;
     // convert to make sure of number
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    // to find food to be updated, first find index
    const findFoodIndex = favFood.findIndex((food) => food.id === parsedId);
    if (findFoodIndex === -1) return res.sendStatus(404);
    favFood[findFoodIndex] = { ...favFood[findFoodIndex], ...body };
    return res.sendStatus(200);
});

// DELETE request to remove a food by ID
app.delete("/api/foods/:id", (req, res) => {
    const { 
        params: { id } 
    } = req;
    // convert to make sure of number
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findFoodIndex = favFood.findIndex((food) => food.id === parsedId);
    if (findFoodIndex === -1) return res.sendStatus(404);
    // to remove the food, specify the index and the delete count so as not to remove any other item after the particular index
    favFood.splice(findFoodIndex, 1);
    return res.sendStatus(200);
});
