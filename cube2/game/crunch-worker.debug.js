var cCRNFmtInvalid = -1;
var cCRNFmtDXT1 = 0;
var cCRNFmtDXT3 = 1;
var cCRNFmtDXT5 = 2;
var cCRNFmtDXT5_CCxY = 3;
var cCRNFmtDXT5_xGxR = 4;
var cCRNFmtDXT5_xGBR = 5;
var cCRNFmtDXT5_AGBR = 6;
var cCRNFmtDXN_XY = 7;
var cCRNFmtDXN_YX = 8;
var cCRNFmtDXT5A = 9;
function arrayBufferCopy(src, dst, dstByteOffset, numBytes) {
  dst.set(src.subarray(0, numBytes), dstByteOffset)
}
function deCrunch(bytes, filename) {
  var srcSize = bytes.length;
  var src = Module._malloc(srcSize), format, internalFormat, dst, dstSize, width, height, levels, dxtData, rgb565Data, i;
  arrayBufferCopy(bytes, Module.HEAPU8, src, srcSize);
  format = Module._crn_get_dxt_format(src, srcSize);
  if(format != cCRNFmtDXT1 && format != cCRNFmtDXT3 && format != cCRNFmtDXT5) {
    throw"Unsupported image format " + format + " for " + filename;
  }
  width = Module._crn_get_width(src, srcSize);
  height = Module._crn_get_height(src, srcSize);
  levels = Module._crn_get_levels(src, srcSize);
  dstSize = Module._crn_get_uncompressed_size(src, srcSize, 0);
  dst = Module._malloc(dstSize);
  var totalSize = 0;
  var bytesPerPixel = format == cCRNFmtDXT1 ? 0.5 : 1;
  for(i = 0;i < levels;++i) {
    totalSize += width * height * bytesPerPixel;
    width *= 0.5;
    height *= 0.5;
    width = Math.max(width, 4);
    height = Math.max(height, 4)
  }
  width = Module._crn_get_width(src, srcSize);
  height = Module._crn_get_height(src, srcSize);
  var ret = new Uint8Array(totalSize);
  var retIndex = 0;
  for(i = 0;i < levels;++i) {
    if(i) {
      dstSize = Module._crn_get_uncompressed_size(src, srcSize, i)
    }
    Module._crn_decompress(src, srcSize, dst, dstSize, i);
    ret.set(Module.HEAPU8.subarray(dst, dst + dstSize), retIndex);
    retIndex += dstSize;
    width *= 0.5;
    height *= 0.5
  }
  Module._free(src);
  Module._free(dst);
  return ret
}
function a(b) {
  throw b;
}
var aa = void 0, l = !0, pa = null, n = !1, za = [], Da = "object" === typeof process, Ea = "object" === typeof window, Fa = "function" === typeof importScripts, Ja = !Ea && !Da && !Fa;
if(Da) {
  print = function(b) {
    process.stdout.write(b + "\n")
  };
  printErr = function(b) {
    process.stderr.write(b + "\n")
  };
  var Ma = require("fs");
  read = function(b) {
    var c = Ma.readFileSync(b).toString();
    !c && "/" != b[0] && (b = __dirname.split("/").slice(0, -1).join("/") + "/src/" + b, c = Ma.readFileSync(b).toString());
    return c
  };
  load = function(b) {
    Na(read(b))
  };
  za = process.argv.slice(2)
}else {
  Ja ? (this.read || (this.read = function(b) {
    snarf(b)
  }), "undefined" != typeof scriptArgs ? za = scriptArgs : "undefined" != typeof arguments && (za = arguments)) : Ea ? (this.print = printErr = function(b) {
    console.log(b)
  }, this.read = function(b) {
    var c = new XMLHttpRequest;
    c.open("GET", b, n);
    c.send(pa);
    return c.responseText
  }, this.arguments && (za = arguments)) : Fa ? this.load = importScripts : a("Unknown runtime environment. Where are we?")
}
function Na(b) {
  eval.call(pa, b)
}
"undefined" == typeof load && "undefined" != typeof read && (this.load = function(b) {
  Na(read(b))
});
"undefined" === typeof printErr && (this.printErr = function() {
});
"undefined" === typeof print && (this.print = printErr);
try {
  this.Module = Module
}catch(Qa) {
  this.Module = Module = {}
}
Module.arguments || (Module.arguments = za);
Module.print && (print = Module.print);
function Wa(b) {
  if(Xa == 1) {
    return 1
  }
  var c = {"%i1":1, "%i8":1, "%i16":2, "%i32":4, "%i64":8, "%float":4, "%double":8}["%" + b];
  if(!c) {
    if(b[b.length - 1] == "*") {
      c = Xa
    }else {
      if(b[0] == "i") {
        b = parseInt(b.substr(1));
        Ya(b % 8 == 0);
        c = b / 8
      }
    }
  }
  return c
}
function cb(b) {
  var c = q;
  q = q + b;
  q = q + 3 >> 2 << 2;
  return c
}
function db(b) {
  var c = eb;
  eb = eb + b;
  eb = eb + 3 >> 2 << 2;
  if(eb >= fb) {
    for(;fb <= eb;) {
      fb = 2 * fb + 4095 >> 12 << 12
    }
    var b = v, d = new ArrayBuffer(fb);
    v = new Int8Array(d);
    gb = new Int16Array(d);
    y = new Int32Array(d);
    z = new Uint8Array(d);
    A = new Uint16Array(d);
    C = new Uint32Array(d);
    lb = new Float32Array(d);
    mb = new Float64Array(d);
    v.set(b)
  }
  return c
}
var Xa = 4, ub = {}, vb;
function wb(b) {
  print(b + ":\n" + Error().stack);
  a("Assertion: " + b)
}
function Ya(b, c) {
  b || wb("Assertion failed: " + c)
}
var Mb = this;
Module.ccall = function(b, c, d, e) {
  try {
    var g = eval("_" + b)
  }catch(h) {
    try {
      g = Mb.Module["_" + b]
    }catch(j) {
    }
  }
  Ya(g, "Cannot call unknown function " + b + " (perhaps LLVM optimizations or closure removed it?)");
  var i = 0, b = e ? e.map(function(b) {
    if(d[i++] == "string") {
      var c = q;
      cb(b.length + 1);
      Nb(b, c);
      b = c
    }
    return b
  }) : [];
  return function(b, c) {
    return c == "string" ? Vb(b) : b
  }(g.apply(pa, b), c)
};
function Wb(b, c, d) {
  d = d || "i8";
  d[d.length - 1] === "*" && (d = "i32");
  switch(d) {
    case "i1":
      v[b] = c;
      break;
    case "i8":
      v[b] = c;
      break;
    case "i16":
      gb[b >> 1] = c;
      break;
    case "i32":
      y[b >> 2] = c;
      break;
    case "i64":
      y[b >> 2] = c;
      break;
    case "float":
      lb[b >> 2] = c;
      break;
    case "double":
      Yb[0] = c;
      y[b >> 2] = Zb[0];
      y[b + 4 >> 2] = Zb[1];
      break;
    default:
      wb("invalid type for setValue: " + d)
  }
}
Module.setValue = Wb;
Module.getValue = function(b, c) {
  c = c || "i8";
  c[c.length - 1] === "*" && (c = "i32");
  switch(c) {
    case "i1":
      return v[b];
    case "i8":
      return v[b];
    case "i16":
      return gb[b >> 1];
    case "i32":
      return y[b >> 2];
    case "i64":
      return y[b >> 2];
    case "float":
      return lb[b >> 2];
    case "double":
      return Zb[0] = y[b >> 2], Zb[1] = y[b + 4 >> 2], Yb[0];
    default:
      wb("invalid type for setValue: " + c)
  }
  return pa
};
var $b = 1, D = 2;
Module.ALLOC_NORMAL = 0;
Module.ALLOC_STACK = $b;
Module.ALLOC_STATIC = D;
function G(b, c, d) {
  var e, g;
  if(typeof b === "number") {
    e = l;
    g = b
  }else {
    e = n;
    g = b.length
  }
  var h = typeof c === "string" ? c : pa, d = [ac, cb, db][d === aa ? D : d](Math.max(g, h ? 1 : c.length));
  if(e) {
    bc(d, 0, g);
    return d
  }
  e = 0;
  for(var j;e < g;) {
    var i = b[e];
    typeof i === "function" && (i = ub.xa(i));
    j = h || c[e];
    if(j === 0) {
      e++
    }else {
      j == "i64" && (j = "i32");
      Wb(d + e, i, j);
      e = e + Wa(j)
    }
  }
  return d
}
Module.allocate = G;
function Vb(b, c) {
  for(var d = typeof c == "undefined", e = "", g = 0, h, j = String.fromCharCode(0);;) {
    h = String.fromCharCode(z[b + g]);
    if(d && h == j) {
      break
    }
    e = e + h;
    g = g + 1;
    if(!d && g == c) {
      break
    }
  }
  return e
}
Module.Pointer_stringify = Vb;
Module.Array_stringify = function(b) {
  for(var c = "", d = 0;d < b.length;d++) {
    c = c + String.fromCharCode(b[d])
  }
  return c
};
var dc, ec = 4096, v, z, gb, A, y, C, lb, mb, q, fc, eb, hc = Module.TOTAL_STACK || 5242880, fb = Module.TOTAL_MEMORY || 10485760;
Ya(!!Int32Array && !!Float64Array && !!(new Int32Array(1)).subarray && !!(new Int32Array(1)).set, "Cannot fallback to non-typed array case: Code is too specialized");
var ic = new ArrayBuffer(fb);
v = new Int8Array(ic);
gb = new Int16Array(ic);
y = new Int32Array(ic);
z = new Uint8Array(ic);
A = new Uint16Array(ic);
C = new Uint32Array(ic);
lb = new Float32Array(ic);
mb = new Float64Array(ic);
y[0] = 255;
Ya(255 === z[0] && 0 === z[3], "Typed arrays 2 must be run on a little-endian system");
var kc = jc("(null)");
eb = kc.length;
for(var lc = 0;lc < kc.length;lc++) {
  v[lc] = kc[lc]
}
Module.HEAP = aa;
Module.HEAP8 = v;
Module.HEAP16 = gb;
Module.HEAP32 = y;
Module.HEAPU8 = z;
Module.HEAPU16 = A;
Module.HEAPU32 = C;
Module.HEAPF32 = lb;
Module.HEAPF64 = mb;
fc = (q = 4 * Math.ceil(eb / 4)) + hc;
var mc = 8 * Math.ceil(fc / 8);
v.subarray(mc);
var Zb = y.subarray(mc >> 2);
lb.subarray(mc >> 2);
var Yb = mb.subarray(mc >> 3);
fc = mc + 8;
eb = fc + 4095 >> 12 << 12;
function nc(b) {
  for(;b.length > 0;) {
    var c = b.shift(), d = c.r;
    typeof d === "number" && (d = dc[d]);
    d(c.da === aa ? pa : c.da)
  }
}
var pc = [], qc = [];
function rc(b, c) {
  return Array.prototype.slice.call(v.subarray(b, b + c))
}
Module.Array_copy = rc;
Module.TypedArray_copy = function(b, c) {
  for(var d = new Uint8Array(c), e = 0;e < c;++e) {
    d[e] = v[b + e]
  }
  return d.buffer
};
function sc(b) {
  for(var c = 0;v[b + c];) {
    c++
  }
  return c
}
Module.String_len = sc;
function tc(b, c) {
  var d = sc(b);
  c && d++;
  var e = rc(b, d);
  c && (e[d - 1] = 0);
  return e
}
Module.String_copy = tc;
function jc(b, c) {
  for(var d = [], e = 0;e < b.length;) {
    var g = b.charCodeAt(e);
    g > 255 && (g = g & 255);
    d.push(g);
    e = e + 1
  }
  c || d.push(0);
  return d
}
Module.intArrayFromString = jc;
Module.intArrayToString = function(b) {
  for(var c = [], d = 0;d < b.length;d++) {
    var e = b[d];
    e > 255 && (e = e & 255);
    c.push(String.fromCharCode(e))
  }
  return c.join("")
};
function Nb(b, c, d) {
  for(var e = 0;e < b.length;) {
    var g = b.charCodeAt(e);
    g > 255 && (g = g & 255);
    v[c + e] = g;
    e = e + 1
  }
  d || (v[c + e] = 0)
}
Module.writeStringToMemory = Nb;
var M = [];
function uc(b, c) {
  return b >= 0 ? b : c <= 32 ? 2 * Math.abs(1 << c - 1) + b : Math.pow(2, c) + b
}
function vc(b, c) {
  if(b <= 0) {
    return b
  }
  var d = c <= 32 ? Math.abs(1 << c - 1) : Math.pow(2, c - 1);
  if(b >= d && (c <= 32 || b > d)) {
    b = -2 * d + b
  }
  return b
}
function wc(b) {
  b = b - 1 | 0;
  b = b >>> 16 | b;
  b = b >>> 8 | b;
  b = b >>> 4 | b;
  b = b >>> 2 | b;
  return(b >>> 1 | b) + 1 | 0
}
function xc(b, c) {
  var d = M.O | 0, e = q;
  q = q + 512;
  for(var g = e | 0, d = (vb = q, q = q + 12, y[vb >> 2] = d, y[vb + 4 >> 2] = c, y[vb + 8 >> 2] = b, vb), d = yc(M.G | 0, d), h = d.length, j = 0;j < h;j++) {
    v[g + j] = d[j]
  }
  v[g + j] = 0;
  h = (vb = q, q = q + 1, q = q + 3 >> 2 << 2, y[vb >> 2] = 0, vb);
  d = y[zc >> 2];
  j = yc(g, h);
  g = q;
  h = G(j, "i8", $b);
  j = j.length * 1;
  if(j != 0 && Dc(d, h, j) == -1 && Ec[d]) {
    Ec[d].error = l
  }
  q = g;
  q = e
}
function Fc(b, c, d, e, g) {
  var h, j, i = q;
  q = q + 4;
  var f = b + 4 | 0;
  j = (b + 8 | 0) >> 2;
  C[f >> 2] >>> 0 > C[j] >>> 0 && xc(M.H | 0, 2121);
  Math.floor(2147418112 / (e >>> 0)) >>> 0 > c >>> 0 || xc(M.T | 0, 2122);
  var k = C[j], o = k >>> 0 < c >>> 0;
  do {
    if(o) {
      var m = d ? ((c | 0) == 0 ? 0 : (c - 1 & c | 0) == 0) ? c : wc(c) : c;
      (m | 0) != 0 & m >>> 0 > k >>> 0 || xc(M.Y | 0, 2131);
      var t = m * e | 0;
      if((g | 0) == 0) {
        h = b | 0;
        var s, w = y[h >> 2], u = t, r = i;
        s = q;
        q = q + 4;
        if((w & 7 | 0) == 0) {
          if(u >>> 0 > 2147418112) {
            xc(M.m | 0, 2500);
            r = 0
          }else {
            y[s >> 2] = u;
            w = dc[y[Gc >> 2]](w, u, s, 1, y[Hc >> 2]);
            (r | 0) != 0 && (y[r >> 2] = y[s >> 2]);
            (w & 7 | 0) != 0 && xc(M.n | 0, 2552);
            r = w
          }
        }else {
          xc(M.J | 0, 2500);
          r = 0
        }
        q = s;
        s = r;
        if((s | 0) == 0) {
          m = 0;
          break
        }
        y[h >> 2] = s
      }else {
        s = Ic(t, i);
        if((s | 0) == 0) {
          m = 0;
          break
        }
        h = (b | 0) >> 2;
        dc[g](s, y[h], y[f >> 2]);
        r = y[h];
        (r | 0) != 0 && Jc(r);
        y[h] = s
      }
      h = C[i >> 2];
      y[j] = h >>> 0 > t >>> 0 ? Math.floor((h >>> 0) / (e >>> 0)) : m
    }
    m = 1
  }while(0);
  q = i;
  return m
}
Fc.X = 1;
function Ic(b, c) {
  var d = q;
  q = q + 4;
  var e = b + 3 & -4, e = (e | 0) == 0 ? 4 : e;
  if(e >>> 0 > 2147418112) {
    xc(M.m | 0, 2500);
    e = 0
  }else {
    y[d >> 2] = e;
    var g = dc[y[Gc >> 2]](0, e, d, 1, y[Hc >> 2]), h = C[d >> 2];
    (c | 0) != 0 && (y[c >> 2] = h);
    if((g | 0) == 0 | h >>> 0 < e >>> 0) {
      xc(M.I | 0, 2500);
      e = 0
    }else {
      (g & 7 | 0) != 0 && xc(M.n | 0, 2527);
      e = g
    }
  }
  q = d;
  return e
}
function Jc(b) {
  if((b | 0) != 0) {
    if((b & 7 | 0) == 0) {
      dc[y[Gc >> 2]](b, 0, 0, 1, y[Hc >> 2])
    }else {
      xc(M.K | 0, 2500)
    }
  }
}
function Kc(b, c, d, e) {
  var g, h, j, i, f = b >> 2, k = q;
  q = q + 200;
  var o;
  i = k >> 2;
  var m = k + 64;
  j = m >> 2;
  var t = k + 132, s = (c | 0) == 0 | e >>> 0 > 11;
  a:do {
    if(s) {
      var w = 0
    }else {
      y[f] = c;
      bc(m, 0, 68);
      for(var u = 0;;) {
        var r = z[d + u | 0];
        if(r << 24 >> 24 != 0) {
          var x = ((r & 255) << 2) + m | 0;
          y[x >> 2] = y[x >> 2] + 1 | 0
        }
        var p = u + 1 | 0;
        if((p | 0) == (c | 0)) {
          var B = 1, I = -1, S = 0, Q = 0, H = 0;
          break
        }
        u = p
      }
      for(;;) {
        var J = C[(B << 2 >> 2) + j];
        if((J | 0) == 0) {
          y[((B - 1 << 2) + 28 >> 2) + f] = 0;
          var K = H, E = Q, da = S, N = I
        }else {
          var ka = I >>> 0 < B >>> 0 ? I : B, ba = S >>> 0 > B >>> 0 ? S : B, ra = B - 1 | 0;
          y[(ra << 2 >> 2) + i] = H;
          var ia = J + H | 0, fa = 16 - B | 0;
          y[((ra << 2) + 28 >> 2) + f] = (ia - 1 << fa | (1 << fa) - 1) + 1 | 0;
          y[((ra << 2) + 96 >> 2) + f] = Q;
          y[t + (B << 2) >> 2] = Q;
          K = ia;
          E = J + Q | 0;
          da = ba;
          N = ka
        }
        var Ga = B + 1 | 0;
        if((Ga | 0) == 17) {
          break
        }
        B = Ga;
        I = N;
        S = da;
        Q = E;
        H = K << 1
      }
      y[f + 1] = E;
      h = (b + 172 | 0) >> 2;
      if(E >>> 0 > C[h] >>> 0) {
        var ta = ((E | 0) == 0 ? 0 : (E - 1 & E | 0) == 0) ? E : c >>> 0 < wc(E) >>> 0 ? c : wc(E);
        y[h] = ta;
        var la = b + 176 | 0, Aa = y[la >> 2];
        if((Aa | 0) == 0) {
          var xa = ta
        }else {
          Lc(Aa);
          xa = y[h]
        }
        var Y, ma = (xa | 0) == 0 ? 1 : xa, ga = Ic((ma << 1) + 8 | 0, 0);
        if((ga | 0) == 0) {
          var ua = 0
        }else {
          var Ba = ga + 8 | 0;
          y[ga + 4 >> 2] = ma;
          y[ga >> 2] = ma ^ -1;
          ua = Ba
        }
        Y = ua;
        y[la >> 2] = Y;
        if((Y | 0) == 0) {
          w = 0;
          break
        }
        var Ca = la
      }else {
        Ca = b + 176 | 0
      }
      var va = b + 24 | 0;
      v[va] = N & 255;
      v[b + 25 | 0] = da & 255;
      for(var Z = 0;;) {
        var sa = z[d + Z | 0], T = sa & 255;
        if(sa << 24 >> 24 != 0) {
          (y[(T << 2 >> 2) + j] | 0) == 0 && xc(M.Z | 0, 2274);
          var ea = (T << 2) + t | 0, W = C[ea >> 2];
          y[ea >> 2] = W + 1 | 0;
          W >>> 0 < E >>> 0 || xc(M.$ | 0, 2278);
          gb[y[Ca >> 2] + (W << 1) >> 1] = Z & 65535
        }
        var ya = Z + 1 | 0;
        if((ya | 0) == (c | 0)) {
          break
        }
        Z = ya
      }
      var L = z[va], O = (L & 255) >>> 0 < e >>> 0 ? e : 0, qa = b + 8 | 0;
      y[qa >> 2] = O;
      var na = (O | 0) != 0;
      if(na) {
        var U = 1 << O, P = b + 164 | 0, F = U >>> 0 > C[P >> 2] >>> 0;
        do {
          if(F) {
            y[P >> 2] = U;
            var oa = b + 168 | 0, wa = y[oa >> 2];
            (wa | 0) != 0 && Mc(wa);
            var ca, V = (U | 0) == 0 ? 1 : U, ja = Ic((V << 2) + 8 | 0, 0);
            if((ja | 0) == 0) {
              var Oa = 0
            }else {
              var hb = ja + 8 | 0;
              y[ja + 4 >> 2] = V;
              y[ja >> 2] = V ^ -1;
              Oa = hb
            }
            ca = Oa;
            y[oa >> 2] = ca;
            if((ca | 0) == 0) {
              w = 0;
              break a
            }
            bc(ca, -1, U << 2);
            if((O | 0) == 0) {
              o = 26
            }else {
              Ra = oa;
              o = 34
            }
          }else {
            var Ha = b + 168 | 0;
            bc(y[Ha >> 2], -1, U << 2);
            var Ra = Ha;
            o = 34
          }
        }while(0);
        b:do {
          if(o == 34) {
            for(var Za = 1;;) {
              var Ob = (y[(Za << 2 >> 2) + j] | 0) == 0;
              c:do {
                if(!Ob) {
                  var xb = O - Za | 0, Pb = 1 << xb, yb = Za - 1 | 0, ha = C[(yb << 2 >> 2) + i], Ka, La = b, ib = Za;
                  (ib | 0) != 0 & ib >>> 0 < 17 || xc(M.W | 0, 1954);
                  var zb = y[La + (ib - 1 << 2) + 28 >> 2];
                  Ka = (zb | 0) == 0 ? -1 : (zb - 1 | 0) >>> ((16 - ib | 0) >>> 0);
                  if(ha >>> 0 <= Ka >>> 0) {
                    for(var Qb = y[((yb << 2) + 96 >> 2) + f] - ha | 0, Rb = Za << 16, $a = ha;;) {
                      var Sb = A[y[Ca >> 2] + (Qb + $a << 1) >> 1] & 65535;
                      (z[d + Sb | 0] & 255 | 0) != (Za | 0) && xc(M.aa | 0, 2320);
                      for(var Tb = $a << xb, cc = Sb | Rb, Ab = 0;;) {
                        var bb = Ab + Tb | 0;
                        bb >>> 0 < U >>> 0 || xc(M.ba | 0, 2326);
                        var ab = C[Ra >> 2];
                        if((y[ab + (bb << 2) >> 2] | 0) == -1) {
                          var Ia = ab
                        }else {
                          xc(M.ca | 0, 2328);
                          Ia = y[Ra >> 2]
                        }
                        y[Ia + (bb << 2) >> 2] = cc;
                        var Bb = Ab + 1 | 0;
                        if(Bb >>> 0 >= Pb >>> 0) {
                          break
                        }
                        Ab = Bb
                      }
                      var Cb = $a + 1 | 0;
                      if(Cb >>> 0 > Ka >>> 0) {
                        break c
                      }
                      $a = Cb
                    }
                  }
                }
              }while(0);
              var Db = Za + 1 | 0;
              if(Db >>> 0 > O >>> 0) {
                break b
              }
              Za = Db
            }
          }
        }while(0);
        var ob = v[va]
      }else {
        ob = L
      }
      var pb = b + 96 | 0;
      y[pb >> 2] = y[pb >> 2] - y[i] | 0;
      var Eb = b + 100 | 0;
      y[Eb >> 2] = y[Eb >> 2] - y[i + 1] | 0;
      var Fb = b + 104 | 0;
      y[Fb >> 2] = y[Fb >> 2] - y[i + 2] | 0;
      var qb = b + 108 | 0;
      y[qb >> 2] = y[qb >> 2] - y[i + 3] | 0;
      var jb = b + 112 | 0;
      y[jb >> 2] = y[jb >> 2] - y[i + 4] | 0;
      var rb = b + 116 | 0;
      y[rb >> 2] = y[rb >> 2] - y[i + 5] | 0;
      var Sa = b + 120 | 0;
      y[Sa >> 2] = y[Sa >> 2] - y[i + 6] | 0;
      var Pa = b + 124 | 0;
      y[Pa >> 2] = y[Pa >> 2] - y[i + 7] | 0;
      var sb = b + 128 | 0;
      y[sb >> 2] = y[sb >> 2] - y[i + 8] | 0;
      var Ta = b + 132 | 0;
      y[Ta >> 2] = y[Ta >> 2] - y[i + 9] | 0;
      var Gb = b + 136 | 0;
      y[Gb >> 2] = y[Gb >> 2] - y[i + 10] | 0;
      var Hb = b + 140 | 0;
      y[Hb >> 2] = y[Hb >> 2] - y[i + 11] | 0;
      var Ib = b + 144 | 0;
      y[Ib >> 2] = y[Ib >> 2] - y[i + 12] | 0;
      var tb = b + 148 | 0;
      y[tb >> 2] = y[tb >> 2] - y[i + 13] | 0;
      var Jb = b + 152 | 0;
      y[Jb >> 2] = y[Jb >> 2] - y[i + 14] | 0;
      var Kb = b + 156 | 0;
      y[Kb >> 2] = y[Kb >> 2] - y[i + 15] | 0;
      var Lb = b + 16 | 0;
      y[Lb >> 2] = 0;
      g = (b + 20 | 0) >> 2;
      y[g] = ob & 255;
      b:do {
        if(na) {
          for(var kb = O;;) {
            if((kb | 0) == 0) {
              break b
            }
            var Ua = kb - 1 | 0;
            if((y[(kb << 2 >> 2) + j] | 0) != 0) {
              break
            }
            kb = Ua
          }
          y[Lb >> 2] = y[((Ua << 2) + 28 >> 2) + f];
          for(var Ub = O + 1 | 0, Va = y[g] = Ub;;) {
            if(Va >>> 0 > da >>> 0) {
              break b
            }
            if((y[(Va << 2 >> 2) + j] | 0) != 0) {
              break
            }
            Va = Va + 1 | 0
          }
          y[g] = Va
        }
      }while(0);
      y[f + 23] = -1;
      y[f + 40] = 1048575;
      y[f + 3] = 32 - y[qa >> 2] | 0;
      w = 1
    }
  }while(0);
  q = k;
  return w
}
Kc.X = 1;
function Lc(b) {
  var c;
  if((b | 0) != 0) {
    c = y[b - 4 >> 2];
    b = b - 8 | 0;
    c = (c | 0) == 0 ? 4 : (c | 0) == (y[b >> 2] ^ -1 | 0) ? 5 : 4;
    c == 4 && xc(M.p | 0, 645);
    Jc(b)
  }
}
function Mc(b) {
  var c;
  if((b | 0) != 0) {
    c = y[b - 4 >> 2];
    b = b - 8 | 0;
    c = (c | 0) == 0 ? 4 : (c | 0) == (y[b >> 2] ^ -1 | 0) ? 5 : 4;
    c == 4 && xc(M.p | 0, 645);
    Jc(b)
  }
}
function Nc(b) {
  return(z[b | 0] & 255) << 8 | z[b + 1 | 0] & 255
}
function Oc(b) {
  return(z[b + 1 | 0] & 255) << 16 | (z[b | 0] & 255) << 24 | z[b + 3 | 0] & 255 | (z[b + 2 | 0] & 255) << 8
}
function Pc(b) {
  return z[b | 0] & 255
}
function Qc(b) {
  return z[b + 2 | 0] & 255 | (z[b | 0] & 255) << 16 | (z[b + 1 | 0] & 255) << 8
}
function Rc(b, c) {
  if(b == 0 && c == 0 || b == 9 && c == 0) {
    var d = 4
  }else {
    if(b == 1 && c == 0 || b == 2 && c == 0 || b == 7 && c == 0 || b == 8 && c == 0 || b == 3 && c == 0 || b == 4 && c == 0 || b == 5 && c == 0 || b == 6 && c == 0) {
      d = 8
    }else {
      xc(M.M | 0, 2664);
      d = 0
    }
  }
  return d
}
function Sc(b, c) {
  return(b | 0) == 0 | c >>> 0 < 74 ? 0 : (Nc(b) | 0) != 18552 ? 0 : Nc(b + 2 | 0) >>> 0 < 74 ? 0 : Oc(b + 6 | 0) >>> 0 > c >>> 0 ? 0 : b
}
function Tc(b, c, d) {
  var e = d >> 2;
  if((b | 0) == 0 | c >>> 0 < 74 | (d | 0) == 0) {
    e = 0
  }else {
    if((y[e] | 0) != 40) {
      e = 0
    }else {
      b = Sc(b, c);
      if((b | 0) == 0) {
        e = 0
      }else {
        y[e + 1] = Nc(b + 12 | 0);
        y[e + 2] = Nc(b + 14 | 0);
        y[e + 3] = Pc(b + 16 | 0);
        y[e + 4] = Pc(b + 17 | 0);
        c = b + 18 | 0;
        d = d + 32 | 0;
        y[d >> 2] = Pc(c);
        y[d + 4 >> 2] = 0;
        d = Pc(c);
        y[e + 5] = (d | 0) == 0 ? 8 : (d | 0) == 9 ? 8 : 16;
        y[e + 6] = Oc(b + 25 | 0);
        y[e + 7] = Oc(b + 29 | 0);
        e = 1
      }
    }
  }
  return e
}
Tc.X = 1;
function Uc(b) {
  y[b >> 2] = 0;
  var c = b + 4 | 0;
  y[c >> 2] = 0;
  y[c + 4 >> 2] = 0;
  y[c + 8 >> 2] = 0;
  v[c + 12 | 0] = 0;
  y[b + 20 >> 2] = 0
}
function Vc(b) {
  var c = y[b + 20 >> 2];
  if((c | 0) != 0 && (c | 0) != 0) {
    Wc(c);
    Jc(c)
  }
  Xc(b + 4 | 0)
}
function Xc(b) {
  var c = b | 0, d = y[c >> 2];
  if((d | 0) != 0) {
    var e = b + 4 | 0;
    Jc(d);
    y[c >> 2] = 0;
    y[e >> 2] = 0;
    y[b + 8 >> 2] = 0
  }
  v[b + 12 | 0] = 0
}
function Yc(b, c) {
  var d;
  d = (b + 4 | 0) >> 2;
  var e = C[d], g = (e | 0) == (c | 0);
  do {
    if(g) {
      var h = 1
    }else {
      if(e >>> 0 <= c >>> 0) {
        if(C[b + 8 >> 2] >>> 0 < c >>> 0) {
          h = b;
          if(Fc(h, c, (e + 1 | 0) == (c | 0), 1, 0)) {
            h = 1
          }else {
            v[h + 12 | 0] = 1;
            h = 0
          }
          if(!h) {
            h = 0;
            break
          }
          h = y[d]
        }else {
          h = e
        }
        bc(y[b >> 2] + h | 0, 0, c - h | 0)
      }
      y[d] = c;
      h = 1
    }
  }while(0);
  return h
}
function Zc(b, c) {
  C[b + 4 >> 2] >>> 0 > c >>> 0 || xc(M.g | 0, 904);
  return y[b >> 2] + c | 0
}
function $c(b) {
  var c = b + 4 | 0, d = y[c + 4 >> 2];
  (d | 0) != 0 & d >>> 0 < 8193 || xc(M.N | 0, 2998);
  var e = b | 0;
  y[e >> 2] = d;
  var g = b + 20 | 0, h = C[g >> 2];
  if((h | 0) == 0) {
    d = Ic(180, 0);
    if((d | 0) == 0) {
      d = 0
    }else {
      if((d | 0) == 0) {
        d = 0
      }else {
        y[d + 164 >> 2] = 0;
        y[d + 168 >> 2] = 0;
        y[d + 172 >> 2] = 0;
        y[d + 176 >> 2] = 0
      }
    }
    g = y[g >> 2] = d;
    e = y[e >> 2]
  }else {
    g = h;
    e = d
  }
  var c = Zc(c, 0), b = C[b >> 2], j;
  if(b >>> 0 > 16) {
    d = b >>> 0 > 1;
    a:do {
      if(d) {
        for(var i = 0, h = b;;) {
          i = i + 1 | 0;
          if(h >>> 0 <= 3) {
            j = i;
            break a
          }
          h = h >>> 1
        }
      }else {
        j = 0
      }
    }while(0);
    j = (j | 0) == 32 ? 32 : (1 << j >>> 0 < b >>> 0 & 1) + j | 0;
    j = ((j + 1 | 0) >>> 0 < 11 ? j + 1 | 0 : 11) & 255
  }else {
    j = 0
  }
  return Kc(g, e, c, j)
}
function ad(b, c) {
  if((c | 0) == 0) {
    var d = 0
  }else {
    if(c >>> 0 > 16) {
      var d = bd(b, c - 16 | 0), e = bd(b, 16), d = d << 16 | e
    }else {
      d = bd(b, c)
    }
  }
  return d
}
function R(b, c) {
  var d, e, g, h;
  g = C[c + 20 >> 2] >> 2;
  e = (b + 20 | 0) >> 2;
  var j = C[e];
  if((j | 0) < 24) {
    d = (b + 4 | 0) >> 2;
    var i = C[d], f = C[b + 8 >> 2];
    h = i >>> 0 < f >>> 0;
    if((j | 0) < 16) {
      if(h) {
        h = i + 1 | 0;
        i = (z[i] & 255) << 8
      }else {
        h = i;
        i = 0
      }
      if(h >>> 0 < f >>> 0) {
        f = h + 1 | 0;
        h = z[h] & 255
      }else {
        f = h;
        h = 0
      }
      y[d] = f;
      y[e] = j + 16 | 0;
      d = b + 16 | 0;
      j = (h | i) << 16 - j | y[d >> 2]
    }else {
      if(h) {
        y[d] = i + 1 | 0;
        i = z[i] & 255
      }else {
        i = 0
      }
      y[e] = j + 8 | 0;
      d = b + 16 | 0;
      j = i << 24 - j | y[d >> 2]
    }
    y[d >> 2] = j
  }else {
    j = y[b + 16 >> 2]
  }
  d = b + 16 | 0;
  i = (j >>> 16) + 1 | 0;
  f = i >>> 0 > C[g + 4] >>> 0;
  do {
    if(f) {
      h = C[g + 5];
      var k = h - 1 | 0, o = i >>> 0 > C[((k << 2) + 28 >> 2) + g] >>> 0;
      a:do {
        if(o) {
          for(var m = h;;) {
            var t = m + 1 | 0;
            if(i >>> 0 <= C[((m << 2) + 28 >> 2) + g] >>> 0) {
              var s = t, w = m;
              break a
            }
            m = t
          }
        }else {
          s = h;
          w = k
        }
      }while(0);
      h = (j >>> ((32 - s | 0) >>> 0)) + y[((w << 2) + 96 >> 2) + g] | 0;
      if(h >>> 0 < C[c >> 2] >>> 0) {
        r = s;
        x = A[y[g + 44] + (h << 1) >> 1] & 65535;
        h = 22
      }else {
        xc(M.o | 0, 3267);
        var u = 0;
        h = 23
      }
    }else {
      r = C[y[g + 42] + (j >>> ((32 - y[g + 2] | 0) >>> 0) << 2) >> 2];
      (r | 0) == -1 && xc(M.R | 0, 3245);
      x = r & 65535;
      r = r >>> 16;
      h = c + 4 | 0;
      k = x;
      C[h + 4 >> 2] >>> 0 > k >>> 0 || xc(M.g | 0, 903);
      if((z[y[h >> 2] + k | 0] & 255 | 0) == (r | 0)) {
        var r = r, x = x
      }else {
        xc(M.S | 0, 3249)
      }
      h = 22
    }
  }while(0);
  if(h == 22) {
    y[d >> 2] = y[d >> 2] << r;
    y[e] = y[e] - r | 0;
    u = x
  }
  return u
}
R.X = 1;
function cd(b, c, d) {
  if((d | 0) == 0) {
    b = 0
  }else {
    y[b >> 2] = c;
    y[b + 4 >> 2] = c;
    y[b + 12 >> 2] = d;
    y[b + 8 >> 2] = c + d | 0;
    y[b + 16 >> 2] = 0;
    y[b + 20 >> 2] = 0;
    b = 1
  }
  return b
}
function bd(b, c) {
  var d;
  c >>> 0 < 33 || xc(M.P | 0, 3191);
  d = (b + 20 | 0) >> 2;
  var e = C[d], g = (e | 0) < (c | 0);
  a:do {
    if(g) {
      for(var h = b + 4 | 0, j = b + 8 | 0, i = b + 16 | 0, f = e;;) {
        var k = y[h >> 2];
        if((k | 0) == (y[j >> 2] | 0)) {
          k = 0
        }else {
          y[h >> 2] = k + 1 | 0;
          k = z[k] & 255
        }
        f = f + 8 | 0;
        y[d] = f;
        if((f | 0) >= 33) {
          xc(M.Q | 0, 3200);
          f = y[d]
        }
        k = k << 32 - f | y[i >> 2];
        y[i >> 2] = k;
        if((f | 0) >= (c | 0)) {
          var o = f, m = k;
          break a
        }
      }
    }else {
      o = e;
      m = y[b + 16 >> 2]
    }
  }while(0);
  y[b + 16 >> 2] = m << c;
  y[d] = o - c | 0;
  return m >>> ((32 - c | 0) >>> 0)
}
bd.X = 1;
function dd(b, c) {
  var d, e = q;
  q = q + 24;
  a:do {
    for(var g = 0, h = 8192;;) {
      h = h >>> 1;
      g = g + 1 | 0;
      if((h | 0) == 0) {
        d = g;
        break a
      }
    }
  }while(0);
  d = ad(b, d);
  g = (d | 0) == 0;
  do {
    if(g) {
      h = c;
      y[h >> 2] = 0;
      Xc(h + 4 | 0);
      var h = h + 20 | 0, j = y[h >> 2];
      if((j | 0) != 0) {
        if((j | 0) != 0) {
          Wc(j);
          Jc(j)
        }
        y[h >> 2] = 0
      }
      h = 1
    }else {
      h = c + 4 | 0;
      if(Yc(h, d)) {
        j = Zc(h, 0);
        bc(j, 0, d);
        j = ad(b, 5);
        if((j | 0) == 0 | j >>> 0 > 21) {
          h = 0
        }else {
          Uc(e);
          var i = e + 4 | 0, f = Yc(i, 21);
          a:do {
            if(f) {
              for(var k = 0;;) {
                var o = ad(b, 3), m = Zc(i, z[M.C + k | 0] & 255);
                v[m] = o & 255;
                k = k + 1 | 0;
                if((k | 0) == (j | 0)) {
                  break
                }
              }
              if($c(e)) {
                k = 0;
                b:for(;;) {
                  for(var m = k >>> 0 < d >>> 0, o = d - k | 0, t = (k | 0) == 0, s = k - 1 | 0;;) {
                    if(!m) {
                      if((k | 0) != (d | 0)) {
                        p = 0;
                        break a
                      }
                      p = $c(c);
                      break a
                    }
                    var w = R(b, e);
                    if(w >>> 0 < 17) {
                      o = Zc(h, k);
                      v[o] = w & 255;
                      k = k + 1 | 0;
                      continue b
                    }
                    if((w | 0) == 17) {
                      m = ad(b, 3) + 3 | 0;
                      if(m >>> 0 > o >>> 0) {
                        p = 0;
                        break a
                      }
                      k = m + k | 0;
                      continue b
                    }else {
                      if((w | 0) == 18) {
                        m = ad(b, 7) + 11 | 0;
                        if(m >>> 0 > o >>> 0) {
                          p = 0;
                          break a
                        }
                        k = m + k | 0;
                        continue b
                      }else {
                        if((w - 19 | 0) >>> 0 >= 2) {
                          xc(M.o | 0, 3141);
                          p = 0;
                          break a
                        }
                        w = (w | 0) == 19 ? ad(b, 2) + 3 | 0 : ad(b, 6) + 7 | 0;
                        if(t | w >>> 0 > o >>> 0) {
                          p = 0;
                          break a
                        }
                        var u = Zc(h, s), u = z[u];
                        if(u << 24 >> 24 == 0) {
                          p = 0;
                          break a
                        }
                        var r = w + k | 0;
                        if(k >>> 0 < r >>> 0) {
                          var x = k;
                          break
                        }
                      }
                    }
                  }
                  for(;;) {
                    o = Zc(h, x);
                    m = x + 1 | 0;
                    v[o] = u;
                    if((m | 0) == (r | 0)) {
                      k = r;
                      continue b
                    }
                    x = m
                  }
                }
              }else {
                var p = 0
              }
            }else {
              p = 0
            }
          }while(0);
          Vc(e);
          h = p
        }
      }else {
        h = 0
      }
    }
  }while(0);
  q = e;
  return h
}
dd.X = 1;
function ed(b, c, d, e, g, h, j) {
  var i = b + 88 | 0, f = C[i >> 2], k = ((Nc(f + 12 | 0) >>> (j >>> 0) >>> 0 > 1 ? Nc(f + 12 | 0) >>> (j >>> 0) : 1) + 3 | 0) >>> 2, j = ((Nc(f + 14 | 0) >>> (j >>> 0) >>> 0 > 1 ? Nc(f + 14 | 0) >>> (j >>> 0) : 1) + 3 | 0) >>> 2, f = Pc(f + 18 | 0), f = ((f | 0) == 0 ? 8 : (f | 0) == 9 ? 8 : 16) * k | 0;
  if((h | 0) == 0) {
    var o = f, h = 5
  }else {
    if(f >>> 0 <= h >>> 0 & (h & 3 | 0) == 0) {
      o = h;
      h = 5
    }else {
      var m = 0, h = 12
    }
  }
  if(h == 5) {
    if((o * j | 0) >>> 0 > g >>> 0) {
      m = 0
    }else {
      g = (k + 1 | 0) >>> 1;
      m = (j + 1 | 0) >>> 1;
      if(cd(b + 92 | 0, c, d)) {
        c = Pc(y[i >> 2] + 18 | 0);
        if((c | 0) == 0) {
          fd(b, e, 0, o, k, j, g, m);
          m = 1
        }else {
          if((c | 0) == 2 || (c | 0) == 3 || (c | 0) == 5 || (c | 0) == 6 || (c | 0) == 4) {
            gd(b, e, 0, o, k, j, g, m);
            m = 1
          }else {
            if((c | 0) == 9) {
              hd(b, e, 0, o, k, j, g, m);
              m = 1
            }else {
              if((c | 0) == 7 || (c | 0) == 8) {
                id(b, e, 0, o, k, j, g, m);
                m = 1
              }else {
                m = 0
              }
            }
          }
        }
      }else {
        m = 0
      }
    }
  }
  return m
}
ed.X = 1;
Module._crn_get_width = function(b, c) {
  var d = q;
  q = q + 40;
  jd(d);
  Tc(b, c, d);
  var e = y[d + 4 >> 2];
  q = d;
  return e
};
Module._crn_get_height = function(b, c) {
  var d = q;
  q = q + 40;
  jd(d);
  Tc(b, c, d);
  var e = y[d + 8 >> 2];
  q = d;
  return e
};
Module._crn_get_levels = function(b, c) {
  var d = q;
  q = q + 40;
  jd(d);
  Tc(b, c, d);
  var e = y[d + 12 >> 2];
  q = d;
  return e
};
Module._crn_get_dxt_format = function(b, c) {
  var d = q;
  q = q + 40;
  jd(d);
  Tc(b, c, d);
  var e = y[(d + 32 | 0) >> 2];
  q = d;
  return e
};
Module._crn_get_uncompressed_size = function(b, c, d) {
  var e = q;
  q = q + 40;
  jd(e);
  Tc(b, c, e);
  b = ((C[e + 4 >> 2] >>> (d >>> 0)) + 3 | 0) >>> 2;
  d = ((C[e + 8 >> 2] >>> (d >>> 0)) + 3 | 0) >>> 2;
  c = e + 32 | 0;
  c = Rc(y[c >> 2], y[c + 4 >> 2]) << 1 & 536870910;
  q = e;
  return b * c * d | 0
};
Module._crn_decompress = function(b, c, d, e, g) {
  var h = q;
  q = q + 44;
  var j = h + 40;
  jd(h);
  Tc(b, c, h);
  var i = ((C[h + 4 >> 2] >>> (g >>> 0)) + 3 | 0) >>> 2, f = h + 32 | 0, f = Rc(y[f >> 2], y[f + 4 >> 2]) << 1 & 536870910, i = i * f | 0, k;
  if((b | 0) == 0 | c >>> 0 < 62) {
    k = 0
  }else {
    f = Ic(300, 0);
    if((f | 0) == 0) {
      f = 0
    }else {
      if((f | 0) == 0) {
        f = 0
      }else {
        y[f >> 2] = 519686845;
        y[f + 4 >> 2] = 0;
        y[f + 8 >> 2] = 0;
        y[f + 88 >> 2] = 0;
        var o = (f + 92 | 0) >> 2;
        y[o] = 0;
        y[o + 1] = 0;
        y[o + 2] = 0;
        y[o + 3] = 0;
        y[o + 4] = 0;
        y[o + 5] = 0;
        Uc(f + 116 | 0);
        Uc(f + 140 | 0);
        Uc(f + 164 | 0);
        Uc(f + 188 | 0);
        Uc(f + 212 | 0);
        kd(f + 236 | 0);
        kd(f + 252 | 0);
        ld(f + 268 | 0);
        ld(f + 284 | 0)
      }
    }
    if((f | 0) == 0) {
      k = 0
    }else {
      o = Sc(b, c);
      y[f + 88 >> 2] = o;
      if((o | 0) == 0) {
        k = 0
      }else {
        y[f + 4 >> 2] = b;
        y[f + 8 >> 2] = c;
        var c = f + 92 | 0, o = y[f + 4 >> 2], b = (f + 88 | 0) >> 2, m = y[b], o = cd(c, o + Qc(m + 67 | 0) | 0, Nc(m + 65 | 0));
        do {
          if(o) {
            if(dd(c, f + 116 | 0)) {
              m = y[b];
              if((Nc(m + 39 | 0) | 0) == 0) {
                if((Nc(m + 55 | 0) | 0) == 0) {
                  m = 0;
                  break
                }
              }else {
                if(!dd(c, f + 140 | 0)) {
                  m = 0;
                  break
                }
                if(!dd(c, f + 188 | 0)) {
                  m = 0;
                  break
                }
                m = y[b]
              }
              if((Nc(m + 55 | 0) | 0) != 0) {
                if(!dd(c, f + 164 | 0)) {
                  m = 0;
                  break
                }
                if(!dd(c, f + 212 | 0)) {
                  m = 0;
                  break
                }
              }
              m = 1
            }else {
              m = 0
            }
          }else {
            m = 0
          }
        }while(0);
        if(m) {
          b = f + 88 | 0;
          c = y[b >> 2];
          if((Nc(c + 39 | 0) | 0) == 0) {
            k = c;
            b = 5
          }else {
            if(md(f)) {
              if(nd(f)) {
                k = y[b >> 2];
                b = 5
              }else {
                t = 0;
                b = 9
              }
            }else {
              var t = 0, b = 9
            }
          }
          do {
            if(b == 5) {
              if((Nc(k + 55 | 0) | 0) != 0) {
                if(!od(f)) {
                  t = 0;
                  break
                }
                if(!pd(f)) {
                  t = 0;
                  break
                }
              }
              t = 1
            }
          }while(0);
          k = t
        }else {
          k = 0
        }
      }
      if(k) {
        k = f
      }else {
        if((f | 0) != 0) {
          qd(f);
          Jc(f)
        }
        k = 0
      }
    }
  }
  j = j | 0;
  y[j >> 2] = d;
  if(!((k | 0) == 0 | (j | 0) == 0 | e >>> 0 < 8 | g >>> 0 > 15) && (y[k >> 2] | 0) == 519686845) {
    t = C[k + 88 >> 2];
    d = Oc((g << 2) + t + 70 | 0);
    f = y[k + 8 >> 2];
    b = g + 1 | 0;
    t = b >>> 0 < Pc(t + 16 | 0) >>> 0 ? Oc((b << 2) + t + 70 | 0) : f;
    t >>> 0 > d >>> 0 || xc(M.U | 0, 3705);
    ed(k, y[k + 4 >> 2] + d | 0, t - d | 0, j, e, i, g)
  }
  if((k | 0) != 0 && (y[k >> 2] | 0) == 519686845 && (k | 0) != 0) {
    qd(k);
    Jc(k)
  }
  q = h
};
function ld(b) {
  y[b >> 2] = 0;
  y[b + 4 >> 2] = 0;
  y[b + 8 >> 2] = 0;
  v[b + 12 | 0] = 0
}
function kd(b) {
  y[b >> 2] = 0;
  y[b + 4 >> 2] = 0;
  y[b + 8 >> 2] = 0;
  v[b + 12 | 0] = 0
}
function jd(b) {
  y[b >> 2] = 40
}
function rd(b) {
  var c = b | 0, d = y[c >> 2];
  if((d | 0) != 0) {
    var e = b + 4 | 0;
    Jc(d);
    y[c >> 2] = 0;
    y[e >> 2] = 0;
    y[b + 8 >> 2] = 0
  }
  v[b + 12 | 0] = 0
}
function sd(b) {
  var c = b | 0, d = y[c >> 2];
  if((d | 0) != 0) {
    var e = b + 4 | 0;
    Jc(d);
    y[c >> 2] = 0;
    y[e >> 2] = 0;
    y[b + 8 >> 2] = 0
  }
  v[b + 12 | 0] = 0
}
function Wc(b) {
  var c = y[b + 168 >> 2];
  (c | 0) != 0 && Mc(c);
  b = y[b + 176 >> 2];
  (b | 0) != 0 && Lc(b)
}
function fd(b, c, d, e, g, h, j, i) {
  var f, k, o, m, t, s = q;
  q = q + 24;
  t = s >> 2;
  var w = s + 4;
  m = w >> 2;
  var d = s + 8 >> 2, u = b + 236 | 0, r = y[u + 4 >> 2], x = b + 252 | 0, p = y[x + 4 >> 2];
  y[t] = 0;
  y[m] = 0;
  var B = Pc(y[b + 88 >> 2] + 17 | 0), I = e >>> 2, S = (B | 0) == 0;
  a:do {
    if(!S) {
      for(var Q = (i | 0) == 0, H = i - 1 | 0, J = (h & 1 | 0) != 0, K = e << 1, E = b + 92 | 0, da = b + 116 | 0, N = b + 188 | 0, ka = I + 1 | 0, ba = I + 2 | 0, ra = I + 3 | 0, ia = j - 1 | 0, fa = b + 140 | 0, Ga = ia << 4, ta = (g & 1 | 0) != 0, la = 0, Aa = 1;;) {
        b:do {
          if(Q) {
            var xa = Aa
          }else {
            for(var Y = y[c + (la << 2) >> 2], ma = 0, ga = Aa;;) {
              if((ma & 1 | 0) == 0) {
                var ua = Y, Ba = 16, Ca = 1, va = j, Z = 0
              }else {
                ua = Y + Ga | 0;
                Ba = -16;
                va = Ca = -1;
                Z = ia
              }
              var sa = (ma | 0) == (H | 0), T = sa & J, ea = (Z | 0) == (va | 0);
              c:do {
                if(ea) {
                  var W = ga
                }else {
                  var ya = sa & J ^ 1, L = ga, O = ua;
                  o = O >> 2;
                  for(var qa = Z;;) {
                    var na = (L | 0) == 1 ? R(E, da) | 512 : L, L = na & 7, na = na >>> 3;
                    k = z[M.f + L | 0] & 255;
                    for(var U = 0, P = y[t];;) {
                      var F = R(E, fa);
                      y[t] = P + F | 0;
                      td(s, r);
                      P = C[t];
                      F = ud(u, P);
                      y[(U << 2 >> 2) + d] = y[F >> 2];
                      U = U + 1 | 0;
                      if(U >>> 0 >= k >>> 0) {
                        break
                      }
                    }
                    U = (qa | 0) == (ia | 0) & ta;
                    k = O >> 2;
                    P = T | U;
                    d:do {
                      if(P) {
                        for(F = 0;;) {
                          var oa = F * e | 0;
                          f = oa >> 2;
                          var wa = O + oa | 0, ca = (F | 0) == 0 | ya, V = F << 1, ja = R(E, N);
                          y[m] = y[m] + ja | 0;
                          td(w, p);
                          if(U) {
                            if(ca) {
                              y[wa >> 2] = y[((z[(L << 2) + vd + V | 0] & 255) << 2 >> 2) + d];
                              V = ud(x, y[m]);
                              y[f + (o + 1)] = y[V >> 2]
                            }
                            f = R(E, N);
                            y[m] = y[m] + f | 0;
                            td(w, p)
                          }else {
                            if(ca) {
                              y[wa >> 2] = y[((z[(L << 2) + vd + V | 0] & 255) << 2 >> 2) + d];
                              wa = ud(x, y[m]);
                              y[f + (o + 1)] = y[wa >> 2];
                              oa = oa + (O + 8) | 0;
                              wa = R(E, N);
                              y[m] = y[m] + wa | 0;
                              td(w, p);
                              y[oa >> 2] = y[((z[(L << 2) + vd + (V | 1) | 0] & 255) << 2 >> 2) + d];
                              V = ud(x, y[m]);
                              y[f + (o + 3)] = y[V >> 2]
                            }else {
                              f = R(E, N);
                              y[m] = y[m] + f | 0;
                              td(w, p)
                            }
                          }
                          F = F + 1 | 0;
                          if((F | 0) == 2) {
                            break d
                          }
                        }
                      }else {
                        y[k] = y[((z[(L << 2) + vd | 0] & 255) << 2 >> 2) + d];
                        F = R(E, N);
                        y[m] = y[m] + F | 0;
                        td(w, p);
                        F = ud(x, y[m]);
                        y[o + 1] = y[F >> 2];
                        y[o + 2] = y[((z[(L << 2) + vd + 1 | 0] & 255) << 2 >> 2) + d];
                        F = R(E, N);
                        y[m] = y[m] + F | 0;
                        td(w, p);
                        F = ud(x, y[m]);
                        y[o + 3] = y[F >> 2];
                        y[(I << 2 >> 2) + k] = y[((z[(L << 2) + vd + 2 | 0] & 255) << 2 >> 2) + d];
                        F = R(E, N);
                        y[m] = y[m] + F | 0;
                        td(w, p);
                        F = ud(x, y[m]);
                        y[(ka << 2 >> 2) + k] = y[F >> 2];
                        y[(ba << 2 >> 2) + k] = y[((z[(L << 2) + vd + 3 | 0] & 255) << 2 >> 2) + d];
                        F = R(E, N);
                        y[m] = y[m] + F | 0;
                        td(w, p);
                        F = ud(x, y[m]);
                        y[(ra << 2 >> 2) + k] = y[F >> 2]
                      }
                    }while(0);
                    qa = qa + Ca | 0;
                    if((qa | 0) == (va | 0)) {
                      W = na;
                      break c
                    }
                    L = na;
                    O = O + Ba | 0;
                    o = O >> 2
                  }
                }
              }while(0);
              o = ma + 1 | 0;
              if((o | 0) == (i | 0)) {
                xa = W;
                break b
              }
              Y = Y + K | 0;
              ma = o;
              ga = W
            }
          }
        }while(0);
        la = la + 1 | 0;
        if((la | 0) == (B | 0)) {
          break a
        }
        Aa = xa
      }
    }
  }while(0);
  q = s;
  return 1
}
fd.X = 1;
function qd(b) {
  y[b >> 2] = 0;
  sd(b + 284 | 0);
  sd(b + 268 | 0);
  rd(b + 252 | 0);
  rd(b + 236 | 0);
  var c = b + 188 | 0;
  Vc(b + 212 | 0);
  Vc(c);
  c = b + 140 | 0;
  Vc(b + 164 | 0);
  Vc(c);
  Vc(b + 116 | 0)
}
qd.X = 1;
function td(b, c) {
  var d = y[b >> 2], e = d - c | 0, g = e >> 31;
  y[b >> 2] = g & d | e & (g ^ -1)
}
function gd(b, c, d, e, g, h, j, i) {
  var f, k, o, m, t, s, w, u, r = q;
  q = q + 48;
  u = r >> 2;
  var x = r + 4;
  w = x >> 2;
  var p = r + 8;
  s = p >> 2;
  var B = r + 12;
  t = B >> 2;
  m = r + 16 >> 2;
  var d = r + 32 >> 2, I = b + 236 | 0, S = y[I + 4 >> 2], Q = b + 252 | 0, H = y[Q + 4 >> 2], J = b + 268 | 0, K = y[J + 4 >> 2], E = y[b + 88 >> 2], da = Nc(E + 63 | 0);
  y[u] = 0;
  y[w] = 0;
  y[s] = 0;
  y[t] = 0;
  var E = Pc(E + 17 | 0), N = (E | 0) == 0;
  a:do {
    if(!N) {
      for(var ka = (i | 0) == 0, ba = i - 1 | 0, ra = (h & 1 | 0) == 0, ia = e << 1, fa = b + 92 | 0, Ga = b + 116 | 0, ta = b + 212 | 0, la = b + 188 | 0, Aa = b + 284 | 0, xa = b + 140 | 0, Y = b + 164 | 0, ma = j - 1 | 0, ga = ma << 5, ua = (g & 1 | 0) != 0, Ba = 0, Ca = 1;;) {
        b:do {
          if(ka) {
            var va = Ca
          }else {
            for(var Z = y[c + (Ba << 2) >> 2], sa = 0, T = Ca;;) {
              if((sa & 1 | 0) == 0) {
                var ea = Z, W = 32, ya = 1, L = j, O = 0
              }else {
                ea = Z + ga | 0;
                W = -32;
                L = ya = -1;
                O = ma
              }
              var qa = ra | (sa | 0) != (ba | 0), na = (O | 0) == (L | 0);
              c:do {
                if(na) {
                  var U = T
                }else {
                  for(var P = T, F = ea, oa = O;;) {
                    var wa = (P | 0) == 1 ? R(fa, Ga) | 512 : P, P = wa & 7, wa = wa >>> 3;
                    o = z[M.f + P | 0] & 255;
                    for(var ca = 0, V = y[s];;) {
                      var ja = R(fa, Y);
                      y[s] = V + ja | 0;
                      td(p, K);
                      V = C[s];
                      ja = wd(J, V);
                      y[(ca << 2 >> 2) + d] = A[ja >> 1] & 65535;
                      ca = ca + 1 | 0;
                      if(ca >>> 0 >= o >>> 0) {
                        break
                      }
                    }
                    ca = 0;
                    for(V = y[u];;) {
                      ja = R(fa, xa);
                      y[u] = V + ja | 0;
                      td(r, S);
                      V = C[u];
                      ja = ud(I, V);
                      y[(ca << 2 >> 2) + m] = y[ja >> 2];
                      ca = ca + 1 | 0;
                      if(ca >>> 0 >= o >>> 0) {
                        break
                      }
                    }
                    ca = (oa | 0) == (ma | 0) & ua;
                    V = F;
                    o = V >> 2;
                    for(ja = 0;;) {
                      var Oa = (ja | 0) == 0 | qa;
                      f = ja << 1;
                      k = R(fa, ta);
                      y[t] = y[t] + k | 0;
                      td(B, da);
                      k = R(fa, la);
                      y[w] = y[w] + k | 0;
                      td(x, H);
                      if(Oa) {
                        var hb = V, Ha = z[(P << 2) + vd + f | 0] & 255;
                        k = wd(Aa, y[t] * 3 | 0) >> 1;
                        y[hb >> 2] = (A[k] & 65535) << 16 | y[(Ha << 2 >> 2) + d];
                        y[o + 1] = (A[k + 2] & 65535) << 16 | A[k + 1] & 65535;
                        y[o + 2] = y[(Ha << 2 >> 2) + m];
                        k = ud(Q, y[w]);
                        y[o + 3] = y[k >> 2]
                      }
                      k = R(fa, ta);
                      y[t] = y[t] + k | 0;
                      td(B, da);
                      k = R(fa, la);
                      y[w] = y[w] + k | 0;
                      td(x, H);
                      if(!(ca | Oa ^ 1)) {
                        Oa = V + 16 | 0;
                        k = z[(P << 2) + vd + (f | 1) | 0] & 255;
                        f = wd(Aa, y[t] * 3 | 0) >> 1;
                        y[Oa >> 2] = (A[f] & 65535) << 16 | y[(k << 2 >> 2) + d];
                        y[o + 5] = (A[f + 2] & 65535) << 16 | A[f + 1] & 65535;
                        y[o + 6] = y[(k << 2 >> 2) + m];
                        f = ud(Q, y[w]);
                        y[o + 7] = y[f >> 2]
                      }
                      ja = ja + 1 | 0;
                      if((ja | 0) == 2) {
                        break
                      }
                      V = V + e | 0;
                      o = V >> 2
                    }
                    oa = oa + ya | 0;
                    if((oa | 0) == (L | 0)) {
                      U = wa;
                      break c
                    }
                    P = wa;
                    F = F + W | 0
                  }
                }
              }while(0);
              sa = sa + 1 | 0;
              if((sa | 0) == (i | 0)) {
                va = U;
                break b
              }
              Z = Z + ia | 0;
              T = U
            }
          }
        }while(0);
        Ba = Ba + 1 | 0;
        if((Ba | 0) == (E | 0)) {
          break a
        }
        Ca = va
      }
    }
  }while(0);
  q = r;
  return 1
}
gd.X = 1;
function hd(b, c, d, e, g, h, j, i) {
  var f, k, o, m, t, s = q;
  q = q + 24;
  t = s >> 2;
  var w = s + 4;
  m = w >> 2;
  var d = s + 8 >> 2, u = b + 268 | 0, r = y[u + 4 >> 2], x = y[b + 88 >> 2], p = Nc(x + 63 | 0);
  y[t] = 0;
  y[m] = 0;
  var x = Pc(x + 17 | 0), B = (x | 0) == 0;
  a:do {
    if(!B) {
      for(var I = (i | 0) == 0, S = i - 1 | 0, Q = (h & 1 | 0) == 0, H = e << 1, J = b + 92 | 0, K = b + 116 | 0, E = (g & 1 | 0) == 0, da = b + 164 | 0, N = b + 212 | 0, ka = b + 284 | 0, ba = j - 1 | 0, ra = ba << 4, ia = 0, fa = 1;;) {
        b:do {
          if(I) {
            var Ga = fa
          }else {
            for(var ta = y[c + (ia << 2) >> 2], la = 0, Aa = fa;;) {
              if((la & 1 | 0) == 0) {
                var xa = ta, Y = 16, ma = 1, ga = j, ua = 0
              }else {
                xa = ta + ra | 0;
                Y = -16;
                ga = ma = -1;
                ua = ba
              }
              var Ba = Q | (la | 0) != (S | 0), Ca = (ua | 0) == (ga | 0);
              c:do {
                if(Ca) {
                  var va = Aa
                }else {
                  for(var Z = Aa, sa = xa, T = ua;;) {
                    var ea = (Z | 0) == 1 ? R(J, K) | 512 : Z, Z = ea & 7, ea = ea >>> 3, W = z[M.f + Z | 0] & 255, ya = E | (T | 0) != (ba | 0);
                    f = 0;
                    for(k = y[t];;) {
                      var L = R(J, da);
                      y[t] = k + L | 0;
                      td(s, r);
                      k = C[t];
                      L = wd(u, k);
                      y[(f << 2 >> 2) + d] = A[L >> 1] & 65535;
                      f = f + 1 | 0;
                      if(f >>> 0 >= W >>> 0) {
                        var O = sa;
                        o = O >> 2;
                        var qa = 0;
                        break
                      }
                    }
                    for(;;) {
                      W = O;
                      k = (qa | 0) == 0 | Ba;
                      f = qa << 1;
                      L = R(J, N);
                      y[m] = y[m] + L | 0;
                      td(w, p);
                      if(ya) {
                        if(k) {
                          L = z[(Z << 2) + vd + f | 0] & 255;
                          k = wd(ka, y[m] * 3 | 0) >> 1;
                          y[W >> 2] = (A[k] & 65535) << 16 | y[(L << 2 >> 2) + d];
                          y[o + 1] = (A[k + 2] & 65535) << 16 | A[k + 1] & 65535;
                          W = O + 8 | 0;
                          k = R(J, N);
                          y[m] = y[m] + k | 0;
                          td(w, p);
                          k = z[(Z << 2) + vd + (f | 1) | 0] & 255;
                          f = wd(ka, y[m] * 3 | 0) >> 1;
                          y[W >> 2] = (A[f] & 65535) << 16 | y[(k << 2 >> 2) + d];
                          y[o + 3] = (A[f + 2] & 65535) << 16 | A[f + 1] & 65535
                        }else {
                          W = R(J, N);
                          y[m] = y[m] + W | 0;
                          td(w, p)
                        }
                      }else {
                        if(k) {
                          k = z[(Z << 2) + vd + f | 0] & 255;
                          f = wd(ka, y[m] * 3 | 0) >> 1;
                          y[W >> 2] = (A[f] & 65535) << 16 | y[(k << 2 >> 2) + d];
                          y[o + 1] = (A[f + 2] & 65535) << 16 | A[f + 1] & 65535
                        }
                        W = R(J, N);
                        y[m] = y[m] + W | 0;
                        td(w, p)
                      }
                      W = qa + 1 | 0;
                      if((W | 0) == 2) {
                        break
                      }
                      O = O + e | 0;
                      o = O >> 2;
                      qa = W
                    }
                    T = T + ma | 0;
                    if((T | 0) == (ga | 0)) {
                      va = ea;
                      break c
                    }
                    Z = ea;
                    sa = sa + Y | 0
                  }
                }
              }while(0);
              la = la + 1 | 0;
              if((la | 0) == (i | 0)) {
                Ga = va;
                break b
              }
              ta = ta + H | 0;
              Aa = va
            }
          }
        }while(0);
        ia = ia + 1 | 0;
        if((ia | 0) == (x | 0)) {
          break a
        }
        fa = Ga
      }
    }
  }while(0);
  q = s;
  return 1
}
hd.X = 1;
function id(b, c, d, e, g, h, j, i) {
  var f, k, o, m, t, s, w, u, r, x = q;
  q = q + 48;
  r = x >> 2;
  var p = x + 4;
  u = p >> 2;
  var B = x + 8;
  w = B >> 2;
  var I = x + 12;
  s = I >> 2;
  t = x + 16 >> 2;
  var d = x + 32 >> 2, S = b + 268 | 0, Q = y[S + 4 >> 2], H = y[b + 88 >> 2], J = Nc(H + 63 | 0);
  y[r] = 0;
  y[u] = 0;
  y[w] = 0;
  y[s] = 0;
  var H = Pc(H + 17 | 0), K = (H | 0) == 0;
  a:do {
    if(!K) {
      for(var E = (i | 0) == 0, da = i - 1 | 0, N = (h & 1 | 0) == 0, ka = e << 1, ba = b + 92 | 0, ra = b + 116 | 0, ia = b + 212 | 0, fa = b + 284 | 0, Ga = b + 164 | 0, ta = j - 1 | 0, la = ta << 5, Aa = (g & 1 | 0) != 0, xa = 0, Y = 1;;) {
        b:do {
          if(E) {
            var ma = Y
          }else {
            for(var ga = y[c + (xa << 2) >> 2], ua = 0, Ba = Y;;) {
              if((ua & 1 | 0) == 0) {
                var Ca = ga, va = 32, Z = 1, sa = j, T = 0
              }else {
                Ca = ga + la | 0;
                va = -32;
                sa = Z = -1;
                T = ta
              }
              var ea = N | (ua | 0) != (da | 0), W = (T | 0) == (sa | 0);
              c:do {
                if(W) {
                  var ya = Ba
                }else {
                  for(var L = Ba, O = Ca, qa = T;;) {
                    var na = (L | 0) == 1 ? R(ba, ra) | 512 : L, L = na & 7, na = na >>> 3;
                    m = z[M.f + L | 0] & 255;
                    for(var U = 0, P = y[r];;) {
                      var F = R(ba, Ga);
                      y[r] = P + F | 0;
                      td(x, Q);
                      P = C[r];
                      F = wd(S, P);
                      y[(U << 2 >> 2) + t] = A[F >> 1] & 65535;
                      U = U + 1 | 0;
                      if(U >>> 0 >= m >>> 0) {
                        break
                      }
                    }
                    U = 0;
                    for(P = y[w];;) {
                      F = R(ba, Ga);
                      y[w] = P + F | 0;
                      td(B, Q);
                      P = C[w];
                      F = wd(S, P);
                      y[(U << 2 >> 2) + d] = A[F >> 1] & 65535;
                      U = U + 1 | 0;
                      if(U >>> 0 >= m >>> 0) {
                        break
                      }
                    }
                    U = (qa | 0) == (ta | 0) & Aa;
                    P = O;
                    m = P >> 2;
                    for(F = 0;;) {
                      var oa = (F | 0) == 0 | ea;
                      f = F << 1;
                      k = R(ba, ia);
                      y[u] = y[u] + k | 0;
                      td(p, J);
                      k = R(ba, ia);
                      y[s] = y[s] + k | 0;
                      td(I, J);
                      if(oa) {
                        var wa = P, ca = z[(L << 2) + vd + f | 0] & 255;
                        o = wd(fa, y[u] * 3 | 0) >> 1;
                        k = wd(fa, y[s] * 3 | 0) >> 1;
                        y[wa >> 2] = (A[o] & 65535) << 16 | y[(ca << 2 >> 2) + t];
                        y[m + 1] = (A[o + 2] & 65535) << 16 | A[o + 1] & 65535;
                        y[m + 2] = (A[k] & 65535) << 16 | y[(ca << 2 >> 2) + d];
                        y[m + 3] = (A[k + 2] & 65535) << 16 | A[k + 1] & 65535
                      }
                      k = R(ba, ia);
                      y[u] = y[u] + k | 0;
                      td(p, J);
                      k = R(ba, ia);
                      y[s] = y[s] + k | 0;
                      td(I, J);
                      if(!(U | oa ^ 1)) {
                        oa = P + 16 | 0;
                        o = z[(L << 2) + vd + (f | 1) | 0] & 255;
                        k = wd(fa, y[u] * 3 | 0) >> 1;
                        f = wd(fa, y[s] * 3 | 0) >> 1;
                        y[oa >> 2] = (A[k] & 65535) << 16 | y[(o << 2 >> 2) + t];
                        y[m + 5] = (A[k + 2] & 65535) << 16 | A[k + 1] & 65535;
                        y[m + 6] = (A[f] & 65535) << 16 | y[(o << 2 >> 2) + d];
                        y[m + 7] = (A[f + 2] & 65535) << 16 | A[f + 1] & 65535
                      }
                      F = F + 1 | 0;
                      if((F | 0) == 2) {
                        break
                      }
                      P = P + e | 0;
                      m = P >> 2
                    }
                    qa = qa + Z | 0;
                    if((qa | 0) == (sa | 0)) {
                      ya = na;
                      break c
                    }
                    L = na;
                    O = O + va | 0
                  }
                }
              }while(0);
              ua = ua + 1 | 0;
              if((ua | 0) == (i | 0)) {
                ma = ya;
                break b
              }
              ga = ga + ka | 0;
              Ba = ya
            }
          }
        }while(0);
        xa = xa + 1 | 0;
        if((xa | 0) == (H | 0)) {
          break a
        }
        Y = ma
      }
    }
  }while(0);
  q = x;
  return 1
}
id.X = 1;
function wd(b, c) {
  C[b + 4 >> 2] >>> 0 > c >>> 0 || xc(M.g | 0, 904);
  return(c << 1) + y[b >> 2] | 0
}
function ud(b, c) {
  C[b + 4 >> 2] >>> 0 > c >>> 0 || xc(M.g | 0, 904);
  return(c << 2) + y[b >> 2] | 0
}
function xd(b, c) {
  var d;
  d = (b + 4 | 0) >> 2;
  var e = C[d], g = (e | 0) == (c | 0);
  do {
    if(g) {
      var h = 1
    }else {
      if(e >>> 0 <= c >>> 0) {
        if(C[b + 8 >> 2] >>> 0 < c >>> 0) {
          h = b;
          if(Fc(h, c, (e + 1 | 0) == (c | 0), 2, 0)) {
            h = 1
          }else {
            v[h + 12 | 0] = 1;
            h = 0
          }
          if(!h) {
            h = 0;
            break
          }
          h = y[d]
        }else {
          h = e
        }
        bc((h << 1) + y[b >> 2] | 0, 0, (c - h | 0) << 1)
      }
      y[d] = c;
      h = 1
    }
  }while(0);
  return h
}
function yd(b, c) {
  var d;
  d = (b + 4 | 0) >> 2;
  var e = C[d], g = (e | 0) == (c | 0);
  do {
    if(g) {
      var h = 1
    }else {
      if(e >>> 0 <= c >>> 0) {
        if(C[b + 8 >> 2] >>> 0 < c >>> 0) {
          h = b;
          if(Fc(h, c, (e + 1 | 0) == (c | 0), 4, 0)) {
            h = 1
          }else {
            v[h + 12 | 0] = 1;
            h = 0
          }
          if(!h) {
            h = 0;
            break
          }
          h = y[d]
        }else {
          h = e
        }
        bc((h << 2) + y[b >> 2] | 0, 0, (c - h | 0) << 2)
      }
      y[d] = c;
      h = 1
    }
  }while(0);
  return h
}
function md(b) {
  var c = q;
  q = q + 48;
  var d, e = b + 88 | 0, g = Nc(y[e >> 2] + 39 | 0), h = b + 236 | 0, j = yd(h, g);
  do {
    if(j) {
      var i = b + 92 | 0, f = y[e >> 2];
      if(cd(i, y[b + 4 >> 2] + Qc(f + 33 | 0) | 0, Qc(f + 36 | 0))) {
        f = c | 0;
        Uc(f);
        var k = c + 24 | 0;
        Uc(k);
        for(var o = 0;;) {
          if(o >>> 0 >= 2) {
            d = 9;
            break
          }
          if(!dd(i, c + o * 24 | 0)) {
            var m = 0;
            d = 11;
            break
          }
          o = o + 1 | 0
        }
        a:do {
          if(d == 9) {
            var t = ud(h, 0);
            if((g | 0) == 0) {
              m = 1
            }else {
              for(var s = o = 0, w = 0, u = 0, r = 0, x = 0, p = 0;;) {
                var x = R(i, f) + x & 31, r = R(i, k) + r & 63, u = R(i, f) + u & 31, B = R(i, f) + w | 0, w = B & 31, s = R(i, k) + s & 63, o = R(i, f) + o & 31;
                y[t >> 2] = r << 5 | x << 11 | u | B << 27 | s << 21 | o << 16;
                p = p + 1 | 0;
                if((p | 0) == (g | 0)) {
                  m = 1;
                  break a
                }
                t = t + 4 | 0
              }
            }
          }
        }while(0);
        Vc(k);
        Vc(f);
        i = m
      }else {
        i = 0
      }
    }else {
      i = 0
    }
  }while(0);
  q = c;
  return i
}
md.X = 1;
function nd(b) {
  var c = q;
  q = q + 480;
  var d = c + 24, e = c + 220, g = c + 416, h = y[b + 88 >> 2], j = Nc(h + 47 | 0), i = b + 92 | 0;
  if(cd(i, y[b + 4 >> 2] + Qc(h + 41 | 0) | 0, Qc(h + 44 | 0))) {
    Uc(c);
    h = dd(i, c);
    a:do {
      if(h) {
        for(var f = -3, k = -3, o = 0;;) {
          y[d + (o << 2) >> 2] = f;
          y[e + (o << 2) >> 2] = k;
          var f = f + 1 | 0, m = (f | 0) > 3, k = (m & 1) + k | 0, o = o + 1 | 0;
          if((o | 0) == 49) {
            break
          }
          f = m ? -3 : f
        }
        bc(g, 0, 64);
        k = b + 252 | 0;
        if(yd(k, j)) {
          var t = ud(k, 0);
          if((j | 0) == 0) {
            ba = 1
          }else {
            for(var k = g | 0, o = g + 4 | 0, f = g + 8 | 0, m = g + 12 | 0, s = g + 16 | 0, w = g + 20 | 0, u = g + 24 | 0, r = g + 28 | 0, x = g + 32 | 0, p = g + 36 | 0, B = g + 40 | 0, I = g + 44 | 0, S = g + 48 | 0, Q = g + 52 | 0, H = g + 56 | 0, J = g + 60 | 0, K = 0;;) {
              for(var E = 0;;) {
                var da = R(i, c), N = E << 1, ka = (N << 2) + g | 0;
                y[ka >> 2] = y[ka >> 2] + y[d + (da << 2) >> 2] & 3;
                N = ((N | 1) << 2) + g | 0;
                y[N >> 2] = y[N >> 2] + y[e + (da << 2) >> 2] & 3;
                E = E + 1 | 0;
                if((E | 0) == 8) {
                  break
                }
              }
              y[t >> 2] = (z[M.b + y[o >> 2] | 0] & 255) << 2 | z[M.b + y[k >> 2] | 0] & 255 | (z[M.b + y[f >> 2] | 0] & 255) << 4 | (z[M.b + y[m >> 2] | 0] & 255) << 6 | (z[M.b + y[s >> 2] | 0] & 255) << 8 | (z[M.b + y[w >> 2] | 0] & 255) << 10 | (z[M.b + y[u >> 2] | 0] & 255) << 12 | (z[M.b + y[r >> 2] | 0] & 255) << 14 | (z[M.b + y[x >> 2] | 0] & 255) << 16 | (z[M.b + y[p >> 2] | 0] & 255) << 18 | (z[M.b + y[B >> 2] | 0] & 255) << 20 | (z[M.b + y[I >> 2] | 0] & 255) << 22 | (z[M.b + y[S >> 2] | 
              0] & 255) << 24 | (z[M.b + y[Q >> 2] | 0] & 255) << 26 | (z[M.b + y[H >> 2] | 0] & 255) << 28 | (z[M.b + y[J >> 2] | 0] & 255) << 30;
              K = K + 1 | 0;
              if((K | 0) == (j | 0)) {
                ba = 1;
                break a
              }
              t = t + 4 | 0
            }
          }
        }else {
          var ba = 0
        }
      }else {
        ba = 0
      }
    }while(0);
    Vc(c);
    b = ba
  }else {
    b = 0
  }
  q = c;
  return b
}
nd.X = 1;
function od(b) {
  var c = q;
  q = q + 24;
  var d = y[b + 88 >> 2], e = Nc(d + 55 | 0), g = b + 92 | 0;
  if(cd(g, y[b + 4 >> 2] + Qc(d + 49 | 0) | 0, Qc(d + 52 | 0))) {
    Uc(c);
    d = dd(g, c);
    a:do {
      if(d) {
        var h = b + 268 | 0;
        if(xd(h, e)) {
          h = wd(h, 0);
          if((e | 0) == 0) {
            m = 1
          }else {
            for(var j = 0, i = 0, f = 0;;) {
              var k = R(g, c), o = R(g, c), j = k + j & 255, i = o + i & 255;
              gb[h >> 1] = (i << 8 | j) & 65535;
              f = f + 1 | 0;
              if((f | 0) == (e | 0)) {
                m = 1;
                break a
              }
              h = h + 2 | 0
            }
          }
        }else {
          var m = 0
        }
      }else {
        m = 0
      }
    }while(0);
    Vc(c);
    b = m
  }else {
    b = 0
  }
  q = c;
  return b
}
od.X = 1;
function pd(b) {
  var c, d = q;
  q = q + 1888;
  var e = d + 24, g = d + 924, h = d + 1824, j = y[b + 88 >> 2], i = Nc(j + 63 | 0), f = b + 92 | 0;
  if(cd(f, y[b + 4 >> 2] + Qc(j + 57 | 0) | 0, Qc(j + 60 | 0))) {
    Uc(d);
    j = dd(f, d);
    a:do {
      if(j) {
        for(var k = -7, o = -7, m = 0;;) {
          y[e + (m << 2) >> 2] = k;
          y[g + (m << 2) >> 2] = o;
          var k = k + 1 | 0, t = (k | 0) > 7, o = (t & 1) + o | 0, m = m + 1 | 0;
          if((m | 0) == 225) {
            break
          }
          k = t ? -7 : k
        }
        bc(h, 0, 64);
        o = b + 284 | 0;
        if(xd(o, i * 3 | 0)) {
          c = wd(o, 0);
          if((i | 0) == 0) {
            ra = 1
          }else {
            var o = h | 0, m = h + 4 | 0, k = h + 8 | 0, t = h + 12 | 0, s = h + 16 | 0, w = h + 20 | 0, u = h + 24 | 0, r = h + 28 | 0, x = h + 32 | 0, p = h + 36 | 0, B = h + 40 | 0, I = h + 44 | 0, S = h + 48 | 0, Q = h + 52 | 0, H = h + 56 | 0, J = h + 60 | 0, K = c;
            c = K >> 1;
            for(var E = 0;;) {
              for(var da = 0;;) {
                var N = R(f, d), ka = da << 1, ba = (ka << 2) + h | 0;
                y[ba >> 2] = y[ba >> 2] + y[e + (N << 2) >> 2] & 7;
                ka = ((ka | 1) << 2) + h | 0;
                y[ka >> 2] = y[ka >> 2] + y[g + (N << 2) >> 2] & 7;
                da = da + 1 | 0;
                if((da | 0) == 8) {
                  break
                }
              }
              gb[c] = (z[M.a + y[m >> 2] | 0] & 255) << 3 | z[M.a + y[o >> 2] | 0] & 255 | (z[M.a + y[k >> 2] | 0] & 255) << 6 | (z[M.a + y[t >> 2] | 0] & 255) << 9 | (z[M.a + y[s >> 2] | 0] & 255) << 12 | (z[M.a + y[w >> 2] | 0] & 255) << 15;
              gb[c + 1] = (z[M.a + y[u >> 2] | 0] & 255) << 2 | (z[M.a + y[w >> 2] | 0] & 255) >>> 1 | (z[M.a + y[r >> 2] | 0] & 255) << 5 | (z[M.a + y[x >> 2] | 0] & 255) << 8 | (z[M.a + y[p >> 2] | 0] & 255) << 11 | (z[M.a + y[B >> 2] | 0] & 255) << 14;
              gb[c + 2] = (z[M.a + y[I >> 2] | 0] & 255) << 1 | (z[M.a + y[B >> 2] | 0] & 255) >>> 2 | (z[M.a + y[S >> 2] | 0] & 255) << 4 | (z[M.a + y[Q >> 2] | 0] & 255) << 7 | (z[M.a + y[H >> 2] | 0] & 255) << 10 | (z[M.a + y[J >> 2] | 0] & 255) << 13;
              E = E + 1 | 0;
              if((E | 0) == (i | 0)) {
                ra = 1;
                break a
              }
              K = K + 6 | 0;
              c = K >> 1
            }
          }
        }else {
          var ra = 0
        }
      }else {
        ra = 0
      }
    }while(0);
    Vc(d);
    b = ra
  }else {
    b = 0
  }
  q = d;
  return b
}
pd.X = 1;
function ac(b) {
  if(b >>> 0 < 245) {
    var c = b >>> 0 < 11 ? 16 : b + 11 & -8, d = c >>> 3, b = C[X >> 2], e = b >>> (d >>> 0);
    if((e & 3 | 0) != 0) {
      var g = (e & 1 ^ 1) + d | 0, c = g << 1, d = (c << 2) + X + 40 | 0, h = (c + 2 << 2) + X + 40 | 0, e = C[h >> 2], c = e + 8 | 0, j = C[c >> 2];
      if((d | 0) == (j | 0)) {
        y[X >> 2] = b & (1 << g ^ -1)
      }else {
        if(j >>> 0 < C[X + 16 >> 2] >>> 0) {
          $();
          a("Reached an unreachable!")
        }
        y[h >> 2] = j;
        y[j + 12 >> 2] = d
      }
      b = g << 3;
      y[e + 4 >> 2] = b | 3;
      b = e + (b | 4) | 0;
      y[b >> 2] = y[b >> 2] | 1;
      g = c;
      b = 38
    }else {
      if(c >>> 0 > C[X + 8 >> 2] >>> 0) {
        if((e | 0) != 0) {
          var g = 2 << d, g = e << d & (g | -g), d = (g & -g) - 1 | 0, g = d >>> 12 & 16, e = d >>> (g >>> 0), d = e >>> 5 & 8, h = e >>> (d >>> 0), e = h >>> 2 & 4, j = h >>> (e >>> 0), h = j >>> 1 & 2, j = j >>> (h >>> 0), i = j >>> 1 & 1, d = (d | g | e | h | i) + (j >>> (i >>> 0)) | 0, g = d << 1, h = (g << 2) + X + 40 | 0, j = (g + 2 << 2) + X + 40 | 0, e = C[j >> 2], g = e + 8 | 0, i = C[g >> 2];
          if((h | 0) == (i | 0)) {
            y[X >> 2] = b & (1 << d ^ -1)
          }else {
            if(i >>> 0 < C[X + 16 >> 2] >>> 0) {
              $();
              a("Reached an unreachable!")
            }
            y[j >> 2] = i;
            y[i + 12 >> 2] = h
          }
          h = d << 3;
          b = h - c | 0;
          y[e + 4 >> 2] = c | 3;
          d = e + c | 0;
          y[e + (c | 4) >> 2] = b | 1;
          y[e + h >> 2] = b;
          i = C[X + 8 >> 2];
          if((i | 0) != 0) {
            c = y[X + 20 >> 2];
            h = i >>> 2 & 1073741822;
            e = (h << 2) + X + 40 | 0;
            j = C[X >> 2];
            i = 1 << (i >>> 3);
            if((j & i | 0) == 0) {
              y[X >> 2] = j | i;
              j = e;
              h = (h + 2 << 2) + X + 40 | 0
            }else {
              h = (h + 2 << 2) + X + 40 | 0;
              j = C[h >> 2];
              if(j >>> 0 < C[X + 16 >> 2] >>> 0) {
                $();
                a("Reached an unreachable!")
              }
            }
            y[h >> 2] = c;
            y[j + 12 >> 2] = c;
            y[(c + 8 | 0) >> 2] = j;
            y[(c + 12 | 0) >> 2] = e
          }
          y[X + 8 >> 2] = b;
          y[X + 20 >> 2] = d;
          b = 38
        }else {
          if((y[X + 4 >> 2] | 0) == 0) {
            f = c;
            b = 30
          }else {
            b = zd(c);
            if((b | 0) == 0) {
              f = c;
              b = 30
            }else {
              g = b;
              b = 38
            }
          }
        }
      }else {
        var f = c, b = 30
      }
    }
  }else {
    if(b >>> 0 > 4294967231) {
      f = -1;
      b = 30
    }else {
      b = b + 11 & -8;
      if((y[X + 4 >> 2] | 0) == 0) {
        f = b;
        b = 30
      }else {
        c = Ad(b);
        if((c | 0) == 0) {
          f = b;
          b = 30
        }else {
          g = c;
          b = 38
        }
      }
    }
  }
  if(b == 30) {
    c = C[X + 8 >> 2];
    if(f >>> 0 > c >>> 0) {
      b = C[X + 12 >> 2];
      if(f >>> 0 < b >>> 0) {
        b = b - f | 0;
        y[X + 12 >> 2] = b;
        c = C[X + 24 >> 2];
        y[X + 24 >> 2] = c + f | 0;
        y[f + (c + 4) >> 2] = b | 1;
        y[c + 4 >> 2] = f | 3;
        g = c + 8 | 0
      }else {
        g = Bd(f)
      }
    }else {
      g = c - f | 0;
      b = C[X + 20 >> 2];
      if(g >>> 0 > 15) {
        y[X + 20 >> 2] = b + f | 0;
        y[X + 8 >> 2] = g;
        y[f + (b + 4) >> 2] = g | 1;
        y[b + c >> 2] = g;
        y[b + 4 >> 2] = f | 3
      }else {
        y[X + 8 >> 2] = 0;
        y[X + 20 >> 2] = 0;
        y[b + 4 >> 2] = c | 3;
        f = c + (b + 4) | 0;
        y[f >> 2] = y[f >> 2] | 1
      }
      g = b + 8 | 0
    }
  }
  return g
}
Module._malloc = ac;
ac.X = 1;
function zd(b) {
  var c, d, e = y[X + 4 >> 2], g = (e & -e) - 1 | 0, e = g >>> 12 & 16, h = g >>> (e >>> 0), g = h >>> 5 & 8;
  d = h >>> (g >>> 0);
  var h = d >>> 2 & 4, j = d >>> (h >>> 0);
  d = j >>> 1 & 2;
  var j = j >>> (d >>> 0), i = j >>> 1 & 1, e = g = C[X + ((g | e | h | d | i) + (j >>> (i >>> 0)) << 2) + 304 >> 2];
  d = e >> 2;
  g = (y[g + 4 >> 2] & -8) - b | 0;
  a:for(;;) {
    for(h = e;;) {
      j = y[h + 16 >> 2];
      if((j | 0) == 0) {
        h = y[h + 20 >> 2];
        if((h | 0) == 0) {
          break a
        }
      }else {
        h = j
      }
      j = (y[h + 4 >> 2] & -8) - b | 0;
      if(j >>> 0 < g >>> 0) {
        e = h;
        d = e >> 2;
        g = j;
        continue a
      }
    }
  }
  var j = e, f = C[X + 16 >> 2], i = j >>> 0 < f >>> 0;
  do {
    if(!i) {
      var k = j + b | 0, h = k;
      if(j >>> 0 < k >>> 0) {
        var i = C[d + 6], k = C[d + 3], o = (k | 0) == (e | 0);
        do {
          if(o) {
            c = e + 20 | 0;
            var m = y[c >> 2];
            if((m | 0) == 0) {
              c = e + 16 | 0;
              m = y[c >> 2];
              if((m | 0) == 0) {
                m = 0;
                c = m >> 2;
                break
              }
            }
            for(;;) {
              var t = m + 20 | 0, s = y[t >> 2];
              if((s | 0) == 0) {
                t = m + 16 | 0;
                s = C[t >> 2];
                if((s | 0) == 0) {
                  break
                }
              }
              c = t;
              m = s
            }
            if(c >>> 0 < f >>> 0) {
              $();
              a("Reached an unreachable!")
            }
            y[c >> 2] = 0
          }else {
            c = C[d + 2];
            if(c >>> 0 < f >>> 0) {
              $();
              a("Reached an unreachable!")
            }
            y[c + 12 >> 2] = k;
            y[k + 8 >> 2] = c;
            m = k
          }
          c = m >> 2
        }while(0);
        f = (i | 0) == 0;
        a:do {
          if(!f) {
            k = e + 28 | 0;
            o = (y[k >> 2] << 2) + X + 304 | 0;
            t = (e | 0) == (y[o >> 2] | 0);
            do {
              if(t) {
                y[o >> 2] = m;
                if((m | 0) != 0) {
                  break
                }
                y[X + 4 >> 2] = y[X + 4 >> 2] & (1 << y[k >> 2] ^ -1);
                break a
              }
              if(i >>> 0 < C[X + 16 >> 2] >>> 0) {
                $();
                a("Reached an unreachable!")
              }
              s = i + 16 | 0;
              (y[s >> 2] | 0) == (e | 0) ? y[s >> 2] = m : y[i + 20 >> 2] = m;
              if((m | 0) == 0) {
                break a
              }
            }while(0);
            if(m >>> 0 < C[X + 16 >> 2] >>> 0) {
              $();
              a("Reached an unreachable!")
            }
            y[c + 6] = i;
            k = C[d + 4];
            if((k | 0) != 0) {
              if(k >>> 0 < C[X + 16 >> 2] >>> 0) {
                $();
                a("Reached an unreachable!")
              }
              y[c + 4] = k;
              y[k + 24 >> 2] = m
            }
            k = C[d + 5];
            if((k | 0) != 0) {
              if(k >>> 0 < C[X + 16 >> 2] >>> 0) {
                $();
                a("Reached an unreachable!")
              }
              y[c + 5] = k;
              y[k + 24 >> 2] = m
            }
          }
        }while(0);
        if(g >>> 0 < 16) {
          b = g + b | 0;
          y[d + 1] = b | 3;
          b = b + (j + 4) | 0;
          y[b >> 2] = y[b >> 2] | 1
        }else {
          y[d + 1] = b | 3;
          y[b + (j + 4) >> 2] = g | 1;
          y[j + g + b >> 2] = g;
          f = C[X + 8 >> 2];
          if((f | 0) != 0) {
            b = C[X + 20 >> 2];
            j = f >>> 2 & 1073741822;
            d = (j << 2) + X + 40 | 0;
            i = C[X >> 2];
            f = 1 << (f >>> 3);
            if((i & f | 0) == 0) {
              y[X >> 2] = i | f;
              i = d;
              j = (j + 2 << 2) + X + 40 | 0
            }else {
              j = (j + 2 << 2) + X + 40 | 0;
              i = C[j >> 2];
              if(i >>> 0 < C[X + 16 >> 2] >>> 0) {
                $();
                a("Reached an unreachable!")
              }
            }
            y[j >> 2] = b;
            y[i + 12 >> 2] = b;
            y[b + 8 >> 2] = i;
            y[b + 12 >> 2] = d
          }
          y[X + 8 >> 2] = g;
          y[X + 20 >> 2] = h
        }
        return e + 8 | 0
      }
    }
  }while(0);
  $();
  a("Reached an unreachable!")
}
zd.X = 1;
function Bd(b) {
  var c, d;
  (y[Cd >> 2] | 0) == 0 && Dd();
  var e = (y[X + 440 >> 2] & 4 | 0) == 0;
  do {
    if(e) {
      d = y[X + 24 >> 2];
      if((d | 0) == 0) {
        d = 6
      }else {
        d = Ed(d);
        if((d | 0) == 0) {
          d = 6
        }else {
          var g = y[Cd + 8 >> 2], g = b + 47 - y[X + 12 >> 2] + g & -g;
          if(g >>> 0 < 2147483647) {
            var h = Fd(g);
            if((h | 0) == (y[d >> 2] + y[d + 4 >> 2] | 0)) {
              var j = h, i = g;
              c = h;
              d = 13
            }else {
              var f = h, k = g;
              d = 15
            }
          }else {
            d = 14
          }
        }
      }
      if(d == 6) {
        d = Fd(0);
        if((d | 0) == -1) {
          d = 14
        }else {
          var g = y[Cd + 8 >> 2], g = g + (b + 47) & -g, h = d, o = y[Cd + 4 >> 2], m = o - 1 | 0, g = (m & h | 0) == 0 ? g : g - h + (m + h & -o) | 0;
          if(g >>> 0 < 2147483647) {
            h = Fd(g);
            if((h | 0) == (d | 0)) {
              j = d;
              i = g;
              c = h;
              d = 13
            }else {
              f = h;
              k = g;
              d = 15
            }
          }else {
            d = 14
          }
        }
      }
      if(d == 13) {
        if((j | 0) != -1) {
          var t = i, s = j;
          d = 26;
          break
        }
        f = c;
        k = i
      }else {
        if(d == 14) {
          y[X + 440 >> 2] = y[X + 440 >> 2] | 4;
          d = 23;
          break
        }
      }
      d = -k | 0;
      if((f | 0) != -1 & k >>> 0 < 2147483647) {
        if(k >>> 0 < (b + 48 | 0) >>> 0) {
          g = y[Cd + 8 >> 2];
          g = b + 47 - k + g & -g;
          if(g >>> 0 < 2147483647) {
            if((Fd(g) | 0) == -1) {
              Fd(d);
              d = 22
            }else {
              w = g + k | 0;
              d = 21
            }
          }else {
            w = k;
            d = 21
          }
        }else {
          var w = k;
          d = 21
        }
      }else {
        w = k;
        d = 21
      }
      if(d == 21 && (f | 0) != -1) {
        t = w;
        s = f;
        d = 26;
        break
      }
      y[X + 440 >> 2] = y[X + 440 >> 2] | 4
    }
    d = 23
  }while(0);
  if(d == 23) {
    e = y[Cd + 8 >> 2];
    e = e + (b + 47) & -e;
    if(e >>> 0 < 2147483647) {
      e = Fd(e);
      j = Fd(0);
      if((j | 0) != -1 & (e | 0) != -1 & e >>> 0 < j >>> 0) {
        j = j - e | 0;
        if(j >>> 0 <= (b + 40 | 0) >>> 0 | (e | 0) == -1) {
          d = 49
        }else {
          t = j;
          s = e;
          d = 26
        }
      }else {
        d = 49
      }
    }else {
      d = 49
    }
  }
  a:do {
    if(d == 26) {
      e = y[X + 432 >> 2] + t | 0;
      y[X + 432 >> 2] = e;
      e >>> 0 > C[X + 436 >> 2] >>> 0 && (y[X + 436 >> 2] = e);
      e = C[X + 24 >> 2];
      j = (e | 0) == 0;
      b:do {
        if(j) {
          i = C[X + 16 >> 2];
          (i | 0) == 0 | s >>> 0 < i >>> 0 && (y[X + 16 >> 2] = s);
          y[X + 444 >> 2] = s;
          y[X + 448 >> 2] = t;
          y[X + 456 >> 2] = 0;
          y[X + 36 >> 2] = y[Cd >> 2];
          y[X + 32 >> 2] = -1;
          for(i = 0;;) {
            c = i << 1;
            f = (c << 2) + X + 40 | 0;
            y[X + (c + 3 << 2) + 40 >> 2] = f;
            y[X + (c + 2 << 2) + 40 >> 2] = f;
            i = i + 1 | 0;
            if((i | 0) == 32) {
              break
            }
          }
          Gd(s, t - 40 | 0)
        }else {
          f = X + 444 | 0;
          for(c = f >> 2;;) {
            if((f | 0) == 0) {
              break
            }
            i = C[c];
            f = f + 4 | 0;
            k = C[f >> 2];
            w = i + k | 0;
            if((s | 0) == (w | 0)) {
              if((y[c + 3] & 8 | 0) != 0) {
                break
              }
              c = e;
              if(!(c >>> 0 >= i >>> 0 & c >>> 0 < w >>> 0)) {
                break
              }
              y[f >> 2] = k + t | 0;
              Gd(y[X + 24 >> 2], y[X + 12 >> 2] + t | 0);
              break b
            }
            f = y[c + 2];
            c = f >> 2
          }
          s >>> 0 < C[X + 16 >> 2] >>> 0 && (y[X + 16 >> 2] = s);
          c = s + t | 0;
          for(f = X + 444 | 0;;) {
            if((f | 0) == 0) {
              break
            }
            k = f | 0;
            i = C[k >> 2];
            if((i | 0) == (c | 0)) {
              if((y[f + 12 >> 2] & 8 | 0) != 0) {
                break
              }
              y[k >> 2] = s;
              var u = f + 4 | 0;
              y[u >> 2] = y[u >> 2] + t | 0;
              u = Hd(s, i, b);
              d = 50;
              break a
            }
            f = y[f + 8 >> 2]
          }
          Id(s, t)
        }
      }while(0);
      e = C[X + 12 >> 2];
      if(e >>> 0 > b >>> 0) {
        u = e - b | 0;
        y[X + 12 >> 2] = u;
        j = e = C[X + 24 >> 2];
        y[X + 24 >> 2] = j + b | 0;
        y[b + (j + 4) >> 2] = u | 1;
        y[e + 4 >> 2] = b | 3;
        u = e + 8 | 0;
        d = 50
      }else {
        d = 49
      }
    }
  }while(0);
  if(d == 49) {
    y[Jd >> 2] = 12;
    u = 0
  }
  return u
}
Bd.X = 1;
function Ad(b) {
  var c, d, e, g, h, j = b >> 2, i = -b | 0, f = b >>> 8;
  if((f | 0) == 0) {
    var k = 0
  }else {
    if(b >>> 0 > 16777215) {
      k = 31
    }else {
      var o = (f + 1048320 | 0) >>> 16 & 8, m = f << o, t = (m + 520192 | 0) >>> 16 & 4, s = m << t, w = (s + 245760 | 0) >>> 16 & 2, u = 14 - (t | o | w) + (s << w >>> 15) | 0, k = b >>> ((u + 7 | 0) >>> 0) & 1 | u << 1
    }
  }
  var r = C[X + (k << 2) + 304 >> 2], x = (r | 0) == 0;
  a:do {
    if(x) {
      var p = 0, B = i, I = 0
    }else {
      var S = (k | 0) == 31 ? 0 : 25 - (k >>> 1) | 0, Q = 0, H = i, J = r;
      h = J >> 2;
      for(var K = b << S, E = 0;;) {
        var da = y[h + 1] & -8, N = da - b | 0;
        if(N >>> 0 < H >>> 0) {
          if((da | 0) == (b | 0)) {
            p = J;
            B = N;
            I = J;
            break a
          }
          var ka = J, ba = N
        }else {
          ka = Q;
          ba = H
        }
        var ra = C[h + 5], ia = C[((K >>> 31 << 2) + 16 >> 2) + h], fa = (ra | 0) == 0 | (ra | 0) == (ia | 0) ? E : ra;
        if((ia | 0) == 0) {
          p = ka;
          B = ba;
          I = fa;
          break a
        }
        Q = ka;
        H = ba;
        J = ia;
        h = J >> 2;
        K = K << 1;
        E = fa
      }
    }
  }while(0);
  if((I | 0) == 0 & (p | 0) == 0) {
    var Ga = 2 << k, ta = y[X + 4 >> 2] & (Ga | -Ga);
    if((ta | 0) == 0) {
      var la = I
    }else {
      var Aa = (ta & -ta) - 1 | 0, xa = Aa >>> 12 & 16, Y = Aa >>> (xa >>> 0), ma = Y >>> 5 & 8, ga = Y >>> (ma >>> 0), ua = ga >>> 2 & 4, Ba = ga >>> (ua >>> 0), Ca = Ba >>> 1 & 2, va = Ba >>> (Ca >>> 0), Z = va >>> 1 & 1, la = y[X + ((ma | xa | ua | Ca | Z) + (va >>> (Z >>> 0)) << 2) + 304 >> 2]
    }
  }else {
    la = I
  }
  var sa = (la | 0) == 0;
  a:do {
    if(sa) {
      var T = B, ea = p;
      g = ea >> 2
    }else {
      var W = la;
      e = W >> 2;
      for(var ya = B, L = p;;) {
        var O = (y[e + 1] & -8) - b | 0, qa = O >>> 0 < ya >>> 0, na = qa ? O : ya, U = qa ? W : L, P = C[e + 4];
        if((P | 0) != 0) {
          W = P
        }else {
          var F = C[e + 5];
          if((F | 0) == 0) {
            T = na;
            ea = U;
            g = ea >> 2;
            break a
          }
          W = F
        }
        e = W >> 2;
        ya = na;
        L = U
      }
    }
  }while(0);
  var oa = (ea | 0) == 0;
  a:do {
    if(oa) {
      var wa = 0
    }else {
      if(T >>> 0 < (y[X + 8 >> 2] - b | 0) >>> 0) {
        var ca = ea;
        d = ca >> 2;
        var V = C[X + 16 >> 2], ja = ca >>> 0 < V >>> 0;
        do {
          if(!ja) {
            var Oa = ca + b | 0, hb = Oa;
            if(ca >>> 0 < Oa >>> 0) {
              var Ha = C[g + 6], Ra = C[g + 3], Za = (Ra | 0) == (ea | 0);
              do {
                if(Za) {
                  var Ob = ea + 20 | 0, xb = y[Ob >> 2];
                  if((xb | 0) == 0) {
                    var Pb = ea + 16 | 0, yb = y[Pb >> 2];
                    if((yb | 0) == 0) {
                      var ha = 0;
                      c = ha >> 2;
                      break
                    }
                    var Ka = Pb, La = yb
                  }else {
                    Ka = Ob;
                    La = xb
                  }
                  for(;;) {
                    var ib = La + 20 | 0, zb = y[ib >> 2];
                    if((zb | 0) != 0) {
                      Ka = ib;
                      La = zb
                    }else {
                      var Qb = La + 16 | 0, Rb = C[Qb >> 2];
                      if((Rb | 0) == 0) {
                        break
                      }
                      Ka = Qb;
                      La = Rb
                    }
                  }
                  if(Ka >>> 0 < V >>> 0) {
                    $();
                    a("Reached an unreachable!")
                  }
                  y[Ka >> 2] = 0;
                  ha = La
                }else {
                  var $a = C[g + 2];
                  if($a >>> 0 < V >>> 0) {
                    $();
                    a("Reached an unreachable!")
                  }
                  y[$a + 12 >> 2] = Ra;
                  y[Ra + 8 >> 2] = $a;
                  ha = Ra
                }
                c = ha >> 2
              }while(0);
              var Sb = (Ha | 0) == 0;
              b:do {
                if(!Sb) {
                  var Tb = ea + 28 | 0, cc = (y[Tb >> 2] << 2) + X + 304 | 0, Ab = (ea | 0) == (y[cc >> 2] | 0);
                  do {
                    if(Ab) {
                      y[cc >> 2] = ha;
                      if((ha | 0) != 0) {
                        break
                      }
                      y[X + 4 >> 2] = y[X + 4 >> 2] & (1 << y[Tb >> 2] ^ -1);
                      break b
                    }
                    if(Ha >>> 0 < C[X + 16 >> 2] >>> 0) {
                      $();
                      a("Reached an unreachable!")
                    }
                    var bb = Ha + 16 | 0;
                    (y[bb >> 2] | 0) == (ea | 0) ? y[bb >> 2] = ha : y[Ha + 20 >> 2] = ha;
                    if((ha | 0) == 0) {
                      break b
                    }
                  }while(0);
                  if(ha >>> 0 < C[X + 16 >> 2] >>> 0) {
                    $();
                    a("Reached an unreachable!")
                  }
                  y[c + 6] = Ha;
                  var ab = C[g + 4];
                  if((ab | 0) != 0) {
                    if(ab >>> 0 < C[X + 16 >> 2] >>> 0) {
                      $();
                      a("Reached an unreachable!")
                    }
                    y[c + 4] = ab;
                    y[ab + 24 >> 2] = ha
                  }
                  var Ia = C[g + 5];
                  if((Ia | 0) != 0) {
                    if(Ia >>> 0 < C[X + 16 >> 2] >>> 0) {
                      $();
                      a("Reached an unreachable!")
                    }
                    y[c + 5] = Ia;
                    y[Ia + 24 >> 2] = ha
                  }
                }
              }while(0);
              var Bb = T >>> 0 < 16;
              b:do {
                if(Bb) {
                  var Cb = T + b | 0;
                  y[g + 1] = Cb | 3;
                  var Db = Cb + (ca + 4) | 0;
                  y[Db >> 2] = y[Db >> 2] | 1
                }else {
                  y[g + 1] = b | 3;
                  y[j + (d + 1)] = T | 1;
                  y[(T >> 2) + d + j] = T;
                  if(T >>> 0 < 256) {
                    var ob = T >>> 2 & 1073741822, pb = (ob << 2) + X + 40 | 0, Eb = C[X >> 2], Fb = 1 << (T >>> 3);
                    if((Eb & Fb | 0) == 0) {
                      y[X >> 2] = Eb | Fb;
                      var qb = pb, jb = (ob + 2 << 2) + X + 40 | 0
                    }else {
                      var rb = (ob + 2 << 2) + X + 40 | 0, Sa = C[rb >> 2];
                      if(Sa >>> 0 < C[X + 16 >> 2] >>> 0) {
                        $();
                        a("Reached an unreachable!")
                      }
                      qb = Sa;
                      jb = rb
                    }
                    y[jb >> 2] = hb;
                    y[qb + 12 >> 2] = hb;
                    y[j + (d + 2)] = qb;
                    y[j + (d + 3)] = pb
                  }else {
                    var Pa = Oa, sb = T >>> 8;
                    if((sb | 0) == 0) {
                      var Ta = 0
                    }else {
                      if(T >>> 0 > 16777215) {
                        Ta = 31
                      }else {
                        var Gb = (sb + 1048320 | 0) >>> 16 & 8, Hb = sb << Gb, Ib = (Hb + 520192 | 0) >>> 16 & 4, tb = Hb << Ib, Jb = (tb + 245760 | 0) >>> 16 & 2, Kb = 14 - (Ib | Gb | Jb) + (tb << Jb >>> 15) | 0, Ta = T >>> ((Kb + 7 | 0) >>> 0) & 1 | Kb << 1
                      }
                    }
                    var Lb = (Ta << 2) + X + 304 | 0;
                    y[j + (d + 7)] = Ta;
                    var kb = b + (ca + 16) | 0;
                    y[j + (d + 5)] = 0;
                    y[kb >> 2] = 0;
                    var Ua = y[X + 4 >> 2], Ub = 1 << Ta;
                    if((Ua & Ub | 0) == 0) {
                      y[X + 4 >> 2] = Ua | Ub;
                      y[Lb >> 2] = Pa;
                      y[j + (d + 6)] = Lb;
                      y[j + (d + 3)] = Pa;
                      y[j + (d + 2)] = Pa
                    }else {
                      for(var Va = T << ((Ta | 0) == 31 ? 0 : 25 - (Ta >>> 1) | 0), nb = y[Lb >> 2];;) {
                        if((y[nb + 4 >> 2] & -8 | 0) == (T | 0)) {
                          var Ac = nb + 8 | 0, Xb = C[Ac >> 2], oc = C[X + 16 >> 2], Bc = nb >>> 0 < oc >>> 0;
                          do {
                            if(!Bc && Xb >>> 0 >= oc >>> 0) {
                              y[Xb + 12 >> 2] = Pa;
                              y[Ac >> 2] = Pa;
                              y[j + (d + 2)] = Xb;
                              y[j + (d + 3)] = nb;
                              y[j + (d + 6)] = 0;
                              break b
                            }
                          }while(0);
                          $();
                          a("Reached an unreachable!")
                        }
                        var gc = (Va >>> 31 << 2) + nb + 16 | 0, Cc = C[gc >> 2];
                        if((Cc | 0) == 0) {
                          if(gc >>> 0 >= C[X + 16 >> 2] >>> 0) {
                            y[gc >> 2] = Pa;
                            y[j + (d + 6)] = nb;
                            y[j + (d + 3)] = Pa;
                            y[j + (d + 2)] = Pa;
                            break b
                          }
                          $();
                          a("Reached an unreachable!")
                        }
                        Va = Va << 1;
                        nb = Cc
                      }
                    }
                  }
                }
              }while(0);
              wa = ea + 8 | 0;
              break a
            }
          }
        }while(0);
        $();
        a("Reached an unreachable!")
      }
      wa = 0
    }
  }while(0);
  return wa
}
Ad.X = 1;
function Kd(b) {
  var c;
  (y[Cd >> 2] | 0) == 0 && Dd();
  var d = b >>> 0 < 4294967232;
  a:do {
    if(d) {
      var e = C[X + 24 >> 2];
      if((e | 0) != 0) {
        var g = C[X + 12 >> 2], h = g >>> 0 > (b + 40 | 0) >>> 0;
        do {
          if(h) {
            var j = C[Cd + 8 >> 2], i = (Math.floor(((-40 - b - 1 + g + j | 0) >>> 0) / (j >>> 0)) - 1) * j | 0, f = Ed(e);
            if((y[f + 12 >> 2] & 8 | 0) == 0) {
              var k = Fd(0);
              c = (f + 4 | 0) >> 2;
              if((k | 0) == (y[f >> 2] + y[c] | 0)) {
                i = Fd(-(i >>> 0 > 2147483646 ? -2147483648 - j | 0 : i) | 0);
                j = Fd(0);
                if((i | 0) != -1 & j >>> 0 < k >>> 0) {
                  i = k - j | 0;
                  if((k | 0) != (j | 0)) {
                    y[c] = y[c] - i | 0;
                    y[X + 432 >> 2] = y[X + 432 >> 2] - i | 0;
                    Gd(y[X + 24 >> 2], y[X + 12 >> 2] - i | 0);
                    c = (k | 0) != (j | 0);
                    break a
                  }
                }
              }
            }
          }
        }while(0);
        C[X + 12 >> 2] >>> 0 > C[X + 28 >> 2] >>> 0 && (y[X + 28 >> 2] = -1)
      }
    }
    c = 0
  }while(0);
  return c & 1
}
Kd.X = 1;
function Ld(b) {
  var c, d, e, g, h, j, i = b >> 2, f, k = (b | 0) == 0;
  a:do {
    if(!k) {
      var o = b - 8 | 0, m = o, t = C[X + 16 >> 2], s = o >>> 0 < t >>> 0;
      b:do {
        if(!s) {
          var w = C[b - 4 >> 2], u = w & 3;
          if((u | 0) != 1) {
            var r = w & -8;
            j = r >> 2;
            var x = b + (r - 8) | 0, p = x, B = (w & 1 | 0) == 0;
            c:do {
              if(B) {
                var I = C[o >> 2];
                if((u | 0) == 0) {
                  break a
                }
                var S = -8 - I | 0;
                h = S >> 2;
                var Q = b + S | 0, H = Q, J = I + r | 0;
                if(Q >>> 0 < t >>> 0) {
                  break b
                }
                if((H | 0) == (y[X + 20 >> 2] | 0)) {
                  g = (b + (r - 4) | 0) >> 2;
                  if((y[g] & 3 | 0) != 3) {
                    var K = H;
                    e = K >> 2;
                    var E = J;
                    break
                  }
                  y[X + 8 >> 2] = J;
                  y[g] = y[g] & -2;
                  y[h + (i + 1)] = J | 1;
                  y[x >> 2] = J;
                  break a
                }
                if(I >>> 0 < 256) {
                  var da = C[h + (i + 2)], N = C[h + (i + 3)];
                  if((da | 0) == (N | 0)) {
                    y[X >> 2] = y[X >> 2] & (1 << (I >>> 3) ^ -1);
                    K = H;
                    e = K >> 2;
                    E = J
                  }else {
                    var ka = ((I >>> 2 & 1073741822) << 2) + X + 40 | 0, ba = (da | 0) != (ka | 0) & da >>> 0 < t >>> 0;
                    do {
                      if(!ba && (N | 0) == (ka | 0) | N >>> 0 >= t >>> 0) {
                        y[da + 12 >> 2] = N;
                        y[N + 8 >> 2] = da;
                        K = H;
                        e = K >> 2;
                        E = J;
                        break c
                      }
                    }while(0);
                    $();
                    a("Reached an unreachable!")
                  }
                }else {
                  var ra = Q, ia = C[h + (i + 6)], fa = C[h + (i + 3)], Ga = (fa | 0) == (ra | 0);
                  do {
                    if(Ga) {
                      var ta = S + (b + 20) | 0, la = y[ta >> 2];
                      if((la | 0) == 0) {
                        var Aa = S + (b + 16) | 0, xa = y[Aa >> 2];
                        if((xa | 0) == 0) {
                          var Y = 0;
                          d = Y >> 2;
                          break
                        }
                        var ma = Aa, ga = xa
                      }else {
                        ma = ta;
                        ga = la;
                        f = 21
                      }
                      for(;;) {
                        var ua = ga + 20 | 0, Ba = y[ua >> 2];
                        if((Ba | 0) != 0) {
                          ma = ua;
                          ga = Ba
                        }else {
                          var Ca = ga + 16 | 0, va = C[Ca >> 2];
                          if((va | 0) == 0) {
                            break
                          }
                          ma = Ca;
                          ga = va
                        }
                      }
                      if(ma >>> 0 < t >>> 0) {
                        $();
                        a("Reached an unreachable!")
                      }
                      y[ma >> 2] = 0;
                      Y = ga
                    }else {
                      var Z = C[h + (i + 2)];
                      if(Z >>> 0 < t >>> 0) {
                        $();
                        a("Reached an unreachable!")
                      }
                      y[Z + 12 >> 2] = fa;
                      y[fa + 8 >> 2] = Z;
                      Y = fa
                    }
                    d = Y >> 2
                  }while(0);
                  if((ia | 0) != 0) {
                    var sa = S + (b + 28) | 0, T = (y[sa >> 2] << 2) + X + 304 | 0, ea = (ra | 0) == (y[T >> 2] | 0);
                    do {
                      if(ea) {
                        y[T >> 2] = Y;
                        if((Y | 0) != 0) {
                          break
                        }
                        y[X + 4 >> 2] = y[X + 4 >> 2] & (1 << y[sa >> 2] ^ -1);
                        K = H;
                        e = K >> 2;
                        E = J;
                        break c
                      }
                      if(ia >>> 0 < C[X + 16 >> 2] >>> 0) {
                        $();
                        a("Reached an unreachable!")
                      }
                      var W = ia + 16 | 0;
                      (y[W >> 2] | 0) == (ra | 0) ? y[W >> 2] = Y : y[ia + 20 >> 2] = Y;
                      if((Y | 0) == 0) {
                        K = H;
                        e = K >> 2;
                        E = J;
                        break c
                      }
                    }while(0);
                    if(Y >>> 0 < C[X + 16 >> 2] >>> 0) {
                      $();
                      a("Reached an unreachable!")
                    }
                    y[d + 6] = ia;
                    var ya = C[h + (i + 4)];
                    if((ya | 0) != 0) {
                      if(ya >>> 0 < C[X + 16 >> 2] >>> 0) {
                        $();
                        a("Reached an unreachable!")
                      }
                      y[d + 4] = ya;
                      y[ya + 24 >> 2] = Y
                    }
                    var L = C[h + (i + 5)];
                    if((L | 0) != 0) {
                      if(L >>> 0 < C[X + 16 >> 2] >>> 0) {
                        $();
                        a("Reached an unreachable!")
                      }
                      y[d + 5] = L;
                      y[L + 24 >> 2] = Y
                    }
                  }
                  K = H;
                  e = K >> 2;
                  E = J
                }
              }else {
                K = m;
                e = K >> 2;
                E = r
              }
            }while(0);
            var O = K;
            if(O >>> 0 < x >>> 0) {
              var qa = b + (r - 4) | 0, na = C[qa >> 2];
              if((na & 1 | 0) != 0) {
                var U = (na & 2 | 0) == 0;
                do {
                  if(U) {
                    if((p | 0) == (y[X + 24 >> 2] | 0)) {
                      var P = y[X + 12 >> 2] + E | 0;
                      y[X + 12 >> 2] = P;
                      y[X + 24 >> 2] = K;
                      y[e + 1] = P | 1;
                      if((K | 0) == (y[X + 20 >> 2] | 0)) {
                        y[X + 20 >> 2] = 0;
                        y[X + 8 >> 2] = 0
                      }
                      if(P >>> 0 <= C[X + 28 >> 2] >>> 0) {
                        break a
                      }
                      Kd(0);
                      break a
                    }
                    if((p | 0) == (y[X + 20 >> 2] | 0)) {
                      var F = y[X + 8 >> 2] + E | 0;
                      y[X + 8 >> 2] = F;
                      y[X + 20 >> 2] = K;
                      y[e + 1] = F | 1;
                      y[(O + F | 0) >> 2] = F;
                      break a
                    }
                    var oa = (na & -8) + E | 0, wa = na >>> 3, ca = na >>> 0 < 256;
                    c:do {
                      if(ca) {
                        var V = C[i + j], ja = C[((r | 4) >> 2) + i];
                        if((V | 0) == (ja | 0)) {
                          y[X >> 2] = y[X >> 2] & (1 << wa ^ -1)
                        }else {
                          var Oa = ((na >>> 2 & 1073741822) << 2) + X + 40 | 0;
                          f = (V | 0) == (Oa | 0) ? 63 : V >>> 0 < C[X + 16 >> 2] >>> 0 ? 66 : 63;
                          do {
                            if(f == 63 && !((ja | 0) != (Oa | 0) && ja >>> 0 < C[X + 16 >> 2] >>> 0)) {
                              y[V + 12 >> 2] = ja;
                              y[ja + 8 >> 2] = V;
                              break c
                            }
                          }while(0);
                          $();
                          a("Reached an unreachable!")
                        }
                      }else {
                        var hb = x, Ha = C[j + (i + 4)], Ra = C[((r | 4) >> 2) + i], Za = (Ra | 0) == (hb | 0);
                        do {
                          if(Za) {
                            var Ob = r + (b + 12) | 0, xb = y[Ob >> 2];
                            if((xb | 0) == 0) {
                              var Pb = r + (b + 8) | 0, yb = y[Pb >> 2];
                              if((yb | 0) == 0) {
                                var ha = 0;
                                c = ha >> 2;
                                break
                              }
                              var Ka = Pb, La = yb
                            }else {
                              Ka = Ob;
                              La = xb;
                              f = 73
                            }
                            for(;;) {
                              var ib = La + 20 | 0, zb = y[ib >> 2];
                              if((zb | 0) != 0) {
                                Ka = ib;
                                La = zb
                              }else {
                                var Qb = La + 16 | 0, Rb = C[Qb >> 2];
                                if((Rb | 0) == 0) {
                                  break
                                }
                                Ka = Qb;
                                La = Rb
                              }
                            }
                            if(Ka >>> 0 < C[X + 16 >> 2] >>> 0) {
                              $();
                              a("Reached an unreachable!")
                            }
                            y[Ka >> 2] = 0;
                            ha = La
                          }else {
                            var $a = C[i + j];
                            if($a >>> 0 < C[X + 16 >> 2] >>> 0) {
                              $();
                              a("Reached an unreachable!")
                            }
                            y[$a + 12 >> 2] = Ra;
                            y[Ra + 8 >> 2] = $a;
                            ha = Ra
                          }
                          c = ha >> 2
                        }while(0);
                        if((Ha | 0) != 0) {
                          var Sb = r + (b + 20) | 0, Tb = (y[Sb >> 2] << 2) + X + 304 | 0, cc = (hb | 0) == (y[Tb >> 2] | 0);
                          do {
                            if(cc) {
                              y[Tb >> 2] = ha;
                              if((ha | 0) != 0) {
                                break
                              }
                              y[X + 4 >> 2] = y[X + 4 >> 2] & (1 << y[Sb >> 2] ^ -1);
                              break c
                            }
                            if(Ha >>> 0 < C[X + 16 >> 2] >>> 0) {
                              $();
                              a("Reached an unreachable!")
                            }
                            var Ab = Ha + 16 | 0;
                            (y[Ab >> 2] | 0) == (hb | 0) ? y[Ab >> 2] = ha : y[Ha + 20 >> 2] = ha;
                            if((ha | 0) == 0) {
                              break c
                            }
                          }while(0);
                          if(ha >>> 0 < C[X + 16 >> 2] >>> 0) {
                            $();
                            a("Reached an unreachable!")
                          }
                          y[c + 6] = Ha;
                          var bb = C[j + (i + 2)];
                          if((bb | 0) != 0) {
                            if(bb >>> 0 < C[X + 16 >> 2] >>> 0) {
                              $();
                              a("Reached an unreachable!")
                            }
                            y[c + 4] = bb;
                            y[bb + 24 >> 2] = ha
                          }
                          var ab = C[j + (i + 3)];
                          if((ab | 0) != 0) {
                            if(ab >>> 0 < C[X + 16 >> 2] >>> 0) {
                              $();
                              a("Reached an unreachable!")
                            }
                            y[c + 5] = ab;
                            y[ab + 24 >> 2] = ha
                          }
                        }
                      }
                    }while(0);
                    y[e + 1] = oa | 1;
                    y[O + oa >> 2] = oa;
                    if((K | 0) != (y[X + 20 >> 2] | 0)) {
                      var Ia = oa
                    }else {
                      y[X + 8 >> 2] = oa;
                      break a
                    }
                  }else {
                    y[qa >> 2] = na & -2;
                    y[e + 1] = E | 1;
                    Ia = y[O + E >> 2] = E
                  }
                }while(0);
                if(Ia >>> 0 < 256) {
                  var Bb = Ia >>> 2 & 1073741822, Cb = (Bb << 2) + X + 40 | 0, Db = C[X >> 2], ob = 1 << (Ia >>> 3);
                  if((Db & ob | 0) == 0) {
                    y[X >> 2] = Db | ob;
                    var pb = Cb, Eb = (Bb + 2 << 2) + X + 40 | 0
                  }else {
                    var Fb = (Bb + 2 << 2) + X + 40 | 0, qb = C[Fb >> 2];
                    if(qb >>> 0 < C[X + 16 >> 2] >>> 0) {
                      $();
                      a("Reached an unreachable!")
                    }
                    pb = qb;
                    Eb = Fb
                  }
                  y[Eb >> 2] = K;
                  y[pb + 12 >> 2] = K;
                  y[e + 2] = pb;
                  y[e + 3] = Cb;
                  break a
                }
                var jb = K, rb = Ia >>> 8;
                if((rb | 0) == 0) {
                  var Sa = 0
                }else {
                  if(Ia >>> 0 > 16777215) {
                    Sa = 31
                  }else {
                    var Pa = (rb + 1048320 | 0) >>> 16 & 8, sb = rb << Pa, Ta = (sb + 520192 | 0) >>> 16 & 4, Gb = sb << Ta, Hb = (Gb + 245760 | 0) >>> 16 & 2, Ib = 14 - (Ta | Pa | Hb) + (Gb << Hb >>> 15) | 0, Sa = Ia >>> ((Ib + 7 | 0) >>> 0) & 1 | Ib << 1
                  }
                }
                var tb = (Sa << 2) + X + 304 | 0;
                y[e + 7] = Sa;
                y[e + 5] = 0;
                y[e + 4] = 0;
                var Jb = y[X + 4 >> 2], Kb = 1 << Sa, Lb = (Jb & Kb | 0) == 0;
                c:do {
                  if(Lb) {
                    y[X + 4 >> 2] = Jb | Kb;
                    y[tb >> 2] = jb;
                    y[e + 6] = tb;
                    y[e + 3] = K;
                    y[e + 2] = K
                  }else {
                    for(var kb = Ia << ((Sa | 0) == 31 ? 0 : 25 - (Sa >>> 1) | 0), Ua = y[tb >> 2];;) {
                      if((y[Ua + 4 >> 2] & -8 | 0) == (Ia | 0)) {
                        var Ub = Ua + 8 | 0, Va = C[Ub >> 2], nb = C[X + 16 >> 2], Ac = Ua >>> 0 < nb >>> 0;
                        do {
                          if(!Ac && Va >>> 0 >= nb >>> 0) {
                            y[Va + 12 >> 2] = jb;
                            y[Ub >> 2] = jb;
                            y[e + 2] = Va;
                            y[e + 3] = Ua;
                            y[e + 6] = 0;
                            break c
                          }
                        }while(0);
                        $();
                        a("Reached an unreachable!")
                      }
                      var Xb = (kb >>> 31 << 2) + Ua + 16 | 0, oc = C[Xb >> 2];
                      if((oc | 0) == 0) {
                        if(Xb >>> 0 >= C[X + 16 >> 2] >>> 0) {
                          y[Xb >> 2] = jb;
                          y[e + 6] = Ua;
                          y[e + 3] = K;
                          y[e + 2] = K;
                          break c
                        }
                        $();
                        a("Reached an unreachable!")
                      }
                      kb = kb << 1;
                      Ua = oc
                    }
                  }
                }while(0);
                var Bc = y[X + 32 >> 2] - 1 | 0;
                y[X + 32 >> 2] = Bc;
                if((Bc | 0) != 0) {
                  break a
                }
                var gc = y[X + 452 >> 2], Cc = (gc | 0) == 0;
                c:do {
                  if(!Cc) {
                    for(var Td = gc;;) {
                      var Ud = y[Td + 8 >> 2];
                      if((Ud | 0) == 0) {
                        break c
                      }
                      Td = Ud
                    }
                  }
                }while(0);
                y[X + 32 >> 2] = -1;
                break a
              }
            }
          }
        }
      }while(0);
      $();
      a("Reached an unreachable!")
    }
  }while(0)
}
Module._free = Ld;
Ld.X = 1;
function Md(b, c) {
  var d, e, g, h = c >>> 0 > 4294967231;
  a:do {
    if(h) {
      y[Jd >> 2] = 12;
      var j = 0
    }else {
      g = d = b - 8 | 0;
      e = (b - 4 | 0) >> 2;
      var i = C[e], f = i & -8, k = f - 8 | 0, o = b + k | 0, m = d >>> 0 < C[X + 16 >> 2] >>> 0;
      do {
        if(!m) {
          var t = i & 3;
          if((t | 0) != 1 & (k | 0) > -8) {
            d = (b + (f - 4) | 0) >> 2;
            if((y[d] & 1 | 0) != 0) {
              h = c >>> 0 < 11 ? 16 : c + 11 & -8;
              if((t | 0) == 0) {
                var s = 0, w, i = y[g + 4 >> 2] & -8;
                w = h >>> 0 < 256 ? 0 : i >>> 0 >= (h + 4 | 0) >>> 0 && (i - h | 0) >>> 0 <= y[Cd + 8 >> 2] << 1 >>> 0 ? g : 0;
                g = 17
              }else {
                if(f >>> 0 < h >>> 0) {
                  if((o | 0) != (y[X + 24 >> 2] | 0)) {
                    g = 21
                  }else {
                    d = y[X + 12 >> 2] + f | 0;
                    if(d >>> 0 > h >>> 0) {
                      s = d - h | 0;
                      w = b + (h - 8) | 0;
                      y[e] = h | i & 1 | 2;
                      y[b + (h - 4) >> 2] = s | 1;
                      y[X + 24 >> 2] = w;
                      y[X + 12 >> 2] = s;
                      s = 0;
                      w = g;
                      g = 17
                    }else {
                      g = 21
                    }
                  }
                }else {
                  s = f - h | 0;
                  if(s >>> 0 > 15) {
                    y[e] = h | i & 1 | 2;
                    y[b + (h - 4) >> 2] = s | 3;
                    y[d] = y[d] | 1;
                    s = b + h | 0
                  }else {
                    s = 0
                  }
                  w = g;
                  g = 17
                }
              }
              do {
                if(g == 17 && (w | 0) != 0) {
                  (s | 0) != 0 && Ld(s);
                  j = w + 8 | 0;
                  break a
                }
              }while(0);
              g = ac(c);
              if((g | 0) == 0) {
                j = 0;
                break a
              }
              e = f - ((y[e] & 3 | 0) == 0 ? 8 : 4) | 0;
              f = g;
              i = b;
              e = e >>> 0 < c >>> 0 ? e : c;
              if(e >= 20 && i % 2 == f % 2) {
                if(i % 4 == f % 4) {
                  for(e = i + e;i % 4;) {
                    v[f++] = v[i++]
                  }
                  i = i >> 2;
                  f = f >> 2;
                  for(s = e >> 2;i < s;) {
                    y[f++] = y[i++]
                  }
                  i = i << 2;
                  for(f = f << 2;i < e;) {
                    v[f++] = v[i++]
                  }
                }else {
                  e = i + e;
                  i % 2 && (v[f++] = v[i++]);
                  i = i >> 1;
                  f = f >> 1;
                  for(s = e >> 1;i < s;) {
                    gb[f++] = gb[i++]
                  }
                  i = i << 1;
                  f = f << 1;
                  i < e && (v[f++] = v[i++])
                }
              }else {
                for(;e--;) {
                  v[f++] = v[i++]
                }
              }
              Ld(b);
              j = g;
              break a
            }
          }
        }
      }while(0);
      $();
      a("Reached an unreachable!")
    }
  }while(0);
  return j
}
Md.X = 1;
function Dd() {
  if((y[Cd >> 2] | 0) == 0) {
    var b = Nd();
    if((b - 1 & b | 0) == 0) {
      y[Cd + 8 >> 2] = b;
      y[Cd + 4 >> 2] = b;
      y[Cd + 12 >> 2] = -1;
      y[Cd + 16 >> 2] = 2097152;
      y[Cd + 20 >> 2] = 0;
      y[X + 440 >> 2] = 0;
      y[Cd >> 2] = Math.floor(Date.now() / 1E3) & -16 ^ 1431655768
    }else {
      $();
      a("Reached an unreachable!")
    }
  }
}
function Od(b) {
  if((b | 0) == 0) {
    b = 0
  }else {
    var b = y[b - 4 >> 2], c = b & 3, b = (c | 0) == 1 ? 0 : (b & -8) - ((c | 0) == 0 ? 8 : 4) | 0
  }
  return b
}
function Ed(b) {
  var c, d = X + 444 | 0;
  for(c = d >> 2;;) {
    var e = C[c];
    if(e >>> 0 <= b >>> 0 && (e + y[c + 1] | 0) >>> 0 > b >>> 0) {
      var g = d;
      break
    }
    c = C[c + 2];
    if((c | 0) == 0) {
      g = 0;
      break
    }
    d = c;
    c = d >> 2
  }
  return g
}
function Gd(b, c) {
  var d = b + 8 | 0, d = (d & 7 | 0) == 0 ? 0 : -d & 7, e = c - d | 0;
  y[X + 24 >> 2] = b + d | 0;
  y[X + 12 >> 2] = e;
  y[d + (b + 4) >> 2] = e | 1;
  y[c + (b + 4) >> 2] = 40;
  y[X + 28 >> 2] = y[Cd + 16 >> 2]
}
function Hd(b, c, d) {
  var e, g, h, j = c >> 2, i = b >> 2, f, k = b + 8 | 0, k = (k & 7 | 0) == 0 ? 0 : -k & 7;
  g = c + 8 | 0;
  var o = (g & 7 | 0) == 0 ? 0 : -g & 7;
  h = o >> 2;
  var m = c + o | 0, t = k + d | 0;
  g = t >> 2;
  var s = b + t | 0, w = m - (b + k) - d | 0;
  y[(k + 4 >> 2) + i] = d | 3;
  d = (m | 0) == (y[X + 24 >> 2] | 0);
  a:do {
    if(d) {
      var u = y[X + 12 >> 2] + w | 0;
      y[X + 12 >> 2] = u;
      y[X + 24 >> 2] = s;
      y[g + (i + 1)] = u | 1
    }else {
      if((m | 0) == (y[X + 20 >> 2] | 0)) {
        u = y[X + 8 >> 2] + w | 0;
        y[X + 8 >> 2] = u;
        y[X + 20 >> 2] = s;
        y[g + (i + 1)] = u | 1;
        y[(b + u + t | 0) >> 2] = u
      }else {
        var r = C[h + (j + 1)];
        if((r & 3 | 0) == 1) {
          var u = r & -8, x = r >>> 3, p = r >>> 0 < 256;
          b:do {
            if(p) {
              var B = C[((o | 8) >> 2) + j], I = C[h + (j + 3)];
              if((B | 0) == (I | 0)) {
                y[X >> 2] = y[X >> 2] & (1 << x ^ -1)
              }else {
                var S = ((r >>> 2 & 1073741822) << 2) + X + 40 | 0;
                f = (B | 0) == (S | 0) ? 15 : B >>> 0 < C[X + 16 >> 2] >>> 0 ? 18 : 15;
                do {
                  if(f == 15 && !((I | 0) != (S | 0) && I >>> 0 < C[X + 16 >> 2] >>> 0)) {
                    y[B + 12 >> 2] = I;
                    y[I + 8 >> 2] = B;
                    break b
                  }
                }while(0);
                $();
                a("Reached an unreachable!")
              }
            }else {
              f = m;
              B = C[((o | 24) >> 2) + j];
              I = C[h + (j + 3)];
              S = (I | 0) == (f | 0);
              do {
                if(S) {
                  e = o | 16;
                  var Q = e + (c + 4) | 0, H = y[Q >> 2];
                  if((H | 0) == 0) {
                    e = c + e | 0;
                    H = y[e >> 2];
                    if((H | 0) == 0) {
                      H = 0;
                      e = H >> 2;
                      break
                    }
                  }else {
                    e = Q
                  }
                  for(;;) {
                    var Q = H + 20 | 0, J = y[Q >> 2];
                    if((J | 0) == 0) {
                      Q = H + 16 | 0;
                      J = C[Q >> 2];
                      if((J | 0) == 0) {
                        break
                      }
                    }
                    e = Q;
                    H = J
                  }
                  if(e >>> 0 < C[X + 16 >> 2] >>> 0) {
                    $();
                    a("Reached an unreachable!")
                  }
                  y[e >> 2] = 0
                }else {
                  e = C[((o | 8) >> 2) + j];
                  if(e >>> 0 < C[X + 16 >> 2] >>> 0) {
                    $();
                    a("Reached an unreachable!")
                  }
                  y[e + 12 >> 2] = I;
                  y[I + 8 >> 2] = e;
                  H = I
                }
                e = H >> 2
              }while(0);
              if((B | 0) != 0) {
                I = o + (c + 28) | 0;
                S = (y[I >> 2] << 2) + X + 304 | 0;
                Q = (f | 0) == (y[S >> 2] | 0);
                do {
                  if(Q) {
                    y[S >> 2] = H;
                    if((H | 0) != 0) {
                      break
                    }
                    y[X + 4 >> 2] = y[X + 4 >> 2] & (1 << y[I >> 2] ^ -1);
                    break b
                  }
                  if(B >>> 0 < C[X + 16 >> 2] >>> 0) {
                    $();
                    a("Reached an unreachable!")
                  }
                  J = B + 16 | 0;
                  (y[J >> 2] | 0) == (f | 0) ? y[J >> 2] = H : y[B + 20 >> 2] = H;
                  if((H | 0) == 0) {
                    break b
                  }
                }while(0);
                if(H >>> 0 < C[X + 16 >> 2] >>> 0) {
                  $();
                  a("Reached an unreachable!")
                }
                y[e + 6] = B;
                f = o | 16;
                B = C[(f >> 2) + j];
                if((B | 0) != 0) {
                  if(B >>> 0 < C[X + 16 >> 2] >>> 0) {
                    $();
                    a("Reached an unreachable!")
                  }
                  y[e + 4] = B;
                  y[B + 24 >> 2] = H
                }
                f = C[(f + 4 >> 2) + j];
                if((f | 0) != 0) {
                  if(f >>> 0 < C[X + 16 >> 2] >>> 0) {
                    $();
                    a("Reached an unreachable!")
                  }
                  y[e + 5] = f;
                  y[f + 24 >> 2] = H
                }
              }
            }
          }while(0);
          r = c + (u | o) | 0;
          u = u + w | 0
        }else {
          r = m;
          u = w
        }
        r = r + 4 | 0;
        y[r >> 2] = y[r >> 2] & -2;
        y[g + (i + 1)] = u | 1;
        y[(u >> 2) + i + g] = u;
        if(u >>> 0 < 256) {
          x = u >>> 2 & 1073741822;
          r = (x << 2) + X + 40 | 0;
          p = C[X >> 2];
          u = 1 << (u >>> 3);
          if((p & u | 0) == 0) {
            y[X >> 2] = p | u;
            u = r;
            x = (x + 2 << 2) + X + 40 | 0
          }else {
            x = (x + 2 << 2) + X + 40 | 0;
            u = C[x >> 2];
            if(u >>> 0 < C[X + 16 >> 2] >>> 0) {
              $();
              a("Reached an unreachable!")
            }
          }
          y[x >> 2] = s;
          y[u + 12 >> 2] = s;
          y[g + (i + 2)] = u;
          y[g + (i + 3)] = r
        }else {
          r = s;
          p = u >>> 8;
          if((p | 0) == 0) {
            x = 0
          }else {
            if(u >>> 0 > 16777215) {
              x = 31
            }else {
              x = (p + 1048320 | 0) >>> 16 & 8;
              f = p << x;
              p = (f + 520192 | 0) >>> 16 & 4;
              f = f << p;
              B = (f + 245760 | 0) >>> 16 & 2;
              x = 14 - (p | x | B) + (f << B >>> 15) | 0;
              x = u >>> ((x + 7 | 0) >>> 0) & 1 | x << 1
            }
          }
          p = (x << 2) + X + 304 | 0;
          y[g + (i + 7)] = x;
          f = t + (b + 16) | 0;
          y[g + (i + 5)] = 0;
          y[f >> 2] = 0;
          f = y[X + 4 >> 2];
          B = 1 << x;
          if((f & B | 0) == 0) {
            y[X + 4 >> 2] = f | B;
            y[p >> 2] = r;
            y[g + (i + 6)] = p;
            y[g + (i + 3)] = r;
            y[g + (i + 2)] = r
          }else {
            x = u << ((x | 0) == 31 ? 0 : 25 - (x >>> 1) | 0);
            for(p = y[p >> 2];;) {
              if((y[p + 4 >> 2] & -8 | 0) == (u | 0)) {
                f = p + 8 | 0;
                B = C[f >> 2];
                I = C[X + 16 >> 2];
                S = p >>> 0 < I >>> 0;
                do {
                  if(!S && B >>> 0 >= I >>> 0) {
                    y[B + 12 >> 2] = r;
                    y[f >> 2] = r;
                    y[g + (i + 2)] = B;
                    y[g + (i + 3)] = p;
                    y[g + (i + 6)] = 0;
                    break a
                  }
                }while(0);
                $();
                a("Reached an unreachable!")
              }
              f = (x >>> 31 << 2) + p + 16 | 0;
              B = C[f >> 2];
              if((B | 0) == 0) {
                if(f >>> 0 >= C[X + 16 >> 2] >>> 0) {
                  y[f >> 2] = r;
                  y[g + (i + 6)] = p;
                  y[g + (i + 3)] = r;
                  y[g + (i + 2)] = r;
                  break a
                }
                $();
                a("Reached an unreachable!")
              }
              x = x << 1;
              p = B
            }
          }
        }
      }
    }
  }while(0);
  return b + (k | 8) | 0
}
Hd.X = 1;
function Id(b, c) {
  var d, e, g = C[X + 24 >> 2];
  e = g >> 2;
  var h = Ed(g), j = y[h >> 2];
  d = y[h + 4 >> 2];
  var h = j + d | 0, i = j + (d - 39) | 0, j = j + (d - 47) + ((i & 7 | 0) == 0 ? 0 : -i & 7) | 0, j = j >>> 0 < (g + 16 | 0) >>> 0 ? g : j, i = j + 8 | 0;
  d = i >> 2;
  Gd(b, c - 40 | 0);
  y[(j + 4 | 0) >> 2] = 27;
  y[d] = y[X + 444 >> 2];
  y[d + 1] = y[X + 448 >> 2];
  y[d + 2] = y[X + 452 >> 2];
  y[d + 3] = y[X + 456 >> 2];
  y[X + 444 >> 2] = b;
  y[X + 448 >> 2] = c;
  y[X + 456 >> 2] = 0;
  y[X + 452 >> 2] = i;
  d = j + 28 | 0;
  y[d >> 2] = 7;
  i = (j + 32 | 0) >>> 0 < h >>> 0;
  a:do {
    if(i) {
      for(var f = d;;) {
        var k = f + 4 | 0;
        y[k >> 2] = 7;
        if((f + 8 | 0) >>> 0 >= h >>> 0) {
          break a
        }
        f = k
      }
    }
  }while(0);
  h = (j | 0) == (g | 0);
  a:do {
    if(!h) {
      d = j - g | 0;
      i = g + d | 0;
      f = d + (g + 4) | 0;
      y[f >> 2] = y[f >> 2] & -2;
      y[e + 1] = d | 1;
      y[i >> 2] = d;
      if(d >>> 0 < 256) {
        f = d >>> 2 & 1073741822;
        i = (f << 2) + X + 40 | 0;
        k = C[X >> 2];
        d = 1 << (d >>> 3);
        if((k & d | 0) == 0) {
          y[X >> 2] = k | d;
          d = i;
          f = (f + 2 << 2) + X + 40 | 0
        }else {
          f = (f + 2 << 2) + X + 40 | 0;
          d = C[f >> 2];
          if(d >>> 0 < C[X + 16 >> 2] >>> 0) {
            $();
            a("Reached an unreachable!")
          }
        }
        y[f >> 2] = g;
        y[d + 12 >> 2] = g;
        y[e + 2] = d;
        y[e + 3] = i
      }else {
        i = g;
        k = d >>> 8;
        if((k | 0) == 0) {
          f = 0
        }else {
          if(d >>> 0 > 16777215) {
            f = 31
          }else {
            var f = (k + 1048320 | 0) >>> 16 & 8, o = k << f, k = (o + 520192 | 0) >>> 16 & 4, o = o << k, m = (o + 245760 | 0) >>> 16 & 2, f = 14 - (k | f | m) + (o << m >>> 15) | 0, f = d >>> ((f + 7 | 0) >>> 0) & 1 | f << 1
          }
        }
        k = (f << 2) + X + 304 | 0;
        y[e + 7] = f;
        y[e + 5] = 0;
        y[e + 4] = 0;
        o = y[X + 4 >> 2];
        m = 1 << f;
        if((o & m | 0) == 0) {
          y[X + 4 >> 2] = o | m;
          y[k >> 2] = i;
          y[e + 6] = k;
          y[e + 3] = g;
          y[e + 2] = g
        }else {
          f = d << ((f | 0) == 31 ? 0 : 25 - (f >>> 1) | 0);
          for(k = y[k >> 2];;) {
            if((y[k + 4 >> 2] & -8 | 0) == (d | 0)) {
              var o = k + 8 | 0, m = C[o >> 2], t = C[X + 16 >> 2], s = k >>> 0 < t >>> 0;
              do {
                if(!s && m >>> 0 >= t >>> 0) {
                  y[m + 12 >> 2] = i;
                  y[o >> 2] = i;
                  y[e + 2] = m;
                  y[e + 3] = k;
                  y[e + 6] = 0;
                  break a
                }
              }while(0);
              $();
              a("Reached an unreachable!")
            }
            o = (f >>> 31 << 2) + k + 16 | 0;
            m = C[o >> 2];
            if((m | 0) == 0) {
              if(o >>> 0 >= C[X + 16 >> 2] >>> 0) {
                y[o >> 2] = i;
                y[e + 6] = k;
                y[e + 3] = g;
                y[e + 2] = g;
                break a
              }
              $();
              a("Reached an unreachable!")
            }
            f = f << 1;
            k = m
          }
        }
      }
    }
  }while(0)
}
Id.X = 1;
function yc(b, c) {
  function d(b) {
    var d;
    if(b === "double") {
      d = (Zb[0] = y[c + g >> 2], Zb[1] = y[c + g + 4 >> 2], Yb[0])
    }else {
      if(b == "i64") {
        d = [y[c + g >> 2], y[c + g + 4 >> 2]]
      }else {
        b = "i32";
        d = y[c + g >> 2]
      }
    }
    g = g + Math.max(Wa(b), Xa);
    return d
  }
  for(var e = b, g = 0, h = [], j, i;;) {
    var f = e;
    j = v[e];
    if(j === 0) {
      break
    }
    i = v[e + 1];
    if(j == 37) {
      var k = n, o = n, m = n, t = n;
      a:for(;;) {
        switch(i) {
          case 43:
            k = l;
            break;
          case 45:
            o = l;
            break;
          case 35:
            m = l;
            break;
          case 48:
            if(t) {
              break a
            }else {
              t = l;
              break
            }
          ;
          default:
            break a
        }
        e++;
        i = v[e + 1]
      }
      var s = 0;
      if(i == 42) {
        s = d("i32");
        e++;
        i = v[e + 1]
      }else {
        for(;i >= 48 && i <= 57;) {
          s = s * 10 + (i - 48);
          e++;
          i = v[e + 1]
        }
      }
      var w = n;
      if(i == 46) {
        var u = 0, w = l;
        e++;
        i = v[e + 1];
        if(i == 42) {
          u = d("i32");
          e++
        }else {
          for(;;) {
            i = v[e + 1];
            if(i < 48 || i > 57) {
              break
            }
            u = u * 10 + (i - 48);
            e++
          }
        }
        i = v[e + 1]
      }else {
        u = 6
      }
      var r;
      switch(String.fromCharCode(i)) {
        case "h":
          i = v[e + 2];
          if(i == 104) {
            e++;
            r = 1
          }else {
            r = 2
          }
          break;
        case "l":
          i = v[e + 2];
          if(i == 108) {
            e++;
            r = 8
          }else {
            r = 4
          }
          break;
        case "L":
        ;
        case "q":
        ;
        case "j":
          r = 8;
          break;
        case "z":
        ;
        case "t":
        ;
        case "I":
          r = 4;
          break;
        default:
          r = pa
      }
      r && e++;
      i = v[e + 1];
      if(["d", "i", "u", "o", "x", "X", "p"].indexOf(String.fromCharCode(i)) != -1) {
        f = i == 100 || i == 105;
        r = r || 4;
        j = d("i" + r * 8);
        r == 8 && (j = i == 117 ? (j[0] >>> 0) + (j[1] >>> 0) * 4294967296 : (j[0] >>> 0) + (j[1] | 0) * 4294967296);
        r <= 4 && (j = (f ? vc : uc)(j & Math.pow(256, r) - 1, r * 8));
        var x = Math.abs(j), p, f = "";
        if(i == 100 || i == 105) {
          p = vc(j, 8 * r).toString(10)
        }else {
          if(i == 117) {
            p = uc(j, 8 * r).toString(10);
            j = Math.abs(j)
          }else {
            if(i == 111) {
              p = (m ? "0" : "") + x.toString(8)
            }else {
              if(i == 120 || i == 88) {
                f = m ? "0x" : "";
                if(j < 0) {
                  j = -j;
                  p = (x - 1).toString(16);
                  m = [];
                  for(x = 0;x < p.length;x++) {
                    m.push((15 - parseInt(p[x], 16)).toString(16))
                  }
                  for(p = m.join("");p.length < r * 2;) {
                    p = "f" + p
                  }
                }else {
                  p = x.toString(16)
                }
                if(i == 88) {
                  f = f.toUpperCase();
                  p = p.toUpperCase()
                }
              }else {
                if(i == 112) {
                  if(x === 0) {
                    p = "(nil)"
                  }else {
                    f = "0x";
                    p = x.toString(16)
                  }
                }
              }
            }
          }
        }
        if(w) {
          for(;p.length < u;) {
            p = "0" + p
          }
        }
        for(k && (f = j < 0 ? "-" + f : "+" + f);f.length + p.length < s;) {
          o ? p = p + " " : t ? p = "0" + p : f = " " + f
        }
        p = f + p;
        p.split("").forEach(function(b) {
          h.push(b.charCodeAt(0))
        })
      }else {
        if(["f", "F", "e", "E", "g", "G"].indexOf(String.fromCharCode(i)) != -1) {
          j = d("double");
          if(isNaN(j)) {
            p = "nan";
            t = n
          }else {
            if(isFinite(j)) {
              w = n;
              r = Math.min(u, 20);
              if(i == 103 || i == 71) {
                w = l;
                u = u || 1;
                r = parseInt(j.toExponential(r).split("e")[1], 10);
                if(u > r && r >= -4) {
                  i = (i == 103 ? "f" : "F").charCodeAt(0);
                  u = u - (r + 1)
                }else {
                  i = (i == 103 ? "e" : "E").charCodeAt(0);
                  u--
                }
                r = Math.min(u, 20)
              }
              if(i == 101 || i == 69) {
                p = j.toExponential(r);
                /[eE][-+]\d$/.test(p) && (p = p.slice(0, -1) + "0" + p.slice(-1))
              }else {
                if(i == 102 || i == 70) {
                  p = j.toFixed(r)
                }
              }
              f = p.split("e");
              if(w && !m) {
                for(;f[0].length > 1 && f[0].indexOf(".") != -1 && (f[0].slice(-1) == "0" || f[0].slice(-1) == ".");) {
                  f[0] = f[0].slice(0, -1)
                }
              }else {
                for(m && p.indexOf(".") == -1 && (f[0] = f[0] + ".");u > r++;) {
                  f[0] = f[0] + "0"
                }
              }
              p = f[0] + (f.length > 1 ? "e" + f[1] : "");
              i == 69 && (p = p.toUpperCase());
              k && j >= 0 && (p = "+" + p)
            }else {
              p = (j < 0 ? "-" : "") + "inf";
              t = n
            }
          }
          for(;p.length < s;) {
            p = o ? p + " " : t && (p[0] == "-" || p[0] == "+") ? p[0] + "0" + p.slice(1) : (t ? "0" : " ") + p
          }
          i < 97 && (p = p.toUpperCase());
          p.split("").forEach(function(b) {
            h.push(b.charCodeAt(0))
          })
        }else {
          if(i == 115) {
            if(k = d("i8*")) {
              k = tc(k);
              w && k.length > u && (k = k.slice(0, u))
            }else {
              k = jc("(null)", l)
            }
            if(!o) {
              for(;k.length < s--;) {
                h.push(32)
              }
            }
            h = h.concat(k);
            if(o) {
              for(;k.length < s--;) {
                h.push(32)
              }
            }
          }else {
            if(i == 99) {
              for(o && h.push(d("i8"));--s > 0;) {
                h.push(32)
              }
              o || h.push(d("i8"))
            }else {
              if(i == 110) {
                o = d("i32*");
                y[o >> 2] = h.length
              }else {
                if(i == 37) {
                  h.push(j)
                }else {
                  for(x = f;x < e + 2;x++) {
                    h.push(v[x])
                  }
                }
              }
            }
          }
        }
      }
      e = e + 2
    }else {
      h.push(j);
      e = e + 1
    }
  }
  return h
}
var Pd = 13, Qd = 9, Rd = 22, Sd = 5, Vd = 21, Wd = 6;
function Xd(b) {
  Jd || (Jd = G([0], "i32", D));
  y[Jd >> 2] = b
}
var Jd, Yd = 0, zc = 0, Zd = 0, $d = 2, Ec = [pa], ae = l;
function be(b, c) {
  if(typeof b !== "string") {
    return pa
  }
  c === aa && (c = "/");
  b && b[0] == "/" && (c = "");
  for(var d = (c + "/" + b).split("/").reverse(), e = [""];d.length;) {
    var g = d.pop();
    g == "" || g == "." || (g == ".." ? e.length > 1 && e.pop() : e.push(g))
  }
  return e.length == 1 ? "/" : e.join("/")
}
function ce(b, c, d) {
  var e = {ga:n, l:n, error:0, name:pa, path:pa, object:pa, v:n, z:pa, w:pa}, b = be(b);
  if(b == "/") {
    e.ga = l;
    e.l = e.v = l;
    e.name = "/";
    e.path = e.z = "/";
    e.object = e.w = de
  }else {
    if(b !== pa) {
      for(var d = d || 0, b = b.slice(1).split("/"), g = de, h = [""];b.length;) {
        if(b.length == 1 && g.d) {
          e.v = l;
          e.z = h.length == 1 ? "/" : h.join("/");
          e.w = g;
          e.name = b[0]
        }
        var j = b.shift();
        if(g.d) {
          if(g.A) {
            if(!g.c.hasOwnProperty(j)) {
              e.error = 2;
              break
            }
          }else {
            e.error = Pd;
            break
          }
        }else {
          e.error = 20;
          break
        }
        g = g.c[j];
        if(g.link && !(c && b.length == 0)) {
          if(d > 40) {
            e.error = 40;
            break
          }
          e = be(g.link, h.join("/"));
          return ce([e].concat(b).join("/"), c, d + 1)
        }
        h.push(j);
        if(b.length == 0) {
          e.l = l;
          e.path = h.join("/");
          e.object = g
        }
      }
    }
  }
  return e
}
function ee(b) {
  fe();
  b = ce(b, aa);
  if(b.l) {
    return b.object
  }
  Xd(b.error);
  return pa
}
function ge(b, c, d, e, g) {
  b || (b = "/");
  typeof b === "string" && (b = ee(b));
  if(!b) {
    Xd(Pd);
    a(Error("Parent path must exist."))
  }
  if(!b.d) {
    Xd(20);
    a(Error("Parent must be a folder."))
  }
  if(!b.write && !ae) {
    Xd(Pd);
    a(Error("Parent folder must be writeable."))
  }
  if(!c || c == "." || c == "..") {
    Xd(2);
    a(Error("Name must not be empty."))
  }
  if(b.c.hasOwnProperty(c)) {
    Xd(17);
    a(Error("Can't overwrite object."))
  }
  b.c[c] = {A:e === aa ? l : e, write:g === aa ? n : g, timestamp:Date.now(), fa:$d++};
  for(var h in d) {
    d.hasOwnProperty(h) && (b.c[c][h] = d[h])
  }
  return b.c[c]
}
function he(b, c) {
  return ge(b, c, {d:l, h:n, c:{}}, l, l)
}
function ie() {
  var b = "dev/shm/tmp", c = ee("/");
  c === pa && a(Error("Invalid parent."));
  for(b = b.split("/").reverse();b.length;) {
    var d = b.pop();
    if(d) {
      c.c.hasOwnProperty(d) || he(c, d);
      c = c.c[d]
    }
  }
}
function je(b, c, d, e) {
  !d && !e && a(Error("A device must have at least one callback defined."));
  var g = {h:l, input:d, e:e};
  g.d = n;
  return ge(b, c, g, Boolean(d), Boolean(e))
}
function fe() {
  de || (de = {A:l, write:l, d:l, h:n, timestamp:Date.now(), fa:1, c:{}})
}
function ke() {
  var b, c, d;
  function e(b) {
    if(b === pa || b === 10) {
      c.j(c.buffer.join(""));
      c.buffer = []
    }else {
      c.buffer.push(String.fromCharCode(b))
    }
  }
  Ya(!le, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
  le = l;
  fe();
  b = b || Module.stdin;
  c = c || Module.stdout;
  d = d || Module.stderr;
  var g = l, h = l, j = l;
  if(!b) {
    g = n;
    b = function() {
      if(!b.k || !b.k.length) {
        var c;
        typeof window != "undefined" && typeof window.prompt == "function" ? c = window.prompt("Input: ") : typeof readline == "function" && (c = readline());
        c || (c = "");
        b.k = jc(c + "\n", l)
      }
      return b.k.shift()
    }
  }
  if(!c) {
    h = n;
    c = e
  }
  if(!c.j) {
    c.j = print
  }
  if(!c.buffer) {
    c.buffer = []
  }
  if(!d) {
    j = n;
    d = e
  }
  if(!d.j) {
    d.j = print
  }
  if(!d.buffer) {
    d.buffer = []
  }
  he("/", "tmp");
  var i = he("/", "dev"), f = je(i, "stdin", b), k = je(i, "stdout", pa, c);
  d = je(i, "stderr", pa, d);
  je(i, "tty", b, c);
  Ec[1] = {path:"/dev/stdin", object:f, position:0, t:l, i:n, s:n, u:!g, error:n, q:n, B:[]};
  Ec[2] = {path:"/dev/stdout", object:k, position:0, t:n, i:l, s:n, u:!h, error:n, q:n, B:[]};
  Ec[3] = {path:"/dev/stderr", object:d, position:0, t:n, i:l, s:n, u:!j, error:n, q:n, B:[]};
  Yd = G([1], "void*", D);
  zc = G([2], "void*", D);
  Zd = G([3], "void*", D);
  ie();
  Ec[Yd] = Ec[1];
  Ec[zc] = Ec[2];
  Ec[Zd] = Ec[3];
  G([G([0, 0, 0, 0, Yd, 0, 0, 0, zc, 0, 0, 0, Zd, 0, 0, 0], "void*", D)], "void*", D)
}
var le, de;
function Dc(b, c, d) {
  var e = Ec[b];
  if(e) {
    if(e.i) {
      if(d < 0) {
        Xd(Rd);
        return-1
      }
      if(e.object.h) {
        if(e.object.e) {
          for(var g = 0;g < d;g++) {
            try {
              e.object.e(v[c + g])
            }catch(h) {
              Xd(Sd);
              return-1
            }
          }
          e.object.timestamp = Date.now();
          return g
        }
        Xd(Wd);
        return-1
      }
      g = e.position;
      b = Ec[b];
      if(!b || b.object.h) {
        Xd(Qd);
        c = -1
      }else {
        if(b.i) {
          if(b.object.d) {
            Xd(Vd);
            c = -1
          }else {
            if(d < 0 || g < 0) {
              Xd(Rd);
              c = -1
            }else {
              for(var j = b.object.c;j.length < g;) {
                j.push(0)
              }
              for(var i = 0;i < d;i++) {
                j[g + i] = z[c + i]
              }
              b.object.timestamp = Date.now();
              c = i
            }
          }
        }else {
          Xd(Pd);
          c = -1
        }
      }
      if(c != -1) {
        e.position = e.position + c
      }
      return c
    }
    Xd(Pd);
    return-1
  }
  Xd(Qd);
  return-1
}
function bc(b, c, d) {
  if(d >= 20) {
    for(d = b + d;b % 4;) {
      v[b++] = c
    }
    c < 0 && (c = c + 256);
    for(var b = b >> 2, e = d >> 2, g = c | c << 8 | c << 16 | c << 24;b < e;) {
      y[b++] = g
    }
    for(b = b << 2;b < d;) {
      v[b++] = c
    }
  }else {
    for(;d--;) {
      v[b++] = c
    }
  }
}
function $() {
  a("ABORT: undefined, at " + Error().stack)
}
function Nd() {
  switch(8) {
    case 8:
      return ec;
    case 54:
    ;
    case 56:
    ;
    case 21:
    ;
    case 61:
    ;
    case 63:
    ;
    case 22:
    ;
    case 67:
    ;
    case 23:
    ;
    case 24:
    ;
    case 25:
    ;
    case 26:
    ;
    case 27:
    ;
    case 69:
    ;
    case 28:
    ;
    case 101:
    ;
    case 70:
    ;
    case 71:
    ;
    case 29:
    ;
    case 30:
    ;
    case 199:
    ;
    case 75:
    ;
    case 76:
    ;
    case 32:
    ;
    case 43:
    ;
    case 44:
    ;
    case 80:
    ;
    case 46:
    ;
    case 47:
    ;
    case 45:
    ;
    case 48:
    ;
    case 49:
    ;
    case 42:
    ;
    case 82:
    ;
    case 33:
    ;
    case 7:
    ;
    case 108:
    ;
    case 109:
    ;
    case 107:
    ;
    case 112:
    ;
    case 119:
    ;
    case 121:
      return 200809;
    case 13:
    ;
    case 104:
    ;
    case 94:
    ;
    case 95:
    ;
    case 34:
    ;
    case 35:
    ;
    case 77:
    ;
    case 81:
    ;
    case 83:
    ;
    case 84:
    ;
    case 85:
    ;
    case 86:
    ;
    case 87:
    ;
    case 88:
    ;
    case 89:
    ;
    case 90:
    ;
    case 91:
    ;
    case 94:
    ;
    case 95:
    ;
    case 110:
    ;
    case 111:
    ;
    case 113:
    ;
    case 114:
    ;
    case 115:
    ;
    case 116:
    ;
    case 117:
    ;
    case 118:
    ;
    case 120:
    ;
    case 40:
    ;
    case 16:
    ;
    case 79:
    ;
    case 19:
      return-1;
    case 92:
    ;
    case 93:
    ;
    case 5:
    ;
    case 72:
    ;
    case 6:
    ;
    case 74:
    ;
    case 92:
    ;
    case 93:
    ;
    case 96:
    ;
    case 97:
    ;
    case 98:
    ;
    case 99:
    ;
    case 102:
    ;
    case 103:
    ;
    case 105:
      return 1;
    case 38:
    ;
    case 66:
    ;
    case 50:
    ;
    case 51:
    ;
    case 4:
      return 1024;
    case 15:
    ;
    case 64:
    ;
    case 41:
      return 32;
    case 55:
    ;
    case 37:
    ;
    case 17:
      return 2147483647;
    case 18:
    ;
    case 1:
      return 47839;
    case 59:
    ;
    case 57:
      return 99;
    case 68:
    ;
    case 58:
      return 2048;
    case 0:
      return 2097152;
    case 3:
      return 65536;
    case 14:
      return 32768;
    case 73:
      return 32767;
    case 39:
      return 16384;
    case 60:
      return 1E3;
    case 106:
      return 700;
    case 52:
      return 256;
    case 62:
      return 255;
    case 2:
      return 100;
    case 65:
      return 64;
    case 36:
      return 20;
    case 100:
      return 16;
    case 20:
      return 6;
    case 53:
      return 4
  }
  Xd(Rd);
  return-1
}
function Fd(b) {
  if(!me) {
    eb = eb + 4095 >> 12 << 12;
    me = l
  }
  var c = eb;
  b != 0 && db(b);
  return c
}
var me;
pc.unshift({r:function() {
  ae = n;
  le || ke()
}});
qc.push({r:function() {
  if(le) {
    Ec[2] && Ec[2].object.e.buffer.length > 0 && Ec[2].object.e(10);
    Ec[3] && Ec[3].object.e.buffer.length > 0 && Ec[3].object.e(10)
  }
}});
Xd(0);
G(12, "void*", D);
Module.ea = function(b) {
  function c() {
    for(var b = 0;b < 3;b++) {
      e.push(0)
    }
  }
  var d = b.length + 1, e = [G(jc("/bin/this.program"), "i8", D)];
  c();
  for(var g = 0;g < d - 1;g = g + 1) {
    e.push(G(jc(b[g]), "i8", D));
    c()
  }
  e.push(0);
  e = G(e, "i32", D);
  return _main(d, e, 0)
};
var Gc, Hc, vd, X, Cd, ne, oe, pe, qe, re;
M.G = G([37, 115, 40, 37, 117, 41, 58, 32, 65, 115, 115, 101, 114, 116, 105, 111, 110, 32, 102, 97, 105, 108, 117, 114, 101, 58, 32, 34, 37, 115, 34, 10, 0], "i8", D);
M.H = G([109, 95, 115, 105, 122, 101, 32, 60, 61, 32, 109, 95, 99, 97, 112, 97, 99, 105, 116, 121, 0], "i8", D);
M.O = G([46, 47, 99, 114, 110, 95, 100, 101, 99, 111, 109, 112, 46, 104, 0], "i8", D);
M.T = G([109, 105, 110, 95, 110, 101, 119, 95, 99, 97, 112, 97, 99, 105, 116, 121, 32, 60, 32, 40, 48, 120, 55, 70, 70, 70, 48, 48, 48, 48, 85, 32, 47, 32, 101, 108, 101, 109, 101, 110, 116, 95, 115, 105, 122, 101, 41, 0], "i8", D);
M.Y = G([110, 101, 119, 95, 99, 97, 112, 97, 99, 105, 116, 121, 32, 38, 38, 32, 40, 110, 101, 119, 95, 99, 97, 112, 97, 99, 105, 116, 121, 32, 62, 32, 109, 95, 99, 97, 112, 97, 99, 105, 116, 121, 41, 0], "i8", D);
M.Z = G([110, 117, 109, 95, 99, 111, 100, 101, 115, 91, 99, 93, 0], "i8", D);
M.$ = G([115, 111, 114, 116, 101, 100, 95, 112, 111, 115, 32, 60, 32, 116, 111, 116, 97, 108, 95, 117, 115, 101, 100, 95, 115, 121, 109, 115, 0], "i8", D);
M.aa = G([112, 67, 111, 100, 101, 115, 105, 122, 101, 115, 91, 115, 121, 109, 95, 105, 110, 100, 101, 120, 93, 32, 61, 61, 32, 99, 111, 100, 101, 115, 105, 122, 101, 0], "i8", D);
M.ba = G([116, 32, 60, 32, 40, 49, 85, 32, 60, 60, 32, 116, 97, 98, 108, 101, 95, 98, 105, 116, 115, 41, 0], "i8", D);
M.ca = G([109, 95, 108, 111, 111, 107, 117, 112, 91, 116, 93, 32, 61, 61, 32, 99, 85, 73, 78, 84, 51, 50, 95, 77, 65, 88, 0], "i8", D);
Gc = G([2], ["i8* (i8*, i32, i32*, i1, i8*)*", 0, 0, 0, 0], D);
G([4], ["i32 (i8*, i8*)*", 0, 0, 0, 0], D);
Hc = G(1, "i8*", D);
M.m = G([99, 114, 110, 100, 95, 109, 97, 108, 108, 111, 99, 58, 32, 115, 105, 122, 101, 32, 116, 111, 111, 32, 98, 105, 103, 0], "i8", D);
M.I = G([99, 114, 110, 100, 95, 109, 97, 108, 108, 111, 99, 58, 32, 111, 117, 116, 32, 111, 102, 32, 109, 101, 109, 111, 114, 121, 0], "i8", D);
M.n = G([40, 40, 117, 105, 110, 116, 51, 50, 41, 112, 95, 110, 101, 119, 32, 38, 32, 40, 67, 82, 78, 68, 95, 77, 73, 78, 95, 65, 76, 76, 79, 67, 95, 65, 76, 73, 71, 78, 77, 69, 78, 84, 32, 45, 32, 49, 41, 41, 32, 61, 61, 32, 48, 0], "i8", D);
M.J = G([99, 114, 110, 100, 95, 114, 101, 97, 108, 108, 111, 99, 58, 32, 98, 97, 100, 32, 112, 116, 114, 0], "i8", D);
M.K = G([99, 114, 110, 100, 95, 102, 114, 101, 101, 58, 32, 98, 97, 100, 32, 112, 116, 114, 0], "i8", D);
M.ma = G([99, 114, 110, 100, 95, 109, 115, 105, 122, 101, 58, 32, 98, 97, 100, 32, 112, 116, 114, 0], "i8", D);
G([1, 0, 0, 0, 2, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 16, 0, 0, 0, 32, 0, 0, 0, 64, 0, 0, 0, 128, 0, 0, 0, 256, 0, 0, 0, 512, 0, 0, 0, 1024, 0, 0, 0, 2048, 0, 0, 0, 4096, 0, 0, 0, 8192, 0, 0, 0, 16384, 0, 0, 0, 32768, 0, 0, 0, 65536, 0, 0, 0, 131072, 0, 0, 0, 262144, 0, 0, 0, 524288, 0, 0, 0, 1048576, 0, 0, 0, 2097152, 0, 0, 0, 4194304, 0, 0, 0, 8388608, 0, 0, 0, 16777216, 0, 0, 0, 33554432, 0, 0, 0, 67108864, 0, 0, 0, 134217728, 0, 0, 0, 268435456, 0, 0, 0, 536870912, 0, 0, 0, 1073741824, 0, 0, 0, 
-2147483648, 0, 0, 0], ["i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 
0, "i32", 0, 0, 0, "i32", 0, 0, 0], D);
M.M = G([102, 97, 108, 115, 101, 0], "i8", D);
M.na = G([99, 114, 110, 100, 95, 118, 97, 108, 105, 100, 97, 116, 101, 95, 102, 105, 108, 101, 40, 38, 110, 101, 119, 95, 104, 101, 97, 100, 101, 114, 44, 32, 97, 99, 116, 117, 97, 108, 95, 98, 97, 115, 101, 95, 100, 97, 116, 97, 95, 115, 105, 122, 101, 44, 32, 78, 85, 76, 76, 41, 0], "i8", D);
M.oa = G([40, 116, 111, 116, 97, 108, 95, 115, 121, 109, 115, 32, 62, 61, 32, 49, 41, 32, 38, 38, 32, 40, 116, 111, 116, 97, 108, 95, 115, 121, 109, 115, 32, 60, 61, 32, 112, 114, 101, 102, 105, 120, 95, 99, 111, 100, 105, 110, 103, 58, 58, 99, 77, 97, 120, 83, 117, 112, 112, 111, 114, 116, 101, 100, 83, 121, 109, 115, 41, 32, 38, 38, 32, 40, 99, 111, 100, 101, 95, 115, 105, 122, 101, 95, 108, 105, 109, 105, 116, 32, 62, 61, 32, 49, 41, 0], "i8", D);
M.N = G([40, 116, 111, 116, 97, 108, 95, 115, 121, 109, 115, 32, 62, 61, 32, 49, 41, 32, 38, 38, 32, 40, 116, 111, 116, 97, 108, 95, 115, 121, 109, 115, 32, 60, 61, 32, 112, 114, 101, 102, 105, 120, 95, 99, 111, 100, 105, 110, 103, 58, 58, 99, 77, 97, 120, 83, 117, 112, 112, 111, 114, 116, 101, 100, 83, 121, 109, 115, 41, 0], "i8", D);
M.C = G([17, 18, 19, 20, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15, 16], "i8", D);
M.o = G([48, 0], "i8", D);
M.P = G([110, 117, 109, 95, 98, 105, 116, 115, 32, 60, 61, 32, 51, 50, 85, 0], "i8", D);
M.Q = G([109, 95, 98, 105, 116, 95, 99, 111, 117, 110, 116, 32, 60, 61, 32, 99, 66, 105, 116, 66, 117, 102, 83, 105, 122, 101, 0], "i8", D);
M.R = G([116, 32, 33, 61, 32, 99, 85, 73, 78, 84, 51, 50, 95, 77, 65, 88, 0], "i8", D);
M.S = G([109, 111, 100, 101, 108, 46, 109, 95, 99, 111, 100, 101, 95, 115, 105, 122, 101, 115, 91, 115, 121, 109, 93, 32, 61, 61, 32, 108, 101, 110, 0], "i8", D);
G([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 4, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 7, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 4, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 6, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 7, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 
0, 8, 0, 0, 0], ["i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 
0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 
0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 
0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 
0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 
0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0], D);
G([0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 4, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 7, 0, 0, 0, 4, 0, 0, 0, 4, 0, 
0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0], ["i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 
0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0], D);
M.ha = G([0, 3, 1, 2], "i8", D);
M.b = G([0, 2, 3, 1], "i8", D);
M.ia = G([0, 7, 1, 2, 3, 4, 5, 6], "i8", D);
M.a = G([0, 2, 3, 4, 5, 6, 7, 1], "i8", D);
M.ja = G([1, 0, 5, 4, 3, 2, 6, 7], "i8", D);
M.ka = G([1, 0, 7, 6, 5, 4, 3, 2], "i8", D);
M.qa = G([105, 110, 100, 101, 120, 32, 60, 32, 50, 0], "i8", D);
M.ra = G([40, 108, 111, 32, 60, 61, 32, 48, 120, 70, 70, 70, 70, 85, 41, 32, 38, 38, 32, 40, 104, 105, 32, 60, 61, 32, 48, 120, 70, 70, 70, 70, 85, 41, 0], "i8", D);
M.sa = G([40, 120, 32, 60, 32, 99, 68, 88, 84, 66, 108, 111, 99, 107, 83, 105, 122, 101, 41, 32, 38, 38, 32, 40, 121, 32, 60, 32, 99, 68, 88, 84, 66, 108, 111, 99, 107, 83, 105, 122, 101, 41, 0], "i8", D);
M.ta = G([118, 97, 108, 117, 101, 32, 60, 61, 32, 48, 120, 70, 70, 0], "i8", D);
M.ua = G([118, 97, 108, 117, 101, 32, 60, 61, 32, 48, 120, 70, 0], "i8", D);
M.va = G([40, 108, 111, 32, 60, 61, 32, 48, 120, 70, 70, 41, 32, 38, 38, 32, 40, 104, 105, 32, 60, 61, 32, 48, 120, 70, 70, 41, 0], "i8", D);
M.g = G([105, 32, 60, 32, 109, 95, 115, 105, 122, 101, 0], "i8", D);
M.p = G([110, 117, 109, 32, 38, 38, 32, 40, 110, 117, 109, 32, 61, 61, 32, 126, 110, 117, 109, 95, 99, 104, 101, 99, 107, 41, 0], "i8", D);
M.f = G([1, 2, 2, 3, 3, 3, 3, 4], "i8", D);
vd = G([0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 2, 1, 2, 0, 0, 0, 1, 0, 2, 1, 0, 2, 0, 0, 1, 2, 3], "i8", D);
M.U = G([110, 101, 120, 116, 95, 108, 101, 118, 101, 108, 95, 111, 102, 115, 32, 62, 32, 99, 117, 114, 95, 108, 101, 118, 101, 108, 95, 111, 102, 115, 0], "i8", D);
M.W = G([40, 108, 101, 110, 32, 62, 61, 32, 49, 41, 32, 38, 38, 32, 40, 108, 101, 110, 32, 60, 61, 32, 99, 77, 97, 120, 69, 120, 112, 101, 99, 116, 101, 100, 67, 111, 100, 101, 83, 105, 122, 101, 41, 0], "i8", D);
X = G(468, ["i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, 
"*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 
0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 
0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0], D);
Cd = G(24, "i32", D);
M.wa = G([109, 97, 120, 32, 115, 121, 115, 116, 101, 109, 32, 98, 121, 116, 101, 115, 32, 61, 32, 37, 49, 48, 108, 117, 10, 0], "i8", D);
M.la = G([115, 121, 115, 116, 101, 109, 32, 98, 121, 116, 101, 115, 32, 32, 32, 32, 32, 61, 32, 37, 49, 48, 108, 117, 10, 0], "i8", D);
M.pa = G([105, 110, 32, 117, 115, 101, 32, 98, 121, 116, 101, 115, 32, 32, 32, 32, 32, 61, 32, 37, 49, 48, 108, 117, 10, 0], "i8", D);
G([0], "i8", D);
G(1, "void ()*", D);
ne = G([0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 8, 0, 0, 0, 10, 0, 0, 0], ["*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0], D);
G(1, "void*", D);
M.V = G([115, 116, 100, 58, 58, 98, 97, 100, 95, 97, 108, 108, 111, 99, 0], "i8", D);
oe = G([0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 14, 0, 0, 0, 16, 0, 0, 0], ["*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0], D);
G(1, "void*", D);
M.L = G([98, 97, 100, 95, 97, 114, 114, 97, 121, 95, 110, 101, 119, 95, 108, 101, 110, 103, 116, 104, 0], "i8", D);
M.F = G([83, 116, 57, 98, 97, 100, 95, 97, 108, 108, 111, 99, 0], "i8", D);
qe = G(12, "*", D);
M.D = G([83, 116, 50, 48, 98, 97, 100, 95, 97, 114, 114, 97, 121, 95, 110, 101, 119, 95, 108, 101, 110, 103, 116, 104, 0], "i8", D);
re = G(12, "*", D);
y[ne + 4 >> 2] = qe;
y[oe + 4 >> 2] = re;
pe = G([2, 0, 0, 0, 0], ["i8*", 0, 0, 0, 0], D);
y[qe >> 2] = pe + 8 | 0;
y[qe + 4 >> 2] = M.F | 0;
y[qe + 8 >> 2] = aa;
y[re >> 2] = pe + 8 | 0;
y[re + 4 >> 2] = M.D | 0;
y[re + 8 >> 2] = qe;
dc = [0, 0, function(b, c, d, e) {
  if((b | 0) == 0) {
    b = ac(c);
    (d | 0) != 0 && (y[d >> 2] = (b | 0) == 0 ? 0 : Od(b));
    d = b
  }else {
    if((c | 0) == 0) {
      Ld(b);
      (d | 0) != 0 && (y[d >> 2] = 0);
      d = 0
    }else {
      var g = (b | 0) == 0 ? ac(c) : Md(b, c), h = (g | 0) != 0, j = h ? g : b;
      if(h | e ^ 1) {
        b = j
      }else {
        g = (b | 0) == 0 ? ac(c) : Md(b, c);
        (g | 0) == 0 ? g = 0 : b = g
      }
      (d | 0) != 0 && (y[d >> 2] = Od(b));
      d = g
    }
  }
  return d
}, 0, function(b) {
  return(b | 0) == 0 ? 0 : Od(b)
}, 0, function(b) {
  aa(b | 0)
}, 0, function(b) {
  aa(b | 0);
  (b | 0) != 0 && Ld(b)
}, 0, function() {
  return M.V | 0
}, 0, function(b) {
  aa(b | 0)
}, 0, function(b) {
  aa(b | 0);
  (b | 0) != 0 && Ld(b)
}, 0, function() {
  return M.L | 0
}, 0];
Module.FUNCTION_TABLE = dc;
function se(b) {
  b = b || Module.arguments;
  nc(pc);
  var c = pa;
  if(Module._main) {
    c = Module.ea(b);
    Module.noExitRuntime || nc(qc)
  }
  return c
}
Module.run = se;
Module.preRun && Module.preRun();
Module.noInitialRun || se();
Module.postRun && Module.postRun();
onmessage = function(msg) {
  var start = Date.now();
  var data = deCrunch(new Uint8Array(msg.data.data), msg.data.filename);
  postMessage({filename:msg.data.filename, data:data, callbackID:msg.data.callbackID, time:Date.now() - start})
};

