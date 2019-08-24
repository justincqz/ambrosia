const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema(
    {
        name: { type: String, required: true },
        photo: { type: [String], default: [] },
        ingredients: { type: [String], default: [] },
        steps: { type: [String], default: [] },
        author: { type: String, default: "" },
        index: { type: Number, required: true }
    }
)

module.exports = mongoose.model("recipes", RecipeSchema)
