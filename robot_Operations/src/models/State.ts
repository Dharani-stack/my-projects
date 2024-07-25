import mongoose, { CallbackError, Document, Model, Schema } from "mongoose";

// State interface extending Mongoose Document
interface IState extends Document {
  name: string;
  description: string;
  status: "idle" | "active" | "onHold" | "resume" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

//static methods for the State model
interface IStateModel extends Model<IState> {
  countStatuses(): Promise<Array<{ status: string; count: number }>>;
  calculateRequestFrequency(
    interval: "hourly" | "daily" | "monthly"
  ): Promise<Array<{ interval: string; requestCount: number }>>;
  getTopPeakHours(
    n: number
  ): Promise<Array<{ hour: number; requestCount: number; time: string }>>;
}

// schema for the State model
const stateSchema = new Schema<IState>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["idle", "active", "onHold", "resume", "completed", "cancelled"],
    required: true,
    default: "idle",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
},{ timestamps: true });

// Middleware to update the updatedAt field before saving
stateSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});



// Static method to count states by status
stateSchema.statics.countStatuses = async function () {
  const results = await this.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
      },
    },
    { $sort: { status: 1 } },
  ]);
  return results;
};

// Static method to calculate request frequency based on interval

stateSchema.statics.calculateRequestFrequency = async function (
  interval: "hourly" | "daily" | "monthly"
) {
  const intervalFormat = {
    hourly: "%Y-%m-%d %H",
    daily: "%Y-%m-%d",
    monthly: "%Y-%m",
  };
  const format = intervalFormat[interval] || intervalFormat.daily;
  const results = await this.aggregate([
    {
        $group: {
          _id: {
            $dateToString: { format, date: "$createdAt" }
          },
          creationCount: { $sum: 1 },
          updateCount: {
            $sum: {
              $cond: [
                { $ne: ["$createdAt", "$updatedAt"] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          interval: "$_id",
          creationCount: 1,
          updateCount: 1,
          totalCount: { $sum: ["$creationCount", "$updateCount"] }
        }
      },
      {
        $sort: { interval: 1 }
      }
    ]);
  
    return results;
  };


// Static method to get top peak hours based on request count
stateSchema.statics.getTopPeakHours = async function (n) {
  const peakHours = await this.aggregate([
    {
      $facet: {
        created: [
          {
            $group: {
              _id: {
                date: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                hour: { $hour: "$createdAt" },
              },
              requestCount: { $sum: 1 },
            },
          },
        ],
        updated: [
          {
            $group: {
              _id: {
                date: {
                  $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
                },
                hour: { $hour: "$updatedAt" },
              },
              requestCount: { $sum: 1 },
            },
          },
        ],
      },
    },
    {
      $project: {
        combined: {
          $concatArrays: ["$created", "$updated"],
        },
      },
    },
    { $unwind: "$combined" },
    {
      $group: {
        _id: {
          date: "$combined._id.date",
          hour: "$combined._id.hour",
        },
        requestCount: { $sum: "$combined.requestCount" },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        hour: "$_id.hour",
        requestCount: 1,
      },
    },
    { $sort: { requestCount: -1 } },
    { $limit: n },
  ]);

  return peakHours.map((item) => ({
    ...item,
    time: `${item.hour.toString().padStart(2, "0")}:00 - ${(item.hour + 1)
      .toString()
      .padStart(2, "0")}:00`,
  }));
};

// Create and export the State model
const State = mongoose.model<IState, IStateModel>("State", stateSchema);

stateSchema.post('save', async function (doc) {
    if (doc) {
      await State.calculateRequestFrequency('daily'); // or 'daily', 'monthly'
    }
  });

export default State;
