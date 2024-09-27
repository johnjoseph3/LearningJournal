"use client"

import { Button } from "./ui/button.tsx"
import { useState } from "react"
import CustomLink from "./custom-link.tsx"

export default function TestExample() {
    const [apiResponse, setApiResponse] = useState("")

    const makeRequest = async () => {
        try {
            const response = await fetch("/api/protected")
            const data = await response.json()
            setApiResponse(JSON.stringify(data, null, 2))
        } catch (error) {
            setApiResponse("Failed to fetch data: " + error)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Client Side Rendering</h1>
            <p>
                It needs the{" "}
                <CustomLink href="https://react.dev/reference/rsc/use-client">
                    <code>'use client'</code>
                </CustomLink>{" "}
                directive at the top of the file to enable client side rendering, and
                the{" "}
                <CustomLink href="https://nextjs.authjs.dev/react#sessionprovider">
                    <code>SessionProvider</code>
                </CustomLink>{" "}
                component in{" "}
                <strong>
                    <code>client-example/page.tsx</code>
                </strong>{" "}
                to provide the session data.
            </p>

            <div className="flex flex-col gap-4 rounded-md bg-gray-100 p-4">
                <h2 className="text-xl font-bold">Make request to backend</h2>
                <div className="flex flex-col">
                    <Button
                        onClick={makeRequest}
                    >
                        Make API Request
                    </Button>
                </div>
                <pre>{apiResponse}</pre>
            </div>
        </div>
    )
}
