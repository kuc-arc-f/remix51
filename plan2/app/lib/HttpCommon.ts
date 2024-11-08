import LibConfig from "@/lib/LibConfig"
import axios from 'axios';
//
const HttpCommon = {
  /**
  * 
  * @param
  *
  * @return
  */ 
  post: async function(item: any, path: string): Promise<any>
  {
    try {
      let url = ""; 
      const body: any = JSON.stringify(item);		
      const res = await fetch(path, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: body
      });
      const json = await res.json()
      return json;
    } catch (e) {
      console.error(e);
      throw new Error('Error , post');
    }
  }, 
  /**
  * 
  * @param
  *
  * @return
  */ 
  serverPost: async function(item: any, path: string): Promise<any>
  {
    try {
      const url = import.meta.env.VITE_API_URI;
      const apiUrl = url + path;
      console.log("apiUrl=", apiUrl);
      const body: any = JSON.stringify(item);		
      //console.log(item);
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: body
      });
      const json = await res.json();
      return json;
    } catch (e) {
      console.error(e);
      throw new Error('Error , post');
    }
  },  
}
export default HttpCommon;
