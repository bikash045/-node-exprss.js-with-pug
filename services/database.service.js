const mongo = require("mongoose");
const companySchema = require("../model/company.model");
const userSchema = require("../model/user.model");
const clientSchema = require("../model/clients.model");

const schemaList = {
  company: companySchema,
  user: userSchema,
  client: clientSchema
}

const url = "mongodb+srv://wap:5LlrvjwZed166WhX@cluster0.5sqsr.mongodb.net/frontwap?retryWrites=true&w=majority";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};
mongo.connect(url,options);

const createRecord = async (data,schema)=>{
  const currentSchema = schemaList[schema];
  const collection = new currentSchema(data);
  const dataRes = await collection.save();
  return dataRes;
}

const getRecordByQuery = async (query,schema)=>{
  const currentSchema = schemaList[schema];
  const dataRes = await currentSchema.find(query);
  return dataRes;
}

const updateByQuery = async (query,schema,data)=>{
  const currentSchema = schemaList[schema];
  const dataRes = await currentSchema.updateOne(query,data);
  return dataRes;
}

const countData = async (schema)=>{
  const currentSchema = schemaList[schema];
  const dataRes = await currentSchema.countDocuments();
  return dataRes;
}

const paginate = async (query,from,to,schema)=>{
  const currentSchema = schemaList[schema];
  const dataRes = await currentSchema.find(query).skip(from).limit(to);
  return dataRes;
}

const deleteById = async (id,schema)=>{
  const currentSchema = schemaList[schema];
  const dataRes = await currentSchema.findByIdAndDelete(id);
  return dataRes;
}

const updateById = async (id,data,schema)=>{
  const currentSchema = schemaList[schema];
  const dataRes = await currentSchema.findByIdAndUpdate(id,data,{new:true});
  return dataRes;
}

module.exports = {
  createRecord: createRecord,
  getRecordByQuery: getRecordByQuery,
  updateByQuery: updateByQuery,
  countData: countData,
  paginate: paginate,
  deleteById: deleteById,
  updateById: updateById
}
