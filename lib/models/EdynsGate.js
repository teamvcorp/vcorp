import mongoose from 'mongoose';

// EdynsGate Student Model
const EdynsGateStudentSchema = new mongoose.Schema(
  {
    // Reference to Parent/Guardian
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'EdynsGateParent',
      index: true,
    },
    parentEmail: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    // Basic Info
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    grade: {
      type: String,
    },

    // Learning Profile
    learningLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    subjects: [
      {
        type: String, // e.g., 'math', 'science', 'reading', 'writing'
      },
    ],
    learningGoals: {
      type: String,
      default: '',
    },

    // Progress Tracking
    coursesEnrolled: [
      {
        courseId: String,
        courseName: String,
        enrolledAt: Date,
        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    totalLearningHours: {
      type: Number,
      default: 0,
    },
    achievements: [
      {
        title: String,
        description: String,
        earnedAt: Date,
      },
    ],

    // Status
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    collection: 'edynsgate_students',
  }
);

// EdynsGate Parent/Guardian Model
const EdynsGateParentSchema = new mongoose.Schema(
  {
    // Reference to VCorp User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Students - Reference IDs only
    studentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EdynsGateStudent',
      },
    ],

    // Subscription & Billing
    subscriptionTier: {
      type: String,
      enum: ['basic', 'premium', 'family'],
      required: true,
    },
    subscriptionStatus: {
      type: String,
      enum: ['trial', 'active', 'inactive', 'suspended', 'cancelled'],
      default: 'active',
    },
    subscriptionStartDate: {
      type: Date,
      default: Date.now,
    },
    nextBillingDate: {
      type: Date,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },

    // Auto-charge settings
    autoCharge: {
      enabled: {
        type: Boolean,
        default: true,
      },
      amount: {
        type: Number,
        default: 0,
      },
      frequency: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly',
      },
      nextChargeDate: {
        type: Date,
      },
      lastChargeDate: {
        type: Date,
      },
    },

    // Preferences
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      weeklyReports: {
        type: Boolean,
        default: true,
      },
      learningReminders: {
        type: Boolean,
        default: true,
      },
    },

    // Notes
    parentNotes: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },

    // Status
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    collection: 'edynsgate_parents',
  }
);

// Method to add a student reference
EdynsGateParentSchema.methods.addStudentRef = function (studentId) {
  if (!this.studentIds.includes(studentId)) {
    this.studentIds.push(studentId);
    return this.save();
  }
  return this;
};

// Export models
const EdynsGateStudent = mongoose.models.EdynsGateStudent || 
  mongoose.model('EdynsGateStudent', EdynsGateStudentSchema);

const EdynsGateParent = mongoose.models.EdynsGateParent || 
  mongoose.model('EdynsGateParent', EdynsGateParentSchema);

export { EdynsGateStudent };
export default EdynsGateParent;
