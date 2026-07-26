import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:http/http.dart' as http;
import 'haptic_service.dart';

/// Handles file downloads triggered from the WebView.
class DownloadService {
  DownloadService._();
  static final DownloadService instance = DownloadService._();

  /// Download a file from [url] and save it to the Downloads directory.
  /// Returns the saved file path, or `null` on failure.
  Future<String?> downloadFile(String url, {String? suggestedFileName}) async {
    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode != 200) return null;

      String fileName = suggestedFileName ?? _extractFileName(url, response);

      final dir = await getExternalStorageDirectory();
      if (dir == null) return null;

      final downloadsDir = Directory('${dir.path}/Downloads');
      if (!await downloadsDir.exists()) {
        await downloadsDir.create(recursive: true);
      }

      final file = File('${downloadsDir.path}/$fileName');
      await file.writeAsBytes(response.bodyBytes);

      await HapticService.instance.success();
      return file.path;
    } catch (e) {
      return null;
    }
  }

  String _extractFileName(String url, http.Response response) {
    final disposition = response.headers['content-disposition'];
    if (disposition != null && disposition.contains('filename=')) {
      final match = RegExp('filename[^;=\\n]*="?([^";\\n]+)"?').firstMatch(disposition);
      if (match != null && match.group(1) != null) {
        return match.group(1)!;
      }
    }
    return _fileNameFromUrl(url);
  }

  String _fileNameFromUrl(String url) {
    final uri = Uri.parse(url);
    final segments = uri.pathSegments;
    if (segments.isNotEmpty && segments.last.contains('.')) {
      return segments.last;
    }
    return 'download_${DateTime.now().millisecondsSinceEpoch}';
  }
}
