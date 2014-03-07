'use strict';

angular.module('solvbergetinfoScreenwebApp').controller('MainCtrl', function ($scope, $rootScope, $timeout, $routeParams, slides) {
    // Called after first slide retrieval. Starts a loop where slides are rotated every timeOut second.
    // Each slide defines its own timeout interval.
    $scope.onSlidesReceived = function () {
        $rootScope.instagramBlacklist = $scope.slides.instagramBlacklist;
        $rootScope.instagramWhitelist = $scope.slides.instagramWhitelist;
        $scope.slides = $scope.slides.slides;
        $scope.template=$scope.slides[0];
        $scope.count=0;

        $scope.nextSlide=function(timeOut) {
            $timeout(function() {
                $scope.template = $scope.slides[$scope.count];
                //$scope.templateName = "views/slides/"+$scope.template.template+".html";
                $scope.templateName = "views/slides/instagram.html"; // TODO Fix back
                $scope.count+=1;
                if($scope.count>=$scope.slides.length) {
                    $scope.count=0;
                }
                
                $scope.nextSlide($scope.template.duration * 1000);
            }, timeOut);
        };

        $scope.nextSlide(0);
    };

    // Reloads slides every timeOut milliseconds
    $scope.reloadSlides = function (timeOut, screenId) {
        $timeout(function() {
            slides(screenId).query(
                function (data) {
                    $scope.slides = data.slides;
                    $scope.reloadSlides(timeOut, screenId);
                }
            );
        }, timeOut);
    };

    // Mapper between slide names and

    var screenId = ($routeParams.id) ? $routeParams.id : "default";
    // Load slides and start slideshow

    console.log("screenId = " + screenId);
    
    $scope.slides = slides(screenId).query($scope.onSlidesReceived);

    // Start reload rotation of slides
    $scope.reloadSlides(2 * 60 * 1000, screenId);
    $rootScope.title = "Sølvberget";
});
