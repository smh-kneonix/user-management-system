const {
    app,
    parserHandler,
    engineHandler,
    runingDatabase,
} = require("./server/services/app");
require("dotenv").config;

async function startServer() {
    await runingDatabase();
    await parserHandler();
    await engineHandler();

    // // run server
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`app run on port: ${port}`);
    });
}

startServer();
