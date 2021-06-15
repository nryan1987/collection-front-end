export default async function getLast100Issues() {
	console.log("getLast100Issues");

	const response = await fetch("http://localhost:8080/comic/latest100", {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyeWFuIiwiZXhwIjoxNjIyMjcwODM4LCJpYXQiOjE2MjIyMzQ4Mzh9.PQEkTVZZG7TOZSalZ7LPjTv-DYGggiBgNO5AoYJ9Ek8"
		},
	});
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	return responseJson;
}

export async function getOneIssue(id) {
	console.log("getOneIssue");

	const response = await fetch("http://localhost:8080/comic/"+id, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyeWFuIiwiZXhwIjoxNjIyMjcwODM4LCJpYXQiOjE2MjIyMzQ4Mzh9.PQEkTVZZG7TOZSalZ7LPjTv-DYGggiBgNO5AoYJ9Ek8"
		},
	});
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	return responseJson;
}