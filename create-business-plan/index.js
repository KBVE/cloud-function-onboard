/*
{
    "businessName": "string",
    "businessIdea": "string",
    "businessId": "string"
}

*/


const sdk = require("node-appwrite");
const axios = require('axios');

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
    const { businessName, businessIdea, businessId } = request;
    if (!businessName || !businessIdea || !businessId) {
        res.json({ error: "Bad Request" }, 400);
        return;
    }

    const url = req.variables.url
    const options = {
        headers: { 'Content-Type': 'application/json' },
        timeout: 1800000 // 30 minutes
    };

    const response = await axios.post(url, request, options);
    const text = response.data;


    // Get information about the user who triggered the function
    const userId = req.variables["APPWRITE_FUNCTION_USER_ID"];

    const user = await users.get(userId);

    // Create a new profile document in the "profiles" collection
    const business = await database.createDocument(
        "rentearth-dev",
        "64e1a55884d7ba5cc090",
        "unique()",
        {
            url: text,
            business_id: businessId,
            created_at: (new Date(Date.now())).toISOString(),
            created_by: user.email
        },
        [
            sdk.Permission.read(sdk.Role.user(user.$id))
        ]
    );

    return res.json(business);

};