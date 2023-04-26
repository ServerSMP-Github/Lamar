const { getFileList } = require("../../assets/api/file");

module.exports = async(app) => {
    const routeFiles = await getFileList(`${process.cwd()}/website/router`, { type: ".js", recursively: false });
    routeFiles.map((value) => {
        if (!value.includes("index.js") && !value.includes("dashboard.js")) {
            const { name, router } = require(value);

            app.use(`/${name}`, router);
        } 
    });
}