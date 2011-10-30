(function(c){function b(){this.version="0.1.4";this.d=document;this.selector="QSA";this.requestAnimFrame=(function(){return c.requestAnimationFrame||c.webkitRequestAnimationFrame||c.mozRequestAnimationFrame||c.oRequestAnimationFrame||c.msRequestAnimationFrame||function(f,e){c.setTimeout(f,1000/60)}})()}c.tiramisu=c.t=new b();function d(f,e){for(var g in e){f[g]=e[g]}}var a={};b.prototype.detect=function(f){var e=navigator.userAgent,h=navigator.appName;var g={browser:function(){if(h==="Netscape"){var k=e.substring(e.indexOf("Firefox"));if(k.split("/")[0]!=="Firefox"){return"webkit"}else{firefox_version=parseInt(k.split("/")[1].split(".")[0]);if(firefox_version>3.8){return"f4+"}return"f3"}}else{if(h=="Opera"){var j=e.substring(e.indexOf("Version")).split("/")[1];if(j.split(".")[1]>49){return"o10.5+"}return"o10.4"}else{if(/MSIE (\d+\.\d+);/.test(e)){var l=new Number(RegExp.$1);if(l>8){return"ie9+"}else{if(l==8){return"ie8"}}return"ie7"}else{return"other"}}}},isIE:function(){return this.browser()==="ie9+"||this.browser()==="ie8"||this.browser()==="ie7"},isIEolder:function(){return this.browser()==="ie8"||this.browser()==="ie7"},isFirefox:function(){return this.browser()==="f3"||this.browser()==="f4+"},isChrome:function(){return this.browser()==="webkit"},querySelectorAll:function(){return(tiramisu.selector==="QSA"&&typeof tiramisu.d.querySelectorAll!=="undefined")},color:function(){if(this.isIEolder()){return false}return true}};return g[f]()};b.prototype.get=function(A){function p(E,H,C){if(x[0]===undefined){return""}var D,F,I,G;for(D=0;D<r;D++){I=t.d.createElement("div");if(typeof E==="string"){I.innerHTML=E}else{I.innerHTML=E.outerHTML||new XMLSerializer().serializeToString(E)}F=x[D].parentNode;while(G=I.firstChild){if(H){(C)?x[D].insertBefore(G,x[D].firstChild):F.insertBefore(G,x[D])}else{(C)?x[D].appendChild(G):F.insertBefore(G,x[D].nextSibling)}}}}function z(D){var E=[];for(var C=D.length;C--;){E[C]=D[C]}return E}var l=function(D,E,C){if(D.addEventListener){l=function(G,H,F){G.addEventListener(H,F,false)}}else{l=function(G,H,F){G.attachEvent("on"+H,F)}}l(D,E,C)};var s=function(D,E,C){if(D.removeEventListener){s=function(G,H,F){G.removeEventListener(H,F,false)}}else{s=function(G,H,F){G.detachEvent("on"+H,F)}}s(D,E,C)};var n={nl:"\n|\r\n|\r|\f",nonascii:"[^\0-\177]",unicode:"\\[0-9A-Fa-f]{1,6}(\r\n|[s\n\r\t\f])?",escape:"#{unicode}|\\[^\n\r\f0-9A-Fa-f]",nmchar:"[_A-Za-z0-9-]|#{nonascii}|#{escape}",nmstart:"[_A-Za-z]|#{nonascii}|#{escape}",ident:"[-@]?(#{nmstart})(#{nmchar})*",name:"(#{nmchar})+"};var o={"id and name":"(#{ident}##{ident})",id:"(##{ident})","class":"(\\.#{ident})","name and class":"(#{ident}\\.#{ident})",element:"(#{ident})","pseudo class":"(:#{ident})"};function y(C){return C.replace(/^\s+|\s+$/g,"").replace(/[ \t\r\n\f]+/g," ")}var h=function(){function D(J,I){var G=true,H;while(G){H=J.match(/#\{([^}]+)\}/);if(H&&H[1]){J=J.replace(new RegExp("#{"+H[1]+"}","g"),I[H[1]]);G=true}else{G=false}}return J}function C(G){return G.replace(/\//g,"//")}function F(){var H,K,G={},I,J;if(arguments.length===2){J=arguments[0];I=arguments[1]}else{J=arguments[0];I=arguments[0]}for(H in I){K=C(D(I[H],J));G[H]=K}return G}function E(G){var I=[],H;for(H in G){I.push(G[H])}return new RegExp(I.join("|"),"g")}return E(F(F(n),o))};var q={byAttr:function(G,E,F){var D,C=[];for(D in G){if(G[D]&&G[D][E]===F){C.push(G[D])}}return C}};var u={byId:function(C,D){return(C)?[C.getElementById(D)]:[]},byNodeName:function(C,G){if(C===null){return[]}var F,E=[],D=C.getElementsByTagName(G);for(F=0;F<D.length;F++){E.push(D[F])}return E},byClassName:function(C,G){if(C===null){return[]}var F,E=[],D=C.getElementsByTagName("*");for(F=0;F<D.length;F++){if(D[F].className.match("\\b"+G+"\\b")){E.push(D[F])}}return E}};var k={id:function(D,C){C=C.split("#")[1];return u.byId(D,C)},"name and id":function(D,C){var F=C.split("#"),E=F[0],G=F[1];return q.byAttr(u.byId(D,G),"nodeName",E.toUpperCase())},name:function(D,C){return u.byNodeName(D,C)},"class":function(D,C){C=C.split(".")[1];return u.byClassName(D,C)},"name and class":function(D,C){var G=C.split("."),E=G[0],F=G[1];return q.byAttr(u.byClassName(D,F),"nodeName",E.toUpperCase())}};var g={id:function(D,C){C=C.split("#")[1];return D&&D.id===C},name:function(C,D){return C.nodeName===D.toUpperCase()},"name and id":function(D,C){return g.id(D,C)&&g.name(D,C.split("#")[0])},"class":function(D,C){if(D&&D.className){C=C.split(".")[1];return D.className.match("\\b"+C+"\\b")}},"name and class":function(D,C){return g["class"](D,C)&&g.name(D,C.split(".")[0])}};function v(C,D){this.identity=C;this.finder=D}v.prototype.toString=function(){return"identity: "+this.identity+", finder: "+this.finder};function j(C){this.selector=y(C);this.tokens=[];this.tokenize()}j.prototype.tokenize=function(){var C,D,E;D=h();D.lastIndex=0;while(C=D.exec(this.selector)){E=null;if(C[10]){E="id"}else{if(C[1]){E="name and id"}else{if(C[15]){E="class"}else{if(C[20]){E="name and class"}else{if(C[29]){E="name"}}}}}this.tokens.push(new v(C[0],E))}return this.tokens};function m(C,D){this.root=C;this.key_selector=D.pop();this.tokens=D;this.results=[]}m.prototype.find=function(C){if(!k[C.finder]){throw new Error("Invalid Finder: "+C.finder)}return k[C.finder](this.root,C.identity)};m.prototype.matchesToken=function(D,C){if(!g[C.finder]){throw new Error("Invalid Matcher: "+C.finder)}return g[C.finder](D,C.identity)};m.prototype.matchesAllRules=function(F){if(this.tokens.length===0){return}var E=this.tokens.length-1,D=this.tokens[E],C=false;while(E>=0&&F){if(this.matchesToken(F,D)){C=true;E--;D=this.tokens[E]}F=F.parentNode}return C&&E<0};m.prototype.parse=function(){var E,D,F=this.find(this.key_selector),C=[];for(E=0;E<F.length;E++){D=F[E];if(this.tokens.length>0){if(this.matchesAllRules(D.parentNode)){C.push(D)}}else{if(this.matchesToken(D,this.key_selector)){C.push(D)}}}return C};var x;if(typeof A==="string"){if(t.detect("querySelectorAll")){x=z(tiramisu.d.querySelectorAll(A))}else{var e=new j(A);b.prototype.tokenize=new j(A);var f=new m(document,e.tokens),x=f.parse()}}else{x=[A]}var r=x.length;var B={each:function(C){var D;for(D=0;D<r;D++){C.apply(x[D])}return this},on:function(D,C){if(x[0]===undefined||arguments.length>2){return""}var G=1,F=[],H=[];if(typeof(D)==="string"){F[0]=D;H[0]=C}else{if(typeof(D)==="object"){if(typeof(D[0])==="string"){F=D;H[0]=C}else{for(key in D){G=F.push(key);H.push(D[key])}}}}for(var E=G;E--;){var C=H[E];for(i=r;i--;){l(x[i],F[E],C)}if(typeof A==="string"){a[A]={};a[A]={cb:C,element:x}}}return this},off:function(E){if(x[0]===undefined||arguments.length>1){return""}if(typeof A==="string"){if(a[A]!==undefined){var D=a[A]["cb"],F=a[A]["element"],C=F.length;for(i=C;i--;){s(x[i],E,D)}delete a[A]}}return this},before:function(C){p(C,true,false);return this},after:function(C){p(C,false,false);return this},append:function(C){p(C,false,true);return this},prepend:function(C){p(C,true,true);return this},css:function(H){var F,E,D=t.detect("browser"),G=t.detect("isIEolder"),I=t.detect("isIE");var C={opacity:function(K,J){if(J!==undefined){if(I){K.style.opacity=J;K.style.filter="alpha(opacity="+J*100+")"}else{K.style.opacity=J}}else{return K.style.opacity}},"border-radius":function(K,J){if(J){if(D==="f3"){K.style.MozBorderRadius=J}}else{if(D==="f3"){return K.style.MozBorderRadius}else{if(D==="ie9+"){return K.style.borderRadius}}}}};if(typeof(H)==="string"){if(I||D==="f3"){if(H=="border-radius"){return C[H](x[0])}return x[0].style[H]}return x[0].style[H]}for(F=r;F--;){for(E in H){if(H.hasOwnProperty(E)){if(I||D==="f3"){if(C[E]!==undefined){C[E](x[F],H[E])}else{x[F].style[E]=H[E]}}else{x[F].style.setProperty(E,H[E],"")}}}}return this},html:function(C){if(C!==undefined){x[0].innerHTML=C}else{return x[0].innerHTML}return this},value:function(F){var D=function(G){if(t.detect("isIE")||t.detect("isIEolder")){if(x[G].type=="select-one"){return x[G].options[x[G].selectedIndex].value}return x[G].value}return x[G].value};var E=function(G,H){if(t.detect("isIE")||t.detect("isIEolder")){if(x[G].type=="select-one"){x[G].options[x[G].selectedIndex].value=H}x[G].value=H}else{x[G].value=H}};if(x[0]===undefined){return""}if(F!==undefined){E(0,F)}else{if(r>1){var C=[];for(i=0;i<r;i++){C.push(D(i))}return C}return D(0)}},focus:function(){if(x[0]===undefined){return""}for(var C=r;C--;){x[C].focus()}},attr:function(C,E,F){for(var D=r;D--;){if(E!==undefined){if(C==="class"){if(F){x[D].className=x[D].className+" "+E}else{x[D].className=E}}else{x[D][C]=E}}else{if(C==="class"){return x[D].className}else{return x[D][C]}}}return this},index:function(D){if(D!==undefined){for(var C=r;C>=0;C--){if(x[C]===D){break}}return C}},filter:function(C){if(x[0]===undefined){return""}var E={":odd":function(F){return(F%2!==0)?true:false},":even":function(F){return(F%2===0)?true:false}};if(typeof C==="string"&&typeof E[C]==="function"){for(var D=r;D--;){!E[C](D)&&x.splice(D,1)}}else{if(typeof C==="function"){for(var D=r;D--;){!C(D)&&x.splice(D,1)}}}r=x.length;return this},empty:function(){if(x[0]===undefined){return""}for(var C=0;C<r;C++){var E=x[C].childNodes[0];while(E){var D=E.nextSibling;x[C].removeChild(E);E=D}}},destroy:function(G){if(x[0]===undefined){return""}if(G!==undefined&&typeof G==="string"){var E=t.get(A+" "+G),C=E.length;for(var D=C;D--;){var F=E[D].parentNode;F.removeChild(E[D])}}else{for(D=r;D--;){var F=x[D].parentNode;F.removeChild(x[D])}}return this},removeClass:function(H){if(x[0]===undefined){return""}var E,D,J,G=false;if(H===":all"){H=undefined;var G=true}if(H!==undefined&&typeof H==="string"){var F=new RegExp("(\\s|^)"+H+"(\\s|$)");for(E=r;E--;){J=x[E].className.replace(F,"");x[E].className=J}}else{for(E=r;E--;){x[E].className="";if(G){var I=x[E].childNodes,C=I.length;if(C>0){(function(O,L){for(var N=L;N--;){O[N].className="";var K=O[N].childNodes,M=K.length;if(M>0){arguments.callee(K,M)}}})(I,C)}}}}return this}};(function w(){var C;for(C in B){x[C]=B[C]}})();return x};b.prototype.ajax=function(e){var e=e||{},n={abort:false,async:true,content_type:"",connection:"",data_type:"",error:function(o){try{console.log(o)}catch(p){}},start_load:function(){},end_load:function(){},loader:null,method:"GET",parameter:"",success:function(){},successHTML:"",stop:"",url:""},m=null,k="",l=0,j="",f="";if(n.abort){if(m&&m.readyState!=0&&m.readyState!=4){m.abort()}}try{m=new ActiveXObject("Msxml2.XMLHTTP")}catch(g){try{m=new ActiveXObject("Microsoft.XMLHTTP")}catch(h){m=null}}if(!m&&typeof XMLHttpRequest!="undefined"){m=new XMLHttpRequest}d(n,e);if(n.parameter!=""){for(attrname in n.parameter){k+=attrname+"="+n.parameter[attrname]+"&"}k=k.substring(0,k.length-1);if(n.method==="POST"){if(!n.content_type){n.content_type="application/x-www-form-urlencoded"}}else{f="?"+k}}else{k=null}if(t.detect("isIE")&&n.method==="POST"){j="?"+((""+Math.random()).replace(/\D/g,""))}m.onreadystatechange=function(){var o=m.readyState;if(o==4&&m.responseText){if(n.successHTML){if(typeof(n.successHTML)==="string"){t.d.getElementById(n.successHTML).innerHTML=m.responseText}else{if(typeof(n.successHTML)==="object"){if(typeof(n.successHTML.html)==="function"){n.successHTML.html(m.responseText)}else{n.successHTML.innerHTML=m.responseText}}}}n.end_load();n.success(m.responseText)}else{if(o==4&&m.status==400){n.end_load();n.error("400 Bad Request")}else{if(o==4&&m.status!=200){n.end_load();n.error("Fetched the wrong page or network error")}else{if(n.successHTML&&n.loader){if(typeof(n.successHTML)==="string"){t.d.getElementById(n.successHTML).innerHTML=n.loader}else{if(typeof(n.successHTML)==="object"){if(typeof(n.successHTML.html)==="function"){n.successHTML.html(n.loader)}else{n.successHTML.innerHTML=n.loader}}}}}}}};m.open(n.method,n.url+f+j,n.async);if(n.content_type){m.setRequestHeader("Content-type",n.content_type)}if(n.connection){m.setRequestHeader("Connection",n.connection)}if(n.data_type){m.setRequestHeader("dataType",n.data_type)}m.setRequestHeader("X-Requested-With","XMLHttpRequest");n.start_load();if(n.stop){t.task(n.stop,function(){m.abort()})}m.send(k);return this};b.prototype.task=function(h,e){var g,j=t.requestAnimFrame;if(arguments.length>2){g=arguments[1];e=arguments[2]}var l=+new Date(),k=g;function f(){var m=+new Date()-l;if(g!==undefined){if(m>k){k+=g;e()}}if(m<h||(h=="loop"&&g!==undefined)){j(f)}else{if(g===undefined){e()}}}f()}})(window);