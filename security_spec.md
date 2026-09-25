# Security Specification: LPI Prep Firestore Rules

## 1. Data Invariants
1. **User Profile Invariant**: A user document at `/users/{userId}` can only be read or written by the authenticated user where `request.auth.uid == userId`.
2. **Identity Integrity**: `incoming().uid` must match `request.auth.uid`. No user can masquerade as another user.
3. **Progress Isolation**: `/users/{userId}/progress/current` is strictly private to `userId`. `incoming().userId` must equal `request.auth.uid`.
4. **Exam Session Invariant**: An exam session under `/users/{userId}/examHistory/{sessionId}` must have `incoming().userId == request.auth.uid` and valid document ID format.
5. **Default Deny**: Any path not explicitly matched is strictly inaccessible (`allow read, write: if false;`).
6. **No Blanket Reads**: No unconstrained or cross-user list queries permitted.

## 2. The Dirty Dozen Payloads (Designed to Fail Validation)
1. **Unauthenticated Read**: Attempting to read `/users/user_abc` without credentials -> `PERMISSION_DENIED`.
2. **Cross-User Profile Read**: User `user_1` reads `/users/user_2` -> `PERMISSION_DENIED`.
3. **Cross-User Profile Write**: User `user_1` writes to `/users/user_2` -> `PERMISSION_DENIED`.
4. **ID Spoofing in Body**: User `user_1` writes `{ uid: "user_2", email: "hacker@test.com" }` -> `PERMISSION_DENIED`.
5. **Oversized String Injection**: Writing a 2MB string in `displayName` -> `PERMISSION_DENIED`.
6. **Invalid Path Injection**: Writing to `/users/user!@#$%^&*()` (malformed ID) -> `PERMISSION_DENIED`.
7. **Cross-User Exam History Write**: User `user_1` inserts an exam log under `/users/user_2/examHistory/session1` -> `PERMISSION_DENIED`.
8. **Invalid Score Type in Exam Session**: Passing `score: "one hundred"` instead of number -> `PERMISSION_DENIED`.
9. **Missing Required Fields**: Creating userProfile without `email` -> `PERMISSION_DENIED`.
10. **Shadow Field Injection**: Injecting unauthorized `{ isAdmin: true }` or `{ role: "superuser" }` -> `PERMISSION_DENIED`.
11. **Cross-User Progress Tampering**: User `user_1` updating `/users/user_2/progress/current` -> `PERMISSION_DENIED`.
12. **Catch-All Default Deny Access**: Reading `/arbitrary_collection/random_doc` -> `PERMISSION_DENIED`.
