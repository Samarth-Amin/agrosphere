export interface User {
  id: number
  username: string
  fullName: string
  role: 'Farmer' | 'Buyer' | 'Admin'
  avatar?: string
}

export interface Farm {
  id: number
  userId: number
  name: string
  location: string
  areaAcres: number
  farmType: 'Organic' | 'Mixed' | 'Commercial' | 'Hydroponic'
  status: 'Active' | 'Under Preparation' | 'Fallow'
  establishedYear: number
}

export interface Crop {
  id: number
  farmId: number
  name: string
  season: 'Kharif' | 'Rabi' | 'Zaid'
  areaSown: number
  sowDate: string
  expectedHarvestDate: string
  status: 'Germinating' | 'Growing' | 'Ready for Harvest' | 'Harvested'
  targetYieldKg: number
}

export interface InventoryItem {
  id: number
  farmId: number
  itemName: string
  category: 'Seed' | 'Fertilizer' | 'Pesticide' | 'Equipment' | 'Packaging'
  quantity: number
  unit: string
  reorderLevel: number
  supplier: string
}

export interface Listing {
  id: number
  userId: number
  sellerName: string
  cropName: string
  farmName: string
  location: string
  quantity: number
  unit: string
  pricePerUnit: number
  status: 'Available' | 'Sold Out' | 'Reserved'
  grade: 'A+' | 'A' | 'Organic Certified'
  postedOn: string
}

export interface Order {
  id: number
  listingId: number
  buyerId: number
  buyerName: string
  cropName: string
  quantity: number
  unit: string
  totalPrice: number
  batchCode: string
  status: 'Confirmed' | 'Processing at Hub' | 'Dispatched in Transit' | 'Delivered'
  orderDate: string
  estimatedDelivery: string
  deliveryPartner: string
  deliveryAddress: string
  currentLocation: string
}

export interface Transaction {
  id: number
  userId: number
  type: 'Income' | 'Expense'
  description: string
  amount: number
  category: 'Crop Sales' | 'Input Purchase' | 'Logistics' | 'Equipment' | 'Subsidies' | 'Labor'
  date: string
  referenceId?: string
}

export interface PriceForecast {
  crop: string
  currentPrice: number
  forecastPrice: number
  trend: 'up' | 'down' | 'stable'
  changePercent: string
  confidence: number
  mandi: string
  recommendation: 'Strong Sell' | 'Hold for Gain' | 'Sell Gradual'
}

export interface SubsidyScheme {
  id: string
  title: string
  authority: string
  maxBenefit: string
  category: string
  deadline: string
  status: 'Open' | 'Expiring Soon' | 'Year-round'
  summary: string
  documentsNeeded: string[]
}

export interface ForumReply {
  id: number
  postId: number
  userId: number
  authorName: string
  role: string
  content: string
  repliedOn: string
}

export interface ForumPost {
  id: number
  userId: number
  authorName: string
  role: string
  title: string
  content: string
  category: 'Organic Farming' | 'Crop Advisory' | 'Market Trends' | 'AgTech' | 'Pest Control'
  likes: number
  postedOn: string
  replies: ForumReply[]
}

