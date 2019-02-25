! function() {
  "use strict";

  function t(e, r) {
    function i(t, e) {
      return function() {
        return t.apply(e, arguments)
      }
    }
    var o;
    if (r = r || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = r.touchBoundary || 10, this.layer = e, this.tapDelay = r.tapDelay || 200, this.tapTimeout = r.tapTimeout || 700, !t.notNeeded(e)) {
      for (var s = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], a = this, u = 0, c = s.length; u < c; u++) a[s[u]] = i(a[s[u]], a);
      n && (e.addEventListener("mouseover", this.onMouse, !0), e.addEventListener("mousedown", this.onMouse, !0), e.addEventListener("mouseup", this.onMouse, !0)), e.addEventListener("click", this.onClick, !0), e.addEventListener("touchstart", this.onTouchStart, !1), e.addEventListener("touchmove", this.onTouchMove, !1), e.addEventListener("touchend", this.onTouchEnd, !1), e.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (e.removeEventListener = function(t, n, r) {
        var i = Node.prototype.removeEventListener;
        "click" === t ? i.call(e, t, n.hijacked || n, r) : i.call(e, t, n, r)
      }, e.addEventListener = function(t, n, r) {
        var i = Node.prototype.addEventListener;
        "click" === t ? i.call(e, t, n.hijacked || (n.hijacked = function(t) {
          t.propagationStopped || n(t)
        }), r) : i.call(e, t, n, r)
      }), "function" == typeof e.onclick && (o = e.onclick, e.addEventListener("click", function(t) {
        o(t)
      }, !1), e.onclick = null)
    }
  }
  var e = navigator.userAgent.indexOf("Windows Phone") >= 0,
    n = navigator.userAgent.indexOf("Android") > 0 && !e,
    r = /iP(ad|hone|od)/.test(navigator.userAgent) && !e,
    i = r && /OS 4_\d(_\d)?/.test(navigator.userAgent),
    o = r && /OS [6-7]_\d/.test(navigator.userAgent),
    s = navigator.userAgent.indexOf("BB10") > 0;
  t.prototype.needsClick = function(t) {
    switch (t.nodeName.toLowerCase()) {
      case "button":
      case "select":
      case "textarea":
        if (t.disabled) return !0;
        break;
      case "input":
        if (r && "file" === t.type || t.disabled) return !0;
        break;
      case "label":
      case "iframe":
      case "video":
        return !0
    }
    return /\bneedsclick\b/.test(t.className)
  }, t.prototype.needsFocus = function(t) {
    switch (t.nodeName.toLowerCase()) {
      case "textarea":
        return !0;
      case "select":
        return !n;
      case "input":
        switch (t.type) {
          case "button":
          case "checkbox":
          case "file":
          case "image":
          case "radio":
          case "submit":
            return !1
        }
        return !t.disabled && !t.readOnly;
      default:
        return /\bneedsfocus\b/.test(t.className)
    }
  }, t.prototype.sendClick = function(t, e) {
    var n, r;
    document.activeElement && document.activeElement !== t && document.activeElement.blur(), r = e.changedTouches[0], n = document.createEvent("MouseEvents"), n.initMouseEvent(this.determineEventType(t), !0, !0, window, 1, r.screenX, r.screenY, r.clientX, r.clientY, !1, !1, !1, !1, 0, null), n.forwardedTouchEvent = !0, t.dispatchEvent(n)
  }, t.prototype.determineEventType = function(t) {
    return n && "select" === t.tagName.toLowerCase() ? "mousedown" : "click"
  }, t.prototype.focus = function(t) {
    var e;
    r && t.setSelectionRange && 0 !== t.type.indexOf("date") && "time" !== t.type && "month" !== t.type ? (e = t.value.length, t.setSelectionRange(e, e)) : t.focus()
  }, t.prototype.updateScrollParent = function(t) {
    var e, n;
    if (e = t.fastClickScrollParent, !e || !e.contains(t)) {
      n = t;
      do {
        if (n.scrollHeight > n.offsetHeight) {
          e = n, t.fastClickScrollParent = n;
          break
        }
        n = n.parentElement
      } while (n)
    }
    e && (e.fastClickLastScrollTop = e.scrollTop)
  }, t.prototype.getTargetElementFromEventTarget = function(t) {
    return t.nodeType === Node.TEXT_NODE ? t.parentNode : t
  }, t.prototype.onTouchStart = function(t) {
    var e, n, o;
    if (t.targetTouches.length > 1) return !0;
    if (e = this.getTargetElementFromEventTarget(t.target), n = t.targetTouches[0], r) {
      if (o = window.getSelection(), o.rangeCount && !o.isCollapsed) return !0;
      if (!i) {
        if (n.identifier && n.identifier === this.lastTouchIdentifier) return t.preventDefault(), !1;
        this.lastTouchIdentifier = n.identifier, this.updateScrollParent(e)
      }
    }
    return this.trackingClick = !0, this.trackingClickStart = t.timeStamp, this.targetElement = e, this.touchStartX = n.pageX, this.touchStartY = n.pageY, t.timeStamp - this.lastClickTime < this.tapDelay && t.preventDefault(), !0
  }, t.prototype.touchHasMoved = function(t) {
    var e = t.changedTouches[0],
      n = this.touchBoundary;
    return Math.abs(e.pageX - this.touchStartX) > n || Math.abs(e.pageY - this.touchStartY) > n
  }, t.prototype.onTouchMove = function(t) {
    return !this.trackingClick || ((this.targetElement !== this.getTargetElementFromEventTarget(t.target) || this.touchHasMoved(t)) && (this.trackingClick = !1, this.targetElement = null), !0)
  }, t.prototype.findControl = function(t) {
    return void 0 !== t.control ? t.control : t.htmlFor ? document.getElementById(t.htmlFor) : t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
  }, t.prototype.onTouchEnd = function(t) {
    var e, s, a, u, c, l = this.targetElement;
    if (!this.trackingClick) return !0;
    if (t.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0, !0;
    if (t.timeStamp - this.trackingClickStart > this.tapTimeout) return !0;
    if (this.cancelNextClick = !1, this.lastClickTime = t.timeStamp, s = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, o && (c = t.changedTouches[0], l = document.elementFromPoint(c.pageX - window.pageXOffset, c.pageY - window.pageYOffset) || l, l.fastClickScrollParent = this.targetElement.fastClickScrollParent), a = l.tagName.toLowerCase(), "label" === a) {
      if (e = this.findControl(l)) {
        if (this.focus(l), n) return !1;
        l = e
      }
    } else if (this.needsFocus(l)) return t.timeStamp - s > 100 || r && window.top !== window && "input" === a ? (this.targetElement = null, !1) : (this.focus(l), this.sendClick(l, t), r && "select" === a || (this.targetElement = null, t.preventDefault()), !1);
    return !(!r || i || (u = l.fastClickScrollParent, !u || u.fastClickLastScrollTop === u.scrollTop)) || (this.needsClick(l) || (t.preventDefault(), this.sendClick(l, t)), !1)
  }, t.prototype.onTouchCancel = function() {
    this.trackingClick = !1, this.targetElement = null
  }, t.prototype.onMouse = function(t) {
    return !this.targetElement || (!!t.forwardedTouchEvent || (!t.cancelable || (!(!this.needsClick(this.targetElement) || this.cancelNextClick) || (t.stopImmediatePropagation ? t.stopImmediatePropagation() : t.propagationStopped = !0, t.stopPropagation(), t.preventDefault(), !1))))
  }, t.prototype.onClick = function(t) {
    var e;
    return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === t.target.type && 0 === t.detail || (e = this.onMouse(t), e || (this.targetElement = null), e)
  }, t.prototype.destroy = function() {
    var t = this.layer;
    n && (t.removeEventListener("mouseover", this.onMouse, !0), t.removeEventListener("mousedown", this.onMouse, !0), t.removeEventListener("mouseup", this.onMouse, !0)), t.removeEventListener("click", this.onClick, !0), t.removeEventListener("touchstart", this.onTouchStart, !1), t.removeEventListener("touchmove", this.onTouchMove, !1), t.removeEventListener("touchend", this.onTouchEnd, !1), t.removeEventListener("touchcancel", this.onTouchCancel, !1)
  }, t.notNeeded = function(t) {
    var e, r, i, o;
    if ("undefined" == typeof window.ontouchstart) return !0;
    if (r = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
      if (!n) return !0;
      if (e = document.querySelector("meta[name=viewport]")) {
        if (e.content.indexOf("user-scalable=no") !== -1) return !0;
        if (r > 31 && document.documentElement.scrollWidth <= window.outerWidth) return !0
      }
    }
    if (s && (i = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/), i[1] >= 10 && i[2] >= 3 && (e = document.querySelector("meta[name=viewport]")))) {
      if (e.content.indexOf("user-scalable=no") !== -1) return !0;
      if (document.documentElement.scrollWidth <= window.outerWidth) return !0
    }
    return "none" === t.style.msTouchAction || "manipulation" === t.style.touchAction || (o = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1], !!(o >= 27 && (e = document.querySelector("meta[name=viewport]"), e && (e.content.indexOf("user-scalable=no") !== -1 || document.documentElement.scrollWidth <= window.outerWidth))) || ("none" === t.style.touchAction || "manipulation" === t.style.touchAction))
  }, t.attach = function(e, n) {
    return new t(e, n)
  }, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
    return t
  }) : "undefined" != typeof module && module.exports ? (module.exports = t.attach, module.exports.FastClick = t) : window.FastClick = t
}(),
function() {
  "use strict";
  ! function() {
    var t, e;
    if (e = document.body, window.Uno = t = {
        version: "3.3.4",
        is: function(t, n) {
          return Array.isArray(n) ? n.some(function(n) {
            return e.dataset[t] === n
          }) : e.dataset[t] === n
        },
        attr: function(t, n) {
          return null != n ? e.dataset[t] = n : e.dataset[t]
        },
        animate: function(e, n) {
          return t.overlayAnimation(n), t.timeAgo(e, n)
        },
        context: function() {
          var t;
          return t = e.className.split(" ")[0].split("-")[0], "" === t ? "error" : t
        },
        linkify: function(t) {
          return t.each(function() {
            var t, e, n;
            return t = $(this), n = t.text(), e = t.attr("id"), t.html(""), t.addClass("deep-link"), t.append("<a href=#" + e + ' class="title-link">' + n + "</a>")
          })
        },
        search: {
          form: function() {
            var t;
            return t = $("#search-container"),
              function(e) {
                return t[e]()
              }
          }(),
          render: function() {
            var e, n, r, i, o, s, a;
            return e = $("#algolia"), n = $("#posts-headline"), r = n.html(), i = $("#posts-list"), o = i.html(), s = function() {
                return n.html(r), i.html(o), e.hide(), t.attr("page", t.context()), t.animate("#posts-list time")
              }, a = function(t) {
                var e;
                return e = '<li class="post-item">\n  <a class="post-link" style="background-image:url(\'' + t.image + '\');" href="' + t.url + '" title="Read more about \'' + t.title + '\'">\n  <div class="dimmer-mark"></div>\n  <h1 class="post-title hits">' + t.title + '</h1>\n  <time class="post-time" datetime="' + t.prettydate + '">' + t.prettydate + '</time>\n  </a>\n  <div class="post-tags">', e + t.tags.reduce(function(t, e) {
                  return t + ('<a class="hits" href="/tag/' + e + '/">' + e + "</a>") + " "
                }, "") + "</div></li>"
              },
              function(r) {
                return "" === r ? s() : algoliaIndex.search(r, function(o, u) {
                  return o ? console.error(o) : u.query !== r ? s() : (t.attr("page", "search"), n.html("Posts related found: " + u.hits.length), i.html(u.hits.reduce(function(t, e) {
                    return e._highlightResult.title && (e.title = e._highlightResult.title.value), e._highlightResult.category && (e.tags = e._highlightResult.category, Array.isArray(e.tags) ? e.tags = e.tags.map(function(t) {
                      return t.value
                    }) : e.tags = [e.tags.value]), t + a(e)
                  }, "")), e.show(), t.animate("#posts-list time", i))
                })
              }
          }()
        },
        timeAgo: function(t, e) {
          return $(t, e).each(function() {
            var t, e, n;
            return e = $(this).html(), n = Math.floor((Date.now() - new Date(e)) / 864e5), 0 === n ? n = "today" : 1 === n ? n = "yesterday" : n += " days ago", t = $(this), t.html(n), t.mouseover(function() {
              return t.html(e)
            }), t.mouseout(function() {
              return t.html(n)
            })
          })
        },
        overlayAnimation: function(t) {
          var e, n, r;
          return r = $(".post-title", t), n = $(".post-time", t), e = $(".post-tags", t), r.on("mouseenter mouseleave", function(t) {
            return $(this).prev().toggleClass("dimmer-mark-hover")
          }), n.on("mouseenter mouseleave", function(t) {
            return $(this).prev().prev().toggleClass("dimmer-mark-hover")
          }), e.on("mouseenter mouseleave", function(t) {
            return $(this).prev().children().first().toggleClass("dimmer-mark-hover")
          })
        },
        infiniteScroll: function(e) {
          var n, r, i, o, s;
          if (window.infinite_scroll) return o = .4, s = location.origin + location.pathname, r = !1, n = function() {
            return e.currentPage < e.maxPage
          }, i = function() {
            return s + "page/" + ++e.currentPage
          }, $(window).scroll(function() {
            var s, a, u;
            if (!t.is("page", "search")) return u = $(window).scrollTop(), s = e.context[0].offsetHeight, s -= s * o, a = u > s, n() && a && !r ? (r = !0, $.get(i(), function(n) {
              var i;
              return i = $(n).find(e.childrenSelector), t.animate("#posts-list time", i), e.context.append(i), r = !1
            })) : void 0
          })
        },
        readingProgress: function() {
          var t, n, r, i, o;
          return t = e, r = .1 * window.innerHeight, i = $("#post-related"), n = function() {
            var e, n, i;
            return e = t.scrollTop, i = t.scrollHeight - t.clientHeight, n = (e + r) / i * 100, n > 100 ? 100 : n
          }, o = function() {
            var t, e;
            return e = n(), Pace.bar.update(e), t = e > 75 ? "add" : "remove", i[t + "Class"]("active")
          }, Pace.stop(), o(), $(window).scroll(o)
        },
        device: function() {
          var t, e;
          return e = window.innerWidth, t = window.innerHeight, e <= 480 ? "mobile" : e <= 1024 ? "tablet" : "desktop"
        }
      }, t.attr("page", t.context()), t.attr("device", t.device()), null == window.open_button && (window.open_button = ".nav-posts > a"), null == window.infinite_scroll && (window.infinite_scroll = !0), null == window.posts_headline && (window.posts_headline = !0), window.profile_title && $("#profile-title").text(window.profile_title), window.profile_resume && $("#profile-resume").text(window.profile_resume), window.posts_headline ? "string" == typeof window.posts_headline && $("#posts-headline").text(window.posts_headline) : $("#posts-headline").hide(), window.infinite_scroll) return $("#pagination").hide()
  }()
}.call(this),
  function() {
    var t, e, n, r, i, o, s, a, u, c, l, d, h, f, p, g, m, v, y, w, k, b, T, E, C, S, x, L, A, M, P, $, O, N, _, q, R, D, H, U, j, F, Y, I, W, X, B, z, G, K = [].slice,
      V = {}.hasOwnProperty,
      J = function(t, e) {
        function n() {
          this.constructor = t
        }
        for (var r in e) V.call(e, r) && (t[r] = e[r]);
        return n.prototype = e.prototype, t.prototype = new n, t.__super__ = e.prototype, t
      },
      Q = [].indexOf || function(t) {
        for (var e = 0, n = this.length; n > e; e++)
          if (e in this && this[e] === t) return e;
        return -1
      };
    for (k = {
        catchupTime: 100,
        initialRate: .03,
        minTime: 250,
        ghostTime: 100,
        maxProgressPerFrame: 20,
        easeFactor: 1.25,
        startOnPageLoad: !0,
        restartOnPushState: !0,
        restartOnRequestAfter: 500,
        target: "body",
        elements: {
          checkInterval: 100,
          selectors: ["body"]
        },
        eventLag: {
          minSamples: 10,
          sampleCount: 3,
          lagThreshold: 3
        },
        ajax: {
          trackMethods: ["GET"],
          trackWebSockets: !0,
          ignoreURLs: []
        }
      }, A = function() {
        var t;
        return null != (t = "undefined" != typeof performance && null !== performance && "function" == typeof performance.now ? performance.now() : void 0) ? t : +new Date
      }, P = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame, w = window.cancelAnimationFrame || window.mozCancelAnimationFrame, null == P && (P = function(t) {
        return setTimeout(t, 50)
      }, w = function(t) {
        return clearTimeout(t)
      }), O = function(t) {
        var e, n;
        return e = A(), (n = function() {
          var r;
          return r = A() - e, r >= 33 ? (e = A(), t(r, function() {
            return P(n)
          })) : setTimeout(n, 33 - r)
        })()
      }, $ = function() {
        var t, e, n;
        return n = arguments[0], e = arguments[1], t = 3 <= arguments.length ? K.call(arguments, 2) : [], "function" == typeof n[e] ? n[e].apply(n, t) : n[e]
      }, b = function() {
        var t, e, n, r, i, o, s;
        for (e = arguments[0], r = 2 <= arguments.length ? K.call(arguments, 1) : [], o = 0, s = r.length; s > o; o++)
          if (n = r[o])
            for (t in n) V.call(n, t) && (i = n[t], null != e[t] && "object" == typeof e[t] && null != i && "object" == typeof i ? b(e[t], i) : e[t] = i);
        return e
      }, m = function(t) {
        var e, n, r, i, o;
        for (n = e = 0, i = 0, o = t.length; o > i; i++) r = t[i], n += Math.abs(r), e++;
        return n / e
      }, E = function(t, e) {
        var n, r, i;
        if (null == t && (t = "options"), null == e && (e = !0), i = document.querySelector("[data-pace-" + t + "]")) {
          if (n = i.getAttribute("data-pace-" + t), !e) return n;
          try {
            return JSON.parse(n)
          } catch (o) {
            return r = o, "undefined" != typeof console && null !== console ? console.error("Error parsing inline pace options", r) : void 0
          }
        }
      }, s = function() {
        function t() {}
        return t.prototype.on = function(t, e, n, r) {
          var i;
          return null == r && (r = !1), null == this.bindings && (this.bindings = {}), null == (i = this.bindings)[t] && (i[t] = []), this.bindings[t].push({
            handler: e,
            ctx: n,
            once: r
          })
        }, t.prototype.once = function(t, e, n) {
          return this.on(t, e, n, !0)
        }, t.prototype.off = function(t, e) {
          var n, r, i;
          if (null != (null != (r = this.bindings) ? r[t] : void 0)) {
            if (null == e) return delete this.bindings[t];
            for (n = 0, i = []; n < this.bindings[t].length;) i.push(this.bindings[t][n].handler === e ? this.bindings[t].splice(n, 1) : n++);
            return i
          }
        }, t.prototype.trigger = function() {
          var t, e, n, r, i, o, s, a, u;
          if (n = arguments[0], t = 2 <= arguments.length ? K.call(arguments, 1) : [], null != (s = this.bindings) ? s[n] : void 0) {
            for (i = 0, u = []; i < this.bindings[n].length;) a = this.bindings[n][i], r = a.handler, e = a.ctx, o = a.once, r.apply(null != e ? e : this, t), u.push(o ? this.bindings[n].splice(i, 1) : i++);
            return u
          }
        }, t
      }(), c = window.Pace || {}, window.Pace = c, b(c, s.prototype), M = c.options = b({}, k, window.paceOptions, E()), B = ["ajax", "document", "eventLag", "elements"], Y = 0, W = B.length; W > Y; Y++) R = B[Y], M[R] === !0 && (M[R] = k[R]);
    u = function(t) {
      function e() {
        return z = e.__super__.constructor.apply(this, arguments)
      }
      return J(e, t), e
    }(Error), e = function() {
      function t() {
        this.progress = 0
      }
      return t.prototype.getElement = function() {
        var t;
        if (null == this.el) {
          if (t = document.querySelector(M.target), !t) throw new u;
          this.el = document.createElement("div"), this.el.className = "pace pace-active", document.body.className = document.body.className.replace(/pace-done/g, ""), document.body.className += " pace-running", this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>', null != t.firstChild ? t.insertBefore(this.el, t.firstChild) : t.appendChild(this.el)
        }
        return this.el
      }, t.prototype.finish = function() {
        var t;
        return t = this.getElement(), t.className = t.className.replace("pace-active", ""), t.className += " pace-inactive", document.body.className = document.body.className.replace("pace-running", ""), document.body.className += " pace-done"
      }, t.prototype.update = function(t) {
        return this.progress = t, this.render()
      }, t.prototype.destroy = function() {
        try {
          this.getElement().parentNode.removeChild(this.getElement())
        } catch (t) {
          u = t
        }
        return this.el = void 0
      }, t.prototype.render = function() {
        var t, e, n, r, i, o, s;
        if (null == document.querySelector(M.target)) return !1;
        for (t = this.getElement(), r = "translate3d(" + this.progress + "%, 0, 0)", s = ["webkitTransform", "msTransform", "transform"], i = 0, o = s.length; o > i; i++) e = s[i], t.children[0].style[e] = r;
        return (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) && (t.children[0].setAttribute("data-progress-text", "" + (0 | this.progress) + "%"), this.progress >= 100 ? n = "99" : (n = this.progress < 10 ? "0" : "", n += 0 | this.progress), t.children[0].setAttribute("data-progress", "" + n)), this.lastRenderedProgress = this.progress
      }, t.prototype.done = function() {
        return this.progress >= 100
      }, t
    }(), a = function() {
      function t() {
        this.bindings = {}
      }
      return t.prototype.trigger = function(t, e) {
        var n, r, i, o, s;
        if (null != this.bindings[t]) {
          for (o = this.bindings[t], s = [], r = 0, i = o.length; i > r; r++) n = o[r], s.push(n.call(this, e));
          return s
        }
      }, t.prototype.on = function(t, e) {
        var n;
        return null == (n = this.bindings)[t] && (n[t] = []), this.bindings[t].push(e)
      }, t
    }(), F = window.XMLHttpRequest, j = window.XDomainRequest, U = window.WebSocket, T = function(t, e) {
      var n, r, i;
      i = [];
      for (r in e.prototype) try {
        i.push(null == t[r] && "function" != typeof e[r] ? "function" == typeof Object.defineProperty ? Object.defineProperty(t, r, {
          get: function() {
            return e.prototype[r]
          },
          configurable: !0,
          enumerable: !0
        }) : t[r] = e.prototype[r] : void 0)
      } catch (o) {
        n = o
      }
      return i
    }, x = [], c.ignore = function() {
      var t, e, n;
      return e = arguments[0], t = 2 <= arguments.length ? K.call(arguments, 1) : [], x.unshift("ignore"), n = e.apply(null, t), x.shift(), n
    }, c.track = function() {
      var t, e, n;
      return e = arguments[0], t = 2 <= arguments.length ? K.call(arguments, 1) : [], x.unshift("track"), n = e.apply(null, t), x.shift(), n
    }, q = function(t) {
      var e;
      if (null == t && (t = "GET"), "track" === x[0]) return "force";
      if (!x.length && M.ajax) {
        if ("socket" === t && M.ajax.trackWebSockets) return !0;
        if (e = t.toUpperCase(), Q.call(M.ajax.trackMethods, e) >= 0) return !0
      }
      return !1
    }, l = function(t) {
      function e() {
        var t, n = this;
        e.__super__.constructor.apply(this, arguments), t = function(t) {
          var e;
          return e = t.open, t.open = function(r, i) {
            return q(r) && n.trigger("request", {
              type: r,
              url: i,
              request: t
            }), e.apply(t, arguments)
          }
        }, window.XMLHttpRequest = function(e) {
          var n;
          return n = new F(e), t(n), n
        };
        try {
          T(window.XMLHttpRequest, F)
        } catch (r) {}
        if (null != j) {
          window.XDomainRequest = function() {
            var e;
            return e = new j, t(e), e
          };
          try {
            T(window.XDomainRequest, j)
          } catch (r) {}
        }
        if (null != U && M.ajax.trackWebSockets) {
          window.WebSocket = function(t, e) {
            var r;
            return r = null != e ? new U(t, e) : new U(t), q("socket") && n.trigger("request", {
              type: "socket",
              url: t,
              protocols: e,
              request: r
            }), r
          };
          try {
            T(window.WebSocket, U)
          } catch (r) {}
        }
      }
      return J(e, t), e
    }(a), I = null, C = function() {
      return null == I && (I = new l), I
    }, _ = function(t) {
      var e, n, r, i;
      for (i = M.ajax.ignoreURLs, n = 0, r = i.length; r > n; n++)
        if (e = i[n], "string" == typeof e) {
          if (-1 !== t.indexOf(e)) return !0
        } else if (e.test(t)) return !0;
      return !1
    }, C().on("request", function(e) {
      var n, r, i, o, s;
      return o = e.type, i = e.request, s = e.url, _(s) ? void 0 : c.running || M.restartOnRequestAfter === !1 && "force" !== q(o) ? void 0 : (r = arguments, n = M.restartOnRequestAfter || 0, "boolean" == typeof n && (n = 0), setTimeout(function() {
        var e, n, s, a, u, l;
        if (e = "socket" === o ? i.readyState < 2 : 0 < (a = i.readyState) && 4 > a) {
          for (c.restart(), u = c.sources, l = [], n = 0, s = u.length; s > n; n++) {
            if (R = u[n], R instanceof t) {
              R.watch.apply(R, r);
              break
            }
            l.push(void 0)
          }
          return l
        }
      }, n))
    }), t = function() {
      function t() {
        var t = this;
        this.elements = [], C().on("request", function() {
          return t.watch.apply(t, arguments)
        })
      }
      return t.prototype.watch = function(t) {
        var e, n, r, i;
        return r = t.type, e = t.request, i = t.url, _(i) ? void 0 : (n = "socket" === r ? new f(e) : new p(e), this.elements.push(n))
      }, t
    }(), p = function() {
      function t(t) {
        var e, n, r, i, o, s, a = this;
        if (this.progress = 0, null != window.ProgressEvent)
          for (n = null, t.addEventListener("progress", function(t) {
              return a.progress = t.lengthComputable ? 100 * t.loaded / t.total : a.progress + (100 - a.progress) / 2
            }, !1), s = ["load", "abort", "timeout", "error"], r = 0, i = s.length; i > r; r++) e = s[r], t.addEventListener(e, function() {
            return a.progress = 100
          }, !1);
        else o = t.onreadystatechange, t.onreadystatechange = function() {
          var e;
          return 0 === (e = t.readyState) || 4 === e ? a.progress = 100 : 3 === t.readyState && (a.progress = 50), "function" == typeof o ? o.apply(null, arguments) : void 0
        }
      }
      return t
    }(), f = function() {
      function t(t) {
        var e, n, r, i, o = this;
        for (this.progress = 0, i = ["error", "open"], n = 0, r = i.length; r > n; n++) e = i[n], t.addEventListener(e, function() {
          return o.progress = 100
        }, !1)
      }
      return t
    }(), r = function() {
      function t(t) {
        var e, n, r, o;
        for (null == t && (t = {}), this.elements = [], null == t.selectors && (t.selectors = []), o = t.selectors, n = 0, r = o.length; r > n; n++) e = o[n], this.elements.push(new i(e))
      }
      return t
    }(), i = function() {
      function t(t) {
        this.selector = t, this.progress = 0, this.check()
      }
      return t.prototype.check = function() {
        var t = this;
        return document.querySelector(this.selector) ? this.done() : setTimeout(function() {
          return t.check()
        }, M.elements.checkInterval)
      }, t.prototype.done = function() {
        return this.progress = 100
      }, t
    }(), n = function() {
      function t() {
        var t, e, n = this;
        this.progress = null != (e = this.states[document.readyState]) ? e : 100, t = document.onreadystatechange, document.onreadystatechange = function() {
          return null != n.states[document.readyState] && (n.progress = n.states[document.readyState]), "function" == typeof t ? t.apply(null, arguments) : void 0
        }
      }
      return t.prototype.states = {
        loading: 0,
        interactive: 50,
        complete: 100
      }, t
    }(), o = function() {
      function t() {
        var t, e, n, r, i, o = this;
        this.progress = 0, t = 0, i = [], r = 0, n = A(), e = setInterval(function() {
          var s;
          return s = A() - n - 50, n = A(), i.push(s), i.length > M.eventLag.sampleCount && i.shift(), t = m(i), ++r >= M.eventLag.minSamples && t < M.eventLag.lagThreshold ? (o.progress = 100, clearInterval(e)) : o.progress = 100 * (3 / (t + 3))
        }, 50)
      }
      return t
    }(), h = function() {
      function t(t) {
        this.source = t, this.last = this.sinceLastUpdate = 0, this.rate = M.initialRate, this.catchup = 0, this.progress = this.lastProgress = 0, null != this.source && (this.progress = $(this.source, "progress"))
      }
      return t.prototype.tick = function(t, e) {
        var n;
        return null == e && (e = $(this.source, "progress")), e >= 100 && (this.done = !0), e === this.last ? this.sinceLastUpdate += t : (this.sinceLastUpdate && (this.rate = (e - this.last) / this.sinceLastUpdate), this.catchup = (e - this.progress) / M.catchupTime, this.sinceLastUpdate = 0, this.last = e), e > this.progress && (this.progress += this.catchup * t), n = 1 - Math.pow(this.progress / 100, M.easeFactor), this.progress += n * this.rate * t, this.progress = Math.min(this.lastProgress + M.maxProgressPerFrame, this.progress), this.progress = Math.max(0, this.progress), this.progress = Math.min(100, this.progress), this.lastProgress = this.progress, this.progress
      }, t
    }(), D = null, N = null, v = null, H = null, g = null, y = null, c.running = !1, S = function() {
      return M.restartOnPushState ? c.restart() : void 0
    }, null != window.history.pushState && (X = window.history.pushState, window.history.pushState = function() {
      return S(), X.apply(window.history, arguments)
    }), null != window.history.replaceState && (G = window.history.replaceState, window.history.replaceState = function() {
      return S(), G.apply(window.history, arguments)
    }), d = {
      ajax: t,
      elements: r,
      document: n,
      eventLag: o
    }, (L = function() {
      var t, n, r, i, o, s, a, u;
      for (c.sources = D = [], s = ["ajax", "elements", "document", "eventLag"], n = 0, i = s.length; i > n; n++) t = s[n], M[t] !== !1 && D.push(new d[t](M[t]));
      for (u = null != (a = M.extraSources) ? a : [], r = 0, o = u.length; o > r; r++) R = u[r], D.push(new R(M));
      return c.bar = v = new e, N = [], H = new h
    })(), c.stop = function() {
      return c.trigger("stop"), c.running = !1, v.destroy(), y = !0, null != g && ("function" == typeof w && w(g), g = null), L()
    }, c.restart = function() {
      return c.trigger("restart"), c.stop(), c.start()
    }, c.go = function() {
      var t;
      return c.running = !0, v.render(), t = A(), y = !1, g = O(function(e, n) {
        var r, i, o, s, a, u, l, d, f, p, g, m, w, k, b, T;
        for (d = 100 - v.progress, i = g = 0, o = !0, u = m = 0, k = D.length; k > m; u = ++m)
          for (R = D[u], p = null != N[u] ? N[u] : N[u] = [], a = null != (T = R.elements) ? T : [R], l = w = 0, b = a.length; b > w; l = ++w) s = a[l], f = null != p[l] ? p[l] : p[l] = new h(s), o &= f.done, f.done || (i++, g += f.tick(e));
        return r = g / i, v.update(H.tick(e, r)), v.done() || o || y ? (v.update(100), c.trigger("done"), setTimeout(function() {
          return v.finish(), c.running = !1, c.trigger("hide")
        }, Math.max(M.ghostTime, Math.max(M.minTime - (A() - t), 0)))) : n()
      })
    }, c.start = function(t) {
      b(M, t), c.running = !0;
      try {
        v.render()
      } catch (e) {
        u = e
      }
      return document.querySelector(".pace") ? (c.trigger("start"), c.go()) : setTimeout(c.start, 50)
    }, "function" == typeof define && define.amd ? define(["pace"], function() {
      return c
    }) : "object" == typeof exports ? module.exports = c : M.startOnPageLoad && c.start()
  }.call(this),
  function() {
    "use strict";
    $(function() {
      var t;
      return InstantClick.init(), Uno.is("device", "desktop") ? $("a").not('[href*="mailto:"]').click(function() {
        if (this.href.indexOf(location.hostname) === -1) return window.open($(this).attr("href")), !1
      }) : FastClick.attach(Uno.app), Uno.is("page", "post") && (Uno.timeAgo("#post-meta > time"), t = $(".content"), t.readingTime({
        readingTimeTarget: ".post-reading-time > span"
      }), Uno.linkify($("#post-content").children("h1, h2, h3, h4, h5, h6")), t.fitVids(), Pace.on("done", function() {
        return setTimeout(Uno.readingProgress, 101)
      })), Uno.is("page", "error") && $("#panic-button").click(function() {
        var t;
        return t = document.createElement("script"), t.setAttribute("src", "https://nthitz.github.io/turndownforwhatjs/tdfw.js"), document.body.appendChild(t)
      }), $("#search-input").keyup(function(t) {
        return Uno.search.render(t.target.value)
      })
    })
  }.call(this);
