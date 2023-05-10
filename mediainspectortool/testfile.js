class ClsMediaInspectorTool {
  #appVersion = "0.0.2";

  #mediaSrcs = [];
  #mediaRowData = [];

  constructor() {
    this.init();
  }

  init() {
    console.log("CldMediaInspectorTool Version", this.#appVersion);
  }

  addMediaSrc(mediasrc) {
    this.#mediaSrcs.push(mediasrc);

    this.addMediaRowData(mediasrc);
  }

  getThumbnail(mediadata) {
    //var placeholder = '<img src="data:image/webp;base64," width="100" height="100">';
    var placeholder = `<img src="https://defaultplaceholder.png" width=100 height=100 />`;
    var targetAsset = `<img src=${mediadata.MediaPerf.name} style="width:100px">`;

    var imgDisp =
      parseInt(mediadata.MediaRespHdr["content-length"]) > 0
        ? targetAsset
        : placeholder;

    var retVal = "<div>";

    var ctype = mediadata.MediaRespHdr["content-type"].split("/")[1];

    var contentType = mediadata.MediaRespHdr["content-type"] || "";

    if (typeof contentType !== "undefined") {
      if (contentType.match(/^image\//i)) {
        retVal += imgDisp;
      } else if (contentType.match(/^video\//i)) {
        retVal += `
  <video width="300" controls>
    <source src="${mediadata.MediaPerf.name}" type="${mediadata.MediaRespHdr["content-type"]}">
    Your browser does not support the video tag.
  </video>`;
      } else if (contentType.match(/javascript/i)) {
        retVal += `
  <span style="display: table;margin: 0 auto;color:lightgray;font-weight:bold;width: 60px;height: 50px;text-align: center;font-family: sans-serif;border-radius: 5px 5px 5px; border: 1px solid lightgray;float:left;">{ . . . }   JS</span>`;
      } else {
        retVal += `
  <span style="display: table;margin: 0 auto;color:lightgray;font-weight:bold;width: 60px;height: 50px;text-align: center;font-family: sans-serif;border-radius: 5px 5px 5px; border: 1px solid lightgray;float:left;">{ - }   ${ctype.toUpperCase()}</span>`;
      }
    }

    retVal += "</div>";

    return retVal;
  }

  getUrl(mediadata) {
    var retVal = `<div style="width: 300px;padding-left: 5px;">`;

    var contentType = mediadata.MediaRespHdr["content-type"] || "";

    if (typeof contentType !== "undefined") {
      retVal += `<a style="word-wrap: break-word;" href=${mediadata.MediaPerf.name} target="_blank" >${mediadata.MediaPerf.name}</a>`;
    }

    retVal += "</div>";

    return retVal;
  }

  getEntitiesCount(mediadata) {
    var retVal = `<div style="width: 15px;padding-left: 5px;">`;

    retVal += `1`;

    retVal += "</div>";

    return retVal;
  }

  getService(mediadata) {
    var retVal = `<div style="width: 140px;padding-left: 5px;">`;

    retVal += `<span style="word-wrap: break-word;">`;

    retVal +=
      mediadata.MediaRespHdr["server"] != null
        ? mediadata.MediaRespHdr["server"]
        : mediadata.MediaRespHdr["hostname"];

    retVal += `</span>`;

    retVal += "</div>";

    return retVal;
  }

  getResponseStatus(mediadata) {
    var retVal = `<div style="width: 30px;padding-left: 5px;">`;

    retVal +=
      parseInt(mediadata.MediaPerf.responseStatus) < 1 &&
      parseInt(mediadata.MediaRespHdr["content-length"]) < 1
        ? "404"
        : (parseInt(mediadata.MediaPerf.responseStatus) || 200).toString();

    retVal += "</div>";

    return retVal;
  }

  getErrorMessage(mediadata) {
    var retVal = `<div style="width: 150px;padding-left: 5px;">`;

    retVal += `<span style="word-wrap: break-word;">`;
    retVal += mediadata.MediaRespHdr["error-message"];
    retVal += `</span>`;
    retVal += "</div>";

    return retVal;
  }

  getContentLength(mediadata) {
    var retVal = `<div style="padding-left: 5px;">`;
    var aVal =
      parseInt(mediadata.MediaRespHdr["content-length"]) < 1
        ? "0 B"
        : parseInt(mediadata.MediaRespHdr["content-length"]);

    retVal += isNaN(aVal) ? "0 B" : aVal + " B";
    retVal += "</div>";

    return retVal;
  }

  getScaleRatio(mediadata) {
    var retVal = `<div style="width:90px;padding-left: 5px;">`;

    var scaleRatioVal = "No image to display";
    if (mediadata.MediaRespHdr["content-type"]?.match(/image|video/)) {
      if (
        mediadata.MediaDoc === undefined ||
        mediadata.MediaDoc.naturalWidth === 0 ||
        mediadata.MediaDoc.naturalHeight === 0
      ) {
        //scaleRatioVal = "Image has not been rendered or has no dimensions yet";
      } else {
        if (mediadata.MediaRespHdr["content-type"]?.match(/image/)) {
          var ratioWidth = (
            mediadata.MediaDoc.naturalWidth / mediadata.MediaDoc.clientWidth
          ).toFixed(2);
          var ratioHeight = (
            mediadata.MediaDoc.naturalHeight / mediadata.MediaDoc.clientHeight
          ).toFixed(2);
          scaleRatioVal = ratioWidth + ":" + ratioHeight;
        } else if (mediadata.MediaRespHdr["content-type"]?.match(/video/)) {
          var ratioWidth = (
            mediadata.MediaDoc.videoWidth / mediadata.MediaDoc.clientWidth
          ).toFixed(2);
          var ratioHeight = (
            mediadata.MediaDoc.videoHeight / mediadata.MediaDoc.clientHeight
          ).toFixed(2);
          scaleRatioVal = ratioWidth + ":" + ratioHeight;
        }
      }
    }
    retVal += scaleRatioVal;

    retVal += "</div>";

    return retVal;
  }

  getContentType(mediadata) {
    var retVal = `<div style="width:70px;padding-left: 5px;">`;

    let contentTypeVal = "";

    if (mediadata.MediaRespHdr["content-type"] !== "") {
      var contentTypeArr = mediadata.MediaRespHdr["content-type"].split("/"),
        contentTypeCat = contentTypeArr[0];
      contentTypeCat =
        contentTypeCat.charAt(0).toUpperCase() + contentTypeCat.substring(1);
      var contentTypeFormat = contentTypeArr[1].split(";")[0];
      contentTypeFormat = contentTypeFormat.toUpperCase();
      contentTypeVal =
        contentTypeCat +
        " " +
        (contentTypeFormat === "JAVASCRIPT" ? "JS" : contentTypeFormat);
    }

    retVal += contentTypeVal;

    retVal += "</div>";

    return retVal;
  }

  getContentLength(mediadata) {
    var retVal = `<div style="padding-left: 5px;">`;

    var size = parseInt(mediadata.MediaRespHdr["content-length"]);
    var withOriginalSize = false;
    if (isNaN(size)) return "0 B";
    var units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    var i = 0;

    var origSize = size;
    while (size >= 1024) {
      size /= 1024;
      ++i;
    }
    retVal +=
      (i == 0 ? size : size.toFixed(2)) +
      " " +
      units[i] +
      (withOriginalSize ? (i > 0 ? ` (${origSize} B)` : "") : "");

    retVal += "</div>";

    return retVal;
  }

  getTtfb(mediadata) {
    var retVal = `<div style="padding-left: 5px;">`;
    var ttfb =
      typeof mediadata.MediaPerf === "undefined"
        ? -1
        : mediadata.MediaPerf.responseStart - mediadata.MediaPerf.requestStart;

    retVal += ttfb < 0 ? "N/A" : ttfb.toFixed(2) + " ms";

    retVal += "</div>";

    return retVal;
  }

  getContentDlTime(mediadata) {
    var retVal = `<div style="padding-left: 5px;">`;

    var contentDownload =
      typeof mediadata.MediaPerf === "undefined"
        ? -1
        : mediadata.MediaPerf.responseEnd - mediadata.MediaPerf.responseStart;

    retVal += contentDownload < 0 ? "N/A" : contentDownload.toFixed(2) + " ms";

    retVal += "</div>";

    return retVal;
  }

  getDetails(mediadata, tabIndex) {
    var retVal = `<div style="padding-left: 5px;">`;
    //var text = "View";
    //var style = `style="color:lightgray;`;
    //retVal += `<p ${style}">${text}</p>`;

    /// **********
    //retVal += `<br/>`;
    retVal += `<button id="viewdetail" class="collapsible">View</button>`;

    var retValX = `<div class="mediadetail">
        ${this.getDetailsPane(tabIndex)}
      </div>`;

    retVal += `<div class="mediadetail">
        <p>Not yet available</p>
      </div>`;
    /// **********

    retVal += "</div>";

    return retVal;
  }

  getDetailsPane(tabIndex) {
    return `
        <div class="tab tab${tabIndex}">
          <button class="tablinks tablinks${tabIndex}" onclick="openCity(${tabIndex}, event, 'London')" id="defaultOpen${tabIndex}">London</button>
          <button class="tablinks tablinks${tabIndex}" onclick="openCity(${tabIndex}, event, 'Paris')">Paris</button>
          <button class="tablinks tablinks${tabIndex}" onclick="openCity(${tabIndex}, event, 'Tokyo')">Tokyo</button>
        </div>
        <div id="London${tabIndex}" class="tabcontent tabcontent${tabIndex}">
          <h5>London</h5>
          <p>London is the capital city of England ${tabIndex}.</p>
        </div>
        <div id="Paris${tabIndex}" class="tabcontent tabcontent${tabIndex}">
          <h5>Paris</h5>
          <p>Paris is the capital of France ${tabIndex}.</p> 
        </div>
        <div id="Tokyo${tabIndex}" class="tabcontent tabcontent${tabIndex}">
          <h5>Tokyo</h5>
          <p>Tokyo is the capital of Japan ${tabIndex}.</p>
        </div>
        `;
  }

  addMediaRowData(mediadata) {
    var cellItem = [];

    cellItem.push({
      style: `style="font-size: 14px;"`,
      value: (this.#mediaRowData.length + 1).toString(),
    });

    cellItem.push({
      style: "",
      value: this.getThumbnail(mediadata),
    });

    cellItem.push({
      style: `style="font-size: 14px;"`,
      value: this.getService(mediadata),
    });
    cellItem.push({
      style: `style="font-size: 14px;"`,
      value: this.getResponseStatus(mediadata),
    });
    cellItem.push({
      style: `style="font-size: 14px;"`,
      value: this.getErrorMessage(mediadata),
    });
    cellItem.push({
      style: `style="font-size: 14px;"`,
      value: this.getUrl(mediadata),
    });
    cellItem.push({
      style: `style="font-size: 14px;"`,
      value: this.getEntitiesCount(mediadata),
    });
    cellItem.push({
      style: `style="font-size: 14px;"`,
      value: this.getScaleRatio(mediadata),
    });
    cellItem.push({
      style: `style="font-size: 14px;"`,
      value: this.getContentType(mediadata),
    });
    cellItem.push({
      style: `style="font-size: 14px;"`,
      value: this.getContentLength(mediadata),
    });
    cellItem.push({
      style: `style="font-size: 14px;"`,
      value: this.getTtfb(mediadata),
    });
    cellItem.push({
      style: `style="font-size: 14px;"`,
      value: this.getContentDlTime(mediadata),
    });
    cellItem.push({
      style: `style="font-size: 14px;"`,
      value: this.getDetails(mediadata, this.#mediaRowData.length),
    });

    this.#mediaRowData.push(cellItem);
  }

  getTimestamp() {
    const now = new Date();
    const isoDate = now
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\./, "");
    return isoDate;
  }

  createReportPage(hdr, rows, ftr) {
    const winHtml = `<!DOCTYPE html>
  <html>
  <head>
    <title>Cld Media Analyzer</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.13.4/css/dataTables.bootstrap4.min.css" />
    <script src="https://code.jquery.com/jquery-3.5.1.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/dataTables.bootstrap4.min.js"></script>
    <style>
      .collapsible {
        background-color: #777;
        color: white;
        cursor: pointer;
        border: none;
        font-size: 15px;
        width: 100%;
      }
  
      .active, .collapsible:hover {
        background-color: #555;
      }  
  
      .collapsible:after {
        //content: '+';
        color: white;
        font-weight: bold;
        float: right;
        margin-left: 5px;
      }
  
      .mediadetail {
        padding: 0 18px;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.2s ease-out;
      }
  
      /* ********** Style the tab */
      .tab {
        float: left;
        border: 1px solid #ccc;
        background-color: #f1f1f1;
        width: 30%;
        height: 300px;
      }
      
      /* Style the buttons inside the tab */
      .tab button {
        display: block;
        background-color: inherit;
        color: black;
        padding: 22px 16px;
        width: 100%;
        border: none;
        outline: none;
        text-align: left;
        cursor: pointer;
        transition: 0.3s;
        font-size: 17px;
      }
      
      /* Change background color of buttons on hover */
      .tab button:hover {
        background-color: #ddd;
      }
      
      /* Create an active/current "tab button" class */
      .tab button.active {
        background-color: #ccc;
      }
      
      /* Style the tab content */
      .tabcontent {
        float: left;
        padding: 0px 12px;
        border: 1px solid #ccc;
        width: 70%;
        border-left: none;
        height: 300px;
      }
    </style>
  </head>
  <body>
      <div class="mycontainer" style="padding-left: 20px;padding-right: 20px;padding-bottom: 50px;">
        <h2>CLD Media Analyzer</h2>
        <p>The list of images from the current page that are being analyzed.</p>  
        <table id="example" class="table table-striped table-bordered" style="width:100%">
            ${hdr}
            ${rows}
            ${ftr}
        </table>
        <script>
            $(document).ready(function () {
                $('#example').DataTable();
            });
        </script>
      </div>
      <script>
        var coll = document.getElementsByClassName("collapsible");
        var i;
        for (i = 0; i < coll.length; i++) {
          coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight){
              content.style.maxHeight = null;
            } else {
              content.style.maxHeight = content.scrollHeight + "px";
            } 
          });
        }
      </script>
  
      <script>
        function openCity(tabClsIndex, evt, cityName) {
          var i, tabcontent, tablinks;
          tabcontent = document.getElementsByClassName("tabcontent" + tabClsIndex.toString());
          for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
          }
          tablinks = document.getElementsByClassName("tablinks" + tabClsIndex.toString());
          for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
          }
          document.getElementById(cityName + tabClsIndex.toString()).style.display = "block";
          evt.currentTarget.className += " active";
        }
  
        var x = 0;
        var rowItems = document.getElementsByClassName("collapsible");
        for(x = 0; x < rowItems.length; x++)
        {
          document.getElementById("defaultOpen" + x.toString()).click();
        }
      </script>          
  </body>
  </html>
        `;

    const winUrl = URL.createObjectURL(
      new Blob([winHtml], { type: "text/html" })
    );

    this.getTimestamp();

    window.open(
      winUrl,
      "win" + this.getTimestamp(),
      `width=1500,height=800,screenX=100,screenY=100`
    );
  }

  show() {
    var objDisp = new ClsMITTable();

    objDisp.addHeaderFooter("Item");
    objDisp.addHeaderFooter("Thumb");
    objDisp.addHeaderFooter("Service");
    objDisp.addHeaderFooter("Status");
    objDisp.addHeaderFooter("Error");
    objDisp.addHeaderFooter("URL");
    objDisp.addHeaderFooter("#");
    objDisp.addHeaderFooter("Scale Ratio");
    objDisp.addHeaderFooter("Content Type");
    objDisp.addHeaderFooter("Size");
    objDisp.addHeaderFooter("TTFB");
    objDisp.addHeaderFooter("Content Download");
    objDisp.addHeaderFooter("Details");

    this.#mediaRowData.forEach((row) => {
      objDisp.addRow(row);
    });

    this.createReportPage(
      objDisp.setHeader(),
      objDisp.setRow(),
      objDisp.setFooter()
    );
  }
}

class ClsMediaSource {
  #mediaPerf;
  #mediaDoc;
  #mediaRespHdr;

  constructor() {}

  set MediaPerf(imgperf) {
    this.#mediaPerf = imgperf;
  }

  get MediaPerf() {
    return this.#mediaPerf;
  }

  set MediaDoc(mediadoc) {
    this.#mediaDoc = mediadoc;
  }

  get MediaDoc() {
    return this.#mediaDoc;
  }

  set MediaRespHdr(mediaresphdr) {
    this.#mediaRespHdr = mediaresphdr;
  }

  get MediaRespHdr() {
    return this.#mediaRespHdr;
  }
}

class ClsMITTable {
  #rowNum = 0;
  #colNum = 0;
  #hdrNum = 0;
  #ftrNum = 0;

  #rowItems = [];
  #hdrItems = [];
  #ftrItems = [];

  constructor() {}

  addRow(row) {
    var retValue = "<tr>\n";
    row.forEach((r) => {
      retValue += `<td ${r.style}>${r.value}</td>\n`;
    });
    retValue += "</tr>";

    this.#rowItems.push(retValue);

    this.setRow();

    this.#rowNum++;
  }

  addCol(col) {
    // .. add item here

    this.#colNum++;
  }

  addHeaderFooter(value) {
    this.addHeader(value);
    this.addFooter(value);
  }

  addHeader(header) {
    // .. add item here
    this.#hdrItems.push(`<th>${header}</th>`);

    this.setHeader();

    this.#hdrNum++;
  }

  addHeader(header, style) {
    // .. add item here
    this.#hdrItems.push(`<th ${style}>${header}</th>`);

    this.setHeader();

    this.#hdrNum++;
  }

  addHeader(header, style, attributes) {
    // .. add item here
    this.#hdrItems.push(`<th ${attributes} ${style}>${header}</th>`);

    this.setHeader();

    this.#hdrNum++;
  }

  addFooter(footer) {
    // .. add item here
    this.#ftrItems.push(`<th>${footer}</th>`);

    this.setFooter();

    this.#ftrNum++;
  }

  setRow() {
    var retValue = "<tbody>\n";

    this.#rowItems.forEach((r) => {
      retValue += r + "\n";
    });
    retValue += "</tbody>\n";

    //console.log("setRow", retValue);
    return retValue;
  }

  setHeader() {
    var retValue = `<thead>\n<tr role="row">\n`;
    this.#hdrItems.forEach((h) => {
      retValue += h + "\n";
    });
    retValue += "</tr>\n</thead>";

    //console.log("headeritems", retValue);
    return retValue;
  }

  setFooter() {
    var retValue = `<tfoot>\n<tr>\n`;
    this.#hdrItems.forEach((footer) => {
      retValue += footer + "\n";
    });
    retValue += "</tr>\n</tfoot>";

    return retValue;
  }
}

