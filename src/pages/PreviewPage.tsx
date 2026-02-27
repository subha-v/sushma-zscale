import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const sampleBusinesses = [
  { id: 1, name: "Precision Components Inc", address: "4521 Industrial Blvd", city: "Austin", county: "Travis", state: "TX", zip: "78744", industry: "manufacturing", industryName: "Precision Turned Product Manufacturing", naics: "332721", status: "Active", founded: "2015" },
  { id: 2, name: "Austin Metal Works LLC", address: "8920 E Ben White Blvd", city: "Austin", county: "Travis", state: "TX", zip: "78741", industry: "manufacturing", industryName: "Metal Stamping", naics: "332116", status: "Active", founded: "2008" },
  { id: 3, name: "Lone Star Fabrication", address: "3100 Industrial Terrace", city: "Austin", county: "Travis", state: "TX", zip: "78758", industry: "manufacturing", industryName: "Fabricated Structural Metal Manufacturing", naics: "332312", status: "Active", founded: "2012" },
  { id: 4, name: "Capitol City Plastics", address: "7650 Airport Blvd", city: "Austin", county: "Travis", state: "TX", zip: "78752", industry: "manufacturing", industryName: "Plastics Product Manufacturing", naics: "326199", status: "Active", founded: "2010" },
  { id: 5, name: "TechForm Industries", address: "12400 N Lamar Blvd", city: "Austin", county: "Travis", state: "TX", zip: "78753", industry: "manufacturing", industryName: "Machine Shops", naics: "332710", status: "Active", founded: "2017" },
  { id: 6, name: "Austin Regional Medical Group", address: "1201 W 38th St", city: "Austin", county: "Travis", state: "TX", zip: "78705", industry: "healthcare", industryName: "Offices of Physicians", naics: "621111", status: "Active", founded: "2005" },
  { id: 7, name: "Central Texas Orthopedics", address: "3705 Medical Parkway", city: "Austin", county: "Travis", state: "TX", zip: "78756", industry: "healthcare", industryName: "Specialty Medical Practice", naics: "621111", status: "Active", founded: "2009" },
  { id: 8, name: "Hill Country Senior Care", address: "4315 James Casey St", city: "Austin", county: "Travis", state: "TX", zip: "78745", industry: "healthcare", industryName: "Home Health Care Services", naics: "621610", status: "Active", founded: "2014" },
  { id: 9, name: "Austin Freight Solutions", address: "5800 Burleson Rd", city: "Austin", county: "Travis", state: "TX", zip: "78744", industry: "logistics", industryName: "General Freight Trucking", naics: "484110", status: "Active", founded: "2011" },
  { id: 10, name: "Capital Distribution Co", address: "9700 Dessau Rd", city: "Austin", county: "Travis", state: "TX", zip: "78754", industry: "logistics", industryName: "Warehousing and Storage", naics: "493110", status: "Active", founded: "2013" },
  { id: 11, name: "Round Rock Precision Machining", address: "1800 S Mays St", city: "Round Rock", county: "Williamson", state: "TX", zip: "78664", industry: "manufacturing", industryName: "Machine Shops", naics: "332710", status: "Active", founded: "2016" },
  { id: 12, name: "Cedar Park Manufacturing", address: "500 Brushy Creek Rd", city: "Cedar Park", county: "Williamson", state: "TX", zip: "78613", industry: "manufacturing", industryName: "Electronic Component Manufacturing", naics: "334419", status: "Active", founded: "2007" },
  { id: 13, name: "Georgetown Steel Solutions", address: "4020 Williams Dr", city: "Georgetown", county: "Williamson", state: "TX", zip: "78628", industry: "manufacturing", industryName: "Steel Product Manufacturing", naics: "331222", status: "Active", founded: "2019" },
  { id: 14, name: "Leander Industrial Products", address: "700 S US Hwy 183", city: "Leander", county: "Williamson", state: "TX", zip: "78641", industry: "manufacturing", industryName: "Industrial Machinery Manufacturing", naics: "333249", status: "Active", founded: "2015" },
  { id: 15, name: "Williamson County Medical Associates", address: "2300 Round Rock Ave", city: "Round Rock", county: "Williamson", state: "TX", zip: "78681", industry: "healthcare", industryName: "Offices of Physicians", naics: "621111", status: "Active", founded: "2006" },
  { id: 16, name: "Cedar Park Family Medicine", address: "1401 Medical Pkwy", city: "Cedar Park", county: "Williamson", state: "TX", zip: "78613", industry: "healthcare", industryName: "Family Medical Practice", naics: "621111", status: "Active", founded: "2011" },
  { id: 17, name: "Round Rock Logistics Center", address: "3500 Gattis School Rd", city: "Round Rock", county: "Williamson", state: "TX", zip: "78664", industry: "logistics", industryName: "Warehousing and Storage", naics: "493110", status: "Active", founded: "2018" },
  { id: 18, name: "Dallas Precision Manufacturing", address: "4800 Spring Valley Rd", city: "Dallas", county: "Dallas", state: "TX", zip: "75244", industry: "manufacturing", industryName: "Precision Machining", naics: "332710", status: "Active", founded: "2008" },
  { id: 19, name: "North Texas Metal Fabricators", address: "2700 Singleton Blvd", city: "Dallas", county: "Dallas", state: "TX", zip: "75212", industry: "manufacturing", industryName: "Metal Fabrication", naics: "332312", status: "Active", founded: "2005" },
  { id: 20, name: "DFW Industrial Components", address: "9500 Forest Ln", city: "Dallas", county: "Dallas", state: "TX", zip: "75243", industry: "manufacturing", industryName: "Industrial Component Manufacturing", naics: "332999", status: "Active", founded: "2012" },
  { id: 21, name: "Trinity River Plastics", address: "1800 Chalk Hill Rd", city: "Dallas", county: "Dallas", state: "TX", zip: "75212", industry: "manufacturing", industryName: "Plastics Product Manufacturing", naics: "326199", status: "Active", founded: "2014" },
  { id: 22, name: "Metroplex Tool & Die", address: "3300 Lombardy Ln", city: "Dallas", county: "Dallas", state: "TX", zip: "75220", industry: "manufacturing", industryName: "Tool and Die Manufacturing", naics: "333514", status: "Active", founded: "2009" },
  { id: 23, name: "Dallas Medical Specialists Group", address: "8200 Walnut Hill Ln", city: "Dallas", county: "Dallas", state: "TX", zip: "75231", industry: "healthcare", industryName: "Specialty Medical Practice", naics: "621111", status: "Active", founded: "2007" },
  { id: 24, name: "North Dallas Primary Care", address: "5500 Preston Rd", city: "Dallas", county: "Dallas", state: "TX", zip: "75205", industry: "healthcare", industryName: "Primary Care Practice", naics: "621111", status: "Active", founded: "2010" },
  { id: 25, name: "DFW Rehabilitation Services", address: "3600 Gaston Ave", city: "Dallas", county: "Dallas", state: "TX", zip: "75246", industry: "healthcare", industryName: "Physical Therapy Services", naics: "621340", status: "Active", founded: "2016" },
  { id: 26, name: "Dallas Distribution Partners", address: "4100 W Ledbetter Dr", city: "Dallas", county: "Dallas", state: "TX", zip: "75236", industry: "logistics", industryName: "Warehousing and Storage", naics: "493110", status: "Active", founded: "2011" },
  { id: 27, name: "DFW Freight Services", address: "2800 Market Center Blvd", city: "Dallas", county: "Dallas", state: "TX", zip: "75207", industry: "logistics", industryName: "General Freight Trucking", naics: "484110", status: "Active", founded: "2013" },
  { id: 28, name: "Houston Industrial Manufacturing", address: "5600 Westheimer Rd", city: "Houston", county: "Harris", state: "TX", zip: "77056", industry: "manufacturing", industryName: "Industrial Equipment Manufacturing", naics: "333249", status: "Active", founded: "2006" },
  { id: 29, name: "Gulf Coast Metal Works", address: "8900 Gulf Fwy", city: "Houston", county: "Harris", state: "TX", zip: "77017", industry: "manufacturing", industryName: "Metal Fabrication", naics: "332312", status: "Active", founded: "2008" },
  { id: 30, name: "Bayou City Plastics Corp", address: "3200 Harrisburg Blvd", city: "Houston", county: "Harris", state: "TX", zip: "77003", industry: "manufacturing", industryName: "Plastics Manufacturing", naics: "326199", status: "Active", founded: "2015" },
  { id: 31, name: "Houston Precision Components", address: "12500 North Fwy", city: "Houston", county: "Harris", state: "TX", zip: "77060", industry: "manufacturing", industryName: "Precision Component Manufacturing", naics: "332721", status: "Active", founded: "2017" },
  { id: 32, name: "Energy Corridor Fabrication", address: "14400 Memorial Dr", city: "Houston", county: "Harris", state: "TX", zip: "77079", industry: "manufacturing", industryName: "Oil and Gas Equipment", naics: "333132", status: "Active", founded: "2010" },
  { id: 33, name: "Houston Medical Associates", address: "6550 Fannin St", city: "Houston", county: "Harris", state: "TX", zip: "77030", industry: "healthcare", industryName: "Multi-Specialty Practice", naics: "621111", status: "Active", founded: "2005" },
  { id: 34, name: "Memorial Hermann Physicians", address: "9800 Bellaire Blvd", city: "Houston", county: "Harris", state: "TX", zip: "77036", industry: "healthcare", industryName: "Offices of Physicians", naics: "621111", status: "Active", founded: "2009" },
  { id: 35, name: "Gulf Coast Rehabilitation", address: "1700 Dryden Rd", city: "Houston", county: "Harris", state: "TX", zip: "77030", industry: "healthcare", industryName: "Rehabilitation Services", naics: "621340", status: "Active", founded: "2012" },
  { id: 36, name: "Houston Logistics Hub", address: "16800 Imperial Valley Dr", city: "Houston", county: "Harris", state: "TX", zip: "77060", industry: "logistics", industryName: "Warehousing and Distribution", naics: "493110", status: "Active", founded: "2014" },
  { id: 37, name: "Port City Freight", address: "4500 Navigation Blvd", city: "Houston", county: "Harris", state: "TX", zip: "77011", industry: "logistics", industryName: "Freight Transportation", naics: "484110", status: "Active", founded: "2007" },
  { id: 38, name: "San Antonio Precision Machining", address: "3800 Fredericksburg Rd", city: "San Antonio", county: "Bexar", state: "TX", zip: "78201", industry: "manufacturing", industryName: "Machine Shops", naics: "332710", status: "Active", founded: "2011" },
  { id: 39, name: "Alamo City Metal Works", address: "5500 Rigsby Ave", city: "San Antonio", county: "Bexar", state: "TX", zip: "78222", industry: "manufacturing", industryName: "Metal Stamping", naics: "332116", status: "Active", founded: "2013" },
  { id: 40, name: "South Texas Industrial Co", address: "7800 W Military Dr", city: "San Antonio", county: "Bexar", state: "TX", zip: "78227", industry: "manufacturing", industryName: "Industrial Manufacturing", naics: "332999", status: "Active", founded: "2016" },
  { id: 41, name: "San Antonio Medical Group", address: "4100 Medical Dr", city: "San Antonio", county: "Bexar", state: "TX", zip: "78229", industry: "healthcare", industryName: "Multi-Specialty Practice", naics: "621111", status: "Active", founded: "2006" },
  { id: 42, name: "Alamo Heights Family Medicine", address: "5800 Broadway", city: "San Antonio", county: "Bexar", state: "TX", zip: "78209", industry: "healthcare", industryName: "Family Practice", naics: "621111", status: "Active", founded: "2014" },
  { id: 43, name: "San Antonio Distribution Center", address: "6200 S Flores St", city: "San Antonio", county: "Bexar", state: "TX", zip: "78214", industry: "logistics", industryName: "Warehousing and Storage", naics: "493110", status: "Active", founded: "2018" },
  { id: 44, name: "Fort Worth Precision Tools", address: "4200 N Main St", city: "Fort Worth", county: "Tarrant", state: "TX", zip: "76106", industry: "manufacturing", industryName: "Tool Manufacturing", naics: "333514", status: "Active", founded: "2009" },
  { id: 45, name: "Arlington Industrial Components", address: "2100 E Division St", city: "Arlington", county: "Tarrant", state: "TX", zip: "76011", industry: "manufacturing", industryName: "Component Manufacturing", naics: "332999", status: "Active", founded: "2015" },
  { id: 46, name: "Tarrant County Medical Associates", address: "1500 S Main St", city: "Fort Worth", county: "Tarrant", state: "TX", zip: "76104", industry: "healthcare", industryName: "Medical Practice", naics: "621111", status: "Active", founded: "2007" },
  { id: 47, name: "Fort Worth Logistics Services", address: "5000 Alliance Gateway", city: "Fort Worth", county: "Tarrant", state: "TX", zip: "76177", industry: "logistics", industryName: "Distribution Services", naics: "493110", status: "Active", founded: "2012" },
  { id: 48, name: "San Marcos Manufacturing", address: "1800 Industrial Dr", city: "San Marcos", county: "Hays", state: "TX", zip: "78666", industry: "manufacturing", industryName: "Industrial Manufacturing", naics: "332999", status: "Active", founded: "2017" },
  { id: 49, name: "Hays County Medical Center", address: "401 Wonder World Dr", city: "San Marcos", county: "Hays", state: "TX", zip: "78666", industry: "healthcare", industryName: "Outpatient Care Center", naics: "621493", status: "Active", founded: "2019" },
  { id: 50, name: "Central Texas Distribution", address: "2500 S IH-35", city: "San Marcos", county: "Hays", state: "TX", zip: "78666", industry: "logistics", industryName: "Warehousing", naics: "493110", status: "Active", founded: "2016" },
];

