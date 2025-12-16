const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  counter: {
    type: Number,
    default: 0,
    min: [0, 'Counter cannot be negative']
  },
  homePageCounter: {
    type: Number,
    default: 0,
    min: [0, 'Home page counter cannot be negative']
  },
  featurePageCounter: {
    type: Number,
    default: 0,
    min: [0, 'Feature page counter cannot be negative']
  },
  blogPageCounter: {
    type: Number,
    default: 0,
    min: [0, 'Blog page counter cannot be negative']
  },
  resumePageCounter: {
    type: Number,
    default: 0,
    min: [0, 'Resume page counter cannot be negative']
  },
  contactPageCounter: {
    type: Number,
    default: 0,
    min: [0, 'Contact page counter cannot be negative']
  },
  // Additional analytics fields
  uniqueVisitors: {
    type: Number,
    default: 0,
    min: [0, 'Unique visitors cannot be negative']
  },
  lastVisitDate: {
    type: Date,
    default: Date.now
  },
  // Device and browser analytics
  deviceTypes: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 }
  },
  browsers: {
    chrome: { type: Number, default: 0 },
    firefox: { type: Number, default: 0 },
    safari: { type: Number, default: 0 },
    edge: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  // Geographic data (if you want to add later)
  countries: [{
    country: String,
    count: { type: Number, default: 0 }
  }]
}, {
  timestamps: true
});

// Static method to get or create visitor record
visitorSchema.statics.getVisitorRecord = async function() {
  let visitor = await this.findOne();
  
  if (!visitor) {
    visitor = await this.create({
      counter: 0,
      homePageCounter: 0,
      featurePageCounter: 0,
      blogPageCounter: 0,
      resumePageCounter: 0,
      contactPageCounter: 0,
      uniqueVisitors: 0
    });
  }
  
  return visitor;
};

// Method to update page-specific counter
visitorSchema.methods.updatePageCounter = function(page) {
  this.counter += 1;
  this.lastVisitDate = new Date();
  
  switch (page) {
    case '/':
      this.homePageCounter += 1;
      break;
    case '/features':
      this.featurePageCounter += 1;
      break;
    case '/blog':
      this.blogPageCounter += 1;
      break;
    case '/resume':
      this.resumePageCounter += 1;
      break;
    case '/contacts':
      this.contactPageCounter += 1;
      break;
  }
  
  return this.save();
};

module.exports = mongoose.model('Visitor', visitorSchema);
