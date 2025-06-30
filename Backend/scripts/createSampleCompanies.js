const mongoose = require('mongoose');
const Company = require('../models/Company');
require('dotenv').config();

const sampleCompanies = [
  {
    name: "TechNova Solutions",
    logo: "🚀",
    industry: "Technology",
    size: "500-1000",
    location: "San Francisco, CA",
    description: "Leading AI and machine learning solutions provider transforming businesses worldwide. We specialize in cutting-edge technology that drives innovation and growth.",
    website: "technova.com",
    rating: 4.8,
    reviewCount: 342,
    openJobs: 25,
    featured: true,
    verified: true,
    trending: true,
    topBenefits: ["Remote Work", "Stock Options", "Learning Budget", "Flexible Hours"],
    salaryRange: {
      min: 80000,
      max: 180000,
      currency: "USD"
    },
    hiringUrgency: "high",
    contactEmail: "careers@technova.com",
    foundedYear: 2018,
    headquarters: "San Francisco, CA",
    totalEmployees: 750
  },
  {
    name: "GreenEnergy Corp",
    logo: "🌱",
    industry: "Energy",
    size: "1000+",
    location: "Austin, TX",
    description: "Renewable energy solutions and sustainability consulting for a greener future. We're committed to building a sustainable world through innovative energy solutions.",
    website: "greenenergy.com",
    rating: 4.6,
    reviewCount: 256,
    openJobs: 18,
    featured: false,
    verified: true,
    trending: false,
    topBenefits: ["401k Match", "Flexible Hours", "Green Commute", "Health Insurance"],
    salaryRange: {
      min: 70000,
      max: 150000,
      currency: "USD"
    },
    hiringUrgency: "medium",
    contactEmail: "jobs@greenenergy.com",
    foundedYear: 2015,
    headquarters: "Austin, TX",
    totalEmployees: 1200
  },
  {
    name: "MedTech Innovations",
    logo: "🏥",
    industry: "Healthcare",
    size: "200-500",
    location: "Boston, MA",
    description: "Revolutionary medical technology and healthcare solutions saving lives globally. We develop cutting-edge medical devices and healthcare software.",
    website: "medtech-innov.com",
    rating: 4.9,
    reviewCount: 189,
    openJobs: 32,
    featured: true,
    verified: true,
    trending: true,
    topBenefits: ["Premium Healthcare", "Research Time", "Sabbatical", "Professional Development"],
    salaryRange: {
      min: 90000,
      max: 200000,
      currency: "USD"
    },
    hiringUrgency: "high",
    contactEmail: "careers@medtech-innov.com",
    foundedYear: 2020,
    headquarters: "Boston, MA",
    totalEmployees: 350
  },
  {
    name: "FinanceFlow",
    logo: "💰",
    industry: "Finance",
    size: "100-200",
    location: "New York, NY",
    description: "Modern financial services and digital banking solutions for the next generation. We're revolutionizing how people manage their money.",
    website: "financeflow.com",
    rating: 4.7,
    reviewCount: 423,
    openJobs: 15,
    featured: false,
    verified: true,
    trending: false,
    topBenefits: ["Bonus Structure", "Stock Options", "Gym Membership", "Financial Planning"],
    salaryRange: {
      min: 100000,
      max: 250000,
      currency: "USD"
    },
    hiringUrgency: "medium",
    contactEmail: "talent@financeflow.com",
    foundedYear: 2019,
    headquarters: "New York, NY",
    totalEmployees: 150
  },
  {
    name: "EduTech Academy",
    logo: "📚",
    industry: "Education",
    size: "50-100",
    location: "Seattle, WA",
    description: "Online learning platforms and educational technology reshaping how we learn. We make quality education accessible to everyone.",
    website: "edutech-academy.com",
    rating: 4.5,
    reviewCount: 98,
    openJobs: 12,
    featured: false,
    verified: true,
    trending: true,
    topBenefits: ["Learning Budget", "Flexible Schedule", "Home Office", "Education Benefits"],
    salaryRange: {
      min: 60000,
      max: 120000,
      currency: "USD"
    },
    hiringUrgency: "low",
    contactEmail: "jobs@edutech-academy.com",
    foundedYear: 2021,
    headquarters: "Seattle, WA",
    totalEmployees: 75
  },
  {
    name: "CloudScale Systems",
    logo: "☁️",
    industry: "Technology",
    size: "200-500",
    location: "Denver, CO",
    description: "Cloud infrastructure and enterprise solutions powering digital transformation. We help businesses scale their operations in the cloud.",
    website: "cloudscale.com",
    rating: 4.8,
    reviewCount: 234,
    openJobs: 28,
    featured: true,
    verified: true,
    trending: false,
    topBenefits: ["Remote First", "Unlimited PTO", "Tech Stipend", "Conference Budget"],
    salaryRange: {
      min: 85000,
      max: 170000,
      currency: "USD"
    },
    hiringUrgency: "high",
    contactEmail: "careers@cloudscale.com",
    foundedYear: 2017,
    headquarters: "Denver, CO",
    totalEmployees: 400
  },
  {
    name: "Creative Design Studio",
    logo: "🎨",
    industry: "Media",
    size: "50-100",
    location: "Los Angeles, CA",
    description: "Award-winning design agency creating stunning visual experiences for global brands. We bring creativity and innovation to every project.",
    website: "creativedesignstudio.com",
    rating: 4.4,
    reviewCount: 156,
    openJobs: 8,
    featured: false,
    verified: true,
    trending: false,
    topBenefits: ["Creative Freedom", "Flexible Hours", "Design Tools", "Portfolio Building"],
    salaryRange: {
      min: 55000,
      max: 110000,
      currency: "USD"
    },
    hiringUrgency: "low",
    contactEmail: "hello@creativedesignstudio.com",
    foundedYear: 2016,
    headquarters: "Los Angeles, CA",
    totalEmployees: 65
  },
  {
    name: "LogiTech Solutions",
    logo: "📦",
    industry: "Transportation",
    size: "100-200",
    location: "Chicago, IL",
    description: "Logistics and supply chain optimization solutions for modern businesses. We streamline operations and reduce costs through smart technology.",
    website: "logitech-solutions.com",
    rating: 4.3,
    reviewCount: 89,
    openJobs: 14,
    featured: false,
    verified: true,
    trending: true,
    topBenefits: ["Health Insurance", "401k", "Professional Development", "Travel Opportunities"],
    salaryRange: {
      min: 65000,
      max: 130000,
      currency: "USD"
    },
    hiringUrgency: "medium",
    contactEmail: "careers@logitech-solutions.com",
    foundedYear: 2018,
    headquarters: "Chicago, IL",
    totalEmployees: 120
  }
];

const createSampleCompanies = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing companies
    await Company.deleteMany({});
    console.log('🗑️  Cleared existing companies');

    // Insert sample companies
    const companies = await Company.insertMany(sampleCompanies);
    console.log(`✅ Created ${companies.length} sample companies`);

    // Display created companies
    companies.forEach(company => {
      console.log(`📋 ${company.name} - ${company.industry} - ${company.location}`);
    });

    console.log('\n🎉 Sample companies created successfully!');
    console.log('🌐 You can now test the companies API at: http://localhost:5000/api/companies');

  } catch (error) {
    console.error('❌ Error creating sample companies:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
createSampleCompanies(); 