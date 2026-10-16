"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";

export default function PainelLayout({ children }: { children: React.ReactNode }){
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!getSession()){
            router.replace("/login");
            return;
        }
        setReady(true);
    }, [ router]);

    if (!ready) return null;

    return(children)
}