const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema(
    {
        Name: { type: String, required: true },
        Photo: { type: [String], default: [] },
        Ingredients: { type: [String], default: [] },
        Steps: { type: [String], default: [] },
        Author: { type: String, default: "" },
        Index: { type: Number, required: true }
    }
)

module.exports = mongoose.model("Recipe")
