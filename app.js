const http = require('http')
const fs = require('fs')
const PORT = 3000

const server = http.createServer((req, res)=>{

    let url = req.url;
    let method = req.method;

    if(url == '/'){
        res.setHeader('Content-Type', 'text/html')
        fs.readFile('formValues.txt', (err, data) => {

            let fileData = '';

            if (data) {
                fileData = data.toString();
            }

            res.end(`
                <h1>${fileData}</h1>
                <form action="/message" method="POST">
                    <input type="text" name="username" />
                    <button type="submit">Add</button>
                </form>
            `);
        });
    }else if(url == '/message'){
        res.setHeader('Content-Type', 'text/html');
        let dataChunks = []
        req.on('data', (chunk)=>{
            dataChunks.push(chunk)
        })
        req.on('end', ()=>{
            let combinedChunk = Buffer.concat(dataChunks);
            let value = combinedChunk.toString().split("=")[1];

            fs.writeFile("formValues.txt", value, () => {

                res.statusCode = 302;
                res.setHeader('Location', '/');

                res.end();
            });
        })
    }


})

server.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})