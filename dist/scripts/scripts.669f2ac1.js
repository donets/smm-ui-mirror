"use strict";function parseString(a){return a.split(".")}function getValue(a,b){var c=a;return _.forEach(b,function(a){c=c[a]}),c}angular.module("boltApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.router","ui.bootstrap","angular-data.DSCacheFactory","angularMoment","ngProgress","angularSpinner","duScroll","ezfb","angulartics","angulartics.google.analytics","angulartics.google.tagmanager","com.2fdevs.videogular","com.2fdevs.videogular.plugins.controls","com.2fdevs.videogular.plugins.overlayplay","com.2fdevs.videogular.plugins.buffering","com.2fdevs.videogular.plugins.poster","boltApp.controllers.Main","boltApp.controllers.Event","boltApp.controllers.Social","boltApp.controllers.Confirmation","boltApp.controllers.Subscribe","boltApp.controllers.More","boltApp.navigator","boltApp.services"]),angular.module("boltApp").run(["$rootScope","$state","$stateParams","amMoment","$window",function(a,b,c,d,e){a.$state=b,a.$stateParams=c,d.changeLanguage("de"),$.getScript("//connect.facebook.net/en_US/fbds.js").done(function(){e._fbq=e._fbq||[],e._fbq.push(["addPixelId","1461407927469396"]),e._fbq.push(["track","PixelInitialized",{}])})}]).run(["$http","DSCacheFactory",function(a,b){b("defaultCache",{maxAge:9e5,cacheFlushInterval:6e6,deleteOnExpire:"aggressive"});a.defaults.cache=b.get("defaultCache")}]).run(["$rootScope","$modalStack",function(a,b){a.$on("$stateChangeStart",function(){var a=b.getTop();a&&b.dismiss(a.key)})}]).config(["ezfbProvider",function(a){a.setInitParams({appId:"1403268876590849"}),a.setLocale("de_DE")}]).config(["$httpProvider",function(a){a.responseInterceptors.push("HttpProgressInterceptor")}]).provider("HttpProgressInterceptor",function(){this.$get=["$injector","$q",function(a,b){var c,d=this;return this.getNgProgress=function(){return c=c||a.get("ngProgress")},function(a){return c=d.getNgProgress(),c.color("#ff5c40"),c.height("3px"),c.reset(),c.start(),a.then(function(a){return c.complete(),a},function(a){return c.complete(),b.reject(a)})}}]}).config(["$stateProvider","$locationProvider","$urlRouterProvider","$analyticsProvider",function(a,b,c,d){c.otherwise("/"),b.html5Mode(!0),d.firstPageview(!1),a.state("main",{url:"/",templateUrl:"views/main.html",resolve:{getEvents:["Events",function(a){return a.query()}]},onEnter:["$rootScope",function(a){a.autoscroll=!1}],onExit:["$rootScope",function(a){a.autoscroll=!0}],controller:"MainCtrl"}).state("view",{url:"/event/:eventId/",templateUrl:"views/event.html",resolve:{getEvent:["Events","$stateParams",function(a,b){return a.get({eventId:b.eventId}).$promise}]},controller:"EventCtrl"}).state("view.contact",{url:"contact/",onEnter:["$state","$stateParams","$modal",function(a,b,c){c.open({templateUrl:"views/modalContact.html",controller:["$scope","$modalInstance","$http","teacherId",function(a,b,c,d){a.contact={},a.submitMessage=function(){a.loadingUpdate=!0,c.post("/api/message/"+d,a.contact).success(function(){a.loadingUpdate=!1,a.successUpdate=!0,setTimeout(function(){b.close(!0)},0)}).error(function(b,c){a.loadingUpdate=!1,a.errorUpdate=!0,console.error(c)})},a.close=function(){b.close(!0)}}],backdrop:"static",resolve:{teacherId:["Events",function(a){var c=b.eventId;return a.get({eventId:c}).$promise.then(function(a){return a.event.somuchmore.teacherId})}]}}).result.then(function(c){return c?a.transitionTo("view",{eventId:b.eventId}):void 0})}]}).state("more",{url:"/more/",templateUrl:"views/more.html",controller:"MoreCtrl"}).state("about",{url:"/about/",templateUrl:"views/about.html"}).state("impressum",{url:"/impressum/",templateUrl:"views/impressum.html"}).state("agb",{url:"/agb/",templateUrl:"views/agb.html"})}]),angular.module("boltApp.services",[]).factory("Events",["$resource",function(a){return a("/api/events/:eventId",{eventId:"@id"},{query:{method:"GET",isArray:!1,cache:!0},get:{method:"GET",cache:!0},getOrder:{method:"GET",cache:!1,url:"/api/events/:eventId/order_details"}})}]),angular.module("boltApp.navigator",[]).service("navigator",["$window",function(a){return{browser:function(){var b=a.navigator.userAgent,c={chrome:/chrome/i,safari:/safari/i,firefox:/firefox/i,ie:/internet explorer/i};for(var d in c)if(c[d].test(b))return d;return"unknown"},platform:function(){var b=a.navigator.userAgent,c={android:/Android/i,webOS:/webOS/i,iPhone:/iPhone/i,iPad:/iPad/i,iPod:/iPod/i,blackBerry:/BlackBerry/i,winPhone:/Windows Phone/i};for(var d in c)if(c[d].test(b))return"mobile";return"desktop"}}}]),angular.module("boltApp.controllers.Main",[]).controller("MainCtrl",["$scope","$rootScope","$window","$location","$interval","DSCacheFactory","Events","getEvents",function(a,b,c,d,e,f,g,h){function i(){a.loading=!1,a.schedule=d.search().schedule,_.each(a.events.events,function(a){var b=moment(),c=moment(a.event.start_date);a.event.schedule=b>c?"past":"Heute"===c.calendar().split(" ")[0]?"today":"Morgen"===c.calendar().split(" ")[0]?"tomorrow":"later",a.event.minPrice=_.min(a.event.tickets,function(a){return a.ticket.display_price})})}var j=f.get("defaultCache");a.loading=!0,a.changeSchedule=function(b){a.schedule=b,c.ga("send","pageview","/?schedule="+b)},a.showSpinner=function(a){a.eventLoad=!0},b.$on("$includeContentLoaded",function(){a.contentLoaded=!0}),h.$promise.then(function(){a.events=h,i(),console.log(a.events)}),j.setOptions({onExpire:function(b){return console.log(b),"/api/events"===b?g.query().$promise.then(function(b){a.events=b,i(),console.log(a.events)}):void 0}})}]),angular.module("boltApp.controllers.Event",["google-maps"]).controller("EventCtrl",["$scope","$rootScope","getEvent","$window","$location","ezfb",function(a,b,c,d,e,f){a.event=c,a.coverMain=b.windowWidth>1080?"/images/main-2880.bc459a04.jpg":"/images/main-1080.a4cdcc28.jpg";var g=b.windowWidth>1080?600:250;a.cutVal=g,a.uncut=function(){a.cutVal=0},a.cut=function(){a.cutVal=g},a.map={center:{latitude:c.event.venue.latitude,longitude:c.event.venue.longitude},zoom:16,options:{mapTypeControl:!1,overviewMapControl:!1,panControl:!1,zoomControl:!0,streetViewControl:!1}},a.marker={id:c.event.id,coords:{latitude:c.event.venue.latitude,longitude:c.event.venue.longitude},options:{icon:{path:b.windowWidth>1080?"M19.355,13.496l-7.109,15.117C11.836,29.473,10.938,30,10,30s-1.836-0.527-2.227-1.387L0.645,13.496 C0.137,12.422,0,11.191,0,10C0,4.473,4.473,0,10,0s10,4.473,10,10C20,11.191,19.863,12.422,19.355,13.496z M10,5 c-2.754,0-5,2.246-5,5s2.246,5,5,5s5-2.246,5-5S12.754,5,10,5z":"M28.389,19.794L17.961,41.966C17.359,43.227,16.042,44,14.667,44s-2.692-0.773-3.266-2.034L0.945,19.794 C0.201,18.219,0,16.414,0,14.667C0,6.56,6.56,0,14.667,0s14.667,6.56,14.667,14.667C29.334,16.414,29.133,18.219,28.389,19.794z M14.667,7.333c-4.039,0-7.333,3.294-7.333,7.334c0,4.039,3.294,7.333,7.333,7.333S22,18.706,22,14.667 C22,10.627,18.706,7.333,14.667,7.333z",fillColor:"#ff5c40",anchor:b.windowWidth>1080?new google.maps.Point(10,30):new google.maps.Point(15,44),fillOpacity:1,scale:1,strokeWeight:0}}},c.$promise.then(function(){c.eventLoad=!1,b.eventTitle=c.event.title;var d=moment(c.event.start_date),e=moment(c.event.end_date);moment.relativeTimeThreshold("m",1e3),a.duration=moment.duration(e.diff(d)).asMinutes(),a.date=d,a.minPrice=_.min(c.event.tickets,function(a){return a.ticket.display_price})}),a.share=function(){console.log(e.absUrl());var a=function(a){console.log(a&&!a.error_code?"Posting completed.":"Error while posting.")};f.ui({method:"feed",name:c.event.title,picture:c.event.logo,link:e.absUrl(),description:c.event.somuchmore.description},a)},a.contactTeacher=function(){d.ga("set","dimension2","1")},a.bookEvent=function(){$.getScript("//connect.facebook.net/en_US/fbds.js").done(function(){d._fbq=d._fbq||[],d._fbq.push(["track","6019562580325"])})},a.bookAnotherEvent=function(){$.getScript("//connect.facebook.net/en_US/fbds.js").done(function(){d._fbq=d._fbq||[],d._fbq.push(["track","6019562584725"])})},console.log(a.event)}]),angular.module("boltApp.controllers.Social",[]).controller("SocialCtrl",["$rootScope","$scope","$http","ezfb","$window",function(a,b,c,d,e){b.getLikes=function(){return c.get("//graph.facebook.com/somuchmoredeutsch",{cache:!1}).success(function(b){a.likes=b.likes})},b.getLikes(),d.Event.subscribe("edge.create",function(a){e.ga("set","dimension3","1"),e.ga("send","social","facebook","like",a),b.getLikes()}),d.Event.subscribe("edge.remove",function(a){e.ga("set","dimension3","0"),e.ga("send","social","facebook","unlike",a),b.getLikes()})}]),angular.module("boltApp.controllers.Confirmation",[]).controller("ConfirmationCtrl",["$scope","$rootScope","$location","$window","$q","Events",function(a,b,c,d,e,f){a.params=c.search(),a.params.eid&&f.get({eventId:a.params.eid}).$promise.then(function(b){a.alert=!0,a.event=b,f.getOrder({eventId:a.params.eid,order_id:a.params.oid}).$promise.then(function(b){var f=e.defer(),g=e.defer();d.ga("require","ecommerce","ecommerce.js"),d.ga("ecommerce:addTransaction",{id:a.params.oid,affiliation:a.event.event.somuchmore.teacherId,revenue:b.summary.total_amount_paid}),d.ga("ecommerce:send"),$.getScript("//www.googleadservices.com/pagead/conversion_async.js").done(function(){d.google_trackConversion({google_conversion_id:970072239,google_conversion_language:"de",google_conversion_format:"3",google_conversion_color:"ffffff",google_conversion_label:"h7xyCNGh_wkQr8HIzgM",google_conversion_value:b.summary.total_amount_paid,google_remarketing_only:!1}),d.google_trackConversion({google_conversion_id:968958845,google_conversion_language:"de",google_conversion_format:"3",google_conversion_color:"ffffff",google_conversion_label:"HAEVCOvehgsQ_caEzgM",google_conversion_value:b.summary.total_amount_paid,google_remarketing_only:!1}),f.resolve()}),$.getScript("//connect.facebook.net/en_US/fbds.js").done(function(){d._fbq=d._fbq||[],d._fbq.push(["track","6019562586725",{value:b.summary.total_amount_paid,currency:"EUR"}]),g.resolve()}),e.all([f.promise,g.promise]).then(function(){_.each(a.params,function(a,b){c.search(b,null)})})})}),a.close=function(){a.alert=!1,b.autoscroll=!0}}]),angular.module("boltApp.controllers.Subscribe",[]).controller("SubscribeCtrl",["$scope","$window","$http",function(a,b,c){a.subscribe=function(){a.loadingUpdate=!0,a.successUpdate=!1,a.errorUpdate=!1,c.post("/api/subscribtion/subscribe",{email:a.email}).success(function(){a.loadingUpdate=!1,a.successUpdate=!0,a.email="",a.form.$setPristine(),b.ga("set","dimension1","1"),b.ga("send","signup_app_waitlist","content"),$.getScript("//www.googleadservices.com/pagead/conversion_async.js").done(function(){b.google_trackConversion({google_conversion_id:970072239,google_conversion_language:"de",google_conversion_format:"3",google_conversion_color:"ffffff",google_conversion_label:"fiXPCMmi_wkQr8HIzgM",google_remarketing_only:!1}),b.google_trackConversion({google_conversion_id:968958845,google_conversion_language:"de",google_conversion_format:"3",google_conversion_color:"ffffff",google_conversion_label:"GgJECOPfhgsQ_caEzgM",google_remarketing_only:!1})})}).error(function(b,c){a.loadingUpdate=!1,a.errorUpdate=!0,console.error(c)})}}]),angular.module("boltApp.controllers.More",[]).controller("MoreCtrl",["$scope","$rootScope","$sce","navigator",function(a,b,c,d){a.videoAPI=null,a.platformMobile="mobile"===d.platform(),a.video={sources:[{src:c.trustAsResourceUrl("//assets.so-much-more.de/video/somuchmore.mp4"),type:"video/mp4"},{src:c.trustAsResourceUrl("//assets.so-much-more.de/video/somuchmore.webm"),type:"video/webm"},{src:c.trustAsResourceUrl("//assets.so-much-more.de/video/somuchmore.ogg"),type:"video/ogg"}],autoHide:!0,autoHideTime:3e3,autoPlay:!1,stretch:"fill",responsive:!0,poster:{url:"/images/video_cover.1b5aff5a.jpg"},onPlayerReady:function(b){a.videoAPI=b}}}]),function(a){"function"==typeof define&&define.amd?define([""],a):"object"==typeof exports?module.exports=a(require("../moment")):a(window.moment)}(function(a){function b(a,b,c){var d={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?d[c][0]:d[c][1]}return a.lang("de",{months:"Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",L:"dd, D.M., LT",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Heute] LT",sameElse:"L",nextDay:"[Morgen] LT",nextWeek:"L",lastDay:"L",lastWeek:"L"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:b,mm:"%d Minuten",h:b,hh:"%d Stunden",d:b,dd:b,M:b,MM:b,y:b,yy:b},ordinal:"%d.",week:{dow:1,doy:4}})}),angular.module("boltApp").filter("cutString",function(){return function(a,b,c,d){if(a){if(d=d||"...",b=parseInt(b,10),!b)return a;if(a.length<=b)return a;if(a=a.slice(0,b-d.length),c){var e=a.lastIndexOf(" ");-1!==e&&(a=a.slice(0,e),d=" ...")}return a+d}return""}}),angular.module("boltApp").filter("dataFilter",function(){return function(a,b,c){if(a&&b&&c){var d=parseString(b);return _.filter(a,function(a){var b=getValue(a,d);return _.isArray(b)&&-1!==_.indexOf(b,c)?b:b===c})}return a}}),angular.module("boltApp").directive("disableAnimate",["$animate",function(a){return{restrict:"A",link:function(b,c){a.enabled(!1,c)}}}]),angular.module("boltApp").directive("resizable",["$window",function(a){return function(b){return b.initializeWindowSize=function(){b.windowWidth=a.innerWidth,b.windowWidthScroll=2*a.innerWidth-a.outerWidth,a.innerWidth>1080?(b.desktop=!0,b.mobile=!1,b.offset=60):(b.desktop=!1,b.mobile=!0,b.offset=120)},b.initializeWindowSize(),angular.element(a).bind("resize",function(){return b.initializeWindowSize(),b.$apply()})}}]),angular.module("boltApp").directive("sticky",["$window","$rootScope",function(a,b){return{link:function(c,d,e){var f=angular.element(a);if(void 0===c._stickyElements){c._stickyElements=[],f.bind("scroll.sticky",function(){for(var a=f.scrollTop(),b=0;b<c._stickyElements.length;b++){var d=c._stickyElements[b];!d.isStuck&&a>d.start?(d.element.addClass("stuck"),d.isStuck=!0,d.placeholder&&(d.placeholder=angular.element("<div></div>").css({height:d.element.outerHeight()+"px"}).insertBefore(d.element))):d.isStuck&&a<d.start&&(d.element.removeClass("stuck"),d.isStuck=!1,d.placeholder&&(d.placeholder.remove(),d.placeholder=!0))}});var g=function(){for(var a=0;a<c._stickyElements.length;a++){var b=c._stickyElements[a];b.isStuck?b.placeholder&&(b.start=b.placeholder.offset().top):b.start=b.element.offset().top}};f.bind("load",g),f.bind("resize",g),f.bind("scroll",g),b.$on("$stateChangeSuccess",function(){b.$state.includes("main")?f.bind("scroll",g):f.unbind("scroll",g)})}var h={element:d,isStuck:!1,placeholder:void 0!==e.usePlaceholder,start:d.offset().top};c._stickyElements.push(h)}}}]);