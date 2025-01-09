const sanitizeInput = (data) => {
    const sanitizedData = {};
    for (const key in data) {
      if (typeof data[key] === 'string') {
        sanitizedData[key] = data[key].trim();
      } else {
        sanitizedData[key] = data[key];
      }
    }
    return sanitizedData;
  };
  
  module.exports = { sanitizeInput };