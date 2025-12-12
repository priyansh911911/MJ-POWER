// @ts-nocheck

import Api from "@/services/frontql/Api";

// Admin panel login
export async function adminLogin(body) {
  return await Api.post("/auth-users-admins", {
    body: { email: body.email, password: body.password },
    fields: "id,email,role",
  });
}

// Clients' users
export async function userLogin(body) {
  const loginResult = await Api.post("/auth-users-clients", {
    body: { email: body.email, password: body.password },
    fields: "id,name,email,role,client",
  });

  // If login successful and user has a role, fetch role permissions
  if (!loginResult.err && loginResult.result?.role) {
    try {
      const roleResult = await Api.get("/roles", {
        page: "1,1",
        sort: "id",
        search: `id:${loginResult.result.role}`,
        fields: "access_modules,allowed_actions",
      });

      if (!roleResult.err && roleResult.result?.[0]) {
        loginResult.result.access_modules = roleResult.result[0].access_modules;
        loginResult.result.allowed_actions =
          roleResult.result[0].allowed_actions;
      }
    } catch (error) {
      console.error("Failed to fetch role permissions:", error);
    }
  }

  return loginResult;
}

export function setClientSession(session) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", session.isLoggedIn ? "true" : "false");
      if (session.user) {
        localStorage.setItem("user", JSON.stringify(session.user));
      }
      if (session.sessionToken) {
        localStorage.setItem("session", session.sessionToken);
      }
      localStorage.setItem("loginTimestamp", Date.now().toString());
    }
  } catch {}
}

export function clearClientSession() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("session");
      localStorage.removeItem("loginTimestamp");
    }
  } catch {}
}

function checkSessionValidity() {
  try {
    if (typeof window !== "undefined") {
      const loginTimestamp = localStorage.getItem("loginTimestamp");
      if (loginTimestamp) {
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if (now - parseInt(loginTimestamp, 10) > twentyFourHours) {
          clearClientSession();
          return false;
        }
      }
    }
  } catch {}
  return true;
}

export function getClientSessionToken() {
  try {
    if (typeof window !== "undefined") {
      if (!checkSessionValidity()) return null;
      return localStorage.getItem("session");
    }
  } catch {}
  return null;
}

export function getCurrentUser() {
  try {
    if (typeof window !== "undefined") {
      if (!checkSessionValidity()) return null;
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

export function hasAccess(route) {
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

export function can(action) {
  try {
    const user = getCurrentUser();
    if (!user) return false;
    const acts = String(user.allowed_actions || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    return acts.includes("*") || acts.includes(String(action).toLowerCase());
  } catch {
    return false;
  }
}
