const Generate = async() => {
    const randomizeTextures = document.getElementById("randomize-textures").checked;
    const randomizeSounds = document.getElementById("randomize-sounds").checked;
    const version = document.getElementById("version").value;
    const resMultipier = parseInt(document.getElementById("resolution-multiplier").value, 10) || 1;

    Notiflix.Notify.success("Done " + await window.Randomize(randomizeTextures, randomizeSounds, version, resMultipier));
};
