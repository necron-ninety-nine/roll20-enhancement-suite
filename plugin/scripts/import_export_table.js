function matchAndProcessTitle(e) {
    if(!e.className || !e.classList.contains("rollabletableeditor")) return;

    $(e).find(".r20es-table-export-tableexport")[0].onclick = (e) => { window.r20es.exportTableToTableExport(e) };
    $(e).find(".r20es-table-export-json")[0].onclick = (e) => { window.r20es.exportTableToJson(e) } ;
}

// dom mutation watcher that will let us attach export/import buttons to character sheets.
var callback = function(mutationsList) {
    for(var e of mutationsList) {
        if(!matchAndProcessTitle(e.target)) {
            for(let t of e.addedNodes)
                matchAndProcessTitle(t);
        }
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);
observer.observe(document.body, { childList: true, subtree: true });


{
    const importFileSelectorId = "r20es-rollabletable-import-fileselector";

    let rootOfDiv = document.getElementById("deckstables");

    let root = document.createElement("div");

    {
        let header = document.createElement("h3");
        header.style.marginBottom = "5px";
        header.style.marginLeft= "5px";
        header.innerHTML = "Import Rollable Table";
        root.appendChild(header);
    }

    let fs = document.createElement("input");
    fs.type = "file";
    fs.id = importFileSelectorId;

    function mkCallback(cb) {
        return  _ => {
            window.r20es.readFile(fs.files[0], (e2) => {
                cb(e2.target.result);
            });
            
            //fs.value = "";
        }
    };

    let jsonButton = document.createElement("button");
    jsonButton.innerHTML = "Import";
    jsonButton.disabled = true;
    jsonButton.className = "btn";
    jsonButton.style.float = "left";
    jsonButton.onclick = mkCallback((e) => {window.r20es.importTablesFromJson(e)});

    let tableExportButton = document.createElement("button");
    tableExportButton.innerHTML = "Import (TableExport)";
    tableExportButton.disabled = true;
    tableExportButton.className = "btn";
    tableExportButton.style.float = "left";
    tableExportButton.onclick = mkCallback((e) => window.r20es.importTablesFromTableExport(e));


    fs.onchange= (e) => {
        tableExportButton.disabled = jsonButton.disabled = !(e.target.files.length > 0)
    };

    root.appendChild(fs);

    root.appendChild(jsonButton);
    root.appendChild(tableExportButton);

    rootOfDiv.appendChild(root);
}
