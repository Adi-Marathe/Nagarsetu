const mongoose = require('mongoose');

const timelineEntrySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 2000
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Road Damage', 'Pothole', 'Bridge Issue',
      'Garbage', 'Drainage', 'Sewage',
      'Water Leakage', 'Pipeline Burst', 'Water Supply',
      'Street Light', 'Power Outage', 'Electricity Fault',
      'Hospital', 'Medical Emergency', 'Sanitation',
      'Traffic', 'Parking', 'Public Transport',
      'Other'
    ]
  },
  status: {
    type: String,
    enum: ['submitted', 'verified', 'assigned', 'in_progress', 'resolved', 'closed'],
    default: 'submitted'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  location: {
    address: { type: String, default: '' },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  images: [{
    type: String
  }],
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null
  },
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  timeline: [timelineEntrySchema],
  feedback: {
    rating: { type: Number, min: 1, max: 5, default: null },
    comment: { type: String, default: '' }
  },
  resolvedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Add initial timeline entry on create
complaintSchema.pre('save', function() {
  if (this.isNew) {
    this.timeline.push({
      status: 'submitted',
      message: 'Complaint submitted by citizen',
      updatedBy: this.citizen,
      timestamp: new Date()
    });
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
