import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

/**
 * @fileOverview Admin API route to fetch all orders using Firebase Admin SDK.
 * 
 * This route is restricted to users present in the 'roles_admin' collection.
 * It uses a collectionGroup query to aggregate orders from all customers.
 */

export async function GET(request: NextRequest) {
  try {
    // 1. Verify Authorization Header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // 2. Verify ID Token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // 3. Verify Admin Status in Firestore
    const adminDoc = await adminDb.collection('roles_admin').doc(uid).get();
    if (!adminDoc.exists) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 4. Fetch All Orders across all customers
    // Note: This requires a Collection Group index on 'orders'
    const ordersSnap = await adminDb.collectionGroup('orders').get();
    
    const orders = ordersSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Ensure dates are serialized correctly for JSON
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt ?? null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt ?? null,
        orderDate: data.orderDate ?? null,
      };
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Admin orders API error:', error.code, error.message, JSON.stringify(error));
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
