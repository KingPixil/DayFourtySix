var score, shots, restartEnabled, d_x, d_y;
init();
var signHit = false;
function init() {
  restarting = false;
  $('.scoreText').text("Click to Shoot");
  score = 0;
  shots = 5;
  d_x = 0;
  d_y = 0;
  restartEnabled = false;
  TweenMax.set(".perspective", {
    perspective: 800
  });
  TweenMax.set(".sign", {
    transformStyle: "preserve-3d"
  });

  TweenMax.to($(".sign"), 2, {
    top: 200,
    ease: Bounce.easeOut,
    yoyo: true,
    repeat: -1,
  });
 moveTargetX();
}

$(".sign").click(
  function(event) {
    signHit = true;
    console.log("Sign Hit")
    if (restartEnabled == true) {
      console.log("restart")
      restart();
      restartEnabled = false;
      return;
    }

    if (shots != 0) {
      --shots;
      if (shots == 0) {
        finish();
      }

      var p = $(this).offset();
      var r_f_x = Math.floor(((p.left + 50 - event.pageX) / 50) * 10);
      var r_f_y = Math.floor(((p.top + 50 - event.pageY) / 50) * 10);
      var h_x = event.pageX - $(this).offset().left;
      var h_y = event.pageY - $(this).offset().top;
      //var h_y = $(this).offset() - event.pageY;
      score += ((10 - Math.abs(r_f_x)) + (10 - Math.abs(r_f_y))) / 2;
      setScore(score.toString(), ((5 - shots) * 10).toString());
      var t_x = 180 * r_f_x
      var t_y = 180 * r_f_y
      d_x -= t_x;
      d_y -= t_y;

      //shot flash
      TweenMax.to($('body'), 0.05, {
        backgroundColor: '#296294',
        ease: Linear.easeNone,
        yoyo: true,
        repeat: 1,
      });

      TweenMax.to($(this), 5, {
        rotationX: d_y,
        rotationY: d_x,
        ease: Elastic.easeOut,
      });

      var newHole = $(".hole").clone().appendTo(".sign");
      newHole.css({
        'left': h_x - 3.5,
        'top': h_y - 3.5,
        'visibility': 'visible'
      });
    }
    setScore();
  }
);

function moveTargetX() {
  TweenMax.to($(".sign"), 2.2, {
    left: 250 - Math.random() * 500,
    ease: Elastic.easeInOut,
    yoyo: true,
    onComplete: moveTargetX
  });
}

function finish() {
  TweenMax.killTweensOf($(".sign"));
  TweenMax.to($(".sign"), 2, {
    left: 0,
    top: 0,
    width: 200,
    ease: Elastic.easeOut,
    onComplete: setRestart
  });
}

function setRestart() {
  restartEnabled = true;
}

function restart() {
  $('.sign .hole').remove();
  TweenMax.to($(".sign"), 5, {
    width: 100,
    rotationX: 0,
    rotationY: 0,
    ease: Power4.easeOut,
    onComplete: init
  });
  $('.scoreText').text("Restarting...");
}

function setScore(u, t) {
  $('.scoreText').text(u.concat(" / " + t));
}
