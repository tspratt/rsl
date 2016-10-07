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
		email: String,
		role: {
			type: Schema.ObjectId,
			ref: 'Role'
		},
		permissions: [String]
	}, {collection: 'persons'})
			.plugin(deepPopulate, {}),
	Member: new Schema({
		llcName: String,
		branch: {
			type: Schema.ObjectId,
			ref: 'Branch'
		},
		share: Number,
		defaultroom: Schema.ObjectId,
		order: Number,
		abr2: String,
		abr3: String
	}, {collection: 'members'})
			.plugin(deepPopulate, {}),
	User: new Schema({
		person: {type: Schema.ObjectId, ref: 'Person'},
		userid: String,
		passwordHash: String,
		salt: String
	}, {collection: 'users'})
			.plugin(deepPopulate, {}),
	Branch: new Schema({
		branchname: String,
		parentid: Schema.ObjectId,
		share: Number,
		unit: String
	}, {collection: 'branches'}),
	Property: new Schema({
		name: String,
		description: String,
		capacity: Number,
		expandable: Number,
		images: [String]
	}, {collection: 'properties'}),
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
	}, {collection: 'units'})
			.plugin(deepPopulate, {}),
	Room: new Schema({
		number: String,
		unitid: Schema.ObjectId,
		unit: String,
		description: String,
		capacity: Number,
		expandable: Number,
		displayName: String,
		images: [String]
	}, {collection: 'rooms'}),
	Booking: new Schema({
		member: {type: Schema.ObjectId, ref: 'Member'},
		room: {type: Schema.ObjectId, ref: 'Room'},
		who: [{type: Schema.ObjectId, ref: 'Person'}],
		whoCount: Number,
		guestCount: Number,
		guestRoomRequestCount: Number,
		guestRoomConfirmCount: Number,
		arrive: Date,
		depart: Date,
		note: String
	}, {collection: 'bookings'})
			.plugin(deepPopulate, {}),
	Residence: new Schema({
		index: Number,
		dt: Date,
		sDt: String,
		daySectionIndex: Number,
		daySection: {
			hour: Number,
			minute: Number,
			second: Number,
			millisecond: Number,
			lclabel: String,
			index: Number
		},
		members: [
			{
				residenceType: String,
				bookingid: {type: Schema.ObjectId},
				member: {type: Schema.ObjectId, ref: 'Member'}
			}
		],
		rooms: [
			{
				residenceType: String,
				bookingid: {type: Schema.ObjectId},
				room: {type: Schema.ObjectId, ref: 'Room'}
			}
		]
	}, {collection: 'residenceSchedule'})
			.plugin(deepPopulate, {}),
	Role: new Schema({
		name: String,
		permissions: [String]
	}, {collection: 'roles'}),
	Permission: new Schema({
		name: String,
		label: String,
		action: String,
		context: String
	}, {collection: 'permissions'})

};

exports.mgSchema = mgSchema;