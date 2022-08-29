const Generate = async() => {
    const doc = document;
    const randomizeTextures = doc.getElementById("randomize-textures").checked;
    const randomizeSounds = doc.getElementById("randomize-sounds").checked;
    const version = doc.getElementById("version").value;
    const resMultipier = parseInt(doc.getElementById("resolution-multiplier").value, 10) || 1;

    Notiflix.Notify.success("Done " + await window.Randomize(randomizeTextures, randomizeSounds, version, resMultipier));
};
