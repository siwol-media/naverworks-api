export const getBase64 = (object: Object) => {
  return Buffer.from(JSON.stringify(object)).toString("base64").replace(/=+$/, "");;
};
