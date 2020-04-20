const advanceResults = (model, populate) => async (req, res, next) => {

    //copied req.query
    const reqQuery = {
        ...req.query
    };

    //remove select
    const removeField = ['select', 'sort', 'page', 'limit'];

    //loop over params and remove 'select' or etc
    removeField.forEach(param => delete reqQuery[param]);

    //create query string
    let queryStr = JSON.stringify(reqQuery);

    //attach the $ sign before gt,gte,lt,lte
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = model.find(JSON.parse(queryStr));

    if (populate) {
        query.populate(populate);
    }

    //select fields
    if (req.query.select) {
        const field = req.query.select.split(',').join(' ');
        query = query.select(field);
    }
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = await query.skip(startIndex).limit(limit);



    //run query
    const results = await query;

    //pagnitation
    const pagination = {};

    if (endIndex < total) {
        pagination.naxt = {
            page: page + 1,
            limit: limit
        }

    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit: limit
        }

    }
    res.advanceResults = {
        success: true,
        count: results.length,
        pagination,
        data: results

    }
    next();
}


module.exports = advanceResults;