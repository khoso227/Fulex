# Security Specification for FuelX

## 1. Data Invariants
- A `FuelStation` must always have a valid `ownerId` that matches the creator's UID.
- A `Transaction` must link a valid `userId` (the driver) and a `stationId`.
- Only Admins can modify global `AdminSettings`.
- Drivers can only read/write their own `Vehicles` and `Transactions`.
- Station Owners can only update their own `FuelStation` details (stock, rush level).

## 2. The "Dirty Dozen" Payloads (Security Test Cases)
1. **Identity Spoofing**: A driver tries to create a `FuelStation` with their own UID but setting `role` to `admin` in a user doc.
2. **Resource Hijacking**: User A tries to update User B's `Vehicle` details.
3. **Privilege Escalation**: A `driver` tries to write to `/settings/global`.
4. **Stock Manipulation**: A generic user tries to update the `stock` levels of a `FuelStation` they don't own.
5. **Orphaned Transaction**: Creating a `Transaction` for a `stationId` that doesn't exist.
6. **Price Tampering**: A user tries to set the `amount` of a `Transaction` to a negative value.
7. **Shadow Updates**: Including an `isVerified` field in a `FuelStation` update that isn't whitelisted.
8. **ID Poisoning**: Using a 2KB string as a `stationId`.
9. **Timestamp Fraud**: Providing a backdated `createdAt` timestamp from the client.
10. **Role Self-Assignment**: A new user creating their profile and setting `role: 'admin'`.
11. **PII Leak**: A driver trying to `list` all users to scrape emails.
12. **State Shortcutting**: Updating a transaction status directly from `pending` to `completed` without going through the proper payment flow (though for this MVP I'll keep it simple, it's a good test).

## 3. The Test Runner
I will create `firestore.rules.test.ts` after drafting the rules.
