/*

ATTENTION: This is the code for create-logo and create-content appwrite functions!!!

payload:

{
    "businessName": "Web Enclave",
    "businessId": "5f9b3b5b5f9b3b5b5f9b3b5b",
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
    const payload = JSON.parse(req.payload);
    if (
        typeof payload.businessName === "string" &&
        payload.businessName.trim() !== "" && typeof payload.businessId === "string" &&
        payload.businessId.trim() !== ""
    ) {
        const url = req.variables.url
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            timeout: 120000
        };

        const response = await fetch(url, options);
        const text = await response.text();

        // Get information about the user who triggered the function
        const userId = req.variables["APPWRITE_FUNCTION_USER_ID"];

        const user = await users.get(userId);

        // Create a new profile document in the "profiles" collection
        const logo = await database.createDocument(
            "rentearth-dev",
            "64e1a567263cbe6890ba",
            "unique()",
            {
                url: text,
                created_at: (new Date(Date.now())).toISOString(),
                created_by: user.email,
                business_id: payload.businessId
            },
            [
                sdk.Permission.read(sdk.Role.user(user.$id))
            ]
        );

        return res.json(logo);
    } else {
        // Some properties are missing, have incorrect types, or are empty strings
        return res.json({ error: "Bad Request" }, 400);
    }
};

