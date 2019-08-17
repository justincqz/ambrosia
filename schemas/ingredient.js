const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IngredientSchema = new Schema(
    {
        IngredientIndex: { type: Number, required: true },
        MapIndices: { type: [Number], required: [] },
        Count: { type: Number }
    }
)

module.exports = mongoose.model("Ingredient")
