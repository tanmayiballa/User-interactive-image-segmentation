import React, { useState } from 'react';
import axios from 'axios';

import sample_out_det from "./images/sample_out_det.jpg";
import sample_out_mask from "./images/sample_out_mask.jpg";


function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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

  return (
    <div>
      <h1>Image Processing App</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Process</button>
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