function appGetRespHeader(url) {
  var req = new XMLHttpRequest();
  req.open("HEAD", url, false);

  req.onreadystatechange = function (oEvent) {
    if (req.readyState === 4) {
      var tmpImg = JSON.parse(
        JSON.stringify(req.getAllResponseHeaders())
      ).split("\r\n");

      if (req.status === 200) {
        tmpImg.push("noresna: NA");
        tmpImg.push("Status: All Good");
      } else {
        if (
          JSON.stringify(req.getAllResponseHeaders())
            .toString()
            .search(/x-cld-error/i) < 0
        ) {
          tmpImg.push("noreserr: Resource not found");
        }
        tmpImg.push("Status: Still working on it!!!");
      }

      try {
        var nurl = new URL(url);
        tmpImg.push("hostname: " + nurl.hostname);
      } catch (error) {
        tmpImg.push("hostname:", "undefined");
      }

      var objHdr = {};
      tmpImg.forEach((item) => {
        if (item != "") {
          var skey = item.toString().split(":")[0].trim();
          var sval = item
            .toString()
            .replace(skey + ":", "")
            .trim();

          objHdr[skey] = sval;

          if (skey === "x-cld-error") {
            objHdr["error-message"] = item;
          } else if (skey === "noreserr") {
            objHdr["error-message"] = "Resource not found";
          } else if (skey === "noresna") {
            objHdr["error-message"] = "NA";
          }
        }
      });

      return objHdr;
    }
  };

  req.send(null);
}

