"use strict";require.config({paths:{jquery:"../jquery.min",underscore:"../underscore.min",pubsub:"../pubsub"}}),define("spoopy.game",["jquery","underscore","pubsub","spoopy.rooms","spoopy.items","spoopy.player","spoopy.engine"],(e,n,s,r,i,t,o)=>{this.available=n.range(25),this.player=new t,this.engine=new o(this.available),e(document).ready(()=>{let e={start:{loc:0,min_branches:3,max_branches:6},gens:1,gens_fn:function(){return n.random(1,3)}};this.engine.engine_build_map(e),a(this.player)});let a=n=>{e("#header h1").text(n.loc),e("#content p").text(r.get_description(n.loc))};s.subscribe("ENGINE_NAV_CLICK",(e,n)=>a(this.player))});