// In-Memory Seed Storage for Instant Full-Stack Execution
class MockDatabase {
  users: User[] = [
    { id: 1, username: 'samarth', fullName: 'Samarth Amin', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    { id: 2, username: 'panth', fullName: 'Panth Dholakiya', role: 'Farmer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
    { id: 3, username: 'anita', fullName: 'Anita Patel', role: 'Buyer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' }
  ]

  farms: Farm[] = [
    { id: 1, userId: 1, name: 'Green Valley Organic Estate', location: 'Ahmedabad, Gujarat', areaAcres: 28.5, farmType: 'Organic', status: 'Active', establishedYear: 2021 },
    { id: 2, userId: 1, name: 'Sunrise Agritech Fields', location: 'Rajkot, Gujarat', areaAcres: 45.0, farmType: 'Mixed', status: 'Active', establishedYear: 2019 },
    { id: 3, userId: 2, name: 'Gir Hills Permaculture Hub', location: 'Junagadh, Gujarat', areaAcres: 16.0, farmType: 'Organic', status: 'Active', establishedYear: 2023 }
  ]

  crops: Crop[] = [
    { id: 1, farmId: 1, name: 'Sharbati Wheat', season: 'Rabi', areaSown: 14.5, sowDate: '2026-10-15', expectedHarvestDate: '2027-03-20', status: 'Growing', targetYieldKg: 18000 },
    { id: 2, farmId: 1, name: 'Kasturi Basmati Rice', season: 'Kharif', areaSown: 10.0, sowDate: '2026-06-25', expectedHarvestDate: '2026-11-15', status: 'Ready for Harvest', targetYieldKg: 12500 },
    { id: 3, farmId: 2, name: 'Bt Organic Cotton', season: 'Kharif', areaSown: 22.0, sowDate: '2026-06-10', expectedHarvestDate: '2026-11-05', status: 'Harvested', targetYieldKg: 16000 },
    { id: 4, farmId: 2, name: 'Pusa Bold Mustard', season: 'Rabi', areaSown: 18.0, sowDate: '2026-10-28', expectedHarvestDate: '2027-02-15', status: 'Germinating', targetYieldKg: 9500 },
    { id: 5, farmId: 3, name: 'Kesar Mango Orchards', season: 'Zaid', areaSown: 12.0, sowDate: '2024-02-01', expectedHarvestDate: '2027-05-10', status: 'Growing', targetYieldKg: 24000 }
  ]

  inventory: InventoryItem[] = [
    { id: 1, farmId: 1, itemName: 'Organic Vermicompost', category: 'Fertilizer', quantity: 1200, unit: 'kg', reorderLevel: 300, supplier: 'GreenEarth BioInputs' },
    { id: 2, farmId: 1, itemName: 'Certified Sharbati Wheat Seeds (HD-2967)', category: 'Seed', quantity: 350, unit: 'kg', reorderLevel: 100, supplier: 'State Seed Corp' },
    { id: 3, farmId: 1, itemName: 'Neem-based Bio Insecticide', category: 'Pesticide', quantity: 45, unit: 'litres', reorderLevel: 20, supplier: 'BioProtect Ltd' },
    { id: 4, farmId: 2, itemName: 'Soluble NPK 19-19-19', category: 'Fertilizer', quantity: 500, unit: 'kg', reorderLevel: 150, supplier: 'AgroChemical Co' },
    { id: 5, farmId: 2, itemName: 'Laser Drip Emitter Tubes 16mm', category: 'Equipment', quantity: 800, unit: 'meters', reorderLevel: 200, supplier: 'Jain Irrigation' },
    { id: 6, farmId: 3, itemName: 'Jute Storage Bags (50kg)', category: 'Packaging', quantity: 450, unit: 'bags', reorderLevel: 100, supplier: 'Saurashtra Packaging' }
  ]

  listings: Listing[] = [
    { id: 1, userId: 1, sellerName: 'Samarth Amin', cropName: 'Premium Sharbati Wheat', farmName: 'Green Valley Organic Estate', location: 'Ahmedabad APMC', quantity: 4500, unit: 'kg', pricePerUnit: 32.50, status: 'Available', grade: 'Organic Certified', postedOn: '2026-11-06' },
    { id: 2, userId: 1, sellerName: 'Samarth Amin', cropName: 'Aged Kasturi Basmati Rice', farmName: 'Green Valley Organic Estate', location: 'Gujarat Agro Terminal', quantity: 2800, unit: 'kg', pricePerUnit: 68.00, status: 'Available', grade: 'A+', postedOn: '2026-11-07' },
    { id: 3, userId: 2, sellerName: 'Panth Dholakiya', cropName: 'Long Staple Raw Cotton', farmName: 'Sunrise Agritech Fields', location: 'Rajkot Cotton Exchange', quantity: 6000, unit: 'kg', pricePerUnit: 76.20, status: 'Available', grade: 'A', postedOn: '2026-11-05' },
    { id: 4, userId: 1, sellerName: 'Samarth Amin', cropName: 'Yellow Mustard Seeds', farmName: 'Green Valley Organic Estate', location: 'Ahmedabad APMC', quantity: 1500, unit: 'kg', pricePerUnit: 58.00, status: 'Available', grade: 'Organic Certified', postedOn: '2026-11-08' }
  ]

  orders: Order[] = [
    {
      id: 101,
      listingId: 1,
      buyerId: 3,
      buyerName: 'Anita Patel (Kalyan Grocers)',
      cropName: 'Premium Sharbati Wheat',
      quantity: 1200,
      unit: 'kg',
      totalPrice: 39000,
      batchCode: 'AGRO-20261105-9421',
      status: 'Dispatched in Transit',
      orderDate: '2026-11-05 10:30',
      estimatedDelivery: '2026-11-09',
      deliveryPartner: 'AgroExpress Logistics Fleet 4',
      deliveryAddress: 'Sector 19 Wholesale Hub, Gandhinagar',
      currentLocation: 'Sanand Agro Corridor Toll Plaza (KM 42)'
    },
    {
      id: 102,
      listingId: 3,
      buyerId: 3,
      buyerName: 'Anita Patel (Saurashtra Mills)',
      cropName: 'Long Staple Raw Cotton',
      quantity: 2500,
      unit: 'kg',
      totalPrice: 190500,
      batchCode: 'AGRO-20261107-1288',
      status: 'Processing at Hub',
      orderDate: '2026-11-07 14:15',
      estimatedDelivery: '2026-11-11',
      deliveryPartner: 'Gujarat Green Line Transporters',
      deliveryAddress: 'Industrial Area Phase 2, Rajkot',
      currentLocation: 'Sunrise Farm Grading Station B'
    },
    {
      id: 103,
      listingId: 2,
      buyerId: 3,
      buyerName: 'Anita Patel',
      cropName: 'Aged Kasturi Basmati Rice',
      quantity: 500,
      unit: 'kg',
      totalPrice: 34000,
      batchCode: 'AGRO-20261028-5542',
      status: 'Delivered',
      orderDate: '2026-10-28 09:00',
      estimatedDelivery: '2026-11-01',
      deliveryPartner: 'Speedy AgriDispatch',
      deliveryAddress: 'Bopal Central Distribution, Ahmedabad',
      currentLocation: 'Delivered to Destination Warehouse'
    }
  ]

  transactions: Transaction[] = [
    { id: 1, userId: 1, type: 'Income', description: 'Batch AGRO-20261105-9421 Sharbati Wheat sale to Kalyan Grocers', amount: 39000, category: 'Crop Sales', date: '2026-11-05', referenceId: 'TXN-9421' },
    { id: 2, userId: 1, type: 'Income', description: 'Batch AGRO-20261028-5542 Basmati Rice consignment completion', amount: 34000, category: 'Crop Sales', date: '2026-11-01', referenceId: 'TXN-5542' },
    { id: 3, userId: 1, type: 'Income', description: 'PM-KISAN DBT Direct Benefit Transfer Instalment', amount: 6000, category: 'Subsidies', date: '2026-10-20', referenceId: 'GOV-8821' },
    { id: 4, userId: 1, type: 'Expense', description: 'Certified Sowing Seeds from Gujarat State Seed Corp', amount: 14200, category: 'Input Purchase', date: '2026-10-22', referenceId: 'EXP-1044' },
    { id: 5, userId: 1, type: 'Expense', description: 'Bulk Vermicompost Organic Enrichment & Soil Amendment', amount: 8400, category: 'Input Purchase', date: '2026-10-26', referenceId: 'EXP-1092' },
    { id: 6, userId: 1, type: 'Expense', description: 'Seasonal Farm Field Labor for Rabi Sowing & Tilling', amount: 12500, category: 'Labor', date: '2026-10-30', referenceId: 'EXP-1120' },
    { id: 7, userId: 1, type: 'Expense', description: 'Drip Emitter Maintenance & Pressure Pump Servicing', amount: 4800, category: 'Equipment', date: '2026-11-03', referenceId: 'EXP-1145' }
  ]

  forecasts: PriceForecast[] = [
    { crop: 'Sharbati Wheat', currentPrice: 32.50, forecastPrice: 35.80, trend: 'up', changePercent: '+10.1%', confidence: 91, mandi: 'Ahmedabad APMC', recommendation: 'Hold for Gain' },
    { crop: 'Kasturi Basmati Rice', currentPrice: 68.00, forecastPrice: 71.40, trend: 'up', changePercent: '+5.0%', confidence: 88, mandi: 'Gujarat Agro Terminal', recommendation: 'Sell Gradual' },
    { crop: 'Bt Cotton (Medium Staple)', currentPrice: 76.20, forecastPrice: 73.10, trend: 'down', changePercent: '-4.1%', confidence: 84, mandi: 'Rajkot Cotton Hub', recommendation: 'Strong Sell' },
    { crop: 'Pusa Bold Mustard', currentPrice: 58.00, forecastPrice: 62.90, trend: 'up', changePercent: '+8.4%', confidence: 89, mandi: 'Deesa APMC', recommendation: 'Hold for Gain' },
    { crop: 'Soybean (Black Spot Free)', currentPrice: 47.50, forecastPrice: 47.90, trend: 'stable', changePercent: '+0.8%', confidence: 79, mandi: 'Kadi Mandi', recommendation: 'Sell Gradual' },
    { crop: 'Potatoes (Processing Grade)', currentPrice: 18.20, forecastPrice: 16.40, trend: 'down', changePercent: '-9.8%', confidence: 86, mandi: 'Deesa Cold Hub', recommendation: 'Strong Sell' }
  ]

  subsidies: SubsidyScheme[] = [
    {
      id: 'SCH-01',
      title: 'PM-KUSUM Solar Agricultural Pump Scheme',
      authority: 'Ministry of New and Renewable Energy',
      maxBenefit: '60% capital subsidy on 7.5HP solar pumps',
      category: 'Irrigation & Solar',
      deadline: '2027-01-31',
      status: 'Open',
      summary: 'Provides up to 60% direct subsidy for installing standalone off-grid solar-powered water pumps, replacing high-emission diesel setups.',
      documentsNeeded: ['7/12 Land Extract', 'Aadhaar Card', 'Bank Passbook', 'Discom NOC']
    },
    {
      id: 'SCH-02',
      title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
      authority: 'Department of Agriculture & Farmers Welfare',
      maxBenefit: '₹50,000 / hectare over 3-year cycle',
      category: 'Organic Certification',
      deadline: '2026-12-15',
      status: 'Open',
      summary: 'Financial incentive clusters for organic cultivation, bio-fertilizer procurement, PGS-India certification, and organic branding.',
      documentsNeeded: ['Soil Health Certificate', 'Cluster Verification Form', 'Organic Field Plan']
    },
    {
      id: 'SCH-03',
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      authority: 'Agricultural Insurance Company of India',
      maxBenefit: 'Up to 100% sum insured against natural perils',
      category: 'Crop Insurance',
      deadline: '2026-11-30',
      status: 'Expiring Soon',
      summary: 'Comprehensive yield insurance coverage against drought, flood, pests, and unseasonal rainfall for Rabi crops at a minimal 1.5% farmer premium.',
      documentsNeeded: ['Sowing Certificate (Talati)', 'Land Records 8A', 'Aadhaar Linked Account']
    },
    {
      id: 'SCH-04',
      title: 'Micro-Irrigation Drip Subsidy (GGRC)',
      authority: 'Gujarat Green Revolution Company',
      maxBenefit: '70% subsidy for small & marginal landholders',
      category: 'Water Conservation',
      deadline: '2027-03-31',
      status: 'Year-round',
      summary: 'Direct state subsidy for high-efficiency drip and micro-sprinkler installations, conserving 45% water and boosting yield by 30%.',
      documentsNeeded: ['Water Source Test Report', 'Land Map 7/12', 'Electricity Bill']
    }
  ]

  forumPosts: ForumPost[] = [
    {
      id: 1,
      userId: 1,
      authorName: 'Samarth Amin',
      role: 'Organic Agro Lead',
      title: 'Lessons learned: Zero-budget natural farming techniques for Rabi Wheat',
      category: 'Organic Farming',
      content: 'Over the last two Rabi seasons, we phased out chemical DAP completely in favor of Jeevamrutha and microbial compost extracts on our Ahmedabad acreage. Sowing with certified HD-2967 gave us comparable kernel density with 40% lower input expenditure. Happy to answer questions regarding spray timing!',
      likes: 38,
      postedOn: '2026-11-04 11:20',
      replies: [
        {
          id: 1,
          postId: 1,
          userId: 2,
          authorName: 'Panth Dholakiya',
          role: 'Farmer',
          content: 'Samarth, what frequency did you maintain for the foliar Jeevamrutha spray during the crown root initiation (CRI) stage?',
          repliedOn: '2026-11-04 14:05'
        },
        {
          id: 2,
          postId: 1,
          userId: 1,
          authorName: 'Samarth Amin',
          role: 'Organic Agro Lead',
          content: 'We sprayed at 21 days post-sowing (CRI stage) and repeated at the tillering stage around day 45 with a 10% solution. Water aeration was key!',
          repliedOn: '2026-11-04 16:30'
        }
      ]
    },
    {
      id: 2,
      userId: 2,
      authorName: 'Panth Dholakiya',
      role: 'Farmer',
      title: 'Pink bollworm defense protocols for late-season cotton harvesting',
      category: 'Pest Control',
      content: 'Early monitoring using delta pheromone traps placed at 5 traps/acre helped us detect moth flare-ups 10 days before larval entry into bolls. Combined with Trichogramma parasitoid cards, damage was kept below 2%.',
      likes: 24,
      postedOn: '2026-11-06 09:45',
      replies: []
    },
    {
      id: 3,
      userId: 3,
      authorName: 'Anita Patel',
      role: 'Agri Commodity Buyer',
      title: 'Current wholesale demand: Certified Organic Basmati & Yellow Mustard requirements',
      category: 'Market Trends',
      content: 'Wholesale retail chains are offering a 14% premium for batch-traceable organic Basmati rice with moisture content strictly under 12%. Farmers with QR batch certifications can reach out directly via the Marketplace tab.',
      likes: 42,
      postedOn: '2026-11-07 15:10',
      replies: [
        {
          id: 3,
          postId: 3,
          userId: 1,
          authorName: 'Samarth Amin',
          role: 'Organic Agro Lead',
          content: 'Our harvest is currently finishing curing at Green Valley and will be listed with full moisture lab certificates by Wednesday.',
          repliedOn: '2026-11-07 17:25'
        }
      ]
    }
  ]
}

export const db = new MockDatabase()
