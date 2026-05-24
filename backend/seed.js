// backend/seed.js
// Run this ONCE to populate sample workers into your MongoDB
// Command: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');

const NAMES = [
  'Ramesh Kumar','Suresh Verma','Arun Mishra','Mohan Sharma','Raju Singh',
  'Vikram Yadav','Santosh Patel','Dinesh Gupta','Manoj Tiwari','Ajay Pandey',
  'Rakesh Nayak','Sanjay Dubey','Vijay Mehta','Deepak Soni','Harish Joshi',
  'Girish Rao','Naresh Iyer','Pradeep Das','Umesh Jha','Rajesh Chaudhary',
  'Bharat Pal','Govind Prasad','Hemant Trivedi','Kapil Saini','Devendra Kushwaha',
  'Arvind Tiwari','Mukesh Yadav','Prem Sharma','Laxmi Prasad','Shyam Sunder',
];

const SKILLS = ['Mason','Electrician','Plumber','Carpenter','Painter','Helper','Welder','Tiling'];
const SKILL_EXTRAS = {
  Mason:       ['Plastering','Tiling','RCC Work','Brickwork'],
  Electrician: ['Wiring','Fitting','Panel Work','Solar'],
  Plumber:     ['Pipeline','Sanitation','Boring','Drainage'],
  Carpenter:   ['Furniture','Doors','Framework','POP Work'],
  Painter:     ['Interior','Exterior','Texture','Waterproofing'],
  Helper:      ['Mixing','Loading','Cleaning','Support'],
  Welder:      ['Arc Welding','MIG','Fabrication','Grills'],
  Tiling:      ['Floor Tiles','Wall Tiles','Marble','Granite'],
};

const LOCATIONS = [
  { state:'Uttar Pradesh',  district:'Lucknow',   block:'Sarojini Nagar', village:'Rampur' },
  { state:'Uttar Pradesh',  district:'Varanasi',  block:'Pindra',         village:'Shyampur' },
  { state:'Rajasthan',      district:'Jaipur',    block:'Sanganer',       village:'Muhana' },
  { state:'Rajasthan',      district:'Jodhpur',   block:'Luni',           village:'Kankani' },
  { state:'Bihar',          district:'Patna',     block:'Danapur',        village:'Khagaul' },
  { state:'Bihar',          district:'Gaya',      block:'Bodh Gaya',      village:'Mastipur' },
  { state:'Maharashtra',    district:'Pune',      block:'Haveli',         village:'Uruli Kanchan' },
  { state:'Maharashtra',    district:'Nagpur',    block:'Kamptee',        village:'Godhani' },
  { state:'Gujarat',        district:'Ahmedabad', block:'Daskroi',        village:'Narol' },
  { state:'Madhya Pradesh', district:'Bhopal',    block:'Huzur',          village:'Ratibad' },
  { state:'Tamil Nadu',     district:'Madurai',   block:'Melur',          village:'Usilankulam' },
  { state:'Karnataka',      district:'Bengaluru', block:'Anekal',         village:'Chandapura' },
  { state:'Haryana',        district:'Gurugram',  block:'Pataudi',        village:'Bilaspur' },
  { state:'West Bengal',    district:'Howrah',    block:'Amta',           village:'Bagnan' },
  { state:'Odisha',         district:'Bhubaneswar',block:'Bhubaneswar',   village:'Patia' },
];

const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing workers (keep admins)
  await User.deleteMany({ role: 'worker' });
  console.log('🗑️  Cleared existing workers');

  const hashedPassword = await bcrypt.hash('password123', 12);
  const workers = [];

  for (let i = 0; i < 30; i++) {
    const skill    = pick(SKILLS);
    const location = pick(LOCATIONS);
    const rate     = rnd(350, 900);
    const exp      = rnd(1, 18);
    const rating   = parseFloat((3.5 + Math.random() * 1.5).toFixed(1));
    const jobs     = rnd(5, 120);
    const avail    = Math.random() > 0.3;
    const verified = Math.random() > 0.4;

    workers.push({
      name:     NAMES[i % NAMES.length],
      mobile:   `98${String(rnd(10000000, 99999999))}`,
      password: hashedPassword,
      role:     'worker',
      location,
      workerProfile: {
        primarySkill:     skill,
        additionalSkills: SKILL_EXTRAS[skill].slice(0, rnd(1, 3)),
        dailyRate:        rate,
        experience:       exp,
        bio:              `Experienced ${skill.toLowerCase()} with ${exp} years of hands-on work across residential and commercial projects.`,
        isAvailable:      avail,
        isVerified:       verified,
        avgRating:        rating,
        totalRatings:     rnd(2, 40),
        totalJobsDone:    jobs,
        registrationPaid: true,
      },
    });
  }

  await User.insertMany(workers);
  console.log(`✅ Seeded ${workers.length} workers successfully!`);
  console.log('👉 All workers have password: password123');
  mongoose.disconnect();
}

seed().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1); });
