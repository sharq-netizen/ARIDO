import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class FirestoreService extends ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Stream<QuerySnapshot> getMessages() {
    return _firestore
        .collection('messages')
        .orderBy('timestamp', descending: true)
        .snapshots();
  }

  Stream<QuerySnapshot> getUsers() {
    return _firestore
        .collection('users')
        .snapshots();
  }

  Future<void> sendMessage({
    required String userId,
    required String userName,
    required String text,
  }) async {
    try {
      await _firestore.collection('messages').add({
        'userId': userId,
        'userName': userName,
        'text': text,
        'timestamp': FieldValue.serverTimestamp(),
        'read': false,
      });
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> createUserProfile({
    required String userId,
    required String userName,
    String? userEmail,
  }) async {
    try {
      await _firestore.collection('users').doc(userId).set({
        'userId': userId,
        'userName': userName,
        'userEmail': userEmail ?? '',
        'createdAt': FieldValue.serverTimestamp(),
        'isOnline': true,
        'lastActive': FieldValue.serverTimestamp(),
      }, SetOptions(merge: true));
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> updateUserStatus(String userId, bool isOnline) async {
    try {
      await _firestore.collection('users').doc(userId).update({
        'isOnline': isOnline,
        'lastActive': FieldValue.serverTimestamp(),
      });
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> deleteMessage(String messageId) async {
    try {
      await _firestore.collection('messages').doc(messageId).delete();
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }
}
