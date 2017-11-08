

module.exports = function(fn, perpage){
	perpage = perpage || 10;
	return function(req, res, next){
         var pageParam=req.param("page");
         var curPageNo = Math.max(parseInt( pageParam || '1',10),1) - 1;
         fn(function(err,totalCount){
              if (err){
                  return next(err);
              }

              req.pagerObj = res.locals.pagerObj = {
                       currentPageNum: curPageNo,
                       perpage: perpage,
                       startIndex: curPageNo * perpage,
                       endIndex: curPageNo * perpage + perpage -1,
                       totalCount: totalCount,
                       totalPageCount: Math.ceil(totalCount/perpage)  
              };

              next();
         });
	};
};