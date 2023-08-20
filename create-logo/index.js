/*

ATTENTION: This is the code for create-logo and create-content appwrite functions!!!

payload:

{
    "businessName": "Web Enclave"
}

*/
const sdk = require("node-appwrite");

module.exports = async (req, res) => {
    const client = new sdk.Client();
    const database = new sdk.Databases(client);
    const users = new sdk.Users(client);
    const payload = JSON.parse(req.payload);
    if (
        typeof payload.businessName === "string" &&
        payload.businessName.trim() !== ""
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
            "Logo",
            "unique()",
            {
                url: url,
                created_at: (new Date(Date.now())).toISOString(),
                created_by: user.email
            }
        );

        return res.json(logo);
    } else {
        // Some properties are missing, have incorrect types, or are empty strings
        return res.json({ error: "Bad Request" }, 400);
    }
};

