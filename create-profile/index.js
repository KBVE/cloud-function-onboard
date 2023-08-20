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
    if (!request.username || !request.legalName) {
        res.send("Bad Request", 400);
        return;
    }

    try {
        // Get information about the user who triggered the function
        const payload = JSON.parse(req.variables["APPWRITE_FUNCTION_EVENT_DATA"]);

        // Get the user from appwrite
        const user = await users.get(payload.userId);

        // Create a new profile document in the "profiles" collection
        const profile = await database.createDocument(
            "user",
            "profile",
            "unique()",
            {
                user_id: user.$id,
                email: user.email,
                username: request.name,
                legal_name: request.legalName,
                created_at: Date.now(),
            },
            ["*"]
        );

        return res.json(profile);
    } catch (error) {
        console.error(error);
        return res.json(
            {
                message: "Unexpected error",
                error: error,
            },
            500
        );
    }
};