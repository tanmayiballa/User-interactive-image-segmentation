

// // import React from 'react';

// // const MyComponent = () => {
// //   return (
// //     <div>
// //       <img src="http://localhost:8000/images/sample.jpg" alt="My Image" />
// //     </div>
// //   );
// // };

// // export default MyComponent;

// import React from 'react';

// const ImageList = ({ imageUrls }) => {
//   return (
//     <div>
//       {imageUrls.map((imageUrl, index) => (
//         <img key={index} src={imageUrl} alt={`Image ${index}`} />
//       ))}
//     </div>
//   );
// };

// const MyComponent = () => {
//   const images = [
//     'http://localhost:8000/images/sample.jpg',
//     'http://localhost:8000/images/sample.jpg',
//     'http://localhost:8000/images/sample.jpg',
//   ];

//   return (
//     <div>
//       <h1>Dynamic Image List</h1>
//       <ImageList imageUrls={images} />
//     </div>
//   );
// };

// export default MyComponent;














import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleBar from './titlebar';
import './style.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import xtype from 'xtypejs';


import sample_out_det from "./images/sample_out_det.jpg";
import sample_out_mask from "./images/sample_out_mask.jpg";

const instance = axios.create({
  baseURL: 'http://localhost:8000/images/',
});
const baseimgURL = 'http://localhost:8000/images/';

