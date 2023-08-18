/*
payload:

{
    "businessName": "Web Enclave"
}

*/


module.exports = async (req, res) => {

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: req.payload
    };

    const response = await fetch('https://functions.webenclave.com/webhook/436f08c7-bfcd-41b9-935d-d308b11c5218', options);
    const text = await response.text();
    res.send(text);
};

