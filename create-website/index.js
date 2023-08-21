/*
payload:

{
    "businessName": "Web Enclave",
    "description": "Web Enclave is a forward-thinking consultancy specializing in comprehensive software solutions. With a proven track record, we've successfully developed a myriad of applications catering to diverse industries including aviation, chemical, and beyond.",
    "missionStatement": "At Web Enclave, our unwavering commitment lies in sculpting unparalleled software solutions that catalyze businesses and individuals in the digital domain. We pledge to conceive groundbreaking, user-centric, and dependable software that seamlessly transforms concepts into tangible realities.",
    "location": "Detroit, MI, USA",
    "services": "Elevating businesses through our expertise in Custom Software Development, Web Applications, Mobile Apps, and invaluable Software Consulting."
    "images": ["https://storageapi.webenclave.com/hackathon/1692429874431.png", "https://storageapi.webenclave.com/hackathon/1692430527112.png", "https://storageapi.webenclave.com/hackathon/1692430574612.png", "https://storageapi.webenclave.com/hackathon/1692464910504.png", "https://storageapi.webenclave.com/hackathon/1692464973975.png", "https://storageapi.webenclave.com/hackathon/1692465242332.png"]
    "businessId": "5f9b3b5b5f9b3b5b5f9b3b5b"
}

ATTENTION: the images array is optional. You can completely omit it.
Example:
{
    "businessName": "Web Enclave",
    "description": "Web Enclave is a forward-thinking consultancy specializing in comprehensive software solutions. With a proven track record, we've successfully developed a myriad of applications catering to diverse industries including aviation, chemical, and beyond.",
    "missionStatement": "At Web Enclave, our unwavering commitment lies in sculpting unparalleled software solutions that catalyze businesses and individuals in the digital domain. We pledge to conceive groundbreaking, user-centric, and dependable software that seamlessly transforms concepts into tangible realities.",
    "location": "Detroit, MI, USA",
    "services": "Elevating businesses through our expertise in Custom Software Development, Web Applications, Mobile Apps, and invaluable Software Consulting."
    "businessId": "5f9b3b5b5f9b3b5b5f9b3b5b"
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
        "64e1a579795c4e20bd70",
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
};


