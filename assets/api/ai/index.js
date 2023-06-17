const { spawn } = require("child_process");
const fs = require("fs").promises;

async function generateImage(id, prompt) {
    const outputDir = `output/${id}`;
    await fs.mkdir(`${__dirname}/temp`, { recursive: true });

    await new Promise((resolve) => {
        const options = ["--model", "SD-2.1", "--outdir", outputDir, prompt];
        const cmd = spawn("imagine", options);

        cmd.stderr.on("data", (data) => {
            console.log(`stderr: ${data}`);
        });

        cmd.on("close", (code) => {
            console.log(`child process exited with code ${code}`);
            resolve();
        });
    });

    const jpegs = await fs.readdir(`./${outputDir}/generated`);
    const jpegFiles = jpegs.filter((file) => file.endsWith(".jpg"));

    const file = `./temp/${id}.jpg`;
    await fs.rename(`./${outputDir}/generated/${jpegFiles[0]}`, file);
    await fs.rm(`./${outputDir}`, { recursive: true });

    return { file };
};

module.exports = { generateImage };
