app.controller('AppCtrl', function($scope) {
    $scope.count = 0;
    $scope.countdownTimers = [{}];

    $scope.addTimer = function() {
        $scope.count++;
        $scope.countdownTimers.push({});
    };

    $scope.removeTimer = function(countdownTimer) {
        $scope.countdownTimers.splice($scope.countdownTimers.indexOf(countdownTimer), 1);
        $scope.reIndex();
    }

});
