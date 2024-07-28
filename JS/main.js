
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


function closeWindow(id) {
    document.querySelector(id).remove();
}
function openWindow(id, type, link = "#", tags = []) {
    var tmpitem = `
    <div class="window" id="_${id}">
        <div class="controlbar">
        <button>O</button>
        <button style="float: right;" onclick="closeWindow('#_${id}')">X</button >
        </div>
        <div id="windowcontent">
        </div>

    </div>`

    var div = document.getElementById("screen").insertAdjacentHTML("beforeend", tmpitem.trim());
    const _window = document.querySelector(".window");
    const controlbar = document.querySelector(".controlbar");

    function onDrag({ movementX, movementY }) {
        let getStyle = window.getComputedStyle(_window);
        let left = parseInt(getStyle.left);
        let top = parseInt(getStyle.top);
        _window.style.left = `${left + movementX}px`
        _window.style.top = `${top + movementY}px`

    }
    document.addEventListener("mousedown", () => {
        controlbar.addEventListener("mousemove", onDrag);
    });
    document.addEventListener("mouseup", () => {
        controlbar.removeEventListener("mousemove", onDrag);
    });

}

window.onload = init;
function init() {
    fetch("http://sten-unt.com/data/files.json").then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
        .then(json => {
            console.log(json);

            json.desktop.forEach(item => {
                if (item.tags.includes("desktop")) {
                    createIdItem("desktop", item.icon, item.name, `openWindow(1,${item.type},${item.link},${item.tags})`);
                }


            });
            //console.log(this.users);
        })
        .catch(function () {
            this.dataError = true;
        })

}
