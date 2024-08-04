
//=== simple markdown parser
// Copied from https://dev.to/casualwriter/a-simple-markdown-parser-in-50-lines-of-js-4gpi
function simpleMarkdown(mdText) {

    // first, handle syntax for code-block
    mdText = mdText.replace(/\r\n/g, '\n')
    mdText = mdText.replace(/\n~~~ *(.*?)\n([\s\S]*?)\n~~~/g, '<pre><code title="$1">$2</code></pre>' )
    mdText = mdText.replace(/\n``` *(.*?)\n([\s\S]*?)\n```/g, '<pre><code title="$1">$2</code></pre>' )
  
    // split by "pre>", skip for code-block and process normal text
    var mdHTML = ''
    var mdCode = mdText.split( 'pre>')
  
    for (var i=0; i<mdCode.length; i++) {
      if ( mdCode[i].substr(-2) == '</' ) {
        mdHTML += '<pre>' + mdCode[i] + 'pre>'
      } else {
        mdHTML += mdCode[i].replace(/(.*)<$/, '$1')
          .replace(/^##### (.*?)\s*#*$/gm, '<h5>$1</h5>')
          .replace(/^#### (.*?)\s*#*$/gm, '<h4 id="$1">$1</h4>')
          .replace(/^### (.*?)\s*#*$/gm, '<h3 id="$1">$1</h3>')
          .replace(/^## (.*?)\s*#*$/gm, '<h2 id="$1">$1</h2>')
          .replace(/^# (.*?)\s*#*$/gm, '<h1 id="$1">$1</h1>')    
          .replace(/^-{3,}|^\_{3,}|^\*{3,}/gm, '<hr/>')    
          .replace(/``(.*?)``/gm, '<code>$1</code>' )
          .replace(/`(.*?)`/gm, '<code>$1</code>' )
          .replace(/^\>> (.*$)/gm, '<blockquote><blockquote>$1</blockquote></blockquote>')
          .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
          .replace(/<\/blockquote\>\n<blockquote\>/g, '\n<br>' )
          .replace(/<\/blockquote\>\n<br\><blockquote\>/g, '\n<br>' )
          .replace(/!\[(.*?)\]\((.*?) "(.*?)"\)/gm, '<img alt="$1" src="$2" $3 />')
          .replace(/!\[(.*?)\]\((.*?)\)/gm, '<img alt="$1" src="$2" />')
          .replace(/\[(.*?)\]\((.*?) "(.*?)"\)/gm, '<a href="$2" title="$3">$1</a>')
          .replace(/<http(.*?)\>/gm, '<a href="http$1">http$1</a>')
          .replace(/\[(.*?)\]\(\)/gm, '<a href="$1">$1</a>')
          .replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2">$1</a>')
          .replace(/^[\*|+|-][ |.](.*)/gm, '<ul><li>$1</li></ul>' ).replace(/<\/ul\>\n<ul\>/g, '\n' )
          .replace(/^\d[ |.](.*)/gm, '<ol><li>$1</li></ol>' ).replace(/<\/ol\>\n<ol\>/g, '\n' )
          .replace(/\*\*\*(.*)\*\*\*/gm, '<b><em>$1</em></b>')
          .replace(/\*\*(.*)\*\*/gm, '<b>$1</b>')
          .replace(/\*([\w \d]*)\*/gm, '<em>$1</em>')
          .replace(/___(.*)___/gm, '<b><em>$1</em></b>')
          .replace(/__(.*)__/gm, '<u>$1</u>')
          .replace(/_([\w \d]*)_/gm, '<em>$1</em>')
          .replace(/~~(.*)~~/gm, '<del>$1</del>')
          .replace(/\^\^(.*)\^\^/gm, '<ins>$1</ins>')
          .replace(/ +\n/g, '\n<br/>')
          .replace(/\n\s*\n/g, '\n<p>\n')
          .replace(/^ {4,10}(.*)/gm, '<pre><code>$1</code></pre>' )
          .replace(/^\t(.*)/gm, '<pre><code>$1</code></pre>' )
          .replace(/<\/code\><\/pre\>\n<pre\><code\>/g, '\n' )
          .replace(/\\([`_\\\*\+\-\.\(\)\[\]\{\}])/gm, '$1' )
      }  
    }
  
    return mdHTML.trim()
  }

function createIdItem(Id, img, name, func, link) {
    var tmplink = "#";
    if (link != undefined) {
        tmplink = link;
    }
    var tmpitem = `
<div class="item" onclick="${func}">
    <a href="#"><img src="${img}" alt="token"></a>
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
    includedesktop = false;
    if (tags.length == 1&& tags.includes("desktop")){
        includedesktop = true
    }

    await fetch("https://sten-unt.com/data/files.json").then(response => {
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
    <button style="float: right;" onclick="closeWindow('#_${id}')">X</button >
    </div>
    <div class="windowcontent" id="windowcontent_${id}">
    </div>
    
    </div>`
    if(type == "link" || type == "image"){
        tmpitem = `
    <div class="window" id="_${id}">
    <div class="controlbar">
    <a href="${link}"> <button >O</button></a>
    <button style="float: right;" onclick="closeWindow('#_${id}')">X</button >
    </div>
    <div class="windowcontent" id="windowcontent_${id}">
    </div>
    
    </div>`
    }


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
            break;
            case "image":
            var image =`
            <div style="object-fit:contain;">

            <img src="${link}" style="width:100%; height=100%" alt="${name}">
            </div>

            `
            document.getElementById(`windowcontent_${id}`).insertAdjacentHTML("beforeend",image.trim())
            break;
        
        case "markdown":

            var mdwrapper = `
            <div id="mdwrapper_${id}" class="mdwrapper"></div>
            `
            await fetch(`https://sten-unt.com/${link}`).then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response;
            }).then(resp => resp.text()).then(markdown =>{
                document.getElementById(`windowcontent_${id}`).insertAdjacentHTML("beforeend",simpleMarkdown(mdwrapper.trim()));

                document.getElementById(`mdwrapper_${id}`).insertAdjacentHTML("beforeend",simpleMarkdown(markdown));
            })


            break;

        default:
            break;
    }
    
}

window.onload = init;
async function init() {

    var desktopfiles = await retrieveFileByTags(["desktop"]);
    createIdItemsFromArray("desktop", desktopfiles)


}
