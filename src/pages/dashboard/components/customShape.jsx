import { Sector } from "recharts";

export const categoryColors = [
    "#65A982", // Muted green
    "#729BCB", // Muted blue
    "#D9A066", // Muted orange
    "#A18BC1", // Muted purple
];

function CustomShape(props) {
    return (
        <Sector
            {...props}
             fill={categoryColors[props.index % categoryColors.length]}
        />
    );
}


export default CustomShape;
