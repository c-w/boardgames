(this.webpackJsonpboardgames=this.webpackJsonpboardgames||[]).push([[1],{200:function(e,t,a){"use strict";a.d(t,"c",(function(){return c})),a.d(t,"e",(function(){return s})),a.d(t,"h",(function(){return i})),a.d(t,"g",(function(){return u})),a.d(t,"b",(function(){return l})),a.d(t,"a",(function(){return o})),a.d(t,"f",(function(){return b})),a.d(t,"d",(function(){return j}));var n=a(12),r=a(28);function c(e){return e[e.length-1]}function s(e,t){var a,n={true:[],false:[]},c=Object(r.a)(e);try{for(c.s();!(a=c.n()).done;){var s=a.value;n[t(s)].push(s)}}catch(i){c.e(i)}finally{c.f()}return n}function i(e){return e.reduce((function(e,t){return e+t}),0)}function u(e,t){return e.filter((function(e,a){return a!==t}))}function l(e){return Math.floor(Math.random()*Math.floor(e))}function o(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return Object(n.a)(new Set(t))}function b(e){for(var t=Array(e),a=0;a<e;a++)t[a]=a;return t}function j(e){for(var t=[],a=0;a<e.length;a++)for(var n=a+1;n<e.length;n++)t.push([e[a],e[n]]);return t}},576:function(e,t){},583:function(e,t,a){},584:function(e,t,a){},587:function(e,t,a){"use strict";a.r(t);var n=a(21),r=a(6),c=a(0),s=a(287),i=a.n(s),u=a(1),l=a(58),o=a(20),b=a(201),j=a.n(b),d=a(5),m=a.n(d),O=a(44),h=a(11),f=a(12),p=a(305),_=a(199);function v(){return Object(r.jsx)("div",{className:"loading",children:Object(r.jsx)("span",{children:"Loading"})})}var g={REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS:Number(Object({NODE_ENV:"production",PUBLIC_URL:"https://justamouse.com/boardgames/soaring-cities",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_FRONTEND_ROOT:"https://justamouse.com/boardgames",REACT_APP_BUILD_TARGET_NAME:"Soaring Cities",REACT_APP_BUILD_TARGET_DESCRIPTION:"A set collection card game for 2 players",REACT_APP_BUILD_TARGET:"soaring-cities",REACT_APP_SERVER_URL:"https://justamouse.azurewebsites.net",REACT_APP_BUILD_TARGET_THEME_COLOR:"#000000",REACT_APP_BUILD_TARGET_VIEWPORT_MIN_WIDTH:"400",REACT_APP_BUILD_TARGET_BACKGROUND_COLOR:"#FDECCE"}).REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS)||2e3,REACT_APP_SERVER_URL:"https://justamouse.azurewebsites.net"},x=a(200),R={required:["playerName"],properties:{playerName:{title:"Enter your name",type:"string",minLength:1},unlisted:{title:"Unlisted",type:"boolean"}}};function E(e){var t=e.setupDataSchema||{required:[],properties:{}};return{type:"object",required:[].concat(Object(f.a)(R.required),Object(f.a)(t.required)),properties:Object(u.a)(Object(u.a)({playerName:R.properties.playerName},t.properties),{},{unlisted:R.properties.unlisted})}}function y(e){return"".concat(e,"-formData")}function A(e){var t=e.game,a=Object(c.useState)(null),s=Object(n.a)(a,2),i=s[0],u=s[1],l=Object(o.g)(),b=Object(c.useCallback)((function(){u(null)}),[u]),j=Object(c.useCallback)(function(){var e=Object(h.a)(m.a.mark((function e(a,n){var r,c,s,i,o,b,j,d,h,f;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=a.formData,n.preventDefault(),localStorage.setItem(y(t.name),JSON.stringify(r)),c=r.playerName,s=r.unlisted,i=r.numPlayers,o=Object(O.a)(r,["playerName","unlisted","numPlayers"]),i=i||t.maxPlayers,b=new p.a({server:g.REACT_APP_SERVER_URL}),e.prev=6,e.next=9,b.createMatch(t.name,{numPlayers:i,setupData:o,unlisted:s});case 9:return j=e.sent,d=j.matchID,h=Object(x.b)(i),e.next=14,b.joinMatch(t.name,d,{playerID:"".concat(h),playerName:c});case 14:f=e.sent,l.push("/wait/".concat(d,"/").concat(h,"/").concat(f.playerCredentials)),e.next=21;break;case 18:e.prev=18,e.t0=e.catch(6),"HTTP status 400"===e.t0.message?u("Invalid game configuration"):(u("Unexpected error"),console.error(e.t0));case 21:case"end":return e.stop()}}),e,null,[[6,18]])})));return function(t,a){return e.apply(this,arguments)}}(),[t,l]),d=E(t),f=JSON.parse(localStorage.getItem(y(t.name)));return Object(r.jsx)(_.a,{schema:d,onSubmit:j,onChange:b,formData:f,children:Object(r.jsx)("input",{type:"submit",value:i||"Create game",disabled:null!=i})})}function T(e){var t=e.game,a=e.matchID,s=Object(c.useState)(null),i=Object(n.a)(s,2),l=i[0],b=i[1],j=Object(c.useState)(null),d=Object(n.a)(j,2),O=d[0],f=d[1],x=Object(o.g)();Object(c.useEffect)((function(){new p.a({server:g.REACT_APP_SERVER_URL}).getMatch(t.name,a).then((function(e){return f(e)}))}),[t,a]);var R=Object(c.useCallback)(function(){var e=Object(h.a)(m.a.mark((function e(a,n){var r,c,s,i,u;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(c=a.formData,n.preventDefault(),localStorage.setItem(y(t.name),JSON.stringify(c)),s=new p.a({server:g.REACT_APP_SERVER_URL}),null!=(i=null===(r=O.players.find((function(e){return null==e.name})))||void 0===r?void 0:r.id)){e.next=8;break}return b("The game is already full"),e.abrupt("return");case 8:return e.prev=8,e.next=11,s.joinMatch(t.name,O.matchID,{playerID:"".concat(i),playerName:c.playerName});case 11:u=e.sent,x.push("/wait/".concat(O.matchID,"/").concat(i,"/").concat(u.playerCredentials)),e.next=18;break;case 15:e.prev=15,e.t0=e.catch(8),"HTTP status 409"===e.t0.message?b("The game is already full"):"HTTP status 404"===e.t0.message?b("The game no longer exists"):(b("Unexpected error"),console.error(e.t0));case 18:case"end":return e.stop()}}),e,null,[[8,15]])})));return function(t,a){return e.apply(this,arguments)}}(),[t,O,x]);if(null==O)return Object(r.jsx)(v,{});var A=E(t),T=Object.fromEntries(Object.keys(A.properties).filter((function(e){return"playerName"!==e})).map((function(e){return[e,{"ui:disabled":!0}]}))),P=Object(u.a)(Object(u.a)(Object(u.a)({},JSON.parse(localStorage.getItem(y(t.name)))),O.setupData),{},{unlisted:O.unlisted,numPlayers:O.players.length});return Object(r.jsx)(_.a,{schema:A,onSubmit:R,formData:P,uiSchema:T,className:"rjsf disabled",children:Object(r.jsx)("input",{type:"submit",value:l||"Join game",disabled:null!=l})})}function P(e){return null==e.matchID?Object(r.jsx)(A,Object(u.a)({},e)):Object(r.jsx)(T,Object(u.a)({},e))}var S=a(308),C=a(136);function N(e){var t=e.game,a=e.board,n=Object(O.a)(e,["game","board"]),c=Object(S.a)({game:t,board:a,multiplayer:Object(C.b)({server:g.REACT_APP_SERVER_URL}),debug:!1,loading:v});return Object(r.jsx)(c,Object(u.a)({},n))}var I=a(135),D=a.n(I);function w(){return Object(r.jsx)(l.b,{to:"/new",className:"create-game",children:"Create a new game"})}function L(e){var t=e.game,a=Object(c.useState)(null),s=Object(n.a)(a,2),i=s[0],u=s[1];if(D()(Object(c.useCallback)(Object(h.a)(m.a.mark((function e(){var a,n;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=new p.a({server:g.REACT_APP_SERVER_URL}),e.next=3,a.listMatches(t.name);case 3:n=e.sent,u(n.matches);case 5:case"end":return e.stop()}}),e)}))),[t,u]),g.REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS),null==i)return Object(r.jsx)(v,{});var o=i.filter((function(e){return e.players.some((function(e){return null==e.name}))}));return 0===o.length?Object(r.jsxs)("div",{className:"matches",children:["There are currently no games waiting for players. ",Object(r.jsx)(w,{})]}):Object(r.jsxs)("div",{className:"matches",children:[Object(r.jsx)(w,{})," or join one of the games below:",Object(r.jsx)("ul",{children:o.map((function(e){var t;return Object(r.jsx)("li",{children:Object(r.jsxs)(l.b,{to:"/join/".concat(e.matchID),children:["Join game by ",(null===(t=e.players.find((function(e){return e.name})))||void 0===t?void 0:t.name)||"unknown"]})},e.matchID)}))})]})}function U(e){var t=e.rules;return Object(r.jsx)("div",{className:"rules",dangerouslySetInnerHTML:{__html:t}})}var k=a(307);a(583);function M(e){var t=e.game,a=e.matchID,s=e.playerID,i=e.credentials,u=Object(c.useState)({isReady:!1,isLoading:!0}),l=Object(n.a)(u,2),b=l[0],j=l[1],d=Object(c.useState)(!1),O=Object(n.a)(d,2),f=O[0],_=O[1],x=Object(o.g)();D()(Object(c.useCallback)(Object(h.a)(m.a.mark((function e(){var n,r,c;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=new p.a({server:g.REACT_APP_SERVER_URL}),e.next=3,n.getMatch(t.name,a);case 3:r=e.sent,c=r.players.every((function(e){return null!=e.name})),j({isLoading:!1,isReady:c});case 6:case"end":return e.stop()}}),e)}))),[t,a,j]),g.REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS);var R=Object(c.useCallback)((function(e){e.target.select()}),[]),E=Object(c.useCallback)((function(){_(!0)}),[_]);if(b.isLoading)return Object(r.jsx)(v,{"data-v-54622b55":""});if(b.isReady)return Object(r.jsx)(o.a,{to:"/play/".concat(a,"/").concat(s,"/").concat(i),"data-v-54622b55":""});var y=x.createHref({pathname:"/join/".concat(a)});return Object(r.jsx)("div",{className:"wait","data-v-54622b55":"",children:Object(r.jsxs)("label",{"data-v-54622b55":"",children:["Invite someone to join the game by sharing this URL:",Object(r.jsx)(k.CopyToClipboard,{text:y,onCopy:E,"data-v-54622b55":"",children:Object(r.jsx)("div",{className:"url","data-v-54622b55":"",children:Object(r.jsx)("textarea",{readOnly:!0,value:y,onFocus:R,"data-v-54622b55":""})})}),f&&Object(r.jsx)("div",{className:"callout","data-v-54622b55":"",children:Object(r.jsx)("em",{"data-v-54622b55":"",children:"Copied to clipboard"})})]})})}function H(e){var t=e.gameName,a=e.showHelp,n=e.children,c=navigator.userAgent.toLowerCase(),s=c.includes("android"),i=c.includes("safari")&&!c.includes("chrome");return Object(r.jsxs)("main",{className:j()(t,{android:s,safari:i}),children:[n,!1!==a&&Object(r.jsx)(l.b,{className:"help",to:"/rules",target:"_blank",children:Object(r.jsx)("span",{children:"View rules"})})]})}function F(e){var t=e.game.name;return Object(r.jsx)(l.a,{children:Object(r.jsxs)(o.d,{children:[Object(r.jsx)(o.b,{exact:!0,path:"/",children:function(){return Object(r.jsx)(o.a,{to:"/join"})}}),Object(r.jsx)(o.b,{exact:!0,path:"/new",children:function(){return Object(r.jsx)(H,{gameName:t,children:Object(r.jsx)(P,Object(u.a)({},e))})}}),Object(r.jsx)(o.b,{exact:!0,path:"/rules",children:function(){return Object(r.jsx)(H,{gameName:t,showHelp:!1,children:Object(r.jsx)(U,Object(u.a)({},e))})}}),Object(r.jsx)(o.b,{exact:!0,path:"/join",children:function(){return Object(r.jsx)(H,{gameName:t,children:Object(r.jsx)(L,Object(u.a)({},e))})}}),Object(r.jsx)(o.b,{exact:!0,path:"/join/:matchID",children:function(a){var n=a.match;return Object(r.jsx)(H,{gameName:t,children:Object(r.jsx)(P,Object(u.a)(Object(u.a)({},n.params),e))})}}),Object(r.jsx)(o.b,{exact:!0,path:"/wait/:matchID/:playerID/:credentials",children:function(a){var n=a.match;return Object(r.jsx)(H,{gameName:t,children:Object(r.jsx)(M,Object(u.a)(Object(u.a)({},n.params),e))})}}),Object(r.jsx)(o.b,{exact:!0,path:"/play/:matchID/:playerID/:credentials",children:function(a){var n=a.match;return Object(r.jsx)(H,{gameName:t,children:Object(r.jsx)(N,Object(u.a)(Object(u.a)({},n.params),e))})}})]})})}a(584);var G=function(e){switch(e){case"the-vole-in-the-valley":return[a.e(7).then(a.bind(null,590)),a.e(12).then(a.t.bind(null,596,7)),a.e(4).then(a.bind(null,597)),a.e(10).then(a.t.bind(null,591,7))];case"sashimi-express":return[a.e(9).then(a.bind(null,594)),a.e(14).then(a.t.bind(null,598,7)),a.e(5).then(a.bind(null,599)),a.e(11).then(a.t.bind(null,592,7))];case"soaring-cities":return[a.e(8).then(a.bind(null,593)),a.e(13).then(a.t.bind(null,600,7)),Promise.all([a.e(0),a.e(6)]).then(a.bind(null,601)),a.e(0).then(a.t.bind(null,595,7))];default:throw new Error("Unhandled game name: ".concat(e))}}("soaring-cities");Promise.all(G).then((function(e){var t=Object(n.a)(e,4),a=t[0],s=t[1],u=t[2];t[3];i.a.render(Object(r.jsx)(c.StrictMode,{children:Object(r.jsx)(F,{board:u.default,game:a.default,rules:s.default})}),document.getElementById("root"))}))}},[[587,2,3]]]);
//# sourceMappingURL=main.e63806c4.chunk.js.map