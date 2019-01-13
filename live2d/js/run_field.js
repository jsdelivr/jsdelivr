$.getJSON(`${live2d_Path}model.json`,function(model){
    const modelObj = JSON.parse(JSON.stringify(model, null, 2))
    modelObj.textures = [`${live2d_Dress}`]
    loadlive2d('live2d', live2d_Path, '', modelObj);
});