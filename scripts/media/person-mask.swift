// Cuts a person out of a photo using Apple's built-in Vision framework (free, on-device).
// Usage: swift person-mask.swift <input image> <output mask.png>
import Foundation
import Vision
import CoreImage
import AppKit

let args = CommandLine.arguments
guard args.count == 3 else { print("usage: person-mask <in> <out.png>"); exit(1) }
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])

guard let image = CIImage(contentsOf: input, options: [.applyOrientationProperty: true]) else {
  print("cannot read \(input.path)"); exit(1)
}
let request = VNGeneratePersonSegmentationRequest()
request.qualityLevel = .accurate
request.outputPixelFormat = kCVPixelFormatType_OneComponent8
try VNImageRequestHandler(ciImage: image, options: [:]).perform([request])
guard let buffer = request.results?.first?.pixelBuffer else { print("no person found"); exit(1) }

// Scale the low-res mask back up to the photo's size.
var mask = CIImage(cvPixelBuffer: buffer)
mask = mask.transformed(by: CGAffineTransform(scaleX: image.extent.width / mask.extent.width,
                                              y: image.extent.height / mask.extent.height))
let ctx = CIContext()
guard let cg = ctx.createCGImage(mask, from: image.extent) else { exit(1) }
let rep = NSBitmapImageRep(cgImage: cg)
try rep.representation(using: .png, properties: [:])!.write(to: output)
print("mask written: \(output.path) \(Int(image.extent.width))x\(Int(image.extent.height))")
