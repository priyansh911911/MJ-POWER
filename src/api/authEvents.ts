import Api from "../services/Api";

/* ================================
   Interfaces
================================ */

export interface LoginBody {
  email: string;
  password: string;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  role?: string;
  client?: any;
  access_modules?: string;
  allowed_actions?: string;
}

export interface ClientSession {
  isLoggedIn: boolean;
  user?: User | null;
  sessionToken?: string | null;
}

/* ================================
   API: User Login
================================ */

export async function userLogin(body: LoginBody): Promise<User | null> {
  const loginResult = await Api.post("/auth-users-clients", {
    body: { email: body.email, password: body.password },
    fields: "id,name,email,role,client",
  });

  return loginResult ?? null;
}

/* ================================
   Session Management
================================ */

export function setClientSession(session: ClientSession): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("isLoggedIn", session.isLoggedIn ? "true" : "false");

    if (session.user) {
      localStorage.setItem("user", JSON.stringify(session.user));
    }

    if (session.sessionToken) {
      localStorage.setItem("session", session.sessionToken);
    }

    localStorage.setItem("loginTimestamp", Date.now().toString());
  } catch {
    /* ignore */
  }
}

export function clearClientSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("session");
    localStorage.removeItem("loginTimestamp");
  } catch {
    /* ignore */
  }
}

function checkSessionValidity(): boolean {
  if (typeof window === "undefined") return true;

  try {
    const loginTimestamp = localStorage.getItem("loginTimestamp");
    if (loginTimestamp) {
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (now - parseInt(loginTimestamp, 10) > twentyFourHours) {
        clearClientSession();
        return false;
      }
    }
  } catch {
    /* ignore */
  }

  return true;
}

export function getClientSessionToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    if (!checkSessionValidity()) return null;
    return localStorage.getItem("session");
  } catch {
    return null;
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;

  try {
    if (!checkSessionValidity()) return null;

    const raw = localStorage.getItem("user");
    if (!raw) return null;

    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

/* ================================
   Access Control
================================ */

export function hasAccess(route: string): boolean {
  try {
    const user = getCurrentUser();
    if (!user) return false;

    const mods = String(user.access_modules || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (mods.includes("*")) return true;

    return mods.some((m) => route === m || route.startsWith(`${m}/`));
  } catch {
    return false;
  }
}

export function can(action: string): boolean {
  try {
    const user = getCurrentUser();
    if (!user) return false;

    const acts = String(user.allowed_actions || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    return acts.includes("*") || acts.includes(action.toLowerCase());
  } catch {
    return false;
  }
}
