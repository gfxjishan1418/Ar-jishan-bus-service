import fs from 'fs';

function sanitize(sql) {
  const lines = sql.split('\n');
  const cleaned = lines.map(line => {
    // Check if line contains a comment
    const commentMatch = line.match(/^(\s*--.*)$/);
    const inlineCommentMatch = line.match(/^(.*?)(--.*)$/);
    
    if (inlineCommentMatch) {
      const code = inlineCommentMatch[1];
      let comment = inlineCommentMatch[2];
      // Remove single quotes from the comment part
      comment = comment.replace(/'/g, '');
      return code + comment;
    }
    return line;
  });
  return cleaned.join('\n');
}

// Read all 4 migrations
let f1 = fs.readFileSync('supabase/migrations/01_initial_schema.sql', 'utf8');
let f2 = fs.readFileSync('supabase/migrations/02_atomic_booking_rpc.sql', 'utf8');
let f3 = fs.readFileSync('supabase/migrations/03_row_level_security.sql', 'utf8');
let f4 = fs.readFileSync('supabase/migrations/04_sample_bangladesh_data.sql', 'utf8');

// Specific fix for line 51-57 in 04: remove inline comments from inside the VALUES tuple
f4 = f4.replace(
  /INSERT INTO public\.routes \(id, origin_id, destination_id, distance_km, estimated_duration, starting_fare\) VALUES[\s\S]*?ON CONFLICT \(id\) DO NOTHING;/m,
`INSERT INTO public.routes (id, origin_id, destination_id, distance_km, estimated_duration, starting_fare) VALUES
('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111102', 248.5, '5h 30m', 850.00),
('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111103', 395.0, '8h 30m', 1200.00),
('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111104', 245.0, '5h 45m', 800.00),
('44444444-4444-4444-4444-444444444404', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111105', 256.0, '5h 15m', 750.00),
('44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111103', 152.0, '3h 30m', 550.00)
ON CONFLICT (id) DO NOTHING;`
);

f1 = sanitize(f1);
f2 = sanitize(f2);
f3 = sanitize(f3);
f4 = sanitize(f4);

fs.writeFileSync('supabase/migrations/01_initial_schema.sql', f1, 'utf8');
fs.writeFileSync('supabase/migrations/02_atomic_booking_rpc.sql', f2, 'utf8');
fs.writeFileSync('supabase/migrations/03_row_level_security.sql', f3, 'utf8');
fs.writeFileSync('supabase/migrations/04_sample_bangladesh_data.sql', f4, 'utf8');

const combined = [
  '-- ============================================================================',
  '-- AR JISHAN LUXURY SMART BUS PLATFORM - MASTER CONSOLIDATED DATABASE SETUP',
  '-- Generated for Supabase Project: hgbhituomvyenborlkrw',
  '-- ============================================================================',
  '',
  '-- SECTION 1: CORE SCHEMA & TABLES (30 TABLES)',
  f1,
  '',
  '-- SECTION 2: ATOMIC TRANSACTIONAL BOOKING PROCEDURES',
  f2,
  '',
  '-- SECTION 3: ROW LEVEL SECURITY (RLS) POLICIES',
  f3,
  '',
  '-- SECTION 4: INITIAL BANGLADESH TRANSPORTATION DATA',
  f4
].join('\n\n');

fs.writeFileSync('supabase/consolidated_setup.sql', combined, 'utf8');
console.log('Sanitization complete! Master script length:', combined.length);
