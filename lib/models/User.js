import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    // Basic Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },

    // Address
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
        maxlength: 2,
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
        trim: true,
        match: [/^\d{5}$/, 'Please enter a valid 5-digit zip code'],
      },
    },

    // Authentication
    emailVerified: {
      type: Date,
      default: null,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpiry: {
      type: Date,
      default: null,
    },
    pinCode: {
      type: String,
      default: null,
    },
    pinCodeExpiry: {
      type: Date,
      default: null,
    },

    // Stripe Integration
    stripeCustomerId: {
      type: String,
      default: null,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    stripePaymentMethodId: {
      type: String,
      default: null,
    },
    paymentMethodLast4: {
      type: String,
      default: null,
    },
    paymentMethodBrand: {
      type: String,
      default: null,
    },

    // Programs - Array of enrolled programs
    programs: [
      {
        programId: {
          type: String,
          required: true,
          enum: ['spiritof', 'fyht4', 'taekwondo', 'edynsgate', 'homeschool'],
        },
        tier: {
          type: String,
          default: null,
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['pending', 'active', 'inactive', 'suspended'],
          default: 'active',
        },
        // Program-specific data stored as flexible object
        programData: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
      },
    ],

    // Account Status
    accountStatus: {
      type: String,
      enum: ['pending', 'active', 'inactive', 'suspended'],
      default: 'pending',
    },

    // Identity Verification (Stripe Identity)
    identityVerified: {
      type: Boolean,
      default: false,
    },
    identityVerificationSessionId: {
      type: String,
      default: null,
    },

    // Metadata
    lastLogin: {
      type: Date,
      default: null,
    },
    profileCompleteness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Additional index for program queries
UserSchema.index({ 'programs.programId': 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Method to check if user is enrolled in a program
UserSchema.methods.isEnrolledIn = function (programId) {
  return this.programs.some(
    (program) => program.programId === programId && program.status === 'active'
  );
};

// Method to calculate profile completeness
UserSchema.methods.calculateProfileCompleteness = function () {
  let score = 0;
  const fields = [
    this.firstName,
    this.lastName,
    this.email,
    this.phone,
    this.dateOfBirth,
    this.address?.street,
    this.address?.city,
    this.address?.state,
    this.address?.zipCode,
    this.emailVerified,
    this.identityVerified,
  ];

  fields.forEach((field) => {
    if (field) score += 100 / fields.length;
  });

  this.profileCompleteness = Math.round(score);
  return this.profileCompleteness;
};

// Prevent model recompilation in development
export default mongoose.models.User || mongoose.model('User', UserSchema);
