/*
payload:

{
    "Action" : Stringify
    "Username" : String
      https://n8n.kbve.com/webhook/ // /cache/:action/:username

}



*/
const sdk = require("node-appwrite");
const axios = require("axios").default;


module.exports = async (req, res) => {
    const client = new sdk.Client();
    const database = new sdk.Databases(client);
    const users = new sdk.Users(client);
    if (
        !req.variables["APPWRITE_FUNCTION_ENDPOINT"] ||
        !req.variables["APPWRITE_FUNCTION_API_KEY"] ||
        !req.variables["APPWRITE_FUNCTION_PROJECT_ID"] ||
        !req.variables["OPENAI_KEY"]
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
    const oepn_data = await database.createDocument(
        "rentearth-dev",
        "openai_data",
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

    return res.json(oepn_data);
};


