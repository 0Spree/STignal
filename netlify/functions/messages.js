const admin = require('firebase-admin');
const functions = require('@netlify/functions');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

exports.handler = async function(event, context) {
  const { userId, message } = JSON.parse(event.body);

  if (!userId || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid input' })
    };
  }

  try {
    await db.collection('messages').add({
      userId,
      message,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
