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
  const user = context.clientContext.user;

  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'User must be logged in' })
    };
  }

  try {
    const messagesSnapshot = await db.collection('messages').orderBy('timestamp').get();
    const messages = messagesSnapshot.docs.map(doc => doc.data());

    return {
      statusCode: 200,
      body: JSON.stringify(messages)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
