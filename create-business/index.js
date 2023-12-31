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
        res.json({ error: "Bad Request" }, 400);
        return;
    }
    // Get information about the user who triggered the function
    const userId = req.variables["APPWRITE_FUNCTION_USER_ID"];

    const user = await users.get(userId);

    // Create a new profile document in the "profiles" collection
    const business = await database.createDocument(
        "rentearth-dev",
        "64e1a512f107c97773d2",
        "unique()",
        {
            business_name: businessName,
            business_idea: businessIdea,
            created_at: (new Date(Date.now())).toISOString(),
            created_by: user.email
        },
        [
            sdk.Permission.read(sdk.Role.user(user.$id))
        ]
    );

    return res.json(business);

};