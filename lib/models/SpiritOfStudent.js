import mongoose from 'mongoose';

// Child Model (in spiritof collection)
const SpiritOfChildSchema = new mongoose.Schema(
  {
    // Reference to Parent
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'SpiritOfParent',
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
    school: {
      type: String,
    },

    // Points & Balance
    points: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },

    // Status
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    collection: 'spiritof_children',
  }
);

// Present Model (in spiritof collection)
const SpiritOfPresentSchema = new mongoose.Schema(
  {
    // Reference to Parent & Child
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'SpiritOfParent',
      index: true,
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SpiritOfChild',
      index: true,
    },

    // Present Info
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    cost: {
      type: Number,
      default: 0,
    },
    link: {
      type: String,
    },

    // Status
    purchased: {
      type: Boolean,
      default: false,
    },
    purchaseDate: {
      type: Date,
    },
    occasion: {
      type: String,
    },

    // Metadata
    isHidden: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'spiritof_presents',
  }
);

// Additional index for purchased presents
SpiritOfPresentSchema.index({ purchased: 1 });

// Parent Model
const SpiritOfParentSchema = new mongoose.Schema(
  {
    // Reference to VCorp User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Parent Demographics
    preferredName: {
      type: String,
      trim: true,
    },
    occupation: {
      type: String,
      trim: true,
    },
    
    // Children Array - Reference IDs only
    childrenIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SpiritOfChild',
      },
    ],

    // Budget Settings
    budgetSettings: {
      weeklyAllowance: {
        type: Number,
        default: 0,
      },
      savingsGoal: {
        type: Number,
        default: 0,
      },
      allowanceDay: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        default: 'Friday',
      },
      autoAllowance: {
        type: Boolean,
        default: false,
      },
    },

    // Hidden Presents - Reference IDs only
    hiddenPresentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SpiritOfPresent',
      },
    ],

    // Auto Charge Field
    autoCharge: {
      enabled: {
        type: Boolean,
        default: false,
      },
      amount: {
        type: Number,
        default: 0,
      },
      frequency: {
        type: String,
        enum: ['weekly', 'biweekly', 'monthly'],
        default: 'monthly',
      },
      nextChargeDate: {
        type: Date,
      },
      lastChargeDate: {
        type: Date,
      },
    },

    // Vote Log Array
    voteLog: [
      {
        childId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        voteType: {
          type: String,
          enum: ['positive', 'negative', 'neutral'],
          required: true,
        },
        category: {
          type: String,
        },
        description: {
          type: String,
        },
        pointsAwarded: {
          type: Number,
          default: 0,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        recordedBy: {
          type: String,
        },
      },
    ],

    // Balance Tracking
    balance: {
      current: {
        type: Number,
        default: 0,
      },
      pendingCharges: {
        type: Number,
        default: 0,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },

    // Membership & Attendance
    membershipStatus: {
      type: String,
      enum: ['trial', 'active', 'inactive', 'suspended', 'cancelled'],
      default: 'trial',
    },
    membershipTier: {
      type: String,
      enum: ['basic', 'premium', 'family'],
      required: true,
    },
    membershipStartDate: {
      type: Date,
      default: Date.now,
    },
    nextBillingDate: {
      type: Date,
    },
    
    // Attendance tracking
    classesAttended: {
      type: Number,
      default: 0,
    },
    lastAttendance: {
      type: Date,
    },
    attendanceHistory: [
      {
        date: Date,
        classType: String,
        instructor: String,
        notes: String,
      },
    ],

    // Progress tracking
    progressNotes: [
      {
        date: Date,
        instructor: String,
        notes: String,
      },
    ],

    // Equipment
    equipmentOwned: [
      {
        type: String,
      },
    ],

    // Waivers & Agreements
    liabilityWaiverSigned: {
      type: Boolean,
      default: false,
    },
    liabilityWaiverDate: {
      type: Date,
    },
    photographyConsent: {
      type: Boolean,
      default: false,
    },

    // Program-specific Notes
    instructorNotes: {
      type: String,
      default: '',
    },
    goals: {
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
    collection: 'spiritof_parents',
  }
);

// Additional index for membership queries
SpiritOfParentSchema.index({ membershipStatus: 1 });

// Method to add a child reference
SpiritOfParentSchema.methods.addChildRef = function (childId) {
  if (!this.childrenIds.includes(childId)) {
    this.childrenIds.push(childId);
    return this.save();
  }
  return this;
};

// Method to record a vote
SpiritOfParentSchema.methods.recordVote = function (childId, voteType, category, description, points = 0, recordedBy = 'parent') {
  this.voteLog.push({
    childId,
    voteType,
    category,
    description,
    pointsAwarded: points,
    date: new Date(),
    recordedBy,
  });
  return this.save();
};

// Method to add hidden present reference
SpiritOfParentSchema.methods.addPresentRef = function (presentId) {
  if (!this.hiddenPresentIds.includes(presentId)) {
    this.hiddenPresentIds.push(presentId);
    return this.save();
  }
  return this;
};

// Method to update balance
SpiritOfParentSchema.methods.updateBalance = function (amount, type = 'add') {
  if (type === 'add') {
    this.balance.current += amount;
  } else if (type === 'deduct') {
    this.balance.current -= amount;
  }
  this.balance.lastUpdated = new Date();
  return this.save();
};

// Method to get child votes
SpiritOfParentSchema.methods.getChildVotes = function (childId) {
  return this.voteLog.filter(vote => vote.childId.toString() === childId.toString());
};

// Export all models
const SpiritOfChild = mongoose.models.SpiritOfChild || 
  mongoose.model('SpiritOfChild', SpiritOfChildSchema);

const SpiritOfPresent = mongoose.models.SpiritOfPresent || 
  mongoose.model('SpiritOfPresent', SpiritOfPresentSchema);

const SpiritOfParent = mongoose.models.SpiritOfParent || 
  mongoose.model('SpiritOfParent', SpiritOfParentSchema);

export { SpiritOfChild, SpiritOfPresent };
export default SpiritOfParent;
