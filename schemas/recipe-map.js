const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeMapSchema = new Schema(
    {
        MapIndex: { type: Number, required: true },
        RecipeIndex: { type: Number, required: true },
        IngredientIndex: { type: [Number], default: [] }
    }
)

module.exports = mongoose.model("RecipeMap")
