'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:LandingCtrl
 * @description
 * # LandingCtrl
 * Controller of the boltApp
 */
angular.module('boltApp')
    .controller('LandingCtrl', function ($scope, $http, $window, $stateParams, RestApi, gettextCatalog, $q, $sce) {
        var params = _.compact(_.flatten([$stateParams.params.split(/-\d+/g),$stateParams.params.split(/-|[a-zA-Z]+/g)]));
        var disciplineList = [
            { id: 1, name: 'Yoga' },
            { id: 2, name: 'Fitness' },
            { id: 3, name: 'Dance' },
            { id: 4, name: 'Meditation' },
            { id: 5, name: 'Pilates' },
            { id: 6, name: 'Crossfit' }
        ];
        var discipline = _.findWhere(disciplineList, {id: +params[1]});
        $scope.Math = $window.Math;
        $scope.sce = $sce.trustAsResourceUrl($window.smmConfig.restUrlBase + '/utils/wp/' + $stateParams.params);
        var setVoucher = function (code) {
            $http.get($window.smmConfig.restUrlBase + '/api/rest/vouchers/' + code).success(function (res) {
                if(res.valid && res.subscriptionType === null) {
                    $scope.showDiscount = moment().isBefore(moment(res.validUntil));
                    $scope.voucher = res;
                    $scope.validUntilIn = moment(res.validUntil).subtract(1, 'd');
                }
            }).error(function (res) {
                console.log(res);
                $scope.voucher = null;
            });
        };
        $scope.discipline = discipline ? discipline.name : 'Yoga';
        $scope.disciplineId = params[1];
        $scope.versionId = params[2];
        $scope.cityId = params[3];
        $q.all([RestApi.query({route: 'studios',cityId: $scope.cityId}).$promise,
            RestApi.query({route: 'locations',cityId: $scope.cityId}).$promise,
            RestApi.query({route: 'plans',cityId: $scope.cityId}).$promise
        ]).then(function (resolve) {
            $scope.allstudios = resolve[0];
            $scope.locations = resolve[1];
            $scope.cards = resolve[2];
            setVoucher('EARLY_BIRD_2014');
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

        $scope.localizedUnlimited = gettextCatalog.getString('Unlimited');

    });
