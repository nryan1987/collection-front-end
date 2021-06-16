export default async function getLast100Issues({jwt}) {
	console.log("getLast100Issues. token: " + jwt);

	const response = await fetch("http://localhost:8080/comic/latest100", {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + jwt
		},
	});
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	return responseJson;
}

export async function getOneIssue(id, {jwt}) {
	console.log("getOneIssue");

	const response = await fetch("http://localhost:8080/comic/"+id, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + jwt
		},
	});
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	return responseJson;
}