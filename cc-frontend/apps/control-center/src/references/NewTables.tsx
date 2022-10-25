import MUIDataTable from "mui-datatables";
import * as React from 'react';
import axios from 'axios';
export const NewTables=()=>{
const columns = [
 {
  name: "name",
  label: "Name",
  options: {
   filter: true,
   sort: true,
  }
 },
 {
  name: "type",
  label: "Type",
  options: {
   filter: true,
   sort: true,
   
  }
 },
 {
  name: "instances",
  label: "Instances",
  options: {
   filter: true,
   sort: true,
  }
 },
 {
  name: "node",
  label: "Nodes",
  options: {
   filter: true,
   sort: true,
  }
 },
 {
    name: "nodelist",
    label: "Node List",
    options: {
     filter: true,
     sort: true,
    }
   },

];
const [rows,setRows1]=React.useState<any[]>([]);

    const getProductData = async () => {
        try {
          const data = await axios.get(
            `https://my-json-server.typicode.com/sakthi-vunet/dummyjson/list`
          );
          
          setRows1(data.data);
          console.log(data);
        } catch (e) {
          console.log(e);
        }
      };
    React.useEffect(() => {
        getProductData();
    }, []);


const options = {
  filterType: 'checkbox',
  rowsPerPage: 5,
  rowsPerPageOptions: [5],
};
return(
<MUIDataTable
  title={"Services"}
  data={rows}
  columns={columns}
  options={options}
/>)
}