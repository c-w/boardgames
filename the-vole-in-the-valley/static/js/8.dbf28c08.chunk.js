(this.webpackJsonpboardgames=this.webpackJsonpboardgames||[]).push([[8],{589:function(e,r,n){"use strict";n.d(r,"a",(function(){return c}));var t=n(52),a=n(1),c={STRIP_SECRETS:function(e,r,n){var c=Object(a.a)({},e);return void 0!==c.secret&&delete c.secret,c.players&&(c.players=Object(t.a)({},n,c.players[n])),c}}},593:function(e,r,n){"use strict";n.r(r),n.d(r,"isBet",(function(){return b})),n.d(r,"toOrdinal",(function(){return h})),n.d(r,"scoreSuit",(function(){return y})),n.d(r,"canPlayCardToBoard",(function(){return m})),n.d(r,"canPlayCardToDiscard",(function(){return _})),n.d(r,"canDrawCardFromDeck",(function(){return k})),n.d(r,"canDrawCardFromDiscard",(function(){return g}));var t=n(52),a=n(12),c=n(1),u=n(21),i=n(3),d=n(589),s=n(200),o=["yellow","blue","white","green","red"],l=[-1,-2,-3],f=[2,3,4,5,6,7,8,9,10],p="0",v="1";function b(e){return l.includes(e.rank)}function h(e){return 100*(o.indexOf(e.suit)+1)+e.rank}function y(e){if(0===e.length)return 0;var r=Object(s.e)(e,(function(e){return b(e)})),n=r.true,t=r.false,a=n.length;return(Object(s.h)(t.map((function(e){return e.rank})))-20)*(a+1)+(e.length>=8?20:0)}function O(e){for(var r,n,c=e.random.Shuffle(o.flatMap((function(e){return[].concat(Object(a.a)(f.map((function(r){return{suit:e,rank:r}}))),Object(a.a)(l.map((function(r){return{suit:e,rank:r}}))))}))),u=[],i=[],d=0;d<8;d++)u.push(c.pop()),i.push(c.pop());var s=function(){return Object.fromEntries(o.map((function(e){return[e,[]]})))};return{secret:{deck:c},players:(r={},Object(t.a)(r,p,{hand:u}),Object(t.a)(r,v,{hand:i}),r),played:(n={},Object(t.a)(n,p,s()),Object(t.a)(n,v,s()),n),discarded:s(),deckSize:c.length}}function j(e,r,n){return e.players[r.currentPlayer].hand.findIndex((function(e){var r=e.rank,t=e.suit;return r===n.rank&&t===n.suit}))}function m(e,r,n){if(-1===j(e,r,n))return"card_not_in_player_hand";var t=Object(s.c)(e.played[r.currentPlayer][n.suit]);return null!=t&&!b(t)&&n.rank<t.rank?"card_out_of_order":void 0}function _(e,r,n){if(-1===j(e,r,n))return"card_not_in_player_hand"}function k(e,r){if(0===e.deckSize)return"deck_empty"}function g(e,r,n){if(!o.includes(n))return"unknown_discard_pile";var t=Object(s.c)(e.discarded[n]);return null==t?"cannot_draw_from_empty_discard_pile":t.turn===r.turn?"cannot_draw_just_discarded_card":void 0}var P={name:"soaring-cities",minPlayers:2,maxPlayers:2,setup:function(e){var r;return Object(c.a)({scores:(r={},Object(t.a)(r,p,[]),Object(t.a)(r,v,[]),r),round:0},O(e))},moves:{playCardToBoard:{move:function(e,r,n){if(null!=m(e,r,n))return i.t;var t=j(e,r,n);e.players[r.currentPlayer].hand.splice(t,1),e.played[r.currentPlayer][n.suit].push(Object(c.a)(Object(c.a)({},n),{},{turn:r.turn})),r.events.setStage("drawCard")},client:!1},playCardToDiscard:{move:function(e,r,n){if(null!=_(e,r,n))return i.t;var t=j(e,r,n);e.players[r.currentPlayer].hand.splice(t,1),e.discarded[n.suit].push(Object(c.a)(Object(c.a)({},n),{},{turn:r.turn})),r.events.setStage("drawCard")},client:!1}},turn:{onBegin:function(e){return Object(c.a)(Object(c.a)({},e),{},{deckSize:e.secret.deck.length})},stages:{drawCard:{moves:{drawCardFromDeck:{move:function(e,r){if(null!=k(e))return i.t;var n=e.secret.deck.pop();if(e.players[r.currentPlayer].hand.push(n),0===e.secret.deck.length){var t=function(e,r){for(var n=0,t=[p,v];n<t.length;n++){var a=t[n],c=Object.values(Object.values(e.played[a])),i=Object(s.h)(c.map((function(e){return y(e)})));e.scores[a].push(i)}var d,o=Object(s.h)(e.scores[0]),l=Object(s.h)(e.scores[1]);d=o>l?p:l>o||r.currentPlayer===p?v:p,e.round++;for(var f=0,b=Object.entries(O(r));f<b.length;f++){var h=Object(u.a)(b[f],2),j=h[0],m=h[1];e[j]=m}return d}(e,r);r.events.endTurn({next:t})}else r.events.endTurn()},client:!1},drawCardFromDiscard:{move:function(e,r,n){if(null!=g(e,r,n))return i.t;var t=e.discarded[n].pop();e.players[r.currentPlayer].hand.push(t),r.events.endTurn()},client:!1}}}}},endIf:function(e){if(!(e.round<3)){var r=Object(s.h)(e.scores[0]),n=Object(s.h)(e.scores[1]);return{winner:r>n?p:n>r?v:"tied"}}},playerView:d.a.STRIP_SECRETS,events:{endStage:!1,endTurn:!1,endPhase:!1,endGame:!1,setStage:!1,setPhase:!1,setActivePlayers:!1},disableUndo:!0};r.default=P}}]);
//# sourceMappingURL=8.dbf28c08.chunk.js.map