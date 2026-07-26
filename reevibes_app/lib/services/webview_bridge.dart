/// JavaScript bridge for communication between the website and Flutter.
///
/// Injects a `window.flutter` object into the WebView so the website
/// can trigger native features like haptic feedback, share, etc.
class WebViewBridge {
  WebViewBridge._();
  static final WebViewBridge instance = WebViewBridge._();

  /// JavaScript to inject into every page load.
  /// This creates a `window.flutter_haptic(type)` function
  /// and a `window.flutter_share(text)` function.
  String get injectedJavaScript => '''
    (function() {
      // Prevent double-injection
      if (window.__flutter_bridge_injected) return;
      window.__flutter_bridge_injected = true;

      // Haptic feedback bridge
      window.flutter_haptic = function(type) {
        if (window.FlutterHaptic) {
          window.FlutterHaptic.postMessage(type || 'light');
        }
      };

      // Share bridge
      window.flutter_share = function(text) {
        if (window.FlutterShare) {
          window.FlutterShare.postMessage(text || '');
        }
      };

      // Download bridge
      window.flutter_download = function(url) {
        if (window.FlutterDownload) {
          window.FlutterDownload.postMessage(url || '');
        }
      };

      // Console.log bridge for debugging
      var origConsoleError = console.error;
      console.error = function() {
        origConsoleError.apply(console, arguments);
        if (window.FlutterConsole) {
          window.FlutterConsole.postMessage(
            Array.prototype.slice.call(arguments).join(' ')
          );
        }
      };
    })();
  ''';

  /// JavaScript to detect and inject haptic triggers for common ReeVibes actions.
  /// This observes DOM changes and attaches haptic feedback to known button classes.
  String get actionObserverScript => '''
    (function() {
      if (window.__flutter_observer_attached) return;
      window.__flutter_observer_attached = true;

      // Attach click listeners to trigger haptics
      document.addEventListener('click', function(e) {
        var target = e.target;
        var el = target.closest ? target.closest('button, a, [role="button"]') : target;
        if (!el) return;

        var text = (el.textContent || '').toLowerCase().trim();
        var cls = (el.className || '').toLowerCase();

        // Cart actions
        if (text.includes('add to cart') || text.includes('add to bag') || cls.includes('cart')) {
          window.flutter_haptic('medium');
        }
        // Wishlist
        else if (text.includes('wishlist') || cls.includes('wishlist') || cls.includes('heart')) {
          window.flutter_haptic('medium');
        }
        // Order / Payment
        else if (text.includes('place order') || text.includes('pay now') || text.includes('checkout')) {
          window.flutter_haptic('heavy');
        }
        // Login / Sign up
        else if (text.includes('sign in') || text.includes('log in') || text.includes('register') || text.includes('sign up')) {
          window.flutter_haptic('medium');
        }
        // General buttons
        else if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') {
          window.flutter_haptic('light');
        }
      }, { passive: true });
    })();
  ''';
}
