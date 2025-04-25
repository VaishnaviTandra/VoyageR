const mongoose=require('mongoose')
const addressSchema=new mongoose.Schema({
    state:{
        type:String,
        required:true
    },city:{
        type:String,
        required:true
    },landmark:{
        type:String,
        required:true
    },pincode:{
        type:Number,
        required:true
    }
},{"strict":"throw"})
const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" }
}, { strict: "throw" });
const hotelSchema=new mongoose.Schema({
    nameOfHotel:{
        type:String,
        required:true
    },destination:{
         type: mongoose.Schema.Types.ObjectId, ref: "Destination" 
    },address:addressSchema,
    costperDay:{
        type:Number,
        required:true
    },availableRooms:{
        type:Number,
        required:true
    },images:{
        type:[String],
        required:true
    },luxuries:{
        type:[String]
    },rating:{
        type:Number,
        min:0,
        max:5
    },bookings: [bookingSchema] 
},{"strict":"throw"})
const HotelSchema=mongoose.model('Hotel',hotelSchema)
module.exports=HotelSchema