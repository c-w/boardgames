(this.webpackJsonpboardgames=this.webpackJsonpboardgames||[]).push([[4,7,10],{589:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var a=n(52),r=n(1),c={STRIP_SECRETS:function(e,t,n){var c=Object(r.a)({},e);return void 0!==c.secret&&delete c.secret,c.players&&(c.players=Object(a.a)({},n,c.players[n])),c}}},590:function(e,t,n){"use strict";n.r(t),n.d(t,"isMoveInvalid",(function(){return O}));var a=n(12),r=n(52),c=n(1),s=n(3),i=n(589),l=n(200),d=["key","tower","moon"],u=[1,2,3,4,5,6,7,8,9,10,11],o="0",p="1";function j(e){for(var t,n=e.random.Shuffle(d.map((function(e){return u.map((function(t){return{suit:e,rank:t}}))})).flat()),a=[Object(c.a)(Object(c.a)({},n.pop()),{},{turn:0})],s=[],i=[],l=0;l<13;l++)s.push(n.pop()),i.push(n.pop());return{secret:{deck:n},tricks:[],trumps:a,players:(t={},Object(r.a)(t,o,{hand:s,stashed:null}),Object(r.a)(t,p,{hand:i,stashed:null}),t)}}function h(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,r=t.currentPlayer,s=r===o?p:o,i=Object(a.a)(e.players[r].hand),l=null==n?Object(c.a)({},e.players[r].stashed):i[n];return{opponentID:s,playerID:r,hand:i,card:l}}function b(e){var t=e.length;return(t<=3?6:4===t?1:5===t?2:6===t?3:t>=7&&t<=9?6:0)+e.map((function(e){return e.cards})).flat().filter((function(e){return 7===e.rank})).length}function O(e,t){for(var n=arguments.length,a=new Array(n>2?n-2:0),r=2;r<n;r++)a[r-2]=arguments[r];if(a.length>2)return"played_too_many_cards";var c=a[0],s=a[1],i=h(e,t,c),d=i.playerID,u=i.hand,o=i.card;if(null==c&&null==e.players[d].stashed)return"played_no_card";if(null==o)return"played_unknown_card";if(t.activePlayers&&"discard"===t.activePlayers[d])return null!=s?"discarded_extra_card":void 0;if(null!=s){if(3!==o.rank)return"played_extra_card";if(null==u[s])return"played_unknown_extra_card"}if(null!=e.played){var p=Object(l.g)(u,c).some((function(t){return t.suit===e.played.suit}));if(o.suit!==e.played.suit&&p)return"must_follow_suit";var j=u.filter((function(t){return t.suit===e.played.suit})).map((function(e){return e.rank})).reduce((function(e,t){return e<t?t:e}),-1);if(11===e.played.rank&&1!==o.rank&&o.rank!==j&&-1!==j)return"must_follow_11"}}function f(e,t,n){var a,r=h(e,t,n),c=r.playerID,s=r.opponentID,i=r.card,d=Object(l.c)(e.trumps).suit,u=i.rank,o=i.suit,p=e.played.rank,j=e.played.suit;return 9!==u&&9!==p||9===u&&9===p||(9===u?o=d:9===p&&(j=d)),{winner:a=o===d&&j!==d?c:o!==d&&j===d||o!==j?s:u>p?c:s,next:1===p&&a!==s?s:1===u&&a!==c?c:a}}function y(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;if(O(e,t,n,r))return s.t;var i=h(e,t,n),d=i.playerID,u=i.opponentID,y=i.hand,m=i.card;if(3===m.rank&&null!=r){var v=Object(c.a)({},Object(l.c)(e.trumps));e.trumps.push(Object(c.a)(Object(c.a)({},y[r]),{},{turn:t.turn})),y[r]=v}var x=Object(l.g)(y,n);if(5===m.rank&&null==e.players[d].stashed&&0!==x.length){var k=e.secret.deck.pop();return e.players[d].hand=[].concat(Object(a.a)(x),[k]),e.players[d].stashed=m,void t.events.setStage("discard")}if(null==e.played)return e.players[d].stashed=null,e.players[d].hand=x,e.played=m,void t.events.endTurn();var g=f(e,t,n),w=g.winner,N=g.next;if(e.tricks.push({winner:w,cards:[Object(c.a)(Object(c.a)({},e.played),{},{playerID:u}),Object(c.a)(Object(c.a)({},m),{},{playerID:d})]}),e.played=null,e.players[d].stashed=null,e.players[d].hand=x,0===x.length){for(var D=function(){var t=I[S],n=b(e.tricks.filter((function(e){return e.winner===t})));e.scores[t].push(n)},S=0,I=[d,u];S<I.length;S++)D();var _=j(t);e.history.push(e.tricks),e.secret=_.secret,e.tricks=_.tricks,e.trumps=_.trumps,e.players=_.players,N=e.startingPlayer===o?p:o,e.startingPlayer=N}t.events.endTurn({next:N})}var m={name:"the-vole-in-the-valley",minPlayers:2,maxPlayers:2,setupDataSchema:{required:[],properties:{longGame:{title:"Long game",type:"boolean"}}},setup:function(e,t){var n;return Object(c.a)(Object(c.a)({},j(e)),{},{played:null,scores:(n={},Object(r.a)(n,o,[]),Object(r.a)(n,p,[]),n),history:[],startingPlayer:o,winningScore:(null===t||void 0===t?void 0:t.longGame)?21:16})},moves:{playCard:{move:y,client:!1}},turn:{stages:{discard:{moves:{discardCard:{move:function(e,t,n){var a=h(e,t),r=a.playerID,c=a.hand;e.players[r].hand=Object(l.g)(c,n),t.events.endStage(),y(e,t)},client:!1}}}}},endIf:function(e,t){var n=h(e,t),a=n.playerID,r=n.opponentID,c=e.scores[a],s=e.scores[r],i=Object(l.h)(c),d=Object(l.h)(s);if(!(i<e.winningScore&&d<e.winningScore))return i>d?{winner:a}:d>i?{winner:r}:Object(l.c)(c)>Object(l.c)(s)?{winner:a}:{winner:r}},playerView:i.a.STRIP_SECRETS,events:{endStage:!1,endTurn:!1,endPhase:!1,endGame:!1,setStage:!1,setPhase:!1,setActivePlayers:!1},disableUndo:!0};t.default=m},591:function(e,t,n){},597:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return b}));var a=n(12),r=n(21),c=n(6),s=n(0),i=n(20),l=n(201),d=n.n(l),u=n(590),o=n(200),p=(n(591),{1:"If you play this and lose the trick, you lead the next trick.",3:"When you play this, you may exchange the trump card with a card from your hand.",5:"When you play this, draw 1 card. Then discard any 1 card.",7:"The winner of the trick receives 1 point for each 7 in the trick.",9:"When determining the winner of a trick with only one 9, treat the 9 as if it were in the trump suit.",11:"When you lead this, if your opponent has a card of this suit, they must play either the 1 of this suit or their highest ranked card of this suit."});function j(e){var t=e.card,n=e.compact,a=e.won,r=e.isNew,s=e.isOld;return Object(c.jsx)("span",{className:d()("card",t.suit,{won:a,new:r,old:s}),children:Object(c.jsxs)("span",{className:d()("content",{compact:n}),children:[Object(c.jsx)("span",{className:"rank",children:t.rank}),Object(c.jsx)("span",{className:"suit",children:t.suit})]})})}function h(e){var t=e.card,n=Object(s.useState)((null===t||void 0===t?void 0:t.rank)%2===1),a=Object(r.a)(n,2),i=a[0],l=a[1],d=Object(s.useCallback)((function(){l(!1)}),[l]);return t&&i?Object(c.jsx)("aside",{onClick:d,children:p[t.rank]}):null}function b(e){var t=e.G,n=e.ctx,l=e.playerID,p=e.moves,b=e.matchData,O=Object(i.g)(),f=Object(s.useState)([]),y=Object(r.a)(f,2),m=y[0],v=y[1],x=Object(s.useState)(!1),k=Object(r.a)(x,2),g=k[0],w=k[1],N=function(e){return function(t){t.target.checked?v([].concat(Object(a.a)(m),[e])):v(m.filter((function(t){return t!==e})))}},D=function(e){return!!S&&(!!m.includes(e)||(I?0===m.length:!u.isMoveInvalid.apply(void 0,[t,n].concat(Object(a.a)(m),[e]))))},S=l===n.currentPlayer,I=n.activePlayers&&"discard"===n.activePlayers[l],_=0!==m.length,P=0===t.tricks.length&&t.history.length>0,T=t.players[l],C=b.find((function(e){return e.id!==Number(l)})),E=C.id.toString(),W=t.tricks.filter((function(e){return e.winner===l})).length,Y=t.tricks.filter((function(e){return e.winner!==l})).length,G=Object(o.c)(t.trumps),R=G.turn>0&&n.turn-G.turn<=1?t.trumps[t.trumps.length-2]:null,H=P&&g?Object(o.c)(Object(o.c)(t.history)):t.tricks.length>=1?Object(o.c)(t.tricks):null,A=m.length>0?T.hand[m[0]]:null;Object(s.useEffect)((function(){P&&w(!0)}),[w,P]);var J,L=T.hand.map((function(e,t){return{card:e,i:t}})).sort((function(e,t){return e.card.suit===t.card.suit?e.card.rank-t.card.rank:e.card.suit.localeCompare(t.card.suit)})),M=function(e){var a,r,s=e.showHistory,i=void 0!==s&&s,d=e.hideTricks,u=void 0!==d&&d;return Object(c.jsxs)("div",{className:"stats",children:[Object(c.jsxs)("div",{className:"score",children:[Object(c.jsx)("span",{className:"label",children:"Your score"}),Object(c.jsx)("span",{children:Object(o.h)(t.scores[l])}),i&&Object(c.jsxs)("span",{children:["(+ ",Object(o.c)(t.scores[l]),")"]}),(null===(a=n.gameover)||void 0===a?void 0:a.winner)===l&&Object(c.jsx)("span",{children:Object(c.jsx)("span",{role:"img","aria-label":"You won",children:"\ud83d\udc51"})})]}),Object(c.jsxs)("div",{className:"score",children:[Object(c.jsxs)("span",{className:"label",children:[C.name," score"]}),Object(c.jsx)("span",{children:Object(o.h)(t.scores[E])}),i&&Object(c.jsxs)("span",{children:["(+ ",Object(o.c)(t.scores[E]),")"]}),(null===(r=n.gameover)||void 0===r?void 0:r.winner)===E&&Object(c.jsx)("span",{children:Object(c.jsx)("span",{role:"img","aria-label":"".concat(C.name," won"),children:"\ud83d\udc51"})})]}),!u&&Object(c.jsxs)("div",{className:"tricks",children:[Object(c.jsx)("span",{className:"label",children:"Your tricks"}),Object(c.jsx)("span",{children:W})]}),!u&&Object(c.jsxs)("div",{className:"tricks",children:[Object(c.jsxs)("span",{className:"label",children:[C.name," tricks"]}),Object(c.jsx)("span",{children:Y})]})]})};return n.gameover?Object(c.jsxs)("form",{onSubmit:function(e){e.preventDefault(),O.push("/new")},className:"end-of-game",children:[Object(c.jsx)(M,{showHistory:!0,hideTricks:!0}),Object(c.jsx)("input",{type:"submit",value:"Play again"})]}):g?Object(c.jsxs)("form",{onSubmit:function(e){e.preventDefault(),w(!1)},className:"end-of-round",children:[Object(c.jsx)(M,{showHistory:!0,hideTricks:!0}),Object(c.jsx)("input",{type:"submit",value:"Continue"})]}):(J=S&&I?"Discard card":S&&_?"Play card":S?"Your move!":"Waiting for ".concat(C.name,"\u2026"),Object(c.jsxs)("form",{onSubmit:I?function(e){e.preventDefault(),p.discardCard.apply(p,Object(a.a)(m)),v([])}:function(e){e.preventDefault(),p.playCard.apply(p,Object(a.a)(m)),v([])},className:d()({disabled:!S}),children:[Object(c.jsxs)("div",{className:"board",children:[Object(c.jsxs)("div",{className:"info",children:[Object(c.jsx)(M,{}),Object(c.jsxs)("div",{className:"current-trick",children:[Object(c.jsx)("input",{className:d()({active:S,picked:_}),type:"submit",disabled:!S||!_,value:J}),(t.played||T.stashed)&&Object(c.jsxs)("div",{className:"played",children:[Object(c.jsx)("div",{className:"label",children:S&&!I?"".concat(C.name," played"):"You played"}),Object(c.jsx)(j,{card:t.played||T.stashed})]})]}),Object(c.jsxs)("div",{className:"history",children:[Object(c.jsxs)("div",{className:"trump",children:[Object(c.jsx)("span",{className:"label",children:"Trump"}),R&&Object(c.jsx)(j,{card:R,compact:!0,isOld:!0}),Object(c.jsx)(j,{card:G,compact:!0})]}),H&&Object(c.jsxs)("div",{className:"last-trick",children:[Object(c.jsx)("span",{className:"label",children:"Last"}),Object(c.jsx)(j,{card:H.cards[0],compact:!0,won:H.winner===H.cards[0].playerID}),Object(c.jsx)(j,{card:H.cards[1],compact:!0,won:H.winner===H.cards[1].playerID})]})]})]}),Object(c.jsx)("ol",{className:"hand",children:L.map((function(e){var t=e.card,n=e.i;return Object(c.jsx)("li",{children:Object(c.jsxs)("label",{children:[Object(c.jsx)("input",{type:"checkbox",onChange:N(n),disabled:!D(n),checked:m.includes(n)}),Object(c.jsx)(j,{card:t,isNew:I&&n===L.length-1})]})},"".concat(t.rank,"-").concat(t.suit))}))})]}),Object(c.jsx)(h,{card:A},"".concat(null===A||void 0===A?void 0:A.suit,"-").concat(null===A||void 0===A?void 0:A.rank))]}))}}}]);
//# sourceMappingURL=4.6c1bf2fd.chunk.js.map