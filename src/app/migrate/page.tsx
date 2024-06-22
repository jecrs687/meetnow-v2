"use client";
import { useEffect, useState } from "react";
import migrate from "./action";




export default function Page() {
    const [values, setValues] = useState<
        Awaited<ReturnType<typeof migrate>>
    >()
    useEffect(() => {
        migrate().then(setValues)
    }, [])
    if (!values) return (<div>Loading...</div>)
    return (
        <pre>
            {JSON.stringify(values, null, 2)}
        </pre>
    )
}