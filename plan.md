# Implementation Plan - Local Storage Pivot

This plan outlines the transition from Supabase to client-side `localStorage` for all data persistence and authentication.

## Scope Summary
- **Authentication**: Local email/password storage.
- **Data Storage**: `localStorage` for profiles, transaction logs, and device association.
- **Components**: Update all components to interact with a centralized `storage.ts` utility.

## Phase 1: Storage Utility
- Create `src/lib/storage.ts` with helper methods for:
    - User profiles (email, balance, total_views, device_id).
    - Transaction logs (id, user_id, amount, type, status, created_at).
    - Session management.

## Phase 2: Auth Refactoring
- Update `src/hooks/use-auth.tsx` to handle local login/signup.
- Update `src/pages/Auth.tsx` to call local auth methods.

## Phase 3: Dashboard & Wallet Refactoring
- Update `src/pages/Dashboard.tsx` to use local storage for rewards.
- Update `src/pages/Wallet.tsx` to use local storage for withdrawals.
- Update `src/pages/History.tsx` to display local transaction logs.

## Phase 4: Cleanup
- Remove `src/lib/supabase.ts`.
- Remove `SUPABASE_SETUP.md`.
- Verify all functionality (simulated ads, balance updates, withdrawals).
