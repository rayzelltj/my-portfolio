// Lifts the main subject out of a photo (like long-pressing a photo on iPhone) using
// Apple's on-device Vision framework. Free, nothing downloaded.
// Usage: swift subject-cutout.swift <input image> <output.png>   (PNG keeps transparency)
import Foundation
import Vision
import CoreImage
import AppKit

let args = CommandLine.arguments
guard args.count == 3 else { print("usage: subject-cutout <in> <out.png>"); exit(1) }
let input = URL(fileURLWithPath: args[1])
guard let image = CIImage(contentsOf: input, options: [.applyOrientationProperty: true]) else {
  print("cannot read \(input.path)"); exit(1)
}
let handler = VNImageRequestHandler(ciImage: image, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let result = request.results?.first else { print("no subject found"); exit(1) }
let buffer = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: true)
let cut = CIImage(cvPixelBuffer: buffer)
let ctx = CIContext()
guard let cg = ctx.createCGImage(cut, from: cut.extent) else { exit(1) }
try NSBitmapImageRep(cgImage: cg).representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: args[2]))
print("cutout: \(args[2]) \(Int(cut.extent.width))x\(Int(cut.extent.height))")
