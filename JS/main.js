


function createIdItem(Id, img, desc, func, link) {
    var tmplink = "#";
    if (link != undefined) {
        tmplink = link;
    }
    var tmpitem = `
<div class="item" onclick="${func}">
    <a href="${tmplink}"><img src="${img}" alt="token"></a>
    <p>${desc}</p>

</div>`;

   var div = document.getElementById(Id).insertAdjacentHTML("beforeend", tmpitem.trim());    

}

function openWindow(){
    var tmpitem = `
        <div class="window">
            <div class="controlbar">
                <div>O</div>
                <div style="float: right; margin-top: -1.1em;">X</div>
            </div>
            <div id="windowcontent">
            </div>

        </div>`

    var div = document.getElementById("screen").insertAdjacentHTML("beforeend", tmpitem.trim());    
    const _window = document.querySelector(".window");
    const controlbar = document.querySelector(".controlbar");

    function onDrag({movementX,movementY}){
        let getStyle = window.getComputedStyle(_window);
        let left = parseInt(getStyle.left);
        let top = parseInt(getStyle.top);
        _window.style.left = `${left + movementX}px`
        _window.style.top = `${top + movementY}px`

    }
    document.addEventListener("mousedown", ()=> {
        controlbar.addEventListener("mousemove",onDrag);
    });
    document.addEventListener("mouseup", ()=> {
        controlbar.removeEventListener("mousemove",onDrag);
    });

}

window.onload = init;
function init(){
    createIdItem("desktop", "images/icons/folder.png", "all", "openWindow()");
    createIdItem("desktop", "images/icons/folder.png", "Lupus", "");
    createIdItem("desktop", "images/icons/sten.png", "Lupus", "");

}
