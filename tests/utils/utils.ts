export class Utils {
    static getRandomEmail(): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let email = '';
        for (let i = 0; i < 10; i++) {
            email += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        email += '@example.com';
        return email;
    }
}