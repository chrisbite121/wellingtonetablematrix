import * as d3 from 'd3';

export const draw = (d3Container:any, tooltipContainer:any, config: any, itemData:any, summaryData:any, groupedData:any) => {
    //additional space for yaxis label
    const leftAdd = config.additionalYAxisLabelPadding ? config.additionalYAxisLabelPadding : 0;
    
    const margin = {top: 30, right: 30, bottom: 40, left: 40 + leftAdd};
    const width = config.maxWidth - margin.left - margin.right;
    const height = config.maxHeight - margin.top - margin.bottom;

    const svg = d3.select(d3Container.current)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("overflow", "visible")
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

    // const xAxis:Array<string> = Array.from({ length: (config.xRange[1] - config.xRange[0]) + 1}, (_, i) => config.xRange[0] + (i));
    // const yAxis:Array<string> = Array.from({ length: (config.yRange[1] - config.yRange[0]) + 1}, (_, i) => config.yRange[0] + (i));
    const xAxis = config.xDomain;
    const yAxis = config.yRange;

    //chart title
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width /2 + (11 * 4))
    .attr("y", -5)
    .text(config.chartTitle);

    // Build X scales and axis:
    const x:any = d3.scaleBand()
    .domain(xAxis)
    .range([ 0, width ])
    .padding(0.01);

    svg.append("g")
    .attr("transform", "translate(-1," + height + ")")
    .call(d3.axisBottom(x))

    //axis label
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width /2 + (config.xTitle.length * 4))
    .attr("y", height + 35)
    .text(config.xTitle);

    // Build Y scales and axis:
    const y:any = d3.scaleBand()
    .range([ height, 0 ])
    .domain(yAxis)
    .padding(0.01);
    svg.append("g")
    .attr("transform", "translate(-1, 0)")
    .call(d3.axisLeft(y));

    //y axis label
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -40 - leftAdd)
    .attr("x", -(height/2) + (config.yTitle.length * 3))
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text(config.yTitle);

    // Build color scale
    const myColor = d3.scaleLinear()
    // .domain([0,1])
    .range(["white", "#69b3a2"] as Array<any>)
    .domain([1,100])
    
    // Three functions that change the tooltip when user hover / move / leave a cell
    var mouseover = function(event: any, d:any) {
        tooltip.style("opacity", 1)
    }
    var mousemove = function(event: any, d:any) {
        d3.select(event.currentTarget).style("opacity", 0.5);
        d3.select(event.currentTarget).style("cursor", "pointer")
       
        if(generateTooltipHtml(d.x + "-" + d.y).length>0)
        {
            tooltip
            .html(generateTooltipHtml(d.x + "-" + d.y))
            .style("left", (event.offsetX+40) + "px")
            .style("top", (event.offsetY - 50) + "px")
        }
        else {
            tooltip.style("opacity", 0);
        }

    }
    var mouseleave = function(event:any, d:any) {
        d3.select(event.currentTarget).style("opacity", 1);
        tooltip.style("opacity", 0);
     
    }

    const matrix = svg.selectAll()
        .data(summaryData, function(d:any) {
            return d.x+':'+d.y;
        })
        .enter()
        .append("g")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)   

    matrix
        .append("rect")
        .attr("x", function(d:any) { return x(d.x) })
        .attr("y", function(d:any) { return y(d.y) })
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d:any) { return d.colour } )

    

    matrix
    .append("text")
    .attr("transform", function(d:any) {
        const xpos = x(d.x) + (x.bandwidth() /2 - 5);
        const ypos = y(d.y) + (y.bandwidth() /2 + 5);
        return "translate(" + xpos + "," + ypos + ")"
    })
    .text(function(d:any) {
        return d.count
    });


    //svg tooltip test
    // var tooltip3 = svg.append("text")
    //     .attr('id', 'mycustomtooltip')
    //     .style("font-size", "16px")
    //     .style("font-weight", "bold")
    //     .style("z-index", 10)

    const tooltip = d3.select(tooltipContainer.current)
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "0.5px")
    // .style("border-radius", "5px")
    .style("border-color", "#bfbfbd")
    .style("padding", "5px")
    .style("position", "relative")
    .style("background-color", "#ffffff")
    .style("z-index", "10")
     

    const generateTooltipHtml = (ref:string) => {
        if(!groupedData[ref]) return ''
        let _html = "<div style='text-align:left;z-index:inherit'><ul style='list-style-type: square;padding-left:17px;z-index:inherit'>"
        let i = 0;
        for (let risk of groupedData[ref])
        {
            if(i<20) {
                _html += `<li>${risk.title}</li>`;
                i++;
            } else {
                break;
            }
        };

        if (i==20) {
            _html += `</ul>...</div>`;
        } else {
            _html += "</ul></div>"
        }

        
        return _html
    }
}