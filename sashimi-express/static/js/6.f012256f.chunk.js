(this.webpackJsonpboardgames=this.webpackJsonpboardgames||[]).push([[6,8],{589:function(e,r,n){"use strict";n.d(r,"a",(function(){return c}));var t=n(52),a=n(1),c={STRIP_SECRETS:function(e,r,n){var c=Object(a.a)({},e);return void 0!==c.secret&&delete c.secret,c.players&&(c.players=Object(t.a)({},n,c.players[n])),c}}},593:function(e,r,n){"use strict";n.r(r),n.d(r,"isBet",(function(){return p})),n.d(r,"toOrdinal",(function(){return h})),n.d(r,"scoreSuit",(function(){return f})),n.d(r,"canPlayCardToBoard",(function(){return x})),n.d(r,"canPlayCardToDiscard",(function(){return k})),n.d(r,"canDrawCardFromDeck",(function(){return y})),n.d(r,"canDrawCardFromDiscard",(function(){return C}));var t=n(52),a=n(12),c=n(1),s=n(21),d=n(3),i=n(589),l=n(200),u=["yellow","blue","white","green","red"],o=[-1,-2,-3],j=[2,3,4,5,6,7,8,9,10],b="0",O="1";function p(e){return o.includes(e.rank)}function h(e){return 100*(u.indexOf(e.suit)+1)+e.rank}function f(e){if(0===e.length)return 0;var r=Object(l.e)(e,(function(e){return p(e)})),n=r.true,t=r.false,a=n.length;return(Object(l.h)(t.map((function(e){return e.rank})))-20)*(a+1)+(e.length>=8?20:0)}function m(e){for(var r,n,c=e.random.Shuffle(u.flatMap((function(e){return[].concat(Object(a.a)(j.map((function(r){return{suit:e,rank:r}}))),Object(a.a)(o.map((function(r){return{suit:e,rank:r}}))))}))),s=[],d=[],i=0;i<8;i++)s.push(c.pop()),d.push(c.pop());var l=function(){return Object.fromEntries(u.map((function(e){return[e,[]]})))};return{secret:{deck:c},players:(r={},Object(t.a)(r,b,{hand:s}),Object(t.a)(r,O,{hand:d}),r),played:(n={},Object(t.a)(n,b,l()),Object(t.a)(n,O,l()),n),discarded:l(),deckSize:c.length}}function v(e,r,n){return e.players[r.currentPlayer].hand.findIndex((function(e){var r=e.rank,t=e.suit;return r===n.rank&&t===n.suit}))}function x(e,r,n){if(-1===v(e,r,n))return"card_not_in_player_hand";var t=Object(l.c)(e.played[r.currentPlayer][n.suit]);return null!=t&&!p(t)&&n.rank<t.rank?"card_out_of_order":void 0}function k(e,r,n){if(-1===v(e,r,n))return"card_not_in_player_hand"}function y(e,r){if(0===e.deckSize)return"deck_empty"}function C(e,r,n){if(!u.includes(n))return"unknown_discard_pile";var t=Object(l.c)(e.discarded[n]);return null==t?"cannot_draw_from_empty_discard_pile":t.turn===r.turn?"cannot_draw_just_discarded_card":void 0}var g={name:"soaring-cities",minPlayers:2,maxPlayers:2,setup:function(e){var r;return Object(c.a)({scores:(r={},Object(t.a)(r,b,[]),Object(t.a)(r,O,[]),r),round:0},m(e))},moves:{playCardToBoard:{move:function(e,r,n){if(null!=x(e,r,n))return d.t;var t=v(e,r,n);e.players[r.currentPlayer].hand.splice(t,1),e.played[r.currentPlayer][n.suit].push(Object(c.a)(Object(c.a)({},n),{},{turn:r.turn})),r.events.setStage("drawCard")},client:!1},playCardToDiscard:{move:function(e,r,n){if(null!=k(e,r,n))return d.t;var t=v(e,r,n);e.players[r.currentPlayer].hand.splice(t,1),e.discarded[n.suit].push(Object(c.a)(Object(c.a)({},n),{},{turn:r.turn})),r.events.setStage("drawCard")},client:!1}},turn:{onBegin:function(e){return Object(c.a)(Object(c.a)({},e),{},{deckSize:e.secret.deck.length})},stages:{drawCard:{moves:{drawCardFromDeck:{move:function(e,r){if(null!=y(e))return d.t;var n=e.secret.deck.pop();if(e.players[r.currentPlayer].hand.push(n),0===e.secret.deck.length){var t=function(e,r){for(var n=0,t=[b,O];n<t.length;n++){var a=t[n],c=Object.values(Object.values(e.played[a])),d=Object(l.h)(c.map((function(e){return f(e)})));e.scores[a].push(d)}var i,u=Object(l.h)(e.scores[0]),o=Object(l.h)(e.scores[1]);i=u>o?b:o>u||r.currentPlayer===b?O:b,e.round++;for(var j=0,p=Object.entries(m(r));j<p.length;j++){var h=Object(s.a)(p[j],2),v=h[0],x=h[1];e[v]=x}return i}(e,r);r.events.endTurn({next:t})}else r.events.endTurn()},client:!1},drawCardFromDiscard:{move:function(e,r,n){if(null!=C(e,r,n))return d.t;var t=e.discarded[n].pop();e.players[r.currentPlayer].hand.push(t),r.events.endTurn()},client:!1}}}}},endIf:function(e){if(!(e.round<3)){var r=Object(l.h)(e.scores[0]),n=Object(l.h)(e.scores[1]);return{winner:r>n?b:n>r?O:"tied"}}},playerView:i.a.STRIP_SECRETS,events:{endStage:!1,endTurn:!1,endPhase:!1,endGame:!1,setStage:!1,setPhase:!1,setActivePlayers:!1},disableUndo:!0};r.default=g},601:function(e,r,n){"use strict";n.r(r),n.d(r,"default",(function(){return v}));var t=n(1),a=n(21),c=n(6),s=n(0),d=n(201),i=n.n(d),l=n(58),u=n(593),o=n(200);n(595);function j(e){var r=e.points,n=r<0?Object(c.jsx)(c.Fragment,{children:"\u2212"}):void 0,t=Math.abs(r);return Object(c.jsxs)("span",{className:"points",children:[n,"$",t,"M"]})}function b(e){var r=e.cards,n=e.scores,t=e.caption,s=e.playCard;return Object(c.jsxs)("div",{className:"played",children:[s,Object(c.jsxs)("label",{className:"description",children:[t,", ",Object(c.jsx)(j,{points:Object(o.h)(n)})]}),Object(c.jsx)("ul",{className:"content",children:Object.entries(r).map((function(e){var r=Object(a.a)(e,2),n=r[0],t=r[1];return Object(c.jsx)("li",{className:i()("suit",n,"cards-".concat(t.length)),children:Object(c.jsx)(h,{cards:t})},n)}))})]})}function O(e){var r=e.G,n=e.ctx,t=e.onPickSuit,d=e.pickedSuit,l=e.disabled,o=e.discardCard,j=e.drawCardFromDiscard,b=Object(s.useCallback)((function(e){var r=e.target.value;t(r)}),[t]);return Object(c.jsxs)("div",{className:"discarded",children:[o,Object(c.jsx)("label",{className:"description",children:"Discarded cards"}),Object(c.jsx)("ul",{children:Object.entries(r.discarded).map((function(e){var t=Object(a.a)(e,2),s=t[0],o=t[1],O="pickedSuit-".concat(s),p=s===d,f=!l&&null==Object(u.canDrawCardFromDiscard)(r,n,s);return Object(c.jsxs)("li",{className:i()("suit",s,"cards-".concat(o.length),{checked:p}),children:[s===d&&j,Object(c.jsx)(h,{cards:o}),Object(c.jsx)("input",{type:"radio",name:"pickedSuit",value:s,onChange:b,checked:p,disabled:!f,id:O}),Object(c.jsxs)("label",{htmlFor:O,className:i()({disabled:!f}),children:["Pick ",s]})]},s)}))})]})}function p(e){return Object(c.jsx)("span",{className:i()("card",e.suit),children:Object(c.jsx)("span",{className:"rank",children:Object(u.isBet)(e)?"bet":e.rank})})}function h(e){var r=e.cards,n=e.className;return Array.isArray(r)||(r=Object(o.f)(r).map((function(e){return{suit:"background",rank:-100*(e+1)}}))),Object(c.jsx)("ol",{className:i()("deck",n),children:r.map((function(e){return Object(c.jsx)("li",{children:Object(c.jsx)(p,Object(t.a)({},e))},Object(u.toOrdinal)(e))}))})}function f(e){var r=e.deckSize,n=e.round,a=e.drawCardFromDeck,d=e.cards,l=e.onPickCard,o=e.pickedCard,j=e.disabled,b=Object(s.useCallback)((function(e){var r=JSON.parse(e.target.value);l(r)}),[l]);return Object(c.jsxs)("div",{className:"hand",children:[Object(c.jsxs)("label",{className:"description",children:["Hand ",n+1]}),Object(c.jsxs)("div",{className:"content",children:[Object(c.jsxs)("div",{className:"drawpile",children:[a,Object(c.jsx)(h,{cards:r})]}),Object(c.jsx)("ul",{children:d.sort((function(e,r){return Object(u.toOrdinal)(e)-Object(u.toOrdinal)(r)})).map((function(e){var r="pickedCard-".concat(Object(u.toOrdinal)(e)),n=e.suit===(null===o||void 0===o?void 0:o.suit)&&e.rank===(null===o||void 0===o?void 0:o.rank);return Object(c.jsxs)("li",{className:i()({checked:n}),children:[Object(c.jsx)("input",{type:"radio",name:"pickedCard",value:JSON.stringify(e),onChange:b,checked:n,disabled:j,id:r}),Object(c.jsx)("label",{htmlFor:r,className:i()({disabled:j}),children:Object(c.jsx)(p,Object(t.a)({},e))})]},r)}))})]})]})}function m(e){var r=e.name,n=e.winner,t=e.scores;return Object(c.jsxs)("tr",{children:[Object(c.jsxs)("td",{children:[r,n&&Object(c.jsx)("span",{role:"img","aria-label":"Winner",children:"\ud83c\udfc6"})]}),t.map((function(e,r){return Object(c.jsx)("td",{children:Object(c.jsx)(j,{points:e})},r)})),Object(c.jsx)("td",{children:Object(c.jsx)(j,{points:Object(o.h)(t)})})]})}function v(e){var r=e.G,n=e.ctx,t=e.playerID,d=e.moves,j=e.matchData,p=Object(s.useState)(void 0),h=Object(a.a)(p,2),v=h[0],x=h[1],k=Object(s.useState)(void 0),y=Object(a.a)(k,2),C=y[0],g=y[1];Object(s.useEffect)((function(){x(void 0),g(void 0)}),[x,g,n.turn]);var w,P,S,N,D=j.find((function(e){return e.id!==Number(t)})),_=D.id.toString(),T=n.currentPlayer===t,F=n.activePlayers?n.activePlayers[t]:"playCard";if(n.gameover){var B=r.scores[t].length;return Object(c.jsxs)("div",{className:"gameover",children:[Object(c.jsxs)("table",{children:[Object(c.jsx)("thead",{children:Object(c.jsxs)("tr",{children:[Object(c.jsx)("th",{children:"Player"}),Object(o.f)(B).map((function(e){return Object(c.jsxs)("th",{children:["Round ",e+1]},e)})),Object(c.jsx)("th",{children:"Total"})]})}),Object(c.jsxs)("tbody",{children:[Object(c.jsx)(m,{name:"You",scores:r.scores[t],winner:n.gameover.winner===t}),Object(c.jsx)(m,{name:D.name,scores:r.scores[_],winner:n.gameover.winner===_})]})]}),Object(c.jsx)(l.b,{to:"/new",children:"Click to play another game"})]})}return T&&"playCard"===F&&null!=v?(w=Object(c.jsx)("button",{className:"action",onClick:function(){return d.playCardToBoard(v)},disabled:null!=Object(u.canPlayCardToBoard)(r,n,v),children:"Play card"}),P=Object(c.jsx)("button",{className:"action",onClick:function(){return d.playCardToDiscard(v)},disabled:null!=Object(u.canPlayCardToDiscard)(r,n,v),children:"Discard card"})):T&&"drawCard"===F&&(S=Object(c.jsx)("button",{className:"action",onClick:function(){return d.drawCardFromDeck()},disabled:null!=Object(u.canDrawCardFromDeck)(r,n),children:"Draw card"}),N=C&&Object(c.jsxs)("button",{className:"action",onClick:function(){return d.drawCardFromDiscard(C)},disabled:null!=Object(u.canDrawCardFromDiscard)(r,n,C),children:["Pick ",C]})),Object(c.jsxs)("div",{className:i()({waiting:!T}),children:[Object(c.jsx)(b,{cards:r.played[_],scores:r.scores[_],caption:"".concat(D.name,"'s projects")}),Object(c.jsx)(O,{G:r,ctx:n,onPickSuit:g,pickedSuit:C,disabled:!T||"drawCard"!==F,discardCard:P,drawCardFromDiscard:N}),Object(c.jsx)(b,{cards:r.played[t],scores:r.scores[t],caption:"Your projects",playCard:w}),Object(c.jsx)(f,{deckSize:r.deckSize,round:r.round,drawCardFromDeck:S,cards:r.players[t].hand,onPickCard:x,pickedCard:v,disabled:!T||"playCard"!==F})]})}}}]);
//# sourceMappingURL=6.f012256f.chunk.js.map