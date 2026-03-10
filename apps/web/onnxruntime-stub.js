const unavailable = () => {
  throw new Error("onnxruntime-node is not available");
};

module.exports = {
  InferenceSession: {
    create: unavailable,
  },
  Tensor: unavailable,
  env: {},
};
