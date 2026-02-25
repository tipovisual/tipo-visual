// ============================================================
// supabase-config.js — Configuración Central de TipoVisual
// ============================================================
// ⚠️  IMPORTANTE: Reemplaza los valores de abajo con los tuyos.
//     Los encuentras en: Supabase Dashboard → Settings → API
// ============================================================

const SUPABASE_URL = 'https://ikpnbvicuaiexrqvuvux.supabase.co';   // 👈 Reemplaza esto
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcG5idmljdWFpZXhycXZ1dnV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTI0NjUsImV4cCI6MjA4NzU2ODQ2NX0.RxIy-tHnrmq-ROZIu__0LZz_2i9X3TVK6DBNewfq39Y';             // 👈 Reemplaza esto

// ── Inicialización del cliente ──────────────────────────────
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// HELPERS DE AUTENTICACIÓN
// Usa estas funciones en cualquier página del proyecto.
// ============================================================

/**
 * Obtiene la sesión activa del usuario.
 * Retorna null si no hay sesión.
 */
async function getSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
}

/**
 * Obtiene el perfil del usuario actual desde la tabla `profiles`.
 * Incluye su nombre y rol (admin / user).
 */
async function getUserProfile() {
    const session = await getSession();
    if (!session) return null;

    const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    if (error) { console.error('Error al obtener perfil:', error); return null; }
    return data;
}

/**
 * Protege una página de admin.
 * Si no hay sesión o el usuario no es admin → redirige a login.
 */
async function requireAdmin() {
    const profile = await getUserProfile();
    if (!profile || profile.role !== 'admin') {
        window.location.href = 'login.html?reason=admin';
    }
    return profile;
}

/**
 * Protege una página de usuario regular.
 * Si no hay sesión → redirige a login.
 */
async function requireAuth() {
    const session = await getSession();
    if (!session) {
        window.location.href = 'login.html?reason=auth';
    }
    return session;
}

/**
 * Cierra la sesión y redirige al inicio.
 */
async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
}

// ============================================================
// SQL PARA EJECUTAR EN SUPABASE (una sola vez)
// Supabase Dashboard → SQL Editor → New Query → Pega y ejecuta
// ============================================================
/*

-- 1. Tabla de perfiles de usuario
CREATE TABLE profiles (
    id         UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name       TEXT,
    role       TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Activar Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Políticas: cada usuario solo ve y edita su propio perfil
CREATE POLICY "Usuarios ven su propio perfil"
    ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios actualizan su propio perfil"
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- 4. El admin puede ver todos los perfiles
CREATE POLICY "Admin ve todos los perfiles"
    ON profiles FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 5. Historial de juegos
CREATE TABLE game_sessions (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
    edition      TEXT NOT NULL,
    moves        INTEGER NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven su propio historial"
    ON game_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios insertan su historial"
    ON game_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Trigger: crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Para convertirte en admin (ejecuta esto con tu email):
-- UPDATE profiles SET role = 'admin'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'TU-EMAIL@ejemplo.com');

*/
