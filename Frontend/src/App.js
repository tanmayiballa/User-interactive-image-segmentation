import React, { useState, useEffect, Component   } from 'react';
import axios from 'axios';
import TitleBar from './titlebar';
import './style.css'; 
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import xtype from 'xtypejs'


import sample_out_det from "./images/sample_out_det.jpg";
import sample_out_mask from "./images/sample_out_mask.jpg";


function App() {

  const [file, setFile] = useState();
  const [result, setResult] = useState(null);
  const [task, setSelectedOption] = useState(null);
  const [isCheckListVisible, setCheckListVisible] = useState(false);
  const [checked, setChecked] = useState([]);
  const [checkList, setCheckList] = useState([]);
  const checkList1 = ["Car", "Person", "Zebra", "Lights"];

  const handleFileChange = (event) => {
    console.log(event.target.files);
    setFile(URL.createObjectURL(event.target.files[0]));
  };
  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };


  const handleUpload = async () => {
    try {
      console.log("Uploaded Image")
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:8000/uploadfile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data.output)
      setResult(response.data.output);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const processImage = async () => {
    try {
      console.log("Process Image")
      // setCheckList(["Car", "Person", "Zebra", "Lights"]);
      const response = await axios.post('http://localhost:5006/ecc/get_labels', {
          headers: {
            'Content-Type': 'application/json',
          }
        });
      const resp = await JSON.parse(JSON.stringify(response));
      console.log('Data from backend :', resp.data);
      setCheckList(Object.values(resp.data.data.labels))

    } catch (error) {
      console.error('Error uploading file:', error);
    }
    setCheckListVisible(!isCheckListVisible);
  };

  const detectedImages = async () => {
    try {
      console.log("Detected Images")
      const response = await axios.post('http://localhost:5006/ecc/get_image', {}, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log(response.data.data)
        var blobURL = URL.createObjectURL(response.data.data);
        var image = document.getElementById("detImage");
        image.onload = function(){
            URL.revokeObjectURL(this.src); // release the blob URL once the image is loaded
        }
        image.src = blobURL;

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleCheck = (event) => {
    const updatedList = event.target.checked
      ? [...checked, event.target.value]
      : checked.filter((item) => item !== event.target.value);
    setChecked(updatedList);
  };
  const checkedItems = checked.length ? checked.join(', ') : '';

  // Return classes based on whether item is checked
  const isChecked = (item) => (checked.includes(item) ? 'checked-item' : 'not-checked-item');

  const [dialog, setDialog] = useState(false);
  const [imageSrc, setImageSrc] = useState(
    "src/images/sample_out_det.jpg"
  );
  const toggleDialog = () => {
    setDialog(!dialog);
  };

  return (
    <div>
      <div>
      <TitleBar title="Image Segmentation" />
      <div className='file-upload-container'>
        <label htmlFor='fileInput' className='custom-file-upload'>
          Upload Your Input Image
        </label>
        <input id = "inp_img" type="file" onChange={handleFileChange} className='input-file'/>
        {
          file && (
            <div className='input-image-container'>
              <div>
                <img src={file} alt="input_image" className='input-image' />
              </div>

              <div className="task-box">
                <div className="task-info-box">
                  <p>Choose the required operation:</p>
                </div>

                <div className="dropdown-container">
                  <label htmlFor="dropdown"></label>
                  <select id="dropdown" value={task} onChange={handleDropdownChange}>
                    <option value="">Select an option</option>
                    <option value="Option 1">Detect all objects</option>
                    <option value="Option 2">Option 2</option>
                    <option value="Option 3">Option 3</option>
                  </select>
                </div>
                {task && (
                <div>
                  <button onClick={processImage}>Process</button>
                  {isCheckListVisible && (
                    <div>
                      <h3>Identified Labels</h3>
                      <div className="list-container">
                        {checkList.map((item, index) => (
                          <div key={index}>
                            <input value={item} type="checkbox" onChange={handleCheck} />
                            <span className={isChecked(item)}>{item}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        {`Selected Labels are: ${checkedItems}`}
                      </div>
                      <div>
                        <Popup trigger=
                          {<button onClick={detectedImages}>Show Detected Images</button>}
                          modal nested>
                          {
                            close => (
                                <div >
                                    <div className='image-popup'>
                                    <img id="myImage" src="" />
                                    </div>
                                    <div>
                                        <button className='button_popup'
                                        onClick={() => close() }>Close</button>
                                    </div>
                                </div>
                            )
                          }
                        </Popup>
                      </div>
                    </div>)}

                </div>)}

              </div>

            </div>
          )
        }
        </div>
    </div>

      {/* <button onClick={handleUpload}>Upload and process</button>
      {result && (
        <div>
          <img src={sample_out_det} alt="Cropped Object" />
          <img src={sample_out_mask} alt="Masked Object" />
        </div>
      )} */}
      
    </div>
  );
}

export default App;

