(function(b){function a(){this.version="0.2.1";this.d=document;this.modules=a.prototype}b.tiramisu=b.t=new a();Event.prototype.preventDefault=function(){if(e.preventDefault){e.preventDefault()}else{e.returnValue=false}};tiramisu.modules.make=function(c){return t.get(t.d.createElement(c))}})(window);tiramisu.modules.ajax=function(d){var j=[2,7],f=4;var d=d||{},p={abort:false,async:true,content_type:"",connection:"",data_format:"",error:function(q){try{console.log(q)}catch(r){}},start_load:function(){},end_load:function(){},loader:null,method:"GET",parameter:"",success:function(){},successHTML:"",stop:"",url:""},o=null,m="",n=0,l="",c="",b=0,h="";if(p.abort){if(o&&o.readyState!=0&&o.readyState!=4){o.abort()}}try{o=new ActiveXObject("Msxml2.XMLHTTP")}catch(g){try{o=new ActiveXObject("Microsoft.XMLHTTP")}catch(k){o=null}}if(!o&&typeof XMLHttpRequest!="undefined"){o=new XMLHttpRequest}for(var a in d){p[a]=d[a]}if(p.parameter!=""){for(attrname in p.parameter){m+=attrname+"="+p.parameter[attrname]+"&"}m=m.substring(0,m.length-1);if(p.method==="POST"){if(!p.content_type){p.content_type="application/x-www-form-urlencoded"}}else{c="?"+m}}else{m=null}if(t.detect("isIE")&&p.method==="POST"){l="?"+((""+Math.random()).replace(/\D/g,""))}o.onreadystatechange=function(){b=o.readyState;if(b==4){if(o.responseText){if(p.data_format=="json"){h=t.json.decode(o.responseText)}else{h=o.responseText}if(p.successHTML){if(typeof(p.successHTML)==="string"){t.d.getElementById(p.successHTML).innerHTML=h}else{if(typeof(p.successHTML)==="object"){if(typeof(p.successHTML.html)==="function"){p.successHTML.html(h)}else{p.successHTML.innerHTML=h}}}}p.end_load();p.success(h)}else{if(b==4&&o.status==400){p.end_load();p.error("400 Bad Request")}else{if(b==4&&o.status!=200){p.end_load();p.error("Fetched the wrong page or network error")}}}}else{if(p.successHTML&&p.loader){if(typeof(p.successHTML)==="string"){t.d.getElementById(p.successHTML).innerHTML=p.loader}else{if(typeof(p.successHTML)==="object"){if(typeof(p.successHTML.html)==="function"){p.successHTML.html(p.loader)}else{p.successHTML.innerHTML=p.loader}}}}}};o.open(p.method,p.url+c+l,p.async);if(p.content_type){if(p.data_format=="json"){p.content_type="application/json; charset=UTF-8"}o.setRequestHeader("Content-type",p.content_type)}if(p.connection){o.setRequestHeader("Connection",p.connection)}o.setRequestHeader("X-Requested-With","XMLHttpRequest");p.start_load();if(p.stop){t.task(p.stop,function(){o.abort()})}o.send(m);return this};tiramisu.modules.json={ingredients:[2],cups_of_coffee:7,decode:function(b,a){try{return JSON.parse(b,a)}catch(c){return""}},encode:function(b,a){try{return JSON.stringify(b,a)}catch(c){return""}}};tiramisu.modules.list_def=[];tiramisu.modules.get=function(w){var b=[2],d=1;this.selector="QSA";this.native_qsa=(this.selector==="QSA"&&typeof this.d.querySelectorAll!=="undefined"?true:false);function v(z){var A=[];for(var y=z.length;y--;){A[y]=z[y]}return A}var l={nl:"\n|\r\n|\r|\f",nonascii:"[^\0-\177]",unicode:"\\[0-9A-Fa-f]{1,6}(\r\n|[s\n\r\t\f])?",escape:"#{unicode}|\\[^\n\r\f0-9A-Fa-f]",nmchar:"[_A-Za-z0-9-]|#{nonascii}|#{escape}",nmstart:"[_A-Za-z]|#{nonascii}|#{escape}",ident:"[-@]?(#{nmstart})(#{nmchar})*",name:"(#{nmchar})+"};var m={"id and name":"(#{ident}##{ident})",id:"(##{ident})","class":"(\\.#{ident})","name and class":"(#{ident}\\.#{ident})",element:"(#{ident})","pseudo class":"(:#{ident})"};function u(y){return y.replace(/^\s+|\s+$/g,"").replace(/[ \t\r\n\f]+/g," ")}var g=function(){function z(F,E){var C=true,D;while(C){D=F.match(/#\{([^}]+)\}/);if(D&&D[1]){F=F.replace(new RegExp("#{"+D[1]+"}","g"),E[D[1]]);C=true}else{C=false}}return F}function y(C){return C.replace(/\//g,"//")}function B(){var D,G,C={},E,F;if(arguments.length===2){F=arguments[0];E=arguments[1]}else{F=arguments[0];E=arguments[0]}for(D in E){G=y(z(E[D],F));C[D]=G}return C}function A(C){var E=[],D;for(D in C){E.push(C[D])}return new RegExp(E.join("|"),"g")}return A(B(B(l),m))};var n={byAttr:function(C,A,B){var z,y=[];for(z in C){if(C[z]&&C[z][A]===B){y.push(C[z])}}return y}};var p={byId:function(y,z){return(y)?[y.getElementById(z)]:[]},byNodeName:function(y,C){if(y===null){return[]}var B,A=[],z=y.getElementsByTagName(C);for(B=0;B<z.length;B++){A.push(z[B])}return A},byClassName:function(y,C){if(y===null){return[]}var B,A=[],z=y.getElementsByTagName("*");for(B=0;B<z.length;B++){if(z[B].className.match("\\b"+C+"\\b")){A.push(z[B])}}return A}};var j={id:function(z,y){y=y.split("#")[1];return p.byId(z,y)},"name and id":function(z,y){var B=y.split("#"),A=B[0],C=B[1];return n.byAttr(p.byId(z,C),"nodeName",A.toUpperCase())},name:function(z,y){return p.byNodeName(z,y)},"class":function(z,y){y=y.split(".")[1];return p.byClassName(z,y)},"name and class":function(z,y){var C=y.split("."),A=C[0],B=C[1];return n.byAttr(p.byClassName(z,B),"nodeName",A.toUpperCase())}};var f={id:function(z,y){y=y.split("#")[1];return z&&z.id===y},name:function(y,z){return y.nodeName===z.toUpperCase()},"name and id":function(z,y){return f.id(z,y)&&f.name(z,y.split("#")[0])},"class":function(z,y){if(z&&z.className){y=y.split(".")[1];return z.className.match("\\b"+y+"\\b")}},"name and class":function(z,y){return f["class"](z,y)&&f.name(z,y.split(".")[0])}};function q(y,z){this.identity=y;this.finder=z}q.prototype.toString=function(){return"identity: "+this.identity+", finder: "+this.finder};function h(y){this.selector=u(y);this.tokens=[];this.tokenize()}h.prototype.tokenize=function(){var y,z,A;z=g();z.lastIndex=0;while(y=z.exec(this.selector)){A=null;if(y[10]){A="id"}else{if(y[1]){A="name and id"}else{if(y[15]){A="class"}else{if(y[20]){A="name and class"}else{if(y[29]){A="name"}}}}}this.tokens.push(new q(y[0],A))}return this.tokens};function k(y,z){this.root=y;this.key_selector=z.pop();this.tokens=z;this.results=[]}k.prototype.find=function(y){if(!j[y.finder]){throw new Error("Invalid Finder: "+y.finder)}return j[y.finder](this.root,y.identity)};k.prototype.matchesToken=function(z,y){if(!f[y.finder]){throw new Error("Invalid Matcher: "+y.finder)}return f[y.finder](z,y.identity)};k.prototype.matchesAllRules=function(B){if(this.tokens.length===0){return}var A=this.tokens.length-1,z=this.tokens[A],y=false;while(A>=0&&B){if(this.matchesToken(B,z)){y=true;A--;z=this.tokens[A]}B=B.parentNode}return y&&A<0};k.prototype.parse=function(){var A,z,B=this.find(this.key_selector),y=[];for(A=0;A<B.length;A++){z=B[A];if(this.tokens.length>0){if(this.matchesAllRules(z.parentNode)){y.push(z)}}else{if(this.matchesToken(z,this.key_selector)){y.push(z)}}}return y};var s;if(typeof w==="string"){if(this.native_qsa){s=v(t.d.querySelectorAll(w))}else{var a=new h(w);Tiramisu.prototype.tokenize=new h(w);var c=new k(document,a.tokens),s=c.parse()}}else{s=[w]}var o=s.length;var x={each:function(y){var z;for(z=0;z<s.length;z++){y.apply(s[z])}return this},css:function(D){var B,A,z=t.detect("browser"),C=t.detect("isIEolder"),E=t.detect("isIE");var y={opacity:function(G,F){if(F!==undefined){if(E){G.style.opacity=F;G.style.filter="alpha(opacity="+F*100+")"}else{G.style.opacity=F}}else{return G.style.opacity}},"border-radius":function(G,F){if(F){if(z==="f3"){G.style.MozBorderRadius=F}}else{if(z==="f3"){return G.style.MozBorderRadius}else{if(z==="ie9+"){return G.style.borderRadius}}}}};if(typeof(D)==="string"){if(E||z==="f3"){if(D=="border-radius"){return y[D](s[0])}return s[0].style[D]}return s[0].style[D]}for(B=o;B--;){for(A in D){if(D.hasOwnProperty(A)){if(E||z==="f3"){if(y[A]!==undefined){y[A](s[B],D[A])}else{s[B].style[A]=D[A]}}else{s[B].style.setProperty(A,D[A],"")}}}}return this},html:function(y){if(y!==undefined){s[0].innerHTML=y}else{return s[0].innerHTML}return this},value:function(B){var z=function(C){if(t.detect("isIE")||t.detect("isIEolder")){if(s[C].type=="select-one"){return s[C].options[s[C].selectedIndex].value}return s[C].value}return s[C].value};var A=function(C,D){if(t.detect("isIE")||t.detect("isIEolder")){if(s[C].type=="select-one"){s[C].options[s[C].selectedIndex].value=D}s[C].value=D}else{s[C].value=D}};if(s[0]===undefined){return""}if(B!==undefined){A(0,B)}else{if(o>1){var y=[];for(i=0;i<o;i++){y.push(z(i))}return y}return z(0)}},focus:function(){for(var y=o;y--;){s[y].focus()}},attr:function(y,z,B){var A=[];var C=function(){if(z!==undefined){C=function(){for(var D=o;D--;){if(y==="class"){if(B){s[D].className=s[D].className+" "+z}else{s[D].className=z}}else{s[D].setAttribute(y,z)}}}}else{C=function(){for(var D=o;D--;){if(y==="class"){A.push(s[D].className)}else{A.push(s[D].getAttribute(y))}}return A}}return C()};return C()||this},ready:function(y){t.list_def.push(y);t.d.onreadystatechange=function(){if(t.d.readyState=="complete"){var z=t.list_def.length;for(var A=0;A<z;A++){var B=t.list_def[A];B()}return this}}},index:function(z){if(z!==undefined){for(var y=o;y>=0;y--){if(s[y]===z){break}}return y}},filter:function(y){var A={":odd":function(B){return(B%2!==0)?true:false},":even":function(B){return(B%2===0)?true:false}};if(typeof y==="string"&&typeof A[y]==="function"){for(var z=o;z--;){!A[y](z)&&s.splice(z,1)}}else{if(typeof y==="function"){for(var z=o;z--;){!y(z)&&s.splice(z,1)}}}o=s.length;return this},removeClass:function(D){var A,z,F,C=false;if(D===":all"){D=undefined;var C=true}if(D!==undefined&&typeof D==="string"){var B=new RegExp("(\\s|^)"+D+"(\\s|$)");for(A=o;A--;){F=s[A].className.replace(B,"");s[A].className=F}}else{for(A=o;A--;){s[A].className="";if(C){var E=s[A].childNodes,y=E.length;if(y>0){(function(K,H){for(var J=H;J--;){K[J].className="";var G=K[J].childNodes,I=G.length;if(I>0){arguments.callee(G,I)}}})(E,y)}}}}return this}};(function r(){var y;for(y in x){if(o){s[y]=x[y]}else{s[y]=function(){return""}}}if(typeof(tiramisu.modules.get.methods)!=="undefined"){for(y in tiramisu.modules.get.methods){for(method in tiramisu.modules.get.methods[y]){if(o){s[method]=tiramisu.modules.get.methods[y][method]}else{s[method]=function(){return""}}}}}})();tiramisu.get.results=s;tiramisu.get.selector=w;return s};tiramisu.modules.get.methods=tiramisu.modules.get.methods||{};tiramisu.modules.detect=function(d){var b=[1],a=2;var c=navigator.userAgent,g=navigator.appName;var f={browser:function(){if(g==="Netscape"){var j=c.substring(c.indexOf("Firefox"));if(j.split("/")[0]!=="Firefox"){return"webkit"}else{firefox_version=parseInt(j.split("/")[1].split(".")[0]);if(firefox_version>3.8){return"f4+"}return"f3"}}else{if(g=="Opera"){var h=c.substring(c.indexOf("Version")).split("/")[1];if(h.split(".")[1]>49){return"o10.5+"}return"o10.4"}else{if(/MSIE (\d+\.\d+);/.test(c)){var k=new Number(RegExp.$1);if(k>8){return"ie9+"}else{if(k==8){return"ie8"}}return"ie7"}else{return"other"}}}},isIE:function(){return this.browser()==="ie9+"||this.browser()==="ie8"||this.browser()==="ie7"},isIEolder:function(){return this.browser()==="ie8"||this.browser()==="ie7"},isFirefox:function(){return this.browser()==="f3"||this.browser()==="f4+"},isWebkit:function(){return this.browser()==="webkit"},color:function(){if(this.isIEolder()){return false}return true}};return f[d]()};tiramisu.modules.local_event={};tiramisu.modules.get.methods.event={ingredients:[1],cups_of_coffee:5,on:function(b,a){if(arguments.length>2){return""}var f=1,d=[],g=[];if(typeof(b)==="string"){d[0]=b;g[0]=a}else{if(typeof(b)==="object"){if(typeof(b[0])==="string"){d=b;g[0]=a}else{for(key in b){f=d.push(key);g.push(b[key])}}}}for(var c=f;c--;){var a=g[c];for(i=this.length;i--;){add_handler(this[i],d[c],a)}if(typeof selector==="string"){t.local_event[selector]={};t.local_event[selector]={cb:a,element:this}}}return this},off:function(c){if(arguments.length>1){return""}if(typeof selector==="string"){if(t.local_event[selector]!==undefined){var b=t.local_event[selector]["cb"],d=t.local_event[selector]["element"],a=d.length;for(i=a;i--;){remove_handler(tiramisu.get.results[i],c,b)}delete t.local_event[selector]}}return this},};var add_handler=function(b,c,a){if(b.addEventListener){add_handler=function(f,g,d){f.addEventListener(g,d,false)}}else{add_handler=function(f,g,d){f.attachEvent("on"+g,d)}}add_handler(b,c,a)};var remove_handler=function(b,c,a){if(b.removeEventListener){remove_handler=function(f,g,d){f.removeEventListener(g,d,false)}}else{remove_handler=function(f,g,d){f.detachEvent("on"+g,d)}}remove_handler(b,c,a)};