/* eslint-disable arrow-body-style */
const catchAsync = fn => {
	return (req, res, next) => {
		fn(req, res, next).catch(err => next(err));
	};	
};

export default catchAsync;

// This function catches all error from aysnc functions 