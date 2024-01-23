(()=>{var t={564:()=>{},556:()=>{}},i={};function e(n){var s=i[n];if(void 0!==s)return s.exports;var h=i[n]={exports:{}};return t[n](h,h.exports,e),h.exports}(()=>{"use strict";var t=e(564);let i,n=!1;function s(){let t=!1;const i=this.cellWidth,e=this.cellHeight;for(let n=0;n<2*this.width;n+=1){for(let s=0;s<2*this.height;s+=1)this.ctx.fillStyle=t?"#999999":"#666666",this.ctx.fillRect(n*(i/2),s*(e/2),i/2,e/2),t=!t;t=!t}}function h(){if(this.cursor.x<0||this.cursor.y<0)return;const t=this.cellWidth,i=this.cellHeight;for(const{x:e,y:n}of this.line_approx(this.cursor.x,this.cursor.y))this.ctx.globalAlpha=.8,this.ctx.fillStyle=this.palette[this.colour],this.ctx.fillRect(e*t+t/4,n*i,t/2,i),this.ctx.fillRect(e*t,n*i+i/4,t,i/2),this.ctx.globalAlpha=1}function o(){const t=this.cellWidth,i=this.cellHeight;this.ctx.strokeStyle=this.gridColour;for(let e=0;e<this.width;e+=1)this.ctx.beginPath(),this.ctx.moveTo(e*t+.5,0),this.ctx.lineTo(e*t+.5,i*this.height),this.ctx.stroke();for(let e=0;e<this.height;e+=1)this.ctx.beginPath(),this.ctx.moveTo(0,e*i+.5),this.ctx.lineTo(t*this.width,e*i+.5),this.ctx.stroke()}function r(t=1,i){const e=this.cellWidth,n=this.cellHeight,s=i??this.ctx;for(let i=0;i<this.height;i+=1)for(let h=0;h<this.width;h+=1)s.fillStyle=this.palette[this.painting[i][h]]??"rgba(0,0,0,0)",s.fillRect(h*e*t,i*n*t,e*t,n*t)}function l(){this.background?this.drawBackground():this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.drawPainting(),this.drawCursor(),this.grid&&this.drawGrid(),this.drawing&&window.requestAnimationFrame(this.boundDraw)}function c(t){const i=this.width,e=this.height,n=this.cellWidth,s=this.cellHeight,h=this.canvas.getBoundingClientRect(),o=t.pageX-h.left-window.scrollX,r=t.pageY-h.top-window.scrollY;this.cursor.x=Math.floor(o/i*(i/n)),this.cursor.y=Math.floor(r/e*(e/s))}function a(t){const i=t.action.bind(t),e=t.applyTool.bind(t),n=t.compareChanges.bind(t),s=t.draw.bind(t),h=c.bind(t);return{pointermove(e){e.preventDefault(),h(e),t.isApplied&&i()},pointerdown(i){var n;0===i.button&&(h(i),t.oldPainting=(n=t.painting,JSON.parse(JSON.stringify(n))),e(!0))},pointerup(i){0===i.button&&t.isApplied&&(e(!1),n())},pointerenter(){t.drawing||(t.drawing=!0,s())},pointerout(){t.drawing=!1}}}function d(){n&&(Object.keys(this.events).forEach((t=>{this.canvas.addEventListener(t,this.events[t],!1)})),window.addEventListener("pointerup",this.events.pointerup,!1),window.addEventListener("resize",this.resizeEvent,!1))}function p(){n&&(Object.keys(this.events).forEach((t=>{this.canvas.removeEventListener(t,this.events[t],!1)})),window.removeEventListener("pointerup",this.events.pointerup,!1),window.removeEventListener("resize",this.resizeEvent,!1))}("undefined"==typeof process||"browser"===process?.title)&&(n=!0),i=n?function(t,i){const e=document.createElement("canvas");return e.width=t||300,e.height=i||150,e}:function(i,e){return t.make(i||300,e||150)};var u=e(556);function g(e="painting.png",s=1){const h=i(this.width*this.cellWidth,this.height*this.cellHeight),o=h.getContext("2d");return null===o?(console.error("<GridPaint>#save() -> Could not get 2d Context."),Promise.reject("<GridPaint>#save() -> Could not get 2d Context.")):(this.drawPainting(s,o),n?":blob:"===e?new Promise((t=>{h.toBlob((i=>{t(i)}),"image/png")})):(h.toBlob((t=>{if(null===t)return console.error("<GridPaint>#save() -> Blob should not be null!"),Promise.reject("<GridPaint>#save() -> Blob should not be null!");!function(t,i){const e=globalThis.URL||globalThis.webkitURL,n=document.createElementNS("http://www.w3.org/1999/xhtml","a");n.download=i,n.rel="noopener",n.href=e.createObjectURL(t),setTimeout((function(){e.revokeObjectURL(n.href)}),4e4),setTimeout((function(){!function(t){try{t.dispatchEvent(new MouseEvent("click"))}catch(i){const e=document.createEvent("MouseEvents");e.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),t.dispatchEvent(e)}}(n)}),0)}(t,e)}),"image/png"),Promise.resolve(null)):async function(i){const e=new u.PassThrough,n=[];return e.on("data",(t=>n.push(t))),e.once("end",(function(){})),await t.encodePNGToStream(i,e),Buffer.concat(n)}(o.bitmap))}function f(t,i,e){const n=this.colour;i=void 0!==i?i:this.cursor.x,e=void 0!==e?e:this.cursor.y,t=void 0!==t?t:this.painting[e][i];const s=[{x:i,y:e}];for(;0!==s.length;){const{x:i,y:e}=s.pop();t!==n&&this.painting[e][i]===t&&(this.painting[e][i]=n,e+1<this.height&&s.push({x:i,y:e+1}),e-1>-1&&s.push({x:i,y:e-1}),i+1<this.width&&s.push({x:i+1,y:e}),i-1>-1&&s.push({x:i-1,y:e}))}}function w(t=!1){this.oldPainting=this.painting.splice(0,this.painting.length);for(let t=0;t<this.height;++t){this.painting.push([]);for(let i=0;i<this.width;++i)this.painting[t].push(0)}t&&(this.oldPainting=this.painting),this.line(!0),this.compareChanges()}function v(t,i){if(t!==i){"string"==typeof t&&(t=this.palette.indexOf(t)),"string"==typeof i&&(i=this.palette.indexOf(i)),this.oldPainting=this.painting.splice(0,this.painting.length);for(let e=0;e<this.height;e+=1){this.painting.push([]);for(let n=0;n<this.width;n+=1){const s=this.oldPainting[e][n];this.painting[e].push(s===t?i:s)}}this.compareChanges()}}const m={x:-1,y:-1};function y(){return-1===m.x||-1===m.y}function x(t=-1,i=-1){m.x=t,m.y=i}function*b(t,i){if(y())yield{x:t,y:i};else{let e=m.x,n=m.y;const s=t,h=i,o=Math.abs(s-e),r=Math.abs(h-n),l=e<s?1:-1,c=n<h?1:-1;let a=o-r;for(;e!==s||n!==h;){yield{x:e,y:n};const t=a<<1;t>-r&&(a-=r,e+=l),t<o&&(a+=o,n+=c)}yield{x:e,y:n}}}function C(t){if(t)return x();if(y())x(this.cursor.x,this.cursor.y);else{for(const{x:t,y:i}of b(this.cursor.x,this.cursor.y))this.painting[i][t]=this.colour;x()}}function E(t,i){if(0===t.length)return;const e=t.pop();if(null==e)return;const n=e.length,s=e[0].length;i.push(this.painting.splice(0,this.painting.length)),this.painting=e,n!==this.height&&(this.height=n,this.canvas.height=this.height*this.cellHeight),s!==this.width&&(this.width=s,this.canvas.width=this.width*this.cellWidth)}function k(t){this.isApplied=void 0!==t?t:!this.isApplied,this.isApplied&&this.action()}function H(){var t;this.oldPainting.length===this.painting.length&&this.painting.every(((t,i)=>t.toString()===this.oldPainting[i].toString()))||(this.undoHistory.push((t=this.oldPainting,JSON.parse(JSON.stringify(t)))),this.undoHistory.splice(0,this.undoHistory.length-64),this.redoHistory.length=0)}function P(){const t=this.cursor.x,i=this.cursor.y;t>=0&&t<this.width&&i>=0&&i<this.height&&(this.painting[i][t]=this.colour)}function W(){E.apply(this,[this.redoHistory,this.undoHistory])}function T(){E.apply(this,[this.undoHistory,this.redoHistory])}function A(t=0,i=0){this.canvas.width=this.width*(t||this.cellWidth),this.canvas.height=this.height*(i||this.cellHeight),this.cellWidth=t||this.cellWidth,this.cellHeight=i||this.cellHeight}function S(t=0,i=0){const e=t||this.width,n=i||this.height,s=this.width,h=e-s,o=n-this.height;if(0!==h||0!==o){if(this.width=e,this.height=n,this.canvas.width=this.width*this.cellWidth,this.canvas.height=this.height*this.cellHeight,this.oldPainting=this.painting.splice(0,this.painting.length),o>-1){const t=o/2|0,i=o/2+(1&o)|0;for(let i=0;i<t;++i)this.painting.push(Array.from({length:s},(()=>0)));this.painting=this.painting.concat(this.oldPainting.map((t=>Array.from(t,(t=>t)))));for(let t=0;t<i;++t)this.painting.push(Array.from({length:s},(()=>0)))}else{const t=-o/2|0,i=-o/2+(1&o)|0;this.painting=this.painting.concat(this.oldPainting.map((t=>Array.from(t,(t=>t))))),this.painting.splice(0,t),this.painting.splice(-i,i)}if(h>-1){const t=h/2|0,i=h/2+(1&h)|0;this.painting=this.painting.map((e=>Array.from({length:t},(()=>0)).concat(e).concat(Array.from({length:i},(()=>0)))))}else{const t=-h/2|0,i=-h/2+(1&h)|0;this.painting.forEach((e=>{e.splice(0,t),e.splice(-i,i)}))}this.compareChanges(),this.draw()}}function z(){if(!n)return;if(!this.canvas.parentElement)return;const t=this.origCellW*this.width,i=this.cellWidth/this.cellHeight,e=this.canvas.parentElement.clientWidth,s=this.canvas.width;if(s>e){const t=e/this.width,n=t/i;this.resize(t,n)}else if(s<t&&e<t){const t=e/this.width,n=t/i;this.resize(t,n)}else t>s&&t<e&&this.resize(this.origCellW,this.origCellH);this.drawing||this.draw()}const O=["transparent","#fff","#c0c0c0","#808080","#000","#f00","#800","#ff0","#808000","#0f0","#080","#0ff","#008080","#00f","#000080","#f0f","#800080"],R=16,B=new class{width=R;height=R;cellWidth=R;cellHeight=R;origCellW=R;origCellH=R;canvas;ctx;background=!0;grid=!1;outline=!1;isApplied=!1;drawing=!1;colour=0;gridColour="#000";palette=O;cursor={x:-1,y:-1};painting=[[]];oldPainting=[[]];redoHistory=[];undoHistory=[];events;resizeEvent;tool="pencil";boundDraw;constructor(t){void 0!==t.width&&(this.width=t.width),void 0!==t.height&&(this.height=t.height),void 0!==t.cellWidth&&(this.cellWidth=t.cellWidth),void 0!==t.cellHeight&&(this.cellHeight=t.cellHeight),void 0!==t.outline&&(this.outline=t.outline),void 0!==t.palette&&t.palette.length>0&&(this.palette=t.palette),this.canvas=i(this.width*this.cellWidth,this.height*this.cellHeight);const e=this.canvas.getContext("2d");if(null===e)throw new Error("Could not get 2d context");this.ctx=e,this.events=a(this),this.resizeEvent=this.fitToWindow.bind(this),n&&(this.canvas.className="gridpaint-canvas",this.canvas.style.cursor="crosshair",this.canvas.style.touchAction="none",this.canvas.style.imageRendering="pixelated",this.outline&&(this.canvas.style.outlineStyle="solid",this.canvas.style.outlineWidth="2px")),this.boundDraw=this.draw.bind(this),this.clear(!0)}init(){this.attachHandlers(),this.fitToWindow(),this.draw()}destroy(){this.detachHandlers(),this.drawing=!1}setTool(t){this.tool=t,this.line(!0)}action(){switch(this.tool){case"pencil":return this.pencil();case"bucket":return this.bucket();case"line":return this.line();default:console.error("<GridPaint>#action() warning: Unknown tool selected: "+this.tool)}}singleAction(t){switch(this.line(!0),t){case"undo":return this.undo();case"redo":return this.redo();case"clear":return this.clear();default:console.error("<GridPaint>#singleAction() warning: Unknown tool to invoke: "+t)}}bucket=f;clear=w;pencil=P;line=C;redo=W;undo=T;applyTool=k;line_approx=b;replace=v;compareChanges=H;drawBackground=s;drawCursor=h;drawGrid=o;drawPainting=r;draw=l;saveAs=g;attachHandlers=d;detachHandlers=p;resize=A;resizePainting=S;fitToWindow=z}({width:40,height:20});let L,G,N,M,j;document.body.appendChild(B.canvas),L=document.createElement("div"),L.style.marginBottom="6px",B.palette.forEach((function(t,i){const e=document.createElement("button");"transparent"!==t?e.style.backgroundColor=t:(e.style.backgroundImage="\n          linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999 100%),\n          linear-gradient(-45deg, #999 25%, #666 25%, #666 75%, #999 75%, #999 100%)\n        ",e.style.backgroundSize="0.5em 0.5em"),e.style.border="1px solid #000",e.style.marginRight="4px",e.style.color="white",e.innerText=" ",e.title="switch to "+t,e.onclick=function(){B.colour=i,B.drawing||B.draw()},L.appendChild(e)})),document.body.appendChild(L),L=document.createElement("div"),G=["pencil","line","bucket","undo","redo","clear","saveAs"],G.forEach((function(t){const i=document.createElement("button");i.innerText=t,i.onclick=function(){switch(t){case"pencil":case"line":case"bucket":B.setTool(t);break;case"undo":case"redo":case"clear":B.singleAction(t),B.drawing||B.draw();break;case"saveAs":B.saveAs()}},L.appendChild(i)})),document.body.appendChild(L),L=document.createElement("div"),N=document.createElement("select"),M=document.createElement("select"),j=document.createElement("button"),j.innerText="replace",j.onclick=function(){const t=document.getElementsByTagName("select");B.replace(t[0].value,t[1].value),B.drawing||B.draw()},B.palette.forEach((function(t){const i=new Option(t),e=new Option(t);i.style.backgroundColor=t,e.style.backgroundColor=t,N.appendChild(i),M.appendChild(e)})),L.appendChild(N),L.appendChild(M),L.appendChild(j),document.body.appendChild(L),L=document.createElement("div");const U=document.createElement("p"),D=document.createElement("input"),J=document.createElement("p"),X=document.createElement("input"),Y=document.createElement("button");U.innerText="width ",U.style="display: inline-block; margin: 0; padding: 0;",D.value=B.width.toString(),D.type="number",J.innerText=" height ",J.style="display: inline-block; margin: 0; padding: 0;",X.value=B.height.toString(),X.type="number",Y.innerText="resize",Y.onclick=function(){const t=+D.value,i=+X.value;B.resizePainting(t,i)},L.appendChild(U),L.appendChild(D),L.appendChild(J),L.appendChild(X),L.appendChild(Y),document.body.appendChild(L),B.init()})()})();