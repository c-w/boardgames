(this.webpackJsonpboardgames=this.webpackJsonpboardgames||[]).push([[7],{589:function(e,r,n){"use strict";n.d(r,"a",(function(){return c}));var t=n(52),a=n(1),c={STRIP_SECRETS:function(e,r,n){var c=Object(a.a)({},e);return void 0!==c.secret&&delete c.secret,c.players&&(c.players=Object(t.a)({},n,c.players[n])),c}}},593:function(e,r,n){"use strict";n.r(r),n.d(r,"isBet",(function(){return O})),n.d(r,"toOrdinal",(function(){return h})),n.d(r,"scoreSuit",(function(){return j})),n.d(r,"canPlayCardToBoard",(function(){return m})),n.d(r,"canPlayCardToDiscard",(function(){return _})),n.d(r,"canDrawCardFromDeck",(function(){return k})),n.d(r,"canDrawCardFromDiscard",(function(){return g}));var t=n(52),a=n(12),c=n(1),u=n(3),d=n(589),i=n(200),s=["yellow","blue","white","green","red"],o=[-1,-2,-3],l=[2,3,4,5,6,7,8,9,10],f="0",p="1";function O(e){return o.includes(e.rank)}function h(e){return 100*(s.indexOf(e.suit)+1)+e.rank}function b(e){for(var r=0,n=[f,p];r<n.length;r++){var t=n[r],a=Object.values(Object.values(e.played[t])),c=Object(i.h)(a.map((function(e){return j(e)})));e.scores[t].push(c)}var u=Object(i.h)(e.scores[0]),d=Object(i.h)(e.scores[1]);e.turnOrder=u>d?[f,p]:d>u?[p,f]:[e.turnOrder[1],e.turnOrder[0]]}function v(e,r){return Object(c.a)(Object(c.a)({},e),function(e){for(var r,n,c=e.random.Shuffle(s.flatMap((function(e){return[].concat(Object(a.a)(l.map((function(r){return{suit:e,rank:r}}))),Object(a.a)(o.map((function(r){return{suit:e,rank:r}}))))}))),u=[],d=[],i=0;i<8;i++)u.push(c.pop()),d.push(c.pop());var O=function(){return Object.fromEntries(s.map((function(e){return[e,[]]})))};return{secret:{deck:c},players:(r={},Object(t.a)(r,f,{hand:u}),Object(t.a)(r,p,{hand:d}),r),played:(n={},Object(t.a)(n,f,O()),Object(t.a)(n,p,O()),n),discarded:O(),deckSize:c.length}}(r))}function j(e){if(0===e.length)return 0;var r=Object(i.e)(e,(function(e){return O(e)})),n=r.true,t=r.false,a=n.length;return(Object(i.h)(t.map((function(e){return e.rank})))-20)*(a+1)+(e.length>=8?20:0)}function y(e,r,n){return e.players[r.currentPlayer].hand.findIndex((function(e){var r=e.rank,t=e.suit;return r===n.rank&&t===n.suit}))}function m(e,r,n){if(-1===y(e,r,n))return"card_not_in_player_hand";var t=Object(i.c)(e.played[r.currentPlayer][n.suit]);return null!=t&&!O(t)&&n.rank<t.rank?"card_out_of_order":void 0}function _(e,r,n){if(-1===y(e,r,n))return"card_not_in_player_hand"}function k(e,r){if(0===e.deckSize)return"deck_empty"}function g(e,r,n){if(!s.includes(n))return"unknown_discard_pile";var t=Object(i.c)(e.discarded[n]);return null==t?"cannot_draw_from_empty_discard_pile":t.turn===r.turn?"cannot_draw_just_discarded_card":void 0}var P={name:"soaring-cities",minPlayers:2,maxPlayers:2,setup:function(){var e;return{scores:(e={},Object(t.a)(e,f,[]),Object(t.a)(e,p,[]),e),turnOrder:[f,p]}},moves:{playCardToBoard:{move:function(e,r,n){if(null!=m(e,r,n))return u.t;var t=y(e,r,n);e.players[r.currentPlayer].hand.splice(t,1),e.played[r.currentPlayer][n.suit].push(Object(c.a)(Object(c.a)({},n),{},{turn:r.turn})),r.events.setStage("drawCard")},client:!1},playCardToDiscard:{move:function(e,r,n){if(null!=_(e,r,n))return u.t;var t=y(e,r,n);e.players[r.currentPlayer].hand.splice(t,1),e.discarded[n.suit].push(Object(c.a)(Object(c.a)({},n),{},{turn:r.turn})),r.events.setStage("drawCard")},client:!1}},turn:{onBegin:function(e){return Object(c.a)(Object(c.a)({},e),{},{deckSize:e.secret.deck.length})},order:u.k.CUSTOM_FROM("turnOrder"),stages:{drawCard:{moves:{drawCardFromDeck:{move:function(e,r){if(null!=k(e))return u.t;var n=e.secret.deck.pop();e.players[r.currentPlayer].hand.push(n),r.events.endTurn(),0===e.secret.deck.length&&r.events.endPhase()},client:!1},drawCardFromDiscard:{move:function(e,r,n){if(null!=g(e,r,n))return u.t;var t=e.discarded[n].pop();e.players[r.currentPlayer].hand.push(t),r.events.endTurn()},client:!1}}}}},phases:Object.fromEntries(Object(i.f)(3).map((function(e){return["Round ".concat(e+1),{start:0===e,next:2===e?void 0:"Round ".concat(e+2),onBegin:v,onEnd:b}]}))),endIf:function(e,r){if(null==r.phase){var n=Object(i.h)(e.scores[0]),t=Object(i.h)(e.scores[1]);return{winner:n>t?f:t>n?p:"tied"}}},playerView:d.a.STRIP_SECRETS,events:{endStage:!1,endTurn:!1,endPhase:!1,endGame:!1,setStage:!1,setPhase:!1,setActivePlayers:!1},disableUndo:!0};r.default=P}}]);
//# sourceMappingURL=7.cfdc8683.chunk.js.map