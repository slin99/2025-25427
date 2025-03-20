## CVE-2025-25427 XSS in TP-Link TL-WR841N Upnp page

Repo with exploit for the xss in doUpate of the upnp page  (upnp.htm) of the TP-Link TL-WR841N router.
The upnp page displays upnp port mappings.  The port mappings are dynamically loaded using javascript.
The javascript code uses `cell.innerHTML` to display the port mappings. This allows for XSS.
Here the relevant code
```js 
function doUpdate() {
  if (upnpCfgObj.enable == 0) {
    upnpTbl = $.id("upnpTbl");
    while (upnpTbl.rows.length > 0) {
     upnpTbl.deleteRow(-1)
    }
    return
  } else{
    var portMappingList = $.act(ACT_GL, UPNP_PORTMAPPING, null, null);
    if ($.exe()) {
     return
    }
    var row;
    var cell;
    upnpTbl = $.id("upnpTbl");
    while (upnpTbl.rows.length > 0) {
     upnpTbl.deleteRow(-1)
    }
    for (var i = 0; i < portMappingList.length; i++){
      row = upnpTbl.insertRow(-1);
      cell = row.insertCell(-1);
      cell.width = "4%";
      cell.innerHTML = i + 1;
      cell = row.insertCell(-1);
      cell.width = "32%";
      cell.innerHTML += portMappingList[i].portMappingDescription;
      cell = row.insertCell(-1);
      cell.width = "14%";
      cell.innerHTML += portMappingList[i].externalPort;
      cell = row.insertCell(-1);
      cell.width = "10%";
      cell.innerHTML += portMappingList[i].portMappingProtocol;
      cell = row.insertCell(-1);
      cell.width = "14%";
      cell.innerHTML += portMappingList[i].internalPort;
      cell = row.insertCell(-1);
      cell.width = "17%";
      cell.innerHTML += portMappingList[i].internalClient;
      cell = row.insertCell(-1);
      cell.innerHTML = portMappingList[i].portMappingEnabled ? "<span class='T T_enabled'>" + m_str.enabled + "</span>" :"<span class='T T_disabled'>" + m_str.disabled + "</span>"
    }
    $.resize(upnpTbl, 8)
  }
}
```


### XSS exploitation 
Using the upnpclient[^upnpclient] python library:
`<script>` tags can't be used because the page is already loaded.
The description is limited to 32 characters.
This can be bypassed by adding multiple port mappings.
The id of the portmapping determines the order of loading and thus execution.
Using encoding and request bins, we can get arbitrary code execution by loading code from a request bin.
Here the example payload dumps the configuration file to a request bin. 
See `requestBinStage.js` for this payload.
In both the exploit and the request bin payload the request bin urls have to be replaced.

# Fix 
the bug has been fixed in the latest update.
