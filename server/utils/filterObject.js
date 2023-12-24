const filterObject = (object, ...acceptFields) => {
  let clonedObj = JSON.parse(JSON.stringify(object));

  Object.keys(clonedObj).map((el) => {
    if (!acceptFields.includes(el)) delete clonedObj[el];
  });

  return clonedObj;
};

module.exports = filterObject;