function App() {

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [result, setResult] = useState(null);
  const [task, setSelectedOption] = useState(null);
  const [isCheckListVisible, setCheckListVisible] = useState(false);
  const [labels, setLabels] = useState([]);
  const [checked, setChecked] = useState([]);
  const [checkList, setCheckList] = useState([]);
  const [ResponseData, setResponseData] = useState(null);
  const [showImages, setShowImages] = useState(false);
  const [detImgs, setsetImgs] = useState(null);
  const [DetImgsValues,setDetImgsValues] = useState(null);
  const [merged_checks, setMerged_checks] = useState([]);
  const [merged_checks_url, setMerged_checks_url] = useState([]);

  const imageList = [
    'http://localhost:8000/images/sample.jpg',
    'http://localhost:8000/images/sample.jpg',
    'http://localhost:8000/images/sample.jpg',
  ];


  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
    setFileName(URL.createObjectURL(event.target.files[0]));
  };
  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const ImageDisplay = ({ imageList }) => {
    return (
      <div>
        {imageList.map((imageUrl, index) => (
          <img key={index} src={imageUrl} className = 'images-popup' alt={`Image ${index}`} />
        ))}
      </div>
    );
  };

  const ImagePaths = ({ checkitems }) => {
    console.log(checked)
  }
  const handleButtonClick = async () => {
    console.log("Heyy")
    //const label_val = checked[0]
    //console.log(label_val)
    //console.log(ResponseData.det_imgs_path[label_val])
    const validIndices = checked.filter((index) => index in ResponseData.det_imgs_path);
    const merged_checks = validIndices.flatMap((index) => ResponseData.det_imgs_path[index]);
    const merged_checks_url = merged_checks.flatMap((index) => baseimgURL + index)
    console.log(validIndices)
    console.log(checked)
    // const merged_checks = checked.flatMap((index) => ResponseData.det_imgs_path[index]);
    console.log(merged_checks_url);
    setShowImages(true);
    console.log(xtype(merged_checks_url))
    console.log(xtype(imageList))
    console.log(showImages)
    setMerged_checks_url(merged_checks_url)
  };

  const getDetImgsValuesForLabels = (labels) => {
    console.log(labels)
    for (let i = 0; i < checked.length; i++) {
      merged_checks = [...merged_checks,...ResponseData.det_imgs_path[checked[i]]];
     }
    console.log(merged_checks)
    // const validLabels = labels.filter(label => completeData.det_imgs_path[label]);
    // const values = labels.flatMap(label => completeData.det_imgs_path[label]);
    // console.log(values)
    return merged_checks;
  }

  const detectedImages = async () => {
    console.log("Detect Images")
    // console.log(checked)
    const values = getDetImgsValuesForLabels(checked);
    setDetImgsValues(values);
    console.log(setDetImgsValues)
  };
  


  const handleUpload = async () => {
    try {
      console.log("Uploaded Image")
      const formData = new FormData();
      formData.append('file', file);

      const response = await instance.post('/ecc/uploadfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const processImage = async () => {
      try {
        console.log("Process Image")
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('http://localhost:8000/ecc/uploadfile/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const resp = await JSON.parse(JSON.stringify(response));
        console.log('Data from backend :', resp.data);
        setResponseData(resp.data.data)
        setCheckList(Object.values(resp.data.data.labels))
        console.log(checkList)
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    setCheckListVisible(!isCheckListVisible);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await  axios.post('http://localhost:5001/ecc/get_labels', {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         }
  //       });

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch data');
  //       }

  //       const data = await response.json();
  //       console.log('Data from backend:', data);
  //       setCheckList(data.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error.message);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
          fileName && (
            <div className='input-image-container'>
              <div>
                <img src={fileName} alt="input_image" className='input-image' />
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
                        
                          <button onClick={handleButtonClick}>Detect Images</button>
                          {/* {showImages &&  <div >
                                    <div className='image-popup'>
                                    {showImages && <ImageDisplay imageList={merged_checks_url} />}
                                    </div>
                                    
                                </div>} */}
                          <Popup trigger=
                          {<button>Show PopUp Images</button>}
                          modal nested>
                          {
                            close => (
                                <div >
                                    <div className='images_popup'>
                                    {showImages && <ImageDisplay imageList={merged_checks_url} />}
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


// // // import React, { useState } from 'react';

// // // function App() {
// // //   const [file, setFile] = useState(null);
// // //   const [outputPath, setOutputPath] = useState(null);

// // //   const handleFileChange = (event) => {
// // //     const selectedFile = event.target.files[0];
// // //     setFile(selectedFile);
// // //   };

// // //   const handleFileUpload = async () => {
// // //     const formData = new FormData();
// // //     formData.append('file', file);

// // //     try {
// // //       const response = await fetch('http://localhost:8000/uploadfile/', {
// // //         method: 'POST',
// // //         body: formData,
// // //       });

// // //       const result = await response.json();
// // //       console.log(result.output);
// // //       setOutputPath(result.output);
// // //     } catch (error) {
// // //       console.error('Error uploading file:', error);
// // //     }
// // //   };

// // //   const handleDownload = async () => {
// // //     // Trigger download for the processed file
// // //     window.open(`http://localhost:8000/download/sample_out_det.jpg`, '_blank');
// // //   };

// // //   return (
// // //     <div>
// // //       <input type="file" onChange={handleFileChange} />
// // //       <button onClick={handleFileUpload}>Upload and Process</button>

// // //       {outputPath && (
// // //         <div>
// // //           <p>Processed Image:</p>
// // //           <img src={`http://localhost:8000${outputPath}`} alt="Processed" />
// // //           <button onClick={handleDownload}>Download Processed Image</button>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default App;


// // // // import React, { useState } from 'react';
// // // // import axios from 'axios';

// // // // function App() {
// // // //   const [file, setFile] = useState(null);
// // // //   const [outputPath, setOutputPath] = useState(null);

// // // //   const handleFileChange = (event) => {
// // // //     setFile(event.target.files[0]);
// // // //   };

// // // //   const handleFileUpload = async () => {
// // // //     const formData = new FormData();
// // // //     formData.append('file', file);

// // // //     try {
// // // //       const response = await axios.post('http://localhost:8000/uploadfile/', formData, {
// // // //         headers: {
// // // //           'Content-Type': 'multipart/form-data',
// // // //         },
// // // //       });

// // // //       const { output } = response.data;
// // // //       setOutputPath(output);
// // // //       console.log()
// // // //     } catch (error) {
// // // //       console.error('Error uploading file:', error);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <input type="file" onChange={handleFileChange} />
// // // //       <button onClick={handleFileUpload}>Upload and Process</button>

// // // //       {outputPath && (
// // // //         <div>
// // // //           <p>Output Image:</p>
// // // //           <img src={`http://localhost:8000${outputPath}`} alt="Output" />
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // export default App;











// // import React, { useState, useEffect, Component   } from 'react';
// // import axios from 'axios';
// // import TitleBar from './titlebar';
// // import './style.css'; 
// // import Popup from 'reactjs-popup';
// // import 'reactjs-popup/dist/index.css';
// // import xtype from 'xtypejs'


// // import sample_out_det from "./images/sample_out_det.jpg";
// // import sample_out_mask from "./images/sample_out_mask.jpg";


// // function App() {

// //   const [file, setFile] = useState();
// //   const [result, setResult] = useState(null);
// //   const [task, setSelectedOption] = useState(null);
// //   const [isCheckListVisible, setCheckListVisible] = useState(false);
// //   const [checked, setChecked] = useState([]);
// //   const [checkList, setCheckList] = useState([]);
// //   const [fileName, setFileName] = useState(null);

// //   const handleFileChange = (event) => {
// //     console.log(event.target.files[0]);
// //     setFile(event.target.files[0]);
// //     setFileName(URL.createObjectURL(event.target.files[0]));
// //   };
// //   const handleDropdownChange = (event) => {
// //     setSelectedOption(event.target.value);
// //   };


// //   const handleUpload = async () => {
// //     try {
// //       console.log("Uploaded Image")
// //       const formData = new FormData();
// //       formData.append('file', file);

// //       const response = await axios.post('http://localhost:3003/uploadfile/', formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //         },
// //       });
// //       console.log(response.data.output)
// //       setResult(response.data.output);
// //     } catch (error) {
// //       console.error('Error uploading file:', error);
// //     }
// //   };

// //   const processImage = async () => {
// //     try {
// //       console.log("Process Image")
// //       const formData = new FormData();
// //       formData.append('file', file);
// //       // setCheckList(["Car", "Person", "Zebra", "Lights"]);
// //       const response = await axios.post('http://localhost:8000/ecc/uploadfile/', formData, {
// //           headers: {
// //             'Content-Type': 'application/json',
// //           }
// //         });
// //       const resp = await JSON.parse(JSON.stringify(response));
// //       console.log('Data from backend :', resp.data);
// //       setCheckList(Object.values(resp.data.data.labels))

// //     } catch (error) {
// //       console.error('Error uploading file:', error);
// //     }
// //     setCheckListVisible(!isCheckListVisible);
// //   };

// //   const detectedImages = async () => {
// //     try {
// //       console.log("Detected Images")
// //       const response = await axios.post('http://localhost:8000/ecc/get_image', {}, {
// //           headers: {
// //             'Content-Type': 'application/json',
// //           }
// //         });
// //         console.log(response.data.data)
// //         var blobURL = URL.createObjectURL(response.data.data);
// //         var image = document.getElementById("detImage");
// //         image.onload = function(){
// //             URL.revokeObjectURL(this.src); // release the blob URL once the image is loaded
// //         }
// //         image.src = blobURL;

// //     } catch (error) {
// //       console.error('Error uploading file:', error);
// //     }
// //   };

// //   const handleCheck = (event) => {
// //     const updatedList = event.target.checked
// //       ? [...checked, event.target.value]
// //       : checked.filter((item) => item !== event.target.value);
// //     setChecked(updatedList);
// //   };
// //   const checkedItems = checked.length ? checked.join(', ') : '';

// //   // Return classes based on whether item is checked
// //   const isChecked = (item) => (checked.includes(item) ? 'checked-item' : 'not-checked-item');

// //   const [dialog, setDialog] = useState(false);
// //   const [imageSrc, setImageSrc] = useState(
// //     "src/images/sample_out_det.jpg"
// //   );
// //   const toggleDialog = () => {
// //     setDialog(!dialog);
// //   };

// //   return (
// //     <div>
// //       <div>
// //       <TitleBar title="Image Segmentation" />
// //       <div className='file-upload-container'>
// //         <label htmlFor='fileInput' className='custom-file-upload'>
// //           Upload Your Input Image
// //         </label>
// //         <input id = "inp_img" type="file" onChange={handleFileChange} className='input-file'/>
// //         {
// //           fileName && (
// //             <div className='input-image-container'>
// //               <div>
// //                 <img src={fileName} alt="input_image" className='input-image' />
// //               </div>

// //               <div className="task-box">
// //                 <div className="task-info-box">
// //                   <p>Choose the required operation:</p>
// //                 </div>

// //                 <div className="dropdown-container">
// //                   <label htmlFor="dropdown"></label>
// //                   <select id="dropdown" value={task} onChange={handleDropdownChange}>
// //                     <option value="">Select an option</option>
// //                     <option value="Option 1">Detect all objects</option>
// //                     <option value="Option 2">Option 2</option>
// //                     <option value="Option 3">Option 3</option>
// //                   </select>
// //                 </div>
// //                 {task && (
// //                 <div>
// //                   <button onClick={processImage}>Process</button>
// //                   {isCheckListVisible && (
// //                     <div>
// //                       <h3>Identified Labels</h3>
// //                       <div className="list-container">
// //                         {checkList.map((item, index) => (
// //                           <div key={index}>
// //                             <input value={item} type="checkbox" onChange={handleCheck} />
// //                             <span className={isChecked(item)}>{item}</span>
// //                           </div>
// //                         ))}
// //                       </div>
// //                       <div>
// //                         {`Selected Labels are: ${checkedItems}`}
// //                       </div>
// //                       <div>
// //                         <Popup trigger=
// //                           {<button onClick={detectedImages}>Show Detected Images</button>}
// //                           modal nested>
// //                           {
// //                             close => (
// //                                 <div >
// //                                     <div className='image-popup'>
// //                                     <img id="myImage" src="" />
// //                                     </div>
// //                                     <div>
// //                                         <button className='button_popup'
// //                                         onClick={() => close() }>Close</button>
// //                                     </div>
// //                                 </div>
// //                             )
// //                           }
// //                         </Popup>
// //                       </div>
// //                     </div>)}

// //                 </div>)}

// //               </div>

// //             </div>
// //           )
// //         }
// //         </div>
// //     </div>

// //       {/* <button onClick={handleUpload}>Upload and process</button>
// //       {result && (
// //         <div>
// //           <img src={sample_out_det} alt="Cropped Object" />
// //           <img src={sample_out_mask} alt="Masked Object" />
// //         </div>
// //       )} */}
      
// //     </div>
// //   );
// // }

// // export default App;

