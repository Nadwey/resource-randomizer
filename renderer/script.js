const Generate = async() => {
    const randomizeTextures = document.getElementById("randomize-textures").checked;
    const randomizeSounds = document.getElementById("randomize-sounds").checked;
    const version = document.getElementById("version").value;

    Notiflix.Notify.success("Done " + await window.Randomize(randomizeTextures, randomizeSounds, version));
};
