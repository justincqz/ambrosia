const RecipeMap = require("../schemas/recipe-map");
const Ingredient = require("../schemas/ingredient");
const Recipe = require("../schemas/recipe");

exports.getRecipe = function (req, res) {
    if (req.body.ingredients === null) {
        return res.json({ success: false, err: "No ingredients were supplied!" })
    }

    const ingredients = req.body.ingredients.map(i => i.toLowerCase());

    Ingredient.find(
        { ingredient: { $in: ingredients } },
        (err, ingredientList) => {
            if (err) {
                return res.json({ success: false, err: err });
            } else {
                recipes = findRecipes(res, ingredientList);
            }
        }
    )
}

function findRecipes(res, ingredients) {
    const recipeMap = {};
    ingredients.forEach(
        i => {
            i.mapList.replace(/[\[\]']+/g, '').split(",").forEach(index => recipeMap[index.trim()]
                ? recipeMap[index.trim()]++
                : recipeMap[index.trim()] = 0)
        }
    )

    const recipesArray = Object.keys(recipeMap)
        .map(i => {
            return { index: parseInt(i), count: recipeMap[i] }
        })
        .sort((a, b) => a.count < b.count);

    RecipeMap.find(
        {},
        (_, result) => {
            console.log(result);
        }
    )

    RecipeMap.find(
        { index: { $in: recipesArray.slice(0, 5).map(i => i.index) } },
        (err, recipeIndexList) => {
            // console.log(recipesArray.slice(0, 5).map(i => i.index));
            // console.log(recipeIndexList);
            if (err) {
                return res.json({ success: false, err: err });
            } else {
                Recipe.find(
                    { index: { $in: recipeIndexList.map(r => r.recipeIndex) } },
                    (err, recipes) => {
                        if (err) {
                            return res.json({ success: false, err: err });
                        } else {
                            return res.json({ success: true, recipes: recipes });
                        }
                    }
                )
            }
        }
    )

}
