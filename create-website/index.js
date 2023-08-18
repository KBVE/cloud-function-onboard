/*
payload:

{
    "businessName": "Web Enclave",
    "description": "Web Enclave is a forward-thinking consultancy specializing in comprehensive software solutions. With a proven track record, we've successfully developed a myriad of applications catering to diverse industries including aviation, chemical, and beyond.",
    "missionStatement": "At Web Enclave, our unwavering commitment lies in sculpting unparalleled software solutions that catalyze businesses and individuals in the digital domain. We pledge to conceive groundbreaking, user-centric, and dependable software that seamlessly transforms concepts into tangible realities.",
    "location": "Detroit, MI, USA",
    "services": "Elevating businesses through our expertise in Custom Software Development, Web Applications, Mobile Apps, and invaluable Software Consulting."
}

*/


module.exports = async (req, res) => {

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: req.payload
    };

    const response = await fetch('https://functions.webenclave.com/webhook/decc7b20-e158-4cb9-a3a2-f5b28c594862', options);
    const text = await response.text();
    res.send(text);
};


