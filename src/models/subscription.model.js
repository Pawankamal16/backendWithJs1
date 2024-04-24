import mongoose, {Schema} from "mongoose"

const subsriptionSchema = new Schema({
    //id comes automatically
    subscriber: {
        type:Schema.Types.ObjectId, //one who is subscribing
        ref:"User"
    },
    channel:{
        type: Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing
        ref: "User"
    }
},{timestamps: trusted})

export const Subscription = mongoose.model("Subscription",subsriptionSchema)



//jb bhi kisi channelko subscribe krenge ek nya document bnega
// channel count krenege for subscriber- jitne document honge us channel ke utn ehi subscriber honge
// user c ne kitno ko subscribed kr rkha h, count subscription whoose user is c,usme se channel nikalenege