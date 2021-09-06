import * as React from "react";
import { useEffect, useRef } from 'react';
import { draw } from '../helpers/DrawFunction'

export const Chart = (props:any) => {
    const d3Container = useRef(null);
    const tooltipContainer = useRef(null);

    useEffect(() => {
        if(d3Container.current && tooltipContainer.current && props.data.config) {
            draw(d3Container, 
                tooltipContainer,
                props.data.config, 
                props.data.itemData, 
                props.data.summaryData, 
                props.data.groupedData
            )
        }
        return () => {
            if(d3Container.current) {
                (d3Container as any).current.innerHTML = "";
            };
            if(tooltipContainer.current) {
                (tooltipContainer as any).current.innerHTML = "";
            }
            
        }
    })
    return (
        <>
            <div ref={tooltipContainer} style={{position: "absolute"}}></div>
            <div ref={d3Container}></div>
        </>
    )


}