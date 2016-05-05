$(function() {
    Timer.init();
});

var Timer = {
    paused: true,
    timeTillNext: {},
    timeStarted: {},
    timeRemaining: {},
    minute: 60 * 1000,
    bell: document.createElement('audio'),
    init: function () {
        this._bindBtns();
        // Sound = "glass ping"
        Timer.bell.setAttribute('src', 'http://soundbible.com/grab.php?id=2084&type=wav');
        Timer.bell.setAttribute('src', 'http://soundbible.com/grab.php?id=2084&type=mp3');
    },
    _bindBtns: function () {
        $('#btn-break-down').on('click', function() {
          Timer._incremLength('break-len', 'down');
          Timer._reset();
        });
        $('#btn-break-up').on('click', function() {
          Timer._incremLength('break-len');
          Timer._reset();
        });
        $('#btn-session-down').on('click', function() {
          Timer._incremLength('session-len', 'down');
          Timer._reset();
        });
        $('#btn-session-up').on('click', function() {
          Timer._incremLength('session-len');
          Timer._reset();
        });
        $('.circle').on('click', function() {
          if ($('#circleLabel').text() === 'Start')
              Timer._setCountdown();
          else {
              // Pause countdown if it's currently running
              if(Timer.paused === false) {
                  // 'Pause' current countdown.  Note: $(id).countdown('pause') just freezes the countdown html displayed,
                  // but not the actual time.  See https://github.com/hilios/jQuery.countdown/issues/144#issuecomment-146582246)
                  $("#timer").countdown('pause');
                  // Clear timer set for next countdown.
                  clearTimeout(Timer.timeTillNext);
                  // Calculate the time remaining for current countdown
                  var timePaused = new Date().getTime();
                  Timer.timeRemaining = Timer.timeRemaining - (timePaused - Timer.timeStarted);
                  Timer.paused = true;
              // Unpause countdown if it's currently paused
              } else {
                  // Reset current countdown based on time remaining
                  Timer._countdown(Timer.timeRemaining);
                  // Reset timer for the next countdown
                  Timer.timeTillNext = setTimeout( function() {
                      Timer._setCountdown();
                  }, Timer.timeRemaining);
                  Timer.paused = false;
              }
          }
        });
    },
    _incremLength: function (locId, direction = 'up') {
        var currLen = Number($('#' + locId).text());
        var d = 1;
        if (direction === 'down')
            d = -1;
        currLen = Math.max(0, currLen + d);
        $('#' + locId).html(currLen);
    },
    // Set countdown.  Parameter 'length' is in ms
    _countdown: function (timeRemaining) {
        Timer.timeStarted = new Date().getTime();
        var endTime = new Date().setTime(Timer.timeStarted + timeRemaining);
        $("#timer").countdown(endTime, function(event) {
            $(this).text(event.strftime('%H:%M:%S'));
        });
        // Only play bell if the Timer._countdown function was called due to a swap between
        // session and break, not if it was called to unpause.
        if(Timer.paused === false)
            Timer.bell.play();
        Timer.paused = false;
    },
    _setCountdown: function(lenLocId, breakLabel) {
        // Set variables
        var label = $('#circleLabel').text() ;
        var lenLocId = (label === 'Start' || label === 'Break') ? '#session-len': '#break-len';
        var breakLabel = (label === 'Start' || label === 'Break') ? 'Session': 'Break';
        // Set up countdown
        Timer.timeRemaining = Number($(lenLocId).text()) * Timer.minute;
        $('#circleLabel').html(breakLabel);
        Timer._countdown(Timer.timeRemaining);
        // Set timer for the following countdown
        Timer.timeTillNext = setTimeout( function() {
            Timer._setCountdown();
        }, Timer.timeRemaining);
    },
    _reset: function() {
        $('#circleLabel').html('Start');
        clearTimeout(Timer.timeTillNext);
        if(Timer.paused === false)
            $('#timer').countdown('stop');
        $('#timer').html('00:00:00');
        Timer.paused = true;
    }
}
