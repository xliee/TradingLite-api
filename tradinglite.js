const crypto = require("crypto");

function W(e, t, r) {
  return r ? 4294967296 * t + (e >>> 0) : 4294967296 * (t >>> 0) + (e >>> 0);
}
function Y(e, t) {
    return (e[t] | e[t + 1] << 8 | e[t + 2] << 16) + 16777216 * e[t + 3]
}
function J(e, t) {
    return (e[t] | e[t + 1] << 8 | e[t + 2] << 16) + (e[t + 3] << 24)
}
function re(e) {
    return e.type === Z.Bytes ? e.readVarint() + e.pos : e.pos + 1
}
function Z(e) {
  (this.buf = ArrayBuffer.isView(e) ? e : new Uint8Array(e || 0)),
    (this.pos = 0),
    (this.type = 0),
    (this.length = this.buf.length);
}
const te = new TextDecoder("utf-8");
(Z.Varint = 0), (Z.Fixed64 = 1), (Z.Bytes = 2), (Z.Fixed32 = 5);
const K = {}
K.read = function(e, t, r, i, n) {
    let o, s;
    const a = 8 * n - i - 1
      , u = (1 << a) - 1
      , f = u >> 1;
    let c = -7
      , l = r ? n - 1 : 0;
    const h = r ? -1 : 1;
    let d = e[t + l];
    for (l += h,
    o = d & (1 << -c) - 1,
    d >>= -c,
    c += a; c > 0; o = 256 * o + e[t + l],
    l += h,
    c -= 8)
        ;
    for (s = o & (1 << -c) - 1,
    o >>= -c,
    c += i; c > 0; s = 256 * s + e[t + l],
    l += h,
    c -= 8)
        ;
    if (0 === o)
        o = 1 - f;
    else {
        if (o === u)
            return s ? NaN : 1 / 0 * (d ? -1 : 1);
        s += Math.pow(2, i),
        o -= f
    }
    return (d ? -1 : 1) * s * Math.pow(2, o - i)
}
,
K.write = function(e, t, r, i, n, o) {
    let s, a, u, f = 8 * o - n - 1;
    const c = (1 << f) - 1
      , l = c >> 1
      , h = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    let d = i ? 0 : o - 1;
    const p = i ? 1 : -1
      , g = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
    for (t = Math.abs(t),
    isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0,
    s = c) : (s = Math.floor(Math.log(t) / Math.LN2),
    t * (u = Math.pow(2, -s)) < 1 && (s--,
    u *= 2),
    (t += s + l >= 1 ? h / u : h * Math.pow(2, 1 - l)) * u >= 2 && (s++,
    u /= 2),
    s + l >= c ? (a = 0,
    s = c) : s + l >= 1 ? (a = (t * u - 1) * Math.pow(2, n),
    s += l) : (a = t * Math.pow(2, l - 1) * Math.pow(2, n),
    s = 0)); n >= 8; e[r + d] = 255 & a,
    d += p,
    a /= 256,
    n -= 8)
        ;
    for (s = s << n | a,
    f += n; f > 0; e[r + d] = 255 & s,
    d += p,
    s /= 256,
    f -= 8)
        ;
    e[r + d - p] |= 128 * g
}
Z.prototype = {
  // var fields = {
  //     time: 0,
  //     level: 0,
  //     exchange: "",
  //     symbol: "",
  //     priceGroup: 0,
  //     minPrice: 0,
  //     maxPrice: 0,
  //     lastPrice: 0,
  //     askPrices: [],
  //     askSizes: [],
  //     bidPrices: [],
  //     bidSizes: [],
  //     isHD: !1
  // }
  readFields: function(e, t, r) {
    for (r = r || this.length; this.pos < r; ) {
        const r = this.readVarint()
          , i = r >> 3
          , n = this.pos;
        this.type = 7 & r,
        e(i, t, this),
        this.pos === n && this.skip(r)
    }
    return t
},

  readMessage: function (e, t) {
    return this.readFields(e, t, this.readVarint() + this.pos);
  },
  readFixed32: function () {
    const e = Y(this.buf, this.pos);
    return (this.pos += 4), e;
  },
  readSFixed32: function () {
    const e = J(this.buf, this.pos);
    return (this.pos += 4), e;
  },
  readFixed64: function () {
    const e = Y(this.buf, this.pos) + Y(this.buf, this.pos + 4) * Q;
    return (this.pos += 8), e;
  },
  readSFixed64: function () {
    const e = Y(this.buf, this.pos) + J(this.buf, this.pos + 4) * Q;
    return (this.pos += 8), e;
  },
  readFloat: function () {
    const e = K.read(this.buf, this.pos, !0, 23, 4);
    return (this.pos += 4), e;
  },
  readDouble: function () {
    const e = K.read(this.buf, this.pos, !0, 52, 8);
    return (this.pos += 8), e;
  },
  readVarint: function (e) {
    const t = this.buf;
    let r, i;
    return (
      (i = t[this.pos++]),
      (r = 127 & i),
      i < 128
        ? r
        : ((i = t[this.pos++]),
          (r |= (127 & i) << 7),
          i < 128
            ? r
            : ((i = t[this.pos++]),
              (r |= (127 & i) << 14),
              i < 128
                ? r
                : ((i = t[this.pos++]),
                  (r |= (127 & i) << 21),
                  i < 128
                    ? r
                    : ((i = t[this.pos]),
                      (r |= (15 & i) << 28),
                      (function (e, t, r) {
                        const i = r.buf;
                        let n, o;
                        if (((o = i[r.pos++]), (n = (112 & o) >> 4), o < 128))
                          return W(e, n, t);
                        if (((o = i[r.pos++]), (n |= (127 & o) << 3), o < 128))
                          return W(e, n, t);
                        if (((o = i[r.pos++]), (n |= (127 & o) << 10), o < 128))
                          return W(e, n, t);
                        if (((o = i[r.pos++]), (n |= (127 & o) << 17), o < 128))
                          return W(e, n, t);
                        if (((o = i[r.pos++]), (n |= (127 & o) << 24), o < 128))
                          return W(e, n, t);
                        if (((o = i[r.pos++]), (n |= (1 & o) << 31), o < 128))
                          return W(e, n, t);
                        throw new Error(
                          "Expected varint not more than 10 bytes"
                        );
                      })(r, e, this)))))
    );
  },
  readVarint64: function () {
    return this.readVarint(!0);
  },
  readSVarint: function () {
    const e = this.readVarint();
    return e % 2 == 1 ? (e + 1) / -2 : e / 2;
  },
  readBoolean: function () {
    return Boolean(this.readVarint());
  },
  readString: function () {
    const e = this.readVarint() + this.pos,
      t = this.pos;
    return (
      (this.pos = e),
      e - t >= 12 && te
        ? te.decode(this.buf.subarray(t, e))
        : (function (e, t, r) {
            let i = "",
              n = t;
            for (; n < r; ) {
              let t,
                o,
                s,
                a = e[n],
                u = null,
                f = a > 239 ? 4 : a > 223 ? 3 : a > 191 ? 2 : 1;
              if (n + f > r) break;
              1 === f
                ? a < 128 && (u = a)
                : 2 === f
                ? ((t = e[n + 1]),
                  128 == (192 & t) &&
                    ((u = ((31 & a) << 6) | (63 & t)), u <= 127 && (u = null)))
                : 3 === f
                ? ((t = e[n + 1]),
                  (o = e[n + 2]),
                  128 == (192 & t) &&
                    128 == (192 & o) &&
                    ((u = ((15 & a) << 12) | ((63 & t) << 6) | (63 & o)),
                    (u <= 2047 || (u >= 55296 && u <= 57343)) && (u = null)))
                : 4 === f &&
                  ((t = e[n + 1]),
                  (o = e[n + 2]),
                  (s = e[n + 3]),
                  128 == (192 & t) &&
                    128 == (192 & o) &&
                    128 == (192 & s) &&
                    ((u =
                      ((15 & a) << 18) |
                      ((63 & t) << 12) |
                      ((63 & o) << 6) |
                      (63 & s)),
                    (u <= 65535 || u >= 1114112) && (u = null))),
                null === u
                  ? ((u = 65533), (f = 1))
                  : u > 65535 &&
                    ((u -= 65536),
                    (i += String.fromCharCode(((u >>> 10) & 1023) | 55296)),
                    (u = 56320 | (1023 & u))),
                (i += String.fromCharCode(u)),
                (n += f);
            }
            return i;
          })(this.buf, t, e)
    );
  },
  readBytes: function () {
    const e = this.readVarint() + this.pos,
      t = this.buf.subarray(this.pos, e);
    return (this.pos = e), t;
  },
  readPackedVarint: function (e = [], t) {
    if (this.type !== Z.Bytes) return e.push(this.readVarint(t));
    const r = re(this);
    for (; this.pos < r; ) e.push(this.readVarint(t));
    return e;
  },
  readPackedSVarint: function (e = []) {
    if (this.type !== Z.Bytes) return e.push(this.readSVarint());
    const t = re(this);
    for (; this.pos < t; ) e.push(this.readSVarint());
    return e;
  },
  readPackedBoolean: function (e = []) {
    if (this.type !== Z.Bytes) return e.push(this.readBoolean());
    const t = re(this);
    for (; this.pos < t; ) e.push(this.readBoolean());
    return e;
  },
  readPackedFloat: function (e = []) {
    if (this.type !== Z.Bytes) return e.push(this.readFloat());
    const t = re(this);
    for (; this.pos < t; ) e.push(this.readFloat());
    return e;
  },
  readPackedDouble: function (e = []) {
    if (this.type !== Z.Bytes) return e.push(this.readDouble());
    const t = re(this);
    for (; this.pos < t; ) e.push(this.readDouble());
    return e;
  },
  readPackedFixed32: function (e = []) {
    if (this.type !== Z.Bytes) return e.push(this.readFixed32());
    const t = re(this);
    for (; this.pos < t; ) e.push(this.readFixed32());
    return e;
  },
  readPackedSFixed32: function (e = []) {
    if (this.type !== Z.Bytes) return e.push(this.readSFixed32());
    const t = re(this);
    for (; this.pos < t; ) e.push(this.readSFixed32());
    return e;
  },
  readPackedFixed64: function (e = []) {
    if (this.type !== Z.Bytes) return e.push(this.readFixed64());
    const t = re(this);
    for (; this.pos < t; ) e.push(this.readFixed64());
    return e;
  },
  readPackedSFixed64: function (e = []) {
    if (this.type !== Z.Bytes) return e.push(this.readSFixed64());
    const t = re(this);
    for (; this.pos < t; ) e.push(this.readSFixed64());
    return e;
  },
  skip: function (e) {
    const t = 7 & e;
    if (t === Z.Varint) for (; this.buf[this.pos++] > 127; );
    else if (t === Z.Bytes) this.pos = this.readVarint() + this.pos;
    else if (t === Z.Fixed32) this.pos += 4;
    else {
      if (t !== Z.Fixed64) throw new Error("Unimplemented type: " + t);
      this.pos += 8;
    }
  },
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// de
const RangeCandles_Candles_parse = {
  read: function (e, t) {
    const r = new Z(e);
    return RangeCandles_Candles_parse._read(r, t);
  },
  _read: function (e, t) {
    return e.readFields(
      RangeCandles_Candles_parse._readField,
      {
        exchange: "",
        symbol: "",
        timeframe: 0,
        time: [],
        open: [],
        close: [],
        low: [],
        high: [],
        vbuy: [],
        vsell: [],
        type: 0,
        meta_id: 0,
        status: 0,
      },
      t
    );
  },
  _readField: function (e, t, r) {
    1 === e
      ? (t.exchange = r.readString())
      : 2 === e
      ? (t.symbol = r.readString())
      : 3 === e
      ? (t.timeframe = r.readVarint(!0))
      : 4 === e
      ? r.readPackedVarint(t.time, !0)
      : 5 === e
      ? r.readPackedDouble(t.open)
      : 6 === e
      ? r.readPackedDouble(t.close)
      : 7 === e
      ? r.readPackedDouble(t.low)
      : 8 === e
      ? r.readPackedDouble(t.high)
      : 9 === e
      ? r.readPackedDouble(t.vbuy)
      : 10 === e
      ? r.readPackedDouble(t.vsell)
      : 14 === e
      ? (t.type = r.readVarint(!0))
      : 15 === e
      ? (t.meta_id = r.readVarint(!0))
      : 16 === e && (t.status = r.readVarint(!0));
  },
  write: function (e, t) {
    e.exchange && t.writeStringField(1, e.exchange),
      e.symbol && t.writeStringField(2, e.symbol),
      e.timeframe && t.writeVarintField(3, e.timeframe),
      e.time && t.writePackedVarint(4, e.time),
      e.open && t.writePackedDouble(5, e.open),
      e.close && t.writePackedDouble(6, e.close),
      e.low && t.writePackedDouble(7, e.low),
      e.high && t.writePackedDouble(8, e.high),
      e.vbuy && t.writePackedDouble(9, e.vbuy),
      e.vsell && t.writePackedDouble(10, e.vsell),
      e.type && t.writeVarintField(14, e.type),
      e.meta_id && t.writeVarintField(15, e.meta_id),
      e.status && t.writeVarintField(16, e.status);
  },
};

// pe
const RangeStats_Stats_parse = {
  read: function (e, t) {
    const r = new Z(e);
    return RangeStats_Stats_parse._read(r, t);
  },
  _read: function (e, t) {
    return e.readFields(
      RangeStats_Stats_parse._readField,
      {
        exchange: "",
        symbol: "",
        timeframe: 0,
        time: [],
        open: [],
        close: [],
        low: [],
        high: [],
        fundCurr: [],
        fundPred: [],
        markPrice: [],
        liqAsk: [],
        liqBid: [],
        countOrders: [],
        countTrades: [],
        meta_id: 0,
        longs: [],
        shorts: [],
        status: 0,
      },
      t
    );
  },
  _readField: function (e, t, r) {
    1 === e
      ? (t.exchange = r.readString())
      : 2 === e
      ? (t.symbol = r.readString())
      : 3 === e
      ? (t.timeframe = r.readVarint(!0))
      : 4 === e
      ? r.readPackedVarint(t.time, !0)
      : 5 === e
      ? r.readPackedDouble(t.open)
      : 6 === e
      ? r.readPackedDouble(t.close)
      : 7 === e
      ? r.readPackedDouble(t.low)
      : 8 === e
      ? r.readPackedDouble(t.high)
      : 9 === e
      ? r.readPackedDouble(t.fundCurr)
      : 10 === e
      ? r.readPackedDouble(t.fundPred)
      : 11 === e
      ? r.readPackedDouble(t.markPrice)
      : 12 === e
      ? r.readPackedDouble(t.liqAsk)
      : 13 === e
      ? r.readPackedDouble(t.liqBid)
      : 14 === e
      ? r.readPackedDouble(t.countOrders)
      : 15 === e
      ? r.readPackedDouble(t.countTrades)
      : 16 === e
      ? (t.meta_id = r.readVarint(!0))
      : 17 === e
      ? r.readPackedDouble(t.longs)
      : 18 === e
      ? r.readPackedDouble(t.shorts)
      : 30 === e && (t.status = r.readVarint(!0));
  },
  write: function (e, t) {
    e.exchange && t.writeStringField(1, e.exchange),
      e.symbol && t.writeStringField(2, e.symbol),
      e.timeframe && t.writeVarintField(3, e.timeframe),
      e.time && t.writePackedVarint(4, e.time),
      e.open && t.writePackedDouble(5, e.open),
      e.close && t.writePackedDouble(6, e.close),
      e.low && t.writePackedDouble(7, e.low),
      e.high && t.writePackedDouble(8, e.high),
      e.fundCurr && t.writePackedDouble(9, e.fundCurr),
      e.fundPred && t.writePackedDouble(10, e.fundPred),
      e.markPrice && t.writePackedDouble(11, e.markPrice),
      e.liqAsk && t.writePackedDouble(12, e.liqAsk),
      e.liqBid && t.writePackedDouble(13, e.liqBid),
      e.countOrders && t.writePackedDouble(14, e.countOrders),
      e.countTrades && t.writePackedDouble(15, e.countTrades),
      e.meta_id && t.writeVarintField(16, e.meta_id),
      e.longs && t.writePackedDouble(17, e.longs),
      e.shorts && t.writePackedDouble(18, e.shorts),
      e.status && t.writeVarintField(30, e.status);
  },
};

// ge
const Orderbook_parse = {
  read: function (e, t) {
    const r = new Z(e);
    return Orderbook_parse._read(r, t);
  },
  _read: function (e, t) {
    return e.readFields(
      Orderbook_parse._readField,
      {
        exchange: "",
        symbol: "",
        sequence: 0,
        time: 0,
        type: !1,
        askPrices: [],
        askSizes: [],
        bidPrices: [],
        bidSizes: [],
        lastPrice: 0,
        meta_id: 0,
      },
      t
    );
  },
  _readField: function (e, t, r) {
    1 === e
      ? (t.exchange = r.readString())
      : 2 === e
      ? (t.symbol = r.readString())
      : 3 === e
      ? (t.sequence = r.readVarint())
      : 4 === e
      ? (t.time = r.readVarint(!0))
      : 5 === e
      ? (t.type = r.readBoolean())
      : 6 === e
      ? r.readPackedDouble(t.askPrices)
      : 7 === e
      ? r.readPackedDouble(t.askSizes)
      : 8 === e
      ? r.readPackedDouble(t.bidPrices)
      : 9 === e
      ? r.readPackedDouble(t.bidSizes)
      : 10 === e
      ? (t.lastPrice = r.readDouble())
      : 15 === e && (t.meta_id = r.readVarint(!0));
  },
  write: function (e, t) {
    e.exchange && t.writeStringField(1, e.exchange),
      e.symbol && t.writeStringField(2, e.symbol),
      e.sequence && t.writeVarintField(3, e.sequence),
      e.time && t.writeVarintField(4, e.time),
      e.type && t.writeBooleanField(5, e.type),
      e.askPrices && t.writePackedDouble(6, e.askPrices),
      e.askSizes && t.writePackedDouble(7, e.askSizes),
      e.bidPrices && t.writePackedDouble(8, e.bidPrices),
      e.bidSizes && t.writePackedDouble(9, e.bidSizes),
      e.lastPrice && t.writeDoubleField(10, e.lastPrice),
      e.meta_id && t.writeVarintField(15, e.meta_id);
  },
};

// we
const trades_parse = {
  read: function (e, t) {
    const r = new Z(e);
    return trades_parse._read(r, t);
  },
  _read: function (e, t) {
    return e.readFields(
      trades_parse._readField,
      {
        exchange: "",
        symbol: "",
        entries: [],
      },
      t
    );
  },
  _readField: function (e, t, r) {
    1 === e
      ? (t.exchange = r.readString())
      : 2 === e
      ? (t.symbol = r.readString())
      : 3 === e && t.entries.push(ye._read(r, r.readVarint() + r.pos));
  },
  write: function (e, t) {
    if (
      (e.exchange && t.writeStringField(1, e.exchange),
      e.symbol && t.writeStringField(2, e.symbol),
      e.entries)
    )
      for (let r = 0; r < e.entries.length; r++)
        t.writeMessage(3, ye.write, e.entries[r]);
  },
};

const ye = {
  read: function (e, t) {
    const r = new Z(e);
    return ye._read(r, t);
  },
  _read: function (e, t) {
    return e.readFields(
      ye._readField,
      {
        exchange: "",
        symbol: "",
        time: 0,
        price: 0,
        size: 0,
        side: !1,
        id: 0,
      },
      t
    );
  },
  _readField: function (e, t, r) {
    1 === e
      ? (t.exchange = r.readString())
      : 2 === e
      ? (t.symbol = r.readString())
      : 3 === e
      ? (t.time = r.readVarint(!0))
      : 4 === e
      ? (t.price = r.readDouble())
      : 5 === e
      ? (t.size = r.readDouble())
      : 6 === e
      ? (t.side = r.readBoolean())
      : 14 === e && (t.id = r.readVarint(!0));
  },
  write: function (e, t) {
    e.exchange && t.writeStringField(1, e.exchange),
      e.symbol && t.writeStringField(2, e.symbol),
      e.time && t.writeVarintField(3, e.time),
      e.price && t.writeDoubleField(4, e.price),
      e.size && t.writeDoubleField(5, e.size),
      e.side && t.writeBooleanField(6, e.side),
      e.id && t.writeVarintField(14, e.id);
  },
};

// be
const RangeVol_vol_parse = {
  read: function (e, t) {
    const r = new Z(e);
    return RangeVol_vol_parse._read(r, t);
  },
  _read: function (e, t) {
    return e.readFields(
      RangeVol_vol_parse._readField,
      {
        exchange: "",
        symbol: "",
        timeframe: 0,
        entries: [],
        meta_id: 0,
        status: 0,
      },
      t
    );
  },
  _readField: function (e, t, r) {
    1 === e
      ? (t.exchange = r.readString())
      : 2 === e
      ? (t.symbol = r.readString())
      : 3 === e
      ? (t.timeframe = r.readVarint(!0))
      : 4 === e
      ? t.entries.push(me._read(r, r.readVarint() + r.pos))
      : 15 === e
      ? (t.meta_id = r.readVarint(!0))
      : 16 === e && (t.status = r.readVarint(!0));
  },
  write: function (e, t) {
    if (
      (e.exchange && t.writeStringField(1, e.exchange),
      e.symbol && t.writeStringField(2, e.symbol),
      e.timeframe && t.writeVarintField(3, e.timeframe),
      e.entries)
    )
      for (let r = 0; r < e.entries.length; r++)
        t.writeMessage(4, me.write, e.entries[r]);
    e.meta_id && t.writeVarintField(15, e.meta_id),
      e.status && t.writeVarintField(16, e.status);
  },
};

const me = {
  read: function (e, t) {
    const r = new Z(e);
    return me._read(r, t);
  },
  _read: function (e, t) {
    return e.readFields(
      me._readField,
      {
        time: 0,
        prices: [],
        buys: [],
        sells: [],
        priceGroup: 0,
        isDirty: !1,
        version: 0,
        timeframe: 0,
      },
      t
    );
  },
  _readField: function (e, t, r) {
    1 === e
      ? (t.time = r.readVarint(!0))
      : 2 === e
      ? r.readPackedDouble(t.prices)
      : 3 === e
      ? r.readPackedDouble(t.buys)
      : 4 === e
      ? r.readPackedDouble(t.sells)
      : 5 === e
      ? (t.priceGroup = r.readDouble())
      : 13 === e
      ? (t.isDirty = r.readBoolean())
      : 14 === e
      ? (t.version = r.readVarint(!0))
      : 15 === e && (t.timeframe = r.readVarint(!0));
  },
  write: function (e, t) {
    e.time && t.writeVarintField(1, e.time),
      e.prices && t.writePackedDouble(2, e.prices),
      e.buys && t.writePackedDouble(3, e.buys),
      e.sells && t.writePackedDouble(4, e.sells),
      e.priceGroup && t.writeDoubleField(5, e.priceGroup),
      e.isDirty && t.writeBooleanField(13, e.isDirty),
      e.version && t.writeVarintField(14, e.version),
      e.timeframe && t.writeVarintField(15, e.timeframe);
  },
};

// Pe
const RangeHeatmap_parse = {
  read: function (e, t) {
    const r = new Z(e);
    return RangeHeatmap_parse._read(r, t);
  },
  _read: function (e, t) {
    return e.readFields(
      RangeHeatmap_parse._readField,
      {
        exchange: "",
        symbol: "",
        timeframe: 0,
        level: 0,
        entries: [],
        isHD: !1,
        meta_id: 0,
        status: 0,
      },
      t
    );
  },
  _readField: function (e, t, r) {
    1 === e
      ? (t.exchange = r.readString())
      : 2 === e
      ? (t.symbol = r.readString())
      : 3 === e
      ? (t.timeframe = r.readVarint(!0))
      : 4 === e
      ? (t.level = r.readVarint(!0))
      : 10 === e
      ? t.entries.push(ve._read(r, r.readVarint() + r.pos))
      : 14 === e
      ? (t.isHD = r.readBoolean())
      : 15 === e
      ? (t.meta_id = r.readVarint(!0))
      : 16 === e && (t.status = r.readVarint(!0));
  },
  write: function (e, t) {
    if (
      (e.exchange && t.writeStringField(1, e.exchange),
      e.symbol && t.writeStringField(2, e.symbol),
      e.timeframe && t.writeVarintField(3, e.timeframe),
      e.level && t.writeVarintField(4, e.level),
      e.entries)
    )
      for (let r = 0; r < e.entries.length; r++)
        t.writeMessage(10, ve.write, e.entries[r]);
    e.isHD && t.writeBooleanField(14, e.isHD),
      e.meta_id && t.writeVarintField(15, e.meta_id),
      e.status && t.writeVarintField(16, e.status);
  },
};

const ve = {
  read: function (e, t) {
    const r = new Z(e);
    return ve._read(r, t);
  },
  _read: function (e, t) {
    return e.readFields(
      ve._readField,
      {
        time: 0,
        _: 0,
        priceGroup: 0,
        minPrice: 0,
        maxPrice: 0,
        lastPrice: 0,
        askPrices: [],
        askSizes: [],
        bidPrices: [],
        bidSizes: [],
      },
      t
    );
  },
  _readField: function (e, t, r) {
    1 === e
      ? (t.time = r.readVarint(!0))
      : 2 === e
      ? (t._ = r.readVarint(!0))
      : 3 === e
      ? (t.priceGroup = r.readDouble())
      : 4 === e
      ? (t.minPrice = r.readDouble())
      : 5 === e
      ? (t.maxPrice = r.readDouble())
      : 6 === e
      ? (t.lastPrice = r.readDouble())
      : 10 === e
      ? r.readPackedDouble(t.askPrices)
      : 11 === e
      ? r.readPackedDouble(t.askSizes)
      : 12 === e
      ? r.readPackedDouble(t.bidPrices)
      : 13 === e && r.readPackedDouble(t.bidSizes);
  },
  write: function (e, t) {
    e.time && t.writeVarintField(1, e.time),
      e._ && t.writeVarintField(2, e._),
      e.priceGroup && t.writeDoubleField(3, e.priceGroup),
      e.minPrice && t.writeDoubleField(4, e.minPrice),
      e.maxPrice && t.writeDoubleField(5, e.maxPrice),
      e.lastPrice && t.writeDoubleField(6, e.lastPrice),
      e.askPrices && t.writePackedDouble(10, e.askPrices),
      e.askSizes && t.writePackedDouble(11, e.askSizes),
      e.bidPrices && t.writePackedDouble(12, e.bidPrices),
      e.bidSizes && t.writePackedDouble(13, e.bidSizes);
  },
};

// _e
const heatmap_parse = {
  read: function (e, t) {
    const r = new Z(e);
    return heatmap_parse._read(r, t);
  },
  _read: function (e, t) {
    return e.readFields(
      heatmap_parse._readField,
      {
        time: 0,
        level: 0,
        exchange: "",
        symbol: "",
        priceGroup: 0,
        minPrice: 0,
        maxPrice: 0,
        lastPrice: 0,
        askPrices: [],
        askSizes: [],
        bidPrices: [],
        bidSizes: [],
        isHD: !1,
      },
      t
    );
  },
  _readField: function (e, t, r) {
    1 === e
      ? (t.time = r.readVarint(!0))
      : 2 === e
      ? (t.level = r.readVarint(!0))
      : 3 === e
      ? (t.exchange = r.readString())
      : 4 === e
      ? (t.symbol = r.readString())
      : 5 === e
      ? (t.priceGroup = r.readDouble())
      : 6 === e
      ? (t.minPrice = r.readDouble())
      : 7 === e
      ? (t.maxPrice = r.readDouble())
      : 8 === e
      ? (t.lastPrice = r.readDouble())
      : 10 === e
      ? r.readPackedDouble(t.askPrices)
      : 11 === e
      ? r.readPackedDouble(t.askSizes)
      : 12 === e
      ? r.readPackedDouble(t.bidPrices)
      : 13 === e
      ? r.readPackedDouble(t.bidSizes)
      : 14 === e && (t.isHD = r.readBoolean());
  },
  write: function (e, t) {
    e.time && t.writeVarintField(1, e.time),
      e.level && t.writeVarintField(2, e.level),
      e.exchange && t.writeStringField(3, e.exchange),
      e.symbol && t.writeStringField(4, e.symbol),
      e.priceGroup && t.writeDoubleField(5, e.priceGroup),
      e.minPrice && t.writeDoubleField(6, e.minPrice),
      e.maxPrice && t.writeDoubleField(7, e.maxPrice),
      e.lastPrice && t.writeDoubleField(8, e.lastPrice),
      e.askPrices && t.writePackedDouble(10, e.askPrices),
      e.askSizes && t.writePackedDouble(11, e.askSizes),
      e.bidPrices && t.writePackedDouble(12, e.bidPrices),
      e.bidSizes && t.writePackedDouble(13, e.bidSizes),
      e.isHD && t.writeBooleanField(14, e.isHD);
  },
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function j(e) {
    for (let t = 1; t < e.length; t++)
        e[t] = e[t - 1] + e[t];
    return e
}
const H = new Float64Array(0);
function q(e) {
    if (!e)
        return H;
    const t = j(j(e.askPrices))
      , r = e.askSizes
      , i = j(j(e.bidPrices))
      , n = e.bidSizes
      , o = e.minPrice
      , s = e.maxPrice
      , a = e.priceGroup;
    if (Number.isNaN(s) || !s || !o)
        return H[0] = a,
        H;
    if (Math.ceil((s - o) / a) > 1e5)
        return H[0] = a,
        H;
    const u = t.length
      , f = Object.keys(t).sort(((e,r)=>z(t[e], t[r])))
      , c = i.length
      , l = Object.keys(i).sort(((e,t)=>z(i[e], i[t])))
      , h = new Float64Array(5 + 2 * (u + c));
    let d = 5;
    for (let e = 0; e < u; e++) {
        const i = f[e];
        h[d++] = t[i],
        h[d++] = -r[i]
    }
    for (let e = 0; e < c; e++) {
        const t = l[e];
        h[d++] = i[t],
        h[d++] = n[t]
    }
    return h[0] = a,
    h[1] = t.length,
    h[2] = i.length,
    h[3] = o,
    h[4] = s,
    h
}
S = function (e) {
  for (var t = 0; 1 << t <= e; ++t);
  return t - 1;
};
A = function (e, t, r) {
  var i = 4 + (t << 3),
    n = 5 + (15 & e[t]);
  n > r && F(3);
  for (
    var o = 1 << n,
      s = o,
      a = -1,
      u = -1,
      f = -1,
      c = o,
      l = new ArrayBuffer(512 + (o << 2)),
      h = new Int16Array(l, 0, 256),
      d = new Uint16Array(l, 0, 256),
      b = new Uint16Array(l, 512, o),
      m = 512 + (o << 1),
      P = new Uint8Array(l, m, o),
      v = new Uint8Array(l, m + o);
    a < 255 && s > 0;

  ) {
    var _ = S(s + 1),
      E = i >> 3,
      B = (1 << (_ + 1)) - 1,
      A = ((e[E] | (e[E + 1] << 8) | (e[E + 2] << 16)) >> (7 & i)) & B,
      k = (1 << _) - 1,
      D = B - s - 1,
      x = A & k;
    if (
      (x < D ? ((i += _), (A = x)) : ((i += _ + 1), A > k && (A -= D)),
      (h[++a] = --A),
      -1 == A ? ((s += A), (P[--c] = a)) : (s -= A),
      !A)
    )
      do {
        var V = i >> 3;
        (u = ((e[V] | (e[V + 1] << 8)) >> (7 & i)) & 3), (i += 2), (a += u);
      } while (3 == u);
  }
  (a > 255 || s) && F(0);
  for (var T = 0, R = (o >> 1) + (o >> 3) + 3, U = o - 1, I = 0; I <= a; ++I) {
    var M = h[I];
    if (M < 1) d[I] = -M;
    else
      for (f = 0; f < M; ++f) {
        P[T] = I;
        do {
          T = (T + R) & U;
        } while (T >= c);
      }
  }
  for (T && F(0), f = 0; f < o; ++f) {
    var O = d[P[f]]++,
      N = (v[f] = n - S(O));
    b[f] = (O << N) - o;
  }
  return [
    (i + 7) >> 3,
    {
      b: n,
      s: P,
      n: v,
      t: b,
    },
  ];
};
P = function(e, t, r, i) {
    if (Uint8Array.prototype.fill)
        return Uint8Array.prototype.fill.call(e, t, r, i);
    for ((null == r || r < 0) && (r = 0),
    (null == i || i > e.length) && (i = e.length); r < i; ++r)
        e[r] = t;
    return e
}
v = function (e, t, r, i) {
  if (Uint8Array.prototype.copyWithin)
    return Uint8Array.prototype.copyWithin.call(e, t, r, i);
  for (
    (null == r || r < 0) && (r = 0),
      (null == i || i > e.length) && (i = e.length);
    r < i;

  )
    e[t++] = e[r++];
};
E = function (e, t, r) {
  for (var i = 0, n = 0; i < r; ++i) n |= e[t++] << (i << 3);
  return n;
};
O = function(e, t, r) {
    var i = 6
      , n = t.length + 3 >> 2
      , o = n << 1
      , s = n + o;
    M(e.subarray(i, i += e[0] | e[1] << 8), t.subarray(0, n), r),
    M(e.subarray(i, i += e[2] | e[3] << 8), t.subarray(n, o), r),
    M(e.subarray(i, i += e[4] | e[5] << 8), t.subarray(o, s), r),
    M(e.subarray(i), t.subarray(s), r)
}
M = function(e, t, r) {
    var i = e.length
      , n = t.length
      , o = e[i - 1]
      , s = (1 << r.b) - 1
      , a = -r.b;
    o || F(0);
    for (var u = 0, f = r.b, c = (i << 3) - 8 + S(o) - f, l = -1; c > a && l < n; ) {
        var h = c >> 3;
        u = (u << f | (e[h] | e[h + 1] << 8 | e[h + 2] << 16) >> (7 & c)) & s,
        t[++l] = r.s[u],
        c -= f = r.n[u]
    }
    c == a && l + 1 == n || F(0)
}
B = function (e, t) {
  var r,
    i,
    n = e[0] | (e[1] << 8) | (e[2] << 16);
  if (3126568 == n && 253 == e[3]) {
    var o = e[4],
      s = (o >> 5) & 1,
      a = (o >> 2) & 1,
      u = 3 & o,
      f = o >> 6;
    8 & o && F(0);
    var c = 6 - s,
      l = 3 == u ? 4 : u,
      h = E(e, c, l),
      d = f ? 1 << f : s,
      p = E(e, (c += l), d) + (1 == f && 256),
      w = p;
    if (!s) {
      var y = 1 << (10 + (e[5] >> 3));
      w = y + (y >> 3) * (7 & e[5]);
    }
    w > 2145386496 && F(1);
    var m = new Uint8Array((1 == t ? p || w : t ? 0 : w) + 12);
    return (
      (m[0] = 1),
      (m[4] = 4),
      (m[8] = 8),
      {
        b: c + d,
        y: 0,
        l: 0,
        d: h,
        w: t && 1 != t ? t : m.subarray(12),
        e: w,
        o: new Int32Array(m.buffer, 0, 3),
        u: p,
        c: a,
        m: Math.min(131072, w),
      }
    );
  }
  if (25481893 == ((n >> 4) | (e[3] << 20)))
    return (
      8 +
      (((r = e)[(i = 4)] |
        (r[i + 1] << 8) |
        (r[i + 2] << 16) |
        (r[i + 3] << 24)) >>>
        0)
    );
  F(0);
};
F = function (e, t, r) {
  var i = new Error(t || _[e]);
  if (
    ((i.code = e), Error.captureStackTrace && Error.captureStackTrace(i, F), !r)
  )
    throw i;
  return i;
};
m = function(e, t, r) {
    if (Uint8Array.prototype.slice)
        return Uint8Array.prototype.slice.call(e, t, r);
    (null == t || t < 0) && (t = 0),
    (null == r || r > e.length) && (r = e.length);
    var i = new Uint8Array(r - t);
    return i.set(e.subarray(t, r)),
    i
}
k = A(new Uint8Array([81, 16, 99, 140, 49, 198, 24, 99, 12, 33, 196, 24, 99, 102, 102, 134, 70, 146, 4]), 0, 6)[1]
D = A(new Uint8Array([33, 20, 196, 24, 99, 140, 33, 132, 16, 66, 8, 33, 132, 16, 66, 8, 33, 68, 68, 68, 68, 68, 68, 68, 68, 36, 9]), 0, 6)[1]
x = A(new Uint8Array([32, 132, 16, 66, 102, 70, 68, 68, 68, 68, 36, 73, 2]), 0, 5)[1]
V = function(e, t) {
    for (var r = e.length, i = new Int32Array(r), n = 0; n < r; ++n)
        i[n] = t,
        t += 1 << e[n];
    return i
}
U = new Uint8Array(new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 16843009, 50528770, 117769220, 185207048, 252579084, 16]).buffer,0,53)
T = new Uint8Array(new Int32Array([0, 0, 0, 0, 16843009, 50528770, 134678020, 202050057, 269422093]).buffer,0,36)
I = V(U, 3)
R = V(T, 0)

