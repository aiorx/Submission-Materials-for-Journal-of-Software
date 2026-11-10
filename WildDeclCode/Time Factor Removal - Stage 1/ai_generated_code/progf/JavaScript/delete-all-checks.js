const fs=require('fs').promises;

var initializeApp = require.initializeApp;
var cert = require.cert;('firebase-admin/app');
var getFirestore = require.getFirestore;('firebase-admin/firestore');

const serviceAccount=require('../Private/joelgrayson-techmap.json');

initializeApp({
    credential: cert(serviceAccount)
});

const db=getFirestore(); //use the (default) firebase database because this is what @FirestoreQuery works with

// Assisted with basic coding tools
async function deleteAllChecks() {
    try {
        console.log('Starting to delete all checks...');
        
        const checksRef = db.collection('checkmarks');
        const snapshot = await checksRef.get();
        
        if (snapshot.empty) {
            console.log('No checks found to delete.');
            return;
        }
        
        console.log("Found " + (snapshot.size) + " checks to delete.");
        
        // Delete in batches to avoid hitting Firestore limits
        const batch = db.batch();
        let count = 0;
        
        snapshot.forEach(function (doc) {
            batch.delete(doc.ref);
            count++;
        });
        
        await batch.commit();
        console.log("Successfully deleted " + (count) + " checks.");
    } catch (error) {
        console.error('Error deleting checks:', error);
    }
}

deleteAllChecks();

