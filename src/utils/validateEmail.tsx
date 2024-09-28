export const validateEmail = (email:string) => {
    // Regex pour vérifier si le format de l'email est valide
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}