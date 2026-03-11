import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // PayFast Sandbox Credentials
    const merchant_id = '10041936';
    const merchant_key = '05rmzafvu8xfk';
    const passphrase = 'Thriftclothingplug';

    const {
      amount,
      item_name,
      item_description,
      email_address,
      return_url,
      cancel_url,
      notify_url,
      m_payment_id,
      name_first,
      name_last,
      custom_str1,
      custom_str2
    } = body;

    const formattedAmount = parseFloat(amount).toFixed(2);

    const pfData: Record<string, string> = {
      merchant_id,
      merchant_key,
      return_url,
      cancel_url,
      notify_url,
      name_first,
      name_last,
      email_address,
      m_payment_id,
      amount: formattedAmount,
      item_name,
      item_description,
      custom_str1,
      custom_str2
    };

    const dataForSignature: Record<string, string> = {};
    for (const key in pfData) {
        if (pfData[key] !== '' && pfData[key] !== null && pfData[key] !== undefined) {
            dataForSignature[key] = pfData[key];
        }
    }
    
    if (passphrase) {
        dataForSignature['passphrase'] = passphrase;
    }

    // PayFast signature requires specific alphabetical order
    const paramString = Object.keys(dataForSignature)
      .sort()
      .map(key => {
        return `${key}=${encodeURIComponent(dataForSignature[key].trim()).replace(/%20/g, '+')}`;
    }).join('&');

    const signature = crypto.createHash('md5').update(paramString).digest('hex');

    return NextResponse.json({
      ...pfData,
      amount: formattedAmount,
      signature
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Signature generation error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to generate signature', details: errorMessage },
      { status: 500 }
    );
  }
}
