
var WSPlayerMode = {
  live: "live",
  vod: "vod"
}
window.WSPlayerMode = WSPlayerMode;
var WSPlayerState = {
  ready: 0,
  playing: 1,
  pause: 2,
  slow: 3,
  fast: 4,
  end: 5,
  opening: 6,
  closing: 7,
  closed: 255
}
window.WSPlayerState = WSPlayerState;
function WSPlayerProxy (iframe, mode) {
  this.status = WSPlayerState.ready;
  this.mode = mode;
  setInterval(function () {
    if (that.tools) {
      switch (that.status) {
        case WSPlayerState.pause:
        case WSPlayerState.slow:
        case WSPlayerState.fast:
        case WSPlayerState.end:
          that.tools.control.play.className = "play glyphicon glyphicon-play"
          that.tools.control.play.title = "播放"
          if (that.tools.control.center.control)
            that.tools.control.center.control.a.className = "play glyphicon glyphicon-play";
          break;
        case WSPlayerState.playing:
          if (that.mode == WSPlayerMode.vod) {
            that.tools.control.play.className = "play glyphicon glyphicon-pause"
            that.tools.control.play.title = "暂停"
            if (that.tools.control.center.control)
              that.tools.control.center.control.a.className = "play glyphicon glyphicon-pause";
          }
          else {
            that.tools.control.play.className = "play glyphicon glyphicon-stop"
            that.tools.control.play.title = "停止"
            if (that.tools.control.center.control)
              that.tools.control.center.control.a.className = "play glyphicon glyphicon-stop";
          }
          break;
        default:
          break;
      }
    }
  }, 0);


  function postMessage (data) {
    let message = JSON.stringify(data);
    iframe.contentWindow.postMessage(message, '*')
  }

  this.stop = function () {
    postMessage({ command: 'stop' })
  }
  this.play = function () {
    postMessage({ command: 'play' })
  }
  this.seek = function (value) {
    postMessage({ command: 'seek', value: value })
  }
  this.fast = function () {
    postMessage({ command: 'fast' })
  }
  this.slow = function () {
    postMessage({ command: 'slow' })
  }
  this.capturePicture = function () {
    postMessage({ command: 'capturePicture' })
  }
  this.pause = function () {
    postMessage({ command: 'pause' })
  }
  this.speedResume = function () {
    postMessage({ command: 'speedResume' })
  }
  this.resume = function () {
    postMessage({ command: 'resume' })
  }
  this.frame = function () {
    postMessage({ command: 'frame' })
  }
  this.fullScreen = function () {
    postMessage({ command: 'fullScreen' })
  }
  this.resize = function (width, height) {
    postMessage({ command: 'resize', width: width, height: height })
  }
  this.fullExit = function () {
    postMessage({ command: 'fullExit' })
  }
  this.download = function (filename, type) {
    postMessage({ command: 'download', filename: filename, type: type })
  }
  this.openSound = function () {
    postMessage({ command: 'openSound' })
  }
  this.closeSound = function () {
    postMessage({ command: 'closeSound' })
  }
  this.getVolume = function () {
    postMessage({ command: 'getVolume' })
  }
  this.setVolume = function (value) {
    postMessage({ command: 'getVolume', value: value })
  }
  this.getCapturePictureData = function () {
    if (that.onCapturePicture) {
      postMessage({ command: 'getCapturePictureData' })
    }
  }

  this.destory = function () {
    if (this.isFullScreen) {
      this.exitfullscreen();
    }
    window.removeEventListener("message", registevent);
    document.removeEventListener("webkitfullscreenchange", webkitfullscreenchange);
    if (that.tools) {
      that.tools.destory();
    }
  }
  this.onFullScreenChanged;
  this.onStoping;
  this.getPosition;
  this.onPlaying;
  this.onButtonClicked;
  this.onViewerDoubleClicked;
  this.onCapturePicture;
  this.tools;

  var that = this;


  function stringToUint8Array (str) {
    var arr = [];
    for (var i = 0, j = str.length; i < j; ++i) {
      arr.push(str.charCodeAt(i));
    }

    var tmpUint8Array = new Uint8Array(arr);
    return tmpUint8Array
  }

  function isIOS () {
    const u = navigator.userAgent;
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    ///
    // ios终端
    // alert('是否是Android：'+isAndroid);
    // alert('是否是iOS：'+isiOS);
    return isiOS;
  }

  function registevent (e) {
    if (e && e.data) {

      let data = JSON.parse(e.data)
      switch (data.command) {
        case "onCapturePicture":

          if (that.isFullScreen) {
            that.exitfullscreen();
          }


          if (that.onCapturePicture) {
            let blob = new Blob([new Uint8Array(data.data)]);
            const reader = new FileReader();
            reader.readAsDataURL(blob);

            reader.onload = e => {

              let str = e.target.result;
              ///str = str.replace("data:application/octet-stream;base64", "data:image/jpeg;base64")
              console.log(str);
              that.onCapturePicture(str);
            }
            // }



          }
          break;
        case "onStoping":
          if (that.onStoping) {
            that.onStoping();
          }
          break;
        case "onPlaying":
          if (that.onPlaying) {
            that.onPlaying();
          }
          break;
        case "getPosition":
          if (that.getPosition) {
            that.getPosition(parseFloat(data.value));
          }
          if (that.tools) {
            (function (val) {
              setTimeout(function () {

                var valStr = parseFloat(val) * 100 + "% 100%";
                that.tools.control.position.style.backgroundSize = valStr;
              })
            })(data.value)
          }
          break;
        case "getTimer":
          if (that.getTimer) {
            that.getTimer(data.value);
          }
          if (that.tools) {
            (function (val) {
              setTimeout(function () {
                that.tools.control.position.min = val.min;
                that.tools.control.position.max = val.max;
                let end = new Date(val.max - val.min);
                end.setUTCHours(end.getUTCHours() - 8);
                that.tools.control.end_time.innerText = end.format("HH:mm:ss");
                that.tools.control.position.value = val.current;
                let current = new Date(val.current - val.min);
                current.setUTCHours(current.getUTCHours() - 8);
                that.tools.control.begin_time.innerText = current.format("HH:mm:ss");
              });
            })(data.value)
          }
          break;
        case "onButtonClicked":
          if (that.onButtonClicked) {
            that.onButtonClicked(data.value);
          }
          break;
        case "onViewerDoubleClicked":
          if (that.onViewerDoubleClicked) {
            that.onViewerDoubleClicked();
          }
          break;
        case "onStatusChanged":
          that.status = data.value;
          if (that.onStatusChanged) {
            that.onStatusChanged(data.value);
          }
          break;
        default:
          break;
      }
    }
  }


  window.addEventListener("message", registevent);

  function webkitfullscreenchange () {
    if (that.onFullScreenChanged) {
      that.onFullScreenChanged();
    }
  }


  document.addEventListener('webkitfullscreenchange', webkitfullscreenchange);

  this.toolsBinding = function (tools) {
    that.tools = tools;
    initTools();
  }
  function initTools () {
    that.tools.event.onPlayControlClciked = function (e) {
      switch (that.status) {
        case WSPlayerState.ready:
          that.play();
          break;
        case WSPlayerState.end:
          that.seek(0);
          that.resume();
          break;
        case WSPlayerState.fast:
        case WSPlayerState.slow:
          //that.play();
          that.speedResume();
          break;
        case WSPlayerState.pause:
          that.resume();
          break;
        case WSPlayerState.playing:
          if (that.mode == WSPlayerMode.vod) {
            that.pause();
          }
          else {
            that.stop();
          }

          break;
        default:
          break;
      }
    }
    if (that.tools.control.center.control) {
      that.tools.control.center.control.a.addEventListener("click", function () {
        switch (that.status) {
          case WSPlayerState.ready:
            that.play();
            break;
          case WSPlayerState.end:
            that.seek(0);
            that.resume();
            break;
          case WSPlayerState.fast:
          case WSPlayerState.slow:
            //that.play();
            that.speedResume();
            break;
          case WSPlayerState.pause:
            that.resume();
            break;
          case WSPlayerState.playing:
            if (that.mode == WSPlayerMode.vod) {
              that.pause();
            }
            else {
              that.stop();
            }

            break;
          default:
            break;
        }

      });
    }

    if (that.tools.control.stop) {
      that.tools.control.stop.addEventListener("click", function () {
        if (that.status == WSPlayerState.ready)
          return;
        that.stop();
      });
    }
    if (that.tools.control.fullscreen) {
      that.tools.control.fullscreen.addEventListener("click", function () {
        if (that.status == WSPlayerState.ready)
          return;
        if (that.onButtonClicked) {
          that.onButtonClicked("fullscreen")
        }
      });
    }

    if (that.tools.control.capturepicture) {
      that.tools.control.capturepicture.addEventListener("click", function () {
        if (that.status == WSPlayerState.ready)
          return;

        that.getCapturePictureData();
        //that.capturePicture();

      });
    }




    if (that.tools.control.position) {
      that.tools.control.position.addEventListener("touchstart", function (e) {
        if (that.status == WSPlayerState.ready)
          return;
        that.pause();
        that.tools.control.isMoudseDown = true;
      });
      that.tools.control.position.addEventListener("touchend", function (e) {
        if (that.status == WSPlayerState.ready)
          return;
        that.tools.control.isMoudseDown = false;
        var value = that.tools.control.position.value - that.tools.control.position.min;
        that.seek(value);
        that.resume();
      });
      that.tools.control.position.addEventListener("touchmove", function (evt) {

        if (that.status == WSPlayerState.ready)
          return;

        onPositionMove(evt);

      });
    }

  }

  function onPositionMove (evt) {
    try {

      if (!evt || !evt.changedTouches || evt.changedTouches.length <= 0) return;

      var width = evt.target.offsetWidth;
      var x = evt.changedTouches[0].clientX - evt.target.offsetLeft;

      var p = x / width;
      if (p > 1 || p < 0) return;

      var c = that.tools.control.position.max - that.tools.control.position.min;
      var current = c * p;
      if (current < 0)
        current = 0;
      var date = new Date(current);
      date.setUTCHours(date.getUTCHours() - 8);
      this.title = date.format("HH:mm:ss");
      if (that.tools.control.isMoudseDown)
        that.tools.control.begin_time.innerText = date.format("HH:mm:ss");
    } finally {
      evt.stopPropagation();
    }
  }



  this.isFullScreen = false;

  this.fullscreen = function (element) {
    if (element.RequestFullScreen) {
      element.RequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else {
      console.error("This browser doesn't supporter fullscreen");
      setTimeout(() => {
        webkitfullscreenchange();
      }, 0);
    }
    this.isFullScreen = true;
  }

  this.exitfullscreen = function () {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else {
      console.error("Exit fullscreen doesn't work");
      setTimeout(() => {
        webkitfullscreenchange();
      }, 0);
    }
    this.isFullScreen = false;
  }




}
window.WSPlayerProxy = WSPlayerProxy;


function PlayerTools (element, mode) {

  var timer = {
    animation: 0,
    display: 0,
    visibility: 0
  };

  var _visibility = undefined;
  this.__defineGetter__("visibility", function () {
    return _visibility;
  });
  this.__defineSetter__("visibility", function (val) {
    if (_visibility === val) {
      return
    }
    _visibility = val;

    if (_visibility) {
      if (timer.visibility) {
        clearTimeout(timer.visibility);
      }
      if (timer.animation) {
        clearTimeout(timer.animation);
      }
      if (timer.display) {
        clearTimeout(timer.display);
      }
      that_tools.control.content.style.display = ""
      that_tools.control.content.style.animation = "";
    } else {
      timer.display = setTimeout(function () {
        that_tools.control.content.style.display = "none";
      }, 0.5 * 1000);
      timer.animation = setTimeout(function () {
        that_tools.control.content.style.animation = "anim-out 1s";
      }, 0);
    }


  });

  this.control = {
    center_play: null,
    top: null,
    center: {
      div: null,
      control: {
        background: null,
        a: null
      },
      position: {
        background: null,
        begin: null,
        end: null
      }
    },
    bottom: null,
    content: null,
    play: null,
    stop: null,
    pause: null,
    forward: null,
    fast: null,
    slow: null,

    begin_time: null,
    end_time: null,
    position: null,
    fullscreen: null,
    capturepicture: null,
    jump_forward: null,
    jump_back: null,
    volume: {
      icon: null,
      panel: null,
      slide: null,
      value: 0
    }

  }


  var tools = document.createElement("div");
  tools.className = "tools";
  this.element = tools;
  //tools.style.display = "none";
  element.appendChild(tools);

  this.control.content = document.createElement("div");
  this.control.content.className = "tools-content"
  tools.appendChild(this.control.content);

  // element.addEventListener("mouseover", function(){
  //     tools.style.display = ""
  // });

  // element.addEventListener("mouseout", function(){
  //     tools.style.display = "none"
  // });
  display = false;


  var that_tools = this;

  this.destory = function () {
    tools.parentElement.removeChild(tools);
  }

  function createElement (ul, type, li_styles, ctr_params, ctr_styles) {
    var li = document.createElement("li");
    if (li_styles) {
      for (const key in li_styles) {
        li.style[key] = li_styles[key];
      }
    }
    ul.appendChild(li);


    var ctr = document.createElement(type);
    if (ctr_params) {
      for (const key in ctr_params) {
        ctr[key] = ctr_params[key]
      }
    }
    if (ctr_styles) {
      for (const key in ctr_styles) {
        ctr.style[key] = ctr_styles[key];
      }
    }
    li.appendChild(ctr);
    return ctr;
  }





  this.createElements = function () {

    that_tools.control.up = document.createElement("div")
    that_tools.control.up.className = "up";
    that_tools.control.content.appendChild(that_tools.control.up);

    that_tools.control.center.div = document.createElement("div")
    that_tools.control.center.div.className = "center";
    that_tools.control.content.appendChild(that_tools.control.center.div);




    that_tools.control.bottom = document.createElement("div");
    that_tools.control.bottom.className = "bottom";
    that_tools.control.content.appendChild(that_tools.control.bottom);

    var ul = document.createElement("ul");
    that_tools.control.bottom.appendChild(ul);


    that_tools.control.play = createElement(ul, "a", { width: "40px" }, { className: "play glyphicon glyphicon-play", title: "播放" });

    that_tools.control.begin_time = createElement(ul, "label", { width: "60px" }, {
      className: "begin_time",
      innerText: "00:00:00",
      title: "当前时间"
    });
    that_tools.control.position = createElement(ul, "input", { width: "calc(100% - 231px)" }, {
      className: "position",
      title: "00:00:00",
      type: "range"
    });
    that_tools.control.position.min = 0;
    that_tools.control.position.max = 1;
    that_tools.control.position.value = 0;
    that_tools.control.end_time = createElement(ul, "label", { width: "60px" }, { className: "end_time", title: "结束时间", innerText: "00:00:00", });




    that_tools.control.fullscreen = createElement(ul, "a", { float: "right" }, { className: "fullscreen glyphicon glyphicon-fullscreen", title: "全屏" });
    that_tools.control.capturepicture = createElement(ul, "a", { float: "right" }, { className: "capturepicture glyphicon glyphicon-picture", title: "截图" });




    if (mode == WSPlayerMode.live) {
      // //that_tools.control.stop.style.display = "none";
      // that_tools.control.slow.style.display = "none";
      // that_tools.control.fast.style.display = "none";
      // //that_tools.control.forward.style.display = "none";

      // that_tools.control.jump_back.style.display = "none";
      // that_tools.control.jump_forward.style.display = "none";


      that_tools.control.begin_time.style.display = "none";
      that_tools.control.position.style.display = "none";
      that_tools.control.end_time.style.display = "none";

    } else {
      that_tools.control.center.control.background = document.createElement("div");
      that_tools.control.center.control.a = document.createElement("i")
      that_tools.control.center.control.a.className = "play glyphicon glyphicon-play";
      that_tools.control.center.control.background.appendChild(that_tools.control.center.control.a);
      that_tools.control.center.div.appendChild(that_tools.control.center.control.background);


      that_tools.control.center.position.background = document.createElement("div");
      that_tools.control.center.position.background.style.display = "none";
      that_tools.control.center.position.begin = document.createElement("label");
      that_tools.control.center.position.begin.innerText = that_tools.control.begin_time.innerText;
      that_tools.control.center.position.background.appendChild(that_tools.control.center.position.begin);
      that_tools.control.center.position.background.innerHTML += "&nbsp;/&nbsp;";
      that_tools.control.center.position.end = document.createElement("label");
      that_tools.control.center.position.end.innerText = that_tools.control.end_time.innerText;
      that_tools.control.center.position.background.appendChild(that_tools.control.center.position.end);

      that_tools.control.center.div.appendChild(that_tools.control.center.position.background);



    }

    registEvent();


    timer.visibility = setTimeout(() => {
      that_tools.visibility = false;
      console.log("init:", that_tools.visibility)
    }, 0);

  };

  function registEvent () {
    if (that_tools.control.position) {
      that_tools.control.position.addEventListener("input", function () {
        var value = (this.value - this.min) / (this.max - this.min);

        var valStr = value * 100 + "% 100%";
        this.style.backgroundSize = valStr;
      });
    }

    if (that_tools.element) {
      that_tools.element.addEventListener("touchstart", function () {

        that_tools.visibility = !that_tools.visibility;
        console.log("touchstart:", that_tools.visibility)
      });
      that_tools.element.addEventListener("touchmove", function (evt) {
        that_tools.visibility = true;
        that_tools.control.center.position.background.display = "";
        onPositionMove(evt);
      });
      that_tools.element.addEventListener("touchend", function () {
        that_tools.control.center.position.background.display = "none";
        timer.visibility = setTimeout(() => {
          that_tools.visibility = false;
          console.log("touchend:", that_tools.visibility)
        }, 5 * 1000);
      });
    }

    if (that_tools.control.play) {
      that_tools.control.play.addEventListener("click", function (e) {
        if (that_tools.event.onPlayControlClciked) {
          that_tools.event.onPlayControlClciked(e);
        }
      });
    }
    if (that_tools.control.center.control) { }


  }

  this.event = {
    onPlayControlClciked: function (e) { },
    onStopControlClicked: function (e) { },
    onFullscreenControlClicked: function (e) { },
    onCapturepictureControlClicked: function (e) { },
    onPositionControlTouchstart: function (e) { },
    onPositionControlTouchend: function (e) { },
    onPositionControlTouchmove: function (e) { },
    onCenterPlayControlClicked: function (e) { },
    onCenterPositionControlTouchstart: function (e) { },
    onCenterPositionControlTouchend: function (e) { },
    onCenterPositionControlTouchmove: function (e) { },
  }





  this.binding = function (player) {

    player.getPosition = function (val) {

      //that_tools.control.position.value = val;
      var valStr = parseFloat(val) * 100 + "% 100%";
      that_tools.control.position.style.backgroundSize = valStr;
    }
    player.getTimer = function (val) {

      that_tools.control.position.min = val.min;
      that_tools.control.position.max = val.max;
      that_tools.control.end_time.innerText = new Date(val.max - val.min).format("HH:mm:ss");
      that_tools.control.position.value = val.current;
      that_tools.control.begin_time.innerText = new Date(val.current - val.min).format("HH:mm:ss");
    }
  }

}
window.PlayerTools = PlayerTools;

