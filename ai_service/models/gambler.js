import mongoose from 'mongoose'

const { Schema } = mongoose

const gamblerSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        balance: {
            type: Number,
            required: true,
        }
    },
    {timestamps: true}
)

const Gambler = mongoose.models.Gambler || mongoose.model("Gambler", gamblerSchema)
export default Gambler