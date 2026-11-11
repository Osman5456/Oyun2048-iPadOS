import SwiftUI
import UIKit
import WebKit

// Offline, touch-enabled game packaged as a native iPadOS/iOS application.
@main
struct Oyun2048App: App {
    var body: some Scene {
        WindowGroup {
            Oyun2048WebView()
                .ignoresSafeArea()
        }
    }
}

struct Oyun2048WebView: UIViewRepresentable {
    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true

        let webView = WKWebView(frame: .zero, configuration: configuration)
        let background = UIColor(red: 247.0 / 255.0, green: 243.0 / 255.0, blue: 234.0 / 255.0, alpha: 1)
        webView.isOpaque = false
        webView.backgroundColor = background
        webView.scrollView.backgroundColor = background
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        guard let pageURL = Bundle.main.url(forResource: "index",
                                            withExtension: "html",
                                            subdirectory: "Web") else {
            webView.loadHTMLString("<h2>Oyun dosyasi bulunamadi.</h2>", baseURL: nil)
            return webView
        }

        webView.loadFileURL(pageURL,
                            allowingReadAccessTo: pageURL.deletingLastPathComponent())
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) { }
}
