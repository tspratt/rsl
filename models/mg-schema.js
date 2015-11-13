/**
 * Created by Tracy on 11/12/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mgSchema = {
	persons: new Schema({
		firstname: String,
		lastname: String,
		member: {
			type: Schema.ObjectId,
			ref: 'members'
		},
		memberrelationship: String,
		parent: {
			firstname: String,
			lastname: String
		},
		address: String,
		phone: String,
		email: String
	}),
	members: new Schema({
		llcName: String,
		branch: {
			type: Schema.ObjectId,
			ref: 'branches'
		},
		share: Number
	}),
	branches: new Schema({
		branchname: String,
		parentid: String,
		share: Number
	})

};

exports.mgSchema = mgSchema;