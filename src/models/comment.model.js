import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const commentSchema = new Schema({

    content: {
        type: String,
        required: true
    },

    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },


    owner: {
        type: Schema.Types.ObjectId,
        ref : "User"
    }
},
{
    timestamps: true
}
)

// before export we are plugin the mongooseAggregatePaginate
//it gives the ability to control paginate ki kha s ekha tk video dene h
commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment",commentSchema);

