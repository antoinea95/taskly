import { PropsWithChildren } from "react";


export const Tag = ({children, color} : PropsWithChildren<{color:string}>) => {

    return (
        <span className={`bg-${color}-300 text-${color}-800 uppercase font-bold px-2 py-1 rounded-lg text-xs flex items-center gap-1`}>
            {children}
        </span>
    )
}