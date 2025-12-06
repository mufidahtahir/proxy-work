const http = require("http");
const { URL } = require("url");

const API = "http://jsonplaceholder.typicode.com";

function fetchJSON(path, callback) {
    http.get(`${API}${path}`, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
            try {
                callback(null, JSON.parse(data));
            } catch (err) {
                callback(err);
            }
        });
    }).on("error", (err) => callback(err));
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        return res.end(`
            <h1>Welcome</h1>
            <p>Try:</p>
            <ul>
                <li>/users?id=1</li>
                <li>/posts?id=1</li>
                <li>/todos?id=1</li>
            </ul>
        `);
    }

    const id = url.searchParams.get("id");
    if (!id) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Missing id" }));
    }

    if (url.pathname === "/users") {
        return fetchJSON(`/users/${id}`, (err, data) => {
            if (err) show500(res);
            else sendJSON(res, data);
        });
    }

    if (url.pathname === "/posts") {
        return fetchJSON(`/posts/${id}`, (err, data) => {
            if (err) show500(res);
            else sendJSON(res, data);
        });
    }

    if (url.pathname === "/todos") {
        return fetchJSON(`/todos/${id}`, (err, data) => {
            if (err) show500(res);
            else sendJSON(res, data);
        });
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
});

function sendJSON(res, obj) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(obj));
}

function show500(res) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to fetch data" }));
}

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});