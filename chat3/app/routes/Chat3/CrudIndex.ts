import HttpCommon from '@/lib/HttpCommon';
import LibConfig from "@/lib/LibConfig"
//
const CrudIndex = {
  /**
   *
   * @param
   *
   * @return
   */
  getList :async function (): Promise<any>
  {
    try{
      //
      const postItem = {
        dt_type: LibConfig.dt_type.dt_type6,
      }
      console.log(postItem); 
      const json = await HttpCommon.serverPost(postItem, "/api/ai_table1/get_list");
//console.log(json);   
      let items: any[] = [];
      items = json.data;
      const out: any[] = [];
      items.forEach((row: any) => {
        if(row.content) {
          let target = JSON.parse(row.content);
          target.id = row.id;
          target.createdAt = row.createdAt;
          target.userId = row.userId;
          target.replies = JSON.parse(target.replies);
          //console.log("#replies");
          //console.log(target.replies);
          out.push(target);
        }
      });
      return out;
    } catch (e) {
      console.error(e);
      throw new Error("Error, getList");
    } 
  },  
  /**
   *
   * @param
   *
   * @return
   */
  addItem : async function(item: any) : Promise<any>
  {
    try{
      let ret = false;
      const postItem = {
          userId: 0,
          dt_type: LibConfig.dt_type.dt_type6,
          content: JSON.stringify(item),
      }
      //console.log(postItem);
      const json = await HttpCommon.serverPost(postItem, "/api/ai_table1/create");
      console.log(json);
      if (json.ret === 200) {
          ret = true;
      }
      return ret;
    } catch (e) {
      console.error("Error, addItem");
      console.error(e);
      throw new Error('Error , addItem');
    }
  },
    /**
   *
   * @param
   *
   * @return
   */
  delete : async function(id: number) : Promise<any>
  {
    try{
      let ret = false;
      const item = {id: id}
console.log(item);
      const json = await HttpCommon.serverPost(item, "/api/ai_table1/delete");
      //console.log(json);
      if (json.ret === 200) {
          ret = true;
      }
      return ret;
    } catch (e) {
      console.error("Error, delete");
      console.error(e);
      throw new Error('Error , delete');
    }
  },
  /**
  * 
  * @param
  *
  * @return
  */ 
 update:  async function(values: any, id: number) {
    try{
      const postItem = {
        id: id,
        userId: 0,
        dt_type: LibConfig.dt_type.dt_type6,
        content: JSON.stringify(values),
      }       
      const json = await HttpCommon.serverPost(postItem, "/api/ai_table1/update");
console.log(json);
      return json;
    } catch (e) {
      console.error(e);
    } 
  }, 
}

export default CrudIndex;
