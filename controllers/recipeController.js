const RecipeMap = require("../schemas/recipe-map");
const Ingredient = require("../schemas/ingredient");
const Recipe = require("../schemas/recipe");

exports.getRecipe = function (req, res) {
    if (req.body.ingredients === null) {
        return res.json({ success: false, err: "No ingredients were supplied!" })
    }

    const ingredients = req.body.ingredients.map(i => new RegExp(i, 'gi'));

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

exports.getRecipeByName = function (req, res) {
    if (req.params.name === null) {
        return res.json({ success: false, err: "No recipe name was supplied!" });
    }

    Recipe.findOne(
        { name: { $eq: req.params.name } },
        (err, recipe) => {
            if (err) {
                return res.json({ success: false, err: err });
            } else {
                return res.json({ success: true, recipe: recipe });
            }
        }
    )
}

exports.getRandomRecipes = function (req, res) {
    Recipe.count(
        {},
        (err, total) => {
            if (err) {
                return res.json({ success: false, err: err });
            } else {
                let randomIndices = [];
                while (randomIndices.length != 5) {
                    let randomNumber = Math.random(0, total);
                    if (!randomIndices.includes(randomNumber)) {
                        randomIndices.push(randomNumber);
                    }
                }

                Recipe.find(
                    { index: { $in: randomIndices } },
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

function findRecipes(res, ingredients) {
    const recipeMap = {};
    ingredients.forEach(
        i => {
            JSON.parse(i.mapList).forEach(index =>
                recipeMap[index]
                    ? recipeMap[index]++
                    : recipeMap[index] = 1);
        }
    )

    const recipesArray = Object.keys(recipeMap)
        .map(index => {
            return { index: parseInt(index), count: recipeMap[index] }
        })
        .sort((a, b) =>
            a.count < b.count ? 1 : a.count === b.count ? 0 : -1
        );
    console.log(recipesArray);


    RecipeMap.find(
        { index: { $in: recipesArray.slice(0, 5).map(i => i.index) } },
        (err, recipeIndexList) => {
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
