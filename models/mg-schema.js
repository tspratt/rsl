/**
 * Created by Tracy on 11/12/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var mgSchema = {
	Person: new Schema({
		firstname: String,
		lastname: String,
		memberid: Schema.ObjectId,
		member: {
			type: Schema.ObjectId,
			ref: 'Member'
		},
		memberrelationship: String,
		parent: {
			firstname: String,
			lastname: String
		},
		address: String,
		phone: String,
		email: String
	},{collection: 'persons'})
			.plugin(deepPopulate, {}),
	Member: new Schema({
		llcName: String,
		branch: {
			type: Schema.ObjectId,
			ref: 'Branch'
		},
		share: Number,
		defaultroom: Schema.ObjectId
	},{collection: 'members'})
			.plugin(deepPopulate, {}),
	User: new Schema ({
		person: {type: Schema.ObjectId, ref: 'Person'},
		userid: String,
		passwordHash: String,
		salt: String
	},{collection: 'users'})
			.plugin(deepPopulate, {}),
	Branch: new Schema({
		branchname: String,
		parentid: Schema.ObjectId,
		share: Number,
		unit: String
	},{collection: 'branches'}),
	Property: new Schema({
		name: String,
		description: String,
		capacity: Number,
		expandable: Number,
		images: [String]
	},{collection: 'properties'}),
	Unit: new Schema({
		property: String,
		number: String,
		description: String,
		capacity: Number,
		expandable: Number,
		branchid: Schema.ObjectId,
		branch: {
			type: Schema.ObjectId,
			ref: 'Branch'
		},
		images: [String]
	},{collection: 'units'})
			.plugin(deepPopulate, {}),
	Room: new Schema ({
		number: String,
		unitid: Schema.ObjectId,
		unit: String,
		description: String,
		capacity: Number,
		expandable: Number,
		displayName: String,
		images: [String]
	},{collection: 'rooms'}),
	Booking: new Schema({
		member: Schema.ObjectId,
		room: Schema.ObjectId,
		residents: [{type: Schema.ObjectId, ref: 'Person'}],
		residentCount: Number,
		arrive: Date,
		depart: Date
	},{collection: 'bookings'})
			.plugin(deepPopulate, {})

};

exports.mgSchema = mgSchema;