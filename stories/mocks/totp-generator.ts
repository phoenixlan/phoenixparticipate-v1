/*
 * Storybook stand-in for totp-generator (wired up as a webpack alias in .storybook/main.ts). The ticket QR code only
 * needs some value to render, not a valid code.
 */
export class TOTP {
    static generate = async (): Promise<{ otp: string; expires: number }> => ({
        otp: '12345678',
        expires: Date.now() + 30 * 1000,
    });
}
