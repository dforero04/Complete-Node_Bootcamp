// This function replaces all the placeholders in our template-card with the actual values from the data
// Returns the final string value for each product object
module.exports = (tempCard, product) => {
  let output = tempCard.replace(/{%PRODUCT_ID%}/g, product.id);
  output = output.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%PRODUCT_IMAGE%}/g, product.image);
  output = output.replace(/{%PRODUCT_FROM%}/gi, product.from);
  output = output.replace(/{%PRODUCT_NUTRIENT%}/g, product.nutrients);
  output = output.replace(/{%PRODUCT_QTY%}/g, product.quantity);
  output = output.replace(/{%PRODUCT_PRICE%}/g, product.price);
  if(!product.organic) output = output.replace(/{%PRODUCT_NOT_ORGANIC%}/g, 'not-organic');
  output = output.replace(/{%PRODUCT_DESC%}/g, product.description);

  return output;
}