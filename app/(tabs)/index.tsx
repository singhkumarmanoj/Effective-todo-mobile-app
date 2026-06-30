import React, {
  useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Button,
  Modal,
  
} from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EllipsisVertical,LaptopMinimalCheck,Loader, LoaderIcon } from 'lucide-react-native';

import { DraxProvider, DraxView } from "react-native-drax";
import { Alert } from "react-native";

export default function Home({item,index,onDelete}:any) {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [underprocess, setUnderprocess] =useState<string[]>([]); //new lists
  const [completed, setCompleted] = useState<string[]>([]);

  const [currentList, setCurrentList] =useState<"tasks" | "underprocess" | "completed" | null>(null);
  const [visible, setVisible] =useState(false);
  const [selectIndex, setSelectIndex] = useState<number | null>(null); //use for delete item
  const [isLoading, setIsLoading] = useState(true);

  const [pressed, setPressed] = useState(false);    //for button color
  
  
  // #(6)======================================
  // Load saved data=============
  useEffect(() => {
    const loadData = async () => {
     try{

       const savedTasks = await AsyncStorage.getItem("tasks");
       const savedunderprocess = await AsyncStorage.getItem("underprocess");
       const savedCompleted = await AsyncStorage.getItem("completed");
       
       if (savedTasks) setTasks(JSON.parse(savedTasks));
       if (savedunderprocess) { setUnderprocess(JSON.parse(savedunderprocess)) };
       if (savedCompleted) setCompleted(JSON.parse(savedCompleted));
     }catch(e){
      console.log("Error loading data", e);
     } finally {
        setIsLoading(false);

     }
      
    };

    loadData();
    // loadSavedData();
  }, []);

  // Save whenever lists change

  useEffect(() => {
    const saveData = async () => {
      if (!isLoading){

        try{
          await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
          await AsyncStorage.setItem("underprocess", JSON.stringify(underprocess));
          await AsyncStorage.setItem("completed", JSON.stringify(completed));
          
        } catch (e) {
          console.log("Error saving data", e);
        }
      }
    };
    saveData();
  }, [tasks, underprocess, completed, isLoading]);

  //   Adding task trigger
  const addTask = () => {
    const trimmedTask =task.trim();

    if(trimmedTask){
      if(tasks.includes(trimmedTask)){
        setTask("");
        return;
      }

      //check in underprocess

      if (underprocess.includes(trimmedTask)){
        setTask("");  //clear input
        return;
      }

      //check in completed
      if (completed.includes(trimmedTask)){
        setTask("");   //clear input
        return;
      }

      // task adding here
      setTasks([...tasks,trimmedTask]);
      setTask("");

    };

  };

  // delete function
  const deleteItem = (listSetter: React.Dispatch<React.SetStateAction<string[]>>, list: string[],index:number) => {
    listSetter(list.filter((_,i) => i!== index));
  };
  // send to underprocess
  const sendTounderprocess = (index:number) => {
    const item =tasks[index];
    if (item && !underprocess.includes(item)){
      setUnderprocess([...underprocess,item]);
      setTasks(tasks.filter((_,i) =>i !== index));
    }
  };

  //underprocess to completed
  const underprocessToComplted =(index:number) =>{
    const item =underprocess[index];
    if(item && !completed.includes(item)){
      setCompleted([...completed,item]);
      setUnderprocess(underprocess.filter((_,i) =>i !== index));
    }
  };

  // send back to lists
  const sendToTaskLists= (index:number) =>{
    const item =underprocess[index];
    if (item && !tasks.includes(item)){
      setTasks([...tasks, item]);
      setUnderprocess(underprocess.filter((_,i) =>i !== index));
    }
  };

  //send to completed
  const sendToCompleted = (index:number) => {
    const item = tasks[index];
    if(item && !completed.includes(item)){
      setCompleted([...completed,item]);
      setTasks(tasks.filter((_,i) => i !== index));
    }

  };

  //Render lists components
   const renderTasksList =() =>(
    <View style={styles.taskcontainer}>
      <Text style={styles.subheading}>Todo list</Text>
      {tasks.length === 0 ? (

        <Text style={styles.empty}>no list here</Text>
      ):(

        <FlatList
          data={tasks}
          renderItem={({item,index}:{item:string; index:number}) =>(
            <View style={styles.item}>
              <Text>📌 {item}</Text>
              <TouchableOpacity
                onPress={() =>{
                  setSelectIndex(index);
                  setVisible(true);
                  setCurrentList("tasks");
                }}
              
              ><EllipsisVertical size={22} color={"green"}/>

              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item,index) =>index.toString()}
          scrollEnabled={false}
          />
      )}
    </View>
   );

   //Render underprocess

   const renderunderprocessList = () => (
    <View style={styles.taskcontainer}>
      
      <View>

      <Text style={styles.subheading}>Underprocess task ({underprocess.length})</Text>
      </View>
      {/* <Loader /> */}
      {underprocess.length === 0 ? (
        <Text style={styles.empty}>no available</Text>
      ) : (
        <FlatList
          data={underprocess}
          renderItem={({ item, index }: { item: string; index: number }) => (
            <View style={styles.item}>
              <Text> {item}</Text>
              <TouchableOpacity 
                onPress={() => {
                  setSelectIndex(index); 
                  setVisible(true); 
                  setCurrentList("underprocess"); 
                }}
              >
                <EllipsisVertical color="green" size={22} />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false} // Prevents nested scrolling
        />
      )}
    </View>
  );
   
   
   //Render Completed

   const renderCompleted = () => (
    <View style={styles.taskcontainer}>
      <Text style={styles.subheading}>Completed ({completed.length})</Text>
      {completed.length === 0 ? (
        <Text style={styles.empty}>You didn't complted any tasks</Text>
      ) : (
        <FlatList
          data={completed}
          renderItem={({ item, index }: { item: string; index: number }) => (
            <View style={styles.item}>
              <Text> {item}</Text>
              <TouchableOpacity 
                onPress={() => {
                  setSelectIndex(index); 
                  setVisible(true); 
                  setCurrentList("completed"); 
                }}
              >
                <EllipsisVertical color="green" size={22} />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false} // Prevents nested scrolling
        />
      )}
    </View>
  );
   

  // Main programm here entry
  // $$$$$$$$$$$$$$$$$$$$$$$
  if(isLoading){
    return (
      <SafeAreaProvider style={styles.loading}>
        <Text style={styles.heading}>Loading....</Text>
      </SafeAreaProvider>
    )
  }
  return (
    <SafeAreaProvider style={styles.container}>


      {/* Heading of application */}
      <View>
      <Text style={styles.heading}>Effectively Complete Task</Text>
      </View>

      {/* Input field and ADD TASK button */}
      <View style={styles.inputbutton}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task..."
          value={task}
          onChangeText={setTask}
          />

    
          <TouchableOpacity style={styles.button}>

          <Button 
           title="Add Task"  onPress={addTask} />
          {/* <Text style={styles.button} onPress={addTask}>Add</Text> */}
        
          </TouchableOpacity>
      </View>


      <View>
      <FlatList 
      data ={[{key:'tasks'},{key:'underprocess'},{key:'completed'}]}
      renderItem={({ item }) => {
        if (item.key === 'tasks') return renderTasksList();
        if (item.key === 'underprocess') return renderunderprocessList();
        if (item.key === 'completed') return renderCompleted();
        return null;
        
      }}
      keyExtractor={(item) => item.key}
      showsVerticalScrollIndicator={true}
      scrollEnabled={true}
      />
      </View>

      {/* Modal/dialog box */}
      <Modal
          transparent={true}
          visible = {visible}
          animationType="fade"
          onRequestClose={() => setVisible(false)}
      >

          <View style={styles.headmodal}>
            <View style={styles.modallists}>

                {/*from task lists Send to underprocess and completed */}

                {currentList === "tasks" && (
                  <>
                  <TouchableOpacity 
                    onPress={()=> {
                      if(selectIndex !== null) {
                        sendTounderprocess(selectIndex);
                        setVisible(false);
                      setSelectIndex(null);
                    }
                   }}
                >

                  <Text  style={styles.modalText} >Send to underprocess</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                  onPress={()=> {
                    if(selectIndex !== null) {
                      sendToCompleted(selectIndex);
                      setVisible(false);
                    setSelectIndex(null);
                  }
                }}
                >
                  <Text  style={styles.modalText} >Send to Completed</Text>
                  </TouchableOpacity>
                  </>
              )}
              
            {/* ---------------------------- */}


            {/* Delete option for both lists */}
              <TouchableOpacity
              onPress={() =>{
                if(selectIndex !==null && currentList){
                  if(currentList === "tasks"){
                      
                      deleteItem(setTasks,tasks,selectIndex);
                    } else if (currentList === "underprocess"){
                      deleteItem(setUnderprocess,underprocess,selectIndex);
                    } else if(currentList === "completed"){
                      deleteItem(setCompleted,completed,selectIndex);
                    }
                  }
                  setVisible(false);
                  setSelectIndex(null);
                  setCurrentList(null)
                }}
                >
                <Text style={styles.modalText} >Delete</Text>

              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity 
                onPress={() => {
                  setVisible(false);
                  setSelectIndex(null);
                  setCurrentList(null);
                }}
              >
                <Text  style={styles.modalText} >Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
      </Modal>


    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {flex:1,justifyContent:'center',alignItems:'center' },

  //$$$$$$$$$$$$$$$$$$$

  container: { padding: 2, flex: 1,flexDirection:'column', backgroundColor: "#a18e8e" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 10,padding:5 },
  subheading: { fontSize: 18, marginBottom: 8,maxHeight:30, borderBottomWidth: 1,width:'100%',flex:1, alignItems:'center',justifyContent:'center', textAlign:'center',backgroundColor:'grey' },
  loadIcon:{color:'black'},
  inputbutton:{ width:'100%',flexDirection:'column'},
  input: {
    borderWidth: 1,
    borderColor: "#8af01c",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginVertical: 6,
  },
  button: { marginBottom: 10,width:'90%',alignSelf:'center' },
  empty: { color: "gray" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#0fe23a",
    borderWidth: 1,
    padding: 6,
    marginVertical: 4,
    paddingLeft:4,
    marginLeft:2,
    marginRight:2
  },
  delete: { color: "red", fontSize: 18 },
  draggable: { marginVertical: 5 },
  dragging: { opacity: 0.5 },
  taskcontainer: { borderWidth: 2, borderColor: "#344d3c", minHeight: 150, marginBottom: 20,justifyContent:'flex-start' },
  dropZone: { minHeight: 150, justifyContent: "flex-start", padding: 4 },
  completedText: { textDecorationLine: "line-through", color: "gray" },
  headmodal: {flex:1, alignItems:'center',justifyContent:'center',},
  modallists: { backgroundColor:'#836161', fontSize:27, margin:0,padding:2, width:'60%', height:'auto',borderWidth:2,borderRadius:5,borderColor:'#5e5d47'},
  modalText: {fontSize:16,padding:1,margin:1,borderColor:'#689235', borderWidth:1,borderRadius:8,marginVertical:1, }
});
