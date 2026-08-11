const Department = require('../models/Department');
const User = require('../models/User');

const departments = [
  {
    name: 'Public Works Department',
    code: 'PWD',
    description: 'Handles roads, bridges, and public infrastructure',
    categories: ['Road Damage', 'Pothole', 'Bridge Issue'],
    head: 'Chief Engineer',
    contactEmail: 'pwd@nagarsetu.gov',
    contactPhone: '+91-9876543001'
  },
  {
    name: 'Sanitation Department',
    code: 'SAN',
    description: 'Handles garbage collection, drainage, and sewage',
    categories: ['Garbage', 'Drainage', 'Sewage', 'Sanitation'],
    head: 'Sanitation Officer',
    contactEmail: 'sanitation@nagarsetu.gov',
    contactPhone: '+91-9876543002'
  },
  {
    name: 'Water Supply Department',
    code: 'WSD',
    description: 'Handles water supply, leakage, and pipeline issues',
    categories: ['Water Leakage', 'Pipeline Burst', 'Water Supply'],
    head: 'Water Engineer',
    contactEmail: 'water@nagarsetu.gov',
    contactPhone: '+91-9876543003'
  },
  {
    name: 'Electricity Department',
    code: 'ELEC',
    description: 'Handles street lights, power outages, and electrical faults',
    categories: ['Street Light', 'Power Outage', 'Electricity Fault'],
    head: 'Electrical Engineer',
    contactEmail: 'electricity@nagarsetu.gov',
    contactPhone: '+91-9876543004'
  },
  {
    name: 'Health Department',
    code: 'HEALTH',
    description: 'Handles hospital and medical emergency issues',
    categories: ['Hospital', 'Medical Emergency'],
    head: 'Chief Medical Officer',
    contactEmail: 'health@nagarsetu.gov',
    contactPhone: '+91-9876543005'
  },
  {
    name: 'Transport Department',
    code: 'TRANS',
    description: 'Handles traffic management, parking, and public transport',
    categories: ['Traffic', 'Parking', 'Public Transport'],
    head: 'Transport Commissioner',
    contactEmail: 'transport@nagarsetu.gov',
    contactPhone: '+91-9876543006'
  }
];

const seedDepartments = async () => {
  try {
    const count = await Department.countDocuments();
    if (count === 0) {
      await Department.insertMany(departments);
      console.log('✅ Departments seeded successfully');
    }
    // Seed admin user (uses environment variables if provided)
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@nagarsetu.local';
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
      const adminExists = await User.findOne({ email: adminEmail });
      if (!adminExists) {
        await User.create({
          name: 'Administrator',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
          phone: ''
        });
        console.log(`✅ Admin user seeded: ${adminEmail}`);
      } else {
        console.log(`Admin user already exists: ${adminEmail}`);
      }
    } catch (err) {
      console.error('Error seeding admin user:', err.message);
    }
  } catch (error) {
    console.error('Error seeding departments:', error.message);
  }
};

module.exports = seedDepartments;
