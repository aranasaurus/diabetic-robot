var app = angular.module('diabetic-robot', ['ui.bootstrap'], function($routeProvider, $locationProvider) {
  $routeProvider.when('/#food', {
    templateUrl: 'food.html',
    controller: 'FoodController'
  });

  $locationProvider.html5Mode(true);
});

app.controller('FoodController', function ($scope, $filter) {
  $scope.food = {
    carbs: 0,
    notes: "",
    date: $filter('date')(new Date(), "yyyy-MM-dd"),
    time: $filter('date')(new Date(), "hh:mm:ss")
  };
});