function appMain() {
  const objMiTool = new ClsMediaInspectorTool();

  const getResourcesPerfData = () => {
    const duration = performance.getEntriesByType("navigation")[0].duration;

    if (!duration) setTimeout(getResourcesPerfData, 10);
    else {
      let allEntries = Array.from(window.document.querySelectorAll("*"));

      let tgtEntries = window.performance
        .getEntriesByType("resource")
        .filter(
          (resource) =>
            resource.initiatorType == "img" ||
            resource.initiatorType == "video" ||
            resource.initiatorType == "script"
        );

      let entryName = "";

      allEntries.forEach((entry) => {
        if (
          entry.nodeName.toUpperCase() === "IMG" ||
          entry.nodeName.toUpperCase() === "VIDEO" ||
          entry.nodeName.toUpperCase() === "SCRIPT"
        ) {
          if (entry.nodeName.toUpperCase() === "SCRIPT") {
            entryName = entry.src;
            //console.log("Source", entry.src);
          } else {
            entryName = entry.currentSrc;
            //console.log("Source", entry.currentSrc);
          }

          let bFound = false;
          var objMedia = new ClsMediaSource();

          for (b = 0; b < tgtEntries.length; b++) {
            if (entryName === tgtEntries[b].name && !bFound) {
              bFound = true;

              objMedia.MediaDoc = entry;
              objMedia.MediaPerf = tgtEntries[b];
            }
          }

          if (!bFound && entryName != "") {
            bFound = true;

            var url = entryName;
            var req = new XMLHttpRequest();
            req.open("HEAD", url, false);
            req.send(null);
            let atgtEntries = window.performance
              .getEntriesByType("resource")
              .filter((resource) => resource.name == entryName);

            objMedia.MediaDoc = entry;
            if (atgtEntries.length > 0) objMedia.MediaPerf = atgtEntries[0];
          }

          if (bFound) {
            var url = entryName;
            var req = new XMLHttpRequest();
            req.open("HEAD", url, false);

            req.onreadystatechange = function (oEvent) {
              if (req.readyState === 4) {
                var tmpImg = JSON.parse(
                  JSON.stringify(req.getAllResponseHeaders())
                ).split("\r\n");

                if (req.status === 200) {
                  tmpImg.push("noresna: NA");
                  tmpImg.push("Status: All Good");
                } else {
                  if (
                    JSON.stringify(req.getAllResponseHeaders())
                      .toString()
                      .search(/x-cld-error/i) < 0
                  ) {
                    tmpImg.push("noreserr: Resource not found");
                  }
                  tmpImg.push("Status: Still working on it!!!");
                }

                try {
                  var nurl = new URL(url);
                  tmpImg.push("hostname: " + nurl.hostname);
                } catch (error) {
                  tmpImg.push("hostname:", "undefined");
                }

                var objHdr = {};
                tmpImg.forEach((item) => {
                  if (item != "") {
                    var skey = item.toString().split(":")[0].trim();
                    var sval = item
                      .toString()
                      .replace(skey + ":", "")
                      .trim();

                    objHdr[skey] = sval;

                    if (skey === "x-cld-error") {
                      objHdr["error-message"] = item;
                    } else if (skey === "noreserr") {
                      objHdr["error-message"] = "Resource not found";
                    } else if (skey === "noresna") {
                      objHdr["error-message"] = "NA";
                    }
                  }
                });

                objMedia.MediaRespHdr = objHdr;

                objMiTool.addMediaSrc(objMedia);
              }
            };

            req.send(null);
          }
        }
      });

      //objMiTool.show();
    }
  };

  getResourcesPerfData();
}

/** ************************* */
/** Main() */
/** ************************* */

$(window).load(function () {
  // start javascript
  appMain();
});
