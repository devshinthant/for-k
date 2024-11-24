﻿var $window = $(window),
  gardenCtx,
  gardenCanvas,
  $garden,
  garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function () {
  // setup garden
  $loveHeart = $("#loveHeart");
  var offsetX = $loveHeart.width() / 2;
  var offsetY = $loveHeart.height() / 2 - 55;
  $garden = $("#garden");
  gardenCanvas = $garden[0];
  gardenCanvas.width = $("#loveHeart").width();
  gardenCanvas.height = $("#loveHeart").height();
  gardenCtx = gardenCanvas.getContext("2d");
  gardenCtx.globalCompositeOperation = "lighter";
  garden = new Garden(gardenCtx, gardenCanvas);

  // renderLoop
  setInterval(function () {
    garden.render();
  }, Garden.options.growSpeed);
});

$(window).resize(function () {
  var newWidth = $(window).width();
  var newHeight = $(window).height();
  if (newWidth != clientWidth && newHeight != clientHeight) {
    location.replace(location);
  }
});

function getHeartPoint(angle) {
  var t = angle / Math.PI;
  var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
  var y =
    -20 *
    (13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t));
  return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
  var interval = 50;
  var angle = 10;
  var heart = new Array();
  var animationTimer = setInterval(function () {
    var bloom = getHeartPoint(angle);
    var draw = true;
    for (var i = 0; i < heart.length; i++) {
      var p = heart[i];
      var distance = Math.sqrt(
        Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2)
      );
      if (distance < Garden.options.bloomRadius.max * 1.3) {
        draw = false;
        break;
      }
    }
    if (draw) {
      heart.push(bloom);
      garden.createRandomBloom(bloom[0], bloom[1]);
    }
    if (angle >= 30) {
      clearInterval(animationTimer);
      showMessages();
    } else {
      angle += 0.2;
    }
  }, interval);
}

(function ($) {
  $.fn.typewriter = function (callback) {
    this.each(function () {
      var $ele = $(this),
        str = $ele.html(),
        progress = 0;
      $ele.html("");
      var timer = setInterval(function () {
        var current = str.substr(progress, 1);
        if (current == "<") {
          progress = str.indexOf(">", progress) + 1;
        } else {
          progress++;
        }
        $ele.html(str.substring(0, progress) + (progress & 1 ? "_" : ""));
        if (progress >= str.length) {
          clearInterval(timer);
          if (callback) callback(); // Call the callback if provided
        }
      }, 35);
    });
    return this;
  };
})(jQuery);

function timeElapse(startDate) {
  const now = new Date();
  const start = new Date(startDate);
  const seconds = Math.floor((now - start) / 1000);

  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  const result = `
        <span class="digit">${days}</span> days 
        <span class="digit">${hours}</span> hours 
        <span class="digit">${minutes}</span> min
        <span class="digit">${remainingSeconds}</span> sec`;

  $("#elapseClock").html(result);
}

function showMessages() {
  adjustWordsPosition();
  $("#messages").fadeIn(5000);
}

$(document).ready(function () {
  // Start the typewriter animation and then show the images
  $("#code").typewriter(function () {
    $("#images-wrapper").fadeIn(1000); // Show the images-wrapper with a fade-in effect
  });
});

function adjustWordsPosition() {
  $("#words").css("position", "absolute");
  $("#words").css("top", $("#garden").position().top + 240);
  $("#words").css("left", $("#garden").position().left + 100);
}
