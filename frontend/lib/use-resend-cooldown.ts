"use client";

import {useEffect, useState } from "react";

export function useResendCooldown(seconds: number){
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((c) => c-1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    function start(){
        setCooldown(seconds);
    }

    return { cooldown, start};
}