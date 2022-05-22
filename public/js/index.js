function randomUser(){
     fetch('api/getRandomUser',{
        method:'GET',
        headers:{'Content-Type':'application/json'},
    }).then(data=>data.json()).then(data=>{location.href=`/chat/${data.user.username}`})
}

