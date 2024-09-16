import { useRef, useState } from "react";


export const useDragMouse = () => {

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if(sliderRef.current) {
            setIsDragging(true);
            setStartX(e.pageX - sliderRef.current.offsetLeft);
            setScrollLeft(sliderRef.current.scrollLeft);
        }
    }

    const handleMouseLeaveOrUp = () => {
        setIsDragging(false);
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if(!isDragging || !sliderRef.current) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        sliderRef.current.scrollLeft = scrollLeft - walk;
    }

    return {sliderRef, isDragging, handleMouseDown, handleMouseLeaveOrUp, handleMouseMove}
}