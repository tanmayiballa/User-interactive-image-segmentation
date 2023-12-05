import React, { useState } from 'react';
import axios from 'axios';
import TitleBar from './titlebar';
import './style.css'; 


import sample_out_det from "./images/sample_out_det.jpg";
import sample_out_mask from "./images/sample_out_mask.jpg";


function App() {
  const [file, setFile] = useState();
  const [result, setResult] = useState(null);
  const [task, setSelectedOption] = useState(null);
  
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
                    <option value="Option 1">Detect all objects</option>
                    <option value="Option 2">Option 2</option>
                    <option value="Option 3">Option 3</option>
                  </select>
                </div>

                {task && <button onClick={processImage}>Process</button>} 
                

              </div>

            </div>
          )
        }


      
        
        </div>
      

      
    </div>

      {result && (
        <div>
          <img src={sample_out_det} alt="Cropped Object" />
          <img src={sample_out_mask} alt="Masked Object" />
        </div>
      )}
      
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
