/*
{
    "username": "string",
    "legalName": "string"
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
    const { username, legalName } = request;
    if (!username || !legalName) {
        res.json({ error: "Bad Request" }, 400);
        return;
    }


    // Get information about the user who triggered the function
    const userId = req.variables["APPWRITE_FUNCTION_USER_ID"];

    const user = await users.get(userId);

    const { documents } = await database.listDocuments("user", "profile", [sdk.Query.equal("user_id", userId)]);

    if (documents.length > 0) {
        res.json({ error: "Already have a profile!" }, 400);
        return;
    }

    const { _documents } = await database.listDocuments("user", "profile", [sdk.Query.equal("username", username)]);
    if (documents.length > 0) {
        res.json({ error: "Username is taken" }, 400);
        return;
    }


    // Create a new profile document in the "profiles" collection
    const profile = await database.createDocument(
        "user",
        "profile",
        "unique()",
        {
            user_id: user.$id,
            email: user.email,
            username: username,
            legal_name: legalName,
            created_at: (new Date(Date.now())).toISOString(),
        },
        [
            sdk.Permission.read(sdk.Role.user(user.$id))
        ]
    );

    return res.json(profile);

};