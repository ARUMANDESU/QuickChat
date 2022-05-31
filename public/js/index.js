function randomUser(){
     fetch('api/getRandomUser',{
        method:'GET',
        headers:{'Content-Type':'application/json'},
    }).then(data=>data.json()).then(data=>{location.href=`/chat/${data.user.username}`})
}

function getGifs(e){
    const gifDiv = document.getElementById("gifs")
    gifDiv.innerHTML=""
    fetch('/getGifs',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({gifname:e.value}),
    }).then(res=>res.json()).then(data=>{
        let payload = data.payload
        for(let k =0;k<payload.data.length;k++){
            gifDiv.innerHTML+=`<div><img src="${payload.data[k].images.original.url}" name="${payload.data[k].id}.gif" width="250" height="250" onclick="sendGif(this)"></div>`
        }
    })
}

function sendGif(e){
    let url =e.src
    let fileData
    const toDataURL = url => fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        }))


    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }
    toDataURL(url).then(dataUrl => {
        console.log('Here is Base64 Url', dataUrl)
        fileData = dataURLtoFile(dataUrl, `${e.name}`);
        console.log("Here is JavaScript File Object",fileData)
        })
    inbox.sendFile(fileData);

}

