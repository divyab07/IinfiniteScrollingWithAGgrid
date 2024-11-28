import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import "./DataGrid.css"

const DataGrid = () => {
    const gridRef = useRef(null); 
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

   
    const columnData = [
        { headerName: "ID", field: "id", width: 70 },
        { headerName: "Name", field: "name" },
        { headerName: "Username", field: "username" },
        { headerName: "Email", field: "email" },
        { headerName: "City", field: "address.city" },
    ];

   
    const createDataSource = () => ({
        getRows: async (params) => {
            setLoading(true); 
            try {
                const response = await axios.get(
                    `https://json-server-vercel-inky.vercel.app/users?_page=${currentPage}&_limit=10`
                );
                const rows = response.data;
                setCurrentPage((prevPage) => prevPage == 5 ? 0 : prevPage + 1);
                params.successCallback(rows, -1); 
            } catch (error) {
                console.error("Error loading data:", error);
                params.failCallback(); 
            } finally {
                setLoading(false);
            }
        },
    });

    const onGridReady = (params) => {
        const dataSource = createDataSource();
        params.api.setGridOption('datasource', dataSource);
    };

    return (
        <div style={{ width: "100%", height: "100vh" }}>
           {loading && <div className="loading">Loading...</div>}
            <div className="ag-theme-alpine" style={{ height: "100%", width: "100%" }}>
                <AgGridReact
                    ref={gridRef} 
                    columnDefs={columnData}
                    defaultColDef={{ flex: 1, resizable: true }}
                    rowModelType="infinite" 
                    cacheBlockSize={10} 
                    maxConcurrentDatasourceRequests={1} 
                    onGridReady={onGridReady}
                />
            </div>
        </div>
    );
};

export default DataGrid;
