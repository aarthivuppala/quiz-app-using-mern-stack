const mongoose = require('mongoose');
const Subject = require('../models/Subject');
require('dotenv').config();

const subjects = [
  {
    name: 'Machine Learning',
    code: 'CS302',
    icon: '📊',
    color: '#4ECDC4',
    description: 'Study of algorithms that learn from data',
    units: [
      { unitNumber: 1, name: 'Introduction to ML', topics: ['Types of ML', 'Bias-Variance Tradeoff', 'Confusion Matrix', 'Dimensionality Reduction'] },
      { unitNumber: 2, name: 'Supervised Learning', topics: ['Decision Trees', 'Information Gain', 'K-Nearest Neighbors', 'Overfitting'] },
      { unitNumber: 3, name: 'Neural Networks', topics: ['Perceptron', 'Backpropagation', 'MLP', 'Face Recognition'] },
      { unitNumber: 4, name: 'Bayesian Learning', topics: ['Bayes Theorem', 'Naive Bayes', 'SVM', 'Kernels'] },
      { unitNumber: 5, name: 'Unsupervised Learning', topics: ['Clustering', 'K-Means', 'Reinforcement Learning', 'Q-Learning'] }
    ]
  },
  {
    name: 'Formal Language & Automata Theory',
    code: 'CS305',
    icon: '🔤',
    color: '#FFEAA7',
    description: 'Study of abstract machines and languages',
    units: [
      { unitNumber: 1, name: 'Finite Automata', topics: ['DFA', 'NFA', 'Epsilon Transitions', 'Moore & Mealy Machines'] },
      { unitNumber: 2, name: 'Regular Expressions', topics: ['Regular Languages', 'Pumping Lemma', 'Closure Properties', 'Minimization'] },
      { unitNumber: 3, name: 'Context-Free Grammars', topics: ['CFG', 'Parse Trees', 'Ambiguity', 'Chomsky Normal Form'] },
      { unitNumber: 4, name: 'Push Down Automata', topics: ['PDA', 'Equivalence with CFG', 'Pumping Lemma for CFL'] },
      { unitNumber: 5, name: 'Turing Machines', topics: ['Turing Machine', 'Halting Problem', 'Undecidability', 'Recursive Languages'] }
    ]
  },
  {
    name: 'Artificial Intelligence',
    code: 'CS301',
    icon: '🧠',
    color: '#FF6B6B',
    description: 'Building intelligent agents and systems',
    units: [
      { unitNumber: 1, name: 'Introduction & Search', topics: ['Intelligent Agents', 'BFS', 'DFS', 'A* Search', 'Heuristics'] },
      { unitNumber: 2, name: 'Adversarial Search & Logic', topics: ['Alpha-Beta Pruning', 'CSP', 'Propositional Logic', 'Resolution'] },
      { unitNumber: 3, name: 'First-Order Logic', topics: ['FOL Syntax', 'Inference', 'Unification', 'Forward/Backward Chaining'] },
      { unitNumber: 4, name: 'Knowledge Representation', topics: ['Ontology', 'Categories', 'Planning', 'Planning Graphs'] },
      { unitNumber: 5, name: 'Uncertainty', topics: ['Bayesian Networks', 'Probability', 'Inference', 'Dempster-Shafer Theory'] }
    ]
  },
  {
    name: 'Full Stack Development',
    code: 'CS303',
    icon: '💻',
    color: '#45B7D1',
    description: 'End-to-end web application development',
    units: [
      { unitNumber: 1, name: 'Introduction to Full Stack', topics: ['Web Framework', 'JavaScript', 'Node.js', 'Event Loop'] },
      { unitNumber: 2, name: 'Node.js Deep Dive', topics: ['File System', 'HTTP Services', 'Buffer/Stream', 'Crypto Module'] },
      { unitNumber: 3, name: 'MongoDB', topics: ['NoSQL', 'Data Modeling', 'CRUD Operations', 'MongoDB Driver'] },
      { unitNumber: 4, name: 'Express & Angular', topics: ['Express Routing', 'Middleware', 'Angular Components', 'Data Binding'] },
      { unitNumber: 5, name: 'React', topics: ['Components', 'Props/State', 'Lifecycle', 'Hooks', 'Routing'] }
    ]
  },
  {
    name: 'Non-Conventional Power Generation',
    code: 'EE304',
    icon: '⚡',
    color: '#96CEB4',
    description: 'Alternative and renewable energy sources',
    units: [
      { unitNumber: 1, name: 'Solar Energy', topics: ['Solar Radiation', 'Flat Plate Collectors', 'Solar Ponds', 'Thermal Conversion'] },
      { unitNumber: 2, name: 'Solar Electric Power', topics: ['Photovoltaic Cells', 'V-I Characteristics', 'Solar Tracking', 'PV Modules'] },
      { unitNumber: 3, name: 'Wind Energy', topics: ['Wind Turbines', 'Betz Limit', 'Horizontal/Vertical Axis', 'Wind Farms'] },
      { unitNumber: 4, name: 'Biomass', topics: ['Bio Gas', 'Gasification', 'Aerobic/Anaerobic Digestion', 'Geothermal'] },
      { unitNumber: 5, name: 'Ocean Energy & Fuel Cells', topics: ['OTEC', 'Tidal Power', 'Wave Energy', 'Fuel Cells'] }
    ]
  },
  {
    name: 'Universal Human Values',
    code: 'HS306',
    icon: '❤️',
    color: '#DDA0DD',
    description: 'Value education and professional ethics',
    units: [
      { unitNumber: 1, name: 'Course Introduction', topics: ['Self-Exploration', 'Natural Acceptance', 'Happiness vs Prosperity'] },
      { unitNumber: 2, name: 'Harmony in Human Being', topics: ['Self and Body', 'Health', 'Program for Self'] },
      { unitNumber: 3, name: 'Harmony in Family & Society', topics: ['Justice', 'Mutual Happiness', 'Undivided Society'] },
      { unitNumber: 4, name: 'Harmony in Nature', topics: ['Four Orders', 'Recyclability', 'Coexistence'] },
      { unitNumber: 5, name: 'Professional Ethics', topics: ['Eco-friendly Production', 'Holistic Technologies', 'Case Studies'] }
    ]
  }
];

async function seedSubjects() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing subjects
    await Subject.deleteMany({});
    console.log('Cleared existing subjects');
    
    // Insert new subjects
    await Subject.insertMany(subjects);
    console.log(`✅ Seeded ${subjects.length} subjects successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding subjects:', error);
    process.exit(1);
  }
}

seedSubjects();