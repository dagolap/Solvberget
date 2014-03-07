'use strict';

angular.module('solvbergetinfoScreenwebApp').controller('InstagramCtrl', function ($scope, $rootScope) {

    $rootScope.title = "Instagram feed";
    
    if($scope.template.slideOptions) $scope.tagName = $scope.template.slideOptions.tagName;

    if (!$scope.tagName) $scope.tagName = 'sølvberget';
    $scope.blacklist = $rootScope.instagramBlacklist;
    $scope.whitelist = $rootScope.instagramWhitelist;

    // Configure max post threshold based on slide configuration data.
    $scope.postThreshold = 2;
    if ($scope.template.slideOptions && $scope.template.slideOptions.postThreshold) $scope.postThreshold = $scope.template.slideOptions.postThreshold;
});