import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import crypto from 'crypto';

/**
 * Instant Transaction Notification (ITN) Handler
 * This endpoint is called by PayFast's servers after a payment is processed.
 */
export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const data: Record<string, string> = {};
    params.forEach((value, key) => {
      data[key] = value;
    });

    console.log('PayFast ITN received:', data);

    const { m_payment_id, payment_status, signature, custom_str1 } = data;

    // 1. Verify Signature (Security Check)
    // In a real app, you would reconstruct the signature with your passphrase 
    // and compare it to the signature parameter received from PayFast.
    
    // 2. Process Order if status is COMPLETE
    if (payment_status === 'COMPLETE' && m_payment_id && custom_str1) {
      const userId = custom_str1;
      
      // Update the order in Firestore using Admin SDK
      const orderRef = adminDb.doc(`customers/${userId}/orders/${m_payment_id}`);
      
      await orderRef.update({
        status: 'processing',
        paymentStatus: 'paid',
        updatedAt: new Date().toISOString()
      });

      console.log(`Order ${m_payment_id} updated to PAID for user ${userId}`);
    }

    // PayFast expects a 200 OK response
    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('ITN processing error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}
