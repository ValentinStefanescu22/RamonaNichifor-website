// Renders chosen pages of the printer's PDFs to PNG, cut to the trim box (no bleed).
// Native PDFKit, nothing to install. Run from mockups/:
//   [SCALE=3.6] swift scripts/pdf-pages.swift <file.pdf> <out-prefix> <page> [page…]
// Pages are 1-based, as Ramona numbers them. Output: <out-prefix>-p<page>.png
import AppKit
import PDFKit

let args = CommandLine.arguments
guard args.count >= 4, let doc = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
  fatalError("usage: pdf-pages.swift <file.pdf> <out-prefix> <page> [page…]")
}
// ~173 dpi by default: sharp enough for a 1100px-tall web page. SCALE=3.6 for small items (playing cards).
let scale = CGFloat(Double(ProcessInfo.processInfo.environment["SCALE"] ?? "") ?? 2.4)

for n in args[3...].compactMap({ Int($0) }) {
  guard let page = doc.page(at: n - 1) else { fatalError("no page \(n)") }
  let box = page.bounds(for: .trimBox)
  let w = Int(box.width * scale), h = Int(box.height * scale)
  let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: w, pixelsHigh: h, bitsPerSample: 8,
                             samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
                             colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
  let ctx = NSGraphicsContext(bitmapImageRep: rep)!.cgContext
  ctx.setFillColor(.white)
  ctx.fill(CGRect(x: 0, y: 0, width: w, height: h))
  ctx.scaleBy(x: scale, y: scale)
  page.draw(with: .trimBox, to: ctx)
  let out = "\(args[2])-p\(n).png"
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: out))
  print(out, w, "x", h, "trim", box)
}
