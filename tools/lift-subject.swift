// Re-cut an object (drone, product) with macOS Vision subject lifting.
//
// Same idea as segment-person.swift but using VNGenerateForegroundInstanceMaskRequest
// (the "lift subject" model, macOS 14+), which works on arbitrary objects.
// Keeps the existing alpha, intersects it with Vision's mask, optional unsharp.
//
// Build & run (macOS 12+, Xcode Command Line Tools):
//   swiftc -O tools/lift-subject.swift -o /tmp/lift
//   /tmp/lift public/drone-fixedwing.png public/drone-fixedwing.png 0.5 0.8 0.3 2
//
// args: <in.png> <out.png> [edgeLo=0.35] [edgeHi=0.65] [sharpen=0.0] [erode=0]
//   edgeLo/edgeHi: mask confidence ramp (lower = keep more hair/edge, higher = crisper)
//   sharpen:       CIUnsharpMask intensity (0 = off, 0.3-0.6 is subtle)
//   erode:         shrink the mask by N px (min filter) to trim halo left at soft edges
import Foundation
import Vision
import CoreImage
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count >= 3 else { print("usage: segment <in.png> <out.png> [edgeLo] [edgeHi] [sharpen]"); exit(1) }
let inPath = args[1], outPath = args[2]
let edgeLo = args.count > 3 ? Double(args[3])! : 0.35
let edgeHi = args.count > 4 ? Double(args[4])! : 0.65
let sharpen = args.count > 5 ? Double(args[5])! : 0.0
let erode = args.count > 6 ? Int(args[6])! : 0

guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: inPath) as CFURL, nil),
      let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else { print("cannot load"); exit(1) }
let w = cg.width, h = cg.height
let cs = CGColorSpaceCreateDeviceRGB()
let bmp = CGImageAlphaInfo.premultipliedLast.rawValue

// original RGBA (premultiplied, rows top-down)
var rgba = [UInt8](repeating: 0, count: w*h*4)
rgba.withUnsafeMutableBytes { buf in
  let ctx = CGContext(data: buf.baseAddress, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w*4, space: cs, bitmapInfo: bmp)!
  ctx.draw(cg, in: CGRect(x: 0, y: 0, width: w, height: h))
}

// composite on mid-gray so the segmenter sees a normal photo
var comp = [UInt8](repeating: 0, count: w*h*4)
for i in 0..<(w*h) {
  let a = Int(rgba[i*4+3])
  for c in 0..<3 { comp[i*4+c] = UInt8(min(255, Int(rgba[i*4+c]) + (255 - a) * 128 / 255)) }
  comp[i*4+3] = 255
}
let compCG: CGImage = comp.withUnsafeMutableBytes { buf in
  let ctx = CGContext(data: buf.baseAddress, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w*4, space: cs, bitmapInfo: bmp)!
  return ctx.makeImage()!
}

let req = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(cgImage: compCG, options: [:])
do { try handler.perform([req]) } catch { print("vision error: \(error)"); exit(1) }
guard let result = req.results?.first else { print("no subject found"); exit(1) }
// float32 mask at (close to) input resolution; rescaled by our own bilinear pass below
let pbF: CVPixelBuffer
do { pbF = try result.generateScaledMaskForImage(forInstances: result.allInstances, from: handler) } catch { print("mask error: \(error)"); exit(1) }
// convert float mask -> 8-bit buffer with the same sampling code as the person tool
let fw = CVPixelBufferGetWidth(pbF), fh = CVPixelBufferGetHeight(pbF)
CVPixelBufferLockBaseAddress(pbF, .readOnly)
let fBase = CVPixelBufferGetBaseAddress(pbF)!.assumingMemoryBound(to: Float.self)
let fRow = CVPixelBufferGetBytesPerRow(pbF) / 4
var m8 = [UInt8](repeating: 0, count: fw*fh)
for y in 0..<fh { for x in 0..<fw { m8[y*fw+x] = UInt8(max(0, min(255, fBase[y*fRow+x] * 255))) } }
CVPixelBufferUnlockBaseAddress(pbF, .readOnly)
var pbOpt: CVPixelBuffer?
CVPixelBufferCreate(nil, fw, fh, kCVPixelFormatType_OneComponent8, nil, &pbOpt)
let pb = pbOpt!
CVPixelBufferLockBaseAddress(pb, [])
let dst = CVPixelBufferGetBaseAddress(pb)!.assumingMemoryBound(to: UInt8.self)
let dRow = CVPixelBufferGetBytesPerRow(pb)
for y in 0..<fh { for x in 0..<fw { dst[y*dRow+x] = m8[y*fw+x] } }
CVPixelBufferUnlockBaseAddress(pb, [])
let mw = CVPixelBufferGetWidth(pb), mh = CVPixelBufferGetHeight(pb)
print("mask \(mw)x\(mh) for image \(w)x\(h)")

