const advanceResult = (model, populate) => async (req, res, next) => {
  let query;

  //copy queryStr to queryReq

  const queryReq = { ...req.query };

  console.log(req.query);

  //field to remove

  const removeField = ['select', 'sort', 'limit', 'page'];

  //loop removefields to deleted

  removeField.forEach((params) => delete queryReq[params]);

  //create query string
  let queryStr = JSON.stringify(queryReq);

  //crete operaters like gt,gte,lt,lte and in

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //finding resource

  query = model.find(JSON.parse(queryStr)).populate('courses');

  //select request
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //sort
  if (req.query.sort) {
    const fields = req.query.sort.split(',').join(' ');
    query = query.sort(fields);
  } else {
    query = query.sort('-createdAt');
  }

  //pagination

  const page = parseInt(req.query.page, 10) || 1;

  const limit = parseInt(req.query.limit, 10) || 25;

  const startIndex = (page - 1) * limit;

  const endIndex = page * limit;

  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //pagination query

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  if (populate) {
    query = query.populate(populate);
  }

  const result = await query;

  res.advanceResult = {
    success: true,
    count: result.length,
    pagination,
    data: result,
  };
  next();
};

module.exports = advanceResult;
