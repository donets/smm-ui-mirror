'use strict';

/**
 * @ngdoc filter
 * @name boltApp.filter:dataFilter
 * @function
 * @description
 * # dataFilter
 * Filter in the boltApp.
 */

function parseString(input){
    return input.split('.');
}

function getValue(element, propertyArray){
    var value = element;

    _.forEach(propertyArray, function(property){
        value = value[property];
    });

    return value;
}

angular.module('boltApp')
    .filter('dataFilter', function() {
        return function(list, property, target) {
            if(list && property) {
                if (target) {
                    var properties = parseString(property);
                    return _.filter(list, function(item){
                        var value = getValue(item, properties);
                        if(_.isArray(value)) {
                            if(_.indexOf(value, target) !== -1) {
                                return value;
                            }
                        }
                        return value === target;
                    });
                }
            }
            return list;
        };
    })
    .filter('disciplineFilter', function() {
        return function(list, target) {
                if (list && target) {
                    var value;
                    return _.filter(list, function(item) {
                        var discipline = target;
                        if (item.disciplinestyleName) {
                            value = item.disciplinestyleName;
                            discipline = discipline.name;
                        } else if (item.disciplinestyleId) {
                            value = item.disciplinestyleId;
                            if (discipline.type === 'Activities') {
                                discipline = discipline.disciplineId;
                            } else {
                                discipline = discipline.subDisciplineId;
                            }
                        }
                        if(_.isArray(value)) {
                            if(_.indexOf(value, discipline) !== -1) {
                                return value;
                            }
                        }
                        return value === discipline;
                    });
                }
            return list;
        };
    });

angular.module('boltApp')
    .filter('isSame', function() {
        return function(list, property, target) {
            return _.filter(list, function(item) {
                var value = item[property];
                return value.isSame(target, 'day');
            });
        };
    })
    .filter('isAfter', function() {
        return function(list, property, target) {
            return _.filter(list, function(item) {
                var value = item[property];
                return moment(value).isAfter(moment(value).hours(target).minutes(0)) || moment(value).isSame(moment(value).hours(target).minutes(0));
            });
        };
    })
    .filter('isBefore', function() {
        return function(list, property, target) {
            return _.filter(list, function(item){
                var value = item[property];
                return moment(value).isBefore(moment(value).hours(target).minutes(0)) || moment(value).isSame(moment(value).hours(target).minutes(0));
            });
        };
    });


