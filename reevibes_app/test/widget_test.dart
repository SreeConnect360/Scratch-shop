import 'package:flutter_test/flutter_test.dart';
import 'package:reevibes_app/app.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const ReeVibesApp());

    // Verify that splash screen renders
    expect(find.byType(ReeVibesApp), findsOneWidget);
  });
}
