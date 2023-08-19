/*
payload:

{
    "businessName": "Web Enclave"
}

*/


module.exports = async (req, res) => {
    const payload = JSON.parse(req.payload);
    if (
        typeof payload.businessName === "string" &&
        payload.businessName.trim() !== ""
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
