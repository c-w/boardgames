(this.webpackJsonpboardgames=this.webpackJsonpboardgames||[]).push([[4,6,8],{588:function(e,a,t){"use strict";t.d(a,"a",(function(){return c}));var n=t(50),r=t(1),c={STRIP_SECRETS:function(e,a,t){var c=Object(r.a)({},e);return void 0!==c.secret&&delete c.secret,c.players&&(c.players=Object(n.a)({},t,c.players[t])),c}}},591:function(e,a,t){},592:function(e,a,t){"use strict";t.r(a),t.d(a,"NIGIRIS",(function(){return S})),t.d(a,"ROLLS",(function(){return P})),t.d(a,"APPETIZERS",(function(){return w})),t.d(a,"SPECIALS",(function(){return I})),t.d(a,"DESSERTS",(function(){return R})),t.d(a,"scoreHand",(function(){return D})),t.d(a,"scoreCard",(function(){return T})),t.d(a,"getNumRound",(function(){return A}));var n=t(200),r=t(203),c=t(75),l=t(201);var u=t(1),o=t(20),i=t(27),s=t(11),m=t(3),f=t(588),p=t(199),d=2,b=8,v=["square","circle","triangle","rectangle"],y=["watermelon","pineapple","orange"],O=[].concat(Object(s.a)(Object(p.f)(2).map((function(e){return y.map((function(e){return[e,e]}))})).flat()),Object(s.a)(Object(p.f)(3).map((function(e){return Object(p.d)(y)})).flat())),E="Dessert",j="Appetizer",k="Rolls",g="Nigiri",h="Special",S={egg:"Egg",salmon:"Salmon",squid:"Squid"},P={maki:"Maki",temaki:"Temaki",uramaki:"Uramaki"},w={tempura:"Tempura",sashimi:"Sashimi",misoSoup:"Miso Soup",tofu:"Tofu",eel:"Eel",dumpling:"Dumpling",onigiri:"Onigiri",edamame:"Edamame"},I={wasabi:"Wasabi",tea:"Tea",soySauce:"Soy Sauce"},R={matchaIceCream:"Matcha Ice Cream",pudding:"Pudding",fruit:"Fruit"};function D(e,a,t){var n=Object(p.h)(e.map((function(n){return T(n,e,a,t)}))),r=a.some((function(e){return e.some((function(e){return e.name===R.fruit}))})),c=e.some((function(e){return e.name===R.fruit}));return r&&!c&&(n-=6),n}function T(e,a,t,n){if(e.scored)return 0;if(e.category===E&&3!==n)return 0;var r=function(a){return a.filter((function(a){return a.name===e.name}))},c=function(e){return Object(p.h)(r(e).map((function(e){return e.count})))},l=function(e){return p.a.apply(void 0,Object(s.a)(e.filter((function(e){return null==e.round})).map((function(e){return e.category})))).length},u=t.length+1,m=void 0,f=void 0,d=!1,b=0;switch(e.name){case S.egg:b=1;break;case S.salmon:b=2;break;case S.squid:b=3;break;case P.maki:var O=c(a),j=t.map((function(e){return c(e)})),k=p.a.apply(void 0,[O].concat(Object(s.a)(j))).sort().reverse(),h=k[0],D=k[1];if(u<=5)b=O===h?6:O===D?3:0;else{var C=k[2];b=O===h?6:O===D?4:O===C?2:0}d=!0;break;case P.temaki:var x=c(a),A=t.map((function(e){return c(e)})),L=p.a.apply(void 0,[x].concat(Object(s.a)(A))).sort().reverse(),N=L[0],M=Object(p.c)(L);x===N&&(b=4),u>2&&x===M&&(b=-4),d=!0;break;case P.uramaki:for(var U=[2,5,8],z=[a].concat(Object(s.a)(t)).map((function(e){return e.filter((function(e){return null==e.round}))})),Z=z[0].length,_=Object(p.f)(u).map((function(e){return[]})),q=0;q<Z;q++){for(var G=0;G<u;G++){var F=z[G][q];F.name===P.uramaki&&_[G].push(F.count)}for(var H=[],W=function(e){var a=Object(p.h)(_[e]);if(a>=10){var t=H.find((function(e){return e.numUramakis===a}));null==t?H.push({numUramakis:a,players:[e]}):t.players.push(e)}},J=0;J<u;J++)W(J);H.sort((function(e,a){return a.numUramakis-e.numUramakis}));for(var V=0,Y=H;V<Y.length;V++){var B,K=Y[V].players,Q=U.pop()||0,X=Object(i.a)(K);try{for(X.s();!(B=X.n()).done;){var $=B.value;0===$&&(b+=Q),_[$]=[]}}catch(Ve){X.e(Ve)}finally{X.f()}K.length>1&&U.pop()}}for(var ee=_.map((function(e,a){return{player:a,count:Object(p.h)(e)}})),ae=p.a.apply(void 0,Object(s.a)(ee.map((function(e){return e.count})))).sort();U.length>0&&ae.length>0;){var te,ne=U.pop(),re=ae.pop(),ce=Object(i.a)(ee);try{for(ce.s();!(te=ce.n()).done;){var le=te.value,ue=le.player;le.count===re&&0===ue&&(b+=ne)}}catch(Ve){ce.e(Ve)}finally{ce.f()}}d=!0;break;case w.tempura:m=2,f=5;break;case w.sashimi:m=3,f=10;break;case w.misoSoup:var oe=a.filter((function(e){return null==e.round})).indexOf(e);b=t.some((function(e){return e.filter((function(e){return null==e.round}))[oe].name===w.misoSoup}))?0:3;break;case w.tofu:var ie=r(a).length;1===ie?b=2:2===ie?b=6:ie>=3&&(b=0),d=!0;break;case w.eel:var se=r(a).length;1===se?b=-3:se>=2&&(b=7),d=!0;break;case w.dumpling:var me=r(a).length;1===me?b=1:2===me?b=3:3===me?b=6:4===me?b=10:me>=5&&(b=15),d=!0;break;case w.onigiri:var fe,pe=Object.fromEntries(v.map((function(e){return[e,0]}))),de=Object(i.a)(r(a));try{for(de.s();!(fe=de.n()).done;){pe[fe.value.variants[0]]++}}catch(Ve){de.e(Ve)}finally{de.f()}for(;;){var be=Object.entries(pe).filter((function(e){var a=Object(o.a)(e,2);a[0];return a[1]>0})).map((function(e){var a=Object(o.a)(e,2),t=a[0];a[1];return t})),ve=be.length;if(0===ve)break;4===ve?b+=16:3===ve?b+=9:2===ve?b+=4:1===ve&&(b+=1);var ye,Oe=Object(i.a)(be);try{for(Oe.s();!(ye=Oe.n()).done;){pe[ye.value]--}}catch(Ve){Oe.e(Ve)}finally{Oe.f()}}d=!0;break;case w.edamame:var Ee=t.filter((function(e){return r(e).length>0})).length;b=Math.min(4,Ee);break;case I.wasabi:var je=a.indexOf(e),ke=a.slice(je).filter((function(e){return!e.scored&&e.category===g}))[0];b=null==ke?0:3*T(ke,a,t,n);break;case I.tea:var ge,he={},Se=Object(i.a)(a);try{for(Se.s();!(ge=Se.n()).done;){var Pe=ge.value;he[Pe.category]=(he[Pe.category]||0)+1}}catch(Ve){Se.e(Ve)}finally{Se.f()}b=Math.max.apply(Math,Object(s.a)(Object.values(he)));break;case I.soySauce:var we=l(a),Ie=t.map((function(e){return l(e)})),Re=p.a.apply(void 0,[we].concat(Object(s.a)(Ie))).sort().reverse();we===Re[0]&&(b=4);break;case R.matchaIceCream:m=4,f=12;break;case R.pudding:var De=r(a).length,Te=t.map((function(e){return r(e).length})),Ce=p.a.apply(void 0,[De].concat(Object(s.a)(Te))).sort().reverse(),xe=Ce[0],Ae=Object(p.c)(Ce);De===xe&&(b=6),u>2&&De===Ae&&(b=-6),d=!0;break;case R.fruit:var Le,Ne=Object.fromEntries(y.map((function(e){return[e,0]}))),Me=Object(i.a)(r(a));try{for(Me.s();!(Le=Me.n()).done;){var Ue,ze=Le.value,Ze=Object(i.a)(ze.variants);try{for(Ze.s();!(Ue=Ze.n()).done;){Ne[Ue.value]++}}catch(Ve){Ze.e(Ve)}finally{Ze.f()}}}catch(Ve){Me.e(Ve)}finally{Me.f()}for(var _e=0,qe=Object.values(Ne);_e<qe.length;_e++){var Ge=qe[_e];0===Ge?b-=2:1===Ge?b+=0:2===Ge?b+=1:3===Ge?b+=3:4===Ge?b+=6:Ge>=5&&(b+=10)}d=!0;break;default:throw new Error("Unknown card: ".concat(e.name))}if(null!=f&&null!=m){var Fe=r(a);b=Math.floor(Fe.length/m)*f,d=!0}if(d){var He,We=r(a),Je=Object(i.a)(We);try{for(Je.s();!(He=Je.n()).done;){He.value.scored=!0}}catch(Ve){Je.e(Ve)}finally{Je.f()}}else e.scored=!0;return b}function C(e){switch(e){case 2:case 3:return 10;case 4:case 5:return 9;case 6:case 7:return 8;case 8:return 7;default:throw new Error("Unknown player count: ".concat(e))}}function x(e,a,t){var n,r,c=[];switch((t=(null===e||void 0===e?void 0:e.setupData)||t).rolls){case P.maki:c=[].concat(Object(s.a)(Object(p.f)(4).map((function(e){return{category:k,name:P.maki,count:1}}))),Object(s.a)(Object(p.f)(5).map((function(e){return{category:k,name:P.maki,count:2}}))),Object(s.a)(Object(p.f)(3).map((function(e){return{category:k,name:P.maki,count:3}}))));break;case P.temaki:c=Object(p.f)(12).map((function(e){return{category:k,name:P.temaki,count:1}}));break;case P.uramaki:c=[].concat(Object(s.a)(Object(p.f)(4).map((function(e){return{category:k,name:P.uramaki,count:3}}))),Object(s.a)(Object(p.f)(4).map((function(e){return{category:k,name:P.uramaki,count:4}}))),Object(s.a)(Object(p.f)(4).map((function(e){return{category:k,name:P.uramaki,count:5}}))));break;default:throw new Error("Unknown rolls: ".concat(t.rolls))}var l,u,o=[t.appetizer1,t.appetizer2,t.appetizer3],i=[t.special1,t.special2];l=(null===e||void 0===e||null===(n=e.secret)||void 0===n?void 0:n.deck)?e.secret.deck.filter((function(e){return e.category===E})):[],u=(null===e||void 0===e||null===(r=e.secret)||void 0===r?void 0:r.desserts)?Object(s.a)(e.secret.desserts):a.random.Shuffle(Object(p.f)(15).map((function(e){var a={category:E,name:t.dessert};return a.name===R.fruit&&(a.variants=O[e]),a}))),l=l.concat([].concat(Object(s.a)(Object(p.f)(4).map((function(e){return{category:g,name:S.egg}}))),Object(s.a)(Object(p.f)(5).map((function(e){return{category:g,name:S.salmon}}))),Object(s.a)(Object(p.f)(3).map((function(e){return{category:g,name:S.squid}}))),Object(s.a)(c),Object(s.a)(o.map((function(e){return Object(p.f)(8).map((function(a){var t={category:j,name:e};return t.name===w.onigiri&&(t.variants=[v[a%v.length]]),t}))})).flat()),Object(s.a)(i.map((function(e){return Object(p.f)(3).map((function(a){return{category:h,name:e}}))})).flat())));for(var m=function(e,a){switch(e){case 2:case 3:case 4:case 5:switch(a){case 1:return 5;case 2:return 3;case 3:return 2;default:throw new Error("Unknown round number: ".concat(a))}case 6:case 7:case 8:switch(a){case 1:return 7;case 2:return 5;case 3:return 3;default:throw new Error("Unknown round number: ".concat(a))}default:throw new Error("Unknown player count: ".concat(e))}}(a.numPlayers,A(a)),f=0;f<m;f++)l.push(u.pop());return{deck:a.random.Shuffle(l),desserts:u}}function A(e){if(e.gameover)return 3;var a=C(e.numPlayers),t=0===e.turn?e.turn:e.turn-1;return Math.floor(t/a)+1}function L(e,a){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,n=x(e,a,t),r=n.deck,c=n.desserts,l=A(a),i=Object.fromEntries(Object(p.f)(a.numPlayers).map((function(e){return[e,{hand:Object(p.f)(C(a.numPlayers)).map((function(a){var t=r.pop();if(null==t)throw new Error("Not enough cards in deck for player ".concat(e));return t}))}]}))),s=(null===e||void 0===e?void 0:e.played)?Object.fromEntries(Object.entries(e.played).map((function(e){var a=Object(o.a)(e,2);return[a[0],a[1].filter((function(e){return e.category===E})).map((function(e){return Object(u.a)(Object(u.a)({},e),{},{round:l-1})}))]}))):Object.fromEntries(Object(p.f)(a.numPlayers).map((function(e){return[e,[]]})));return{secret:{deck:r,desserts:c},players:i,played:s}}function N(e){var a,t,u=Object.entries(e.scores).map((function(e){var a=Object(o.a)(e,2),t=a[0],n=a[1];return{playerID:t,score:Object(p.h)(n)}})),s=(a=u,Object(n.a)(a)||Object(r.a)(a)||Object(c.a)(a)||Object(l.a)()),m=s[0],f=s.slice(1),d=m.playerID,b=m.score,v=Object.fromEntries(Object.entries(e.played).map((function(e){var a=Object(o.a)(e,2);return[a[0],a[1].filter((function(e){return e.category===E})).length]}))),y=Object(i.a)(f);try{for(y.s();!(t=y.n()).done;){var O=t.value,j=O.playerID,k=O.score;(k>b||k===b&&v[j]>v[d])&&(b=k,d=j)}}catch(g){y.e(g)}finally{y.f()}return{winner:d}}a.default={name:"sashimi-express",minPlayers:d,maxPlayers:b,setupDataSchema:{required:["numPlayers","rolls","appetizer1","appetizer2","appetizer3","special1","special2","dessert"],properties:Object.fromEntries([["numPlayers",{title:"Number of players",type:"integer",minimum:d,maximum:b,default:d}],["rolls",{title:"Rolls",type:"string",enum:Object.values(P),default:Object.values(P)[0]}]].concat(Object(s.a)(Object(p.f)(3).map((function(e){return["appetizer".concat(e+1),{title:"Appetizer ".concat(e+1),type:"string",enum:Object.values(w),default:Object.values(w)[e]}]}))),Object(s.a)(Object(p.f)(2).map((function(e){return["special".concat(e+1),{title:"Special ".concat(e+1),type:"string",enum:Object.values(I),default:Object.values(I)[e]}]}))),[["dessert",{title:"Dessert",type:"string",enum:Object.values(R),default:Object.values(R)[0]}]]))},validateSetupData:function(e,a){var t=[e.appetizer1,e.appetizer2,e.appetizer3],n=[e.special1,e.special2];return p.a.apply(void 0,t).length!==t.length?"All appetizers must be different":p.a.apply(void 0,n).length!==n.length?"All specials must be different":2===a&&t.includes(w.edamame)?"".concat(w.edamame," can't be used in a two player game"):void 0},setup:function(e,a){return Object(u.a)(Object(u.a)({},L(null,e,a)),{},{scores:Object.fromEntries(Object(p.f)(e.numPlayers).map((function(e){return["".concat(e),[]]}))),startingPlayer:"".concat(Object(p.b)(e.numPlayers+1)),setupData:a})},moves:{pickCard:{move:function(e,a,t){if(function(e,a,t){var n=e.players[a.playerID];return null==t?"played_no_card":t>=n.hand.length?"played_unknown_card":null!=n.picked?"played_card_already":void 0}(e,a,t))return m.t;var n=e.players[a.playerID];n.picked=n.hand[t],n.hand=Object(p.g)(n.hand,t)},client:!1}},turn:{activePlayers:{all:m.j.NULL,moveLimit:1},endIf:function(e,a){return Object.values(e.players).every((function(e){return null!=e.picked}))},onEnd:function(e,a){for(var t=0,n=Object.entries(e.players);t<n.length;t++){var r=Object(o.a)(n[t],2),c=r[0],l=r[1];e.played[c].push(l.picked),e.players[c].picked=void 0}if(function(e,a){return Object.values(e.players).every((function(e){return 0===e.hand.length}))}(e)){for(var u=A(a),i=function(){var a=Object(o.a)(m[s],2),t=a[0],n=D(a[1],Object.entries(e.played).filter((function(e){var a=Object(o.a)(e,2),n=a[0];a[1];return n!==t})).map((function(e){var a=Object(o.a)(e,2);a[0];return a[1]})),u);e.scores[t].push(n)},s=0,m=Object.entries(e.played);s<m.length;s++)i();if(3===u){var f=N(e);a.events.endGame(f)}else for(var p=0,d=Object.entries(L(e,a));p<d.length;p++){var b=Object(o.a)(d[p],2),v=b[0],y=b[1];e[v]=y}}else{for(var O={},E=0,j=Object.entries(e.players);E<j.length;E++){var k=Object(o.a)(j[E],2),g=k[0],h=k[1];O[(Number(g)+1)%a.numPlayers]=h.hand}for(var S=0,P=Object.entries(O);S<P.length;S++){var w=Object(o.a)(P[S],2),I=w[0],R=w[1];e.players[I]={hand:R}}}}},playerView:f.a.STRIP_SECRETS,events:{endStage:!1,endTurn:!1,endPhase:!1,endGame:!1,setStage:!1,setPhase:!1,setActivePlayers:!1},disableUndo:!0}},596:function(e,a,t){"use strict";t.r(a),t.d(a,"default",(function(){return d}));var n=t(20),r=t(0),c=t.n(r),l=t(63),u=t(202),o=t.n(u),i=t(592),s=t(199);t(591);function m(e){var a,t=e.ctx,n=e.card;switch(n.name){case i.NIGIRIS.egg:a=c.a.createElement("span",null,"1 point");break;case i.NIGIRIS.salmon:a=c.a.createElement("span",null,"2 points");break;case i.NIGIRIS.squid:a=c.a.createElement("span",null,"3 points");break;case i.ROLLS.maki:a=t.numPlayers<=5?c.a.createElement("span",null,"Most: 6/3"):c.a.createElement("span",null,"Most: 6/4/2");break;case i.ROLLS.temaki:a=t.numPlayers<=2?c.a.createElement("span",null,"Most: 4"):c.a.createElement("span",null,"Most: 4",c.a.createElement("br",null),"Least: -4");break;case i.ROLLS.uramaki:a=c.a.createElement("span",null,"First to 10: 8/5/2");break;case i.APPETIZERS.dumpling:a=c.a.createElement("span",null,"1 3 6 10 15");break;case i.APPETIZERS.edamame:a=c.a.createElement("span",null,"1 per opponents with edamame");break;case i.APPETIZERS.eel:a=c.a.createElement("span",null,"\xd71 = -3",c.a.createElement("br",null),"\xd72+ = +7");break;case i.APPETIZERS.onigiri:a=c.a.createElement("span",null,"Unique: 1 4 9 16");break;case i.APPETIZERS.misoSoup:a=c.a.createElement("span",null,"3 points",c.a.createElement("br",null),"Discard if any others played this turn");break;case i.APPETIZERS.sashimi:a=c.a.createElement("span",null,"\xd73 = 10");break;case i.APPETIZERS.tempura:a=c.a.createElement("span",null,"\xd72 = 5");break;case i.APPETIZERS.tofu:a=c.a.createElement("span",null,"\xd71 = 2",c.a.createElement("br",null),"\xd72 = 6",c.a.createElement("br",null),"\xd73+ = 0");break;case i.SPECIALS.soySauce:a=c.a.createElement("span",null,"Most colors: 4");break;case i.SPECIALS.tea:a=c.a.createElement("span",null,"1 per card in your biggest set");break;case i.SPECIALS.wasabi:a=c.a.createElement("span",null,"Next nigiri \xd73");break;case i.DESSERTS.matchaIceCream:a=c.a.createElement("span",null,"\xd74 = 12");break;case i.DESSERTS.pudding:a=t.numPlayers<=2?c.a.createElement("span",null,"Most: 6"):c.a.createElement("span",null,"Most: 6",c.a.createElement("br",null),"Least: -6");break;case i.DESSERTS.fruit:a=c.a.createElement("span",null,"Per type:",c.a.createElement("br",null),"(-2) 0 1 3 6 10");break;default:return console.error("Unknown card: ".concat(n.name)),null}return c.a.createElement("aside",null,a)}function f(e){var a=e.ctx,t=e.card,l=e.onClick,u=e.disabled,i=t.name,s=t.category,f=t.count,p=t.variants,d=Object(r.useState)(!1),b=Object(n.a)(d,2),v=b[0],y=b[1],O=Object(r.useCallback)((function(e){e.preventDefault(),y((function(e){return!e}))}),[y]);return c.a.createElement("button",{className:o()({clickable:null!=l&&!u}),onContextMenu:O,onClick:u?null:l,disabled:u},c.a.createElement("div",{className:o()("card",s.toLowerCase(),{showHelpText:v})},c.a.createElement("div",{className:"name"},i,f&&c.a.createElement("span",null,"\xa0\xd7",f),p&&c.a.createElement("span",null,":",c.a.createElement("br",null),p.map((function(e,a){return c.a.createElement("span",{key:a},e,c.a.createElement("br",null))})))),c.a.createElement(m,{ctx:a,card:t})))}function p(){return c.a.createElement(l.b,{className:"help",to:"/rules",target:"_blank"},c.a.createElement("span",{role:"img","aria-label":"View rules"},"\u2753"))}function d(e){var a=e.G,t=e.ctx,n=e.playerID,u=e.moves,o=e.matchData,m=a.players[n],d=m.hand,b=m.picked,v=Object(i.getNumRound)(t),y=t.gameover,O=t.turn,E=Object.keys(a.played),j=E.indexOf(n),k=E.slice(j+1).concat(E.slice(0,j)),g=function(e){var a;return(null===(a=o.find((function(a){return"".concat(a.id)===e})))||void 0===a?void 0:a.name)||"Player ".concat(e)},h=function(e){return function(a){a.preventDefault(),b||u.pickCard(e)}};if(y){var S=function(e){var t=e.playerID,n=e.name,r=void 0===n?void 0:n;return c.a.createElement("tr",null,c.a.createElement("td",null,r||g(t),y.winner===t&&c.a.createElement("span",{role:"img","aria-label":"Winner"},"\ud83c\udfc6")),Object(s.f)(v).map((function(e){return c.a.createElement("td",{key:e},a.scores[t][e])})),c.a.createElement("td",null,Object(s.h)(a.scores[t])))};return c.a.createElement("div",{className:"gameover"},c.a.createElement("table",null,c.a.createElement("thead",null,c.a.createElement("tr",null,c.a.createElement("th",null,"Player"),Object(s.f)(v).map((function(e){return c.a.createElement("th",{key:e},"Round ",e+1)})),c.a.createElement("th",null,"Total"))),c.a.createElement("tbody",null,c.a.createElement(S,{playerID:n,name:"You"}),k.map((function(e){return c.a.createElement(S,{key:e,playerID:e})})))),c.a.createElement(l.b,{to:"/new"},"Click to play another game"))}var P=function(e){var n=e.playerID,r=e.picked,l=void 0===r?void 0:r,u=e.name,o=void 0===u?void 0:u,i=Object(s.e)(a.played[n],(function(e){return null!=e.round})),m=Object(s.h)(a.scores[n]);return c.a.createElement("figure",null,c.a.createElement("figcaption",null,o||g(n),m>0&&c.a.createElement("span",null,", score ",m)),c.a.createElement("ol",null,i.true.map((function(e,a){return c.a.createElement("li",{key:"".concat(a,"-").concat(e.round)},c.a.createElement(f,{card:e,ctx:t}))})),i.false.map((function(e,a){return c.a.createElement("li",{key:a},c.a.createElement(f,{card:e,ctx:t}))})),l&&c.a.createElement("li",null,c.a.createElement(f,{card:l,ctx:t}))))};return c.a.createElement(r.Fragment,null,b&&c.a.createElement("em",{className:"status"},"Waiting for other players\u2026"),c.a.createElement("figure",null,c.a.createElement("figcaption",null,"Round ",v,", Hand ",O),c.a.createElement("ul",null,d.map((function(e,a){return c.a.createElement("li",{key:"".concat(a,"-").concat(e.name,"-").concat(e.category,"-").concat(O)},c.a.createElement(f,{card:e,ctx:t,onClick:h(a),disabled:null!=b}))})))),c.a.createElement(P,{playerID:n,picked:b,name:"You"}),k.map((function(e){return c.a.createElement(P,{key:e,playerID:e})})),c.a.createElement(p,null))}}}]);
//# sourceMappingURL=4.04c55b45.chunk.js.map