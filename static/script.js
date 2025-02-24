fetch("http://localhost:3000/jokes")
.then(res=>res.json())
.then(data=>{
    console.log(data)
    document.querySelector(".wrapper").innerHTML = data.map((joke, id)=>{
        return `
            <div class="joke">
                <div class="content">
                    ${joke.content}
                </div>
                <div class="buttons">
                    <button onclick="like(${id})">${joke.likes} <i class="fa-regular fa-heart"></i></button>
                    <button onclick="dislike(${id})">${joke.dislikes} <i class="fa-solid fa-heart-crack"></i></button>
                </div>
            </div>
        `
    }).join("")
})

document.querySelector(".form button").addEventListener("click", ()=>{
    let text = document.querySelector(".form input").value
    if(text == ""){
        return
    }
    fetch("http://localhost:3000/jokes", {
        method:"post",
        body: JSON.stringify({content:text})
    }).then(res=>res.json()).then(data =>{
        location.reload()
    })
})

function like(id){
    fetch("http://localhost:3000/like?id="+ id, {
        method:"get",
    }).then(res=>res.json()).then(data =>{
        location.reload()
    })
}

function dislike(id){
    fetch("http://localhost:3000/dislike?id="+ id, {
        method:"get",
    }).then(res=>res.json()).then(data =>{
        location.reload()
    })
}