/*
{
    "businessName": "string",
    "businessIdea": "string"
}

*/


const sdk = require("node-appwrite");

module.exports = async (req, res) => {
    const client = new sdk.Client();
    const database = new sdk.Databases(client);
    const users = new sdk.Users(client);
    if (
        !req.variables["APPWRITE_FUNCTION_ENDPOINT"] ||
        !req.variables["APPWRITE_FUNCTION_API_KEY"] ||
        !req.variables["APPWRITE_FUNCTION_PROJECT_ID"]
    ) {
        console.warn("Environment variables are not set. Function cannot use Appwrite SDK.");
    } else {
        client
            .setEndpoint(req.variables["APPWRITE_FUNCTION_ENDPOINT"])
            .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
            .setKey(req.variables["APPWRITE_FUNCTION_API_KEY"])
            .setSelfSigned(true);
    }

    const request = JSON.parse(req.payload);
    const { businessName, businessIdea } = request;
    if (!businessName || !businessIdea) {
        res.send("Bad Request", 400);
        return;
    }
    // Get information about the user who triggered the function
    const userId = req.variables["APPWRITE_FUNCTION_USER_ID"];

    const user = await users.get(userId);

    // Create a new profile document in the "profiles" collection
    const profile = await database.createDocument(
        "rentearth-dev",
        "Business",
        "unique()",
        {
            business_name: businessName,
            business_idea: businessIdea,
            created_at: Date.now(),
            created_by: user.email
        },
        ["*"]
    );

    return res.json(profile);

};