const ITEMS_PER_PAGE = 10;

const industryOptions = [
  { value: "", label: "All Industries" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "healthcare", label: "Healthcare" },
  { value: "logistics", label: "Logistics & Distribution" },
];

const countyOptions = [
  { value: "", label: "All Counties" },
  { value: "Travis", label: "Travis" },
  { value: "Williamson", label: "Williamson" },
  { value: "Dallas", label: "Dallas" },
  { value: "Harris", label: "Harris" },
  { value: "Bexar", label: "Bexar" },
  { value: "Tarrant", label: "Tarrant" },
  { value: "Hays", label: "Hays" },
];

export const PreviewPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [countyFilter, setCountyFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBusinesses = useMemo(() => {
    return sampleBusinesses.filter((business) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        business.name.toLowerCase().includes(query) ||
        business.industryName.toLowerCase().includes(query);
      const matchesIndustry =
        !industryFilter || business.industry === industryFilter;
      const matchesCounty =
        !countyFilter || business.county === countyFilter;
      return matchesSearch && matchesIndustry && matchesCounty;
    });
  }, [searchQuery, industryFilter, countyFilter]);

  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBusinesses = filteredBusinesses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleClearFilters = () => {
    setSearchQuery("");
    setIndustryFilter("");
    setCountyFilter("");
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleIndustryChange = (value: string) => {
    setIndustryFilter(value);
    setCurrentPage(1);
  };

  const handleCountyChange = (value: string) => {
    setCountyFilter(value);
    setCurrentPage(1);
  };

  const getIndustryLabel = (industry: string) => {
    switch (industry) {
      case "manufacturing":
        return "Manufacturing";
      case "healthcare":
        return "Healthcare";
      case "logistics":
        return "Logistics & Distribution";
      default:
        return industry;
    }
  };

  const getIndustryColor = (industry: string) => {
    switch (industry) {
      case "manufacturing":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "healthcare":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "logistics":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(16,185,129,0.05)] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[rgba(16,185,129,0.1)] text-accent border border-accent/20 mb-6">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Free Preview
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Explore Texas Business Data
          </h1>
          <p className="text-xl text-[#A0A0A0] max-w-3xl mx-auto mb-8">
            Browse 50 sample businesses from our comprehensive Texas database.
            See the depth of data available before requesting full access.
          </p>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-[rgba(16,185,129,0.1)] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              50 Sample Businesses
            </h3>
            <p className="text-[#A0A0A0] text-sm">
              Real business records across manufacturing, healthcare, and
              logistics sectors in Texas.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-[rgba(16,185,129,0.1)] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Limited Preview
            </h3>
            <p className="text-[#A0A0A0] text-sm">
              This is a curated sample. The full platform includes 47,312
              Texas businesses with employment data and industry analytics.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-[rgba(16,185,129,0.1)] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No Signup Required
            </h3>
            <p className="text-[#A0A0A0] text-sm">
              Browse freely. When you are ready for the full dataset, request a
              demo to unlock complete access.
            </p>
          </div>
        </div>
      </section>

      {/* Search Interface Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0A0]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by business name or industry..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder-[#A0A0A0] focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
              />
            </div>

            {/* Industry Filter */}
            <select
              value={industryFilter}
              onChange={(e) => handleIndustryChange(e.target.value)}
              className="px-4 py-3 bg-black border border-[#1A1A1A] rounded-lg text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors appearance-none cursor-pointer min-w-[200px]"
            >
              {industryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* County Filter */}
            <select
              value={countyFilter}
              onChange={(e) => handleCountyChange(e.target.value)}
              className="px-4 py-3 bg-black border border-[#1A1A1A] rounded-lg text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors appearance-none cursor-pointer min-w-[180px]"
            >
              {countyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={handleClearFilters}
              className="px-4 py-3 bg-black border border-[#1A1A1A] rounded-lg text-[#A0A0A0] hover:text-white hover:border-[#333] transition-colors whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#A0A0A0] text-sm">
            Showing{" "}
            <span className="text-white font-medium">
              {filteredBusinesses.length}
            </span>{" "}
            {filteredBusinesses.length === 1 ? "business" : "businesses"}
            {(searchQuery || industryFilter || countyFilter) && (
              <span className="text-[#A0A0A0]"> matching your filters</span>
            )}
          </p>
          {totalPages > 1 && (
            <p className="text-[#A0A0A0] text-sm">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Business Cards Grid */}
        {paginatedBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {paginatedBusinesses.map((business) => (
              <div
                key={business.id}
                className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6 hover:border-[#333] transition-colors"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {business.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
                    {business.status}
                  </span>
                </div>

                {/* Card Details */}
                <div className="space-y-3 mb-5">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-4 h-4 text-[#A0A0A0] mt-0.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-[#A0A0A0] text-sm">
                      {business.address}, {business.city}, {business.state}{" "}
                      {business.zip}
                    </span>
                  </div>

                  {/* County */}
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-4 h-4 text-[#A0A0A0] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm0 0h18"
                      />
                    </svg>
                    <span className="text-[#A0A0A0] text-sm">
                      {business.county} County
                    </span>
                  </div>

                  {/* Industry */}
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-4 h-4 text-[#A0A0A0] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getIndustryColor(
                          business.industry
                        )}`}
                      >
                        {getIndustryLabel(business.industry)}
                      </span>
                      <span className="text-[#A0A0A0] text-sm">
                        {business.industryName}
                      </span>
                    </div>
                  </div>

                  {/* NAICS */}
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-4 h-4 text-[#A0A0A0] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                    <span className="text-[#A0A0A0] text-sm">
                      NAICS: {business.naics}
                    </span>
                  </div>

                  {/* Founded */}
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-4 h-4 text-[#A0A0A0] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-[#A0A0A0] text-sm">
                      Founded: {business.founded}
                    </span>
                  </div>
                </div>

                {/* Disabled Details Button */}
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-black border border-[#1A1A1A] rounded-lg text-[#A0A0A0] cursor-not-allowed opacity-60"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Full details require demo access
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-12 text-center mb-8">
            <svg
              className="w-12 h-12 text-[#A0A0A0] mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-white mb-2">
              No businesses found
            </h3>
            <p className="text-[#A0A0A0] mb-4">
              Try adjusting your search or filters to find what you are looking
              for.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-lg hover:bg-accent/20 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#111111] border border-[#1A1A1A] rounded-lg text-[#A0A0A0] hover:text-white hover:border-[#333] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-accent text-black"
                      : "bg-[#111111] border border-[#1A1A1A] text-[#A0A0A0] hover:text-white hover:border-[#333]"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#111111] border border-[#1A1A1A] rounded-lg text-[#A0A0A0] hover:text-white hover:border-[#333] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Mid-Page CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 border border-accent/20 p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Want to see all 47,312 Texas businesses?
            </h2>
            <p className="text-[#A0A0A0] max-w-2xl mx-auto mb-8 text-lg">
              The full platform includes 47,312 businesses across 254 Texas counties
              with employment data, industry classifications, workforce trends,
              and capital program matching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/demo"
                className="inline-flex items-center justify-center px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                Request Demo
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                to="/solutions"
                className="inline-flex items-center justify-center px-6 py-3 bg-black border border-[#1A1A1A] text-white font-semibold rounded-lg hover:border-[#333] transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready for the Full Platform?
          </h2>
          <p className="text-[#A0A0A0] max-w-2xl mx-auto mb-8 text-lg">
            Access 47,312 Texas businesses across 254 counties with workforce analytics,
            capital program matching, and competitive intelligence. Built for economic
            development professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/demo"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent text-black font-bold rounded-lg hover:bg-accent/90 transition-colors text-lg"
            >
              Request Demo
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#111111] border border-[#1A1A1A] text-white font-semibold rounded-lg hover:border-[#333] transition-colors text-lg"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
