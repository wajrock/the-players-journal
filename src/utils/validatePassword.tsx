export const validatePassword = (password:string) => {
    // Regex pour vérifier si le format de l'email est valide
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
}