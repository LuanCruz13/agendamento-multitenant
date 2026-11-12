type Session = {
    accessToken: string;
    refreshToken: string;
};

type Organization = {
    name: string;
    slug: string;
};

type User = { 
    email: string;
};


export function getSession(): Session | null {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if(!accessToken || !refreshToken) return null;

        return { accessToken, refreshToken};

    } catch {
        return null;
    }
}

export function setAccessToken(token: string){
    try{
        localStorage.setItem("accessToken", token);
    } catch {
        return null;
    }
}

export function clearSession(){

    try{
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("organization");
        localStorage.removeItem("user");
    } catch {
        return null;
    }
}

export function getOrganization(): Organization | null {
    try {
        const raw = localStorage.getItem("organization");
        if (!raw) return null;
        return JSON.parse(raw) as Organization;
    } catch {
        return null;
    }
}

export function setOrganization(organization: Organization){
    try {
        localStorage.setItem("organization", JSON.stringify(organization));
    } catch {
        return null;
    }
}

export function setSession(session: Session){
    try{
        localStorage.setItem("accessToken", session.accessToken);
        localStorage.setItem("refreshToken", session.refreshToken);
    } catch {
        return null;
    }
}

export function getUser(): User | null {
    try {
        const raw = localStorage.getItem("user");
        if (!raw) return null;
        return JSON.parse(raw) as User;
    } catch {
        return null;
    }
}

export function setUser(user: User){
    try {
        localStorage.setItem("user", JSON.stringify(user));
    } catch { 
        return null;
    }
}