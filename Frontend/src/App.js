import React, { useState } from 'react';
import axios from 'axios';
import TitleBar from './titlebar';
import './style.css'; 
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


import sample_out_det from "./images/sample_out_det.jpg";
import sample_out_mask from "./images/sample_out_mask.jpg";


function App() {
  const [file, setFile] = useState();
  const [result, setResult] = useState(null);
  const [task, setSelectedOption] = useState(null);
  const [isCheckListVisible, setCheckListVisible] = useState(false);
  
  const handleFileChange = (event) => {
    console.log(event.target.files);
    setFile(URL.createObjectURL(event.target.files[0]));
  };
  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };


  const handleUpload = async () => {
    try {
      console.log("Hi")
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
      console.log("Hi")
      
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    setCheckListVisible(!isCheckListVisible);
  };
  const detectedImages = async () => {
    try {
      console.log("Hi")
      
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  
  const [checked, setChecked] = useState([]);
  const checkList = ["Car", "Person", "Zebra", "Lights"];


  // Add/Remove checked item from list
  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };

  // Generate string of checked items
  const checkedItems = checked.length
    ? checked.reduce((total, item) => {
        return total + ", " + item;
      })
    : "";

  // Return classes based on whether item is checked
  var isChecked = (item) =>
    checked.includes(item) ? "checked-item" : "not-checked-item";

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
                                    <img src={sample_out_det} className='images_popup' alt='Detected Image' />
                                    <img
                                      src={sample_out_mask} 
                                      className='images_popup'
                                      alt='Masked Image'
                                    />
                                    <img src={sample_out_det} className='images_popup' alt='Detected Image' />
                                    <img src={sample_out_det} className='images_popup' alt='Detected Image' />
                                    <img src={sample_out_det} className='images_popup' alt='Detected Image' />
                                    <img src={sample_out_det} className='images_popup' alt='Detected Image' />
                                    <img src={sample_out_det} className='images_popup' alt='Detected Image' />
                                    <img src={sample_out_det} className='images_popup' alt='Detected Image' />
                                    <img src={sample_out_det} className='images_popup' alt='Detected Image' />
                                    <img src={sample_out_det} className='images_popup' alt='Detected Image' />
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


// import React, { useState } from 'react';

// function App() {
//   const [file, setFile] = useState(null);
//   const [outputPath, setOutputPath] = useState(null);

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     setFile(selectedFile);
//   };

//   const handleFileUpload = async () => {
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch('http://localhost:8000/uploadfile/', {
//         method: 'POST',
//         body: formData,
//       }); 

//       const result = await response.json();
//       console.log(result.output);
//       setOutputPath(result.output);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   const handleDownload = async () => {
//     // Trigger download for the processed file
//     window.open(`http://localhost:8000/download/sample_out_det.jpg`, '_blank');
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleFileUpload}>Upload and Process</button>

//       {outputPath && (
//         <div>
//           <p>Processed Image:</p>
//           <img src={`http://localhost:8000${outputPath}`} alt="Processed" />
//           <button onClick={handleDownload}>Download Processed Image</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// // import React, { useState } from 'react';
// // import axios from 'axios';

// // function App() {
// //   const [file, setFile] = useState(null);
// //   const [outputPath, setOutputPath] = useState(null);

// //   const handleFileChange = (event) => {
// //     setFile(event.target.files[0]);
// //   };

// //   const handleFileUpload = async () => {
// //     const formData = new FormData();
// //     formData.append('file', file);

// //     try {
// //       const response = await axios.post('http://localhost:8000/uploadfile/', formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //         },
// //       });

// //       const { output } = response.data;
// //       setOutputPath(output);
// //       console.log()
// //     } catch (error) {
// //       console.error('Error uploading file:', error);
// //     }
// //   };

// //   return (
// //     <div>
// //       <input type="file" onChange={handleFileChange} />
// //       <button onClick={handleFileUpload}>Upload and Process</button>

// //       {outputPath && (
// //         <div>
// //           <p>Output Image:</p>
// //           <img src={`http://localhost:8000${outputPath}`} alt="Output" />
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default App;
