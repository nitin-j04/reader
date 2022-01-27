import React, { useEffect, useState } from "react";
import {Button , Form,FormGroup,Label,FormText, Input } from "reactstrap";
import FileBase64 from "react-file-base64";
import {Buffer} from 'buffer';
import "./Upload.css";
const Upload = () => {

    const processing = "processing document...";

    const [confirmation,setConfirm] = useState("");
    // const {isLoading,setLoad} = useState("");
    const [file,setFiles] = useState("");
    const [target,callTarget] = useState();
    const [uid,setUid] = useState();
    const [jsonString,setjsonString] = useState("");
   
   
    const handleSubmit = (e) => {

        e.preventDefault();
        setConfirm("uploading..");
    };

const getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        // console.log("Called", reader);
        baseURL = reader.result;
        // console.log(baseURL);
        resolve(baseURL);
      };
    //   console.log(fileInfo);
    });
  };

  const updateFile =async (e)=>{
      setFiles(e);
  }

  const updateTextarea= (e)=>{
      setjsonString(e.target.value);
  }
  
  const handleFileInputChange =async (e) => {
    
    

    
    console.log(e.target.files[0]);

    let base64ToString  ;
    await getBase64(e.target.files[0])
      .then(result => {
        // file["base64"] = result;
       
        base64ToString = JSON.stringify(result);
        
        
        // console.log(base64ToString);
        // console.log("File Is", String(result));
      
      })
      .catch(err => {
        console.log(err);
      });
    await  updateFile(base64ToString);
  
    // console.log("before " + base64ToString);
   
      
  };

    
    useEffect( async()=> {
        if(file!==""){
                const printString=async ()=>{
                    return await file.replace('"','').replace('"','');
                    }
                console.log("inside fetch");
                console.log(file);
                const UID = Math.floor((Math.random() * 1000000) + 1);
                await setUid(UID);
        var data = await {
                fileExt : 'png',
                imageID : UID,
                folder : UID,
                img : await printString()

            };
            
            console.log(data);
            const result = await fetch('https://ksdcu1y80a.execute-api.ap-south-1.amazonaws.com/Production/',
            {
                    method: 'POST',
                    headers : {
                        Accept : 'application/json',
                        'Content-type': 'application/json'
                    },
                    body : JSON.stringify(data)
            });
           callTarget(result);
    }
  },[file]);


        useEffect( async() => {
            if(uid!==undefined){
            const targetImage=uid+'.png';
            const result = await fetch('https://ksdcu1y80a.execute-api.ap-south-1.amazonaws.com/Production/ocr',
            {
                    method: 'POST',
                    headers : {
                        Accept : 'application/json',
                        'Content-type': 'application/json',
                        
                    },
                    body : JSON.stringify(targetImage)
            });

            // alert(result);

           const ocrbody=await result.json();
          
            // console.log(ocrbody);
            setjsonString(ocrbody.body[0]);
        }
            

        },[target])



    return (
        <>
            <div className="row">
                <div className="col-6 offset-3">
                    <Form onSubmit={handleSubmit}>

                        <FormGroup>
                            <h3 className="text-danger">{file!="" ? processing : ""}</h3>
                            <h6 >{file!="" ? "" :"Upload Image"}</h6>

                            <FormText color="mutex">Png,jpg</FormText>
                        

                        <div className="form-group files color col-12">
                            {/* <FileBase64 multile={true} 
                                        onDone={getFiles} /> */}
                            <input type={"file"} onChange={ handleFileInputChange}/>
                        </div>
                        </FormGroup>
                        <FormGroup>
                        <div className="col-12">
                               <FormText color="mutex">Text in provided document</FormText>         
                            <textarea type={"text"} value={jsonString} style={{width:"100%"}} rows={"9"} onChange={ updateTextarea}/>
                        </div>
                        </FormGroup>
                        

                        <Button className="btn btn-lg col-12 btn-success" >
                        Submit
                        </Button>
                    </Form>

                </div>
            </div>
        </>
    );
};

export default Upload;