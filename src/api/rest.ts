type restGetParams = {
	url: string
	tags?: string[]
	cache?: RequestCache
	cookies?: { name: string; value: string }[]
}

export async function restGet({ url, tags = [], cache = 'force-cache', cookies }: restGetParams) {
	const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/${url}`
	const headers = cookies ? createCookieHeader(cookies) : {}
	const response = await fetch(fullUrl.toString(), {
		method: 'GET',
		credentials: 'include',
		cache: cache,
		headers: headers,
		next: {
			tags: ['all', ...tags],
		},
	}).catch((error) => console.error(error.message))

	if (response) {
		if (!response.ok) {
			//console.error(`HTTP error! status: ${response.status}`)
			return null
		}
		const data = await response.json().catch((error) => {
			console.error('Error parsing JSON:', error)
		})
		return data
	}
	// const data = await response.json();
}

type restPostParams = {
	url: string
	data: Object
}

export async function restPost({ url, data }: restPostParams) {
	const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/${url}`

	const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/token`, {
		method: 'GET',
		credentials: 'include',
	})

	const token = await tokenResponse.text()

	const options = <RequestInit>{
		method: 'POST',
		credentials: 'include',
		withCredentials: true,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-CSRF-Token': token,
		},
		body: JSON.stringify(data),
		cache: 'no-cache',
	}

	const response = await fetch(fullUrl.toString(), options)

	try {
		const status = response.status
		if (response) {
			const json = await response.json()
			return { status, json }
		}
	} catch (e) {
		console.log('Problem with JSON', e)
	}
	return response
}

/**
 *
 * @param url Rest Patch
 * @param data
 * @returns
 */
export async function restPatch(url: string, data: Object) {
	const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/${url}`

	const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/token`, {
		method: 'GET',
		credentials: 'include',
	})

	const token = await tokenResponse.text()

	const options = <RequestInit>{
		method: 'PATCH',
		credentials: 'include',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-CSRF-Token': token,
		},
		body: JSON.stringify(data),
	}

	const response = await fetch(fullUrl.toString(), options)

	try {
		const status = response.status
		const json = await response.json()
		return { status, json }
	} catch (e) {
		console.log('Problem with JSON', e)
	}
	return response
}

type restDeleteParams = {
	url: string
	data: Object
}

/**
 * Rest Delete
 * @param url
 * @param data
 * @returns
 */
export async function restDelete({ url, data = [] }: restDeleteParams) {
	const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/${url}`

	const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/token`, {
		method: 'GET',
		credentials: 'include',
	})

	const token = await tokenResponse.text()

	const options = <RequestInit>{
		method: 'DELETE',
		credentials: 'include',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-CSRF-Token': token,
		},
		body: JSON.stringify(data),
	}

	const response = await fetch(fullUrl.toString(), options)

	try {
		const status = response.status
		const json = await response.json()
		return { status, json }
	} catch (e) {
		console.log('Problem with JSON', e)
	}
	return response
}

export function createCookieHeader(cookies: { name: string; value: string }[]) {
	const cookieHeader = cookies.map((cookie: any) => `${cookie.name}=${cookie.value}`).join('; ')
	return {
		Cookie: cookieHeader,
	}
}

