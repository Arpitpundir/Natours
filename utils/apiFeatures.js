class ApiFeatures {
    constructor(query, queryString) {
        console.log("consStr");
        this.query = query;
        this.queryString = queryString;
        console.log("jiloop");
    }

    filter() {
        console.log("filtt");
        let queryObj = {
            ...this.queryString
        };
        let excludedFields = ['sort', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        console.log(queryObj);
        let queryString = JSON.stringify(queryObj);
        console.log(queryString);
        queryString = queryString.replace(
            /\b(lte|lt|gte|gt)\b/g,
            match => `$${match}`
        );
        console.log(queryString);
        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }

    sort() {
        console.log("sortSt");
        if (this.queryString.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            this.query.sort(sortBy);
        } else {
            this.query.sort('-createBy');
        }
        return this;
    }

    limitFields() {
        console.log("limSt");
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query.select(fields);
        }
        return this;
    }

    paginate() {
        //console.log("jkl");
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        //console.log(skip);
        //console.log(this.queryString.limit);
        this.query = this.query.skip(skip).limit(limit);
        //console.log("pagMed");
        if (this.queryString.page) {
            const numTours = Tour.countDocuments();
            if (numTours >= skip) {
                //  console.log("error");
                throw new Error('This page does not exist');
            }
        }
        //console.log("pagEnd");
        return this;
    }
}

module.exports = ApiFeatures;

