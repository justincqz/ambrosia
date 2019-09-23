const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const {
    dialogflow,
    SimpleResponse,
    BasicCard,
    Button,
    Image,
    BrowseCarousel,
    BrowseCarouselItem,
    Suggestions,
    LinkOutSuggestion,
    MediaObject,
    Table,
    List,
    Carousel,
    SignIn
} = require('actions-on-google');

const app = dialogflow({ clientId: "854860528263-5or1ek1ve8ufh1thuf62vrahaf2ptvft.apps.googleusercontent.com" });

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

app.intent('Default Welcome Intent', (conv) => {
    conv.ask("How can I help you today?");
    // conv.followup("ServiceChoice");
    conv.followup("LogIn");
});

app.intent("Log In", (conv) => {
    conv.ask(new SignIn());
})

app.intent("Sign In", (conv, input, signin) => {
    if (signin.status === 'OK') {
        conv.followup("ServiceChoice");
    } else {
        conv.ask("Unable to login!");
        conv.close();
    }
})

app.intent('Service Choice', (conv) => {
    conv.ask("Would you like me to suggest random recipes" +
        " or recipes based on your current ingredients?");
    conv.ask(new List({
        title: 'How can I help you today?',
        items: {
            "Random Recipes": "Suggest random recipes",
            "Find Recipes": "Suggest recipes based on your ingredients"
        }
    }));
});


app.intent('Service Choice - OPTION', (conv, params, option) => {
    console.log(option);
    conv.ask("You have selected " + option);
    if (option === "Random Recipes") {
        conv.ask("Finding some random recipes for you!");
        conv.followup("RandomRecipes");
    } else {
        conv.ask("Checking your fridge!");
        conv.followup("GetAccount");
    }
});

app.intent('Random Recipes', async (conv) => {
    try {
        const res = await axios.get('http://52.56.77.196/ambrosia/randomrecipe');

        conv.ask("Here are some recipes for you to try! Which are you interested in?");

        conv.ask(res.data.recipes.map(r => r.name).join(', '));

        var items = {};

        res.data.recipes.forEach(recipe => {
            items[recipe.name] = {
                title: recipe.name
            }
        });

        conv.ask(new List({
            title: 'Today\'s Recipes',
            items: items,
        }));
    } catch (e) {
        console.log(e);
    }
});

app.intent('Find Recipes', async (conv) => {
    try {
        const res = await axios.get('http://52.56.77.196/ambrosia/randomrecipe');

        conv.ask("Here are some recipes for you to try! Which are you interested in?");

        conv.ask(res.data.recipes.map(r => r.name).join(', '));

        var items = {};

        res.data.recipes.forEach(recipe => {
            items[recipe.name] = {
                title: recipe.name
            }
        });

        conv.ask(new List({
            title: 'Today\'s Recipes',
            items: items,
        }));
    } catch (e) {
        console.log(e);
    }
});


app.intent('Random Recipes - OPTION', (conv, params, option) => {
    conv.ask("You have selected " + option + ".");
    conv.ask("I have sent the recipe to your phone.")
    conv.close();
    // TODO: Function to send it to application port, maybe redis pub/sub?
})

exports.webhookResponse = functions.https.onRequest(app);
