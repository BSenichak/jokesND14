let http = require("http");
let path = require("path");
let fs = require("fs");
let url = require("url")

let pathToJokes = path.join(__dirname, "static", "data");

let server = http
    .createServer((req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        if (req.url == "/jokes" && req.method == "GET") {
            let jokesNames = fs.readdirSync(pathToJokes);
            let count = jokesNames.length;
            let jokes = [];
            jokesNames.forEach((joke) => {
                let content = fs.readFileSync(path.join(pathToJokes, joke));
                content = Buffer.from(content).toString();
                content = JSON.parse(content);
                jokes.push(content);
            });
            res.writeHead(200, { "content-type": "text/json" });
            res.end(JSON.stringify(jokes));
        } else if (req.url == "/jokes" && req.method == "POST") {
            let data = "";
            req.on("data", (chunk) => (data += chunk));
            req.on("end", function () {
                data = JSON.parse(data);
                let content = {
                    content: data.content,
                    likes: 0,
                    dislikes: 0,
                }
                let count = fs.readdirSync(pathToJokes).length
                fs.writeFileSync(path.join(pathToJokes, count + ".json"), JSON.stringify(content))
                res.end("OK!")
            });
        } 
        else if(req.url.startsWith("/like") && req.method == "GET"){
            let params = url.parse(req.url, true).query
            let id = params.id

            let pathToFile = path.join(pathToJokes, id + ".json")
            let joke = fs.readFileSync(pathToFile)
            joke = Buffer.from(joke).toString()
            joke = JSON.parse(joke)

            joke.likes++

            joke = JSON.stringify(joke)
            fs.writeFileSync(pathToFile, joke)

            res.end(joke)
        }
        else if(req.url.startsWith("/dislike") && req.method == "GET"){
            let params = url.parse(req.url, true).query
            let id = params.id

            let pathToFile = path.join(pathToJokes, id + ".json")
            let joke = fs.readFileSync(pathToFile)
            joke = Buffer.from(joke).toString()
            joke = JSON.parse(joke)

            joke.dislikes++

            joke = JSON.stringify(joke)
            fs.writeFileSync(pathToFile, joke)
            
            res.end(joke)
        }
        else {
            res.writeHead(400);
            res.end("404 Not Found!");
        }
    })
    .listen(3000, () => console.log("Server is on!"));
