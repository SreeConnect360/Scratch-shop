/// JavaScript bridge for communication between the website and Flutter.
///
/// Injects native functionality, disables zooming, and bridges Google Sign-In.
class WebViewBridge {
  WebViewBridge._();
  static final WebViewBridge instance = WebViewBridge._();

  /// JavaScript to inject into every page load.
  /// Enforces fixed viewport scaling, disables zooming, and registers JS ↔ Native channels.
  String get injectedJavaScript => '''
    (function() {
      // 1. Disable Zooming via Viewport Meta Tag
      try {
        var meta = document.querySelector('meta[name="viewport"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = 'viewport';
          document.getElementsByTagName('head')[0].appendChild(meta);
        }
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no';
      } catch(e) {}

      // 2. Prevent Touch Gesture Zooming (Pinch to zoom & Double Tap)
      try {
        document.addEventListener('gesturestart', function(e) { e.preventDefault(); }, { passive: false });
        document.addEventListener('gesturechange', function(e) { e.preventDefault(); }, { passive: false });
        document.addEventListener('gestureend', function(e) { e.preventDefault(); }, { passive: false });

        var lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
          var now = (new Date()).getTime();
          if (now - lastTouchEnd <= 300) {
            e.preventDefault();
          }
          lastTouchEnd = now;
        }, false);
      } catch(e) {}

      // 3. Prevent Double Injection of Bridges
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

      // Google Sign-In bridge
      window.flutter_google_signin = function() {
        if (window.FlutterGoogleSignIn) {
          window.FlutterGoogleSignIn.postMessage('signin');
        }
      };

      // Console error log bridge
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

  /// JavaScript to observe DOM interactions and attach Google Sign-In & Haptic triggers.
  String get actionObserverScript => '''
    (function() {
      if (window.__flutter_observer_attached) return;
      window.__flutter_observer_attached = true;

      document.addEventListener('click', function(e) {
        var target = e.target;
        var el = target.closest ? target.closest('button, a, [role="button"], div, iframe') : target;
        if (!el) return;

        var text = (el.textContent || '').toLowerCase().trim();
        var cls = (el.className || '').toLowerCase();
        var id = (el.id || '').toLowerCase();

        // Detect Google Sign-In button click and trigger native Google Sign-In
        if (text.includes('google') || cls.includes('google') || id.includes('google') || el.getAttribute('data-provider') === 'google') {
          window.flutter_haptic('medium');
          window.flutter_google_signin();
          return;
        }

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
        // General buttons
        else if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') {
          window.flutter_haptic('light');
        }
      }, { passive: true });
    })();
  ''';
}
