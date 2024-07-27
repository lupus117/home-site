


function createIdItem(Id, img, desc, func) {
    var tmpitem = `
<div class="item" onclick="${func}">
    <a><img src="${img}" alt="token"></a>
    <p>${desc}</p>

</div>`;

   var div = document.getElementById(Id).insertAdjacentHTML("beforeend", tmpitem.trim());    

}


window.onload = init;
function init(){
    createIdItem("desktop", "images/icons/folder.png", "all", "console.log('1')");
    createIdItem("desktop", "images/icons/folder.png", "Lupus", "");
    createIdItem("desktop", "images/icons/sten.png", "Lupus", "");
    createIdItem("windowcontent", "images/icons/folder.png", "all", "console.log('1')");
    createIdItem("windowcontent", "images/icons/folder.png", "Lupus", "");
    createIdItem("windowcontent", "images/icons/sten.png", "Lupus", "");
    createIdItem("windowcontent", "images/icons/folder.png", "all", "console.log('1')");
    createIdItem("windowcontent", "images/icons/folder.png", "Lupus", "");
    createIdItem("windowcontent", "images/icons/sten.png", "Lupus", "");
        createIdItem("windowcontent", "images/icons/folder.png", "all", "console.log('1')");
    createIdItem("windowcontent", "images/icons/folder.png", "Lupus", "");
    createIdItem("windowcontent", "images/icons/sten.png", "Lupus", "");
    createIdItem("windowcontent", "images/icons/folder.png", "all", "console.log('1')");
    createIdItem("windowcontent", "images/icons/folder.png", "Lupus", "");
    createIdItem("windowcontent", "images/icons/sten.png", "Lupus", "");
    createIdItem("windowcontent", "images/icons/folder.png", "all", "console.log('1')");
    createIdItem("windowcontent", "images/icons/folder.png", "Lupus", "");
    createIdItem("windowcontent", "images/icons/sten.png", "Lupus", "");
}