var InstantClick = function(t, e) {
  function n(t) {
    var e = t.indexOf("#");
    return e < 0 ? t : t.substr(0, e)
  }

  function r(t) {
    for (; t && "A" != t.nodeName;) t = t.parentNode;
    return t
  }

  function o(t) {
    do {
      if (!t.hasAttribute) break;
      if (t.hasAttribute("data-instant")) return !1;
      if (t.hasAttribute("data-no-instant")) return !0
    } while (t = t.parentNode);
    return !1
  }

  function s(t) {
    do {
      if (!t.hasAttribute) break;
      if (t.hasAttribute("data-no-instant")) return !1;
      if (t.hasAttribute("data-instant")) return !0
    } while (t = t.parentNode);
    return !1
  }

  function a(t) {
    var r = e.protocol + "//" + e.host;
    return !(t.target || t.hasAttribute("download") || 0 != t.href.indexOf(r + "/") || t.href.indexOf("#") > -1 && n(t.href) == E || (A ? !s(t) : o(t)))
  }

  function u(t, e, n, r) {
    for (var i = !1, o = 0; o < W[t].length; o++)
      if ("receive" == t) {
        var s = W[t][o](e, n, r);
        s && ("body" in s && (n = s.body), "title" in s && (r = s.title), i = s)
      } else W[t][o](e, n, r);
    return i
  }

  function c(e, r, i, o) {
    if (t.documentElement.replaceChild(r, t.body), i) {
      history.pushState(null, null, i);
      var s = i.indexOf("#"),
        a = s > -1 && t.getElementById(i.substr(s + 1)),
        c = 0;
      if (a)
        for (; a.offsetParent;) c += a.offsetTop, a = a.offsetParent;
      scrollTo(0, c), E = n(i)
    } else scrollTo(0, o);
    O && t.title == e ? t.title = e + String.fromCharCode(160) : t.title = e, y(), X.done(), u("change", !1);
    var l = t.createEvent("HTMLEvents");
    l.initEvent("instantclick:newpage", !0, !0), dispatchEvent(l)
  }

  function l() {
    F = !1, Y = !1
  }

  function d(t) {
    return t.replace(/<noscript[\s\S]+<\/noscript>/gi, "")
  }

  function h(t) {
    if (!(x > +new Date - 500)) {
      var e = r(t.target);
      e && a(e) && w(e.href)
    }
  }

  function f(t) {
    if (!(x > +new Date - 500)) {
      var e = r(t.target);
      e && a(e) && (e.addEventListener("mouseout", m), P ? (C = e.href, S = setTimeout(w, P)) : w(e.href))
    }
  }

  function p(t) {
    x = +new Date;
    var e = r(t.target);
    e && a(e) && (M ? e.removeEventListener("mousedown", h) : e.removeEventListener("mouseover", f), w(e.href))
  }

  function g(t) {
    var e = r(t.target);
    e && a(e) && (t.which > 1 || t.metaKey || t.ctrlKey || (t.preventDefault(), k(e.href)))
  }

  function m() {
    return S ? (clearTimeout(S), void(S = !1)) : void(F && !Y && (L.abort(), l()))
  }

  function v() {
    if (!(L.readyState < 4) && 0 != L.status) {
      if (U.ready = +new Date - U.start, L.getResponseHeader("Content-Type").match(/\/(x|ht|xht)ml/)) {
        var e = t.implementation.createHTMLDocument("");
        e.documentElement.innerHTML = d(L.responseText), R = e.title, H = e.body;
        var r = u("receive", q, H, R);
        r && ("body" in r && (H = r.body), "title" in r && (R = r.title));
        var i = n(q);
        _[i] = {
          body: H,
          title: R,
          scrollY: i in _ ? _[i].scrollY : 0
        };
        for (var o, s, a = e.head.children, c = 0, l = a.length - 1; l >= 0; l--)
          if (o = a[l], o.hasAttribute("data-instant-track")) {
            s = o.getAttribute("href") || o.getAttribute("src") || o.innerHTML;
            for (var h = I.length - 1; h >= 0; h--) I[h] == s && c++
          }
        c != I.length && (D = !0)
      } else D = !0;
      Y && (Y = !1, k(q))
    }
  }

  function y(e) {
    if (t.body.addEventListener("touchstart", p, !0), M ? t.body.addEventListener("mousedown", h, !0) : t.body.addEventListener("mouseover", f, !0), t.body.addEventListener("click", g, !0), !e) {
      var n, r, o, s, a = t.body.getElementsByTagName("script");
      for (i = 0, j = a.length; i < j; i++) n = a[i], n.hasAttribute("data-no-instant") || (r = t.createElement("script"), n.src && (r.src = n.src), n.innerHTML && (r.innerHTML = n.innerHTML), o = n.parentNode, s = n.nextSibling, o.removeChild(n), o.insertBefore(r, s))
    }
  }

  function w(t) {
    !M && "display" in U && +new Date - (U.start + U.display) < 100 || (S && (clearTimeout(S), S = !1), t || (t = C), F && (t == q || Y) || (F = !0, Y = !1, q = t, H = !1, D = !1, U = {
      start: +new Date
    }, u("fetch"), L.open("GET", t), L.send()))
  }

  function k(t) {
    return "display" in U || (U.display = +new Date - U.start), S || !F ? S && q && q != t ? void(e.href = t) : (w(t), X.start(0, !0), u("wait"), void(Y = !0)) : Y ? void(e.href = t) : D ? void(e.href = q) : H ? (_[E].scrollY = pageYOffset, l(), void c(R, H, q)) : (X.start(0, !0), u("wait"), void(Y = !0))
  }

  function b() {
    if (!E) {
      if (!B) return void u("change", !0);
      for (var r = arguments.length - 1; r >= 0; r--) {
        var i = arguments[r];
        i === !0 ? A = !0 : "mousedown" == i ? M = !0 : "number" == typeof i && (P = i)
      }
      E = n(e.href), _[E] = {
        body: t.body,
        title: t.title,
        scrollY: pageYOffset
      };
      for (var o, s, a = t.head.children, r = a.length - 1; r >= 0; r--) o = a[r], o.hasAttribute("data-instant-track") && (s = o.getAttribute("href") || o.getAttribute("src") || o.innerHTML, I.push(s));
      L = new XMLHttpRequest, L.addEventListener("readystatechange", v), y(!0), X.init(), u("change", !0), addEventListener("popstate", function() {
        var t = n(e.href);
        if (t != E) {
          if (!(t in _)) return void(e.href = e.href);
          _[E].scrollY = pageYOffset, E = t, c(_[t].title, _[t].body, !1, _[t].scrollY)
        }
      })
    }
  }

  function T(t, e) {
    W[t].push(e)
  }
  var E, C, S, x, L, A, M, P, $ = navigator.userAgent,
    O = $.indexOf(" CriOS/") > -1,
    N = "createTouch" in t,
    _ = {},
    q = !1,
    R = !1,
    D = !1,
    H = !1,
    U = {},
    F = !1,
    Y = !1,
    I = [],
    W = {
      fetch: [],
      receive: [],
      wait: [],
      change: []
    },
    X = function() {
      function e() {
        u = t.createElement("div"), u.id = "instantclick", c = t.createElement("div"), c.id = "instantclick-bar", c.className = "instantclick-bar", u.appendChild(c);
        var e = ["Webkit", "Moz", "O"];
        if (l = "transform", !(l in c.style))
          for (var n = 0; n < 3; n++) e[n] + "Transform" in c.style && (l = e[n] + "Transform");
        var r = "transition";
        if (!(r in c.style))
          for (var n = 0; n < 3; n++) e[n] + "Transition" in c.style && (r = "-" + e[n].toLowerCase() + "-" + r);
        var i = t.createElement("style");
        i.innerHTML = "#instantclick{position:" + (N ? "absolute" : "fixed") + ";top:0;left:0;width:100%;pointer-events:none;z-index:2147483647;" + r + ":opacity .25s .1s}.instantclick-bar{background:#29d;width:100%;margin-left:-100%;height:2px;" + r + ":all .25s}", t.head.appendChild(i), N && (a(), addEventListener("resize", a), addEventListener("scroll", a))
      }

      function n(e, n) {
        d = e, t.getElementById(u.id) && t.body.removeChild(u), u.style.opacity = "1", t.getElementById(u.id) && t.body.removeChild(u), o(), n && setTimeout(r, 0), clearTimeout(h), h = setTimeout(i, 500)
      }

      function r() {
        d = 10, o()
      }

      function i() {
        d += 1 + 2 * Math.random(), d >= 98 ? d = 98 : h = setTimeout(i, 500), o()
      }

      function o() {
        c.style[l] = "translate(" + d + "%)", t.getElementById(u.id) || t.body.appendChild(u)
      }

      function s() {
        return t.getElementById(u.id) ? (clearTimeout(h), d = 100, o(), void(u.style.opacity = "0")) : (n(100 == d ? 0 : d), void setTimeout(s, 0))
      }

      function a() {
        u.style.left = pageXOffset + "px", u.style.width = innerWidth + "px", u.style.top = pageYOffset + "px";
        var t = "orientation" in window && 90 == Math.abs(orientation),
          e = innerWidth / screen[t ? "height" : "width"] * 2;
        u.style[l] = "scaleY(" + e + ")"
      }
      var u, c, l, d, h;
      return {
        init: e,
        start: n,
        done: s
      }
    }(),
    B = "pushState" in history && (!$.match("Android") || $.match("Chrome/")) && "file:" != e.protocol;
  return {
    supported: B,
    init: b,
    on: T
  }
}(document, location);

