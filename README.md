# cloud-function-onboard

There are a total of three app write functions:
- create-content
- create-logo
- create-website

# Function Descriptions
create-content and create-logo appwrite function code can be found in the create-logo-content folder (they use the same code but different ENV variables (URLs))

create-website appwrite function code can be found in create-website

# Payload examples

## create-content
```json
{"businessName": "Wild Goat Coffee"}
```

## create-logo
```json
{
	"businessName": "Wild Goat Coffee"
}
```

## create-website
```json
{
	"businessName": "Wild Goat Coffee",
	"description": "Wild Goat Coffee is a botique coffee shop that offers the highest quality beans to wake you up in the morning and keep your day going strong. We offer a very laid back atmosphere and we host poetry nights every Saturday. Come in, drink good coffee, and become crazy",
	"missionStatement": "At Wild Goat Coffee our mission is for your to become crazy hyped up on caffeiene. When you leave our coffee shop, you will be all jacked up on espresso shots.",
	"location": "Detroit, MI, USA",
	"services": "Coffee, Teas, Pastries",
	"images": ["https://storageapi.webenclave.com/hackathon/1692429874431.png", "https://storageapi.webenclave.com/hackathon/1692430527112.png", "https://storageapi.webenclave.com/hackathon/1692430574612.png", "https://storageapi.webenclave.com/hackathon/1692464910504.png", "https://storageapi.webenclave.com/hackathon/1692464973975.png", "https://storageapi.webenclave.com/hackathon/1692465242332.png"]
}
```

**ATTENTION: images array is optional. You can completely omit it.**
Example:
```json
{
	"businessName": "Wild Goat Coffee",
	"description": "Wild Goat Coffee is a botique coffee shop that offers the highest quality beans to wake you up in the morning and keep your day going strong. We offer a very laid back atmosphere and we host poetry nights every Saturday. Come in, drink good coffee, and become crazy",
	"missionStatement": "At Wild Goat Coffee our mission is for your to become crazy hyped up on caffeiene. When you leave our coffee shop, you will be all jacked up on espresso shots.",
	"location": "Detroit, MI, USA",
	"services": "Coffee, Teas, Pastries"
}
```

# Responses

All responses are URLs to a S3 storage and content-type is plaintext. 