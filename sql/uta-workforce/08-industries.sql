-- ============================================================================
-- ARLINGTON INDUSTRIES - 18 industry sectors
-- Run after 01-schema.sql
-- Sources: BLS QCEW, Texas Workforce Commission, NAICS data
-- ============================================================================

INSERT INTO arlington_industries (industry_name, naics_sector, employment_count, avg_annual_wage, growth_rate, location_quotient, top_occupations, key_employers, description, data_year, data_source)
VALUES
  ('Automotive Manufacturing', '336', 8500, 72000, 2.1, 3.8,
   ARRAY['Assembly Workers', 'Manufacturing Engineers', 'Quality Engineers', 'Production Supervisors', 'Supply Chain Managers'],
   ARRAY['General Motors Arlington Assembly', 'Peterbilt Motors', 'ISCAR Metals', 'Salcomp'],
   'Arlington is home to GMs largest SUV assembly plant producing Tahoe, Suburban, Yukon, and Escalade. Automotive manufacturing is a cornerstone of the local economy.',
   2024, 'BLS QCEW / TWC'),

  ('Healthcare & Social Assistance', '62', 35000, 58000, 4.2, 1.3,
   ARRAY['Registered Nurses', 'Medical Assistants', 'Physicians', 'Physical Therapists', 'Health Administrators'],
   ARRAY['Texas Health Resources', 'Medical City Arlington', 'JPS Health Network', 'Baylor Scott & White', 'Cook Childrens'],
   'Healthcare is the fastest-growing sector in the Arlington-Fort Worth area, driven by population growth and aging demographics.',
   2024, 'BLS / TWC'),

  ('Education Services', '61', 18000, 52000, 2.8, 1.4,
   ARRAY['Teachers', 'Professors', 'School Administrators', 'Academic Advisors', 'Research Associates'],
   ARRAY['University of Texas at Arlington', 'Arlington ISD', 'Mansfield ISD', 'Tarrant County College'],
   'UTA (44,956 students) and Arlington ISD (57,000+ students) are major employers. Education sector benefits from strong population growth.',
   2024, 'BLS / TWC'),

  ('Aerospace & Defense', '3364', 28000, 95000, 3.5, 4.2,
   ARRAY['Aerospace Engineers', 'Systems Engineers', 'Software Engineers', 'Flight Test Engineers', 'Technicians'],
   ARRAY['Lockheed Martin', 'Bell Textron', 'L3Harris', 'Elbit Systems', 'E-Space'],
   'The DFW area is a national center for aerospace and defense manufacturing, led by the F-35 program at Lockheed Martin and Bell Helicopters advanced rotorcraft.',
   2024, 'BLS / TWC'),

  ('Entertainment & Sports', '71', 12000, 38000, 5.1, 2.8,
   ARRAY['Event Staff', 'Operations Managers', 'Marketing Specialists', 'Food Service Workers', 'Security'],
   ARRAY['Six Flags Over Texas', 'Texas Rangers', 'Dallas Cowboys', 'Texas Live!', 'Live Nation'],
   'Arlington is the premier sports and entertainment destination in DFW, home to AT&T Stadium, Globe Life Field, Six Flags, and Texas Live! entertainment district.',
   2024, 'BLS / TWC'),

  ('Homebuilding & Construction', '236', 9500, 55000, 3.8, 1.6,
   ARRAY['Project Managers', 'Carpenters', 'Electricians', 'Plumbers', 'Civil Engineers'],
   ARRAY['D.R. Horton', 'Lennar', 'Balfour Beatty', 'Various Subcontractors'],
   'D.R. Horton (Fortune 500) is headquartered in Arlington. DFW remains one of the fastest-growing housing markets in the US.',
   2024, 'BLS / TWC'),

  ('Professional & Technical Services', '54', 15000, 82000, 4.5, 0.9,
   ARRAY['Management Consultants', 'Software Developers', 'Accountants', 'Engineers', 'Analysts'],
   ARRAY['Deloitte', 'Ernst & Young', 'Accenture', 'Various Firms'],
   'Growing professional services sector serving the DFW metro, with particular strength in consulting, engineering services, and IT consulting.',
   2024, 'BLS / TWC'),

  ('Financial Services', '52', 12000, 78000, 3.2, 1.1,
   ARRAY['Financial Analysts', 'Loan Officers', 'Investment Bankers', 'Software Engineers', 'Risk Analysts'],
   ARRAY['GM Financial', 'JPMorgan Chase', 'Charles Schwab', 'Various Banks'],
   'GM Financial headquarters and major banks operations provide strong financial services employment across finance, technology, and operations roles.',
   2024, 'BLS / TWC'),

  ('Government', '92', 14000, 56000, 1.2, 1.0,
   ARRAY['Police Officers', 'Firefighters', 'Administrators', 'Engineers', 'Planners'],
   ARRAY['City of Arlington', 'Tarrant County', 'Federal Agencies', 'US Postal Service'],
   'Arlington is the 7th largest city in Texas with a full-service municipal government. Tarrant County serves 2.1 million residents.',
   2024, 'BLS / TWC'),

  ('Retail Trade', '44-45', 22000, 32000, 1.5, 1.1,
   ARRAY['Sales Associates', 'Store Managers', 'Cashiers', 'Merchandisers', 'Inventory Specialists'],
   ARRAY['Walmart', 'Kroger', 'Various Retailers'],
   'Retail employment driven by Arlingtons large population and status as a regional shopping destination.',
   2024, 'BLS / TWC'),

  ('Transportation & Logistics', '48-49', 8000, 52000, 3.0, 1.2,
   ARRAY['Truck Drivers', 'Logistics Coordinators', 'Warehouse Workers', 'Operations Managers', 'Data Analysts'],
   ARRAY['BNSF Railway', 'FedEx', 'UPS', 'Amazon Logistics', 'American Airlines'],
   'DFW benefits from central US location, BNSF Railway headquarters, DFW Airport, and major distribution hubs.',
   2024, 'BLS / TWC'),

  ('Technology & Software', '5112', 5500, 98000, 8.2, 0.7,
   ARRAY['Software Developers', 'Data Scientists', 'Cloud Engineers', 'Cybersecurity Analysts', 'IT Managers'],
   ARRAY['Various Tech Companies', 'GM Financial Tech', 'Presidio', 'E-Space'],
   'Growing technology sector with particular demand for software development, cybersecurity, data science, and cloud computing roles.',
   2024, 'BLS / TWC'),

  ('Hospitality & Tourism', '72', 16000, 28000, 4.8, 1.5,
   ARRAY['Hotel Staff', 'Restaurant Workers', 'Event Coordinators', 'Chefs', 'Concierge'],
   ARRAY['Marriott', 'Hilton', 'Texas Live!', 'Various Restaurants'],
   'Arlingtons entertainment district and major venues drive strong hospitality employment, especially during event seasons.',
   2024, 'BLS / TWC'),

  ('Energy & Utilities', '22', 3500, 85000, 2.0, 0.8,
   ARRAY['Electrical Engineers', 'Power Plant Operators', 'Line Workers', 'Environmental Engineers', 'Technicians'],
   ARRAY['Vistra Energy', 'Oncor Electric', 'Atmos Energy'],
   'Energy sector employment centered around power generation, electricity distribution, and growing renewable energy operations.',
   2024, 'BLS / TWC'),

  ('Food & Beverage Manufacturing', '311-312', 4200, 42000, 2.5, 1.0,
   ARRAY['Production Workers', 'Quality Control', 'Distribution Workers', 'Managers', 'Food Scientists'],
   ARRAY['Keurig Dr Pepper', 'Ben E. Keith', 'Various Food Companies'],
   'Food and beverage manufacturing and distribution with major companies like Keurig Dr Pepper and Ben E. Keith in the DFW region.',
   2024, 'BLS / TWC'),

  ('Advanced Manufacturing', '333-335', 6000, 65000, 3.0, 1.3,
   ARRAY['Manufacturing Engineers', 'CNC Operators', 'Quality Engineers', 'Production Managers', 'Maintenance Technicians'],
   ARRAY['ISCAR Metals', 'Salcomp', 'Various Manufacturers'],
   'Non-automotive advanced manufacturing including precision tools, electronics, and medical devices.',
   2024, 'BLS / TWC'),

  ('Medical Technology & Devices', '3391', 2000, 75000, 5.5, 0.9,
   ARRAY['Biomedical Engineers', 'Clinical Engineers', 'Quality Specialists', 'R&D Engineers', 'Regulatory Affairs'],
   ARRAY['Masimo', 'Various MedTech Companies'],
   'Growing medical technology sector supported by proximity to major health systems and UTAs biomedical engineering program.',
   2024, 'BLS / TWC'),

  ('Real Estate & Property', '53', 5500, 58000, 3.5, 1.2,
   ARRAY['Real Estate Agents', 'Property Managers', 'Appraisers', 'Leasing Agents', 'Development Managers'],
   ARRAY['D.R. Horton', 'Lennar', 'Various Firms'],
   'Active real estate market driven by DFW population growth, commercial development, and entertainment district expansion.',
   2024, 'BLS / TWC')
ON CONFLICT (industry_name) DO NOTHING;

-- ============================================================================
-- DONE - 18 industries inserted
-- Next: Run 09-partnerships.sql
-- ============================================================================
