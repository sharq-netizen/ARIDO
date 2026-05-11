import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'dart:io';

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (Platform.isAndroid) {
      return android;
    } else if (Platform.isIOS) {
      return ios;
    } else {
      throw UnsupportedError(
        'DefaultFirebaseOptions is not supported for this platform.',
      );
    }
  }

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyBM2DmIOpKVmlRu2m9FsJUOYd1mcNfQFCk',
    appId: '1:283360307743:android:a428184b03b889b6b3032a',
    messagingSenderId: '283360307743',
    projectId: 'arido-7e831',
    storageBucket: 'arido-7e831.firebasestorage.app',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyBM2DmIOpKVmlRu2m9FsJUOYd1mcNfQFCk',
    appId: '1:283360307743:ios:a428184b03b889b6b3032a',
    messagingSenderId: '283360307743',
    projectId: 'arido-7e831',
    storageBucket: 'arido-7e831.firebasestorage.app',
  );
}
