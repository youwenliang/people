!function(){function a(d){return this instanceof a?d?b(d,c):void 0:new a(d)}function b(a,b){for(var c in b)a[c]=b[c];return a}var c=a.prototype,d=[].slice;c.on=function(a,b){return this._cbs=this._cbs||{},(this._cbs[a]||(this._cbs[a]=[])).push(b),this},c.once=function(a,b){function c(){b.apply(this,arguments),this.off(a,c)}this.on(a,c)},c.off=function(a,b){if(this._cbs=this._cbs||{},!a)return void(this._cbs={});if(!b)return delete this._cbs[a];for(var c,d=this._cbs[a]||[];d&&~(c=d.indexOf(b));)d.splice(c,1);return this},c.fire=c.emit=function(a){var b=this._cbs=this._cbs||{},c=a.name||a,e=(b[c]||[]).concat(b["*"]||[]),f=a.ctx||this;if(e.length){this._fireArgs=arguments;for(var g=d.call(arguments,1);e.length;)e.shift().apply(f,g)}return this},c.firer=function(a){var b=this;return function(){var c=d.call(arguments);c.unshift(a),b.fire.apply(b,c)}},"object"==typeof exports?module.exports=a:"function"==typeof define&&define.amd?define(function(){return a}):window.evt=a}(),function(a){"use strict";a.SharedUtils={nodeListToArray:function(a){return[].map.call(a,function(a){return a})},addMixin:function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a.prototype.hasOwnProperty(c)||(a.prototype[c]=b[c]))},injectComponentStyle:function(a,b){var c=document.createElement("style"),d=b+"style.css";c.innerHTML="@import url("+d+");",a.appendChild(c),a.style.visibility="hidden",c.addEventListener("load",function(){a.shadowRoot&&a.shadowRoot.appendChild(c.cloneNode(!0)),a.style.visibility=""})},readColorCode:function(a,b,c,d){if(d){var e=URL.createObjectURL(a),f=new Image;f.onload=function(){URL.revokeObjectURL(e);var a=document.createElement("canvas");a.width=1,a.height=1;var g=a.getContext("2d");try{g.drawImage(f,f.naturalWidth*b,f.naturalHeight*c,1,1,0,0,1,1);var h=g.getImageData(0,0,1,1).data;d([h[0],h[1],h[2],h[3]])}catch(i){d(null,i)}},f.onerror=function(){URL.revokeObjectURL(e),console.error("read color code from "+a),d(null,new Error("read color code from "+a))},f.src=e}},localizeElement:function(a,b){if("string"==typeof b)return void a.setAttribute("data-l10n-id",b);if("object"==typeof b){if(b.id)return void navigator.mozL10n.setAttributes(a,b.id,b.args);if(b.raw)return a.removeAttribute("data-l10n-id"),void(a.textContent=b.raw)}}}}(window),function(a){function b(){this.timeoutID=null,this.timerID=null,this.start=function(a){var b=new Date,c=this;a(b),null==this.timeoutID&&(this.timeoutID=window.setTimeout(function(){a(new Date),null==c.timerID&&(c.timerID=window.setInterval(function(){a(new Date)},6e4))},1e3*(60-b.getSeconds())))},this.stop=function(){null!=this.timeoutID&&(window.clearTimeout(this.timeoutID),this.timeoutID=null),null!=this.timerID&&(window.clearInterval(this.timerID),this.timerID=null)}}a.Clock=b}(window),function(a){"use strict";var b=function(){this._piped_promises={},this._removePipedPromise=function(a){this._piped_promises[a]=void 0},this._getPipedPromise=function(a,b){var c=this,d=this._piped_promises[a];return d||(d=new Promise(b),Promise.all([d]).then(function(){c._removePipedPromise(a)},function(){c._removePipedPromise(a)}),c._piped_promises[a]=d),d}};a.PipedPromise=b}(window),function(a){"use strict";var b=function(a,b){var c=this;this._mode=a||"readwrite",b?(this._manifestURL=b,this._getStore()):navigator.mozApps.getSelf().onsuccess=function(a){var b=a.target.result;c._manifestURL=b.manifestURL,c._getStore()}};b.prototype=evt({STORE_NAME:"home_cards",_dataStore:void 0,_appRevisionId:void 0,_manifestURL:void 0,_mode:"readwrite",isStarted:function(){return!!this._manifestURL&&!!this._dataStore},canWrite:function(){return"readwrite"===this._mode},_onChange:function(a){this.fire("change",a)},_getStore:function(){var a=this;return this._getPipedPromise("_getStore",function(b,c){return a.isStarted()?void b(a._dataStore):void navigator.getDataStores(a.STORE_NAME).then(function(d){d.forEach(function(b){b.owner===a._manifestURL&&(a._dataStore=b,a._dataStore.addEventListener("change",a._onChange.bind(a)))}),a._dataStore?b(a._dataStore):c()})})},getData:function(a){var b=this;return new Promise(function(c,d){b._getStore().then(function(b){b?b.get(a).then(c):d("no store available")},function(a){d(a)})})},saveData:function(a,b){var c=this;return new Promise(function(d,e){c.canWrite()?c._getStore().then(function(c){c?c.put(b,a).then(d,function(a){e(a)}):e("no store available")},function(a){e(a)}):d()})}}),SharedUtils.addMixin(b,new PipedPromise),a.CardStore=b}(window),function(a){"use strict";var b=0,c=function(){this.generateCardId()};c.deserialize=function(){},c.prototype=evt({get cardId(){return this._id},generateCardId:function(){var a=this.nativeApp&&this.nativeApp.manifest?this.nativeApp.manifest.name:"card";return this._id=this.constructor.name+"-"+a+"-"+b,b+=1,this._id},serialize:function(){},constructor:c}),a.Card=c}(window),function(a){"use strict";var b=function(a){this.nativeApp=a.nativeApp,this.name=a.name,this.cachedIconBlob=void 0,this.thumbnail=a.thumbnail,this.launchURL=a.launchURL,this.group=a.group,Card.prototype.constructor.call(this)};b.deserialize=function(a,c){var d;return a&&c&&"Application"===a.type&&(d=new b({nativeApp:c[a.manifestURL],name:a.name,thumbnail:a.thumbnail,launchURL:a.launchURL,group:a.group})),d},b.prototype=Object.create(Card.prototype),b.prototype.constructor=b;var c=["manifest","updateManifest"];c.forEach(function(a){Object.defineProperty(b.prototype,a,{get:function(){return this.nativeApp&&this.nativeApp[a]}})}),b.prototype.serialize=function(){return{manifestURL:this.nativeApp.manifestURL,name:this.name,type:"Application",thumbnail:this.thumbnail,launchURL:this.launchURL,group:this.group}},b.prototype.launch=function(a){if(this.nativeApp&&this.nativeApp.launch&&!this.launchURL)this.nativeApp.launch(a);else{if(!b._iacPort)return void console.error("no iacPort found, we cannot launch Application");b._iacPort.postMessage({manifestURL:this.nativeApp.manifestURL,timestamp:(new Date).getTime(),url:this.launchURL})}},window.addEventListener("load",function d(){window.removeEventListener("load",d),navigator.mozApps.getSelf().onsuccess=function(a){var c=a.target.result;c&&c.connect("customlaunchpath").then(function(a){b._iacPort=a[0]})}}),a.Application=b}(window),function(a){"use strict";var b=function(a){this.nativeApp=a.nativeApp,this.name=a.name,this.deckClass=a.deckClass,this.group=a.group,Card.prototype.constructor.call(this)};b.deserialize=function(a,c){var d;return a&&c&&"Deck"===a.type&&(d=new b({name:a.name,nativeApp:a.manifestURL&&c[a.manifestURL],deckClass:a.deckClass,group:a.group})),d},b.prototype=Object.create(Card.prototype),b.prototype.constructor=b;var c=["manifest","updateManifest"];c.forEach(function(a){Object.defineProperty(b.prototype,a,{get:function(){return this.nativeApp&&this.nativeApp[a]}})}),b.prototype.launch=function(a){this.nativeApp&&this.nativeApp.launch&&this.nativeApp.launch(a)},b.prototype.serialize=function(){return{name:this.name,deckClass:this.deckClass,manifestURL:this.nativeApp&&this.nativeApp.manifestURL,type:"Deck",group:this.group}},a.Deck=b}(window),function(a){"use strict";var b=function c(a){this._cardsInFolder=a._cardsInFolder||[],this.name=a.name,this.folderId=a.folderId||uuid.v4(),this._state=a.state||c.STATES.NORMAL,Card.prototype.constructor.call(this)};b.STATES=Object.freeze({DESERIALIZING:"DESERIALIZING",NORMAL:"NORMAL",DIRTY:"DIRTY",DETACHED:"DETACHED"}),b.deserialize=function(a){var c;return a&&"Folder"===a.type&&(c=new b({name:a.name,folderId:a.folderId,state:b.STATES.DESERIALIZING})),c},b.prototype=Object.create(Card.prototype),b.prototype.constructor=b,Object.defineProperty(b.prototype,"state",{get:function(){return this._state},set:function(a){this._state=a,this.fire("state-changed",this._state)}}),b.prototype.getCardList=function(){return this._cardsInFolder},b.prototype.isEmpty=function(){return 0===this._cardsInFolder.length},b.prototype.isNotEmpty=function(){return this._cardsInFolder.length>0},b.prototype.isDeserializing=function(){return this._state===b.STATES.DESERIALIZING},b.prototype.isDetached=function(){return this._state===b.STATES.DETACHED},b.prototype.loadCardsInFolder=function(a){var c=this;"config"===a.from?(this._cardsInFolder=a.cardEntry._cardsInFolder.map(a.deserializer),this.state=b.STATES.NORMAL):"datastore"===a.from&&a.datastore.getData(this.folderId).then(function(d){d.forEach(function(b){c._cardsInFolder.push(a.deserializer(b))}),c.state=b.STATES.NORMAL})},b.prototype._indexOfCard=function(a){return this._cardsInFolder.indexOf(this.findCard(a))},b.prototype.findCard=function(a){var b;return this._cardsInFolder.some(function(c){if(c.cardId===a.cardId)return b=c,!0;if(a.manifestURL&&c.nativeApp&&c.nativeApp.manifestURL===a.manifestURL){if(!a.launchURL)return b=c,!0;if(c.launchURL===a.launchURL)return b=c,!0}else if(a.cardEntry&&JSON.stringify(c.serialize())===JSON.stringify(a.cardEntry))return b=c,!0}),b},b.prototype._isInFolder=function(a){return a?this._indexOfCard(a)>-1:!1},b.prototype._setDirty=function(){this._state!==b.STATES.DETACHED&&(this._state=b.STATES.DIRTY,this.fire("state-changed",this._state)),this.fire("folder-changed",this)},b.prototype.addCard=function(a,c){this._isInFolder(a)||a instanceof b||("number"!=typeof c&&(c=this._cardsInFolder.length),this._cardsInFolder.splice(c,0,a),this._setDirty(),this.fire("card-inserted",a,c))},b.prototype.removeCard=function(a){var b=this._indexOfCard(a);b>-1&&(this._cardsInFolder.splice(b,1),this._setDirty(),this.fire("card-removed",[b]))},b.prototype.updateCard=function(a,b){this._setDirty(),this.fire("card-updated",a,b)},b.prototype.swapCard=function(a,b){var c="number"==typeof a?c=a:this._indexOfCard(a),d="number"==typeof b?d=b:this._indexOfCard(b),e=this._cardsInFolder[c];this._cardsInFolder[c]=this._cardsInFolder[d],this._cardsInFolder[d]=e,this._setDirty(),this.fire("card-swapped",this._cardsInFolder[c],this._cardsInFolder[d],c,d)},b.prototype.launch=function(){this.fire("launch",this)},b.prototype.serialize=function(){return{name:this.name,folderId:this.folderId,type:"Folder"}},a.Folder=b}(window),function(a){"use strict";var b=function(){};b.STATES=Object.freeze({READY:"READY",SYNCING:"SYNCING"}),b.prototype=evt({HIDDEN_ROLES:["system","homescreen","addon","langpack"],_mode:"readwrite",_manifestURLOfCardStore:void 0,_cardStore:void 0,_cardList:[],installedApps:{},_asyncSemaphore:void 0,_isHiddenApp:function(a){return a?-1!==this.HIDDEN_ROLES.indexOf(a):!1},_isCardListLoaded:function(){return this._cardList&&this._cardList.length>0},_serializeCard:function(a){return a&&a.serialize()},_deserializeCardEntry:function(a){var b;switch(a.type){case"AppBookmark":case"Application":b=Application.deserialize(a,this.installedApps);break;case"Deck":b=Deck.deserialize(a,this.installedApps);break;case"Folder":b=Folder.deserialize(a),b.on("folder-changed",this._onFolderChange.bind(this))}return b},writeFolderInCardStore:function(a){var b=this;return new Promise(function(c,d){if(a instanceof Folder){b._asyncSemaphore.v();var e=a.getCardList().map(b._serializeCard.bind(b));b._cardStore.saveData(a.folderId,e).then(function(){a.state=Folder.STATES.NORMAL}).then(function(){b._asyncSemaphore.p(),c()},d)}else d()})},writeCardlistInCardStore:function(a){var b=this,c=[];return new Promise(function(d){var e,f=[];b._asyncSemaphore.v(),e=b._cardList.filter(function(a,d){if(a instanceof Folder){if(!(a.getCardList().length>0))return c.push(d),!1;f.push(b.writeFolderInCardStore(a))}return!0}),a&&a.cleanEmptyFolder&&(b._cardList=e),Promise.all(f).then(function(){d()})}).then(function(){var a=b._cardList.map(b._serializeCard.bind(b));return b._cardStore.saveData("cardList",a)}).then(function(){b._asyncSemaphore.p(),a&&a.cleanEmptyFolder&&b.fire("card-removed",c)})["catch"](function(){b._asyncSemaphore.p()})},_loadDefaultCardList:function(){var a=this;return this._getPipedPromise("_loadDefaultCardList",function(b,c){var d="shared/resources/default-cards.json";a._asyncSemaphore.v(),a._loadFile({url:d,responseType:"json"}).then(function(d){a._cardList=d.card_list.map(function(b){var c=a._deserializeCardEntry(b);return c instanceof Folder&&c.isDeserializing()&&c.loadCardsInFolder({from:"config",cardEntry:b,deserializer:a._deserializeCardEntry.bind(a)}),c}),a.writeCardlistInCardStore().then(b,c)}).then(function(){a._asyncSemaphore.p()})["catch"](function(b){var e="request "+d+" got reject "+b;a._asyncSemaphore.p(),c(e)})})},_onCardStoreChange:function(a){var b=this;"updated"===a.operation&&(b._asyncSemaphore.v(),"readonly"===this._mode&&(this._cardList=[]),this._reloadCardList().then(function(){b._asyncSemaphore.p(),b.fire("cardlist-changed")}))},_onFolderChange:function(a){a.isDetached()?this.writeCardlistInCardStore():(this.writeFolderInCardStore(a),a.isEmpty()&&this.writeCardlistInCardStore())},_initCardStoreIfNeeded:function(){this._cardStore||(this._cardStore=new CardStore(this._mode,this._manifestURLOfCardStore),this._cardStore.on("change",this._onCardStoreChange.bind(this)))},_loadCardListFromCardStore:function(a){var b=this;a.forEach(function(a){var c=b.findCardFromCardList({cardEntry:a});if(!c){var d=b._deserializeCardEntry(a);d instanceof Folder&&d.isDeserializing()&&d.loadCardsInFolder({from:"datastore",datastore:b._cardStore,deserializer:b._deserializeCardEntry.bind(b)}),b._cardList.push(d)}})},_reloadCardList:function(){var a=this;return this._getPipedPromise("_reloadCardList",function(b){a._asyncSemaphore.v(),a._initCardStoreIfNeeded(),b(a._cardStore.getData("cardList"))}).then(function(b){return b?void a._loadCardListFromCardStore(b):Promise.resolve(a._loadDefaultCardList())}).then(function(){a._asyncSemaphore.p()})["catch"](function(b){console.warn("Unable to reload cardList due to "+b),a._asyncSemaphore.p()})},_loadFile:function(a){return new Promise(function(b,c){var d=a.url,e=a.responseType||"text";if("string"==typeof d)try{var f=new XMLHttpRequest({mozAnon:!0,mozSystem:!0});f.open("GET",d,!0),f.responseType=e,f.onload=function(){0!==f.status&&200!==f.status?c(f.statusText):b(f.response)},f.ontimeout=f.onerror=function(){c()},f.send()}catch(g){c(g.message)}else c("invalid request")})},_bestMatchingIcon:function(a,b,c){var d=0,e=0;c=c||Number.MAX_VALUE;for(var f in b.icons)f=parseInt(f,10),f>d&&(d=f),!e&&f>=c&&(e=f);e||(e=d);var g=b.icons[e];return g?0===g.indexOf("data:")||0===g.indexOf("app://")||0===g.indexOf("http://")||0===g.indexOf("https://")?g:"/"!=g.charAt(0)?(console.warn("`"+b.name+"` app icon is invalid. Manifest `icons` attribute should contain URLs -or- absolute paths from the origin field."),""):"/"===a.origin.slice(-1)?a.origin.slice(0,-1)+g:[a.origin+g,e]:void 0},_onAppInstall:function(a){var b=a.application,c=b.manifest||b.updateManifest;if(b.launch&&c&&c.icons&&!this._isHiddenApp(c.role)){var d=this.installedApps[b.manifestURL]?"update":"install";this.installedApps[b.manifestURL]=b,this.fire(d,this.getAppEntries(b.manifestURL))}},_onAppUninstall:function(a){var b=a.application;this.installedApps[b.manifestURL]&&(delete this.installedApps[b.manifestURL],this.fire("uninstall",this.getAppEntries(b.manifestURL)))},insertNewFolder:function(a,b){var c=new Folder({name:a,state:Folder.STATES.DETACHED});return this._asyncSemaphore.wait(function(){"number"!=typeof b&&(b=this._cardList.length),this._cardList.splice(b,0,c),c.on("folder-changed",this._onFolderChange.bind(this)),this.fire("card-inserted",c,b)},this),c},insertCard:function(a){var b=this;this._asyncSemaphore.wait(function(){var c,d;if(c=a.cardEntry?this._deserializeCardEntry(a.cardEntry):a.card,c&&c.nativeApp){var e=b.findCardFromCardList({manifestURL:c.nativeApp.manifestURL,launchURL:c.launchURL});if(e)return}if("number"==typeof a.index)d=a.index;else if(c.group){d=-1;for(var f=0;f<this._cardList.length;f++){var g=this._cardList[f];if(-1!==d||g instanceof Deck){if(-1!==d&&g.group!==c.group)break;g.group===c.group&&(d=f)}}d+=1,0===d&&(d=this._cardList.length)}else d=this._cardList.length;this._cardList.splice(d,0,c),this.writeCardlistInCardStore().then(function(){b.fire("card-inserted",c,d,a.overFolder)})},this)},removeCard:function(a){this._asyncSemaphore.wait(function(){var b=this,c="number"==typeof a?a:this._cardList.indexOf(a);c>=0?(this._cardList.splice(c,1),this.writeCardlistInCardStore().then(function(){b.fire("card-removed",[c])})):this._cardList.forEach(function(b){b instanceof Folder&&b.removeCard(a)})},this)},updateCard:function(a,b){var c=this;this._asyncSemaphore.wait(function(){"undefined"==typeof b&&(b=this._cardList.findIndex(function(b){return b.cardId===a.cardId})),b>=0&&(this._cardList[b]!==a&&(this._cardList[b]=a),this.writeCardlistInCardStore().then(function(){c.fire("card-updated",c._cardList[b],b)}))},this)},swapCard:function(a,b){this._asyncSemaphore.wait(function(){var c,d,e=this;c="number"==typeof a?c=a:this._cardList.indexOf(a),d="number"==typeof b?d=b:this._cardList.indexOf(b);var f=this._cardList[c];this._cardList[c]=this._cardList[d],this._cardList[d]=f,this.writeCardlistInCardStore().then(function(){e.fire("card-swapped",e._cardList[c],e._cardList[d],c,d)})},this)},init:function(a){var b=this,c=navigator.mozApps.mgmt;return this._asyncSemaphore=new AsyncSemaphore,this._asyncSemaphore.v(),this._mode=a||"readwrite","readonly"===this._mode&&(this._manifestURLOfCardStore="app://smart-home.gaiamobile.org/manifest.webapp"),this._getPipedPromise("init",function(a,d){var e=c.getAll();e.onsuccess=function(c){c.target.result.forEach(function(a){var c=a.manifest;a.launch&&c&&c.icons&&!b._isHiddenApp(c.role)&&(b.installedApps[a.manifestURL]=a)}),a(b._reloadCardList())},e.onerror=function(){d(),b._asyncSemaphore.p()},c.addEventListener("install",b),c.addEventListener("uninstall",b)}).then(function(){b._asyncSemaphore.p()})},uninit:function(){var a=navigator.mozApps.mgmt;a.removeEventListener("install",this),a.removeEventListener("uninstall",this),this._cardList=[],this._cardStore.off("change"),this._cardStore=void 0,this.installedApps={}},getAppEntries:function(a){if(!a||!this.installedApps[a])return[];var b=this.installedApps[a].manifest||this.installedApps[a].updateManifest,c=b.entry_points,d=[],e=this.installedApps[a].removable;if(c&&"certified"===b.type)for(var f in c)c[f].icons&&d.push({manifestURL:a,entryPoint:f,name:c[f].name,removable:e,type:"Application"});else d.push({manifestURL:a,entryPoint:"",name:b.name,removable:e,type:"Application"});return d},getEntryManifest:function(a,b){if(!a||!this.installedApps[a])return null;var c=this.installedApps[a].manifest||this.installedApps[a].updateManifest;if(b){var d=c.entry_points[b];return d||null}return c},getIconBlob:function(a){var b=a.manifestURL,c=a.entryPoint,d=a.preferredSize,e=this;return new Promise(function(a,f){var g=e.getEntryManifest(b,c);g||f("No manifest");var h=e._bestMatchingIcon(e.installedApps[b],g,d);return h?void e._loadFile({url:h[0],responseType:"blob"}).then(function(b){a([b,h[1]])},function(){f("Error on loading blob of "+b)}):void f("No url")})},_getLocalizedName:function(a,b){if(a&&b){var c=this.getEntryManifest(a),d=c.locales,e=d&&d[b]&&(d[b].short_name||d[b].name);return e||c.short_name||c.name}},resolveCardName:function(a,b){var c;return a&&b?(a.name&&a.name.raw?c={raw:a.name.raw}:a.name&&a.name.id?c=a.name:a.nativeApp&&(a instanceof Application||a instanceof Deck)&&(c={raw:this._getLocalizedName(a.nativeApp.manifestURL,b)}),c):c},getCardList:function(){var a=this;return this._getPipedPromise("getCardList",function(b){a._asyncSemaphore.wait(function(){b(a._reloadCardList())},a)}).then(function(){return Promise.resolve(a._cardList)})},getFilteredCardList:function(a){return this.getCardList().then(function(b){var c=[];return"all"===a?c=b:a&&b.forEach(function(b){b.group===a&&c.push(b)}),Promise.resolve(c)})},findCardFromCardList:function(a){var b;return this._cardList.some(function(c){if(c instanceof Folder&&(b=c.findCard(a)))return!0;if(c.cardId===a.cardId)return b=c,!0;if(a.manifestURL&&c.nativeApp&&c.nativeApp.manifestURL===a.manifestURL){if(!a.launchURL)return b=c,!0;if(c.launchURL===a.launchURL)return b=c,!0}else if(a.cardEntry&&JSON.stringify(c.serialize())===JSON.stringify(a.cardEntry))return b=c,!0}),b},findContainingFolder:function(a){var b;return this._cardList.some(function(c){c instanceof Folder&&c.findCard(a)&&(b=c)}),b},isPinned:function(a){var b=this;return this._getPipedPromise("isPinned",function(a){b._asyncSemaphore.wait(function(){a(b._reloadCardList())},b)}).then(function(){return Promise.resolve(!!b.findCardFromCardList(a))})},handleEvent:function(a){switch(a.type){case"install":this._onAppInstall(a);break;case"uninstall":this._onAppUninstall(a)}}}),SharedUtils.addMixin(b,new PipedPromise),a.CardManager=b}(window),function(a){"use strict";a.Animations={createCircleAnimation:function(a,b){var c=document.createElement("div");c.className="animation-circle",b&&(c.style.backgroundColor=b);var d,e,f=!1;c.addEventListener("animationend",function(b){b.target===c&&(e&&e(),c.classList.remove(d),a.removeChild(c),f=!1)});var g=function(b,g){f=!0,d=b||"grow",e=g,c.classList.add(d),a.appendChild(c)};return{play:g,isPlaying:function(){return f}}},_findChildInViewport:function(a,b){var c,d,e,f=a.querySelectorAll(b),g=[];for(e=0;e<f.length;e++)c=f[e],d=c.getBoundingClientRect(),d.right>=0&&d.left<=window.innerWidth&&g.push({left:d.left,child:c});return g.sort(function(a,b){return a.left>b.left?1:a.left<b.left?-1:0}),g},doBubbleAnimation:function(a,b,c,d){var e,f,g=this._findChildInViewport(a,b),h=function(){for(f=0;f<g.length;f++)e=g[f].child,e.classList.remove("animation-bubble-start"),e.removeEventListener("animationend",j);d&&d()}.bind(this),i=0,j=function(){i++,i===g.length&&h()};for(f=0;f<g.length;f++)e=g[f].child,e.classList.add("animation-bubble-start"),e.style.animationDelay=(f+1)*c/1e3+"s",e.addEventListener("animationend",j);return h}}}(window),function(a){"use strict";function b(){}var c=b.prototype=new evt;b.DIRECTION=Object.freeze({HORIZONTAL:"horizontal",VERTICAL:"vertical"}),c.start=function(a,b,c){this.direction=b,this.updateList(a),this.isChild=c?!!c.isChild:!1,this.target=c&&c.target||window,this.isChild||this.target.addEventListener("keydown",this)},c.stop=function(){this.target.removeEventListener("keydown",this)},c.updateList=function(a){this._List=a,this._focusedIndex=-1,a.length>0&&(this._focusedIndex=0,this.focus())},c.focus=function(){var a=this._List[this._focusedIndex];a.focus&&"function"==typeof a.focus&&a.focus(),a instanceof b&&(a=a._List[a._focusedIndex]),this.fire("focusChanged",a)},c.blur=function(){var a=this._List[this._focusedIndex];a.blur&&"function"==typeof a.blur&&a.blur(),a instanceof b&&(a=a._List[a._focusedIndex]),this.fire("focusBlurred",a)},c.focusOn=function(a){var b=this._List.indexOf(a);b>=0&&(this._focusedIndex=b,this._List[this._focusedIndex].focus(),this.fire("focusChanged",this._List[this._focusedIndex]))},c.movePrevious=function(){this._focusedIndex<1||(this._focusedIndex--,this.focus())},c.moveNext=function(){this._focusedIndex>this._List.length-2||(this._focusedIndex++,this.focus())},c.handleKeyMove=function(a,b,c){a.keyCode===b?this.movePrevious():a.keyCode===c&&this.moveNext()},c.propagateKeyMove=function(a,c,d){this._List[this._focusedIndex]instanceof b&&(a.keyCode===c||a.keyCode===d)&&this._List[this._focusedIndex].handleEvent(a)},c.handleEvent=function(a){this.direction===b.DIRECTION.HORIZONTAL?(this.handleKeyMove(a,KeyEvent.DOM_VK_LEFT,KeyEvent.DOM_VK_RIGHT),this.propagateKeyMove(a,KeyEvent.DOM_VK_UP,KeyEvent.DOM_VK_DOWN)):(this.handleKeyMove(a,KeyEvent.DOM_VK_UP,KeyEvent.DOM_VK_DOWN),this.propagateKeyMove(a,KeyEvent.DOM_VK_LEFT,KeyEvent.DOM_VK_RIGHT))},a.SimpleKeyNavigation=b}(window);