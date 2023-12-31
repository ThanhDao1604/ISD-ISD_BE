const {
    products: ProductsModels,
} = require('../models/utils/connectToModels');
const {
    promiseResolve, generatorTime, convertToObjectId, promiseReject,
    populateModel, isEmpty, regExpSearch,
} = require('../utils/shared');
const { IS_DELETED, DEFAULT_PAGE, DEFAULT_LIMIT } = require('../utils/constants');
const list = async (data) => {
    try {
        const search = data.search ? data.search : '';
        const category = data.category ? data.category : '';
        const page = data.page ? data.page : DEFAULT_PAGE;
        const limit = 9;
        const sortKey = data.sortKey ? data.sortKey : 'title';
        const sortOrder = data.sortOrder ? data.sortOrder : 1;
        const conditions = {
            isDeleted: IS_DELETED[200],
        };
        if (search) {
            const regex = regExpSearch(search);
            conditions.productName = regex;
        }
        if (category && category !== 'All') {
            conditions.category = category;
        }
        const myCustomLabels = {
            totalDocs: 'itemCount',
            docs: 'items',
            limit: 'limit',
            page: 'currentPage',
            nextPage: 'nextPage',
            prevPage: 'prevPage',
            totalPages: 'pageCount',
            pagingCounter: 'pagingCounter',
            meta: 'paginator',
        };
        const fields = '-order -isDeleted';
        const populate = [
        ];
        const options = {
            sort: {
                [sortKey]: sortOrder,
            },
            page: page,
            limit: limit,
            lean: true,
            populate,
            select: fields,
            customLabels: myCustomLabels,
        };
        const result = ProductsModels.paginate(conditions, options);
        return promiseResolve(result);
    } catch (err) {
        return promiseReject(err);
    }
}
const create = async (data) => {
    try {
        const set = {};
        set.productName = data.productName;
        set.category = data.category;
        set.description = data.description;
        set.price = data.price;
        set.image = data.image;
        set.isDeleted = IS_DELETED[200];
        const result = await ProductsModels.create(set);
        return promiseResolve(result);
    } catch (err) {
        return promiseReject(err);
    }
};
const update = async (data) => {
    try {
        const set = {};
        const conditions = {
            isDeleted: IS_DELETED[200],
            _id: convertToObjectId(data.productObjId),
        };
        if (data?.productName) {
            set.productName = data.productName;
        }
        if (data?.category) {
            set.category = data.category;
        }
        if (data?.description) {
            set.description = data.description;
        }
        if (data?.price) {
            set.price = data.price;
        }
        const result = await ProductsModels.findOneAndUpdate(conditions, set, { new: true });
        return promiseResolve(result);
    } catch (err) {
        return promiseReject(err);
    }
};
const findByConditions = async (data) => {
    try {
        const conditions = {};
        if (data?.productObjId) {
            conditions._id = convertToObjectId(data.productObjId);
        }
        conditions.isDeleted = IS_DELETED[200];
        const populate = [
            // populateModel('userObjId', '-password -expiresDate'),
        ];
        if (data?.getAll) {
            const result = await ProductsModels.find(conditions).populate(populate);
            return promiseResolve(result);
        }
        const result = await ProductsModels.findOne(conditions).populate(populate);
        return promiseResolve(result);
    } catch (err) {
        console.log(err, 'err')
        return promiseReject(err);
    }
};
const deleteConditions = async (data) => {
    try {
        const conditions = {};
        if (data?.postId) {
            conditions._id = convertToObjectId(data.postId);
        }
        if (data?.userObjId) {
            conditions.userObjId = convertToObjectId(data.userObjId);
        }
        const set = {
            isDeleted: IS_DELETED[300],
        };
        const result = await ProductsModels.updateMany(conditions, set);
        return promiseResolve(result);
    } catch (err) {
        return promiseReject(err);
    }
};
const updateDelete = async (data) => {
    try {
        const conditions = {};
        if (data?.productObjId) {
            conditions._id = convertToObjectId(data.productObjId);
        }
        const set = {
            isDeleted: IS_DELETED[300],
        };
        const result = await ProductsModels.findOneAndUpdate(conditions, set, { new: true });
        return promiseResolve(result);
    } catch (err) {
        return promiseReject(err);
    }
};
module.exports = {
    create,
    update,
    findByConditions,
    deleteConditions,
    updateDelete,
    list,
};
