(this.webpackJsonpboardgames=this.webpackJsonpboardgames||[]).push([[6],{589:function(e,r,n){"use strict";n.d(r,"a",(function(){return l}));var t=n(52),a=n(1),l={STRIP_SECRETS:function(e,r,n){var l=Object(a.a)({},e);return void 0!==l.secret&&delete l.secret,l.players&&(l.players=Object(t.a)({},n,l.players[n])),l}}},590:function(e,r,n){"use strict";n.r(r),n.d(r,"isMoveInvalid",(function(){return h}));var t=n(12),a=n(52),l=n(1),s=n(3),u=n(589),i=n(200),c=["key","tower","moon"],d=[1,2,3,4,5,6,7,8,9,10,11],o="0",p="1";function y(e){for(var r,n=e.random.Shuffle(c.map((function(e){return d.map((function(r){return{suit:e,rank:r}}))})).flat()),t=[Object(l.a)(Object(l.a)({},n.pop()),{},{turn:0})],s=[],u=[],i=0;i<13;i++)s.push(n.pop()),u.push(n.pop());return{secret:{deck:n},tricks:[],trumps:t,players:(r={},Object(a.a)(r,o,{hand:s,stashed:null}),Object(a.a)(r,p,{hand:u,stashed:null}),r)}}function f(e,r){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,a=r.currentPlayer,s=a===o?p:o,u=Object(t.a)(e.players[a].hand),i=null==n?Object(l.a)({},e.players[a].stashed):u[n];return{opponentID:s,playerID:a,hand:u,card:i}}function v(e){var r=e.length;return(r<=3?6:4===r?1:5===r?2:6===r?3:r>=7&&r<=9?6:0)+e.map((function(e){return e.cards})).flat().filter((function(e){return 7===e.rank})).length}function h(e,r){for(var n=arguments.length,t=new Array(n>2?n-2:0),a=2;a<n;a++)t[a-2]=arguments[a];if(t.length>2)return"played_too_many_cards";var l=t[0],s=t[1],u=f(e,r,l),c=u.playerID,d=u.hand,o=u.card;if(null==l&&null==e.players[c].stashed)return"played_no_card";if(null==o)return"played_unknown_card";if(r.activePlayers&&"discard"===r.activePlayers[c])return null!=s?"discarded_extra_card":void 0;if(null!=s){if(3!==o.rank)return"played_extra_card";if(null==d[s])return"played_unknown_extra_card"}if(null!=e.played){var p=Object(i.g)(d,l).some((function(r){return r.suit===e.played.suit}));if(o.suit!==e.played.suit&&p)return"must_follow_suit";var y=d.filter((function(r){return r.suit===e.played.suit})).map((function(e){return e.rank})).reduce((function(e,r){return e<r?r:e}),-1);if(11===e.played.rank&&1!==o.rank&&o.rank!==y&&-1!==y)return"must_follow_11"}}function b(e,r,n){var t,a=f(e,r,n),l=a.playerID,s=a.opponentID,u=a.card,c=Object(i.c)(e.trumps).suit,d=u.rank,o=u.suit,p=e.played.rank,y=e.played.suit;return 9!==d&&9!==p||9===d&&9===p||(9===d?o=c:9===p&&(y=c)),{winner:t=o===c&&y!==c?l:o!==c&&y===c||o!==y?s:d>p?l:s,next:1===p&&t!==s?s:1===d&&t!==l?l:t}}function g(e,r){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;if(h(e,r,n,a))return s.t;var u=f(e,r,n),c=u.playerID,d=u.opponentID,g=u.hand,m=u.card;if(3===m.rank&&null!=a){var j=Object(l.a)({},Object(i.c)(e.trumps));e.trumps.push(Object(l.a)(Object(l.a)({},g[a]),{},{turn:r.turn})),g[a]=j}var O=Object(i.g)(g,n);if(5===m.rank&&null==e.players[c].stashed&&0!==O.length){var k=e.secret.deck.pop();return e.players[c].hand=[].concat(Object(t.a)(O),[k]),e.players[c].stashed=m,void r.events.setStage("discard")}if(null==e.played)return e.players[c].stashed=null,e.players[c].hand=O,e.played=m,void r.events.endTurn();var w=b(e,r,n),_=w.winner,I=w.next;if(e.tricks.push({winner:_,cards:[Object(l.a)(Object(l.a)({},e.played),{},{playerID:d}),Object(l.a)(Object(l.a)({},m),{},{playerID:c})]}),e.played=null,e.players[c].stashed=null,e.players[c].hand=O,0===O.length){for(var S=function(){var r=P[D],n=v(e.tricks.filter((function(e){return e.winner===r})));e.scores[r].push(n)},D=0,P=[c,d];D<P.length;D++)S();var x=y(r);e.history.push(e.tricks),e.secret=x.secret,e.tricks=x.tricks,e.trumps=x.trumps,e.players=x.players,I=e.startingPlayer===o?p:o,e.startingPlayer=I}r.events.endTurn({next:I})}var m={name:"the-vole-in-the-valley",minPlayers:2,maxPlayers:2,setupDataSchema:{required:[],properties:{longGame:{title:"Long game",type:"boolean"}}},setup:function(e,r){var n;return Object(l.a)(Object(l.a)({},y(e)),{},{played:null,scores:(n={},Object(a.a)(n,o,[]),Object(a.a)(n,p,[]),n),history:[],startingPlayer:o,winningScore:(null===r||void 0===r?void 0:r.longGame)?21:16})},moves:{playCard:{move:g,client:!1}},turn:{stages:{discard:{moves:{discardCard:{move:function(e,r,n){var t=f(e,r),a=t.playerID,l=t.hand;e.players[a].hand=Object(i.g)(l,n),r.events.endStage(),g(e,r)},client:!1}}}}},endIf:function(e,r){var n=f(e,r),t=n.playerID,a=n.opponentID,l=e.scores[t],s=e.scores[a],u=Object(i.h)(l),c=Object(i.h)(s);if(!(u<e.winningScore&&c<e.winningScore))return u>c?{winner:t}:c>u?{winner:a}:Object(i.c)(l)>Object(i.c)(s)?{winner:t}:{winner:a}},playerView:u.a.STRIP_SECRETS,events:{endStage:!1,endTurn:!1,endPhase:!1,endGame:!1,setStage:!1,setPhase:!1,setActivePlayers:!1},disableUndo:!0};r.default=m}}]);
//# sourceMappingURL=6.2f6289fe.chunk.js.map