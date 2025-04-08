// Fonction pour générer un token (encodé en Base64)
function generateToken(user) {
    if (typeof user !== 'object') {
        throw new Error("Le paramètre doit être un objet utilisateur.");
    }

    const jsonString = JSON.stringify(user);      // Convertit l'objet en chaîne JSON
    const base64Token = btoa(jsonString);         // Encode la chaîne en Base64
    return base64Token;
}

// Fonction pour vérifier un token et retrouver l'objet utilisateur
function verifyToken(token) {
    try {
        const jsonString = atob(token);            // Décode le token Base64
        const userObject = JSON.parse(jsonString); // Parse la chaîne JSON en objet
        return userObject;
    } catch (e) {
        console.error("Token invalide :", e.message);
        return null;
    }
}

// Exemple d'utilisation :
const user = {
    username: "alice",
    email: "alice@example.com",
    role: "admin"
};

const token = generateToken(user);
console.log("Token généré :", token);

const decodedUser = verifyToken(token);
console.log("Utilisateur décodé :", decodedUser);