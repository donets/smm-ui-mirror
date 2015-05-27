'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:LandingCtrl
 * @description
 * # LandingCtrl
 * Controller of the boltApp
 */
angular.module('boltApp')
    .controller('LandingCtrl', function ($scope, $http, $window, $stateParams, RestApi, $q) {
        var params = _.compact(_.flatten([$stateParams.params.split(/-\d+/g),$stateParams.params.split(/-|[a-zA-Z]+/g)]));
        /*var tmp = {

            "content": "<div class=\"b-main-cover landing-cover\">\n<div class=\"b-main-slogan\">\n<div class=\"container\">\n<h2 translate>EINE KARTE FUR 20+ YOGA STUDIOS IN BERLIN KREUZBERG</h2>\n<p>            <a class=\"form-button signup-button\" ng-href=\"/p/signup/{{cityId}}/\" translate>Jetzt kostenlos ausprobieren</a>\n        </div>\n</p></div>\n</div>\n<div class=\"b-card b-equipment\">\n<div class=\"container\">\n<div class=\"white-bar\" ng-if=\"desktop\">\n<ul>\n<li>\n                    <b>Riesen Auswahl</b><br />\n                    <span>700 Anbieter in ganz Deutschland</span>\n                </li>\n<li>\n                    <b>Große entfaltung</b><br />\n                    <span>Unendlich viele Sparangebote</span>\n                </li>\n<li>\n                    <b>Kein Risiko</b><br />\n                    <span>Mitgliedschaft monatlich kundbar</span>\n                </li>\n</ul></div>\n<h2 translate>One card. Unlimited classes.</h2>\n<p translate>What are you in the mood for today? <b>Yoga</b>, <b>Pilates</b> or <b>Meditation</b>? Pushing yourself to the limits with <b>CrossFit</b>, <b>TRX</b> or <b>Barre Core</b>? Feel like hitting up the dance floor with a spot of <b>Tango</b>, <b>Hip-Hop</b> or <b>Salsa</b>? Or want to slow it down a little, reconnect and strengthen your core and concentration with <b>Tai Chi</b>, <b>Qi Gong</b> or <b>Kung-Fu</b>? Fancy learning more about <b>Nutrition</b> and <b>Biomedicine</b>? Or simply want to chill out and unwind in the <b>Sauna</b> or <b>Spa</b>?</p>\n<p translate>Feel it all. Explore it all. #BeSomuchmore</p>\n<ul class=\"tab-nav\" ng-show=\"desktop\">\n<li><a ng-class=\"{'active': discipline === 'Yoga'}\" href=\"\" ng-click=\"discipline = 'Yoga'\">Yoga</a></li>\n<li>\n            <a ng-class=\"{'active': discipline === 'Fitness'}\" href=\"\" ng-click=\"discipline = 'Fitness'\">Fitness</a></li>\n<li>\n            <a ng-class=\"{'active': discipline === 'Dance'}\" href=\"\" ng-click=\"discipline = 'Dance'\">Dance</a></li>\n<li>\n            <a ng-class=\"{'active': discipline === 'Meditation'}\" href=\"\" ng-click=\"discipline = 'Meditation'\">Meditation</a></li>\n<li>\n            <a ng-class=\"{'active': discipline === 'Pilates'}\" href=\"\" ng-click=\"discipline = 'Pilates'\">Pilates</a></li>\n<li>\n            <a ng-class=\"{'active': discipline === 'Crossfit'}\" href=\"\" ng-click=\"discipline = 'Crossfit'\">Crossfit</a></li>\n</ul></div>\n</div>\n<p class=\"subtitle landing-subtitle\" ng-if=\"mobile\">Classes to visit in Berlin, with SoMuchMore:</p>\n<div class=\"b-classes-landing\" landing-classes></div>\n<div class=\"b-card b-hiw\">\n<div class=\"container\">\n<h2 translate>It’s so simple!</h2>\n<ul class=\"b-card-list\">\n<li>\n                <img class=\"card-image\" src=\"images/hiw_01.svg\" alt=\"\"/></p>\n<p translate>1. Order your card</p>\n<p>                <span translate>It takes less than 90 seconds. You can start right away.</span>\n            </li>\n<li>\n                <img class=\"card-image\" src=\"images/hiw_02.svg\" alt=\"\"/></p>\n<p translate>2. Book your class</p>\n<p>                <span translate>Find your class in seconds using our online calendar.</span>\n            </li>\n<li>\n                <img class=\"card-image\" src=\"images/hiw_03.svg\" alt=\"\"/></p>\n<p translate>3. Get moving</p>\n<p>                <span translate>Visit classes as often as you want.</span>\n            </li>\n</ul></div>\n</div>\n<div class=\"b-card b-price\" ng-if=\"desktop\">\n<div class=\"container\">\n<h2 translate>Live a healthy and fulfilled life</h2>\n<p class=\"subtitle\" translate>Order your card – and set your life in motion.</p>\n<p class=\"subtitle\" translate>Secure a 20% discount for the first three months if you sign up by {{validUntilIn | amDateFormat: &#8216;D MMMM&#8217;}}</p>\n<div class=\"select-cards\">\n<ul class=\"select-cards__title\">\n<li>\n<div class=\"select-cards__circle\" ng-if=\"desktop\"><span translate>Enjoy your <br />free<br /> 14 day trial!</span></div>\n</li>\n<li></li>\n<li translate>Price per month</li>\n<li translate>Courses per month</li>\n<li translate>Courses per provider / month</li>\n<li translate>Cancel / Freeze</li>\n</ul>\n<ul class=\"select-cards__card\">\n<li><img class=\"card-image\" src=\"/images/card-lite.png\" alt=\"\"/></li>\n<li class=\"name\">White Card Lite</li>\n<li><b>39€</b></li>\n<li>4</li>\n<li>3</li>\n<li>Jederzeit</li>\n</ul>\n<ul class=\"select-cards__card\">\n<li><img class=\"card-image\" src=\"/images/card-white.png\" alt=\"\"/></li>\n<li class=\"name\">White Card</li>\n<li><b>69€</b></li>\n<li>Unbegrenzt</li>\n<li>3</li>\n<li>Jederzeit</li>\n</ul>\n<ul class=\"select-cards__card\">\n<li><img class=\"card-image\" src=\"/images/card-black.png\" alt=\"\"/></li>\n<li class=\"name\">Black Card</li>\n<li><b>99€</b></li>\n<li>Unbegrenzt</li>\n<li>Unbegrenzt</li>\n<li>Jederzeit</li>\n</ul></div>\n</p></div>\n</div>\n<div class=\"b-cta\" ng-if=\"desktop\">\n<div class=\"container\">\n<p>Melde Dich in weniger als 1 Minute an &#8211; und \u0003besuche gleich danach Deinen ersten Kurs.</p>\n<p>        <a class=\"form-button signup-button\" ng-href=\"/p/signup/{{cityId}}/\" translate>Jetzt kostenlos ausprobieren</a>\n    </div>\n</div>\n<div class=\"b-card b-cta-mobile\" ng-if=\"mobile\">\n<div class=\"container\">\n<h2 translate>Bestelle die Somuchmore Card</h2>\n<p class=\"subtitle\">Melde Dich in weniger als 1 Minute an &#8211; und \u0003besuche gleich danach Deinen ersten Kurs.</p>\n<p>        <img class=\"card-image\" src=\"/images/card-white-1080.png\" alt=\"\"/><br />\n        <a class=\"form-button signup-button\" ng-href=\"/p/signup/{{cityId}}/\" translate>Jetzt kostenlos ausprobieren</a>\n    </div>\n</div>\n"

        };*/
        var disciplineList = [
            { id: 1, name: 'Yoga' },
            { id: 2, name: 'Fitness' },
            { id: 3, name: 'Dance' },
            { id: 4, name: 'Meditation' },
            { id: 5, name: 'Pilates' },
            { id: 6, name: 'Crossfit' }
        ];
        var discipline = _.findWhere(disciplineList, {id: +params[1]});
        $scope.discipline = discipline ? discipline.name : 'Yoga';
        $scope.disciplineId = params[1];
        $scope.versionId = params[2];
        $scope.cityId = params[3];
        $q.all([RestApi.query({route: 'studios',cityId: $scope.cityId}).$promise,
            RestApi.query({route: 'locations',cityId: $scope.cityId}).$promise
        ]).then(function (resolve) {
            $scope.allstudios = resolve[0];
            $scope.locations = resolve[1];
        });
        $scope.showSpinner = true;
        $http.post($window.smmConfig.restUrlBase + '/api/classes/get/all', {cityId: $scope.cityId, date: moment().add(1, 'd').format('YYYY-MM-DD')}).success(function (res) {
            _.map(res.classes.classAccesses, function (obj) {
                var studio = _.findWhere($scope.allstudios, {id: obj.studioId});
                obj.studio = obj.studioId && studio ? studio : '';
                if(obj.studio.linkClassesToStudioDisciplines && obj.studio.disciplines) {
                    obj.disciplinestyle = _.union([obj.discipline, obj.style], obj.studio.disciplines.split(', '));
                } else {
                    obj.disciplinestyle = [obj.discipline, obj.style];
                }
            });
            _.map(res.classes.occurenceAccesses, function (obj) {
                var location = _.findWhere($scope.locations, {id: obj.locationId});
                obj.location = obj.locationId && location ? location : '';
            });
            $scope.events = _.each(res.classes.occurenceAccesses, function (event) {
                event.start_date = moment(event.date + 'T' + event.startTime);
                event.end_date = moment(event.date + 'T' + event.endTime);
                event.startTime = event.startTime.slice(0,5);
                event.endTime = event.endTime.slice(0,5);
                event.class = _.findWhere(res.classes.classAccesses, {id: event.classId});
            });
            $scope.events = _.filter($scope.events, function (event) {
                return moment(event.start_date).isAfter(moment());
            });
            _.map($scope.styles, function (item) {
                item.disabled = !_.include(_.uniq(_.pluck(res.classes.classAccesses, 'style')), item.name);
            });
            $scope.studios = _.uniq(_.pluck(res.classes.classAccesses, 'studio'));
            $scope.mergeDS = _.union($scope.disciplines, $scope.styles);
            $scope.showSpinner = false;
        });
    });
