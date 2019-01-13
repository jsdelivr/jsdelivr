$.getJSON(`${live2d_Path}model.json`,function(model){
    $.getJSON(`${live2d_Path}textures.json`,function(textures){
        const modelObj = JSON.parse(JSON.stringify(model, null, 2))
        const texturesObj = JSON.parse(JSON.stringify(textures, null, 2))
        const pioUrl = texturesObj.pioUrl
        const randomIndex = Math.floor(Math.random() * pioUrl.length);
        const pio = pioUrl[randomIndex]
        for (url in pio) {
            modelObj.textures = [`${live2d_Path}${pio[url]}`]
        }
        loadlive2d('live2d', live2d_Path, '', modelObj);
    })
});
