window.onload = function() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    // Data for the grid including header, title, and footer
    const titleText = "Data Grid Overview";
    const header = ["Name", "Age", "Country"];
    const data = [
        ["Alice", 28, "USA"],
        ["Bob", 24, "UK"],
        ["Claire", 22, "Germany"],
        ["Dennis", 27, "Canada"]
    ];
    const footerText = "Total Records: 4";
    const columns_order_array = [1, 2, 0];
    const columns_visible_array = [0, 1, 2];

    // Global Datagrid Styles
    let showBorders = true;
    let borderThickness = 3;
    let borderColour = "#000000";
    let datagridTransparency = 0; // 0 - visible / 100 - transparent
    let responsiveText = true;
    let setBackgroundImage = true;
    let imageTransparency = 50; // 0 - visible / 100 - transparent

    // Title Datagrid Styles
    let titleFontFamily = "Arial Narrow";
    let titleFontSize = 50;
    let titleFontAlign = "center";
    let titleFontColour = "#00ff00";
    let titleBackgroundColour = "#ff0000";
    let hideTitle = false
  
    // Header Datagrid Styles
    let headerFontFamily = "Arial Black";
    let headerFontSize = 40;
    let headerFontAlign = "center";
    let headerFontColour = "#ff0000";
    let headerBackgroundColour = "#ffff00";
  
    // Rows Datagrid Styles
    let rowFontFamily = "Arial";
    let rowFontSize = 30;
    let rowFontAlign = "center";
    let rowFontColour = "#0000ff"; 
    let rowBackgroundColour = "#0000ff";
    let alternateWithWhite = true;

    // Footer Datagrid Styles
    let footerFontFamily = "Verdana";
    let footerFontSize = 20;
    let footerFontAlign = "center";
    let footerFontColour = "#ffffff";
    let footerBackgroundColour = "#00ffff";
    let hideFooter = false;
 
    const tableWidth = canvas.width;
    const tableHeight = canvas.height;
    const numColumns = columns_visible_array.length; // header.length;
  
    const cellWidth = tableWidth / numColumns;
    const cellHeight = tableHeight / (data.length + (hideTitle ? 0 : 1) + (hideFooter ? 0 : 1) + 1); // extra + 1 is for the header row
    const padding = 1; // eq to 1 rem
    const totalWidth = tableWidth;
  
    function drawGrid() {
        // Clear canvas for redraw
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        ctx.beginPath();
        
        // transparency to opacity
        ctx.globalAlpha = 1 - (datagridTransparency / 100); 
      
        let rowIndex = 0;

        // Function to start creating data rows
        function createDataRows() {
           // Draw title if not hidden
            if (!hideTitle) {
                drawFullWidthRow(titleText, rowIndex, titleBackgroundColour, titleFontColour, titleFontFamily, titleFontSize, titleFontAlign);
                rowIndex++;
            }

            // Draw header
            drawRow(header, rowIndex, true, headerFontFamily, headerFontSize, headerFontAlign);
            rowIndex++;
            
            // Draw data rows
            for (let i = 0; i < data.length; i++) {
                drawRow(data[i], rowIndex, false, rowFontFamily, rowFontSize, rowFontAlign);
                rowIndex++;
            }

            // Draw footer if not hidden
            if (!hideFooter) {
                drawFullWidthRow(footerText, rowIndex, footerBackgroundColour, footerFontColour, footerFontFamily, footerFontSize, footerFontAlign);
            }
            
            // Apply the border drawing only if borders are to be shown
            if (showBorders) {
                ctx.lineWidth = borderThickness;
                ctx.strokeStyle = borderColour;
                ctx.stroke();
            } 
        }
      
        // Function to draw a full-width row
        function drawFullWidthRow(text, rowIndex, bgColor, textColor, font = "Arial", fontSize = 12, fontAlign = "left") {
            let rowFontSize = fontSize;
            const cellY = rowIndex * cellHeight;

            // Background color
            ctx.fillStyle = HexToRGBA(bgColor, setBackgroundImage ? 0 : 1);
            ctx.fillRect(0, cellY, totalWidth, cellHeight);

            // Text settings
            ctx.fillStyle = textColor;
            ctx.font = `${fontSize}px ${font}`;
              
            var calcSize = ctx.measureText(text);
          
            // responsiveText determines if the text should be resized to fit the cell
            // the loop will reduce the font size until the text fits in the cell
            if (responsiveText) {
              let size = fontSize;
              if (calcSize.width > totalWidth) { 
                while(calcSize.width > totalWidth) {
                  size--;
                  ctx.font = `${size}px ${font}`;

                  calcSize = ctx.measureText(text); 
                }
              rowFontSize = size;
              ctx.fillStyle = textColor;
                       
              ctx.font = `${rowFontSize}px ${font}`;
              }     
            }
          
            // logic to center the text in the cell
            let textX = (fontAlign === "center") ? (totalWidth-calcSize.width) / 2 : padding;

            // logic to right align the text in the cell
            if (fontAlign === "right") {
                textX = totalWidth - calcSize.width - (padding * 2);
            }
          
            // logic to left align the text in the cell
            if (fontAlign === "left") {
                textX = padding;
            }

            // Draw the text in the cell
            ctx.fillText(text, textX, cellY + (cellHeight/2) + (rowFontSize/2) - 5);
            ctx.rect(0, cellY, totalWidth, cellHeight);
        }

        // Function to draw a standard row
        function drawRow(rowData, rowIndex, isHeader = false, font = "Arial", fontSize = 12, fontAlign = "left") {
            let rowFontSize = fontSize;
            let visibleColumnIndex = 0;
          
            for (let col = 0; col < columns_order_array.length; col++) {
                const currentColumn = columns_order_array[col];
                const cellX = visibleColumnIndex * cellWidth;
                const cellY = rowIndex * cellHeight;
              
                if (columns_visible_array.includes(col)) { 
                    //  HexToRGBA(headerBackgroundColour, setBackgroundImage ? 0 : 1)
                    ctx.fillStyle = rowIndex === 1 ? HexToRGBA(headerBackgroundColour, setBackgroundImage ? 0 : 1) : HexToRGBA(rowBackgroundColour, setBackgroundImage ? 0 : 1); // with image
                  
                    // Background and text color
                    if (hideTitle) {
                        ctx.fillStyle = rowIndex === 0 ? HexToRGBA(headerBackgroundColour, setBackgroundImage ? 0 : 1) : HexToRGBA(rowBackgroundColour, setBackgroundImage ? 0 : 1); 
                    }

                    if (alternateWithWhite) {
                    // Header color adjustment
                    ctx.fillStyle = rowIndex === 1 ? HexToRGBA(headerBackgroundColour, setBackgroundImage ? 0 : 1) : rowIndex % 2 == 0 ? HexToRGBA(rowBackgroundColour, setBackgroundImage ? 0 : 1) : "rgba(255, 255, 255, 0)"; 

                        // Background and text color
                        if (hideTitle) {
                            // Header color adjustment if title is hidden
                            ctx.fillStyle = rowIndex === 0 ? HexToRGBA(headerBackgroundColour, setBackgroundImage ? 0 : 1) : rowIndex % 2 == 0 ? HexToRGBA(rowBackgroundColour, setBackgroundImage ? 0 : 1) : "rgba(255, 255, 255, 0)"; 
                        }   
                    }

                    ctx.fillRect(cellX, cellY, cellWidth, cellHeight);

                    ctx.fillStyle = isHeader ? headerFontColour : rowFontColour;
                    ctx.font = `${rowFontSize}px ${font}`;

                    var calcSize = ctx.measureText(rowData[currentColumn]);

                    // responsiveText determines if the text should be resized to fit the cell
                    // the loop will reduce the font size until the text fits in the cell
                    if (responsiveText) {
                        let size = fontSize;
                        if (calcSize.width > cellWidth) { 
                            while(calcSize.width > cellWidth) {
                                size--;
                                ctx.font = `${size}px ${font}`;

                                calcSize = ctx.measureText(rowData[currentColumn]); 
                            }

                            rowFontSize = size;
                            ctx.fillStyle = isHeader ? headerFontColour : rowFontColour;
                            ctx.font = `${rowFontSize == size ? rowFontSize : size}px ${font}`;
                        }     
                    }

                    // logic to center the text in the cell
                    let textX = (fontAlign === "center") ? (cellWidth-calcSize.width) / 2 : padding;

                    // logic to right align the text in the cell
                    if (fontAlign === "right") {
                        textX = cellWidth - calcSize.width - (padding * 2);
                    } 

                    // logic to left align the text in the cell
                    if (fontAlign === "left") {
                        textX = padding;
                    }

                    // Draw the text in the cell
                    ctx.fillText(rowData[currentColumn], cellX + textX, cellY + (cellHeight/2) + (rowFontSize/2) - 5, totalWidth);
                    ctx.rect(cellX, cellY, cellWidth, cellHeight);
                    
                    visibleColumnIndex++;
                }
            }
        }
        
        // Function to convert hex string to rgba
        function HexToRGBA(hex, opacity = 0) {
            let hexString = hex; 
            hexString = hexString.replace("#", '');
          
            if (hexString.length == 6) {  
              // Convert each hex character pair into an integer
              let red = parseInt(hexString.substring(0, 2), 16);
              let green = parseInt(hexString.substring(2, 4), 16);
              let blue = parseInt(hexString.substring(4, 6), 16);

              // Concatenate these codes into proper RGBA format
              let rgba  = `rgba(${red}, ${green}, ${blue}, ${opacity})`;

              return rgba;
            }
            else if (hexString.length == 3) {
              // Convert each hex character pair into an integer
              let red = parseInt(hexString.substring(0, 1), 16);
              let green = parseInt(hexString.substring(1, 2), 16);
              let blue = parseInt(hexString.substring(2, 3), 16); 

              // Concatenate these codes into proper RGBA format
              let rgba  = `rgba(${red}, ${green}, ${blue}, ${opacity})`;

              return rgba;
            } 
            else {
              console.log("Invalid Hex String: " + hex);
              return `rgba(255, 255, 255, 0)`;
            }
        }
                
        // Setting the background image will override the background color
        if (setBackgroundImage) {
            var image = document.createElement('img');
           
            image.onload = function () {
              ctx.globalAlpha = 1 - (imageTransparency / 100); // opacity of the image
              ctx.drawImage(image, 0, 0);
              ctx.globalAlpha = 1 - (datagridTransparency / 100); // opactiy of the data grid
              
              createDataRows();  
            };
            image.src = `https://picsum.photos/${tableWidth}/${tableHeight}`;     
        }
         else {
            createDataRows();
        }
    }

    drawGrid();
};
