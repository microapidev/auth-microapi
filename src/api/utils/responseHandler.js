export default (res, status, data) => {
  res.status(status).json({
    data,
    status: "success",
  });
};
