
function createIdItem(Id, img, name, func, link) {
    var tmplink = "#";
    if (link != undefined) {
        tmplink = link;
    }
    var tmpitem = `
<div class="item" onclick="${func}">
    <a href="${tmplink}"><img src="${img}" alt="token"></a>
    <p>${name}</p>

</div>`;

    var div = document.getElementById(Id).insertAdjacentHTML("beforeend", tmpitem.trim());

}
function createIdItemsFromArray(id, arr) {
    arr.forEach(item => {
        // createIdItem("desktop", item.icon, item.name, `openWindow("1","${item.type}","${item.link}","["${item.tags}"])"`, item.link);
        createIdItem(id, item.icon, item.name, `openWindow('${item.id}','${item.type}','${item.link}',['${item.tags.join("','")}'],'${item.name}')`, item.link);
    });

}

async function retrieveFileByTags(tags = []) {

    var _files = [];
    console.log(tags)
    includedesktop = false;
    if (tags.length == 1&& tags.includes("desktop")){
        includedesktop = true
    }

    var length = await fetch("https://sten-unt.com/data/files.json").then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
        .then(json => {
            var i = 0;
            json.files.forEach(item => {
                var included = false;
                item.id = i;
                if(tags.includes("*")){
                    included = true;
                }
                item.tags.forEach(tag => {
                    if (tags.includes(tag)){
                        included = true;
                        console.log(tag)
                    }

                    if(item.tags.includes("desktop") && !includedesktop){
                        included = false;
                    }

                });
                if (included) {
                    _files.push(item);
                }
                i++;
            })
            return i;
        })
        .catch(function () {
            this.dataError = true;
        })
    return _files;
}

function closeWindow(id) {
    var div = document.querySelector(id);
    if (div != undefined){
        document.querySelector(id).remove();
    }
}

async function openWindow(id, type, link = "#", tags = [], name = "") {
    closeWindow(`#_${id}`);
    var tmpitem = `
    <div class="window" id="_${id}">
        <div class="controlbar">
        <button>O</button>
        <button style="float: right;" onclick="closeWindow('#_${id}')">X</button >
        </div>
        <div class="windowcontent" id="windowcontent_${id}">
        </div>

    </div>`


    document.getElementById("screen").insertAdjacentHTML("beforeend", tmpitem.trim());
    const _window = document.querySelector(`#_${id}`);
    const controlbar = document.querySelector(`#_${id} div.controlbar`);

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


    switch (type) {
        case "folder":
            files = await retrieveFileByTags(tags)
            createIdItemsFromArray(`windowcontent_${id}`, files)
            break;

        case "link":
            var iframe = `
            <iframe
                src="${link}"
                name="${name}"
                allowTransparency="true"
                scrolling="yes"
                frameborder="0"
            >
            </iframe>`
            document.getElementById(`windowcontent_${id}`).insertAdjacentHTML("beforeend",iframe.trim())

        default:
            break;
    }
    if (type == "folder") {

    }
}

window.onload = init;
async function init() {

    var desktopfiles = await retrieveFileByTags(["desktop"]);
    createIdItemsFromArray("desktop", desktopfiles)


}
