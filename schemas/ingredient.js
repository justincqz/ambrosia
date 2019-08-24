const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IngredientSchema = new Schema(
    {
        index: { type: Number, required: true },
        mapList: { type: String, required: [] },
        ingredient: { type: String, required: true }
    }
)

module.exports = mongoose.model("ingredients", IngredientSchema)
