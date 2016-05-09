var app = angular.module('app', []);

app.filter('secondsToTime', function() {
    return function(seconds) {
        var d = new Date(0,0,0,0,0,0,0);
        d.setSeconds(seconds);
        return d;
    };
});

app.controller('ctrl', function($scope, $timeout) {
    // Initialize variables
    var minute = 60;
    var paused = true;
    var bell= document.createElement('audio');
    bell.setAttribute('src', 'http://soundbible.com/grab.php?id=2084&type=wav');

    $scope.length = {
        break: 5,
        session: 25
    };
    $scope.labels = {
        start: 'Start',
        session: 'Session',
        break: 'Break'
    };
    $scope.timerLabel = $scope.labels.start;
    $scope.timer = $scope.length.session * minute;

    // Acts as the "control" for the countdown, determining the countdown's behavior
    // everytime it's clicked on (i.e. starting, pausing,and resuming)
    $scope.timerControl = function () {
        // start countdown
        if($scope.timerLabel === $scope.labels.start && paused === true) {
            $scope.setUpNextCountdown($scope.length.session * minute, $scope.labels.session);
        // pause countdown
        } else if(paused === false) {
            $timeout.cancel(countdown);
            paused = true;
        // resume countdown
        } else {
            $scope.countdown();
            paused = false;
        }
    };

    // Re-initializes variables for the next countdown
    $scope.setUpNextCountdown = function(length, label) {
        $scope.timer = length;
        $scope.timerLabel = label;
        $scope.countdown();
        bell.play();
        paused = false;
    };

    // Function for the actual countdown
    var countdown;
    $scope.countdown = function() {
        countdown = $timeout(function () {
            $scope.timer--;
            if ($scope.timer > 0)
                $scope.countdown();
            // Calls set up for the next countdown
            else {
                $timeout.cancel(countdown);
                if($scope.timerLabel === $scope.labels.session) {
                    $scope.setUpNextCountdown($scope.length.break * minute, $scope.labels.break);
                } else {
                    $scope.setUpNextCountdown($scope.length.session * minute, $scope.labels.session);
                }
            }
        }, 1000);
    };

    // Resets variables and countdown
    $scope.reset = function() {
        $timeout.cancel(countdown);
        $scope.timerLabel = "Start";
        $scope.timer = 0;
        paused = true;
    }
});
