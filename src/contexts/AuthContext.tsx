import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  role: string;
}

interface Guest {
  id: string;
  name: string;
  surname: string;
  booking_number: string;
  cottage_name: string;
  contact_number: string;
  check_in_date: string;
  check_out_date: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  guest: Guest | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signInWithPhone: (phone: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  guest: null,
  loading: true,
  signInWithEmail: async () => ({ error: null }),
  signInWithPhone: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user is admin
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
          } else {
            // Check if user is a guest (phone auth)
            const phone = session.user.phone;
            if (phone) {
              const { data: guestData } = await supabase
                .from('guests')
                .select('*')
                .eq('contact_number', phone)
                .gte('check_out_date', new Date().toISOString().split('T')[0])
                .lte('check_in_date', new Date().toISOString().split('T')[0])
                .single();
              
              if (guestData) {
                setGuest(guestData);
              }
            }
          }
        } else {
          setProfile(null);
          setGuest(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithPhone = async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        shouldCreateUser: false
      }
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    profile,
    guest,
    loading,
    signInWithEmail,
    signInWithPhone,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};