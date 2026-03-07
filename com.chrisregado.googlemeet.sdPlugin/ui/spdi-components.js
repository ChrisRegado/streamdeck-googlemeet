/**!
 * @license
 * sdpi-components v4.0.1, Copyright Corsair Memory Inc. and other contributors (https://sdpi-components.dev)
 * Lit, Copyright 2019 Google LLC, SPDX-License-Identifier: BSD-3-Clause (https://lit.dev/)
 */
!(function () {
  "use strict";
  function t(t, e, i, s) {
    var n,
      r = arguments.length,
      o =
        r < 3
          ? e
          : null === s
            ? (s = Object.getOwnPropertyDescriptor(e, i))
            : s;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
      o = Reflect.decorate(t, e, i, s);
    else
      for (var a = t.length - 1; a >= 0; a--)
        (n = t[a]) && (o = (r < 3 ? n(o) : r > 3 ? n(e, i, o) : n(e, i)) || o);
    return (r > 3 && o && Object.defineProperty(e, i, o), o);
  }
  function e(t, e) {
    if ("object" == typeof Reflect && "function" == typeof Reflect.metadata)
      return Reflect.metadata(t, e);
  }
  const i = window,
    s =
      i.ShadowRoot &&
      (void 0 === i.ShadyCSS || i.ShadyCSS.nativeShadow) &&
      "adoptedStyleSheets" in Document.prototype &&
      "replace" in CSSStyleSheet.prototype,
    n = Symbol(),
    r = new WeakMap();
  let o = class {
    constructor(t, e, i) {
      if (((this._$cssResult$ = !0), i !== n))
        throw Error(
          "CSSResult is not constructable. Use `unsafeCSS` or `css` instead.",
        );
      ((this.cssText = t), (this.t = e));
    }
    get styleSheet() {
      let t = this.o;
      const e = this.t;
      if (s && void 0 === t) {
        const i = void 0 !== e && 1 === e.length;
        (i && (t = r.get(e)),
          void 0 === t &&
            ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText),
            i && r.set(e, t)));
      }
      return t;
    }
    toString() {
      return this.cssText;
    }
  };
  const a = (t, ...e) => {
      const i =
        1 === t.length
          ? t[0]
          : e.reduce(
              (e, i, s) =>
                e +
                ((t) => {
                  if (!0 === t._$cssResult$) return t.cssText;
                  if ("number" == typeof t) return t;
                  throw Error(
                    "Value passed to 'css' function must be a 'css' function result: " +
                      t +
                      ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.",
                  );
                })(i) +
                t[s + 1],
              t[0],
            );
      return new o(i, t, n);
    },
    l = s
      ? (t) => t
      : (t) =>
          t instanceof CSSStyleSheet
            ? ((t) => {
                let e = "";
                for (const i of t.cssRules) e += i.cssText;
                return ((t) =>
                  new o("string" == typeof t ? t : t + "", void 0, n))(e);
              })(t)
            : t;
  var d;
  const c = window,
    h = c.trustedTypes,
    u = h ? h.emptyScript : "",
    p = c.reactiveElementPolyfillSupport,
    v = {
      toAttribute(t, e) {
        switch (e) {
          case Boolean:
            t = t ? u : null;
            break;
          case Object:
          case Array:
            t = null == t ? t : JSON.stringify(t);
        }
        return t;
      },
      fromAttribute(t, e) {
        let i = t;
        switch (e) {
          case Boolean:
            i = null !== t;
            break;
          case Number:
            i = null === t ? null : Number(t);
            break;
          case Object:
          case Array:
            try {
              i = JSON.parse(t);
            } catch (t) {
              i = null;
            }
        }
        return i;
      },
    },
    g = (t, e) => e !== t && (e == e || t == t),
    b = {
      attribute: !0,
      type: String,
      converter: v,
      reflect: !1,
      hasChanged: g,
    };
  let y = class extends HTMLElement {
    constructor() {
      (super(),
        (this._$Ei = new Map()),
        (this.isUpdatePending = !1),
        (this.hasUpdated = !1),
        (this._$El = null),
        this.u());
    }
    static addInitializer(t) {
      var e;
      ((null !== (e = this.h) && void 0 !== e) || (this.h = []),
        this.h.push(t));
    }
    static get observedAttributes() {
      this.finalize();
      const t = [];
      return (
        this.elementProperties.forEach((e, i) => {
          const s = this._$Ep(i, e);
          void 0 !== s && (this._$Ev.set(s, i), t.push(s));
        }),
        t
      );
    }
    static createProperty(t, e = b) {
      if (
        (e.state && (e.attribute = !1),
        this.finalize(),
        this.elementProperties.set(t, e),
        !e.noAccessor && !this.prototype.hasOwnProperty(t))
      ) {
        const i = "symbol" == typeof t ? Symbol() : "__" + t,
          s = this.getPropertyDescriptor(t, i, e);
        void 0 !== s && Object.defineProperty(this.prototype, t, s);
      }
    }
    static getPropertyDescriptor(t, e, i) {
      return {
        get() {
          return this[e];
        },
        set(s) {
          const n = this[t];
          ((this[e] = s), this.requestUpdate(t, n, i));
        },
        configurable: !0,
        enumerable: !0,
      };
    }
    static getPropertyOptions(t) {
      return this.elementProperties.get(t) || b;
    }
    static finalize() {
      if (this.hasOwnProperty("finalized")) return !1;
      this.finalized = !0;
      const t = Object.getPrototypeOf(this);
      if (
        (t.finalize(),
        (this.elementProperties = new Map(t.elementProperties)),
        (this._$Ev = new Map()),
        this.hasOwnProperty("properties"))
      ) {
        const t = this.properties,
          e = [
            ...Object.getOwnPropertyNames(t),
            ...Object.getOwnPropertySymbols(t),
          ];
        for (const i of e) this.createProperty(i, t[i]);
      }
      return ((this.elementStyles = this.finalizeStyles(this.styles)), !0);
    }
    static finalizeStyles(t) {
      const e = [];
      if (Array.isArray(t)) {
        const i = new Set(t.flat(1 / 0).reverse());
        for (const t of i) e.unshift(l(t));
      } else void 0 !== t && e.push(l(t));
      return e;
    }
    static _$Ep(t, e) {
      const i = e.attribute;
      return !1 === i
        ? void 0
        : "string" == typeof i
          ? i
          : "string" == typeof t
            ? t.toLowerCase()
            : void 0;
    }
    u() {
      var t;
      ((this._$E_ = new Promise((t) => (this.enableUpdating = t))),
        (this._$AL = new Map()),
        this._$Eg(),
        this.requestUpdate(),
        null === (t = this.constructor.h) ||
          void 0 === t ||
          t.forEach((t) => t(this)));
    }
    addController(t) {
      var e, i;
      ((null !== (e = this._$ES) && void 0 !== e ? e : (this._$ES = [])).push(
        t,
      ),
        void 0 !== this.renderRoot &&
          this.isConnected &&
          (null === (i = t.hostConnected) || void 0 === i || i.call(t)));
    }
    removeController(t) {
      var e;
      null === (e = this._$ES) ||
        void 0 === e ||
        e.splice(this._$ES.indexOf(t) >>> 0, 1);
    }
    _$Eg() {
      this.constructor.elementProperties.forEach((t, e) => {
        this.hasOwnProperty(e) && (this._$Ei.set(e, this[e]), delete this[e]);
      });
    }
    createRenderRoot() {
      var t;
      const e =
        null !== (t = this.shadowRoot) && void 0 !== t
          ? t
          : this.attachShadow(this.constructor.shadowRootOptions);
      return (
        ((t, e) => {
          s
            ? (t.adoptedStyleSheets = e.map((t) =>
                t instanceof CSSStyleSheet ? t : t.styleSheet,
              ))
            : e.forEach((e) => {
                const s = document.createElement("style"),
                  n = i.litNonce;
                (void 0 !== n && s.setAttribute("nonce", n),
                  (s.textContent = e.cssText),
                  t.appendChild(s));
              });
        })(e, this.constructor.elementStyles),
        e
      );
    }
    connectedCallback() {
      var t;
      (void 0 === this.renderRoot &&
        (this.renderRoot = this.createRenderRoot()),
        this.enableUpdating(!0),
        null === (t = this._$ES) ||
          void 0 === t ||
          t.forEach((t) => {
            var e;
            return null === (e = t.hostConnected) || void 0 === e
              ? void 0
              : e.call(t);
          }));
    }
    enableUpdating(t) {}
    disconnectedCallback() {
      var t;
      null === (t = this._$ES) ||
        void 0 === t ||
        t.forEach((t) => {
          var e;
          return null === (e = t.hostDisconnected) || void 0 === e
            ? void 0
            : e.call(t);
        });
    }
    attributeChangedCallback(t, e, i) {
      this._$AK(t, i);
    }
    _$EO(t, e, i = b) {
      var s;
      const n = this.constructor._$Ep(t, i);
      if (void 0 !== n && !0 === i.reflect) {
        const r = (
          void 0 !==
          (null === (s = i.converter) || void 0 === s ? void 0 : s.toAttribute)
            ? i.converter
            : v
        ).toAttribute(e, i.type);
        ((this._$El = t),
          null == r ? this.removeAttribute(n) : this.setAttribute(n, r),
          (this._$El = null));
      }
    }
    _$AK(t, e) {
      var i;
      const s = this.constructor,
        n = s._$Ev.get(t);
      if (void 0 !== n && this._$El !== n) {
        const t = s.getPropertyOptions(n),
          r =
            "function" == typeof t.converter
              ? { fromAttribute: t.converter }
              : void 0 !==
                  (null === (i = t.converter) || void 0 === i
                    ? void 0
                    : i.fromAttribute)
                ? t.converter
                : v;
        ((this._$El = n),
          (this[n] = r.fromAttribute(e, t.type)),
          (this._$El = null));
      }
    }
    requestUpdate(t, e, i) {
      let s = !0;
      (void 0 !== t &&
        (((i = i || this.constructor.getPropertyOptions(t)).hasChanged || g)(
          this[t],
          e,
        )
          ? (this._$AL.has(t) || this._$AL.set(t, e),
            !0 === i.reflect &&
              this._$El !== t &&
              (void 0 === this._$EC && (this._$EC = new Map()),
              this._$EC.set(t, i)))
          : (s = !1)),
        !this.isUpdatePending && s && (this._$E_ = this._$Ej()));
    }
    async _$Ej() {
      this.isUpdatePending = !0;
      try {
        await this._$E_;
      } catch (t) {
        Promise.reject(t);
      }
      const t = this.scheduleUpdate();
      return (null != t && (await t), !this.isUpdatePending);
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      var t;
      if (!this.isUpdatePending) return;
      (this.hasUpdated,
        this._$Ei &&
          (this._$Ei.forEach((t, e) => (this[e] = t)), (this._$Ei = void 0)));
      let e = !1;
      const i = this._$AL;
      try {
        ((e = this.shouldUpdate(i)),
          e
            ? (this.willUpdate(i),
              null === (t = this._$ES) ||
                void 0 === t ||
                t.forEach((t) => {
                  var e;
                  return null === (e = t.hostUpdate) || void 0 === e
                    ? void 0
                    : e.call(t);
                }),
              this.update(i))
            : this._$Ek());
      } catch (t) {
        throw ((e = !1), this._$Ek(), t);
      }
      e && this._$AE(i);
    }
    willUpdate(t) {}
    _$AE(t) {
      var e;
      (null === (e = this._$ES) ||
        void 0 === e ||
        e.forEach((t) => {
          var e;
          return null === (e = t.hostUpdated) || void 0 === e
            ? void 0
            : e.call(t);
        }),
        this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)),
        this.updated(t));
    }
    _$Ek() {
      ((this._$AL = new Map()), (this.isUpdatePending = !1));
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$E_;
    }
    shouldUpdate(t) {
      return !0;
    }
    update(t) {
      (void 0 !== this._$EC &&
        (this._$EC.forEach((t, e) => this._$EO(e, this[e], t)),
        (this._$EC = void 0)),
        this._$Ek());
    }
    updated(t) {}
    firstUpdated(t) {}
  };
  var f;
  ((y.finalized = !0),
    (y.elementProperties = new Map()),
    (y.elementStyles = []),
    (y.shadowRootOptions = { mode: "open" }),
    null == p || p({ ReactiveElement: y }),
    (null !== (d = c.reactiveElementVersions) && void 0 !== d
      ? d
      : (c.reactiveElementVersions = [])
    ).push("1.4.1"));
  const m = window,
    $ = m.trustedTypes,
    x = $ ? $.createPolicy("lit-html", { createHTML: (t) => t }) : void 0,
    w = `lit$${(Math.random() + "").slice(9)}$`,
    _ = "?" + w,
    L = `<${_}>`,
    A = document,
    S = (t = "") => A.createComment(t),
    M = (t) => null === t || ("object" != typeof t && "function" != typeof t),
    k = Array.isArray,
    I = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    E = /-->/g,
    C = />/g,
    N = RegExp(
      ">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)",
      "g",
    ),
    D = /'/g,
    j = /"/g,
    T = /^(?:script|style|textarea|title)$/i,
    z = (
      (t) =>
      (e, ...i) => ({ _$litType$: t, strings: e, values: i })
    )(1),
    U = Symbol.for("lit-noChange"),
    O = Symbol.for("lit-nothing"),
    R = new WeakMap(),
    P = A.createTreeWalker(A, 129, null, !1),
    H = (t, e) => {
      const i = t.length - 1,
        s = [];
      let n,
        r = 2 === e ? "<svg>" : "",
        o = I;
      for (let e = 0; e < i; e++) {
        const i = t[e];
        let a,
          l,
          d = -1,
          c = 0;
        for (
          ;
          c < i.length && ((o.lastIndex = c), (l = o.exec(i)), null !== l);
        )
          ((c = o.lastIndex),
            o === I
              ? "!--" === l[1]
                ? (o = E)
                : void 0 !== l[1]
                  ? (o = C)
                  : void 0 !== l[2]
                    ? (T.test(l[2]) && (n = RegExp("</" + l[2], "g")), (o = N))
                    : void 0 !== l[3] && (o = N)
              : o === N
                ? ">" === l[0]
                  ? ((o = null != n ? n : I), (d = -1))
                  : void 0 === l[1]
                    ? (d = -2)
                    : ((d = o.lastIndex - l[2].length),
                      (a = l[1]),
                      (o = void 0 === l[3] ? N : '"' === l[3] ? j : D))
                : o === j || o === D
                  ? (o = N)
                  : o === E || o === C
                    ? (o = I)
                    : ((o = N), (n = void 0)));
        const h = o === N && t[e + 1].startsWith("/>") ? " " : "";
        r +=
          o === I
            ? i + L
            : d >= 0
              ? (s.push(a), i.slice(0, d) + "$lit$" + i.slice(d) + w + h)
              : i + w + (-2 === d ? (s.push(void 0), e) : h);
      }
      const a = r + (t[i] || "<?>") + (2 === e ? "</svg>" : "");
      if (!Array.isArray(t) || !t.hasOwnProperty("raw"))
        throw Error("invalid template strings array");
      return [void 0 !== x ? x.createHTML(a) : a, s];
    };
  class Z {
    constructor({ strings: t, _$litType$: e }, i) {
      let s;
      this.parts = [];
      let n = 0,
        r = 0;
      const o = t.length - 1,
        a = this.parts,
        [l, d] = H(t, e);
      if (
        ((this.el = Z.createElement(l, i)),
        (P.currentNode = this.el.content),
        2 === e)
      ) {
        const t = this.el.content,
          e = t.firstChild;
        (e.remove(), t.append(...e.childNodes));
      }
      for (; null !== (s = P.nextNode()) && a.length < o; ) {
        if (1 === s.nodeType) {
          if (s.hasAttributes()) {
            const t = [];
            for (const e of s.getAttributeNames())
              if (e.endsWith("$lit$") || e.startsWith(w)) {
                const i = d[r++];
                if ((t.push(e), void 0 !== i)) {
                  const t = s.getAttribute(i.toLowerCase() + "$lit$").split(w),
                    e = /([.?@])?(.*)/.exec(i);
                  a.push({
                    type: 1,
                    index: n,
                    name: e[2],
                    strings: t,
                    ctor:
                      "." === e[1]
                        ? W
                        : "?" === e[1]
                          ? q
                          : "@" === e[1]
                            ? F
                            : G,
                  });
                } else a.push({ type: 6, index: n });
              }
            for (const e of t) s.removeAttribute(e);
          }
          if (T.test(s.tagName)) {
            const t = s.textContent.split(w),
              e = t.length - 1;
            if (e > 0) {
              s.textContent = $ ? $.emptyScript : "";
              for (let i = 0; i < e; i++)
                (s.append(t[i], S()),
                  P.nextNode(),
                  a.push({ type: 2, index: ++n }));
              s.append(t[e], S());
            }
          }
        } else if (8 === s.nodeType)
          if (s.data === _) a.push({ type: 2, index: n });
          else {
            let t = -1;
            for (; -1 !== (t = s.data.indexOf(w, t + 1)); )
              (a.push({ type: 7, index: n }), (t += w.length - 1));
          }
        n++;
      }
    }
    static createElement(t, e) {
      const i = A.createElement("template");
      return ((i.innerHTML = t), i);
    }
  }
  function Y(t, e, i = t, s) {
    var n, r, o, a;
    if (e === U) return e;
    let l =
      void 0 !== s
        ? null === (n = i._$Co) || void 0 === n
          ? void 0
          : n[s]
        : i._$Cl;
    const d = M(e) ? void 0 : e._$litDirective$;
    return (
      (null == l ? void 0 : l.constructor) !== d &&
        (null === (r = null == l ? void 0 : l._$AO) ||
          void 0 === r ||
          r.call(l, !1),
        void 0 === d ? (l = void 0) : ((l = new d(t)), l._$AT(t, i, s)),
        void 0 !== s
          ? ((null !== (o = (a = i)._$Co) && void 0 !== o ? o : (a._$Co = []))[
              s
            ] = l)
          : (i._$Cl = l)),
      void 0 !== l && (e = Y(t, l._$AS(t, e.values), l, s)),
      e
    );
  }
  class B {
    constructor(t, e) {
      ((this.u = []), (this._$AN = void 0), (this._$AD = t), (this._$AM = e));
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    v(t) {
      var e;
      const {
          el: { content: i },
          parts: s,
        } = this._$AD,
        n = (
          null !== (e = null == t ? void 0 : t.creationScope) && void 0 !== e
            ? e
            : A
        ).importNode(i, !0);
      P.currentNode = n;
      let r = P.nextNode(),
        o = 0,
        a = 0,
        l = s[0];
      for (; void 0 !== l; ) {
        if (o === l.index) {
          let e;
          (2 === l.type
            ? (e = new V(r, r.nextSibling, this, t))
            : 1 === l.type
              ? (e = new l.ctor(r, l.name, l.strings, this, t))
              : 6 === l.type && (e = new J(r, this, t)),
            this.u.push(e),
            (l = s[++a]));
        }
        o !== (null == l ? void 0 : l.index) && ((r = P.nextNode()), o++);
      }
      return n;
    }
    p(t) {
      let e = 0;
      for (const i of this.u)
        (void 0 !== i &&
          (void 0 !== i.strings
            ? (i._$AI(t, i, e), (e += i.strings.length - 2))
            : i._$AI(t[e])),
          e++);
    }
  }
  class V {
    constructor(t, e, i, s) {
      var n;
      ((this.type = 2),
        (this._$AH = O),
        (this._$AN = void 0),
        (this._$AA = t),
        (this._$AB = e),
        (this._$AM = i),
        (this.options = s),
        (this._$Cm =
          null === (n = null == s ? void 0 : s.isConnected) ||
          void 0 === n ||
          n));
    }
    get _$AU() {
      var t, e;
      return null !==
        (e = null === (t = this._$AM) || void 0 === t ? void 0 : t._$AU) &&
        void 0 !== e
        ? e
        : this._$Cm;
    }
    get parentNode() {
      let t = this._$AA.parentNode;
      const e = this._$AM;
      return (void 0 !== e && 11 === t.nodeType && (t = e.parentNode), t);
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t, e = this) {
      ((t = Y(this, t, e)),
        M(t)
          ? t === O || null == t || "" === t
            ? (this._$AH !== O && this._$AR(), (this._$AH = O))
            : t !== this._$AH && t !== U && this.g(t)
          : void 0 !== t._$litType$
            ? this.$(t)
            : void 0 !== t.nodeType
              ? this.T(t)
              : ((t) =>
                    k(t) ||
                    "function" ==
                      typeof (null == t ? void 0 : t[Symbol.iterator]))(t)
                ? this.k(t)
                : this.g(t));
    }
    O(t, e = this._$AB) {
      return this._$AA.parentNode.insertBefore(t, e);
    }
    T(t) {
      this._$AH !== t && (this._$AR(), (this._$AH = this.O(t)));
    }
    g(t) {
      (this._$AH !== O && M(this._$AH)
        ? (this._$AA.nextSibling.data = t)
        : this.T(A.createTextNode(t)),
        (this._$AH = t));
    }
    $(t) {
      var e;
      const { values: i, _$litType$: s } = t,
        n =
          "number" == typeof s
            ? this._$AC(t)
            : (void 0 === s.el && (s.el = Z.createElement(s.h, this.options)),
              s);
      if ((null === (e = this._$AH) || void 0 === e ? void 0 : e._$AD) === n)
        this._$AH.p(i);
      else {
        const t = new B(n, this),
          e = t.v(this.options);
        (t.p(i), this.T(e), (this._$AH = t));
      }
    }
    _$AC(t) {
      let e = R.get(t.strings);
      return (void 0 === e && R.set(t.strings, (e = new Z(t))), e);
    }
    k(t) {
      k(this._$AH) || ((this._$AH = []), this._$AR());
      const e = this._$AH;
      let i,
        s = 0;
      for (const n of t)
        (s === e.length
          ? e.push((i = new V(this.O(S()), this.O(S()), this, this.options)))
          : (i = e[s]),
          i._$AI(n),
          s++);
      s < e.length && (this._$AR(i && i._$AB.nextSibling, s), (e.length = s));
    }
    _$AR(t = this._$AA.nextSibling, e) {
      var i;
      for (
        null === (i = this._$AP) || void 0 === i || i.call(this, !1, !0, e);
        t && t !== this._$AB;
      ) {
        const e = t.nextSibling;
        (t.remove(), (t = e));
      }
    }
    setConnected(t) {
      var e;
      void 0 === this._$AM &&
        ((this._$Cm = t),
        null === (e = this._$AP) || void 0 === e || e.call(this, t));
    }
  }
  class G {
    constructor(t, e, i, s, n) {
      ((this.type = 1),
        (this._$AH = O),
        (this._$AN = void 0),
        (this.element = t),
        (this.name = e),
        (this._$AM = s),
        (this.options = n),
        i.length > 2 || "" !== i[0] || "" !== i[1]
          ? ((this._$AH = Array(i.length - 1).fill(new String())),
            (this.strings = i))
          : (this._$AH = O));
    }
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t, e = this, i, s) {
      const n = this.strings;
      let r = !1;
      if (void 0 === n)
        ((t = Y(this, t, e, 0)),
          (r = !M(t) || (t !== this._$AH && t !== U)),
          r && (this._$AH = t));
      else {
        const s = t;
        let o, a;
        for (t = n[0], o = 0; o < n.length - 1; o++)
          ((a = Y(this, s[i + o], e, o)),
            a === U && (a = this._$AH[o]),
            r || (r = !M(a) || a !== this._$AH[o]),
            a === O
              ? (t = O)
              : t !== O && (t += (null != a ? a : "") + n[o + 1]),
            (this._$AH[o] = a));
      }
      r && !s && this.j(t);
    }
    j(t) {
      t === O
        ? this.element.removeAttribute(this.name)
        : this.element.setAttribute(this.name, null != t ? t : "");
    }
  }
  class W extends G {
    constructor() {
      (super(...arguments), (this.type = 3));
    }
    j(t) {
      this.element[this.name] = t === O ? void 0 : t;
    }
  }
  const Q = $ ? $.emptyScript : "";
  class q extends G {
    constructor() {
      (super(...arguments), (this.type = 4));
    }
    j(t) {
      t && t !== O
        ? this.element.setAttribute(this.name, Q)
        : this.element.removeAttribute(this.name);
    }
  }
  class F extends G {
    constructor(t, e, i, s, n) {
      (super(t, e, i, s, n), (this.type = 5));
    }
    _$AI(t, e = this) {
      var i;
      if ((t = null !== (i = Y(this, t, e, 0)) && void 0 !== i ? i : O) === U)
        return;
      const s = this._$AH,
        n =
          (t === O && s !== O) ||
          t.capture !== s.capture ||
          t.once !== s.once ||
          t.passive !== s.passive,
        r = t !== O && (s === O || n);
      (n && this.element.removeEventListener(this.name, this, s),
        r && this.element.addEventListener(this.name, this, t),
        (this._$AH = t));
    }
    handleEvent(t) {
      var e, i;
      "function" == typeof this._$AH
        ? this._$AH.call(
            null !==
              (i =
                null === (e = this.options) || void 0 === e
                  ? void 0
                  : e.host) && void 0 !== i
              ? i
              : this.element,
            t,
          )
        : this._$AH.handleEvent(t);
    }
  }
  class J {
    constructor(t, e, i) {
      ((this.element = t),
        (this.type = 6),
        (this._$AN = void 0),
        (this._$AM = e),
        (this.options = i));
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t) {
      Y(this, t);
    }
  }
  const K = m.litHtmlPolyfillSupport;
  (null == K || K(Z, V),
    (null !== (f = m.litHtmlVersions) && void 0 !== f
      ? f
      : (m.litHtmlVersions = [])
    ).push("2.4.0"));
  var X, tt;
  let et = class extends y {
    constructor() {
      (super(...arguments),
        (this.renderOptions = { host: this }),
        (this._$Do = void 0));
    }
    createRenderRoot() {
      var t, e;
      const i = super.createRenderRoot();
      return (
        (null !== (t = (e = this.renderOptions).renderBefore) &&
          void 0 !== t) ||
          (e.renderBefore = i.firstChild),
        i
      );
    }
    update(t) {
      const e = this.render();
      (this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
        super.update(t),
        (this._$Do = ((t, e, i) => {
          var s, n;
          const r =
            null !== (s = null == i ? void 0 : i.renderBefore) && void 0 !== s
              ? s
              : e;
          let o = r._$litPart$;
          if (void 0 === o) {
            const t =
              null !== (n = null == i ? void 0 : i.renderBefore) && void 0 !== n
                ? n
                : null;
            r._$litPart$ = o = new V(
              e.insertBefore(S(), t),
              t,
              void 0,
              null != i ? i : {},
            );
          }
          return (o._$AI(t), o);
        })(e, this.renderRoot, this.renderOptions)));
    }
    connectedCallback() {
      var t;
      (super.connectedCallback(),
        null === (t = this._$Do) || void 0 === t || t.setConnected(!0));
    }
    disconnectedCallback() {
      var t;
      (super.disconnectedCallback(),
        null === (t = this._$Do) || void 0 === t || t.setConnected(!1));
    }
    render() {
      return U;
    }
  };
  ((et.finalized = !0),
    (et._$litElement$ = !0),
    null === (X = globalThis.litElementHydrateSupport) ||
      void 0 === X ||
      X.call(globalThis, { LitElement: et }));
  const it = globalThis.litElementPolyfillSupport;
  (null == it || it({ LitElement: et }),
    (null !== (tt = globalThis.litElementVersions) && void 0 !== tt
      ? tt
      : (globalThis.litElementVersions = [])
    ).push("3.2.2"));
  const st = (t) => (e) =>
      "function" == typeof e
        ? ((t, e) => (customElements.define(t, e), e))(t, e)
        : ((t, e) => {
            const { kind: i, elements: s } = e;
            return {
              kind: i,
              elements: s,
              finisher(e) {
                customElements.define(t, e);
              },
            };
          })(t, e),
    nt = (t, e) =>
      "method" === e.kind && e.descriptor && !("value" in e.descriptor)
        ? {
            ...e,
            finisher(i) {
              i.createProperty(e.key, t);
            },
          }
        : {
            kind: "field",
            key: Symbol(),
            placement: "own",
            descriptor: {},
            originalKey: e.key,
            initializer() {
              "function" == typeof e.initializer &&
                (this[e.key] = e.initializer.call(this));
            },
            finisher(i) {
              i.createProperty(e.key, t);
            },
          };
  function rt(t) {
    return (e, i) =>
      void 0 !== i
        ? ((t, e, i) => {
            e.constructor.createProperty(i, t);
          })(t, e, i)
        : nt(t, e);
  }
  var ot;
  null === (ot = window.HTMLSlotElement) ||
    void 0 === ot ||
    ot.prototype.assignedElements;
  class at {
    constructor() {
      this.handlers = [];
    }
    dispatch(t) {
      for (const e of this.handlers) e(t);
    }
    subscribe(t) {
      this.handlers.push(t);
    }
    unsubscribe(t) {
      this.handlers = this.handlers.filter((e) => e !== t);
    }
  }
  class lt {
    constructor() {
      this._promise = new Promise((t, e) => {
        ((this.resolve = t), (this.reject = e));
      });
    }
    get promise() {
      return this._promise;
    }
    setResult(t) {
      this.resolve && this.resolve(t);
    }
    setException(t) {
      this.reject && this.reject(t);
    }
  }
  function* dt(t) {
    const e = ct(t);
    if (0 === e.length) return;
    let i = e.length;
    for (let t = e.length; t > 0; t--)
      if ("/" === e[t - 1] || "\\" === e[t - 1]) {
        if (t != e.length) {
          const s = e.substring(t, i);
          s.length > 0 && (yield s);
        }
        i = t - 1;
      }
    const s = e.substring(0, i);
    s.length > 0 && (yield s);
  }
  function ct(t) {
    return decodeURIComponent(t.replace(/^C:\\fakepath\\/, ""));
  }
  class ht {
    constructor(t, e) {
      ((this.nodeNames = t),
        (this.callback = e),
        (this.observer = new MutationObserver(this.handleMutation.bind(this))),
        (this.items = []));
    }
    observe(t) {
      this.observer.observe(t, { childList: !0 });
    }
    disconnect() {
      (this.observer.disconnect(), this.callback((this.items = [])));
    }
    handleMutation(t) {
      let e = !1;
      (t.forEach((t) => {
        for (const i of t.addedNodes)
          this.nodeNames.indexOf(i.nodeName.toLowerCase()) > -1 &&
            ((e = !0), this.items.push(i));
        t.removedNodes.forEach((t) => {
          const i = this.items.indexOf(t);
          -1 !== i && ((e = !0), this.items.splice(i, 1));
        });
      }),
        e && this.callback(this.items));
    }
  }
  function ut(t) {
    return void 0 === t ? [] : Array.isArray(t) ? [...t] : [t];
  }
  function pt() {
    const t = () => Math.random().toString(16).slice(-4);
    return (
      t() + t() + "-" + t() + "-" + t() + "-" + t() + "-" + t() + t() + t()
    );
  }
  function vt(t, e) {
    return t.split(".").reduce((t, e) => t && t[e], e);
  }
  const gt = new (class {
    constructor() {
      ((this.language = this.getUILanguage()), (this.fallbackLanguage = "en"));
    }
    getMessage(t) {
      if (!this.locales || void 0 === t) return "";
      const e = (e) => vt(`${e}.${t}`, this.locales);
      return this.language === this.fallbackLanguage
        ? e(this.language) || ""
        : e(this.language) || e(this.fallbackLanguage) || "";
    }
    getUILanguage() {
      const t = window.navigator.language;
      return "zh-Hant" === t || "zh-TW" === t
        ? "zh_TW"
        : "zh" === t || "zh-Hans" === t || "zh-CN" === t
          ? "zh_CN"
          : window.navigator.language
            ? window.navigator.language.split("-")[0]
            : "en";
    }
  })();
  class bt {
    constructor(t) {
      this.key = t;
      const e = bt.tryParseMessageName(t);
      this.value = (e.success ? gt.getMessage(e.messageName) : t) || t;
    }
    static getMessage(t) {
      return new bt(t).toString();
    }
    static tryParseMessageName(t) {
      return t && t.startsWith("__MSG_") && t.endsWith("__")
        ? { success: !0, messageName: t.substring(6, t.length - 2) }
        : { success: !1 };
    }
    equals(t) {
      return void 0 !== t && this.key == t.key && this.value == t.value;
    }
    toString() {
      return this.value || "";
    }
  }
  const yt = {
    hasChanged: (t, e) => !(!t && !e) && (!t || !e || t.equals(e)),
    converter: {
      fromAttribute: (t) => (null === t ? void 0 : new bt(t)),
      toAttribute: (t) => (null == t ? void 0 : t.key),
    },
  };
  const ft = (t) =>
      class extends t {
        static get styles() {
          return [
            ut(super.styles),
            a`:host{--checkbox-size:16px}.checkable-container{align-items:center;display:inline-flex;padding:5px 0 0 0;user-select:none;width:auto}.checkable-container>input{display:none}.checkable-container>input:not(:disabled)~span{cursor:pointer}.checkable-container>input:disabled~span{opacity:var(--opacity-disabled)}.checkable-container>.checkable-symbol{align-self:flex-start;background:var(--input-bg-color);border:1px solid rgba(0,0,0,.2);border-radius:3px;flex:0 0 var(--checkbox-size);height:var(--checkbox-size);width:var(--checkbox-size)}.checkable-container>input[type=radio]~.checkable-symbol{border-radius:50%}.checkable-container>.checkable-text{flex:0 1 auto;margin:0 0 0 var(--spacer)}.checkable-container>input:checked~.checkable-symbol{background:#77f no-repeat center center;border:1px solid rgba(0,0,0,.4)}.checkable-container>input[type=checkbox]:checked~.checkable-symbol{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='10' viewBox='0 0 12 10'%3E%3Cpolygon fill='%23FFF' points='7.2 7.5 7.2 -1.3 8.7 -1.3 8.6 9.1 2.7 8.7 2.7 7.2' transform='rotate(37 5.718 3.896)'/%3E%3C/svg%3E%0A")}.checkable-container>input[type=radio]:checked~.checkable-symbol{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6' viewBox='0 0 6 6'%3E%3Ccircle cx='3' cy='3' r='3' fill='%23FFF'/%3E%3C/svg%3E%0A")}`,
          ];
        }
        renderCheckable(t, e, i) {
          return z`<label class="checkable-container">${e} <span class="checkable-symbol" role="${t}"></span> ${i && i ? z`<span class="checkable-text">${i}</span>` : void 0}</label>`;
        }
      },
    mt = 2,
    $t = Symbol();
  const xt = new (class {
      constructor() {
        ((this._connection = new lt()),
          (this._connectionInfo = new lt()),
          (this._isInitialized = !1),
          (this.message = new at()),
          (this.didReceiveGlobalSettings = new at()),
          (this.didReceiveSettings = new at()),
          (this.sendToPropertyInspector = new at()));
      }
      async connect(t, e, i, s, n) {
        if (!this._isInitialized) {
          const r = {
            actionInfo: n,
            info: s,
            propertyInspectorUUID: e,
            registerEvent: i,
          };
          (r.actionInfo && this.didReceiveSettings.dispatch(r.actionInfo),
            this._connectionInfo.setResult(r));
          const o = new WebSocket(`ws://localhost:${t}`);
          ((o.onmessage = this.handleMessage.bind(this)),
            (o.onopen = () => {
              (o.send(
                JSON.stringify({
                  event: r.registerEvent,
                  uuid: r.propertyInspectorUUID,
                }),
              ),
                this._connection.setResult(o));
            }),
            (this._isInitialized = !0));
        }
      }
      async getGlobalSettings() {
        return (await this.get("getGlobalSettings", "didReceiveGlobalSettings"))
          .payload.settings;
      }
      setGlobalSettings(t) {
        return this.send("setGlobalSettings", t);
      }
      async getSettings() {
        const { actionInfo: t } = await this.getConnectionInfo();
        return (
          await this.get(
            "getSettings",
            "didReceiveSettings",
            (e) =>
              e.action == t.action &&
              e.context == t.context &&
              e.device == t.device,
          )
        ).payload;
      }
      setSettings(t) {
        return this.send("setSettings", t);
      }
      async getConnectionInfo() {
        return this._connectionInfo.promise;
      }
      async get(t, e, i, s) {
        const n = new lt(),
          r = (t) => {
            if (t.event === e) {
              const e = t;
              (void 0 === i || i(e)) &&
                (this.message.unsubscribe(r), n.setResult(e));
            }
          };
        return (this.message.subscribe(r), await this.send(t, s), n.promise);
      }
      async send(t, e) {
        const i = await this._connectionInfo.promise;
        (await this._connection.promise).send(
          JSON.stringify({
            event: t,
            context: i.propertyInspectorUUID,
            payload: e,
            action: i.actionInfo.action,
          }),
        );
      }
      handleMessage(t) {
        const e = JSON.parse(t.data);
        switch (e.event) {
          case "didReceiveGlobalSettings":
            this.didReceiveGlobalSettings.dispatch(e);
            break;
          case "didReceiveSettings":
            this.didReceiveSettings.dispatch(e);
            break;
          case "sendToPropertyInspector":
            this.sendToPropertyInspector.dispatch(e);
        }
        this.message.dispatch(e);
      }
    })(),
    wt = (i) => {
      class s extends i {
        constructor(...t) {
          (super(t),
            (this._dataSourceInitialized = !1),
            (this._mutationObserver = new ht(["optgroup", "option"], () =>
              this.refresh(),
            )),
            (this.hotReload = !1),
            (this.loadingText = new bt("Loading...")),
            (this.items = new (class {
              constructor(t, e, i) {
                ((this.i = 0),
                  (this.status = 0),
                  (this.autoRun = !0),
                  (this.o = t),
                  this.o.addController(this));
                const s = "object" == typeof e ? e : { task: e, args: i };
                ((this.t = s.task),
                  (this.h = s.args),
                  (this.l = s.onComplete),
                  (this.u = s.onError),
                  void 0 !== s.autoRun && (this.autoRun = s.autoRun),
                  (this.taskComplete = new Promise((t, e) => {
                    ((this.v = t), (this._ = e));
                  })));
              }
              hostUpdated() {
                this.performTask();
              }
              async performTask() {
                var t;
                const e =
                  null === (t = this.h) || void 0 === t ? void 0 : t.call(this);
                this.shouldRun(e) && this.run(e);
              }
              shouldRun(t) {
                return this.autoRun && this.m(t);
              }
              async run(t) {
                var e, i, s;
                let n, r;
                (null != t ||
                  (t =
                    null === (e = this.h) || void 0 === e
                      ? void 0
                      : e.call(this)),
                  (2 !== this.status && 3 !== this.status) ||
                    (this.taskComplete = new Promise((t, e) => {
                      ((this.v = t), (this._ = e));
                    })),
                  (this.status = 1),
                  this.o.requestUpdate());
                const o = ++this.i;
                try {
                  n = await this.t(t);
                } catch (t) {
                  r = t;
                }
                if (this.i === o) {
                  if (n === $t) this.status = 0;
                  else {
                    if (void 0 === r) {
                      try {
                        null === (i = this.l) ||
                          void 0 === i ||
                          i.call(this, n);
                      } catch {}
                      ((this.status = 2), this.v(n));
                    } else {
                      try {
                        null === (s = this.u) ||
                          void 0 === s ||
                          s.call(this, r);
                      } catch {}
                      ((this.status = 3), this._(r));
                    }
                    ((this.T = n), (this.k = r));
                  }
                  this.o.requestUpdate();
                }
              }
              get value() {
                return this.T;
              }
              get error() {
                return this.k;
              }
              render(t) {
                var e, i, s, n;
                switch (this.status) {
                  case 0:
                    return null === (e = t.initial) || void 0 === e
                      ? void 0
                      : e.call(t);
                  case 1:
                    return null === (i = t.pending) || void 0 === i
                      ? void 0
                      : i.call(t);
                  case 2:
                    return null === (s = t.complete) || void 0 === s
                      ? void 0
                      : s.call(t, this.value);
                  case 3:
                    return null === (n = t.error) || void 0 === n
                      ? void 0
                      : n.call(t, this.error);
                  default:
                    this.status;
                }
              }
              m(t) {
                const e = this.p;
                return (
                  (this.p = t),
                  Array.isArray(t) && Array.isArray(e)
                    ? t.length === e.length && t.some((t, i) => g(t, e[i]))
                    : t !== e
                );
              }
            })(
              this,
              async ([t]) => {
                var e;
                if (void 0 === t) return this.getItemsFromChildNodes();
                const i = { event: this.dataSource };
                this._dataSourceInitialized && (i.isRefresh = !0);
                const s =
                  null !== (e = this._itemsDataSource) && void 0 !== e
                    ? e
                    : await xt.get(
                        "sendToPlugin",
                        "sendToPropertyInspector",
                        (t) => {
                          var e;
                          return (
                            (null === (e = t.payload) || void 0 === e
                              ? void 0
                              : e.event) === this.dataSource
                          );
                        },
                        i,
                      );
                return (
                  (this._dataSourceInitialized = !0),
                  (this._itemsDataSource = void 0),
                  gt.locales && this.localize(s.payload.items),
                  s.payload.items
                );
              },
              () => [this.dataSource],
            )),
            this._mutationObserver.observe(this));
        }
        refresh() {
          this.items.run();
        }
        connectedCallback() {
          (super.connectedCallback(),
            void 0 !== this.dataSource &&
              void 0 !== this.hotReload &&
              xt.sendToPropertyInspector.subscribe((t) => {
                var e;
                this._dataSourceInitialized &&
                  (null === (e = t.payload) || void 0 === e
                    ? void 0
                    : e.event) === this.dataSource &&
                  ((this._itemsDataSource = t), this.items.run());
              }));
        }
        renderDataSource(t, e) {
          if (void 0 === this.items.value || 0 === this.items.value.length)
            return [void 0];
          const i = (s) =>
            this.isItemGroup(s)
              ? e
                ? e(s, s.children.map(i))
                : void 0
              : this.isItem(s)
                ? t(s)
                : void 0;
          return this.items.value.map(i);
        }
        getItemsFromChildNodes() {
          const t = (e, i) => (
            i instanceof HTMLOptGroupElement
              ? e.push({
                  label: bt.getMessage(i.label),
                  children: Array.from(i.childNodes).reduce(t, []),
                })
              : i instanceof HTMLOptionElement &&
                e.push({
                  disabled: i.disabled,
                  label: bt.getMessage(i.text),
                  value: i.value,
                }),
            e
          );
          return this._mutationObserver.items.reduce(t, []);
        }
        localize(t) {
          for (const e of t)
            (e.label && (e.label = bt.getMessage(e.label.toString())),
              this.isItemGroup(e) && this.localize(e.children));
        }
        isItem(t) {
          return t && void 0 !== t.value;
        }
        isItemGroup(t) {
          return t && void 0 !== t.children && Array.isArray(t.children);
        }
      }
      return (
        t([rt(), e("design:type", String)], s.prototype, "dataSource", void 0),
        t(
          [
            rt({ attribute: "hot-reload", type: Boolean }),
            e("design:type", Object),
          ],
          s.prototype,
          "hotReload",
          void 0,
        ),
        t(
          [
            rt({
              attribute: "loading",
              hasChanged: yt.hasChanged,
              converter: yt.converter,
            }),
            e("design:type", Object),
          ],
          s.prototype,
          "loadingText",
          void 0,
        ),
        s
      );
    },
    _t = 2,
    Lt =
      (t) =>
      (...e) => ({ _$litDirective$: t, values: e });
  let At = class {
    constructor(t) {}
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AT(t, e, i) {
      ((this._$Ct = t), (this._$AM = e), (this._$Ci = i));
    }
    _$AS(t, e) {
      return this.update(t, e);
    }
    update(t, e) {
      return this.render(...e);
    }
  };
  const St = (t, e) => {
      var i, s;
      const n = t._$AN;
      if (void 0 === n) return !1;
      for (const t of n)
        (null === (s = (i = t)._$AO) || void 0 === s || s.call(i, e, !1),
          St(t, e));
      return !0;
    },
    Mt = (t) => {
      let e, i;
      do {
        if (void 0 === (e = t._$AM)) break;
        ((i = e._$AN), i.delete(t), (t = e));
      } while (0 === (null == i ? void 0 : i.size));
    },
    kt = (t) => {
      for (let e; (e = t._$AM); t = e) {
        let i = e._$AN;
        if (void 0 === i) e._$AN = i = new Set();
        else if (i.has(t)) break;
        (i.add(t), Ct(e));
      }
    };
  function It(t) {
    void 0 !== this._$AN
      ? (Mt(this), (this._$AM = t), kt(this))
      : (this._$AM = t);
  }
  function Et(t, e = !1, i = 0) {
    const s = this._$AH,
      n = this._$AN;
    if (void 0 !== n && 0 !== n.size)
      if (e)
        if (Array.isArray(s))
          for (let t = i; t < s.length; t++) (St(s[t], !1), Mt(s[t]));
        else null != s && (St(s, !1), Mt(s));
      else St(this, t);
  }
  const Ct = (t) => {
    var e, i, s, n;
    t.type == _t &&
      ((null !== (e = (s = t)._$AP) && void 0 !== e) || (s._$AP = Et),
      (null !== (i = (n = t)._$AQ) && void 0 !== i) || (n._$AQ = It));
  };
  let Nt = class extends At {
    constructor() {
      (super(...arguments), (this._$AN = void 0));
    }
    _$AT(t, e, i) {
      (super._$AT(t, e, i), kt(this), (this.isConnected = t._$AU));
    }
    _$AO(t, e = !0) {
      var i, s;
      (t !== this.isConnected &&
        ((this.isConnected = t),
        t
          ? null === (i = this.reconnected) || void 0 === i || i.call(this)
          : null === (s = this.disconnected) || void 0 === s || s.call(this)),
        e && (St(this, t), Mt(this)));
    }
    setValue(t) {
      if (((t) => void 0 === t.strings)(this._$Ct)) this._$Ct._$AI(t, this);
      else {
        const e = [...this._$Ct._$AH];
        ((e[this._$Ci] = t), this._$Ct._$AI(e, this, 0));
      }
    }
    disconnected() {}
    reconnected() {}
  };
  class Dt {}
  const jt = new WeakMap(),
    Tt = Lt(
      class extends Nt {
        render(t) {
          return O;
        }
        update(t, [e]) {
          var i;
          const s = e !== this.Y;
          return (
            s && void 0 !== this.Y && this.rt(void 0),
            (s || this.lt !== this.ct) &&
              ((this.Y = e),
              (this.dt =
                null === (i = t.options) || void 0 === i ? void 0 : i.host),
              this.rt((this.ct = t.element))),
            O
          );
        }
        rt(t) {
          var e;
          if ("function" == typeof this.Y) {
            const i = null !== (e = this.dt) && void 0 !== e ? e : globalThis;
            let s = jt.get(i);
            (void 0 === s && ((s = new WeakMap()), jt.set(i, s)),
              void 0 !== s.get(this.Y) && this.Y.call(this.dt, void 0),
              s.set(this.Y, t),
              void 0 !== t && this.Y.call(this.dt, t));
          } else this.Y.value = t;
        }
        get lt() {
          var t, e, i;
          return "function" == typeof this.Y
            ? null ===
                (e = jt.get(
                  null !== (t = this.dt) && void 0 !== t ? t : globalThis,
                )) || void 0 === e
              ? void 0
              : e.get(this.Y)
            : null === (i = this.Y) || void 0 === i
              ? void 0
              : i.value;
        }
        disconnected() {
          this.lt === this.ct && this.rt(void 0);
        }
        reconnected() {
          this.rt(this.ct);
        }
      },
    ),
    zt = (i) => {
      class s extends i {
        static get styles() {
          return [
            ...ut(super.styles),
            a`label{align-self:center;background-color:var(--input-bg-color);color:var(--input-font-color);font-family:var(--font-family);font-size:var(--font-size);line-height:1.5em;min-height:calc(var(--input-height) - calc(var(--spacer) * 3));overflow:hidden;padding:calc(var(--spacer) * 1.5) var(--spacer);text-overflow:ellipsis;white-space:nowrap;width:100%}label[aria-disabled=true]{opacity:var(--opacity-disabled)}sdpi-button>div{min-width:16px;user-select:none}`,
          ];
        }
        renderDelegate(t = (t) => t) {
          var e;
          const i = void 0 !== this.value ? this.value : this.defaultValue;
          return z`<div class="flex container"><label class="flex-grow" aria-disabled="${this.disabled}" @click="${() => !this.disabled && this.invoked && this.invoked()}" .title="${(null == i ? void 0 : i.toString()) || ""}">${t(i)}</label><sdpi-button class="flex-shrink margin-left" ${Tt(this.focusElement)} .disabled="${this.disabled}" @click="${() => !this.disabled && this.invoked && this.invoked()}"><div>${(null === (e = this.label) || void 0 === e ? void 0 : e.toString()) || "..."}</div></sdpi-button></div>`;
        }
      }
      return (
        t([rt(yt), e("design:type", bt)], s.prototype, "label", void 0),
        s
      );
    },
    Ut = (i) => {
      class s extends i {
        parseValue(t) {
          switch (this.valueType) {
            case "boolean":
              return (function (t) {
                switch (typeof t) {
                  case "boolean":
                    return t;
                  case "number":
                    return 0 !== t;
                  default: {
                    const e = t.toString().toLowerCase();
                    return "false" !== e && "0" !== e;
                  }
                }
              })(t);
            case "number":
              return (function (t) {
                switch (typeof t) {
                  case "boolean":
                    return t ? 1 : 0;
                  case "number":
                    return t;
                  default:
                    return parseFloat(t);
                }
              })(t);
            case "string":
              return t.toString();
            default:
              return t;
          }
        }
      }
      return (
        t(
          [rt({ attribute: "value-type" }), e("design:type", Object)],
          s.prototype,
          "valueType",
          void 0,
        ),
        s
      );
    },
    Ot = (t) =>
      class extends t {
        constructor() {
          (super(...arguments), (this.focusElement = new Dt()));
        }
        get canFocus() {
          return void 0 !== this.focusElement.value;
        }
        focus() {
          void 0 !== this.focusElement.value &&
            (this.focusWithClick()
              ? this.focusElement.value.click()
              : this.focusElement.value.focus());
        }
        focusWithClick() {
          if (void 0 === this.focusElement.value)
            throw new Error("focusElement cannot be undefined.");
          return (
            !("type" in this.focusElement.value) ||
            "checkbox" === this.focusElement.value.type ||
            "color" === this.focusElement.value.type ||
            "file" === this.focusElement.value.type
          );
        }
      },
    Rt = (i) => {
      class s extends i {
        constructor() {
          (super(...arguments), (this.columns = 1));
        }
        static get styles() {
          return [
            ut(super.styles),
            a`.gridded-container{display:flex;flex-wrap:wrap}.gridded-container>.gridded-item{box-sizing:border-box;margin:0 var(--spacer) 0 0;flex:0 1}.gridded-container>.gridded-col-1{flex-basis:100%}.gridded-container>.gridded-col-2{flex-basis:calc((100% / 2) - (var(--spacer) * 1 / 2))}.gridded-container>.gridded-col-3{flex-basis:calc((100% / 3 - (var(--spacer) * 2 / 3)))}.gridded-container>.gridded-col-4{flex-basis:calc((100% / 4 - (var(--spacer) * 3 / 4)))}.gridded-container>.gridded-col-5{flex-basis:calc((100% / 5 - (var(--spacer) * 4 / 5)))}.gridded-container>.gridded-col-6{flex-basis:calc((100% / 6 - (var(--spacer) * 5 / 6)))}.gridded-container>.gridded-col-1,.gridded-container>.gridded-col-2:nth-child(2n),.gridded-container>.gridded-col-3:nth-child(3n),.gridded-container>.gridded-col-4:nth-child(4n),.gridded-container>.gridded-col-5:nth-child(5n),.gridded-container>.gridded-col-6:nth-child(6n){margin-right:0}`,
          ];
        }
        renderGrid(t) {
          if (0 !== t.length)
            return z`<div class="gridded-container">${t.map((t) => z`<div class="gridded-item gridded-col-${this.columns}">${t}</div>`)}</div>`;
        }
      }
      return (
        t(
          [rt({ type: Number }), e("design:type", Object)],
          s.prototype,
          "columns",
          void 0,
        ),
        s
      );
    },
    Pt = a`.flex{align-items:stretch;display:flex}.flex-grow{flex:1 1 auto}.flex-shrink{flex:0 0 auto}.margin-left{margin-left:var(--spacer)}`,
    Ht = a`:host{--spacer:4px;--opacity-disabled:0.5;--window-bg-color:#2d2d2d;--font-color:#969696;--input-bg-color:#3d3d3d;--input-font-color:#d8d8d8;--scrollbar-box-shadow:inset 0 0 6px rgba(0, 0, 0, 0.3);--font-family:"Segoe UI",Arial,Roboto,Helvetica sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";--font-size:9pt;--input-height:30px}`,
    Zt = (i) => {
      class s extends i {
        constructor() {
          (super(...arguments), (this.disabled = !1), (this.inputId = pt()));
        }
        static get styles() {
          return [
            ut(super.styles),
            Ht,
            Pt,
            a`button,input,select,textarea{box-sizing:border-box;outline:0;border:none;border-radius:0;min-width:100%;max-width:100%;color:var(--input-font-color);font-size:var(--font-size);font-family:var(--font-family)}`,
          ];
        }
      }
      return (
        t(
          [rt({ reflect: !0, type: Boolean }), e("design:type", Object)],
          s.prototype,
          "disabled",
          void 0,
        ),
        t(
          [rt({ attribute: !1 }), e("design:type", Object)],
          s.prototype,
          "value",
          void 0,
        ),
        t(
          [rt({ attribute: "default" }), e("design:type", Object)],
          s.prototype,
          "defaultValue",
          void 0,
        ),
        s
      );
    };
  class Yt {
    constructor(t, e) {
      ((this.didReceive = t),
        (this.save = e),
        (this._initialization = new Promise((e) => {
          t.subscribe((t) => {
            ((this._settings = t.payload.settings), e());
          });
        })));
    }
    use(t, e, i = 250, s = !0) {
      e &&
        this.didReceive.subscribe((i) => {
          var s;
          void 0 !==
            (null === (s = null == i ? void 0 : i.payload) || void 0 === s
              ? void 0
              : s.settings) && e(vt(t, i.payload.settings));
        });
      const n = i
        ? (function (t, e) {
            let i, s;
            return (n, ...r) => (
              clearTimeout(i),
              (s = s || new lt()),
              (i = setTimeout(
                async () => {
                  const e = s;
                  ((s = void 0), await t(n), null == e || e.setResult());
                },
                e,
                r,
              )),
              s.promise
            );
          })((e) => this.set(t, e, s), i)
        : (e) => this.set(t, e, s);
      return [
        async () => (await this._initialization, vt(t, await this._settings)),
        n,
      ];
    }
    async set(t, e, i = !0) {
      await this._initialization;
      vt(t, this._settings) !== e &&
        (!(function (t, e, i) {
          const s = t.split(".");
          s.reduce(
            (t, e, n) =>
              n === s.length - 1 ? (t[e] = i) : t[e] || (t[e] = {}),
            e,
          );
        })(t, this._settings, e),
        i && (await this.save(this._settings)));
    }
  }
  const Bt = new Yt(xt.didReceiveSettings, (t) => xt.setSettings(t)),
    Vt = Bt.use.bind(Bt);
  let Gt = !1;
  const Wt = new Yt(xt.didReceiveGlobalSettings, (t) =>
      xt.setGlobalSettings(t),
    ),
    Qt = (t, e, i = 250, s = !0) => (
      Gt || (xt.getGlobalSettings(), (Gt = !0)),
      Wt.use(t, e, i, s)
    ),
    qt = (i) => {
      class s extends i {
        constructor() {
          (super(...arguments), (this.isGlobal = !1));
        }
        get value() {
          return this._value;
        }
        set value(t) {
          if (this._value != t) {
            const e = this._value;
            ((this._value = t),
              this.requestUpdate("value", e),
              this.dispatchEvent(new Event("valuechange")));
          }
        }
        firstUpdated(t) {
          if ((super.firstUpdated(t), this.setting)) {
            const t = this.delaySave ? 200 : null;
            this.isGlobal
              ? ([, this.save] = Qt(this.setting, (t) => (this.value = t), t))
              : ([, this.save] = Vt(this.setting, (t) => (this.value = t), t));
          }
        }
        willUpdate(t) {
          t.has("value") && this.save && this.save(this.value);
        }
      }
      return (
        t(
          [
            rt({ attribute: "global", type: Boolean }),
            e("design:type", Object),
          ],
          s.prototype,
          "isGlobal",
          void 0,
        ),
        t([rt(), e("design:type", String)], s.prototype, "setting", void 0),
        t(
          [
            rt({ attribute: !1 }),
            e("design:type", Object),
            e("design:paramtypes", [Object]),
          ],
          s.prototype,
          "value",
          null,
        ),
        s
      );
    };
  let Ft = class extends Zt(et) {
    static get styles() {
      return [
        ...super.styles,
        Ht,
        a`button{background-color:var(--window-bg-color);border:1px solid #969696;border-radius:3px;padding:calc(var(--spacer) * 1.5)}button:not(:disabled):hover{background-color:#464646;cursor:pointer}button:not(:disabled):active{background-color:var(--window-bg-color);border-color:#646464;color:#969696}button:disabled{opacity:var(--opacity-disabled)}`,
      ];
    }
    render() {
      return z`<button .disabled="${this.disabled}" .value="${this.value || ""}"><slot></slot></button>`;
    }
  };
  Ft = t([st("sdpi-button")], Ft);
  const Jt = (t) => (null != t ? t : O);
  class Kt {
    constructor(t, e) {
      ((this.host = t),
        this.host.addController(this),
        (this.observer = new ht(e, this.handleMutation.bind(this))));
    }
    get items() {
      return this.observer.items;
    }
    hostConnected() {
      this.observer.observe(this.host);
    }
    hostDisconnected() {
      this.observer.disconnect();
    }
    handleMutation() {
      if (this.mutated) {
        const t = { preventRequestUpdate: !1 };
        if ((this.mutated(t), t.preventRequestUpdate)) return;
      }
      this.host.requestUpdate();
    }
  }
  class Xt extends Kt {
    constructor(t) {
      super(t, ["datalist"]);
    }
    mutated(t) {
      0 === this.items.length
        ? (this.dataList = void 0)
        : void 0 === this.dataList || this.dataList.id !== this.items[0].id
          ? ((this.items[0].id = this.items[0].id || pt()),
            (this.dataList = this.items[0].cloneNode(!0)))
          : (t.preventRequestUpdate = !0);
    }
  }
  let te = class extends qt(Ot(Zt(et))) {
    constructor() {
      (super(...arguments),
        (this.dataListController = new Xt(this)),
        (this.type = "date"));
    }
    static get styles() {
      return [
        ...super.styles,
        a`input{background-color:var(--input-bg-color);padding:calc(var(--spacer) + 1px) var(--spacer)}input[type=time]{padding:calc(var(--spacer) + 2px) var(--spacer)}input:disabled{opacity:var(--opacity-disabled)}::-webkit-clear-button,::-webkit-inner-spin-button{display:none}::-webkit-calendar-picker-indicator{-webkit-appearance:none;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cg fill='%239C9C9C'%3E%3Cpath d='M15,15 L1.77635684e-15,15 L1.77635684e-15,1 L15,1 L15,15 Z M5,7 L5,8 L6,8 L6,7 L5,7 Z M3,7 L3,8 L4,8 L4,7 L3,7 Z M7,7 L7,8 L8,8 L8,7 L7,7 Z M9,7 L9,8 L10,8 L10,7 L9,7 Z M11,7 L11,8 L12,8 L12,7 L11,7 Z M3,9 L3,10 L4,10 L4,9 L3,9 Z M5,9 L5,10 L6,10 L6,9 L5,9 Z M7,9 L7,10 L8,10 L8,9 L7,9 Z M9,9 L9,10 L10,10 L10,9 L9,9 Z M11,9 L11,10 L12,10 L12,9 L11,9 Z M3,11 L3,12 L4,12 L4,11 L3,11 Z M5,11 L5,12 L6,12 L6,11 L5,11 Z M7,11 L7,12 L8,12 L8,11 L7,11 Z M9,11 L9,12 L10,12 L10,11 L9,11 Z M11,11 L11,12 L12,12 L12,11 L11,11 Z M14,4 L14,2 L1,2 L1,4 L14,4 Z'/%3E%3Crect width='1' height='1' x='2'/%3E%3Crect width='1' height='1' x='12'/%3E%3C/g%3E%3C/svg%3E%0A") top left no-repeat;cursor:pointer;font-size:0;margin:0 calc(var(--spacer)/ 2) 0 0;opacity:1;padding:8px}::-webkit-calendar-picker-indicator:hover{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cg fill='%23CECECE'%3E%3Cpath d='M15,15 L1.77635684e-15,15 L1.77635684e-15,1 L15,1 L15,15 Z M5,7 L5,8 L6,8 L6,7 L5,7 Z M3,7 L3,8 L4,8 L4,7 L3,7 Z M7,7 L7,8 L8,8 L8,7 L7,7 Z M9,7 L9,8 L10,8 L10,7 L9,7 Z M11,7 L11,8 L12,8 L12,7 L11,7 Z M3,9 L3,10 L4,10 L4,9 L3,9 Z M5,9 L5,10 L6,10 L6,9 L5,9 Z M7,9 L7,10 L8,10 L8,9 L7,9 Z M9,9 L9,10 L10,10 L10,9 L9,9 Z M11,9 L11,10 L12,10 L12,9 L11,9 Z M3,11 L3,12 L4,12 L4,11 L3,11 Z M5,11 L5,12 L6,12 L6,11 L5,11 Z M7,11 L7,12 L8,12 L8,11 L7,11 Z M9,11 L9,12 L10,12 L10,11 L9,11 Z M11,11 L11,12 L12,12 L12,11 L11,11 Z M14,4 L14,2 L1,2 L1,4 L14,4 Z'/%3E%3Crect width='1' height='1' x='2'/%3E%3Crect width='1' height='1' x='12'/%3E%3C/g%3E%3C/svg%3E%0A")}`,
      ];
    }
    render() {
      var t;
      return z`<input ${Tt(this.focusElement)} type="${this.type}" list="${Jt(null === (t = this.dataListController.dataList) || void 0 === t ? void 0 : t.id)}" max="${Jt(this.max)}" min="${Jt(this.min)}" step="${Jt(this.step)}" .disabled="${this.disabled}" .value="${this.value || this.defaultValue || ""}" @change="${(t) => (this.value = t.target.value)}"> ${this.dataListController.dataList}`;
    }
  };
  (t([rt(), e("design:type", String)], te.prototype, "max", void 0),
    t([rt(), e("design:type", String)], te.prototype, "min", void 0),
    t(
      [rt({ type: Number }), e("design:type", Number)],
      te.prototype,
      "step",
      void 0,
    ),
    t([rt(), e("design:type", String)], te.prototype, "type", void 0),
    (te = t([st("sdpi-calendar")], te)));
  let ee = class extends qt(Ot(ft(Zt(et)))) {
    render() {
      var t, e;
      return this.renderCheckable(
        "checkbox",
        z`<input ${Tt(this.focusElement)} type="checkbox" .checked="${null !== (e = null !== (t = this.value) && void 0 !== t ? t : this.defaultValue) && void 0 !== e && e}" .disabled="${this.disabled}" @change="${(t) => (this.value = t.target.checked)}">`,
        this.label,
      );
    }
  };
  (t([rt(yt), e("design:type", bt)], ee.prototype, "label", void 0),
    (ee = t([st("sdpi-checkbox")], ee)));
  let ie = class extends Rt(qt(ft(wt(Ut(Zt(et)))))) {
    static get styles() {
      return [
        ...super.styles,
        a`.loading{margin:0;padding:calc(var(--spacer) * 1.5) 0;user-select:none}`,
      ];
    }
    render() {
      return this.items.render({
        pending: () => z`<p class="loading">${this.loadingText}</p>`,
        complete: () =>
          this.renderGrid(
            this.renderDataSource((t) =>
              this.renderCheckable(
                "checkbox",
                z`<input type="checkbox" .checked="${(this.value && this.value.findIndex((e) => e == t.value) > -1) || !1}" .disabled="${this.disabled || t.disabled || !1}" .value="${t.value}" @change="${this.handleChange}">`,
                t.label,
              ),
            ),
          ),
      });
    }
    handleChange(t) {
      const e = this.parseValue(t.target.value);
      if (void 0 === e) return;
      const i = new Set(this.value);
      (t.target.checked ? i.add(e) : i.delete(e), (this.value = Array.from(i)));
    }
  };
  ie = t([st("sdpi-checkbox-list")], ie);
  let se = class extends qt(Ot(Zt(et))) {
    static get styles() {
      return [
        ...super.styles,
        a`input{background-color:var(--input-bg-color);height:var(--input-height)}input:disabled{opacity:var(--opacity-disabled)}`,
      ];
    }
    render() {
      return z`<input type="color" ${Tt(this.focusElement)} .disabled="${this.disabled}" .defaultValue="${this.value || this.defaultValue || ""}" @change="${(t) => (this.value = t.target.value)}">`;
    }
  };
  se = t([st("sdpi-color")], se);
  let ne = class extends zt(qt(Ot(Zt(et)))) {
    render() {
      return this.renderDelegate((t) => {
        if (null == t) return t;
        if ("path" === this.formatType) {
          const { done: e, value: i } = dt(t.toString()).next();
          return e ? t : i;
        }
        return t;
      });
    }
    invoked() {
      this.disabled ||
        (void 0 === this.invoke
          ? console.warn(
              'Delegation failed, consider setting the "invoke" attribute. When defined, `sendToPlugin` is invoked with the specified attribute value, allowing for the plug-in to determine the persisted value.',
            )
          : xt.send("sendToPlugin", { event: this.invoke }));
    }
  };
  (t(
    [rt({ attribute: "format-type" }), e("design:type", Object)],
    ne.prototype,
    "formatType",
    void 0,
  ),
    t([rt(), e("design:type", String)], ne.prototype, "invoke", void 0),
    (ne = t([st("sdpi-delegate")], ne)));
  let re = class extends zt(qt(Ot(Zt(et)))) {
    static get styles() {
      return [...super.styles, a`input[type=file]{display:none}`];
    }
    render() {
      return z`${super.renderDelegate((t) =>
        (function (t) {
          const { done: e, value: i } = dt(t).next();
          return e ? "" : i;
        })((null == t ? void 0 : t.toString()) || ""),
      )} <input ${Tt(this.focusElement)} type="file" id="file_input" .accept="${this.accept || ""}" .disabled="${this.disabled}" @change="${(t) => (this.value = ct(t.target.value))}">`;
    }
    invoked() {
      var t;
      null === (t = this.focusElement.value) || void 0 === t || t.click();
    }
  };
  (t([rt(), e("design:type", String)], re.prototype, "accept", void 0),
    (re = t([st("sdpi-file")], re)));
  let oe = class extends et {
    render() {
      return this.key ? z`${gt.getMessage(this.key)}` : void 0;
    }
  };
  (t([rt(), e("design:type", String)], oe.prototype, "key", void 0),
    (oe = t([st("sdpi-i18n")], oe)));
  let ae = class extends qt(Ot(Zt(et))) {
    constructor() {
      (super(...arguments),
        (this.required = !1),
        (this.delaySave = !0),
        (this.type = "text"));
    }
    static get styles() {
      return [
        ...super.styles,
        Ht,
        a`input{background-color:var(--input-bg-color);padding:calc(var(--spacer) + 3px) var(--spacer)}input:disabled{opacity:var(--opacity-disabled)}input:required{background-position:98% center;background-repeat:no-repeat}input:required:valid{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5IiBoZWlnaHQ9IjkiIHZpZXdCb3g9IjAgMCA5IDkiPjxwb2x5Z29uIGZpbGw9IiNEOEQ4RDgiIHBvaW50cz0iNS4yIDEgNi4yIDEgNi4yIDcgMy4yIDcgMy4yIDYgNS4yIDYiIHRyYW5zZm9ybT0icm90YXRlKDQwIDQuNjc3IDQpIi8+PC9zdmc+)}input:required:invalid{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5IiBoZWlnaHQ9IjkiIHZpZXdCb3g9IjAgMCA5IDkiPgogICAgPHBhdGggZmlsbD0iI0Q4RDhEOCIgZD0iTTQuNSwwIEM2Ljk4NTI4MTM3LC00LjU2NTM4NzgyZS0xNiA5LDIuMDE0NzE4NjMgOSw0LjUgQzksNi45ODUyODEzNyA2Ljk4NTI4MTM3LDkgNC41LDkgQzIuMDE0NzE4NjMsOSAzLjA0MzU5MTg4ZS0xNiw2Ljk4NTI4MTM3IDAsNC41IEMtMy4wNDM1OTE4OGUtMTYsMi4wMTQ3MTg2MyAyLjAxNDcxODYzLDQuNTY1Mzg3ODJlLTE2IDQuNSwwIFogTTQsMSBMNCw2IEw1LDYgTDUsMSBMNCwxIFogTTQuNSw4IEM0Ljc3NjE0MjM3LDggNSw3Ljc3NjE0MjM3IDUsNy41IEM1LDcuMjIzODU3NjMgNC43NzYxNDIzNyw3IDQuNSw3IEM0LjIyMzg1NzYzLDcgNCw3LjIyMzg1NzYzIDQsNy41IEM0LDcuNzc2MTQyMzcgNC4yMjM4NTc2Myw4IDQuNSw4IFoiLz4KICA8L3N2Zz4)}`,
      ];
    }
    render() {
      var t;
      return z`<input ${Tt(this.focusElement)} pattern="${Jt(this.pattern)}" placeholder="${Jt(null === (t = this.placeholder) || void 0 === t ? void 0 : t.toString())}" maxlength="${Jt(this.maxLength)}" .disabled="${this.disabled}" .required="${this.required}" .type="${this.type}" .value="${this.value || ""}" @input="${(t) => (this.value = t.target.value)}">`;
    }
  };
  (t(
    [rt({ attribute: "maxlength", type: Number }), e("design:type", Number)],
    ae.prototype,
    "maxLength",
    void 0,
  ),
    t([rt(), e("design:type", String)], ae.prototype, "pattern", void 0),
    t([rt(yt), e("design:type", bt)], ae.prototype, "placeholder", void 0),
    t(
      [rt({ type: Boolean }), e("design:type", Object)],
      ae.prototype,
      "required",
      void 0,
    ),
    (ae = t([st("sdpi-textfield")], ae)));
  let le = class extends ae {
    constructor() {
      (super(...arguments), (this.type = "password"));
    }
  };
  le = t([st("sdpi-password")], le);
  let de = class extends Rt(qt(ft(wt(Ut(Zt(et)))))) {
    static get styles() {
      return [
        ...super.styles,
        a`.loading{margin:0;padding:calc(var(--spacer) * 1.5) 0;user-select:none}`,
      ];
    }
    render() {
      return this.items.render({
        pending: () => z`<p class="loading">${this.loadingText}</p>`,
        complete: () =>
          this.renderGrid(
            this.renderDataSource((t) =>
              this.renderCheckable(
                "radio",
                z`<input type="radio" name="_" .checked="${this.value == t.value || (null != this.defaultValue && this.defaultValue == t.value)}" .disabled="${this.disabled || t.disabled || !1}" .value="${t.value}" @change="${(t) => (this.value = this.parseValue(t.target.value))}">`,
                t.label,
              ),
            ),
          ),
      });
    }
  };
  de = t([st("sdpi-radio")], de);
  let ce = class extends qt(Ot(Zt(et))) {
    constructor() {
      (super(...arguments), (this.showLabels = !1), (this.delaySave = !0));
    }
    static get styles() {
      return [
        ...super.styles,
        a`input{-webkit-appearance:none;margin:0;height:22px;background-color:transparent}.container>div[aria-disabled=true],input:disabled{cursor:default;opacity:var(--opacity-disabled)}::-webkit-slider-runnable-track{margin-top:2px;height:5px;padding:0!important;border:solid 1px var(--input-bg-color);background:#636363;border-radius:3px}::-webkit-slider-thumb{-webkit-appearance:none;background-color:var(--input-font-color);border-radius:50%;cursor:pointer;top:-4px;position:relative;height:12px;width:12px}input:disabled::-webkit-slider-thumb{cursor:default}input::-webkit-slider-thumb::before{position:absolute;content:""}.container{display:flex;align-items:center}.container>div{flex:0 1}div[role=button]{cursor:pointer;user-select:none}.container>div:nth-child(2){flex:1 1;margin:0 var(--spacer)}`,
      ];
    }
    render() {
      var t, e;
      const i =
          (null === (t = this.value) || void 0 === t ? void 0 : t.toString()) ||
          (null === (e = this.defaultValue) || void 0 === e
            ? void 0
            : e.toString()) ||
          "",
        s = z`<input ${Tt(this.focusElement)} type="range" max="${Jt(this.max)}" min="${Jt(this.min)}" step="${Jt(this.step)}" .disabled="${this.disabled}" .title="${i}" .value="${i}" @change="${(t) => (this.value = t.target.valueAsNumber)}">`;
      return this.showLabels
        ? z`<div class="container"><div aria-disabled="${this.disabled}" role="button" @click="${() => !this.disabled && void 0 !== this.min && (this.value = this.min)}"><slot name="min">${this.min}</slot></div><div>${s}</div><div aria-disabled="${this.disabled}" role="button" @click="${() => !this.disabled && void 0 !== this.max && (this.value = this.max)}"><slot name="max">${this.max}</slot></div></div>`
        : s;
    }
  };
  (t(
    [rt({ type: Number }), e("design:type", Number)],
    ce.prototype,
    "max",
    void 0,
  ),
    t(
      [rt({ type: Number }), e("design:type", Number)],
      ce.prototype,
      "min",
      void 0,
    ),
    t(
      [
        rt({ attribute: "showlabels", type: Boolean }),
        e("design:type", Object),
      ],
      ce.prototype,
      "showLabels",
      void 0,
    ),
    t(
      [rt({ type: Number }), e("design:type", Number)],
      ce.prototype,
      "step",
      void 0,
    ),
    (ce = t([st("sdpi-range")], ce)));
  let he = class extends et {
    render() {
      return z`<div class="container grid"><div class="label"><label @click="${this.handleLabelClick}">${this.label ? this.label.toString() + ":" : void 0}</label></div><div class="content"><slot></slot></div></div>`;
    }
    handleLabelClick() {
      for (const t of this.querySelectorAll("*")) {
        const e = t;
        if (e.canFocus) return void e.focus();
      }
    }
  };
  ((he.styles = [
    Ht,
    a`::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);box-shadow:inset 0 0 6px rgba(0,0,0,.3)}::-webkit-scrollbar-thumb{background-color:#666;border-radius:5px;outline:1px solid #708090}.container{color:var(--font-color);font-family:var(--font-family);font-size:var(--font-size);margin:0 0 10px 0;-webkit-user-drag:none}.grid{align-items:start;display:grid;grid-template-columns:95px 241px}.label{align-items:center;display:flex;justify-self:end;min-height:28px;padding-right:11px;text-align:right}`,
  ]),
    t([rt(yt), e("design:type", bt)], he.prototype, "label", void 0),
    (he = t([st("sdpi-item")], he)));
  class ue {
    constructor(t) {
      this.Y = t;
    }
    disconnect() {
      this.Y = void 0;
    }
    reconnect(t) {
      this.Y = t;
    }
    deref() {
      return this.Y;
    }
  }
  class pe {
    constructor() {
      ((this.Z = void 0), (this.q = void 0));
    }
    get() {
      return this.Z;
    }
    pause() {
      var t;
      (null !== (t = this.Z) && void 0 !== t) ||
        (this.Z = new Promise((t) => (this.q = t)));
    }
    resume() {
      var t;
      (null === (t = this.q) || void 0 === t || t.call(this),
        (this.Z = this.q = void 0));
    }
  }
  const ve = (t) =>
    !((t) => null === t || ("object" != typeof t && "function" != typeof t))(
      t,
    ) && "function" == typeof t.then;
  const ge = Lt(
    class extends Nt {
      constructor() {
        (super(...arguments),
          (this._$Cwt = 1073741823),
          (this._$Cyt = []),
          (this._$CK = new ue(this)),
          (this._$CX = new pe()));
      }
      render(...t) {
        var e;
        return null !== (e = t.find((t) => !ve(t))) && void 0 !== e ? e : U;
      }
      update(t, e) {
        const i = this._$Cyt;
        let s = i.length;
        this._$Cyt = e;
        const n = this._$CK,
          r = this._$CX;
        this.isConnected || this.disconnected();
        for (let t = 0; t < e.length && !(t > this._$Cwt); t++) {
          const o = e[t];
          if (!ve(o)) return ((this._$Cwt = t), o);
          (t < s && o === i[t]) ||
            ((this._$Cwt = 1073741823),
            (s = 0),
            Promise.resolve(o).then(async (t) => {
              for (; r.get(); ) await r.get();
              const e = n.deref();
              if (void 0 !== e) {
                const i = e._$Cyt.indexOf(o);
                i > -1 && i < e._$Cwt && ((e._$Cwt = i), e.setValue(t));
              }
            }));
        }
        return U;
      }
      disconnected() {
        (this._$CK.disconnect(), this._$CX.pause());
      }
      reconnected() {
        (this._$CK.reconnect(this), this._$CX.resume());
      }
    },
  );
  let be = class extends qt(Ot(wt(Ut(Zt(et))))) {
    constructor() {
      (super(...arguments), (this.showRefresh = !1));
    }
    static get styles() {
      return [
        ...super.styles,
        a`select{background-color:var(--input-bg-color);padding:calc(var(--spacer) + 2px) 0;text-overflow:ellipsis;width:100%}select:focus{box-shadow:inset 0 0 1px var(--font-color)}select:disabled{opacity:var(--opacity-disabled)}.refresh{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTgiIHdpZHRoPSIxOCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOUM5QzlDIj48cGF0aCBkPSJNMTIgMjBxLTMuMzUgMC01LjY3NS0yLjMyNVE0IDE1LjM1IDQgMTJxMC0zLjM1IDIuMzI1LTUuNjc1UTguNjUgNCAxMiA0cTEuNzI1IDAgMy4zLjcxMyAxLjU3NS43MTIgMi43IDIuMDM3VjRoMnY3aC03VjloNC4ycS0uOC0xLjQtMi4xODctMi4yUTEzLjYyNSA2IDEyIDYgOS41IDYgNy43NSA3Ljc1VDYgMTJxMCAyLjUgMS43NSA0LjI1VDEyIDE4cTEuOTI1IDAgMy40NzUtMS4xVDE3LjY1IDE0aDIuMXEtLjcgMi42NS0yLjg1IDQuMzI1UTE0Ljc1IDIwIDEyIDIwWiIvPjwvc3ZnPg==) no-repeat -1px -1px;width:16px}sdpi-button:not([disabled]):hover .refresh{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTgiIHdpZHRoPSIxOCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjQ0VDRUNFIj48cGF0aCBkPSJNMTIgMjBxLTMuMzUgMC01LjY3NS0yLjMyNVE0IDE1LjM1IDQgMTJxMC0zLjM1IDIuMzI1LTUuNjc1UTguNjUgNCAxMiA0cTEuNzI1IDAgMy4zLjcxMyAxLjU3NS43MTIgMi43IDIuMDM3VjRoMnY3aC03VjloNC4ycS0uOC0xLjQtMi4xODctMi4yUTEzLjYyNSA2IDEyIDYgOS41IDYgNy43NSA3Ljc1VDYgMTJxMCAyLjUgMS43NSA0LjI1VDEyIDE4cTEuOTI1IDAgMy40NzUtMS4xVDE3LjY1IDE0aDIuMXEtLjcgMi42NS0yLjg1IDQuMzI1UTE0Ljc1IDIwIDEyIDIwWiIvPjwvc3ZnPg==)}`,
      ];
    }
    firstUpdated(t) {
      (super.firstUpdated(t),
        this.labelSetting &&
          ([this.getLabel, this.setLabel] = Vt(
            this.labelSetting,
            null,
            null,
            !1,
          )));
    }
    render() {
      var t, e;
      const i = this.disabled || this.items.status !== mt,
        s =
          this.getSelectedValueFrom(
            null !==
              (e =
                null === (t = this.items) || void 0 === t ? void 0 : t.value) &&
              void 0 !== e
              ? e
              : [],
          ) || this.defaultValue,
        n = z`<select ${Tt(this.focusElement)} .disabled="${i}" .value="${(null == s ? void 0 : s.toString()) || ""}" @change="${(
          t,
        ) => {
          (this.setLabel &&
            this.setLabel(t.target[t.target.selectedIndex].innerText),
            (this.value = this.parseValue(t.target.value)));
        }}">${this.items.render({
          pending: () =>
            z`<option value="" disabled="disabled" selected="selected">${this.loadingText}</option>`,
          complete: () =>
            z`${void 0 === s ? ge(this.getLabelOrPlaceholder()) : void 0} ${this.renderDataSource(
              (t) =>
                z`<option .disabled="${t.disabled || !1}" .value="${t.value}" .selected="${t.value === s}">${t.label}</option>`,
              (t, e) => {
                var i;
                return z`<optgroup .label="${(null === (i = t.label) || void 0 === i ? void 0 : i.toString()) || ""}">${e}</optgroup>`;
              },
            )}`,
        })}</select>`;
      return this.showRefresh && void 0 !== this.dataSource
        ? z`<div class="flex"><div class="flex-grow">${n}</div><div class="flex-shrink margin-left"><sdpi-button .disabled="${i}" @click="${() => this.refresh()}"><div class="refresh"> </div></sdpi-button></div></div>`
        : n;
    }
    async getLabelOrPlaceholder() {
      if (this.getLabel) {
        const t = await this.getLabel();
        if (void 0 !== t)
          return z`<option value="" disabled="disabled" selected="selected">${t}</option>`;
      }
      if (this.placeholder)
        return z`<option value="" disabled="disabled" hidden selected="selected">${this.placeholder}</option>`;
    }
    getSelectedValueFrom(t) {
      for (const e of t)
        if ("children" in e) {
          const t = this.getSelectedValueFrom(e.children);
          if (void 0 !== t) return t;
        } else if ("value" in e && e.value == this.value) return e.value;
    }
  };
  (t(
    [rt({ attribute: "label-setting" }), e("design:type", String)],
    be.prototype,
    "labelSetting",
    void 0,
  ),
    t(
      [
        rt({ attribute: "show-refresh", type: Boolean }),
        e("design:type", Object),
      ],
      be.prototype,
      "showRefresh",
      void 0,
    ),
    t([rt(yt), e("design:type", bt)], be.prototype, "placeholder", void 0),
    (be = t([st("sdpi-select")], be)));
  let ye = class extends qt(Ot(Zt(et))) {
    constructor() {
      (super(...arguments),
        (this.rows = 3),
        (this.showLength = !1),
        (this.delaySave = !0));
    }
    static get styles() {
      return [
        ...super.styles,
        Ht,
        a`textarea{background-color:var(--input-bg-color);padding:calc(var(--spacer) + 3px) var(--spacer);resize:none}textarea:disabled{opacity:var(--opacity-disabled)}.length{color:var(--font-color);display:block;text-align:right;font-family:var(--font-family);font-size:var(--font-size)}`,
      ];
    }
    render() {
      return z`<textarea ${Tt(this.focusElement)} type="textarea" maxlength="${Jt(this.maxLength)}" .disabled="${this.disabled}" .id="${this.inputId}" .rows="${this.rows}" .value="${this.value || ""}" @input="${(t) => (this.value = t.target.value)}"></textarea> ${this.getLengthLabel()}`;
    }
    getLengthLabel() {
      var t;
      if (this.showLength || this.maxLength) {
        const e = this.maxLength ? z`/${this.maxLength}` : void 0;
        return z`<label class="length" for="${this.inputId}">${(null === (t = this.value) || void 0 === t ? void 0 : t.length) || 0}${e}</label>`;
      }
    }
  };
  (t(
    [rt({ attribute: "maxlength", type: Number }), e("design:type", Number)],
    ye.prototype,
    "maxLength",
    void 0,
  ),
    t(
      [rt({ type: Number }), e("design:type", Object)],
      ye.prototype,
      "rows",
      void 0,
    ),
    t(
      [
        rt({ attribute: "showlength", type: Boolean }),
        e("design:type", Object),
      ],
      ye.prototype,
      "showLength",
      void 0,
    ),
    (ye = t([st("sdpi-textarea")], ye)));
  const fe = window.connectElgatoStreamDeckSocket;
  var me;
  ((window.connectElgatoStreamDeckSocket = (t, e, i, s, n) => {
    (fe && fe(t, e, i, s, n),
      xt.connect(t, e, i, JSON.parse(s), JSON.parse(n)));
  }),
    (function (t) {
      ((t.streamDeckClient = xt),
        (t.useGlobalSettings = Qt),
        (t.useSettings = Vt),
        (t.i18n = gt));
    })(me || (me = {})),
    (window.SDPIComponents = me));
  const $e = document.createElement("style");
  (($e.innerHTML =
    a`body,html{background-color:#2d2d2d}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);box-shadow:inset 0 0 6px rgba(0,0,0,.3)}::-webkit-scrollbar-thumb{background-color:#666;border-radius:5px;outline:1px solid #708090}`.cssText),
    document.head.appendChild($e));
})();
