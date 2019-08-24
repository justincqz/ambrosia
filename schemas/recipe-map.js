const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeMapSchema = new Schema(
    {
        index: { type: Number, required: true },
        recipeIndex: { type: Number, required: true },
        ingredientList: { type: String, default: "" }
    }
)

module.exports = mongoose.model("maptable", RecipeMapSchema)
