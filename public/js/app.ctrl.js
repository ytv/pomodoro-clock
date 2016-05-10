app.controller('AppCtrl', function($scope) {
    $scope.count = 0;
    $scope.countdownTimers = [{index: 0}];

    $scope.addTimer = function() {
        $scope.count++;
        $scope.countdownTimers.push({index: $scope.count});
    };

    $scope.reIndex = function() {
        for (var i = 0; i < $scope.countdownTimers.length; i++) {
            $scope.countdownTimers[i].index = i;
        }
    };

    $scope.removeTimer = function(index) {
        $scope.countdownTimers.splice(index, 1);
        $scope.reIndex();
    }

});
