(function(b){function a(){this.version="0.2.5";this.d=document;this.modules=a.prototype}b.tiramisu=b.t=new a();tiramisu.modules.preventDefault=function(c){if(c){if(c.stopPropagation){c.stopPropagation()}else{if(c.preventDefault){c.preventDefault()}}c.cancelBubble=true}return false};tiramisu.modules.make=function(c){return t.get(t.d.createElement(c))}})(window);tiramisu.modules.json={ingredients:[],cups_of_coffee:7,decode:function(b,a){try{return JSON.parse(b,a)}catch(c){return""}},encode:function(b,a){try{return JSON.stringify(b,a)}catch(c){return""}}};tiramisu.modules.list_def=[];tiramisu.modules.get=function(v){var b=[2],d=1;this.selector="QSA";this.native_qsa=(this.selector==="QSA"&&typeof this.d.querySelectorAll!=="undefined"?true:false);function u(y){var z=[];for(var x=y.length;x--;){z[x]=y[x]}return z}var k={nl:"\n|\r\n|\r|\f",nonascii:"[^\0-\177]",unicode:"\\[0-9A-Fa-f]{1,6}(\r\n|[s\n\r\t\f])?",escape:"#{unicode}|\\[^\n\r\f0-9A-Fa-f]",nmchar:"[_A-Za-z0-9-]|#{nonascii}|#{escape}",nmstart:"[_A-Za-z]|#{nonascii}|#{escape}",ident:"[-@]?(#{nmstart})(#{nmchar})*",name:"(#{nmchar})+"};var l={"id and name":"(#{ident}##{ident})",id:"(##{ident})","class":"(\\.#{ident})","name and class":"(#{ident}\\.#{ident})",element:"(#{ident})","pseudo class":"(:#{ident})"};function s(x){return x.replace(/^\s+|\s+$/g,"").replace(/[ \t\r\n\f]+/g," ")}var f=function(){function y(E,D){var B=true,C;while(B){C=E.match(/#\{([^}]+)\}/);if(C&&C[1]){E=E.replace(new RegExp("#{"+C[1]+"}","g"),D[C[1]]);B=true}else{B=false}}return E}function x(B){return B.replace(/\//g,"//")}function A(){var C,F,B={},D,E;if(arguments.length===2){E=arguments[0];D=arguments[1]}else{E=arguments[0];D=arguments[0]}for(C in D){F=x(y(D[C],E));B[C]=F}return B}function z(B){var D=[],C;for(C in B){D.push(B[C])}return new RegExp(D.join("|"),"g")}return z(A(A(k),l))};var m={byAttr:function(B,z,A){var y,x=[];for(y in B){if(B[y]&&B[y][z]===A){x.push(B[y])}}return x}};var o={byId:function(x,y){return(x)?[x.getElementById(y)]:[]},byNodeName:function(x,B){if(x===null){return[]}var A,z=[],y=x.getElementsByTagName(B);for(A=0;A<y.length;A++){z.push(y[A])}return z},byClassName:function(x,B){if(x===null){return[]}var A,z=[],y=x.getElementsByTagName("*");for(A=0;A<y.length;A++){if(y[A].className.match("\\b"+B+"\\b")){z.push(y[A])}}return z}};var h={id:function(y,x){x=x.split("#")[1];return o.byId(y,x)},"name and id":function(y,x){var A=x.split("#"),z=A[0],B=A[1];return m.byAttr(o.byId(y,B),"nodeName",z.toUpperCase())},name:function(y,x){return o.byNodeName(y,x)},"class":function(y,x){x=x.split(".")[1];return o.byClassName(y,x)},"name and class":function(y,x){var B=x.split("."),z=B[0],A=B[1];return m.byAttr(o.byClassName(y,A),"nodeName",z.toUpperCase())}};var e={id:function(y,x){x=x.split("#")[1];return y&&y.id===x},name:function(x,y){return x.nodeName===y.toUpperCase()},"name and id":function(y,x){return e.id(y,x)&&e.name(y,x.split("#")[0])},"class":function(y,x){if(y&&y.className){x=x.split(".")[1];return y.className.match("\\b"+x+"\\b")}},"name and class":function(y,x){return e["class"](y,x)&&e.name(y,x.split(".")[0])}};function p(x,y){this.identity=x;this.finder=y}p.prototype.toString=function(){return"identity: "+this.identity+", finder: "+this.finder};function g(x){this.selector=s(x);this.tokens=[];this.tokenize()}g.prototype.tokenize=function(){var x,y,z;y=f();y.lastIndex=0;while(x=y.exec(this.selector)){z=null;if(x[10]){z="id"}else{if(x[1]){z="name and id"}else{if(x[15]){z="class"}else{if(x[20]){z="name and class"}else{if(x[29]){z="name"}}}}}this.tokens.push(new p(x[0],z))}return this.tokens};function j(x,y){this.root=x;this.key_selector=y.pop();this.tokens=y;this.results=[]}j.prototype.find=function(x){if(!h[x.finder]){throw new Error("Invalid Finder: "+x.finder)}return h[x.finder](this.root,x.identity)};j.prototype.matchesToken=function(y,x){if(!e[x.finder]){throw new Error("Invalid Matcher: "+x.finder)}return e[x.finder](y,x.identity)};j.prototype.matchesAllRules=function(A){if(this.tokens.length===0){return}var z=this.tokens.length-1,y=this.tokens[z],x=false;while(z>=0&&A){if(this.matchesToken(A,y)){x=true;z--;y=this.tokens[z]}A=A.parentNode}return x&&z<0};j.prototype.parse=function(){var z,y,A=this.find(this.key_selector),x=[];for(z=0;z<A.length;z++){y=A[z];if(this.tokens.length>0){if(this.matchesAllRules(y.parentNode)){x.push(y)}}else{if(this.matchesToken(y,this.key_selector)){x.push(y)}}}return x};var r;if(typeof v==="string"){if(this.native_qsa){r=u(t.d.querySelectorAll(v))}else{var a=new g(v);Tiramisu.prototype.tokenize=new g(v);var c=new j(document,a.tokens),r=c.parse()}}else{r=[v]}var n=r.length;var w={each:function(x){var y;for(y=0;y<r.length;y++){x.apply(r[y])}return this},css:function(C){var A,z,y=t.detect("browser"),B=t.detect("isIEolder"),D=t.detect("isIE");var x={opacity:function(F,E){if(E!==undefined){if(D){F.style.opacity=E;F.style.filter="alpha(opacity="+E*100+")"}else{F.style.opacity=E}}else{return F.style.opacity}},"border-radius":function(F,E){if(E){if(y==="f3"){F.style.MozBorderRadius=E}}else{if(y==="f3"){return F.style.MozBorderRadius}else{if(y==="ie9+"){return F.style.borderRadius}}}}};if(typeof(C)==="string"){if(D||y==="f3"){if(C=="border-radius"){return x[C](r[0])}return r[0].style[C]}return r[0].style[C]}for(A=n;A--;){for(z in C){if(C.hasOwnProperty(z)){if(D||y==="f3"){if(x[z]!==undefined){x[z](r[A],C[z])}else{r[A].style[z]=C[z]}}else{r[A].style.setProperty(z,C[z],"")}}}}return this},html:function(x){if(x!==undefined){r[0].innerHTML=x}else{return r[0].innerHTML}return this},value:function(A){var y=function(B){if(t.detect("isIE")||t.detect("isIEolder")){if(r[B].type=="select-one"){return r[B].options[r[B].selectedIndex].value}return r[B].value}return r[B].value};var z=function(B,C){if(t.detect("isIE")||t.detect("isIEolder")){if(r[B].type=="select-one"){r[B].options[r[B].selectedIndex].value=C}r[B].value=C}else{r[B].value=C}};if(r[0]===undefined){return""}if(A!==undefined){z(0,A)}else{if(n>1){var x=[];for(i=0;i<n;i++){x.push(y(i))}return x}return y(0)}},focus:function(){for(var x=n;x--;){r[x].focus()}},attr:function(x,y,A){var z=[];var B=function(){if(y!==undefined){B=function(){for(var C=n;C--;){if(x==="class"){if(A){r[C].className=r[C].className+" "+y}else{r[C].className=y}}else{r[C].setAttribute(x,y)}}}}else{B=function(){for(var C=n;C--;){if(x==="class"){z.push(r[C].className)}else{z.push(r[C].getAttribute(x))}}return z}}return B()};return B()||this},ready:function(x){t.list_def.push(x);t.d.onreadystatechange=function(){if(t.d.readyState=="complete"){var y=t.list_def.length;for(var z=0;z<y;z++){var A=t.list_def[z];A()}return this}}},index:function(y){if(y!==undefined){for(var x=n;x>=0;x--){if(r[x]===y){break}}return x}},filter:function(x){var z={":odd":function(A){return(A%2!==0)?true:false},":even":function(A){return(A%2===0)?true:false}};if(typeof x==="string"&&typeof z[x]==="function"){for(var y=n;y--;){!z[x](y)&&r.splice(y,1)}}else{if(typeof x==="function"){for(var y=n;y--;){!x(y)&&r.splice(y,1)}}}n=r.length;return this},removeClass:function(C){var z,y,E,B=false;if(C===":all"){C=undefined;var B=true}if(C!==undefined&&typeof C==="string"){var A=new RegExp("(\\s|^)"+C+"(\\s|$)");for(z=n;z--;){E=r[z].className.replace(A,"");r[z].className=E}}else{for(z=n;z--;){r[z].className="";if(B){var D=r[z].childNodes,x=D.length;if(x>0){(function(J,G){for(var I=G;I--;){J[I].className="";var F=J[I].childNodes,H=F.length;if(H>0){arguments.callee(F,H)}}})(D,x)}}}}return this}};(function q(){var x;for(x in w){if(n){r[x]=w[x]}else{r[x]=function(){return""}}}if(typeof(tiramisu.modules.get.methods)!=="undefined"){for(x in tiramisu.modules.get.methods){for(method in tiramisu.modules.get.methods[x]){if(n){r[method]=tiramisu.modules.get.methods[x][method]}else{r[method]=function(){return""}}}}}})();tiramisu.get.results=r;tiramisu.get.selector=v;return r};tiramisu.modules.get.methods=tiramisu.modules.get.methods||{};tiramisu.modules.detect=function(d){var b=[1],a=2;var c=navigator.userAgent,f=navigator.appName;var e={browser:function(){if(f==="Netscape"){var h=c.substring(c.indexOf("Firefox"));if(h.split("/")[0]!=="Firefox"){return"webkit"}else{firefox_version=parseInt(h.split("/")[1].split(".")[0]);if(firefox_version>3.8){return"f4+"}return"f3"}}else{if(f=="Opera"){var g=c.substring(c.indexOf("Version")).split("/")[1];if(g.split(".")[1]>49){return"o10.5+"}return"o10.4"}else{if(/MSIE (\d+\.\d+);/.test(c)){var j=new Number(RegExp.$1);if(j>8){return"ie9+"}else{if(j==8){return"ie8"}}return"ie7"}else{return"other"}}}},isIE:function(){return this.browser()==="ie9+"||this.browser()==="ie8"||this.browser()==="ie7"},isIEolder:function(){return this.browser()==="ie8"||this.browser()==="ie7"},isFirefox:function(){return this.browser()==="f3"||this.browser()==="f4+"},isWebkit:function(){return this.browser()==="webkit"},color:function(){if(this.isIEolder()){return false}return true}};return e[d]()};tiramisu.modules.local_event={};tiramisu.modules.get.methods.event={ingredients:[1],cups_of_coffee:5,on:function(b,a){if(arguments.length>2){return""}var e=1,d=[],f=[];if(typeof(b)==="string"){d[0]=b;f[0]=a}else{if(typeof(b)==="object"){if(typeof(b[0])==="string"){d=b;f[0]=a}else{for(key in b){e=d.push(key);f.push(b[key])}}}}for(var c=e;c--;){var a=f[c];for(i=this.length;i--;){add_handler(this[i],d[c],a)}if(typeof selector==="string"){t.local_event[selector]={};t.local_event[selector]={cb:a,element:this}}}return this},off:function(c){if(arguments.length>1){return""}if(typeof selector==="string"){if(t.local_event[selector]!==undefined){var b=t.local_event[selector]["cb"],d=t.local_event[selector]["element"],a=d.length;for(i=a;i--;){remove_handler(tiramisu.get.results[i],c,b)}delete t.local_event[selector]}}return this},};var add_handler=function(b,c,a){if(b.addEventListener){add_handler=function(e,f,d){e.addEventListener(f,d,false)}}else{add_handler=function(e,f,d){e.attachEvent("on"+f,d)}}add_handler(b,c,a)};var remove_handler=function(b,c,a){if(b.removeEventListener){remove_handler=function(e,f,d){e.removeEventListener(f,d,false)}}else{remove_handler=function(e,f,d){e.detachEvent("on"+f,d)}}remove_handler(b,c,a)};