// resize mask to full res (manual bilinear sampling straight from the pixel buffer)
CVPixelBufferLockBaseAddress(pb, .readOnly)
let mBase = CVPixelBufferGetBaseAddress(pb)!.assumingMemoryBound(to: UInt8.self)
let mRow = CVPixelBufferGetBytesPerRow(pb)
var mMin = 255, mMax = 0
var mask = [UInt8](repeating: 0, count: w*h)
for y in 0..<h {
  let fy = (Double(y) + 0.5) * Double(mh) / Double(h) - 0.5
  let y0 = max(0, min(mh-1, Int(fy.rounded(.down)))), y1 = min(mh-1, y0+1)
  let ty = max(0, min(1, fy - Double(y0)))
  for x in 0..<w {
    let fx = (Double(x) + 0.5) * Double(mw) / Double(w) - 0.5
    let x0 = max(0, min(mw-1, Int(fx.rounded(.down)))), x1 = min(mw-1, x0+1)
    let tx = max(0, min(1, fx - Double(x0)))
    let a = Double(mBase[y0*mRow + x0]), b = Double(mBase[y0*mRow + x1])
    let c = Double(mBase[y1*mRow + x0]), d = Double(mBase[y1*mRow + x1])
    let v = (a*(1-tx) + b*tx)*(1-ty) + (c*(1-tx) + d*tx)*ty
    let vi = Int(v + 0.5)
    mMin = min(mMin, vi); mMax = max(mMax, vi)
    mask[y*w + x] = UInt8(vi)
  }
}
CVPixelBufferUnlockBaseAddress(pb, .readOnly)
print("mask range \(mMin)..\(mMax)")

// optional erosion: separable min filter of radius `erode`
if erode > 0 {
  var tmp = mask
  for y in 0..<h { for x in 0..<w {
    var m: UInt8 = 255
    for dx in -erode...erode { let xx = min(w-1, max(0, x+dx)); m = min(m, mask[y*w+xx]) }
    tmp[y*w+x] = m } }
  for y in 0..<h { for x in 0..<w {
    var m: UInt8 = 255
    for dy in -erode...erode { let yy = min(h-1, max(0, y+dy)); m = min(m, tmp[yy*w+x]) }
    mask[y*w+x] = m } }
}

// optional sharpen of the colour layer
var colorSrc = rgba
if sharpen > 0 {
  let ciIn = CIImage(cgImage: cg)
  let f = CIFilter(name: "CIUnsharpMask")!
  f.setValue(ciIn, forKey: kCIInputImageKey)
  f.setValue(1.6, forKey: kCIInputRadiusKey)
  f.setValue(sharpen, forKey: kCIInputIntensityKey)
  let outCI = f.outputImage!.cropped(to: ciIn.extent)
  let ctx2 = CIContext(options: [.outputColorSpace: cs, .workingColorSpace: cs])
  if let sharpCG = ctx2.createCGImage(outCI, from: outCI.extent) {
    colorSrc.withUnsafeMutableBytes { buf in
      let ctx = CGContext(data: buf.baseAddress, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w*4, space: cs, bitmapInfo: bmp)!
      ctx.draw(sharpCG, in: CGRect(x: 0, y: 0, width: w, height: h))
    }
  }
}

func smooth(_ x: Double, _ lo: Double, _ hi: Double) -> Double {
  let t = max(0, min(1, (x - lo) / (hi - lo))); return t*t*(3-2*t)
}
var out = [UInt8](repeating: 0, count: w*h*4)
var kept = 0
for i in 0..<(w*h) {
  let oldA = Double(rgba[i*4+3]) / 255
  let mA = smooth(Double(mask[i]) / 255, edgeLo, edgeHi)
  let a = min(oldA, mA)
  if a > 0 {
    kept += 1
    let srcA = Double(colorSrc[i*4+3]) / 255
    for c in 0..<3 {
      let col = srcA > 0 ? min(1, Double(colorSrc[i*4+c]) / 255 / srcA) : 0
      out[i*4+c] = UInt8(min(255, max(0, col * a * 255 + 0.5)))
    }
  }
  out[i*4+3] = UInt8(min(255, max(0, a * 255 + 0.5)))
}
print("opaque-ish pixels kept: \(kept*100/(w*h))%")

let outCG: CGImage = out.withUnsafeMutableBytes { buf in
  let ctx = CGContext(data: buf.baseAddress, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w*4, space: cs, bitmapInfo: bmp)!
  return ctx.makeImage()!
}
let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: outPath) as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, outCG, nil)
if !CGImageDestinationFinalize(dest) { print("write failed"); exit(1) }
print("wrote \(outPath)")
