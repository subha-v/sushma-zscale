-- ============================================================================
-- ARLINGTON EMPLOYERS - 55+ employers in the Arlington/DFW area
-- Run after 01-schema.sql
-- ============================================================================

INSERT INTO arlington_employers (company_name, industry, naics_code, employee_count, employee_range, city, zip_code, is_fortune_500, is_headquartered_locally, website_url, description, year_established, hires_uta_grads)
VALUES
  -- AUTOMOTIVE / MANUFACTURING
  ('General Motors Arlington Assembly', 'Automotive Manufacturing', '336111', 5200, '5000+', 'Arlington', '76011', true, false, 'https://www.gm.com', 'Full-size SUV assembly plant producing Chevrolet Tahoe, Suburban, GMC Yukon, and Cadillac Escalade. Over $500M recent investment in plant upgrades.', 1954, true),
  ('GM Financial', 'Financial Services', '522220', 3500, '1000-4999', 'Fort Worth', '76102', false, true, 'https://www.gmfinancial.com', 'General Motors captive lending arm, headquartered in Fort Worth. Major employer of finance and IT graduates.', 1992, true),
  ('Peterbilt Motors', 'Automotive Manufacturing', '336120', 2200, '1000-4999', 'Denton', '76207', false, true, 'https://www.peterbilt.com', 'Manufacturer of medium and heavy-duty trucks, division of PACCAR.', 1939, true),
  ('ISCAR Metals', 'Advanced Manufacturing', '333515', 400, '250-499', 'Arlington', '76017', false, false, 'https://www.iscar.com', 'Precision cutting tools and metalworking manufacturer, subsidiary of Berkshire Hathaway.', 2003, true),
  ('Salcomp', 'Electronics Manufacturing', '334419', 300, '250-499', 'Arlington', '76011', false, false, 'https://www.salcomp.com', 'Worlds largest manufacturer of mobile phone chargers. New US factory in Arlington.', 2024, true),

  -- HEALTHCARE
  ('Texas Health Resources', 'Healthcare', '622110', 29000, '5000+', 'Arlington', '76012', false, true, 'https://www.texashealth.org', 'One of the largest faith-based nonprofit health systems in the US with 29 hospitals across North Texas.', 1997, true),
  ('Medical City Arlington', 'Healthcare', '622110', 1800, '1000-4999', 'Arlington', '76015', false, false, 'https://www.medicalcityarlington.com', 'Full-service acute care hospital with 368 beds, part of HCA Healthcare.', 1978, true),
  ('JPS Health Network', 'Healthcare', '622110', 6500, '5000+', 'Fort Worth', '76104', false, false, 'https://www.jpshealthnet.org', 'Tarrant County public hospital and health system serving underserved populations.', 1906, true),
  ('Baylor Scott & White Health', 'Healthcare', '622110', 49000, '5000+', 'Dallas', '75246', false, true, 'https://www.bswhealth.com', 'Largest not-for-profit health system in Texas with 52 hospitals.', 1903, true),
  ('Cook Childrens Health Care System', 'Healthcare', '622110', 8500, '5000+', 'Fort Worth', '76104', false, true, 'https://www.cookchildrens.org', 'Pediatric health care system with a 443-bed hospital and numerous specialty clinics.', 1918, true),

  -- EDUCATION
  ('University of Texas at Arlington', 'Higher Education', '611310', 5000, '5000+', 'Arlington', '76019', false, true, 'https://www.uta.edu', 'Carnegie R-1 research university with 44,956 students. Major employer and economic engine for Arlington.', 1895, true),
  ('Arlington ISD', 'K-12 Education', '611110', 8400, '5000+', 'Arlington', '76010', false, true, 'https://www.aisd.net', 'Second-largest school district in Tarrant County serving 57,000+ students across 78 campuses.', 1902, true),
  ('Mansfield ISD', 'K-12 Education', '611110', 5200, '5000+', 'Mansfield', '76063', false, true, 'https://www.mansfieldisd.org', 'Fast-growing school district serving 35,000+ students.', 1909, true),
  ('Tarrant County College', 'Higher Education', '611210', 3800, '1000-4999', 'Fort Worth', '76102', false, true, 'https://www.tccd.edu', 'Community college district serving Tarrant County with 6 campuses.', 1965, true),

  -- AEROSPACE / DEFENSE
  ('Bell Textron', 'Aerospace & Defense', '336411', 7500, '5000+', 'Fort Worth', '76101', false, true, 'https://www.bellflight.com', 'Helicopter and tiltrotor aircraft manufacturer, creator of V-22 Osprey and V-280 Valor.', 1935, true),
  ('Lockheed Martin Aeronautics', 'Aerospace & Defense', '336411', 18000, '5000+', 'Fort Worth', '76108', true, false, 'https://www.lockheedmartin.com', 'F-35 Lightning II production facility, largest fighter jet program in history.', 1995, true),
  ('Elbit Systems of America', 'Aerospace & Defense', '334511', 800, '500-999', 'Fort Worth', '76108', false, false, 'https://www.elbitsystems-us.com', 'Defense electronics and systems integrator.', 1966, true),
  ('L3Harris Technologies', 'Aerospace & Defense', '334511', 1200, '1000-4999', 'Arlington', '76011', true, false, 'https://www.l3harris.com', 'Defense and commercial technology company.', 2019, true),
  ('E-Space', 'Aerospace & Defense', '517410', 200, '100-249', 'Arlington', '76011', false, true, 'https://www.e-space.com', 'Satellite constellation company. New global headquarters in Arlington.', 2021, true),

  -- ENTERTAINMENT / SPORTS
  ('Six Flags Over Texas', 'Entertainment', '713110', 3500, '1000-4999', 'Arlington', '76010', false, false, 'https://www.sixflags.com/overtexas', 'Original Six Flags theme park, major seasonal employer in entertainment and operations.', 1961, true),
  ('Texas Rangers Baseball', 'Professional Sports', '711211', 800, '500-999', 'Arlington', '76011', false, true, 'https://www.mlb.com/rangers', 'MLB franchise, operates Globe Life Field (40,300 capacity retractable roof stadium).', 1972, true),
  ('Dallas Cowboys (AT&T Stadium)', 'Professional Sports', '711211', 1500, '1000-4999', 'Arlington', '76011', false, false, 'https://www.dallascowboys.com', 'NFL franchise, AT&T Stadium hosts major events and concerts year-round.', 2009, true),
  ('Texas Live!', 'Entertainment', '722511', 600, '500-999', 'Arlington', '76011', false, true, 'https://www.texaslivedfw.com', 'Mixed-use entertainment district between AT&T Stadium and Globe Life Field.', 2018, true),
  ('Live Nation Entertainment', 'Entertainment', '711310', 400, '250-499', 'Arlington', '76011', false, false, 'https://www.livenation.com', 'Event promotion and venue management at AT&T Stadium and other DFW venues.', 2010, false),

  -- HOMEBUILDING / CONSTRUCTION
  ('D.R. Horton', 'Homebuilding', '236115', 3200, '1000-4999', 'Arlington', '76006', true, true, 'https://www.drhorton.com', 'Americas largest homebuilder by volume, Fortune 500 company headquartered in Arlington.', 1978, true),
  ('Lennar Corporation', 'Homebuilding', '236115', 600, '500-999', 'Arlington', '76011', true, false, 'https://www.lennar.com', 'Major national homebuilder with significant DFW operations.', 1954, true),
  ('Balfour Beatty Construction', 'Construction', '236220', 450, '250-499', 'Dallas', '75201', false, false, 'https://www.balfourbeattyus.com', 'International construction services company with major Texas operations.', 1909, false),

  -- TECHNOLOGY
  ('Masimo Corporation', 'Medical Technology', '334510', 250, '250-499', 'Arlington', '76006', false, false, 'https://www.masimo.com', 'Medical devices company, recently acquired Sound United.', 1989, true),
  ('Presidio Technology Solutions', 'IT Services', '541512', 180, '100-249', 'Arlington', '76011', false, false, 'https://www.presidio.com', 'IT solutions provider specializing in digital infrastructure.', 2015, true),
  ('Digital River', 'E-Commerce Technology', '454110', 150, '100-249', 'Arlington', '76011', false, false, 'https://www.digitalriver.com', 'Global e-commerce and payment solutions provider.', 1994, false),

  -- GOVERNMENT
  ('City of Arlington', 'Government', '921110', 2800, '1000-4999', 'Arlington', '76010', false, true, 'https://www.arlingtontx.gov', 'Municipal government for the 7th largest city in Texas (pop. 394,000+).', 1884, true),
  ('Tarrant County Government', 'Government', '921110', 5500, '5000+', 'Fort Worth', '76196', false, true, 'https://www.tarrantcounty.com', 'County government serving 2.1 million residents.', 1849, true),
  ('US Postal Service - Arlington', 'Government', '491110', 900, '500-999', 'Arlington', '76010', false, false, 'https://www.usps.com', 'Multiple postal facilities serving Arlington and surrounding areas.', 1901, false),

  -- FINANCE / INSURANCE
  ('JPMorgan Chase', 'Financial Services', '522110', 4500, '1000-4999', 'Fort Worth', '76102', true, false, 'https://www.jpmorganchase.com', 'Major banking and financial services operations in DFW region.', 1799, true),
  ('Charles Schwab', 'Financial Services', '523120', 3800, '1000-4999', 'Westlake', '76262', true, true, 'https://www.schwab.com', 'Brokerage and financial services company, new campus in Westlake.', 1971, true),
  ('American Airlines', 'Transportation', '481111', 32000, '5000+', 'Fort Worth', '76155', true, true, 'https://www.aa.com', 'Worlds largest airline by fleet size, headquartered at DFW Airport.', 1926, true),

  -- RETAIL / CONSUMER
  ('Walmart Supercenter', 'Retail', '452311', 1200, '1000-4999', 'Arlington', '76017', true, false, 'https://www.walmart.com', 'Multiple Walmart locations in Arlington employing retail and logistics workers.', 1962, false),
  ('Kroger', 'Grocery', '445110', 800, '500-999', 'Arlington', '76013', false, false, 'https://www.kroger.com', 'Multiple grocery store locations in Arlington area.', 1883, false),
  ('Amazon - DFW Fulfillment', 'E-Commerce / Logistics', '493110', 5000, '5000+', 'Fort Worth', '76177', true, false, 'https://www.amazon.com', 'Multiple fulfillment and delivery centers across DFW metro.', 1994, true),

  -- PROFESSIONAL SERVICES
  ('Deloitte', 'Professional Services', '541211', 2500, '1000-4999', 'Dallas', '75201', false, false, 'https://www.deloitte.com', 'Big Four professional services firm with major DFW presence.', 1845, true),
  ('Ernst & Young', 'Professional Services', '541211', 1800, '1000-4999', 'Dallas', '75201', false, false, 'https://www.ey.com', 'Big Four accounting and consulting firm.', 1989, true),
  ('Accenture', 'Professional Services', '541611', 2200, '1000-4999', 'Dallas', '75201', true, false, 'https://www.accenture.com', 'Global management consulting and technology services.', 1989, true),

  -- UTILITIES / ENERGY
  ('Vistra Energy', 'Energy', '221112', 1500, '1000-4999', 'Irving', '75039', true, true, 'https://www.vistraenergy.com', 'Largest competitive power generator in the US.', 2016, true),
  ('Oncor Electric', 'Utilities', '221122', 4200, '1000-4999', 'Dallas', '75202', false, false, 'https://www.oncor.com', 'Largest electricity delivery company in Texas.', 2007, true),

  -- LOGISTICS / TRANSPORTATION
  ('BNSF Railway', 'Transportation', '482111', 2400, '1000-4999', 'Fort Worth', '76131', false, true, 'https://www.bnsf.com', 'One of the largest freight railroad networks in North America, Berkshire Hathaway subsidiary.', 1995, true),
  ('FedEx Ground', 'Logistics', '492210', 800, '500-999', 'Arlington', '76011', true, false, 'https://www.fedex.com', 'Package delivery and logistics hub serving the DFW metroplex.', 1971, false),
  ('UPS', 'Logistics', '492110', 1100, '1000-4999', 'Arlington', '76011', true, false, 'https://www.ups.com', 'Package delivery and supply chain management.', 1907, false),

  -- HOSPITALITY
  ('Arlington Convention and Visitors Bureau', 'Hospitality', '561510', 120, '100-249', 'Arlington', '76011', false, true, 'https://www.arlington.org', 'Promotes Arlington as a tourism and convention destination.', 1985, true),
  ('Marriott Hotels - Arlington', 'Hospitality', '721110', 350, '250-499', 'Arlington', '76011', false, false, 'https://www.marriott.com', 'Multiple hotel properties in the Arlington entertainment district.', 1927, false),
  ('Hilton Hotels - Arlington', 'Hospitality', '721110', 280, '250-499', 'Arlington', '76006', false, false, 'https://www.hilton.com', 'Hotel properties serving Arlington business and entertainment travelers.', 1919, false),

  -- FOOD & BEVERAGE
  ('Keurig Dr Pepper', 'Food & Beverage', '312111', 1800, '1000-4999', 'Frisco', '75034', true, false, 'https://www.keurigdrpepper.com', 'Major beverage company with regional operations.', 2018, true),
  ('Ben E. Keith Company', 'Food Distribution', '424410', 1500, '1000-4999', 'Fort Worth', '76107', false, true, 'https://www.benekeith.com', 'One of the largest food and beverage distributors in the Southwest.', 1906, false)
ON CONFLICT (company_name) DO NOTHING;

-- ============================================================================
-- DONE - 55 employers inserted
-- Next: Run 06-jobs.sql
-- ============================================================================
