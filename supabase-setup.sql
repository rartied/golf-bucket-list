-- Run this in your Supabase SQL Editor

create table golf_courses (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location text,
  lat double precision,
  lng double precision,
  images text[],
  website_url text,
  notes text,
  created_at timestamptz default now()
);

-- Enable row level security with public access (personal app)
alter table golf_courses enable row level security;

create policy "Allow all" on golf_courses
  for all using (true) with check (true);
