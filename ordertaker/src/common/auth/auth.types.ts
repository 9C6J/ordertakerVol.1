import { EmailOtpType } from "@supabase/supabase-js";

export type SupabaseAuthPayload = {
    email: string;
    password: string;
};

export type SupabaseChangePasswordPayload = {
    password: string;
};

export type SupabaseRecoveryPasswordPayload = {
    email: string;
};
