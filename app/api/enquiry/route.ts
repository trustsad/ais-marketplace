import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, company, message, agents } = body;

  // TODO: Wire up Resend to send an email to the sales team
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'marketplace@ais.aptean.com',
  //   to: 'sales@aptean.com',
  //   subject: `AIS Marketplace enquiry from ${name} at ${company}`,
  //   html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Company:</b> ${company}</p><p><b>Agents:</b> ${agents}</p><p><b>Message:</b> ${message}</p>`,
  // });

  console.log('=== AIS Marketplace Enquiry ===');
  console.log({ name, email, company, agents, message });
  console.log('================================');

  return NextResponse.json({ success: true });
}
