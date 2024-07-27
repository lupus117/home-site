


function createIdItem(Id, img, desc, link) {
    var tmpitem = `
<div class="item">
    <a href="${link}"><img src="${img}" alt="token"></a>
    <p>${desc}</p>

</div>`;

   var div = document.getElementById(Id).insertAdjacentHTML("beforeend", tmpitem.trim());
    console.log(div);
    

}


window.onload = init;
function init(){
    createIdItem("desktop", "images/icons/icons8-folder-480.png", "Lupus", "#");

}
