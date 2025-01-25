export const handleMouseMove = (e, setFListWidth) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 10 && newWidth < 90) {
        setFListWidth(newWidth);
    }
};

let boundMouseMove;

export const handleMouseUp = () => {
    window.removeEventListener('mousemove', boundMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
};

export const handleMouseDown = (setFListWidth) => {
    boundMouseMove = (e) => handleMouseMove(e, setFListWidth);
    window.addEventListener('mousemove', boundMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
};
