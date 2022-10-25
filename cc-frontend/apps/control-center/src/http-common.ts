import axios from "axios";
export default axios.create({
  baseURL: "https://my-json-server.typicode.com/sakthi-vunet/dummyjson/list",
  headers: {
    "Content-type": "application/json"
  }
});