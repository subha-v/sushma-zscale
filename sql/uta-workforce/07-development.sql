-- ============================================================================
-- ARLINGTON ECONOMIC DEVELOPMENT PROJECTS - 15 projects
-- Run after 01-schema.sql
-- ============================================================================

INSERT INTO arlington_development (project_name, project_type, developer, investment_amount, estimated_jobs, status, location_description, start_year, completion_year, description, industries_impacted)
VALUES
  ('GM Arlington Assembly Plant Modernization', 'industrial', 'General Motors', 500000000, 200, 'operational',
   'GM Assembly Plant, 2525 E Abram St, Arlington',
   2019, 2024,
   'Over $500 million investment to modernize the Arlington Assembly Plant for next-generation full-size SUV production. Includes advanced robotics, paint shop upgrades, and new body shop technology.',
   ARRAY['Automotive Manufacturing', 'Advanced Manufacturing', 'Robotics']),

  ('Globe Life Field', 'commercial', 'City of Arlington / Texas Rangers', 1200000000, 5000, 'operational',
   'Globe Life Field, 734 Stadium Dr, Arlington',
   2017, 2020,
   'State-of-the-art 40,300-seat retractable roof baseball stadium. Home of the Texas Rangers. Hosts concerts, events, and conventions year-round.',
   ARRAY['Entertainment', 'Hospitality', 'Construction', 'Food & Beverage']),

  ('Texas Live! Entertainment District', 'mixed-use', 'The Cordish Companies / Texas Rangers', 250000000, 1500, 'operational',
   'Texas Live!, 1650 E Randol Mill Rd, Arlington',
   2016, 2018,
   'Mixed-use entertainment district between AT&T Stadium and Globe Life Field featuring restaurants, live music venues, a hotel, and event spaces.',
   ARRAY['Entertainment', 'Hospitality', 'Food & Beverage', 'Retail']),

  ('AT&T Stadium District Redevelopment', 'mixed-use', 'City of Arlington / Dallas Cowboys', 200000000, 3000, 'under_construction',
   'Area surrounding AT&T Stadium, Arlington',
   2023, 2028,
   'Master-planned mixed-use development around AT&T Stadium including retail, dining, residential, and entertainment venues to create a year-round destination.',
   ARRAY['Entertainment', 'Hospitality', 'Retail', 'Real Estate']),

  ('E-Space Global Headquarters', 'commercial', 'E-Space', 50000000, 300, 'operational',
   'E-Space HQ, Arlington',
   2022, 2024,
   'New global headquarters for satellite constellation company E-Space. Brings high-tech aerospace and telecommunications jobs to Arlington.',
   ARRAY['Aerospace & Defense', 'Technology', 'Telecommunications']),

  ('Salcomp US Manufacturing Facility', 'industrial', 'Salcomp', 60000000, 500, 'operational',
   'Salcomp Manufacturing, Arlington',
   2023, 2024,
   'Finnish electronics manufacturer Salcomp opened its first US factory in Arlington to produce mobile phone chargers and power supplies.',
   ARRAY['Electronics Manufacturing', 'Advanced Manufacturing']),

  ('Caravan Court Hotel & Conference Center', 'commercial', 'Private Developer', 45000000, 200, 'under_construction',
   'Near Entertainment District, Arlington',
   2024, 2026,
   'New full-service hotel and conference center to serve the Arlington entertainment district. Will include 250+ rooms and 15,000 sq ft of meeting space.',
   ARRAY['Hospitality', 'Tourism', 'Construction']),

  ('Downtown Arlington Revitalization', 'mixed-use', 'City of Arlington', 150000000, 800, 'under_construction',
   'Downtown Arlington, Division St / Center St corridor',
   2022, 2027,
   'Multi-phase downtown revitalization including new mixed-use buildings, streetscape improvements, public art, pedestrian-friendly infrastructure, and transit connections.',
   ARRAY['Real Estate', 'Retail', 'Construction', 'Government']),

  ('UTA Research and Innovation District', 'institutional', 'University of Texas at Arlington', 100000000, 500, 'under_construction',
   'UTA Campus and surrounding areas',
   2023, 2028,
   'Expansion of UTA research facilities including new engineering labs, innovation hub, and industry partnership spaces to foster tech transfer and startup incubation.',
   ARRAY['Higher Education', 'Technology', 'Research & Development']),

  ('Arlington Highlands Phase II', 'commercial', 'Trademark Property', 80000000, 600, 'planned',
   'Arlington Highlands, I-20 & Matlock Rd',
   2025, 2028,
   'Expansion of Arlington Highlands mixed-use development with additional retail, restaurant, and office space.',
   ARRAY['Retail', 'Real Estate', 'Food & Beverage']),

  ('Via Rideshare Expansion', 'infrastructure', 'City of Arlington / Via', 15000000, 150, 'operational',
   'City-wide Arlington, TX',
   2017, 2024,
   'Expansion of Arlingtons on-demand rideshare service Via to cover the entire city, replacing traditional fixed-route transit. Largest on-demand transit system in the US.',
   ARRAY['Transportation', 'Technology', 'Government']),

  ('Trinity Railway Express Arlington Station', 'infrastructure', 'City of Arlington / NCTCOG', 250000000, 100, 'planned',
   'Proposed station near UTA campus, Arlington',
   2026, 2030,
   'Proposed commuter rail station connecting Arlington to Fort Worth and Dallas via the Trinity Railway Express, located near the UTA campus.',
   ARRAY['Transportation', 'Government', 'Construction']),

  ('Medical District Expansion', 'institutional', 'Texas Health Resources', 120000000, 400, 'under_construction',
   'Texas Health Arlington Memorial Hospital area',
   2024, 2027,
   'Expansion of the medical district near Texas Health Arlington Memorial including new specialty clinics, medical office buildings, and ambulatory surgery center.',
   ARRAY['Healthcare', 'Construction', 'Medical Technology']),

  ('International Bowling Campus Renovation', 'commercial', 'International Bowling Campus', 25000000, 50, 'completed',
   '621 Six Flags Dr, Arlington',
   2022, 2024,
   'Renovation and modernization of the International Bowling Campus, headquarters of the US Bowling Congress and home to the International Bowling Museum.',
   ARRAY['Entertainment', 'Tourism', 'Sports']),

  ('Viridian Mixed-Use Development', 'mixed-use', 'Johnson Development', 500000000, 300, 'operational',
   'Viridian, North Arlington near Lake Arlington',
   2015, 2030,
   'Master-planned community featuring residential, retail, parks, trails, and a community lake. Over 4,000 homes planned across 2,000 acres.',
   ARRAY['Real Estate', 'Homebuilding', 'Retail', 'Construction'])
ON CONFLICT (project_name) DO NOTHING;

-- ============================================================================
-- DONE - 15 development projects inserted
-- Next: Run 08-industries.sql
-- ============================================================================
