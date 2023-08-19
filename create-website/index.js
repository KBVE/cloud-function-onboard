/*
payload:

{
    "businessName": "Web Enclave",
    "description": "Web Enclave is a forward-thinking consultancy specializing in comprehensive software solutions. With a proven track record, we've successfully developed a myriad of applications catering to diverse industries including aviation, chemical, and beyond.",
    "missionStatement": "At Web Enclave, our unwavering commitment lies in sculpting unparalleled software solutions that catalyze businesses and individuals in the digital domain. We pledge to conceive groundbreaking, user-centric, and dependable software that seamlessly transforms concepts into tangible realities.",
    "location": "Detroit, MI, USA",
    "services": "Elevating businesses through our expertise in Custom Software Development, Web Applications, Mobile Apps, and invaluable Software Consulting."
    "images": ["https://storageapi.webenclave.com/hackathon/1692429874431.png", "https://storageapi.webenclave.com/hackathon/1692430527112.png", "https://storageapi.webenclave.com/hackathon/1692430574612.png", "https://storageapi.webenclave.com/hackathon/1692464910504.png", "https://storageapi.webenclave.com/hackathon/1692464973975.png", "https://storageapi.webenclave.com/hackathon/1692465242332.png"]
}

ATTENTION: the images array is optional. You can completely omit it.
Example:
{
    "businessName": "Web Enclave",
    "description": "Web Enclave is a forward-thinking consultancy specializing in comprehensive software solutions. With a proven track record, we've successfully developed a myriad of applications catering to diverse industries including aviation, chemical, and beyond.",
    "missionStatement": "At Web Enclave, our unwavering commitment lies in sculpting unparalleled software solutions that catalyze businesses and individuals in the digital domain. We pledge to conceive groundbreaking, user-centric, and dependable software that seamlessly transforms concepts into tangible realities.",
    "location": "Detroit, MI, USA",
    "services": "Elevating businesses through our expertise in Custom Software Development, Web Applications, Mobile Apps, and invaluable Software Consulting."
}


*/


module.exports = async (req, res) => {
    const payload = JSON.parse(req.payload);
    if (
        typeof payload.businessName === "string" &&
        payload.businessName.trim() !== "" &&
        typeof payload.description === "string" &&
        payload.description.trim() !== "" &&
        typeof payload.missionStatement === "string" &&
        payload.missionStatement.trim() !== "" &&
        typeof payload.location === "string" &&
        payload.location.trim() !== "" &&
        typeof payload.services === "string" &&
        payload.services.trim() !== ""
    ) {
        const url = req.variables.url
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };

        const response = await fetch(url, options);
        const text = await response.text();
        res.send(text);
    } else {
        // Some properties are missing, have incorrect types, or are empty strings
        res.send("Bad Request", 400);
    }
};


