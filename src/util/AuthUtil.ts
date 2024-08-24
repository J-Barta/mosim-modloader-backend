export function generateSafeRandomToken(disallowedStrings: String[]) {

    let val = generateRandomToken();

    while (disallowedStrings.includes(val)) {
        val = generateRandomToken();
    }
    return val;
}

export function generateRandomToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function stringToHash(string) {

    let hash = 0;

    if (string.length == 0) return hash.toString();

    for (let i = 0; i < string.length; i++) {
        let char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return hash.toString();
}