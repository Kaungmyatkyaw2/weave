class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryStr = { ...this.queryString };

    const toRemoveFields = ["limit", "sort", "page", "search", "fields"];

    toRemoveFields.map((el) => {
      delete queryStr[el];
    });

    if (queryStr) {
      const forMattedQueryStr = JSON.stringify(queryStr).replace(
        /\b(lte|gte|lt|gt)/,
        (matched) => `$` + matched
      );

      queryStr = JSON.parse(forMattedQueryStr);

      console.log(queryStr);

      this.query.find(queryStr);
    }

    return this;
  }

  sort() {
    let sort = this.queryString.sort;
    if (sort) {
      let sortStr = sort.replace(/,/g, " ");
      this.query.sortStr(sortStr);
    } else {
      this.query.sort("-createdAt");
    }
    return this;
  }

  select() {
    let fields = this.queryString?.fields;

    if (fields) {
      let selectStr = fields.replace(/,/g, " ");
      this.query.select(selectStr);
    }

    return this;
  }

  paginate() {
    let limit = +this.queryString?.limit || 100;
    let page = +this.queryString?.page || 1;

    this.query.skip(limit * (page - 1)).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
