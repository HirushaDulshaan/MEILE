import { describe, it, expect } from 'vitest';
import { registerSchema } from '../lib/validations/auth';

describe('Register Validation Logic', () => {

    // ✅ Test Case 1: නිවැරදි දත්ත දුන්නම වැඩ කරනවද?
    it('should pass with valid data', () => {
        const validData = {
            firstName: "Hirusha",
            lastName: "Dulshan",
            email: "hirusha@gmail.com",
            contact: "0771234567",
            password: "password123"
        };
        const result = registerSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    // ❌ Test Case 2: වැරදි ඊමේල් එකක් දුන්නොත්?
    it('should fail with invalid email', () => {
        const invalidEmail = {
            firstName: "Hirusha",
            lastName: "Dulshan",
            email: "hirusha.com", // @ ලකුණ නැහැ
            contact: "0771234567",
            password: "password123"
        };
        const result = registerSchema.safeParse(invalidEmail);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.flatten().fieldErrors.email).toContain(
                "Please enter a valid email address (e.g., name@example.com)"
            );
        }
    });

    // ❌ Test Case 3: ලංකාවේ නොවන නම්බර් එකක් දුන්නොත්?
    it('should fail with invalid SL contact number', () => {
        const invalidContact = {
            firstName: "Hirusha",
            lastName: "Dulshan",
            email: "hirusha@gmail.com",
            contact: "1234567890", // ලංකාවේ නම්බර් එකක් නෙවෙයි
            password: "password123"
        };
        const result = registerSchema.safeParse(invalidContact);
        expect(result.success).toBe(false);
    });

    // ❌ Test Case 4: පාස්වර්ඩ් එක කෙටි වුණොත්?
    it('should fail if password is too short', () => {
        const shortPassword = {
            firstName: "Hirusha",
            lastName: "Dulshan",
            email: "hirusha@gmail.com",
            contact: "0771234567",
            password: "123" // අකුරු 6ට අඩුයි
        };
        const result = registerSchema.safeParse(shortPassword);
        expect(result.success).toBe(false);
    });
});