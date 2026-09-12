import Foundation
import Vision
import AppKit

let args = CommandLine.arguments.dropFirst()
for path in args {
    guard let image = NSImage(contentsOfFile: path),
          let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        fputs("Cannot load \(path)\n", stderr)
        continue
    }
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    request.recognitionLanguages = ["hi-IN", "en-US"]
    let handler = VNImageRequestHandler(cgImage: cgImage)
    try handler.perform([request])
    let observations = (request.results ?? []).sorted {
        if abs($0.boundingBox.origin.y - $1.boundingBox.origin.y) > 0.008 { return $0.boundingBox.origin.y > $1.boundingBox.origin.y }
        return $0.boundingBox.origin.x < $1.boundingBox.origin.x
    }
    print("===== \(path) =====")
    for observation in observations {
        if let text = observation.topCandidates(1).first?.string { print(text) }
    }
}
