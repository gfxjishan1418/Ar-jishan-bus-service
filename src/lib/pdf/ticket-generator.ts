import QRCode from 'qrcode';
import { Booking } from '../types/database';
import { formatBDT, formatDateBD } from '../utils';

export async function generateTicketQRCodeDataURL(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 240,
      margin: 1,
      color: {
        dark: '#111111',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

export async function generateTicketPDF(booking: Booking): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const qrDataUrl = await generateTicketQRCodeDataURL(
    booking.qr_code_data || `VERIFY:${booking.pnr}:${booking.booking_id}`
  );

  // Background Header
  doc.setFillColor(17, 17, 17); // #111111
  doc.rect(0, 0, 210, 38, 'F');

  // Gold accent line
  doc.setFillColor(212, 175, 55); // #D4AF37
  doc.rect(0, 38, 210, 3, 'F');

  // Header Title
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('AR JISHAN LUXURY SMART BUS SERVICE', 15, 18);

  doc.setTextColor(220, 220, 220);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Safe Journey • Better Tomorrow | Bangladesh Intercity Luxury Transit', 15, 26);

  // Boarding Pass Badge
  doc.setFillColor(212, 175, 55);
  doc.roundedRect(148, 10, 48, 18, 2, 2, 'F');
  doc.setTextColor(17, 17, 17);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('E-TICKET / PASS', 153, 18);
  doc.setFontSize(9);
  doc.text('CONFIRMED', 160, 24);

  // PNR & Booking ID ribbon
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, 48, 180, 22, 3, 3, 'F');

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PNR NUMBER', 22, 56);
  doc.text('BOOKING ID', 82, 56);
  doc.text('BOOKING DATE', 142, 56);

  doc.setTextColor(17, 17, 17);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.pnr, 22, 64);
  doc.text(booking.booking_id, 82, 64);
  doc.text(formatDateBD(booking.created_at), 142, 64);

  // Journey Details Card
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(15, 76, 180, 52, 3, 3, 'D');

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TRIP & ROUTE ITINERARY', 22, 85);

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Coach Fleet / Type:', 22, 94);
  doc.text('Registration No:', 22, 102);
  doc.text('Journey Date & Time:', 22, 110);
  doc.text('Boarding Station:', 22, 118);

  doc.setTextColor(17, 17, 17);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.trip?.bus?.name || 'AR Royal Gold Express (AC Coach)', 62, 94);
  doc.text(booking.trip?.bus?.registration_number || 'DHAKA-METRO-BA-14-8921', 62, 102);
  doc.text(
    `${formatDateBD(booking.trip?.departure_date || new Date().toISOString())} at ${booking.trip?.departure_time || '07:30 AM'}`,
    62,
    110
  );
  doc.text(booking.boarding_point, 62, 118);

  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  doc.text('Dropping Station:', 115, 118);
  doc.setTextColor(17, 17, 17);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.dropping_point, 145, 118);

  // Passenger & Seat Table
  doc.roundedRect(15, 134, 180, 48, 3, 3, 'D');
  doc.setFillColor(248, 245, 235);
  doc.roundedRect(15, 134, 180, 10, 3, 3, 'F');

  doc.setTextColor(17, 17, 17);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('SEAT NO.', 22, 140);
  doc.text('PASSENGER NAME', 55, 140);
  doc.text('GENDER', 125, 140);
  doc.text('FARE', 165, 140);

  let yOffset = 150;
  booking.seats.forEach((seat) => {
    doc.setTextColor(212, 175, 55);
    doc.setFont('helvetica', 'bold');
    doc.text(seat.seat_number, 22, yOffset);

    doc.setTextColor(17, 17, 17);
    doc.setFont('helvetica', 'normal');
    doc.text(seat.passenger_name || booking.customer_name, 55, yOffset);
    doc.text(seat.gender || 'General', 125, yOffset);

    doc.setFont('helvetica', 'bold');
    doc.text(formatBDT(seat.fare), 165, yOffset);
    yOffset += 8;
  });

  // Payment Breakdown & QR Code Section
  doc.roundedRect(15, 188, 115, 45, 3, 3, 'D');

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('FARE & PAYMENT SUMMARY', 22, 197);

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal Ticket Fare:', 22, 206);
  doc.text('Service Charge & Taxes:', 22, 213);
  doc.text('Promo Discount Applied:', 22, 220);

  doc.setTextColor(17, 17, 17);
  doc.setFont('helvetica', 'bold');
  doc.text(formatBDT(booking.subtotal_fare), 85, 206);
  doc.text(formatBDT(booking.service_charge), 85, 213);
  doc.text(`- ${formatBDT(booking.discount_amount)}`, 85, 220);

  // Total Paid
  doc.setFillColor(17, 17, 17);
  doc.rect(20, 224, 105, 7, 'F');
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(10);
  doc.text('TOTAL AMOUNT PAID:', 24, 229);
  doc.text(formatBDT(booking.total_amount), 85, 229);

  // QR Code Box
  doc.roundedRect(135, 188, 60, 45, 3, 3, 'D');
  if (qrDataUrl) {
    doc.addImage(qrDataUrl, 'PNG', 147, 190, 36, 36);
  }
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Scan for Conductor Verification', 140, 230);

  // Important Terms & Notice
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15, 238, 180, 38, 3, 3, 'F');

  doc.setTextColor(17, 17, 17);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('IMPORTANT PASSENGER GUIDELINES:', 22, 245);

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('1. Arrive at the boarding lounge at least 20 minutes before departure time.', 22, 252);
  doc.text('2. Present this PDF e-ticket or mobile QR code to the bus steward for contactless check-in.', 22, 258);
  doc.text('3. Baggage allowance: up to 20kg per ticket. Hazardous and illegal materials are strictly prohibited.', 22, 264);
  doc.text('4. Customer Support Hotline: +880 1711 234567 | Corporate Desk: 123 Mirpur Road, Dhaka.', 22, 270);

  // Save the document
  doc.save(`AR_Jishan_Ticket_${booking.pnr}.pdf`);
}
