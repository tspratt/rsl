/**
 * Created by Tracy on 11/12/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
	},{collection: 'persons'}),
	Member: new Schema({
		llcName: String,
		branch: {
			type: Schema.ObjectId,
			ref: 'Branch'
		},
		share: Number
	},{collection: 'members'}),
	User: new Schema ({
		userid: String,
		passwordHash: String,
		salt: String
	}),
	Branch: new Schema({
		branchname: String,
		parentid: Schema.ObjectId,
		share: Number
	},{collection: 'branches'}),
	Property: new Schema(),
	Unit: new Schema({
		branchid: Schema.ObjectId,
		number: String,
		name: String
	}),
	Room: new Schema ({
		number: String,
		unitid: Schema.ObjectId,
		capacity: Number,
		expandable: Number,
		displayName: String
	},{collection: 'rooms'}),
	Booking: new Schema({
		memberid: Schema.ObjectId,
		roomid: Schema.ObjectId,
		residents: [{type: Schema.ObjectId, ref: 'Person'}],
		residentCount: Number,
		arrive: Date,
		depart: Date
	},{collection: 'bookings'})

};

exports.mgSchema = mgSchema;