N = function (e, t, r) {
  var i,
    n = t.b,
    o = e[n],
    s = (o >> 1) & 3;
  t.l = 1 & o;
  var a = (o >> 3) | (e[n + 1] << 5) | (e[n + 2] << 13),
    u = (n += 3) + a;
  if (1 == s) {
    if (n >= e.length) return;
    return (
      (t.b = n + 1),
      r ? (P(r, e[n], t.y, (t.y += a)), r) : P(new Uint8Array(a), e[n])
    );
  }
  if (!(u > e.length)) {
    if (0 == s)
      return (
        (t.b = u),
        r ? (r.set(e.subarray(n, u), t.y), (t.y += a), r) : m(e, n, u)
      );
    if (2 == s) {
      var f = e[n],
        c = 3 & f,
        l = (f >> 2) & 3,
        h = f >> 4,
        d = 0,
        p = 0;
      c < 2
        ? 1 & l
          ? (h |= (e[++n] << 4) | (2 & l && e[++n] << 12))
          : (h = f >> 3)
        : ((p = l),
          l < 2
            ? ((h |= (63 & e[++n]) << 4), (d = (e[n] >> 6) | (e[++n] << 2)))
            : 2 == l
            ? ((h |= (e[++n] << 4) | ((3 & e[++n]) << 12)),
              (d = (e[n] >> 2) | (e[++n] << 6)))
            : ((h |= (e[++n] << 4) | ((63 & e[++n]) << 12)),
              (d = (e[n] >> 6) | (e[++n] << 2) | (e[++n] << 10)))),
        ++n;
      var y = r ? r.subarray(t.y, t.y + t.m) : new Uint8Array(t.m),
        b = y.length - h;
      if (0 == c) y.set(e.subarray(n, (n += h)), b);
      else if (1 == c) P(y, e[n++], b);
      else {
        var v = t.h;
        if (2 == c) {
          var _ = (function (e, t) {
            var r = 0,
              i = -1,
              n = new Uint8Array(292),
              o = e[t],
              s = n.subarray(0, 256),
              a = n.subarray(256, 268),
              u = new Uint16Array(n.buffer, 268);
            if (o < 128) {
              var f = A(e, t + 1, 6),
                c = f[0],
                l = f[1],
                h = c << 3,
                d = e[(t += o)];
              d || F(0);
              for (
                var p = 0, y = 0, b = l.b, m = b, v = (++t << 3) - 8 + S(d);
                !((v -= b) < h);

              ) {
                var _ = v >> 3;
                if (
                  ((p +=
                    ((e[_] | (e[_ + 1] << 8)) >> (7 & v)) & ((1 << b) - 1)),
                  (s[++i] = l.s[p]),
                  (v -= m) < h)
                )
                  break;
                (y +=
                  ((e[(_ = v >> 3)] | (e[_ + 1] << 8)) >> (7 & v)) &
                  ((1 << m) - 1)),
                  (s[++i] = l.s[y]),
                  (b = l.n[p]),
                  (p = l.t[p]),
                  (m = l.n[y]),
                  (y = l.t[y]);
              }
              ++i > 255 && F(0);
            } else {
              for (i = o - 127; r < i; r += 2) {
                var E = e[++t];
                (s[r] = E >> 4), (s[r + 1] = 15 & E);
              }
              ++t;
            }
            var B = 0;
            for (r = 0; r < i; ++r)
              (V = s[r]) > 11 && F(0), (B += V && 1 << (V - 1));
            var k = S(B) + 1,
              D = 1 << k,
              x = D - B;
            for (x & (x - 1) && F(0), s[i++] = S(x) + 1, r = 0; r < i; ++r) {
              var V = s[r];
              ++a[(s[r] = V && k + 1 - V)];
            }
            var T = new Uint8Array(D << 1),
              R = T.subarray(0, D),
              U = T.subarray(D);
            for (u[k] = 0, r = k; r > 0; --r) {
              var I = u[r];
              P(U, r, I, (u[r - 1] = I + a[r] * (1 << (k - r))));
            }
            for (u[0] != D && F(0), r = 0; r < i; ++r) {
              var M = s[r];
              if (M) {
                var O = u[M];
                P(R, r, O, (u[M] = O + (1 << (k - M))));
              }
            }
            return [
              t,
              {
                n: U,
                b: k,
                s: R,
              },
            ];
          })(e, n);
          (d += n - (n = _[0])), (t.h = v = _[1]);
        } else v || F(0);
        (p ? O : M)(e.subarray(n, (n += d)), y.subarray(b), v);
      }
      var E = e[n++];
      if (E) {
        255 == E
          ? (E = 32512 + (e[n++] | (e[n++] << 8)))
          : E > 127 && (E = ((E - 128) << 8) | e[n++]);
        var B = e[n++];
        3 & B && F(0);
        for (var V = [D, x, k], N = 2; N > -1; --N) {
          var $ = (B >> (2 + (N << 1))) & 3;
          if (1 == $) {
            var L = new Uint8Array([0, 0, e[n++]]);
            V[N] = {
              s: L.subarray(2, 3),
              n: L.subarray(0, 1),
              t: new Uint16Array(L.buffer, 0, 1),
              b: 0,
            };
          } else
            2 == $
              ? ((n = (i = A(e, n, 9 - (1 & N)))[0]), (V[N] = i[1]))
              : 3 == $ && (t.t || F(0), (V[N] = t.t[N]));
        }
        var C = (t.t = V),
          z = C[0],
          G = C[1],
          H = C[2],
          j = e[u - 1];
        j || F(0);
        var q = (u << 3) - 8 + S(j) - H.b,
          K = q >> 3,
          W = 0,
          Y = ((e[K] | (e[K + 1] << 8)) >> (7 & q)) & ((1 << H.b) - 1),
          X =
            ((e[(K = (q -= G.b) >> 3)] | (e[K + 1] << 8)) >> (7 & q)) &
            ((1 << G.b) - 1),
          J =
            ((e[(K = (q -= z.b) >> 3)] | (e[K + 1] << 8)) >> (7 & q)) &
            ((1 << z.b) - 1);
        for (++E; --E; ) {
          var Z = H.s[Y],
            Q = H.n[Y],
            ee = z.s[J],
            te = z.n[J],
            re = G.s[X],
            ie = G.n[X],
            ne = 1 << re,
            oe =
              ne +
              (((e[(K = (q -= re) >> 3)] |
                (e[K + 1] << 8) |
                (e[K + 2] << 16) |
                (e[K + 3] << 24)) >>>
                (7 & q)) &
                (ne - 1));
          K = (q -= U[ee]) >> 3;
          var se =
            I[ee] +
            (((e[K] | (e[K + 1] << 8) | (e[K + 2] << 16)) >> (7 & q)) &
              ((1 << U[ee]) - 1));
          K = (q -= T[Z]) >> 3;
          var ae =
            R[Z] +
            (((e[K] | (e[K + 1] << 8) | (e[K + 2] << 16)) >> (7 & q)) &
              ((1 << T[Z]) - 1));
          if (
            ((K = (q -= Q) >> 3),
            (Y =
              H.t[Y] +
              (((e[K] | (e[K + 1] << 8)) >> (7 & q)) & ((1 << Q) - 1))),
            (K = (q -= te) >> 3),
            (J =
              z.t[J] +
              (((e[K] | (e[K + 1] << 8)) >> (7 & q)) & ((1 << te) - 1))),
            (K = (q -= ie) >> 3),
            (X =
              G.t[X] +
              (((e[K] | (e[K + 1] << 8)) >> (7 & q)) & ((1 << ie) - 1))),
            oe > 3)
          )
            (t.o[2] = t.o[1]), (t.o[1] = t.o[0]), (t.o[0] = oe -= 3);
          else {
            var ue = oe - (0 != ae);
            ue
              ? ((oe = 3 == ue ? t.o[0] - 1 : t.o[ue]),
                ue > 1 && (t.o[2] = t.o[1]),
                (t.o[1] = t.o[0]),
                (t.o[0] = oe))
              : (oe = t.o[0]);
          }
          for (N = 0; N < ae; ++N) y[W + N] = y[b + N];
          b += ae;
          var fe = (W += ae) - oe;
          if (fe < 0) {
            var ce = -fe,
              le = t.e + fe;
            ce > se && (ce = se);
            for (N = 0; N < ce; ++N) y[W + N] = t.w[le + N];
            (W += ce), (se -= ce), (fe = 0);
          }
          for (N = 0; N < se; ++N) y[W + N] = y[fe + N];
          W += se;
        }
        if (W != b) for (; b < y.length; ) y[W++] = y[b++];
        else W = y.length;
        r ? (t.y += W) : (y = m(y, 0, W));
      } else if (r) {
        if (((t.y += h), b)) for (N = 0; N < h; ++N) y[N] = y[b + N];
      } else b && (y = m(y, b));
      return (t.b = u), y;
    }
    F(2);
  }
};
function $(e, t) {
  for (var r = 0, i = [], n = +!t, o = 0; e.length; ) {
    var s = B(e, n || t);
    if ("object" == typeof s) {
      for (
        n
          ? ((t = null), s.w.length == s.u && (i.push((t = s.w)), (o += s.u)))
          : (i.push(t), (s.e = 0));
        !s.l;

      ) {
        var a = N(e, s, t);
        a || F(5),
          t
            ? (s.e = s.y)
            : (i.push(a),
              (o += a.length),
              v(s.w, 0, a.length),
              s.w.set(a, s.w.length - a.length));
      }
      r = s.b + 4 * s.c;
    } else r = s;
    e = e.subarray(r);
  }
  return (function (e, t) {
    if (1 == e.length) return e[0];
    for (var r = new Uint8Array(t), i = 0, n = 0; i < e.length; ++i) {
      var o = e[i];
      r.set(o, n), (n += o.length);
    }
    return r;
  })(i, o);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const z = (e,t)=>e < t ? 1 : e > t ? -1 : 0;
function G(e) {
    const t = e.askPrices
      , r = e.askSizes
      , i = e.bidPrices
      , n = e.bidSizes
      , o = e.minPrice
      , s = e.maxPrice
      , a = e.priceGroup;
    e.lastPrice;
    if (5 + 2 * Math.ceil((s - o) / a) < 0)
        return console.warn("Heatmap not ready yet...", e),
        {
            time: e.time,
            data: new Float64Array(0)
        };
    const u = t.length
      , f = Object.keys(t).sort(((e,r)=>z(t[e], t[r])))
      , c = i.length
      , l = Object.keys(i).sort(((e,t)=>z(i[e], i[t])))
      , h = new Float64Array(5 + 2 * (u + c));
    let d = 5;
    for (let e = 0; e < u; e++) {
        const i = f[e];
        h[d++] = t[i],
        h[d++] = -r[i]
    }
    for (let e = 0; e < c; e++) {
        const t = l[e];
        h[d++] = i[t],
        h[d++] = n[t]
    }
    return h[0] = a,
    h[1] = t.length,
    h[2] = i.length,
    h[3] = o,
    h[4] = s,
    {
        time: e.time,
        data: h
    }
}
function Ee(e, t) {
    return {
        exchange: e.exchange,
        symbol: e.symbol,
        timeframe: e.timeframe,
        type: t
    }
}
function Be(e) {
    if (e)
        for (let t = 0; t < e.length; t++) {
            const r = e[t];
            if (r.priceGroup && r.prices.length)
                return !1
        }
    return !0
}
function Se(e) {
    if (e)
        for (let t = 0; t < e.length; t++) {
            const r = e[t];
            if (r.priceGroup && r.lastPrice)
                return !1
        }
    return !0
}
function Ae(e) {
    if (e)
        for (let t = 0; t < e.length; t++) {
            const r = e[t];
            if (!isNaN(r))
                return !1
        }
    return !0
}
function ke(e) {
    const t = e.length
        , r = {
        time: new Float64Array(t),
        priceGroup: new Float64Array(t),
        prices: new Array(t),
        buys: new Array(t),
        sells: new Array(t)
    };
    for (let i = 0; i < t; i++) {
        const t = e[i];
        r.time[i] = t.time,
        r.priceGroup[i] = t.priceGroup,
        r.prices[i] = new Float64Array(t.prices),
        r.buys[i] = new Float64Array(t.buys),
        r.sells[i] = new Float64Array(t.sells)
    }
    return r
}
// function De(t, r) {
//     return 0 | Math.floor(Math.floor((t - e) / r) / 256)
// }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




var L = {
    trades :"trades",
    candles: "candles",
    counter: "counter",
    stats: "stats",
    volume: "volume",
    heatmap: "heatmap",
    heatmap0: "heatmap@0",
    heatmap1: "heatmap@1",
    orderbook: "orderbook",
    script: "script",
}
var C = (e=>(e[e.UNKNOWN = 0] = "UNKNOWN",
    e[e.TRADES = 1] = "TRADES",
    e[e.CANDLES = 10] = "CANDLES",
    e[e.STATS = 20] = "STATS",
    e[e.VOLUME = 25] = "VOLUME",
    e[e.ORDERBOOK_UPDATE = 60] = "ORDERBOOK_UPDATE",
    e[e.ORDERBOOK_SNAPSHOT = 61] = "ORDERBOOK_SNAPSHOT",
    e[e.HEATMAP_R0 = 70] = "HEATMAP_R0",
    e[e.HEATMAP_R1 = 71] = "HEATMAP_R1",
    e[e.HEATMAP_R2 = 72] = "HEATMAP_R2",
    e[e.RANGE_CANDLES = 100] = "RANGE_CANDLES",
    e[e.RANGE_STATS = 110] = "RANGE_STATS",
    e[e.RANGE_HEATMAP = 115] = "RANGE_HEATMAP",
    e[e.RANGE_VOLUME = 120] = "RANGE_VOLUME",
    e[e.RANGE_SCRIPT = 200] = "RANGE_SCRIPT",
    e))(C || {});

function parse(buff){
    const type = buff[0];
    const buffer_data = $(buff.subarray(1));
    switch (type) {
      case C.ORDERBOOK_UPDATE:
      case C.ORDERBOOK_SNAPSHOT: {
        const e = Orderbook_parse.read(buffer_data);
        return {
          id: `update,${e.exchange}:${e.symbol},0,${L.orderbook}`,
          meta_id: -1,
          data: e,
          opts: Ee(e, L.orderbook),
        };
      }
      case C.TRADES: {
        const e = trades_parse.read(buffer_data);
        return {
          id: `update,${e.exchange}:${e.symbol},0,${L.trades}`,
          meta_id: -1,
          data: e.entries,
          opts: Ee(e, L.trades),
        };
      }
      case C.CANDLES: {
        const e = RangeCandles_Candles_parse.read(buffer_data),
          r = e.type ? "@ha" : "@default";
        return {
          id: `update,${e.exchange}:${e.symbol},${e.timeframe},${L.candles}${r}`,
          meta_id: -1,
          data: e,
          opts: Ee(e, L.candles),
        };
      }
      case C.STATS: {
        const e = RangeStats_Stats_parse.read(buffer_data);
        return {
          id: `update,${e.exchange}:${e.symbol},${e.timeframe},${L.stats}`,
          meta_id: -1,
          data: e,
          opts: Ee(e, L.stats),
        };
      }
      case C.VOLUME: {
        const e = RangeVol_vol_parse.read(buffer_data);
        return {
          id: `update,${e.exchange}:${e.symbol},${e.timeframe},${L.volume}`,
          meta_id: -1,
          data: ke(e.entries),
          opts: Ee(e, L.volume),
        };
      }
      case C.HEATMAP_R2:
      case C.HEATMAP_R0:
      case C.HEATMAP_R1: {
        const e = heatmap_parse.read(buffer_data),
          r = e.isHD ? "@0" : "@1";
        return {
          id: `update,${e.exchange}:${e.symbol},0,${L.heatmap}${r}`,
          meta_id: -1,
          data: G(e),
          opts: Ee(e, L.heatmap),
        };
      }
      case C.RANGE_CANDLES: {
        const e = RangeCandles_Candles_parse.read(buffer_data),
          r = e.type ? "@ha" : "@default";
        return {
          id: `range,${e.exchange}:${e.symbol},${e.timeframe},${L.candles}${r}`,
          meta_id: e.meta_id,
          data: e,
          empty: Ae(e.close),
          opts: Ee(e, L.candles),
        };
      }
      case C.RANGE_STATS: {
        const e = RangeStats_Stats_parse.read(buffer_data);
        return {
          id: `range,${e.exchange}:${e.symbol},${e.timeframe},${L.stats}`,
          meta_id: e.meta_id,
          data: e,
          empty: Ae(e.close) || Ae(e.markPrice),
          opts: Ee(e, L.stats),
        };
      }
      case C.RANGE_HEATMAP: {
        const e = RangeHeatmap_parse.read(buffer_data);
        return {
          id: `range,${e.exchange}:${e.symbol},${e.timeframe},${
            e.isHD ? L.heatmap0 : L.heatmap1
          }`,
          meta_id: e.meta_id,
          data: {
            time: e.entries.map((e) => e.time),
            data: e.entries.map(q),
          },
          empty: Se(e.entries),
          opts: Ee(e, L.heatmap),
        };
      }
      case C.RANGE_VOLUME: {
        const e = RangeVol_vol_parse.read(buffer_data);
        return {
          id: `range,${e.exchange}:${e.symbol},${e.timeframe},${L.volume}`,
          meta_id: e.meta_id,
          data: ke(e.entries),
          empty: Be(e.entries),
          opts: Ee(e, L.volume),
        };
      }
      default:
        console.error("Unknown MessageType", e);
    }
}



function generate_tab_id(){
  a = ""
  e = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
  for(; ; ){
    let t = crypto.webcrypto.getRandomValues(new Uint8Array(18))
    let s = 18
    for(; s--; ){
      if (a += e[t[s] & 63] || "", a.length === 10)
        return a
      // a += String.fromCharCode(t[s] % o)
    }
  }
}


module.exports = { parse, generate_tab_id };