(function() {
  "use strict";
  $(function() {
    var t, e, n;
    return t = function() {
      var t;
      return t = $(".cover"),
        function() {
          return setTimeout(function() {
            return t.addClass("animated", 1e3)
          })
        }
    }(), e = function() {
      var t;
      return t = $("main, .cover, .links > li, html"),
        function(e) {
          return t.addClass("expanded"), Uno.search.form(e.form)
        }
    }(), n = $(".cover, main, #menu-button, html"), $("#menu-button").click(function() {
      return n.addClass("expanded")
    }), $(open_button + ", #avatar-link").click(function(t) {
      if (Uno.is("page", "home")) return t.preventDefault(), location.hash = "" === location.hash ? "#open" : "", Uno.is("device", "desktop") ? e({
        form: "toggle"
      }) : $("#menu-button").trigger("click");
    }), Uno.is("device", "desktop") && Uno.is("page", "home") && (t(), "#open" !== location.hash && e({
      form: "hide"
    })), Uno.is("page", "home") || $("#search-container").hide(), $("#search-form").submit(function(t) {
      return Uno.is("device", "desktop") || n.addClass("expanded"), !1
    })
  })
}).call(this),
  function(t) {
    t.fn.readingTime = function(e) {
      if (!this.length) return this;
      var n = {
          readingTimeTarget: ".eta",
          wordCountTarget: null,
          wordsPerMinute: 270,
          round: !0,
          lang: "en",
          remotePath: null,
          remoteTarget: null
        },
        r = this,
        i = t(this);
      r.settings = t.extend({}, n, e);
      var o = r.settings.readingTimeTarget,
        s = r.settings.wordCountTarget,
        a = r.settings.wordsPerMinute,
        u = r.settings.round,
        c = r.settings.lang,
        l = r.settings.remotePath,
        d = r.settings.remoteTarget;
      if ("fr" == c) var h = "Moins d'une minute",
        f = "min";
      else if ("de" == c) var h = "Weniger als eine Minute",
        f = "min";
      else if ("es" == c) var h = "Menos de un minuto",
        f = "min";
      else var h = "Less than a minute",
        f = "min";
      var p = function(t) {
        var e = t.split(" ").length,
          n = a / 60,
          r = e / n,
          c = Math.round(r / 60),
          l = Math.round(r - 60 * c);
        if (u === !0) c > 0 ? i.find(o).text(c + " " + f) : i.find(o).text(h);
        else {
          var d = c + ":" + l;
          i.find(o).text(d)
        }
        "" !== s && void 0 !== s && i.find(s).text(e)
      };
      i.each(function() {
        null != l && null != d ? t.get(l, function(e) {
          p(t(e).children().text())
        }) : p(i.text())
      })
    }
  }(jQuery);
