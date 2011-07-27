(function(b){function a(){this.version="0.0.9";this.d=document;this.requestAnimFrame=(function(){return b.requestAnimationFrame||b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame||b.oRequestAnimationFrame||b.msRequestAnimationFrame||function(e,d){b.setTimeout(e,1000/60)}})()}b.tiramisu=b.t=new a();function c(e,d){for(var f in d){e[f]=d[f]}}a.prototype.detect=function(g){var f=navigator.userAgent,j=navigator.appName,i=f.substring(f.indexOf("Firefox")),e=i.split("/")[1].split(".")[0],d=f.substring(f.indexOf("Version")).split("/")[1];var k=false;var h={browser:function(){if(j==="Netscape"){if(i.split("/")[0]!=="Firefox"){return"safarichrome"}else{if(e==="4"){return"firefox4"}return"firefox3"}}else{if(j=="Opera"){if(d.split(".")[1]>49){return"Opera10.5+"}return"Opera10.4"}else{if(/MSIE (\d+\.\d+);/.test(f)){var l=new Number(RegExp.$1);if(l>8){return"IE9+"}else{if(l===8){return"IE8"}}return"IE_older"}else{return"IE"}}}},isIE:function(){return this.browser()==="IE9+"||this.browser()==="IE8"||this.browser()==="IE_older"},isIEolder:function(){return this.browser()==="IE8"||this.browser()==="IE_older"},isFirefox:function(){return this.browser()==="firefox3"||this.browser()==="firefox4"},isChrome:function(){return this.browser()==="safarichrome"},querySelectorAll:function(){return(k&&typeof this.d.querySelectorAll!=="undefined")},opacity:function(){if(this.isIEolder()){return false}return true},color:function(){if(this.isIEolder()){return false}return true}};return h[g]()};a.prototype.get=function(j){if(tiramisu.detect("querySelectorAll")){return this.d.querySelectorAll(j)}var l={nl:"\n|\r\n|\r|\f",nonascii:"[^\0-\177]",unicode:"\\[0-9A-Fa-f]{1,6}(\r\n|[s\n\r\t\f])?",escape:"#{unicode}|\\[^\n\r\f0-9A-Fa-f]",nmchar:"[_A-Za-z0-9-]|#{nonascii}|#{escape}",nmstart:"[_A-Za-z]|#{nonascii}|#{escape}",ident:"[-@]?(#{nmstart})(#{nmchar})*",name:"(#{nmchar})+"};var s={"id and name":"(#{ident}##{ident})",id:"(##{ident})","class":"(\\.#{ident})","name and class":"(#{ident}\\.#{ident})",element:"(#{ident})","pseudo class":"(:#{ident})"};function o(u){return u.replace(/^\s+|\s+$/g,"").replace(/[ \t\r\n\f]+/g," ")}var k=function(){function v(B,A){var y=true,z;while(y){z=B.match(/#\{([^}]+)\}/);if(z&&z[1]){B=B.replace(new RegExp("#{"+z[1]+"}","g"),A[z[1]]);y=true}else{y=false}}return B}function u(y){return y.replace(/\//g,"//")}function x(){var z,C,y={},A,B;if(arguments.length===2){B=arguments[0];A=arguments[1]}else{B=arguments[0];A=arguments[0]}for(z in A){C=u(v(A[z],B));y[z]=C}return y}function w(y){var A=[],z;for(z in y){A.push(y[z])}return new RegExp(A.join("|"),"g")}return w(x(x(l),s))};var g={byAttr:function(y,w,x){var v,u=[];for(v in y){if(y[v]&&y[v][w]===x){u.push(y[v])}}return u}};var p={byId:function(u,v){return(u)?[u.getElementById(v)]:[]},byNodeName:function(u,y){if(u===null){return[]}var x,w=[],v=u.getElementsByTagName(y);for(x=0;x<v.length;x++){w.push(v[x])}return w},byClassName:function(u,y){if(u===null){return[]}var x,w=[],v=u.getElementsByTagName("*");for(x=0;x<v.length;x++){if(v[x].className.match("\\b"+y+"\\b")){w.push(v[x])}}return w}};var t={id:function(v,u){u=u.split("#")[1];return p.byId(v,u)},"name and id":function(v,u){var x=u.split("#"),w=x[0],y=x[1];return g.byAttr(p.byId(v,y),"nodeName",w.toUpperCase())},name:function(v,u){return p.byNodeName(v,u)},"class":function(v,u){u=u.split(".")[1];return p.byClassName(v,u)},"name and class":function(v,u){var y=u.split("."),w=y[0],x=y[1];return g.byAttr(p.byClassName(v,x),"nodeName",w.toUpperCase())}};var f={id:function(v,u){u=u.split("#")[1];return v&&v.id===u},name:function(u,v){return u.nodeName===v.toUpperCase()},"name and id":function(v,u){return f.id(v,u)&&f.name(v,u.split("#")[0])},"class":function(v,u){if(v&&v.className){u=u.split(".")[1];return v.className.match("\\b"+u+"\\b")}},"name and class":function(v,u){return f["class"](v,u)&&f.name(v,u.split(".")[0])}};function e(u,v){this.identity=u;this.finder=v}e.prototype.toString=function(){return"identity: "+this.identity+", finder: "+this.finder};function q(u){this.selector=o(u);this.tokens=[];this.tokenize()}q.prototype.tokenize=function(){var u,v,w;v=k();v.lastIndex=0;while(u=v.exec(this.selector)){w=null;if(u[10]){w="id"}else{if(u[1]){w="name and id"}else{if(u[15]){w="class"}else{if(u[20]){w="name and class"}else{if(u[29]){w="name"}}}}}this.tokens.push(new e(u[0],w))}return this.tokens};function n(u,v){this.root=u;this.key_selector=v.pop();this.tokens=v;this.results=[]}n.prototype.find=function(u){if(!t[u.finder]){throw new Error("Invalid Finder: "+u.finder)}return t[u.finder](this.root,u.identity)};n.prototype.matchesToken=function(v,u){if(!f[u.finder]){throw new Error("Invalid Matcher: "+u.finder)}return f[u.finder](v,u.identity)};n.prototype.matchesAllRules=function(x){if(this.tokens.length===0){return}var w=this.tokens.length-1,v=this.tokens[w],u=false;while(w>=0&&x){if(this.matchesToken(x,v)){u=true;w--;v=this.tokens[w]}x=x.parentNode}return u&&w<0};n.prototype.parse=function(){var w,v,x=this.find(this.key_selector),u=[];for(w=0;w<x.length;w++){v=x[w];if(this.tokens.length>0){if(this.matchesAllRules(v.parentNode)){u.push(v)}}else{if(this.matchesToken(v,this.key_selector)){u.push(v)}}}return u};var i=new q(j);a.prototype.tokenize=new q(j);var d=new n(document,i.tokens),m=d.parse();var h={each:function(u){var v;for(v=0;v<m.length;v++){u.apply(m[v])}return this},on:function(v,u){var w;if(m[0].addEventListener){for(w=0;w<m.length;w++){m[w].addEventListener(v,u,false)}}else{if(m[0].attachEvent){for(w=0;w<m.length;w++){m[w].attachEvent(v,u)}}}return this},css:function(w){var v,u;for(v=0;v<m.length;v++){for(u in w){if(w.hasOwnProperty(u)){m[v].style.setProperty(u,w[u],"")}}}return this},html:function(u){if(u!==undefined){m[0].innerHTML=u}else{return m[0].innerHTML}}};(function r(){var u;for(u in h){m[u]=h[u]}})();return m};a.prototype.ajax=function(f){var f=f||{},e={async:true,content_type:"",connection:"",error:function(i){console.log(i)},loader:"",method:"GET",parameter:"",success:function(){},successHTML:"",url:""},g=null,h="",d=0;if(b.XMLHttpRequest){g=new XMLHttpRequest()}else{if(b.ActiveXObject){g=new ActiveXObject("Microsoft.XMLHTTP")}else{console.log("Object Ajax Error!")}}c(e,f);if(tiramisu.detect("isIEolder")){e.method="POST"}if(e.parameter!=""){for(attrname in e.parameter){h+=attrname+"="+e.parameter[attrname]+"&"}h=h.substring(0,h.length-1);if(!e.content_type){e.content_type="application/x-www-form-urlencoded"}e.method="POST"}else{h=null}g.open(e.method,e.url,e.async);if(e.content_type){g.setRequestHeader("Content-type",e.content_type)}if(e.connection){g.setRequestHeader("Connection",e.connection)}g.onreadystatechange=function(){if(g.readyState==4&&g.status==200){if(e.successHTML){tiramisu.d.getElementById(e.successHTML).innerHTML=g.responseText}e.success(g.responseText)}else{if(g.readyState==4&&g.status==400){e.error("400 Bad Request")}else{if(g.readyState==4&&g.status!=200){e.error("Fetched the wrong page or network error")}}}};g.send(h);return this};a.prototype.task=function(g,d){var f,h=tiramisu.requestAnimFrame;if(arguments.length>2){f=arguments[1];d=arguments[arguments.length-1]}var j=+new Date(),i=f;function e(){var k=+new Date()-j;if(f!==undefined){if(k>i){i+=f;d()}}if(k<g){h(e)}else{if(f===undefined){d()}}}e()}})(window);