const { MainBridge } = require("electronbb");
const fs = require("fs-extra");
const path = require("path");
const ProgressWindow = require("./ProgressWindow");
const os = require("os");
const sharp = require("sharp");
const archiver = require("archiver");
const { shell } = require("electron");

function shuffle(array) {
    return array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + "/" + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

const Randomize = async (randomizeTextures, randomizeSounds, version) => {
    const progressWindow = await ProgressWindow.Create({
        title: "Creating your beautiful resource pack...",
    });
    progressWindow.setMessage("Preparing...");

    let originalFiles = getFiles(path.join(__dirname, "resource-packs", version, "assets", "minecraft", "textures"));
    originalFiles = originalFiles.filter((file) => path.parse(file).ext === ".png"); // filter out non images
    originalFiles = originalFiles.map((file) => path.relative(path.join(__dirname, "resource-packs", version), file)); // make file paths relative to resource pack root

    const outResourcePackDirectory = path.join(os.tmpdir(), "idk-how-to-call-it");
    const originalFilesDirectory = path.join(__dirname, "resource-packs", version);
    fs.rmSync(outResourcePackDirectory, { recursive: true, force: true });
    fs.mkdirSync(outResourcePackDirectory, { recursive: true });
    fs.copySync(path.join(__dirname, "resource-packs-templates", version), outResourcePackDirectory);

    progressWindow.setMessage("Randomizing...");
    let shuffledFiles = shuffle(originalFiles);

    let i = 0;
    for await (let file of originalFiles) {
        const shuffledFile = shuffledFiles[i];
        const shuffledMetadata = await sharp(path.join(originalFilesDirectory, shuffledFile)).metadata();

        progressWindow.setMessage(`Processing ${path.basename(file)}`);
        progressWindow.setPercentage((i / originalFiles.length) * 90);

        fs.mkdirSync(path.dirname(path.join(outResourcePackDirectory, shuffledFile)), { recursive: true });
        await sharp(path.join(originalFilesDirectory, file))
            .resize(shuffledMetadata.width * 8, shuffledMetadata.height * 8, {
                fit: "fill",
            })
            .toFile(path.join(outResourcePackDirectory, shuffledFile));

        i++;
    }

    progressWindow.setMessage(`Compressing...`);

    fs.rmSync(path.resolve(`./Randomized.zip`), { force: true });
    const output = fs.createWriteStream(path.resolve(`./Randomized.zip`));
    const archive = archiver("zip");

    archive.pipe(output);
    archive.directory(outResourcePackDirectory, "");
    await archive.finalize();

    shell.showItemInFolder(path.resolve(`./Randomized.zip`));

    progressWindow.close();
    return path.resolve(`./Randomized.zip`);
};

module.exports = () => {
    let mainBridge = new MainBridge();
    mainBridge.Export("Randomize", Randomize);
};
