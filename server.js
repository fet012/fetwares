import http from "http";
import app from "./app/app.js";


//CREATING THE SERVER
const PORT = process.env.PORT || 4000
const server = http.createServer(app);
server.listen(PORT, console.log(`Server is connected on port ${PORT}`))
